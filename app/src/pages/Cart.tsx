import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  useCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "../store/cart";

export default function Cart() {
  const items = useCart();
  const [message, setMessage] = useState("");

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const totalPrice = items.reduce(
    (total, item) => total + Number(item.nft.price) * item.quantity,
    0,
  );

  function changeQuantity(nftId: string, quantity: number) {
    const success = updateCartQuantity(nftId, quantity);

    setMessage(
      success ? "" : "Quantidade inválida ou acima do estoque disponível.",
    );
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
            className="text-purple-400 hover:text-purple-300"
          >
            ← Continuar comprando
          </Link>

          <h1 className="text-2xl font-bold md:text-3xl">Meu carrinho</h1>
        </header>

        {items.length === 0 ? (
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
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-3">
            <section
              aria-label="Itens do carrinho"
              className="space-y-5 lg:col-span-2"
            >
              {items.map(({ nft, quantity }) => (
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
                        onChange={(event) =>
                          changeQuantity(nft.id, Number(event.target.value))
                        }
                        className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2"
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
                        onClick={() => {
                          removeFromCart(nft.id);
                          setMessage("");
                        }}
                        className="ml-auto text-sm text-red-400 hover:text-red-300"
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
                <span>{totalItems} itens</span>
              </div>

              <div className="mb-6 flex justify-between border-b border-slate-700 pb-6">
                <span className="text-slate-400">Subtotal</span>
                <span>{totalPrice.toFixed(2)} ETH</span>
              </div>

              <div className="mb-8 flex items-center justify-between">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold text-purple-400">
                  {totalPrice.toFixed(2)} ETH
                </span>
              </div>

              <button
                type="button"
                disabled
                className="w-full cursor-not-allowed rounded-xl bg-purple-600 px-5 py-4 font-bold opacity-50"
              >
                Finalizar compra
              </button>

              <p className="mt-3 text-center text-xs text-slate-400">
                Checkout disponível na próxima etapa.
              </p>

              <button
                type="button"
                onClick={() => {
                  clearCart();
                  setMessage("");
                }}
                className="mt-6 w-full text-sm text-red-400 hover:text-red-300"
              >
                Esvaziar carrinho
              </button>
            </aside>
          </div>
        )}

        {message && (
          <p role="alert" className="mt-6 text-red-400">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
