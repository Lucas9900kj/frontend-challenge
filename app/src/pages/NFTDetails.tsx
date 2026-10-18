import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import axios from "axios";
import { getNFT } from "../services/nfts";
import { useCartApi } from "../hooks/useCartApi";

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

  async function handleAddToCart() {
    if (!nft || addMutation.isPending) return;

    setMessage("");
    setError("");

    try {
      await addMutation.mutateAsync({
        nftId: nft.id,
        quantity,
      });

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
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex items-center justify-between gap-4">
          <Link
            to="/"
            search={{
              search: "",
              category: "all",
              sort: "default",
              page: 1,
            }}
            className="text-purple-400"
          >
            ← Voltar ao catálogo
          </Link>

          <Link
            to="/cart"
            className="rounded-xl bg-purple-600 px-5 py-3 font-semibold"
          >
            Meu carrinho ({cartCount})
          </Link>
        </header>

        {isPending && (
          <div role="status" className="animate-pulse text-slate-400">
            Carregando NFT...
          </div>
        )}

        {isError && (
          <div role="alert" className="rounded-xl bg-slate-900 p-6">
            <p>Não foi possível carregar este NFT.</p>
            <button
              onClick={() => refetch()}
              className="mt-4 rounded-lg bg-purple-600 px-4 py-2"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {nft && (
          <div className="grid items-start gap-10 md:grid-cols-2">
            <img
              src={nft.image}
              alt={nft.name}
              className="aspect-square w-full rounded-2xl object-cover"
            />

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
              <p className="mb-3 text-sm text-purple-400">{nft.category}</p>

              <h1 className="mb-4 text-4xl font-bold">{nft.name}</h1>

              <p className="mb-8 text-slate-400">Criado por {nft.creator}</p>

              <div className="mb-8 border-y border-slate-800 py-6">
                <p className="mb-2 text-sm text-slate-400">Preço atual</p>

                <p className="text-4xl font-bold">{nft.price} ETH</p>
              </div>

              <p className="mb-6 text-slate-400">
                Disponibilidade:{" "}
                <span className="font-semibold text-white">
                  {remaining} unidades
                </span>
              </p>

              {cartQuery.isPending && (
                <p className="mb-4 text-sm text-slate-400">
                  Consultando carrinho...
                </p>
              )}

              {cartQuery.isError && (
                <p role="alert" className="mb-4 text-red-400">
                  Não foi possível consultar o carrinho.
                </p>
              )}

              <div className="mb-6">
                <label
                  htmlFor="quantity"
                  className="mb-2 block text-sm text-slate-400"
                >
                  Quantidade
                </label>

                <input
                  id="quantity"
                  type="number"
                  min={1}
                  max={remaining}
                  step={1}
                  value={quantity}
                  onChange={(event) => {
                    setQuantity(Number(event.target.value));
                    setMessage("");
                    setError("");
                  }}
                  className="w-28 rounded-xl border border-slate-700 bg-slate-800 p-3"
                />
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={
                  cartQuery.isPending ||
                  cartQuery.isError ||
                  addMutation.isPending ||
                  remaining === 0 ||
                  !Number.isInteger(quantity) ||
                  quantity < 1 ||
                  quantity > remaining
                }
                className="w-full rounded-xl bg-purple-600 px-6 py-4 font-bold transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {addMutation.isPending
                  ? "Adicionando..."
                  : remaining === 0
                    ? "Indisponível"
                    : "Adicionar ao carrinho"}
              </button>

              {message && (
                <p role="status" className="mt-4 text-green-400">
                  {message}
                </p>
              )}

              {error && (
                <p role="alert" className="mt-4 text-red-400">
                  {error}
                </p>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
