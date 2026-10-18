import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";

import { getOrder } from "../services/orders";

export default function OrderConfirmation() {
  const { orderId } = useParams({
    from: "/order/$orderId",
  });

  const {
    data: order,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: ({ signal }) => getOrder(orderId, signal),
    retry: 1,
  });

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        {isPending && (
          <p role="status" className="text-slate-400">
            Carregando confirmação do pedido...
          </p>
        )}

        {isError && (
          <section
            role="alert"
            className="rounded-2xl border border-slate-800 bg-slate-900 p-8"
          >
            <h1 className="text-2xl font-bold">
              Não foi possível consultar o pedido
            </h1>

            <p className="mt-3 text-slate-400">
              Verifique sua conexão ou tente novamente.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-6 rounded-xl bg-purple-600 px-5 py-3 font-semibold"
            >
              Tentar novamente
            </button>

            <Link
              to="/"
              search={{
                search: "",
                category: "all",
                sort: "default",
                page: 1,
              }}
              className="ml-4 text-purple-400"
            >
              Voltar ao catálogo
            </Link>
          </section>
        )}

        {order && (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
            <div
              aria-hidden="true"
              className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-5xl text-green-400"
            >
              ✓
            </div>

            <h1 className="mb-3 text-4xl font-bold">Pedido confirmado!</h1>

            <p className="mb-8 text-slate-400">
              Sua compra simulada foi concluída com sucesso.
            </p>

            <div className="mb-8 space-y-4 rounded-xl bg-slate-800 p-6">
              <div>
                <p className="mb-1 text-sm text-slate-400">Número do pedido</p>

                <p className="break-all font-mono text-sm">{order.id}</p>
              </div>

              <div>
                <p className="mb-1 text-sm text-slate-400">Status</p>

                <p className="font-bold text-green-400">
                  {order.status === "CONFIRMED" ? "Confirmado" : order.status}
                </p>
              </div>

              <div>
                <p className="mb-1 text-sm text-slate-400">Data do pedido</p>

                <p>{new Date(order.createdAt).toLocaleString("pt-BR")}</p>
              </div>
            </div>

            <h2 className="mb-5 text-2xl font-bold">NFTs adquiridos</h2>

            <div className="space-y-4">
              {order.items.map(({ nft, quantity }) => (
                <article
                  key={nft.id}
                  className="flex items-center gap-4 border-b border-slate-800 pb-4"
                >
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="h-20 w-20 shrink-0 rounded-xl object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold">{nft.name}</h3>

                    <p className="mt-1 text-sm text-slate-400">
                      Quantidade: {quantity}
                    </p>

                    <p className="text-sm text-slate-400">
                      {nft.price} ETH por unidade
                    </p>
                  </div>

                  <p className="font-semibold text-purple-400">
                    {(Number(nft.price) * quantity).toFixed(2)} ETH
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between gap-4 border-t border-slate-700 pt-6">
              <span className="text-lg font-bold">Total do pedido</span>

              <span className="text-2xl font-bold text-purple-400">
                {order.totalPrice.toFixed(2)} ETH
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/"
                search={{
                  search: "",
                  category: "all",
                  sort: "default",
                  page: 1,
                }}
                className="rounded-xl bg-purple-600 px-6 py-3 font-bold transition hover:bg-purple-500"
              >
                Voltar ao catálogo
              </Link>

              <Link
                to="/cart"
                className="rounded-xl border border-slate-700 px-6 py-3 font-semibold hover:bg-slate-800"
              >
                Ver carrinho
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
