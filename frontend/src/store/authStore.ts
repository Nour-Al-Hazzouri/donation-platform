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
  updateUserProfile: (profileData: UpdateProfileData) => unknown;
  deductBalance: (amount: number) => void;
  clearError: () => void;
}

const persistOptions: PersistOptions<AuthState, Omit<AuthState, 'login' | 'register' | 'logout' | 'forgotPassword' | 'resetPassword' | 'updateVerification' | 'updateUserProfile' | 'deductBalance' | 'clearError' | 'isLoading' | 'error'>> = {
  name: 'auth-storage',
  partialize: (state) => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
  }),
  // Ensure storage is synchronized across tabs/windows
  storage: {
    getItem: (name) => {
      if (typeof window === 'undefined') return null;
      const value = localStorage.getItem(name);
      // Also check cookies for SSR consistency
      const cookieValue = Cookies.get(name);
      const rawValue = value || cookieValue || null;
      
      // Parse the string value to return the expected object type
      if (rawValue) {
        try {
          return JSON.parse(rawValue);
        } catch (e) {
          console.error('Error parsing storage value:', e);
          return null;
        }
      }
      return null;
    },
    setItem: (name, value) => {
      if (typeof window !== 'undefined') {
        // Convert object to string before storing
        const stringValue = JSON.stringify(value);
        localStorage.setItem(name, stringValue);
        // Set cookie with same expiration as in other methods
        Cookies.set(name, stringValue, {
          path: '/',
          expires: 7,
          sameSite: 'strict',
        });
      }
    },
    removeItem: (name) => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(name);
        // Also remove from cookies for consistency
        Cookies.remove(name, { path: '/' });
      }
    },
  },
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (emailOrUserData: string | Omit<User, 'balance'>, password?: string) => {
        // Clear only session-specific profile data from previous sessions
        if (typeof window !== 'undefined') {
          // Clear profile-related sessionStorage items
          sessionStorage.removeItem('profile-data-backup');
          sessionStorage.removeItem('profile-data-before-save');
          sessionStorage.removeItem('current-user-session');
          
          // We no longer clear user location data from localStorage
          // This ensures location preferences persist across sessions
          console.log('Login: Preserving location data across sessions');
        }
        
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

          // Ensure location data is properly handled
          const user: User = {
            ...response.user,
            token: response.access_token,
            isAdmin: response.isAdmin,
            balance: 10000,
          };

          // Check if we have saved location data in localStorage for this user
          if (typeof window !== 'undefined' && user.id) {
            const userLocationKey = `userLocation_${user.id}`;
            const legacyLocationKey = `user_location_${user.id}`;
            
            try {
              const savedLocationStr = localStorage.getItem(userLocationKey) || localStorage.getItem(legacyLocationKey);
              if (savedLocationStr) {
                const savedLocation = JSON.parse(savedLocationStr);
                
                // Only use saved location if the user doesn't already have location data from the API
                // This ensures backend data takes priority over localStorage data
                if ((!user.location || user.location === null) && 
                    savedLocation && savedLocation.governorate && savedLocation.district) {
                  console.log('Using saved location from localStorage:', savedLocation);
                  // Update user object with location data from localStorage
                  user.location = {
                    id: 0, // We don't know the actual ID from localStorage
                    governorate: savedLocation.governorate,
                    district: savedLocation.district
                  };
                }
              }
            } catch (e) {
              console.error('Error parsing saved location:', e);
            }
          }

          // Save user in Zustand
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          // The persist middleware will handle saving to storage
          // No need for manual localStorage or Cookies operations here

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
          
          // The persist middleware will handle saving to storage
          // No need for manual localStorage or Cookies operations here
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
          // Get the current user ID before clearing state
          const userId = get().user?.id;
          
          // Save location data before logout to preserve it across sessions
          let savedLocation = null;
          if (typeof window !== 'undefined' && userId) {
            const userLocationKey = `userLocation_${userId}`;
            const legacyLocationKey = `user_location_${userId}`;
            
            try {
              const savedLocationStr = localStorage.getItem(userLocationKey) || localStorage.getItem(legacyLocationKey);
              if (savedLocationStr) {
                savedLocation = JSON.parse(savedLocationStr);
                console.log('Preserved location data before logout:', savedLocation);
              }
            } catch (e) {
              console.error('Error parsing saved location during logout:', e);
            }
          }
          
          await authService.logout();
          set({ user: null, isAuthenticated: false, isLoading: false });
          
          // The persist middleware will handle clearing auth-storage
          // But we need to manually clear other user-specific data
          if (typeof window !== 'undefined' && userId) {
            // Clear profile-related sessionStorage items
            sessionStorage.removeItem('profile-data-backup');
            sessionStorage.removeItem('profile-data-before-save');
            sessionStorage.removeItem('current-user-session');
            
            // DO NOT clear location data from localStorage to preserve it across sessions
            // Instead, clear other user-specific items
            
            // Clear any other potential user-specific items except location data
            Object.keys(localStorage).forEach(key => {
              if (key.includes(userId.toString()) && 
                  !key.includes('userLocation_') && 
                  !key.includes('user_location_')) {
                localStorage.removeItem(key);
              }
            });
            
            // Restore location data if it was saved
            if (savedLocation) {
              const userLocationKey = `userLocation_${userId}`;
              localStorage.setItem(userLocationKey, JSON.stringify(savedLocation));
            }
          }
        } catch (error: any) {
          console.error('Logout error:', error);
          // Even if the API call fails, we should still clear the local state
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: error.response?.data?.message || 'Failed to logout properly.'
          });
          
          // Clear session-specific data even on error, but preserve location data
          if (typeof window !== 'undefined') {
            // Clear profile-related sessionStorage items
            sessionStorage.removeItem('profile-data-backup');
            sessionStorage.removeItem('profile-data-before-save');
            sessionStorage.removeItem('current-user-session');
            
            // DO NOT clear location data from localStorage
            // This ensures location preferences persist across sessions even on error
            console.log('Logout error: Still preserving location data across sessions');
          }
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
      
      updateUserProfile: async (profileData: UpdateProfileData) => {
        try {
          set({ isLoading: true, error: null });
          const updatedProfile = await profileService.updateProfile(profileData);
          
          if (updatedProfile) {
            set((state) => {
              if (!state.user) return state;
              
              // Create a properly updated user object with all fields
              const updatedUser = { 
                ...state.user, 
                first_name: updatedProfile.first_name || state.user.first_name,
                last_name: updatedProfile.last_name || state.user.last_name,
                email: updatedProfile.email || state.user.email,
                phone: updatedProfile.phone || state.user.phone,
                // Handle location explicitly to ensure null values are properly handled
                // If location is null in the response, it means location was cleared
                // If location is explicitly provided in profileData, use that instead
                location: profileData.location !== undefined
                  ? profileData.location
                  : updatedProfile.location === null
                    ? null
                    : updatedProfile.location || state.user.location,
                avatar_url: updatedProfile.avatar_url,
                avatar_url_full: updatedProfile.avatar_url_full
                // Explicit fields to ensure they're properly updated
              };
              
              // The persist middleware will handle saving to storage
              // No need for manual localStorage or Cookies operations here
              
              return { user: updatedUser, isLoading: false };
            });
          }
          
          set({ isLoading: false });
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

      updateUser: (userData: Partial<User>) => {
        set((state) => {
          if (!state.user) return state;
          
          // Handle nested objects properly, especially location
          const updatedUser = {
            ...state.user,
            ...userData,
            // Handle location separately if it exists in userData
            location: userData.location ? {
              ...state.user.location,
              ...userData.location
            } : state.user.location
          };
          
          // The persist middleware will handle saving to storage
          // No need for manual localStorage or Cookies operations here
          
          // Still use sessionStorage for temporary session data if needed
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('current-user-session', JSON.stringify({
              lastUpdated: new Date().toISOString(),
              user: updatedUser
            }));
          }
          
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