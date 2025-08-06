import { create } from 'zustand'
import { persist, PersistOptions } from 'zustand/middleware'

type User = {
  id: string;
  name: string;
  email: string;
  verified: boolean;
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
  login: (user: User) => void;
  logout: () => void;
  updateVerification: (verified: boolean, verifiedAt?: string) => void;
}

const persistOptions: PersistOptions<AuthState, AuthState> = {
  name: 'auth-storage',
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateVerification: (verified, verifiedAt) => 
        set((state) => ({
          user: state.user ? { ...state.user, verified, verifiedAt } : null
        })),
    }),
    persistOptions
  )
)