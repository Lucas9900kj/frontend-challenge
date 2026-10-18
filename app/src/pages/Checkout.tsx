import { useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { useCartApi } from "../hooks/useCartApi";
import { createOrder } from "../services/orders";

export default function Checkout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { cartQuery } = useCartApi();

  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");

  const idempotencyKey = useRef<string>(crypto.randomUUID());

  const checkoutMutation = useMutation({
    mutationFn: () => createOrder(idempotencyKey.current),
  });

  const cart = cartQuery.data;

  async function handleCheckout() {
    if (
      !accepted ||
      !cart ||
      cart.items.length === 0 ||
      checkoutMutation.isPending
    ) {
      return;
    }

    setError("");

    try {
      const order = await checkoutMutation.mutateAsync();

      await queryClient.invalidateQueries({
        queryKey: ["cart"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["nfts"],
      });

      await navigate({
        to: "/order/$orderId",
        params: {
          orderId: order.id,
        },
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;

        setError(data?.message ?? "Não foi possível concluir o pedido.");
      } else {
        setError("Ocorreu um erro inesperado.");
      }
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <Link to="/cart" className="text-purple-400 hover:text-purple-300">
          ← Voltar ao carrinho
        </Link>

        <header className="mb-10 mt-8">
          <h1 className="text-4xl font-bold">Finalizar compra</h1>

          <p className="mt-3 text-slate-400">
            Confira seus NFTs antes de confirmar o pedido.
          </p>
        </header>

        {cartQuery.isPending && (
          <p role="status" className="text-slate-400">
            Carregando carrinho...
          </p>
        )}

        {cartQuery.isError && (
          <section
            role="alert"
            className="rounded-2xl border border-red-900 bg-slate-900 p-6"
          >
            <p className="text-red-400">
              Não foi possível carregar seu carrinho.
            </p>

            <button
              type="button"
              onClick={() => cartQuery.refetch()}
              className="mt-4 rounded-xl bg-purple-600 px-5 py-3"
            >
              Tentar novamente
            </button>
          </section>
        )}

        {cart && cart.items.length === 0 && (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold">Seu carrinho está vazio</h2>

            <p className="mt-3 text-slate-400">
              Adicione um NFT para continuar.
            </p>

            <Link
              to="/"
              search={{
                search: "",
                category: "all",
                sort: "default",
                page: 1,
              }}
              className="mt-6 inline-block rounded-xl bg-purple-600 px-6 py-3 font-semibold"
            >
              Explorar NFTs
            </Link>
          </section>
        )}

        {cart && cart.items.length > 0 && (
          <div className="grid items-start gap-8 lg:grid-cols-3">
            <section className="space-y-4 lg:col-span-2">
              <h2 className="mb-5 text-2xl font-bold">Revisão dos itens</h2>

              {cart.items.map(({ nft, quantity }) => (
                <article
                  key={nft.id}
                  className="flex gap-5 rounded-2xl border border-slate-800 bg-slate-900 p-5"
                >
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="h-28 w-28 shrink-0 rounded-xl object-cover"
                  />

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{nft.name}</h3>

                      <p className="mt-1 text-sm text-slate-400">
                        Criador: {nft.creator}
                      </p>

                      <p className="mt-2 text-sm text-slate-400">
                        Quantidade: {quantity}
                      </p>
                    </div>

                    <p className="mt-3 font-bold text-purple-400">
                      {(Number(nft.price) * quantity).toFixed(2)} ETH
                    </p>
                  </div>
                </article>
              ))}
            </section>

            <aside className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="mb-6 text-2xl font-bold">Resumo do pedido</h2>

              <div className="mb-4 flex justify-between">
                <span className="text-slate-400">Quantidade</span>

                <span>{cart.totalItems} itens</span>
              </div>

              <div className="mb-6 flex justify-between border-b border-slate-700 pb-6">
                <span className="text-slate-400">Subtotal</span>

                <span>{cart.totalPrice.toFixed(2)} ETH</span>
              </div>

              <div className="mb-8 flex justify-between gap-3">
                <span className="text-lg font-bold">Total</span>

                <span className="text-2xl font-bold text-purple-400">
                  {cart.totalPrice.toFixed(2)} ETH
                </span>
              </div>

              <label className="mb-6 flex cursor-pointer items-start gap-3 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(event) => setAccepted(event.target.checked)}
                  disabled={checkoutMutation.isPending}
                  className="mt-1 accent-purple-600"
                />

                <span>
                  Confirmo os itens e entendo que esta compra é uma simulação,
                  sem pagamento real.
                </span>
              </label>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={!accepted || checkoutMutation.isPending}
                className="w-full rounded-xl bg-purple-600 px-5 py-4 font-bold transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {checkoutMutation.isPending
                  ? "Processando pedido..."
                  : "Confirmar pedido"}
              </button>

              {error && (
                <p role="alert" className="mt-4 text-sm text-red-400">
                  {error}
                </p>
              )}

              <p className="mt-5 text-center text-xs text-slate-500">
                Ambiente demonstrativo — nenhuma cobrança será realizada.
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
