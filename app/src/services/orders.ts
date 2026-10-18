import { api } from "./api";
import type { CartItem } from "./cart";

export interface Order {
  id: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  status: "CONFIRMED";
  createdAt: string;
}

export async function createOrder(idempotencyKey: string): Promise<Order> {
  const response = await api.post<Order>(
    "/orders",
    {},
    {
      headers: {
        "Idempotency-Key": idempotencyKey,
      },
    },
  );

  return response.data;
}

export async function getOrder(
  orderId: string,
  signal?: AbortSignal,
): Promise<Order> {
  const response = await api.get<Order>(`/orders/${orderId}`, { signal });

  return response.data;
}
