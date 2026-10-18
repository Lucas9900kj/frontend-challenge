import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Wallet, Plus, Trash2, Copy, UserRound, RefreshCw } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import {
  getWallets,
  connectWallet,
  disconnectWallet,
} from "../services/wallets";

export default function Wallets() {
  const { user, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const walletsQuery = useQuery({
    queryKey: ["wallets", user?.id],
    queryFn: getWallets,
    enabled: Boolean(user),
  });
  const connectMutation = useMutation({
    mutationFn: connectWallet,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["wallets", user?.id] });
    },
  });
  const disconnectMutation = useMutation({
    mutationFn: disconnectWallet,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["wallets", user?.id] });
    },
  });
  const wallets = walletsQuery.data ?? [];
  const busy = connectMutation.isPending || disconnectMutation.isPending;

  return (
    <main className="min-h-screen bg-[#160e0b] px-4 py-10 text-[#f5e5cf] sm:px-6">
      <div className="mx-auto max-w-5xl">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#d58a49]">
          Minha conta
        </p>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold sm:text-4xl">
              Minhas carteiras
            </h1>
            <p className="mt-2 text-sm text-[#c1a88f]">
              Gerencie suas carteiras digitais simuladas.
            </p>
          </div>
          {user && (
            <button
              type="button"
              disabled={busy || wallets.length >= 3}
              onClick={() => connectMutation.mutate()}
              className="inline-flex items-center gap-2 rounded-xl bg-[#bd743b] px-5 py-3 text-sm font-bold text-[#160e0b] hover:bg-[#d58a49] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={18} />{" "}
              {connectMutation.isPending
                ? "Conectando..."
                : "Conectar carteira"}
            </button>
          )}
        </div>
        {isLoading ? (
          <p
            role="status"
            className="rounded-2xl border border-[#503526] bg-[#291a14] p-8"
          >
            Carregando perfil...
          </p>
        ) : !user ? (
          <section className="rounded-2xl border border-[#503526] bg-[#291a14] p-8">
            <h2 className="text-xl font-bold">Acesso restrito</h2>
            <p className="my-4 text-[#c1a88f]">
              Faça login para gerenciar suas carteiras.
            </p>
            <Link
              to="/login"
              className="inline-flex rounded-xl bg-[#bd743b] px-5 py-3 font-bold text-[#160e0b]"
            >
              Fazer login
            </Link>
          </section>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[240px_1fr]">
            <aside className="rounded-2xl border border-[#503526] bg-[#291a14] p-5">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#39251b]">
                <Wallet className="h-8 w-8 text-[#d58a49]" />
              </div>
              <p className="font-bold">Carteiras digitais</p>
              <p className="mt-1 text-sm text-[#c1a88f]">
                {wallets.length} de 3 conectadas
              </p>
              <div className="mt-6 border-t border-[#503526] pt-4">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm text-[#dfcbb5] hover:bg-[#39251b]"
                >
                  <UserRound size={17} /> Meu perfil
                </Link>
                <Link
                  to="/wallets"
                  className="mt-2 flex items-center gap-2 rounded-lg bg-[#39251b] px-3 py-3 text-sm font-semibold text-[#d58a49]"
                >
                  <Wallet size={17} /> Minhas carteiras
                </Link>
              </div>
            </aside>
            <section className="min-w-0 space-y-5">
              {walletsQuery.isError && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300"
                >
                  Erro ao carregar as carteiras.{" "}
                  <button
                    type="button"
                    onClick={() => void walletsQuery.refetch()}
                    className="ml-2 inline-flex items-center gap-1 underline"
                  >
                    <RefreshCw size={14} /> Tentar novamente
                  </button>
                </div>
              )}
              {connectMutation.isError && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300"
                >
                  Erro ao conectar carteira.
                </p>
              )}
              {disconnectMutation.isError && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300"
                >
                  Erro ao desconectar carteira.
                </p>
              )}
              {walletsQuery.isLoading ? (
                <div
                  role="status"
                  className="rounded-2xl border border-[#503526] bg-[#291a14] p-8"
                >
                  Carregando carteiras...
                </div>
              ) : walletsQuery.isError ? null : wallets.length === 0 ? (
                <div className="rounded-2xl border border-[#503526] bg-[#291a14] p-10 text-center">
                  <Wallet size={44} className="mx-auto mb-4 text-[#d58a49]" />
                  <h2 className="text-xl font-bold">
                    Nenhuma carteira conectada
                  </h2>
                  <p className="mt-2 text-sm text-[#c1a88f]">
                    Clique em Conectar carteira para começar.
                  </p>
                </div>
              ) : (
                <div className="grid gap-5">
                  {wallets.map((wallet) => (
                    <article
                      key={wallet.id}
                      className="rounded-2xl border border-[#503526] bg-[#291a14] p-5 sm:p-6"
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <div className="rounded-xl bg-[#39251b] p-3">
                          <Wallet className="text-[#d58a49]" />
                        </div>
                        <div>
                          <h2 className="font-bold">Carteira Ethereum</h2>
                          <p className="text-xs text-[#c1a88f]">
                            Carteira de demonstração
                          </p>
                        </div>
                      </div>
                      <p className="mb-5 break-all rounded-lg border border-[#503526] bg-[#160e0b] p-3 font-mono text-sm text-[#dfcbb5]">
                        {wallet.address}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            void navigator.clipboard.writeText(wallet.address);
                          }}
                          className="inline-flex items-center gap-2 rounded-lg border border-[#65452f] px-4 py-2 text-sm font-semibold hover:bg-[#39251b]"
                        >
                          <Copy size={16} /> Copiar
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => {
                            if (window.confirm("Desconectar esta carteira?"))
                              disconnectMutation.mutate(wallet.id);
                          }}
                          className="inline-flex items-center gap-2 rounded-lg border border-red-900/60 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/10 disabled:opacity-40"
                        >
                          <Trash2 size={16} /> Desconectar
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
              <p className="text-sm text-[#c1a88f]">
                {wallets.length} de 3 carteiras conectadas.
              </p>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
