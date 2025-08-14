import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add a request interceptor to include the auth token in requests
authApi.interceptors.request.use(
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
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface RegisterData {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone?: string;
  password: string;
  password_confirmation: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  code: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  message: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    avatar_url: string | null;
    avatar_url_full: string | null;
    email: string;
    phone: string | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    location?: {
      id: number;
      governorate: string;
      district: string;
    } | null;
  };
  access_token: string;
  token_type: string;
  isAdmin: boolean;
}

const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await authApi.post('/auth/register', data);
    return response.data;
  },
  
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await authApi.post('/auth/login', data);
    return response.data;
  },
  
  logout: async (): Promise<{ message: string }> => {
    const response = await authApi.post('/auth/logout');
    return response.data;
  },
  
  forgotPassword: async (data: ForgotPasswordData): Promise<{ message: string }> => {
    const response = await authApi.post('/auth/forgot-password', data);
    return response.data;
  },
  
  resetPassword: async (data: ResetPasswordData): Promise<{ message: string }> => {
    const response = await authApi.post('/auth/reset-password', data);
    return response.data;
  },
  
  getCurrentUser: async (): Promise<{ id: number; first_name: string; last_name: string; username: string; email: string; }> => {
    const response = await authApi.get('/me');
    return response.data;
  },
};

export { authService };