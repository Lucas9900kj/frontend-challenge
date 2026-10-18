import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Wallet, Plus, Trash2, Copy } from "lucide-react";
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
      void queryClient.invalidateQueries({
        queryKey: ["wallets", user?.id],
      });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: disconnectWallet,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["wallets", user?.id],
      });
    },
  });

  if (isLoading) {
    return <main className="p-10">Carregando...</main>;
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-5xl p-10">
        <h1 className="mb-4 text-3xl font-bold">Acesso restrito</h1>
        <p className="mb-5">Faça login para gerenciar suas carteiras.</p>
        <Link to="/login" className="text-purple-400">
          Fazer login
        </Link>
      </main>
    );
  }

  const wallets = walletsQuery.data ?? [];

  return (
    <main className="mx-auto max-w-5xl p-8 text-white">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Minhas carteiras</h1>
          <p className="mt-2 text-slate-400">
            Gerencie suas carteiras digitais simuladas.
          </p>
        </div>

        <button
          type="button"
          disabled={connectMutation.isPending || wallets.length >= 3}
          onClick={() => connectMutation.mutate()}
          className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-semibold disabled:opacity-50"
        >
          <Plus size={18} />
          Conectar carteira
        </button>
      </div>

      {walletsQuery.isError && (
        <p role="alert" className="mb-4 text-red-400">
          Erro ao carregar as carteiras.
        </p>
      )}

      {connectMutation.isError && (
        <p role="alert" className="mb-4 text-red-400">
          Erro ao conectar carteira.
        </p>
      )}

      {disconnectMutation.isError && (
        <p role="alert" className="mb-4 text-red-400">
          Erro ao desconectar carteira.
        </p>
      )}

      {walletsQuery.isLoading ? (
        <p>Carregando carteiras...</p>
      ) : wallets.length === 0 ? (
        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-10 text-center">
          <Wallet size={44} className="mx-auto mb-4 text-purple-400" />
          <h2 className="text-xl font-semibold">Nenhuma carteira conectada</h2>
          <p className="mt-2 text-slate-400">
            Clique em Conectar carteira para começar.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className="rounded-2xl border border-slate-700 bg-slate-900 p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <Wallet className="text-purple-400" />
                <h2 className="text-lg font-bold">Carteira Ethereum</h2>
              </div>

              <p className="mb-4 break-all rounded-lg bg-slate-950 p-3 font-mono text-sm">
                {wallet.address}
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard.writeText(wallet.address);
                  }}
                  className="flex items-center gap-2 rounded-lg border border-slate-600 px-4 py-2"
                >
                  <Copy size={16} />
                  Copiar
                </button>

                <button
                  type="button"
                  disabled={disconnectMutation.isPending}
                  onClick={() => {
                    if (window.confirm("Desconectar esta carteira?")) {
                      disconnectMutation.mutate(wallet.id);
                    }
                  }}
                  className="flex items-center gap-2 rounded-lg border border-red-800 px-4 py-2 text-red-400"
                >
                  <Trash2 size={16} />
                  Desconectar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-6 text-sm text-slate-400">
        {wallets.length} de 3 carteiras conectadas.
      </p>
    </main>
  );
}
