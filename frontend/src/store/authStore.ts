import { create } from 'zustand'
import { persist, PersistOptions } from 'zustand/middleware'
import { authService } from '@/lib/api/auth'

type User = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone?: string | null;
  avatar_url?: string | null;
  avatar_url_full?: string | null;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
  token: string;
  location?: {
    id: number;
    governorate: string;
    district: string;
  } | null;
  balance?: number; // For backward compatibility
}

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    phone?: string;
    password: string;
    password_confirmation: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (data: { email: string }) => Promise<{ message: string }>;
  resetPassword: (data: {
    code: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => Promise<{ message: string }>;
  updateVerification: (verified: boolean, verifiedAt?: string) => void;
  deductBalance: (amount: number) => void; // For backward compatibility
  clearError: () => void;
}

const persistOptions: PersistOptions<AuthState, Omit<AuthState, 'login' | 'register' | 'logout' | 'forgotPassword' | 'resetPassword' | 'updateVerification' | 'deductBalance' | 'clearError' | 'isLoading' | 'error'>> = {
  name: 'auth-storage',
  partialize: (state) => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
  }),
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login({ email, password });
          
          // Transform the API response to match our User type
          const user: User = {
            ...response.user,
            token: response.access_token,
            balance: 10000, // For backward compatibility
          };
          
          set({ 
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          console.error('Login error:', error);
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || 'Failed to login. Please check your credentials.'
          });
          throw error;
        }
      },
      
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(userData);
          
          // Transform the API response to match our User type
          const user: User = {
            ...response.user,
            token: response.access_token,
            balance: 10000, // For backward compatibility
          };
          
          set({ 
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          console.error('Registration error:', error);
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || 'Failed to register. Please try again.'
          });
          throw error;
        }
      },
      
      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await authService.logout();
          set({ user: null, isAuthenticated: false, isLoading: false });
        } catch (error: any) {
          console.error('Logout error:', error);
          // Even if the API call fails, we should still clear the local state
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: error.response?.data?.message || 'Failed to logout properly.'
          });
        }
      },
      
      forgotPassword: async (data: { email: string }) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.forgotPassword(data);
          set({ isLoading: false });
          return response;
        } catch (error: any) {
          console.error('Forgot password error:', error);
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || 'Failed to process forgot password request.'
          });
          throw error;
        }
      },
      
      resetPassword: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.resetPassword(data);
          set({ isLoading: false });
          return response;
        } catch (error: any) {
          console.error('Reset password error:', error);
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || 'Failed to reset password.'
          });
          throw error;
        }
      },
      
      updateVerification: (verified, verifiedAt) => 
        set((state) => ({
          user: state.user ? { 
            ...state.user, 
            email_verified_at: verifiedAt || state.user.email_verified_at 
          } : null
        })),
      
      deductBalance: (amount) => {
        set((state) => {
          if (state.user && state.user.balance) {
            const newBalance = state.user.balance - amount;
            return {
              user: {
                ...state.user,
                balance: newBalance,
              },
            };
          }
          return state;
        });
      },
      
      clearError: () => set({ error: null }),
    }),
    persistOptions
  )
)