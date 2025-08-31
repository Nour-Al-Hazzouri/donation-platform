import { create } from 'zustand'
import { persist, PersistOptions } from 'zustand/middleware'
import { authService } from '@/lib/api/auth'
import { profileService, UpdateProfileData } from '@/lib/api/profile'
import Cookies from 'js-cookie'

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
  isAdmin?: boolean;
  location?: {
    id: number;
    governorate: string;
    district: string;
  } | null;
  balance: number; // Made required for consistency
  // Legacy fields for backward compatibility
  name?: string;
  verified?: boolean;
  verifiedAt?: string;
  profileImage?: string;
  gender?: string;
  phoneNumber?: string;
  governorate?: string;
  district?: string;
}

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (emailOrUserData: string | Omit<User, 'balance'>, password?: string) => Promise<void>;
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
  updateUserProfile: (profileData: unknown) => void;
  deductBalance: (amount: number) => void;
  clearError: () => void;
}

const persistOptions: PersistOptions<AuthState, Omit<AuthState, 'login' | 'register' | 'logout' | 'forgotPassword' | 'resetPassword' | 'updateVerification' | 'updateUserProfile' | 'deductBalance' | 'clearError' | 'isLoading' | 'error'>> = {
  name: 'auth-storage',
  partialize: (state) => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
  }),
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (emailOrUserData: string | Omit<User, 'balance'>, password?: string) => {
        // Handle legacy login (direct user object) for backward compatibility
        if (typeof emailOrUserData === 'object') {
          const userData = emailOrUserData;
          set({ 
            user: { ...userData, balance: 10000 } as User,
            isAuthenticated: true 
          });
          return;
        }

        // Handle new login with API
        const email = emailOrUserData;
        if (!password) {
          throw new Error('Password is required for email login');
        }

        set({ isLoading: true, error: null });
        try {
          const response = await authService.login({ email, password });

          const user: User = {
            ...response.user,
            token: response.access_token,
            isAdmin: response.isAdmin,
            balance: 10000,
          };

          // Save user in Zustand
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          // Create the auth storage state object
          const authState = { state: { user, isAuthenticated: true } };
          
          // Save in localStorage for client-side access
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth-storage', JSON.stringify(authState));
          }
          
          // Save user in cookie for server-side middleware
          Cookies.set('auth-storage', JSON.stringify(authState), {
            path: '/',
            expires: 7, // expires in 7 days
            sameSite: 'strict',
          });

        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to login. Please check your credentials.',
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
            balance: 10000, // Set initial balance
          };
          
          set({ 
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          
          // Create the auth storage state object
          const authState = { state: { user, isAuthenticated: true } };
          
          // Save in localStorage for client-side access
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth-storage', JSON.stringify(authState));
          }
          
          // Save user in cookie for server-side middleware
          Cookies.set('auth-storage', JSON.stringify(authState), {
            path: '/',
            expires: 7, // expires in 7 days
            sameSite: 'strict',
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
          
          // Clear localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-storage');
          }
          
          // Clear cookies
          Cookies.remove('auth-storage', { path: '/' });
        } catch (error: any) {
          console.error('Logout error:', error);
          // Even if the API call fails, we should still clear the local state
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: error.response?.data?.message || 'Failed to logout properly.'
          });
          
          // Clear localStorage and cookies even on error
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-storage');
          }
          
          // Clear cookies
          Cookies.remove('auth-storage', { path: '/' });
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
            verified, // Legacy field
            verifiedAt, // Legacy field
            email_verified_at: verifiedAt || state.user.email_verified_at 
          } : null
        })),
      
      updateUserProfile: async (profileData) => {
        try {
          set({ isLoading: true, error: null });
          
          // Call the profile service to update the profile
          const updatedProfile = await profileService.updateProfile(profileData as UpdateProfileData);
          
          // Update the local state with the new profile data
          set((state) => {
            if (!state.user) return state;
            
            const updatedUser = { ...state.user, ...updatedProfile };
            
            // Update localStorage
            const authState = { state: { user: updatedUser, isAuthenticated: true } };
            if (typeof window !== 'undefined') {
              localStorage.setItem('auth-storage', JSON.stringify(authState));
            }
            
            // Update cookies
            Cookies.set('auth-storage', JSON.stringify(authState), {
              path: '/',
              expires: 7,
              sameSite: 'strict',
            });
            
            return { user: updatedUser, isLoading: false };
          });
          
          return updatedProfile;
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to update profile';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },
      
      deductBalance: (amount) => {
        set((state) => {
          if (state.user) {
            const newBalance = state.user.balance - amount;
            const updatedUser = {
              ...state.user,
              balance: newBalance,
            };

            // Update localStorage and cookies
            const authState = { state: { user: updatedUser, isAuthenticated: true } };
            
            if (typeof window !== 'undefined') {
              localStorage.setItem('auth-storage', JSON.stringify(authState));
            }
            
            Cookies.set('auth-storage', JSON.stringify(authState), {
              path: '/',
              expires: 7,
              sameSite: 'strict',
            });

            return {
              user: updatedUser,
            };
          }
          return state;
        });
      },

      updateUser: (userData) => {
        set((state) => {
          if (!state.user) return state;
          
          const updatedUser = {
            ...state.user,
            ...userData
          };
          
          // Create the auth storage state object
          const authState = { state: { user: updatedUser, isAuthenticated: true } };
          
          // Save in localStorage for client-side access
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth-storage', JSON.stringify(authState));
          }
          
          // Save user in cookie for server-side middleware
          Cookies.set('auth-storage', JSON.stringify(authState), {
            path: '/',
            expires: 7, // expires in 7 days
            sameSite: 'strict',
          });
          
          return {
            user: updatedUser
          };
        });
      },
      
      clearError: () => set({ error: null }),
    }),
    persistOptions
  )
)