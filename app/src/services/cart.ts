import { api } from "./api";
import type { NFT } from "../mocks/fixtures";

export interface CartItem {
  nft: NFT;
  quantity: number;
}

export interface CartResponse {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export async function getCart(signal?: AbortSignal): Promise<CartResponse> {
  const response = await api.get<CartResponse>("/cart", {
    signal,
  });

  return response.data;
}

export async function addCartItem(
  nftId: string,
  quantity: number,
): Promise<CartResponse> {
  const response = await api.post<CartResponse>("/cart/items", {
    nftId,
    quantity,
  });

  return response.data;
}

export async function updateCartItem(
  nftId: string,
  quantity: number,
): Promise<CartResponse> {
  const response = await api.patch<CartResponse>(`/cart/items/${nftId}`, {
    quantity,
  });

  return response.data;
}

export async function removeCartItem(nftId: string): Promise<CartResponse> {
  const response = await api.delete<CartResponse>(`/cart/items/${nftId}`);

  return response.data;
}

export async function emptyCart(): Promise<CartResponse> {
  const response = await api.delete<CartResponse>("/cart");

  return response.data;
}
