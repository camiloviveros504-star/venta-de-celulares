"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartItem } from "@/lib/types";

type NewCartItem = Omit<CartItem, "key" | "quantity"> & { quantity?: number };

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: NewCartItem) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
}

const MAX_QUANTITY = 10;

export const cartKey = (productId: string, colorName: string, storage: number): string =>
  `${productId}:${colorName}:${storage}`;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: ({ quantity = 1, ...item }) =>
        set((state) => {
          const key = cartKey(item.productId, item.color.name, item.storage);
          const existing = state.items.find((i) => i.key === key);
          const items = existing
            ? state.items.map((i) =>
                i.key === key ? { ...i, quantity: Math.min(MAX_QUANTITY, i.quantity + quantity) } : i,
              )
            : [...state.items, { ...item, key, quantity }];
          return { items, isOpen: true };
        }),
      removeItem: (key) => set((state) => ({ items: state.items.filter((i) => i.key !== key) })),
      updateQuantity: (key, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.key !== key)
              : state.items.map((i) =>
                  i.key === key ? { ...i, quantity: Math.min(MAX_QUANTITY, quantity) } : i,
                ),
        })),
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: "cellustore-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export const selectCount = (state: CartState): number =>
  state.items.reduce((sum, i) => sum + i.quantity, 0);

export const selectSubtotal = (state: CartState): number =>
  state.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
