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
            // Calculate potential new quantity
            const potentialQuantity = existingItem.quantity + quantity;
             // If potential quantity doesn't exceed stock, update it
             if (potentialQuantity <= product.stock) {
                return {
                  items: state.items.map((item) =>
                    item.id === product.id
                      ? { ...item, quantity: potentialQuantity }
                      : item
                  ),
                };
            } else {
                // If it exceeds stock, set quantity to max available stock
                return {
                   items: state.items.map((item) =>
                     item.id === product.id
                       ? { ...item, quantity: product.stock }
                       : item
                   ),
                 };
            }
          } else {
             // If adding a new item, ensure initial quantity doesn't exceed stock
             if (quantity <= product.stock) {
               return { items: [...state.items, { ...product, quantity }] };
             } else {
               // Optionally, add with max stock or prevent adding if initial quantity > stock
                console.warn(`Attempted to add ${product.name} with quantity ${quantity}, but only ${product.stock} in stock. Adding with max stock.`);
                return { items: [...state.items, { ...product, quantity: product.stock }] };
             }
          }
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === productId) {
              // Ensure quantity is at least 1 and not more than stock
               const validatedQuantity = Math.max(1, Math.min(quantity, item.stock));
               return { ...item, quantity: validatedQuantity };
            }
            return item;
          }),
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
      name: 'bhattarai-kirana-pasal-cart-storage', // unique name
      storage: createJSONStorage(() => localStorage), // use localStorage
    }
  )
);
