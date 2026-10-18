import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  emptyCart,
} from "../services/cart";

export function useCartApi() {
  const queryClient = useQueryClient();

  const cartQuery = useQuery({
    queryKey: ["cart"],
    queryFn: ({ signal }) => getCart(signal),
  });

  const refreshCart = () =>
    queryClient.invalidateQueries({
      queryKey: ["cart"],
    });

  const addMutation = useMutation({
    mutationFn: ({ nftId, quantity }: { nftId: string; quantity: number }) =>
      addCartItem(nftId, quantity),
    onSuccess: refreshCart,
  });

  const updateMutation = useMutation({
    mutationFn: ({ nftId, quantity }: { nftId: string; quantity: number }) =>
      updateCartItem(nftId, quantity),
    onSuccess: refreshCart,
  });

  const removeMutation = useMutation({
    mutationFn: (nftId: string) => removeCartItem(nftId),
    onSuccess: refreshCart,
  });

  const clearMutation = useMutation({
    mutationFn: emptyCart,
    onSuccess: refreshCart,
  });

  return {
    cartQuery,
    addMutation,
    updateMutation,
    removeMutation,
    clearMutation,
  };
}
