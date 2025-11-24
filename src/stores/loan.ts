import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type Book from '@/domains/book/model';

export interface CartItem {
  id: string;
  isbn: string;
  title: string;
  author?: string;
  publisher?: string;
  category?: string;
  image?: string;
  qty: number;
  stock: number;
}

interface LoanStore {
  items: CartItem[];
  add: (item: Omit<CartItem, 'id'>) => void;
  remove: (isbn: string) => void;
  clear: () => void;
  updateQty: (isbn: string, qty: number) => void;
  totalItems: number;
  hasItem: (isbn: string) => boolean;
  getItem: (isbn: string) => CartItem | undefined;
}

export const useLoanStore = create<LoanStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      add: (item) => set((state) => {
        const existing = state.items.find((i) => i.isbn === item.isbn);
        if (existing) {
          return {
            items: state.items.map((i) =>
              i.isbn === item.isbn
                ? { ...i, qty: Math.min(i.qty + item.qty, item.stock) }
                : i
            ),
            totalItems: state.items.reduce((sum, i) => 
              i.isbn === item.isbn 
                ? sum + Math.min(i.qty + item.qty, item.stock) - i.qty
                : sum, 
              state.totalItems
            ),
          };
        }
        
        const newItem: CartItem = {
          id: item.isbn,
          ...item,
        };
        
        return {
          items: [...state.items, newItem],
          totalItems: state.totalItems + item.qty,
        };
      }),
      
      remove: (isbn) => set((state) => {
        const item = state.items.find((i) => i.isbn === isbn);
        return {
          items: state.items.filter((i) => i.isbn !== isbn),
          totalItems: state.totalItems - (item?.qty || 0),
        };
      }),
      
      clear: () => set({ items: [], totalItems: 0 }),
      
      updateQty: (isbn, qty) => set((state) => {
        const item = state.items.find((i) => i.isbn === isbn);
        if (!item) return state;
        
        const newQty = Math.max(1, Math.min(qty, item.stock));
        const qtyDiff = newQty - item.qty;
        
        return {
          items: state.items.map((i) =>
            i.isbn === isbn ? { ...i, qty: newQty } : i
          ),
          totalItems: state.totalItems + qtyDiff,
        };
      }),
      
      totalItems: 0,
      
      hasItem: (isbn) => {
        const state = get();
        return state.items.some((item) => item.isbn === isbn);
      },
      
      getItem: (isbn) => {
        const state = get();
        return state.items.find((item) => item.isbn === isbn);
      },
    }),
    {
      name: 'loan-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
