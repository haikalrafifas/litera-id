'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: string;
  isbn?: string;
  title: string;
  author?: string;
  cover?: string;
  quantity: number;
  stock?: number;
}

interface LoanContextValue {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  updateQty: (id: string, qty: number) => void;
  totalItems: number;
}

const LoanContext = createContext<LoanContextValue | null>(null);

export function LoanProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  function add(item: CartItem) {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) =>
          p.id === item.id
            ? { ...p, quantity: Math.min((p.quantity || 0) + item.quantity, item.stock ?? 9999) }
            : p
        );
      }
      return [...prev, item];
    });
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  function clear() {
    setItems([]);
  }

  function updateQty(id: string, qty: number) {
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: Math.max(1, Math.min(qty, p.stock ?? 9999)) } : p))
    );
  }

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  return <LoanContext.Provider value={{ items, add, remove, clear, updateQty, totalItems }}>{children}</LoanContext.Provider>;
}

export function useLoanCart() {
  const ctx = useContext(LoanContext);
  if (!ctx) throw new Error('useLoanCart must be used within LoanProvider');
  return ctx;
}