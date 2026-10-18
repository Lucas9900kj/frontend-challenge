import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { Link, useParams } from "@tanstack/react-router";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Wallet,
} from "lucide-react";

import { getOrder } from "../services/orders";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

import { Alert, AlertDescription } from "@/components/ui/alert";

const catalogSearch = {
  search: "",
  category: "all",
  sort: "default",
  page: 1,
};

export default function OrderConfirmation() {
  const { orderId } = useParams({
    from: "/order/$orderId",
  });
  const [copied, setCopied] = useState(false);
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
  async function copyOrderId() {
    if (!order) return;
    try {
      await navigator.clipboard.writeText(order.id);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#160e0b] text-[#f5e5cf]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-[#bd743b]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#d58a49]/10 blur-3xl"
      />
      <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <Link
          to="/"
          search={catalogSearch}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#dfcbb5] transition hover:text-[#d58a49]"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao marketplace
        </Link>
        {isPending && (
          <div role="status" className="mt-10 space-y-5">
            <Skeleton className="mx-auto h-24 w-24 rounded-full bg-[#39251b]" />
            <Skeleton className="mx-auto h-10 w-72 max-w-full bg-[#39251b]" />
            <Skeleton className="h-44 w-full rounded-2xl bg-[#39251b]" />
            <Skeleton className="h-56 w-full rounded-2xl bg-[#39251b]" />
            <span className="sr-only">Carregando confirmação do pedido...</span>
          </div>
        )}
        {isError && (
          <Card className="mt-10 border-red-500/20 bg-[#291a14] text-[#f5e5cf]">
            <CardContent className="flex flex-col items-center p-8 text-center sm:p-12">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
                <RefreshCw className="h-9 w-9 text-red-400" />
              </div>
              <h1 className="mt-6 text-2xl font-black sm:text-3xl">
                Não foi possível consultar o pedido
              </h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-[#c1a88f]">
                Verifique sua conexão ou tente carregar a confirmação novamente.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button
                  type="button"
                  onClick={() => void refetch()}
                  className="h-12 cursor-pointer bg-[#bd743b] px-6 font-bold text-[#f5e5cf] hover:bg-[#d58a49]"
                >
                  <RefreshCw className="h-4 w-4" />
                  Tentar novamente
                </Button>
                <Link
                  to="/"
                  search={catalogSearch}
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-[#65452f] px-6 font-semibold text-[#f5e5cf] transition hover:bg-[#39251b]"
                >
                  Voltar ao catálogo
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
        {order && (
          <div className="mt-10 space-y-7">
            <section className="flex flex-col items-center text-center">
              <div className="relative mb-7">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-[#d58a49]/15 blur-2xl"
                />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-[#d58a49]/30 bg-[#d58a49]/10">
                  <CheckCircle2 className="h-12 w-12 text-[#d58a49]" />
                </div>
              </div>
              <Badge className="mb-5 border border-[#d58a49]/30 bg-[#d58a49]/10 px-4 py-1.5 text-[#e4aa74]">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                Compra finalizada
              </Badge>
              <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
                Pedido confirmado!
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#c1a88f] sm:text-base">
                Sua compra simulada foi concluída com sucesso. Confira abaixo os
                detalhes do seu pedido.
              </p>
            </section>
            <Card className="border-[#503526] bg-[#291a14] text-[#f5e5cf]">
              <CardContent className="p-5 sm:p-7">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d58a49]/10">
                    <PackageCheck className="h-5 w-5 text-[#d58a49]" />
                  </div>
                  <h2 className="text-xl font-black">Detalhes do pedido</h2>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="min-w-0">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#c1a88f]">
                      Número do pedido
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="min-w-0 break-all font-mono text-sm font-semibold">
                        {order.id}
                      </p>
                      <button
                        type="button"
                        onClick={() => void copyOrderId()}
                        aria-label="Copiar número do pedido"
                        title="Copiar número do pedido"
                        className="shrink-0 cursor-pointer rounded-lg border border-[#65452f] p-2 text-[#dfcbb5] transition hover:border-purple-500 hover:text-[#d58a49]"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-[#d58a49]" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {copied && (
                      <p role="status" className="mt-2 text-xs text-[#d58a49]">
                        Número copiado!
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#c1a88f]">
                      Status
                    </p>
                    <Badge
                      className={
                        order.status === "CONFIRMED"
                          ? "border border-[#d58a49]/30 bg-[#d58a49]/10 px-3 py-1 text-[#e4aa74]"
                          : "border border-[#65452f] bg-[#39251b] px-3 py-1 text-[#f0ddc5]"
                      }
                    >
                      <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                      {order.status === "CONFIRMED"
                        ? "Confirmado"
                        : order.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#c1a88f]">
                      Data do pedido
                    </p>
                    <p className="text-sm font-semibold">
                      {new Date(order.createdAt).toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#c1a88f]">
                      Tipo de transação
                    </p>
                    <p className="flex items-center gap-2 text-sm font-semibold">
                      <ShieldCheck className="h-4 w-4 text-[#d58a49]" />
                      Compra simulada
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#503526] bg-[#291a14] text-[#f5e5cf]">
              <CardContent className="p-5 sm:p-7">
                <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="flex items-center gap-3 text-xl font-black">
                    <ShoppingBag className="h-5 w-5 text-[#d58a49]" />
                    NFTs adquiridos
                  </h2>
                  <Badge className="border border-[#65452f] bg-[#39251b] px-3 py-1.5 text-[#dfcbb5]">
                    {order.items.reduce(
                      (total, item) => total + item.quantity,
                      0,
                    )}{" "}
                    itens
                  </Badge>
                </div>
                <div className="space-y-5">
                  {order.items.map(({ nft, quantity }) => (
                    <article
                      key={nft.id}
                      className="flex flex-col gap-4 border-b border-[#503526] pb-5 last:border-b-0 last:pb-0 sm:flex-row sm:items-center"
                    >
                      <img
                        src={nft.image}
                        alt={nft.name}
                        loading="lazy"
                        className="aspect-square w-full shrink-0 rounded-xl object-cover sm:h-24 sm:w-24"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="break-words text-lg font-bold">
                          {nft.name}
                        </h3>
                        <p className="mt-2 text-sm text-[#c1a88f]">
                          Quantidade: {quantity}
                        </p>
                        <p className="mt-1 text-sm text-[#c1a88f]">
                          {Number(nft.price).toFixed(2)} ETH por unidade
                        </p>
                      </div>
                      <div className="sm:text-right">
                        <p className="text-xs text-[#c1a88f]">Subtotal</p>
                        <p className="mt-1 text-lg font-black text-[#d58a49]">
                          {(Number(nft.price) * quantity).toFixed(2)} ETH
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-[#65452f] pt-6">
                  <div>
                    <p className="text-sm text-[#c1a88f]">Valor total</p>
                    <p className="mt-1 text-lg font-bold">Total do pedido</p>
                  </div>
                  <div className="text-right">
                    <p className="flex items-center justify-end gap-2 text-2xl font-black text-[#d58a49] sm:text-3xl">
                      <Wallet className="h-6 w-6" />
                      {order.totalPrice.toFixed(2)} ETH
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Alert className="border-emerald-500/20 bg-emerald-500/5 text-[#dfcbb5]">
              <ShieldCheck className="h-4 w-4 text-[#d58a49]" />
              <AlertDescription className="text-sm leading-relaxed text-[#dfcbb5]">
                Esta transação faz parte de um ambiente demonstrativo. Nenhuma
                cobrança real foi realizada.
              </AlertDescription>
            </Alert>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/"
                search={catalogSearch}
                className="inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-xl bg-[#bd743b] px-6 font-bold text-[#f5e5cf] transition hover:bg-[#d58a49]"
              >
                Explorar mais NFTs
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/cart"
                className="inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-xl border border-[#65452f] bg-[#291a14] px-6 font-semibold text-[#f5e5cf] transition hover:bg-[#39251b]"
              >
                <ShoppingBag className="h-4 w-4" />
                Ver carrinho
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
