"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** Devuelve `true` solo en el cliente, evitando desajustes de hidratación con estado persistido. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
