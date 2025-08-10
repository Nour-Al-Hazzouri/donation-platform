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
  balance: number; // Added balance to user
}

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: Omit<User, 'balance'>) => void; // Modified login to accept user without balance initially
  logout: () => void;
  updateVerification: (verified: boolean, verifiedAt?: string) => void;
  deductBalance: (amount: number) => void; // Added deductBalance action
}

const persistOptions: PersistOptions<AuthState, AuthState> = {
  name: 'auth-storage',
  // The partialize function should return an object that matches the AuthState structure
  // but only includes the properties we want to persist.
  // We use a type assertion `as AuthState` to satisfy TypeScript,
  // as the functions are not meant to be serialized.
  partialize: (state) => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
  }) as AuthState, // Type assertion to satisfy the PersistOptions type
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: (userData) => set({ 
        user: { ...userData, balance: 10000 }, // Set initial balance to $10,000
        isAuthenticated: true 
      }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateVerification: (verified, verifiedAt) => 
        set((state) => ({
          user: state.user ? { ...state.user, verified, verifiedAt } : null
        })),
      deductBalance: (amount) => {
        set((state) => {
          if (state.user) {
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
    }),
    persistOptions
  )
)