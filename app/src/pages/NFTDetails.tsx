import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import axios from "axios";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Gem,
  Minus,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShoppingCart,
  UserRound,
  Wallet,
} from "lucide-react";

import { getNFT } from "../services/nfts";
import { useCartApi } from "../hooks/useCartApi";

const catalogSearch = {
  search: "",
  category: "all",
  sort: "default",
  page: 1,
};

export default function NFTDetails() {
  const { nftId } = useParams({ from: "/nft/$nftId" });
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { cartQuery, addMutation } = useCartApi();
  const {
    data: nft,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["nft", nftId],
    queryFn: ({ signal }) => getNFT(nftId, signal),
  });

  const quantityInCart =
    cartQuery.data?.items.find((item) => item.nft.id === nftId)?.quantity ?? 0;
  const remaining = nft ? Math.max(0, nft.available - quantityInCart) : 0;
  const cartCount = cartQuery.data?.totalItems ?? 0;
  const invalidQuantity =
    !Number.isInteger(quantity) || quantity < 1 || quantity > remaining;
  const cannotAdd =
    cartQuery.isPending ||
    cartQuery.isError ||
    addMutation.isPending ||
    remaining === 0 ||
    invalidQuantity;

  function updateQuantity(nextQuantity: number) {
    setQuantity(nextQuantity);
    setMessage("");
    setError("");
  }

  async function handleAddToCart() {
    if (!nft || cannotAdd) return;
    setMessage("");
    setError("");

    try {
      await addMutation.mutateAsync({ nftId: nft.id, quantity });
      setMessage("NFT adicionado ao carrinho com sucesso!");
      setQuantity(1);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const response = err.response?.data as { message?: string } | undefined;
        setError(response?.message ?? "Erro ao adicionar NFT.");
      } else {
        setError("Ocorreu um erro inesperado.");
      }
    }
  }

  return (
    <main className="min-h-screen bg-[#120b09] text-[#f5e5cf]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/"
            search={catalogSearch}
            className="inline-flex items-center gap-2 text-sm text-[#c8a88c] transition hover:text-[#e5a268]"
          >
            <ArrowLeft size={17} /> Voltar ao catálogo
          </Link>
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 rounded-sm border border-[#60402b] bg-[#251710] px-4 py-2.5 text-xs font-semibold text-[#e6aa75] transition hover:border-[#d58a49]"
          >
            <ShoppingCart size={16} /> Meu carrinho ({cartCount})
          </Link>
        </div>

        {isPending && (
          <div
            role="status"
            className="grid animate-pulse gap-7 lg:grid-cols-2"
          >
            <div className="aspect-square rounded-md bg-[#302016]" />
            <div className="space-y-5 rounded-md border border-[#38251b] bg-[#20140f] p-7">
              <div className="h-5 w-28 rounded bg-[#38251b]" />
              <div className="h-12 w-3/4 rounded bg-[#38251b]" />
              <div className="h-5 w-1/2 rounded bg-[#38251b]" />
              <div className="h-28 rounded bg-[#38251b]" />
              <span className="sr-only">Carregando NFT...</span>
            </div>
          </div>
        )}

        {isError && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-red-900 bg-red-950/30 p-5 text-red-200"
          >
            <span>Não foi possível carregar este NFT.</span>
            <button
              type="button"
              onClick={() => void refetch()}
              className="inline-flex cursor-pointer items-center gap-2 rounded-sm bg-[#d58a49] px-4 py-2 text-sm font-bold text-[#1b100b]"
            >
              <RefreshCw size={16} /> Tentar novamente
            </button>
          </div>
        )}

        {nft && (
          <div className="grid items-start gap-7 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-md border border-[#493026] bg-[#291912]">
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="h-full w-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
                <span className="absolute left-4 top-4 rounded-sm border border-[#755037] bg-[#1a100d]/90 px-3 py-1.5 text-xs font-semibold text-[#e7b282]">
                  {nft.category}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 rounded-md border border-[#38251b] bg-[#20140f] p-4">
                  <Gem size={21} className="shrink-0 text-[#d58a49]" />
                  <div>
                    <p className="text-xs text-[#a88b73]">Colecionável</p>
                    <p className="text-sm font-semibold">NFT digital</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-md border border-[#38251b] bg-[#20140f] p-4">
                  <ShieldCheck size={21} className="shrink-0 text-[#d58a49]" />
                  <div>
                    <p className="text-xs text-[#a88b73]">Disponibilidade</p>
                    <p className="text-sm font-semibold">
                      {remaining} unidade(s)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <section className="rounded-md border border-[#38251b] bg-[#20140f] p-5 sm:p-8">
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-sm border border-[#70472c] bg-[#392419] px-3 py-1 text-xs font-semibold text-[#e7ae76]">
                  {nft.category}
                </span>
                <span
                  className={`rounded-sm border px-3 py-1 text-xs font-semibold ${remaining > 0 ? "border-emerald-800 bg-emerald-950/40 text-emerald-300" : "border-red-900 bg-red-950/40 text-red-300"}`}
                >
                  {remaining > 0 ? "Disponível" : "Indisponível"}
                </span>
              </div>

              <h1 className="break-words text-3xl font-black tracking-tight text-[#fff0d9] sm:text-4xl">
                {nft.name}
              </h1>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#60402b] bg-[#302016]">
                  <UserRound size={20} className="text-[#d58a49]" />
                </div>
                <div>
                  <p className="text-xs text-[#a88b73]">Criado por</p>
                  <p className="text-sm font-semibold text-[#f5e5cf]">
                    {nft.creator}
                  </p>
                </div>
              </div>

              <div className="my-7 rounded-md border border-[#493026] bg-[#170e0b] p-5">
                <p className="text-xs text-[#bda18a]">Preço atual</p>
                <p className="mt-2 text-4xl font-black text-[#e5a268]">
                  {nft.price} <span className="text-lg">ETH</span>
                </p>
                <p className="mt-3 flex items-center gap-2 text-xs text-[#a88b73]">
                  <Wallet size={15} className="text-[#d58a49]" />
                  Pagamento simulado no marketplace
                </p>
              </div>

              <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs text-[#a88b73]">
                    Disponível para adicionar
                  </p>
                  <p className="mt-1 text-base font-bold">
                    {remaining} unidade(s)
                  </p>
                </div>
                {quantityInCart > 0 && (
                  <span className="rounded-sm border border-[#70472c] bg-[#392419] px-3 py-1 text-xs text-[#e7ae76]">
                    {quantityInCart} no carrinho
                  </span>
                )}
              </div>

              {cartQuery.isPending && (
                <p role="status" className="mb-4 text-sm text-[#a88b73]">
                  Consultando carrinho...
                </p>
              )}
              {cartQuery.isError && (
                <p
                  role="alert"
                  className="mb-4 rounded-sm border border-red-900 bg-red-950/30 p-3 text-sm text-red-200"
                >
                  Não foi possível consultar o carrinho.
                </p>
              )}

              <div className="mb-6">
                <label
                  htmlFor="quantity"
                  className="mb-3 block text-sm font-semibold text-[#e9c6a5]"
                >
                  Quantidade
                </label>
                <div className="inline-flex items-center overflow-hidden rounded-sm border border-[#60402b] bg-[#170e0b]">
                  <button
                    type="button"
                    aria-label="Diminuir quantidade"
                    onClick={() => updateQuantity(Math.max(1, quantity - 1))}
                    disabled={addMutation.isPending || quantity <= 1}
                    className="flex h-11 w-11 cursor-pointer items-center justify-center text-[#d6b99c] hover:bg-[#302016] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    min={1}
                    max={remaining}
                    step={1}
                    value={quantity}
                    onChange={(event) =>
                      updateQuantity(Number(event.target.value))
                    }
                    disabled={addMutation.isPending}
                    className="h-11 w-16 border-x border-[#60402b] bg-transparent text-center font-bold text-[#f5e5cf] outline-none"
                  />
                  <button
                    type="button"
                    aria-label="Aumentar quantidade"
                    onClick={() =>
                      updateQuantity(Math.min(remaining, quantity + 1))
                    }
                    disabled={
                      addMutation.isPending ||
                      remaining === 0 ||
                      quantity >= remaining
                    }
                    className="flex h-11 w-11 cursor-pointer items-center justify-center text-[#d6b99c] hover:bg-[#302016] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => void handleAddToCart()}
                disabled={cannotAdd}
                className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-sm bg-[#d58a49] px-5 py-3 text-sm font-bold text-[#1b100b] transition hover:bg-[#f0a865] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ShoppingCart size={18} />
                {addMutation.isPending
                  ? "Adicionando..."
                  : remaining === 0
                    ? "Indisponível"
                    : "Adicionar ao carrinho"}
                {!addMutation.isPending && remaining > 0 && (
                  <ArrowRight size={17} />
                )}
              </button>

              {message && (
                <p
                  role="status"
                  className="mt-4 flex items-center gap-2 rounded-sm border border-emerald-800 bg-emerald-950/30 p-3 text-sm text-emerald-300"
                >
                  <CheckCircle2 size={17} /> {message}
                </p>
              )}
              {error && (
                <p
                  role="alert"
                  className="mt-4 rounded-sm border border-red-900 bg-red-950/30 p-3 text-sm text-red-200"
                >
                  {error}
                </p>
              )}
              <p className="mt-5 text-center text-xs text-[#8e705c]">
                Os pedidos são simulados para fins de demonstração.
              </p>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
