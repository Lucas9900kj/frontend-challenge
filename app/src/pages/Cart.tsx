import { useState } from "react";
import { Link } from "@tanstack/react-router";
import axios from "axios";
import { useCartApi } from "../hooks/useCartApi";

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
    setError("");

    try {
      await updateMutation.mutateAsync({ nftId, quantity });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function removeItem(nftId: string) {
    setError("");

    try {
      await removeMutation.mutateAsync(nftId);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function clearItems() {
    setError("");

    try {
      await clearMutation.mutateAsync();
    } catch (err) {
      setError(getErrorMessage(err));
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
            className="text-purple-400"
          >
            ← Continuar comprando
          </Link>

          <h1 className="text-3xl font-bold">Meu carrinho</h1>
        </header>

        {cartQuery.isPending && (
          <p role="status" className="text-slate-400">
            Carregando carrinho...
          </p>
        )}

        {cartQuery.isError && (
          <div role="alert" className="rounded-xl bg-slate-900 p-6">
            <p>Não foi possível carregar o carrinho.</p>
            <button
              onClick={() => cartQuery.refetch()}
              className="mt-4 rounded-lg bg-purple-600 px-4 py-2"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {cart && cart.items.length === 0 && (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <h2 className="mb-3 text-2xl font-bold">Seu carrinho está vazio</h2>

            <p className="mb-6 text-slate-400">
              Explore o catálogo e adicione seus NFTs favoritos.
            </p>

            <Link
              to="/"
              search={{
                search: "",
                category: "all",
                sort: "default",
                page: 1,
              }}
              className="inline-block rounded-xl bg-purple-600 px-6 py-3 font-semibold"
            >
              Explorar NFTs
            </Link>
          </section>
        )}

        {cart && cart.items.length > 0 && (
          <div className="grid items-start gap-8 lg:grid-cols-3">
            <section
              aria-label="Itens do carrinho"
              className="space-y-5 lg:col-span-2"
            >
              {cart.items.map(({ nft, quantity }) => (
                <article
                  key={nft.id}
                  className="flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:flex-row"
                >
                  <Link
                    to="/nft/$nftId"
                    params={{ nftId: nft.id }}
                    className="shrink-0"
                  >
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="h-36 w-full rounded-xl object-cover sm:w-36"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col justify-between gap-4">
                    <div>
                      <Link
                        to="/nft/$nftId"
                        params={{ nftId: nft.id }}
                        className="text-xl font-bold hover:text-purple-400"
                      >
                        {nft.name}
                      </Link>

                      <p className="mt-1 text-sm text-slate-400">
                        {nft.creator}
                      </p>

                      <p className="mt-2 font-semibold text-purple-400">
                        {nft.price} ETH por unidade
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <label
                        htmlFor={`quantity-${nft.id}`}
                        className="text-sm text-slate-400"
                      >
                        Quantidade
                      </label>

                      <select
                        id={`quantity-${nft.id}`}
                        value={quantity}
                        disabled={busy}
                        onChange={(event) =>
                          changeQuantity(nft.id, Number(event.target.value))
                        }
                        className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 disabled:opacity-50"
                      >
                        {Array.from(
                          { length: nft.available },
                          (_, index) => index + 1,
                        ).map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => removeItem(nft.id)}
                        className="ml-auto text-sm text-red-400 disabled:opacity-50"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <aside className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="mb-6 text-2xl font-bold">Resumo do pedido</h2>

              <div className="mb-4 flex justify-between text-slate-400">
                <span>Quantidade</span>
                <span>{cart.totalItems} itens</span>
              </div>

              <div className="mb-6 flex justify-between border-b border-slate-700 pb-6">
                <span className="text-slate-400">Subtotal</span>
                <span>{cart.totalPrice.toFixed(2)} ETH</span>
              </div>

              <div className="mb-8 flex justify-between">
                <span className="text-lg font-semibold">Total</span>

                <span className="text-2xl font-bold text-purple-400">
                  {cart.totalPrice.toFixed(2)} ETH
                </span>
              </div>

              <Link
                to="/checkout"
                className="block w-full rounded-xl bg-purple-600 px-5 py-4 text-center font-bold transition hover:bg-purple-500"
              >
                Finalizar compra
              </Link>

              <p className="mt-3 text-center text-xs text-slate-400">
                Checkout disponível na próxima etapa.
              </p>

              <button
                type="button"
                disabled={busy}
                onClick={clearItems}
                className="mt-6 w-full text-sm text-red-400 disabled:opacity-50"
              >
                {clearMutation.isPending
                  ? "Esvaziando..."
                  : "Esvaziar carrinho"}
              </button>
            </aside>
          </div>
        )}

        {error && (
          <p role="alert" className="mt-6 text-red-400">
            {error}
          </p>
        )}
      </div>
    </main>
  );
}
