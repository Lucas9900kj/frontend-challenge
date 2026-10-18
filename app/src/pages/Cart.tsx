import { useState } from "react";
import { Link } from "@tanstack/react-router";
import axios from "axios";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  Wallet,
} from "lucide-react";
import { useCartApi } from "../hooks/useCartApi";

const catalogSearch = {
  search: "",
  category: "all",
  sort: "default",
  page: 1,
};

const panel = "rounded-md border border-[#493026] bg-[#21150f]";
const muted = "text-[#b99a80]";

export default function Cart() {
  const { cartQuery, updateMutation, removeMutation, clearMutation } =
    useCartApi();
  const [error, setError] = useState("");
  const cart = cartQuery.data;
  const busy =
    updateMutation.isPending ||
    removeMutation.isPending ||
    clearMutation.isPending;

  function getErrorMessage(err: unknown) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as { message?: string } | undefined;
      return data?.message ?? "Não foi possível atualizar o carrinho.";
    }
    return "Ocorreu um erro inesperado.";
  }

  async function changeQuantity(nftId: string, quantity: number) {
    if (busy || quantity < 1) return;
    setError("");
    try {
      await updateMutation.mutateAsync({ nftId, quantity });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function removeItem(nftId: string) {
    if (busy) return;
    setError("");
    try {
      await removeMutation.mutateAsync(nftId);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function clearItems() {
    if (busy) return;
    if (!window.confirm("Deseja realmente esvaziar seu carrinho?")) return;
    setError("");
    try {
      await clearMutation.mutateAsync();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <main className="min-h-screen bg-[#120b09] text-[#f5e5cf]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <Link
          to="/"
          search={catalogSearch}
          className="inline-flex items-center gap-2 text-sm text-[#c8a88c] transition hover:text-[#e5a268]"
        >
          <ArrowLeft size={17} /> Continuar comprando
        </Link>

        <div className="mb-8 mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#d58a49]">
              Sua coleção digital
            </p>
            <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight text-[#fff0d9] sm:text-4xl">
              <ShoppingCart className="h-7 w-7 text-[#d58a49]" /> Meu carrinho
            </h1>
            <p className={`mt-3 text-sm ${muted}`}>
              Revise seus NFTs antes de finalizar a compra.
            </p>
          </div>
          {cart && cart.totalItems > 0 && (
            <span className="rounded-sm border border-[#60402b] bg-[#302016] px-4 py-2 text-xs font-semibold text-[#e7b282]">
              {cart.totalItems} {cart.totalItems === 1 ? "item" : "itens"}
            </span>
          )}
        </div>

        {cartQuery.isPending && (
          <div
            role="status"
            className="grid animate-pulse items-start gap-6 lg:grid-cols-3"
          >
            <div className="space-y-4 lg:col-span-2">
              <div className="h-48 rounded-md bg-[#302016]" />
              <div className="h-48 rounded-md bg-[#302016]" />
            </div>
            <div className="h-80 rounded-md bg-[#302016]" />
            <span className="sr-only">Carregando carrinho...</span>
          </div>
        )}

        {cartQuery.isError && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-red-900 bg-red-950/30 p-5 text-red-200"
          >
            <span>Não foi possível carregar o carrinho.</span>
            <button
              type="button"
              onClick={() => void cartQuery.refetch()}
              className="inline-flex cursor-pointer items-center gap-2 rounded-sm bg-[#d58a49] px-4 py-2 text-sm font-bold text-[#1b100b] hover:bg-[#f0a865]"
            >
              <RefreshCw size={16} /> Tentar novamente
            </button>
          </div>
        )}

        {cart && cart.items.length === 0 && (
          <section
            className={`${panel} flex flex-col items-center px-6 py-16 text-center sm:py-20`}
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-md border border-[#60402b] bg-[#302016]">
              <ShoppingBag className="h-10 w-10 text-[#d58a49]" />
            </div>
            <h2 className="mt-6 text-2xl font-black text-[#fff0d9] sm:text-3xl">
              Seu carrinho está vazio
            </h2>
            <p className={`mt-4 max-w-md text-sm leading-relaxed ${muted}`}>
              Você ainda não adicionou nenhum NFT. Explore o marketplace e
              encontre colecionáveis digitais incríveis.
            </p>
            <Link
              to="/"
              search={catalogSearch}
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-[#d58a49] px-7 text-sm font-bold text-[#1b100b] transition hover:bg-[#f0a865]"
            >
              Explorar NFTs <ArrowRight size={17} />
            </Link>
          </section>
        )}

        {cart && cart.items.length > 0 && (
          <div className="grid items-start gap-6 lg:grid-cols-3 lg:gap-8">
            <section
              aria-label="Itens do carrinho"
              className="min-w-0 space-y-4 lg:col-span-2"
            >
              {cart.items.map(({ nft, quantity }) => (
                <article
                  key={nft.id}
                  className={`${panel} flex flex-col gap-5 p-4 transition hover:border-[#775037] sm:flex-row sm:p-5`}
                >
                  <Link
                    to="/nft/$nftId"
                    params={{ nftId: nft.id }}
                    className="shrink-0 overflow-hidden rounded-sm border border-[#493026]"
                  >
                    <img
                      src={nft.image}
                      alt={nft.name}
                      loading="lazy"
                      className="aspect-square w-full object-cover transition-transform duration-300 hover:scale-105 sm:h-40 sm:w-40"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-5">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#d58a49]">
                            Colecionável digital
                          </p>
                          <Link
                            to="/nft/$nftId"
                            params={{ nftId: nft.id }}
                            className="block break-words text-xl font-bold text-[#fff0d9] transition hover:text-[#e5a268]"
                          >
                            {nft.name}
                          </Link>
                          <p className={`mt-2 text-sm ${muted}`}>
                            Criado por {nft.creator}
                          </p>
                        </div>
                        <button
                          type="button"
                          aria-label={`Remover ${nft.name} do carrinho`}
                          title="Remover NFT"
                          disabled={busy}
                          onClick={() => void removeItem(nft.id)}
                          className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-red-900/60 bg-red-950/20 text-red-300 transition hover:bg-red-950/50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <span className="rounded-sm border border-[#70472c] bg-[#392419] px-3 py-1 text-xs font-semibold text-[#e7ae76]">
                          {nft.price} ETH / unidade
                        </span>
                        <span className="text-xs text-[#a88b73]">
                          Estoque: {nft.available}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-end justify-between gap-4 border-t border-[#493026] pt-4">
                      <div>
                        <p className={`mb-2 text-xs ${muted}`}>Quantidade</p>
                        <div className="inline-flex items-center overflow-hidden rounded-sm border border-[#60402b] bg-[#170e0b]">
                          <button
                            type="button"
                            aria-label={`Diminuir quantidade de ${nft.name}`}
                            disabled={busy || quantity <= 1}
                            onClick={() =>
                              void changeQuantity(nft.id, quantity - 1)
                            }
                            className="flex h-10 w-10 cursor-pointer items-center justify-center text-[#d6b99c] transition hover:bg-[#302016] disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Minus size={16} />
                          </button>
                          <span
                            aria-label={`Quantidade: ${quantity}`}
                            className="flex h-10 min-w-12 items-center justify-center border-x border-[#60402b] px-3 text-sm font-bold"
                          >
                            {quantity}
                          </span>
                          <button
                            type="button"
                            aria-label={`Aumentar quantidade de ${nft.name}`}
                            disabled={busy || quantity >= nft.available}
                            onClick={() =>
                              void changeQuantity(nft.id, quantity + 1)
                            }
                            className="flex h-10 w-10 cursor-pointer items-center justify-center text-[#d6b99c] transition hover:bg-[#302016] disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs ${muted}`}>Subtotal</p>
                        <p className="mt-1 text-xl font-black text-[#e5a268]">
                          {(Number(nft.price) * quantity).toFixed(2)}{" "}
                          <span className="text-sm">ETH</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <aside className="lg:sticky lg:top-24">
              <div className={`${panel} p-5 sm:p-6`}>
                <div className="mb-7 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-[#60402b] bg-[#302016]">
                    <ShoppingBag className="h-5 w-5 text-[#d58a49]" />
                  </div>
                  <h2 className="text-xl font-black text-[#fff0d9]">
                    Resumo do pedido
                  </h2>
                </div>
                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className={muted}>Quantidade de NFTs</span>
                    <span className="font-semibold">
                      {cart.totalItems}{" "}
                      {cart.totalItems === 1 ? "item" : "itens"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className={muted}>Subtotal</span>
                    <span className="font-semibold">
                      {cart.totalPrice.toFixed(2)} ETH
                    </span>
                  </div>
                  <div className="border-t border-[#493026] pt-5">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                      <span className="font-semibold">Total</span>
                      <span className="text-2xl font-black text-[#e5a268]">
                        {cart.totalPrice.toFixed(2)} ETH
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  aria-disabled={busy}
                  onClick={(event) => {
                    if (busy) event.preventDefault();
                  }}
                  className={`mt-8 flex min-h-12 w-full items-center justify-center gap-2 rounded-sm bg-[#d58a49] px-4 py-3 text-sm font-bold text-[#1b100b] transition hover:bg-[#f0a865] ${busy ? "pointer-events-none opacity-50" : ""}`}
                >
                  <Wallet size={18} /> Finalizar compra <ArrowRight size={17} />
                </Link>
                <p
                  className={`mt-4 flex items-center justify-center gap-2 text-center text-xs ${muted}`}
                >
                  <ShieldCheck size={16} className="text-[#d58a49]" />
                  Checkout de demonstração
                </p>
                <div className="mt-6 border-t border-[#493026] pt-4">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void clearItems()}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-950/30 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Trash2 size={16} />
                    {clearMutation.isPending
                      ? "Esvaziando..."
                      : "Esvaziar carrinho"}
                  </button>
                </div>
              </div>
            </aside>
          </div>
        )}

        {error && (
          <p
            role="alert"
            className="mt-6 rounded-sm border border-red-900 bg-red-950/30 p-4 text-sm text-red-200"
          >
            {error}
          </p>
        )}
      </div>
    </main>
  );
}
