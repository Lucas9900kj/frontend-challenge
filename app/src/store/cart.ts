import { useSyncExternalStore } from "react";
import type { NFT } from "../mocks/fixtures";

export interface CartItem {
  nft: NFT;
  quantity: number;
}

const STORAGE_KEY = "jungle-nft-cart";

function loadCart(): CartItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return [];

    const parsed: unknown = JSON.parse(saved);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is CartItem => {
      if (!item || typeof item !== "object") return false;

      const entry = item as Partial<CartItem>;

      return (
        typeof entry.nft?.id === "string" &&
        typeof entry.nft?.price === "string" &&
        typeof entry.nft?.available === "number" &&
        Number.isInteger(entry.quantity) &&
        entry.quantity! > 0 &&
        entry.quantity! <= entry.nft.available
      );
    });
  } catch {
    return [];
  }
}

let items: CartItem[] = loadCart();

const listeners = new Set<() => void>();

function notify() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return items;
}

export function useCart() {
  return useSyncExternalStore(subscribe, getSnapshot);
}

export function addToCart(nft: NFT, quantity: number): boolean {
  if (!Number.isInteger(quantity) || quantity <= 0) return false;

  const existing = items.find((item) => item.nft.id === nft.id);
  const currentQuantity = existing?.quantity ?? 0;

  if (currentQuantity + quantity > nft.available) {
    return false;
  }

  if (existing) {
    items = items.map((item) =>
      item.nft.id === nft.id
        ? { ...item, nft, quantity: item.quantity + quantity }
        : item,
    );
  } else {
    items = [...items, { nft, quantity }];
  }

  notify();
  return true;
}

export function updateCartQuantity(nftId: string, quantity: number): boolean {
  const existing = items.find((item) => item.nft.id === nftId);

  if (!existing) return false;

  if (
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > existing.nft.available
  ) {
    return false;
  }

  items = items.map((item) =>
    item.nft.id === nftId ? { ...item, quantity } : item,
  );

  notify();
  return true;
}

export function removeFromCart(nftId: string) {
  items = items.filter((item) => item.nft.id !== nftId);
  notify();
}

export function clearCart() {
  items = [];
  notify();
}
