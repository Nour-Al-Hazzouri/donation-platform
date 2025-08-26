import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

const verificationApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add a request interceptor to include the auth token in requests
verificationApi.interceptors.request.use(
  (config) => {
    // Get token from localStorage if it exists
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth-storage') : null;
    
    if (token) {
      try {
        const parsedToken = JSON.parse(token);
        if (parsedToken.state?.user?.token) {
          config.headers['Authorization'] = `Bearer ${parsedToken.state.user.token}`;
        }
      } catch (error) {
        console.error('Error parsing auth token:', error);
        
        // Try to get token from cookies as fallback
        if (typeof window !== 'undefined' && document.cookie) {
          const cookies = document.cookie.split(';');
          const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth-storage='));
          
          if (authCookie) {
            try {
              const cookieValue = decodeURIComponent(authCookie.split('=')[1]);
              const parsedCookie = JSON.parse(cookieValue);
              
              if (parsedCookie.state?.user?.token) {
                config.headers['Authorization'] = `Bearer ${parsedCookie.state.user.token}`;
              }
            } catch (cookieError) {
              console.error('Error parsing auth cookie:', cookieError);
            }
          }
        }
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface VerificationSubmitData {
  document_type: 'id_card' | 'passport' | 'driver_license';
  documents: File[];
}

export interface VerificationResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    user_id: number;
    document_type: string;
    image_urls: string[];
    image_full_urls?: string[];
    status: 'pending' | 'approved' | 'rejected';
    notes?: string;
    verified_at?: string;
    created_at: string;
    updated_at: string;
    user?: {
      id: number;
      first_name: string;
      last_name: string;
      username: string;
      email?: string;
      is_verified?: boolean;
    };
    verifier?: {
      id: number;
      first_name: string;
      last_name: string;
      username?: string;
    };
  };
}

export interface VerificationListResponse {
  success: boolean;
  message: string;
  data: Array<VerificationResponse['data']>;
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    to?: number;
  };
}

const verificationService = {
  // Submit verification documents
  submitVerification: async (data: VerificationSubmitData): Promise<VerificationResponse> => {
    const formData = new FormData();
    formData.append('document_type', data.document_type);
    
    // Append multiple documents
    data.documents.forEach((file, index) => {
      formData.append(`documents[${index}]`, file);
    });
    
    const response = await verificationApi.post('/verifications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
  
  // Get user's verification requests
  getUserVerifications: async (userId: number, perPage: number = 15): Promise<VerificationListResponse> => {
    const response = await verificationApi.get(`/users/${userId}/verifications`, {
      params: { per_page: perPage }
    });
    return response.data;
  },
  
  // Get a specific verification request
  getVerification: async (verificationId: number): Promise<VerificationResponse> => {
    const response = await verificationApi.get(`/verifications/${verificationId}`);
    return response.data;
  },
  
  // Admin: Get all verification requests
  getAllVerifications: async (params?: {
    perPage?: number;
    status?: 'pending' | 'approved' | 'rejected';
    query?: string;
  }): Promise<VerificationListResponse> => {
    const response = await verificationApi.get('/verifications', {
      params: {
        per_page: params?.perPage || 15,
        status: params?.status,
        query: params?.query
      }
    });
    return response.data;
  },
  
  // Admin: Update verification status
  updateVerificationStatus: async (
    verificationId: number,
    status: 'approved' | 'rejected',
    notes?: string
  ): Promise<VerificationResponse> => {
    const response = await verificationApi.put(
      `/verifications/${verificationId}/${status}`,
      notes ? { notes } : {}
    );
    return response.data;
  },
  
  // Delete verification request
  deleteVerification: async (verificationId: number): Promise<{success: boolean; message: string}> => {
    const response = await verificationApi.delete(`/verifications/${verificationId}`);
    return response.data;
  },
};

export default verificationService;