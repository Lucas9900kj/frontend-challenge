import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { useCartApi } from "../hooks/useCartApi";
import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  emptyCart,
} from "../services/cart";

// Simula a API para não alterar o carrinho real.
vi.mock("../services/cart", () => ({
  getCart: vi.fn(),
  addCartItem: vi.fn(),
  updateCartItem: vi.fn(),
  removeCartItem: vi.fn(),
  emptyCart: vi.fn(),
}));

const mockedGetCart = vi.mocked(getCart);
const mockedAddCartItem = vi.mocked(addCartItem);
const mockedUpdateCartItem = vi.mocked(updateCartItem);
const mockedRemoveCartItem = vi.mocked(removeCartItem);
const mockedEmptyCart = vi.mocked(emptyCart);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return Wrapper;
}

describe("Jungle Gaming - Carrinho", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // O retorno não é utilizado nestes testes.
    mockedGetCart.mockResolvedValue({
      items: [],
      totalItems: 0,
      totalPrice: 0,
    });
    mockedAddCartItem.mockResolvedValue(undefined as never);
    mockedUpdateCartItem.mockResolvedValue(undefined as never);
    mockedRemoveCartItem.mockResolvedValue(undefined as never);
    mockedEmptyCart.mockResolvedValue(undefined as never);
  });

  it("deve consultar o carrinho", async () => {
    renderHook(() => useCartApi(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockedGetCart).toHaveBeenCalledTimes(1);
    });
  });

  it("deve adicionar um NFT ao carrinho", async () => {
    const { result } = renderHook(() => useCartApi(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.addMutation.mutateAsync({
        nftId: "nft-1",
        quantity: 2,
      });
    });

    expect(mockedAddCartItem).toHaveBeenCalledWith("nft-1", 2);
  });

  it("deve atualizar a quantidade de um NFT", async () => {
    const { result } = renderHook(() => useCartApi(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.updateMutation.mutateAsync({
        nftId: "nft-1",
        quantity: 3,
      });
    });

    expect(mockedUpdateCartItem).toHaveBeenCalledWith("nft-1", 3);
  });

  it("deve remover um NFT do carrinho", async () => {
    const { result } = renderHook(() => useCartApi(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.removeMutation.mutateAsync("nft-1");
    });

    expect(mockedRemoveCartItem).toHaveBeenCalledWith("nft-1");
  });

  it("deve limpar todos os itens do carrinho", async () => {
    const { result } = renderHook(() => useCartApi(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.clearMutation.mutateAsync();
    });

    expect(mockedEmptyCart).toHaveBeenCalledTimes(1);
  });
});
