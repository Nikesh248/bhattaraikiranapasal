import type { CartItem, Product } from '@/types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CartState {
  items: CartItem[];
  searchHistory: string[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  addSearchTerm: (term: string) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      searchHistory: [],
      addToCart: (product, quantity = 1) =>
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
                  : item
              ),
            };
          } else {
             if (quantity <= product.stock) {
               return { items: [...state.items, { ...product, quantity }] };
             }
          }
          return state; // Return current state if quantity exceeds stock
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
             item.id === productId
              ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) } // Ensure quantity is at least 1 and not more than stock
              : item
          ),
        })),
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      getTotalPrice: () =>
        get().items.reduce((total, item) => total + item.price * item.quantity, 0),
      addSearchTerm: (term) =>
        set((state) => {
          // Keep only unique, non-empty terms and limit history size
          const newHistory = [term, ...state.searchHistory.filter(t => t !== term)].slice(0, 10);
          return { searchHistory: newHistory };
        }),
    }),
    {
      name: 'pasalpal-cart-storage', // unique name
      storage: createJSONStorage(() => localStorage), // use localStorage
    }
  )
);
