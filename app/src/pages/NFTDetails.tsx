import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { getNFT } from "../services/nfts";
import { addToCart, useCart } from "../store/cart";

export default function NFTDetails() {
  const { nftId } = useParams({ from: "/nft/$nftId" });

  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const cart = useCart();

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
    cart.find((item) => item.nft.id === nftId)?.quantity ?? 0;

  const remaining = nft ? Math.max(0, nft.available - quantityInCart) : 0;

  function handleAddToCart() {
    if (!nft) return;

    const success = addToCart(nft, quantity);

    if (success) {
      setMessage("NFT adicionado ao carrinho com sucesso!");
      setQuantity(1);
    } else {
      setMessage("Quantidade indisponível no estoque.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex items-center justify-between">
          <Link
            to="/"
            search={{
              search: "",
              category: "all",
              sort: "default",
              page: 1,
            }}
            className="text-purple-400 hover:text-purple-300"
          >
            ← Voltar ao catálogo
          </Link>

          <Link
            to="/cart"
            className="rounded-xl bg-purple-600 px-5 py-3 font-semibold"
          >
            Meu carrinho (
            {cart.reduce((total, item) => total + item.quantity, 0)})
          </Link>
        </header>

        {isPending && (
          <div role="status" className="grid gap-10 md:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-2xl bg-slate-800" />
            <div className="space-y-5">
              <div className="h-10 animate-pulse rounded bg-slate-800" />
              <div className="h-6 w-1/2 animate-pulse rounded bg-slate-800" />
            </div>
            <span className="sr-only">Carregando NFT...</span>
          </div>
        )}

        {isError && (
          <div role="alert" className="rounded-2xl bg-slate-900 p-8">
            <h1 className="text-2xl font-bold">
              Não foi possível carregar este NFT.
            </h1>

            <button
              onClick={() => refetch()}
              className="mt-5 rounded-xl bg-purple-600 px-5 py-3"
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
              <p className="mb-3 text-sm font-semibold text-purple-400">
                {nft.category}
              </p>

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
                  }}
                  className="w-28 rounded-xl border border-slate-700 bg-slate-800 p-3 text-white"
                />
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={
                  remaining === 0 ||
                  !Number.isInteger(quantity) ||
                  quantity < 1 ||
                  quantity > remaining
                }
                className="w-full rounded-xl bg-purple-600 px-6 py-4 font-bold transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {remaining === 0 ? "Indisponível" : "Adicionar ao carrinho"}
              </button>

              {message && (
                <p
                  role="status"
                  className="mt-4 text-center text-sm text-green-400"
                >
                  {message}
                </p>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
