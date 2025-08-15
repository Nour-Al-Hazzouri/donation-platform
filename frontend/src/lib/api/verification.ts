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
  document_image: File;
}

export interface VerificationResponse {
  message: string;
  verification: {
    id: number;
    user_id: number;
    document_type: string;
    image_urls: string[];
    status: 'pending' | 'approved' | 'rejected';
    notes?: string;
    verified_at?: string;
    created_at: string;
    updated_at: string;
  };
}

const verificationService = {
  // Submit verification documents
  submitVerification: async (data: VerificationSubmitData): Promise<VerificationResponse> => {
    const formData = new FormData();
    formData.append('document_type', data.document_type);
    formData.append('document_image', data.document_image);
    
    const response = await verificationApi.post('/verifications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
  
  // Get verification status
  getVerificationStatus: async (): Promise<VerificationResponse> => {
    const response = await verificationApi.get('/verifications/status');
    return response.data;
  },
};

export default verificationService;