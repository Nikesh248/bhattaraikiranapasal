
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  // Add other user properties as needed
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  signup: (userData: User) => void; // Signup might just log the user in directly
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (userData) => set({ user: userData, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      // Basic signup implementation: sets the user and authenticates them
      signup: (userData) => set({ user: userData, isAuthenticated: true }),
    }),
    {
      name: 'pasalpal-auth-storage', // unique name
      storage: createJSONStorage(() => localStorage), // use localStorage
      // Only persist the user and isAuthenticated status
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
