import { create } from 'zustand'
import { persist, PersistOptions } from 'zustand/middleware'

type User = {
  id: string
  name: string
  email: string
  verified: boolean
  phoneNumber: string
}

type AuthState = {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
}

type AuthPersist = {
  name: string
  storage?: Storage
}

const persistOptions: PersistOptions<AuthState, AuthState> = {
  name: 'auth-storage',
}

export const useAuthStore = create<AuthState>()(persist(
  (set) => ({
    user: null,
    isAuthenticated: false,
    login: (user) => set({ user, isAuthenticated: true }),
    logout: () => set({ user: null, isAuthenticated: false }),
  }),
  persistOptions
))