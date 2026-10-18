import { useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Wallet,
} from "lucide-react";

import { useCartApi } from "../hooks/useCartApi";
import { createOrder } from "../services/orders";

const catalogSearch = {
  search: "",
  category: "all",
  sort: "default",
  page: 1,
};

const copperButton =
  "inline-flex items-center justify-center gap-2 rounded-sm bg-[#d58a49] px-5 py-3 text-sm font-bold text-[#1b100b] transition hover:bg-[#f0a865] disabled:cursor-not-allowed disabled:opacity-40";

export default function Checkout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { cartQuery } = useCartApi();
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");

  // Reutiliza a mesma chave em tentativas do mesmo pedido.
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

      await queryClient.invalidateQueries({ queryKey: ["cart"] });
      await queryClient.invalidateQueries({ queryKey: ["nfts"] });
      await queryClient.invalidateQueries({ queryKey: ["nft"] });

      await navigate({
        to: "/order/$orderId",
        params: { orderId: order.id },
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
    <main className="min-h-screen bg-[#120b09] text-[#f5e5cf]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-sm text-[#c8a88c] transition hover:text-[#e5a268]"
        >
          <ArrowLeft size={17} /> Voltar ao carrinho
        </Link>

        <header className="mb-8 mt-8">
          <span className="inline-flex rounded-sm border border-[#70472c] bg-[#392419] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#e7ae76]">
            Checkout
          </span>
          <h1 className="mt-4 flex items-center gap-3 text-3xl font-black tracking-tight text-[#fff0d9] sm:text-4xl">
            <ShoppingBag className="h-8 w-8 shrink-0 text-[#d58a49]" />
            Finalizar compra
          </h1>
          <p className="mt-3 text-sm text-[#bda18a]">
            Revise seus colecionáveis digitais e confirme seu pedido.
          </p>
        </header>

        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-sm border border-[#493026] bg-[#20140f] p-4">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
            <div>
              <p className="text-sm font-bold">Carrinho</p>
              <p className="text-xs text-[#a88b73]">Itens selecionados</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-sm border border-[#a36b3c] bg-[#392419] p-4">
            <CreditCard className="h-5 w-5 shrink-0 text-[#e5a268]" />
            <div>
              <p className="text-sm font-bold">Confirmação</p>
              <p className="text-xs text-[#c8a88c]">Revisar pedido</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-sm border border-[#38251b] bg-[#20140f] p-4">
            <PackageCheck className="h-5 w-5 shrink-0 text-[#866d59]" />
            <div>
              <p className="text-sm font-bold text-[#bda18a]">
                Pedido concluído
              </p>
              <p className="text-xs text-[#866d59]">Após confirmação</p>
            </div>
          </div>
        </div>

        {cartQuery.isPending && (
          <div
            role="status"
            className="grid animate-pulse items-start gap-6 lg:grid-cols-3"
          >
            <div className="space-y-4 lg:col-span-2">
              <div className="h-36 rounded-sm bg-[#302016]" />
              <div className="h-36 rounded-sm bg-[#302016]" />
            </div>
            <div className="h-96 rounded-sm bg-[#302016]" />
            <span className="sr-only">Carregando carrinho...</span>
          </div>
        )}

        {cartQuery.isError && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-4 rounded-sm border border-red-900 bg-red-950/30 p-5 text-red-200"
          >
            <span>Não foi possível carregar seu carrinho.</span>
            <button
              type="button"
              onClick={() => void cartQuery.refetch()}
              className={copperButton}
            >
              <RefreshCw size={16} /> Tentar novamente
            </button>
          </div>
        )}

        {cart && cart.items.length === 0 && (
          <section className="flex flex-col items-center rounded-sm border border-[#38251b] bg-[#20140f] px-6 py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-sm border border-[#60402b] bg-[#302016]">
              <ShoppingBag className="h-10 w-10 text-[#d58a49]" />
            </div>
            <h2 className="mt-6 text-2xl font-black text-[#fff0d9]">
              Seu carrinho está vazio
            </h2>
            <p className="mt-3 text-sm text-[#bda18a]">
              Adicione um NFT antes de continuar.
            </p>
            <Link
              to="/"
              search={catalogSearch}
              className={`mt-7 ${copperButton}`}
            >
              Explorar NFTs <ArrowRight size={17} />
            </Link>
          </section>
        )}

        {cart && cart.items.length > 0 && (
          <div className="grid items-start gap-7 lg:grid-cols-3">
            <section
              aria-label="Revisão dos itens"
              className="min-w-0 space-y-4 lg:col-span-2"
            >
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-black text-[#fff0d9] sm:text-2xl">
                  Revisão dos itens
                </h2>
                <span className="rounded-sm border border-[#60402b] bg-[#302016] px-3 py-1.5 text-xs text-[#e7ae76]">
                  {cart.totalItems} {cart.totalItems === 1 ? "NFT" : "NFTs"}
                </span>
              </div>

              {cart.items.map(({ nft, quantity }) => (
                <article
                  key={nft.id}
                  className="flex flex-col gap-5 rounded-sm border border-[#38251b] bg-[#20140f] p-4 sm:flex-row sm:p-5"
                >
                  <Link
                    to="/nft/$nftId"
                    params={{ nftId: nft.id }}
                    className="shrink-0 overflow-hidden rounded-sm"
                  >
                    <img
                      src={nft.image}
                      alt={nft.name}
                      loading="lazy"
                      className="aspect-square w-full object-cover sm:h-32 sm:w-32"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#d58a49]">
                        Colecionável digital
                      </p>
                      <Link
                        to="/nft/$nftId"
                        params={{ nftId: nft.id }}
                        className="block break-words text-lg font-bold text-[#fff0d9] transition hover:text-[#e5a268] sm:text-xl"
                      >
                        {nft.name}
                      </Link>
                      <p className="mt-2 text-sm text-[#a88b73]">
                        Criador: {nft.creator}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-end justify-between gap-4 border-t border-[#493026] pt-4">
                      <div>
                        <p className="text-xs text-[#a88b73]">Quantidade</p>
                        <p className="mt-1 font-semibold">
                          {quantity} {quantity === 1 ? "unidade" : "unidades"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[#a88b73]">Subtotal</p>
                        <p className="mt-1 text-lg font-black text-[#e5a268]">
                          {(Number(nft.price) * quantity).toFixed(2)} ETH
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              <div className="flex items-start gap-3 rounded-sm border border-[#38251b] bg-[#20140f] p-5">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#d58a49]" />
                <div>
                  <p className="text-sm font-bold">Ambiente de demonstração</p>
                  <p className="mt-2 text-sm leading-relaxed text-[#bda18a]">
                    Esta compra é simulada. Nenhum pagamento real será
                    processado.
                  </p>
                </div>
              </div>
            </section>

            <aside className="lg:sticky lg:top-24">
              <div className="rounded-sm border border-[#493026] bg-[#20140f] p-5 shadow-xl shadow-black/20 sm:p-6">
                <div className="mb-7 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-[#60402b] bg-[#302016]">
                    <Wallet className="h-5 w-5 text-[#d58a49]" />
                  </div>
                  <h2 className="text-xl font-black text-[#fff0d9]">
                    Resumo do pedido
                  </h2>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-[#bda18a]">Quantidade</span>
                    <span className="font-semibold">
                      {cart.totalItems}{" "}
                      {cart.totalItems === 1 ? "item" : "itens"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-[#bda18a]">Subtotal</span>
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

                <label className="mt-8 flex cursor-pointer items-start gap-3 rounded-sm border border-[#60402b] bg-[#170e0b] p-4">
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(event) => setAccepted(event.target.checked)}
                    disabled={checkoutMutation.isPending}
                    className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[#d58a49]"
                  />
                  <span className="text-sm leading-relaxed text-[#d6b99c]">
                    Confirmo os itens do pedido e entendo que esta compra é uma
                    simulação, sem pagamento real.
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => void handleCheckout()}
                  disabled={!accepted || checkoutMutation.isPending}
                  className={`mt-6 min-h-14 w-full ${copperButton}`}
                >
                  {checkoutMutation.isPending ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      Processando pedido...
                    </>
                  ) : (
                    <>
                      <LockKeyhole className="h-5 w-5" />
                      Confirmar pedido
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                {error && (
                  <p
                    role="alert"
                    className="mt-5 rounded-sm border border-red-900 bg-red-950/30 p-3 text-sm text-red-200"
                  >
                    {error}
                  </p>
                )}

                <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-[#a88b73]">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-[#d58a49]" />
                  Nenhuma cobrança será realizada.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
