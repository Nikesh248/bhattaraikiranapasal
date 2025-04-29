
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string; // Keeping email as primary identifier for user object
  // Add other user properties as needed
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  registeredIdentifiers: Set<string>; // Mock store for registered emails/phones
  login: (userData: User) => void;
  logout: () => void;
  signup: (userData: Omit<User, 'id'>, identifier: string) => boolean; // Signup returns success/failure
  isIdentifierRegistered: (identifier: string) => boolean; // Function to check uniqueness
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      registeredIdentifiers: new Set<string>(), // Initialize the set

      login: (userData) => set({ user: userData, isAuthenticated: true }),

      logout: () => set({ user: null, isAuthenticated: false }),

      isIdentifierRegistered: (identifier) => {
        return get().registeredIdentifiers.has(identifier.toLowerCase());
      },

      // Updated signup implementation with uniqueness check
      signup: (userData, identifier) => {
        const lowerCaseIdentifier = identifier.toLowerCase();
        if (get().isIdentifierRegistered(lowerCaseIdentifier)) {
          console.warn(`Signup failed: Identifier "${identifier}" is already registered.`);
          return false; // Indicate signup failure due to duplicate identifier
        }

        const newUser: User = {
          ...userData,
          id: 'user_' + Date.now(), // Mock user ID
        };

        set((state) => ({
          user: newUser,
          isAuthenticated: true,
          registeredIdentifiers: new Set(state.registeredIdentifiers).add(lowerCaseIdentifier), // Add new identifier
        }));
        console.log(`Signup successful for identifier: ${identifier}`);
        return true; // Indicate successful signup
      },
    }),
    {
      name: 'bhattarai-kirana-pasal-auth-storage', // unique name
      storage: createJSONStorage(() => localStorage), // use localStorage
      // Persist user, auth status, and the list of registered identifiers (for mock)
      partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          registeredIdentifiers: Array.from(state.registeredIdentifiers), // Convert Set to Array for persistence
      }),
      // Rehydrate Set from Array - This part runs correctly within the middleware config
      onRehydrateStorage: () => (state) => {
         if (state) {
             state.registeredIdentifiers = new Set(state.registeredIdentifiers);
         }
       },
    }
  )
);

// Manual rehydration logic to handle Set properly
// This ensures the Set is correctly reconstructed when the app loads on the client
// Check if running on the client before accessing persist object properties
if (typeof window !== 'undefined') {
    useAuthStore.persist.onFinishHydration((state) => {
        if (state && Array.isArray(state.registeredIdentifiers)) {
        useAuthStore.setState({ registeredIdentifiers: new Set(state.registeredIdentifiers) }, true);
        }
    });
}

