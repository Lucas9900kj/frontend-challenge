import { Link } from "@tanstack/react-router";
import { Mail, UserRound, Wallet } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Profile() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-12">
        <p>Carregando perfil...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-12">
        <h1 className="mb-4 text-3xl font-bold">Acesso restrito</h1>

        <p className="mb-6 text-slate-400">
          Entre na sua conta para visualizar o perfil.
        </p>

        <Link
          to="/login"
          className="inline-block rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white"
        >
          Fazer login
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="mb-8 text-3xl font-bold">Meu perfil</h1>

      <section className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-7 text-white">
        <div className="flex items-center gap-3">
          <UserRound className="text-purple-400" />
          <div>
            <p className="text-sm text-slate-400">Nome</p>
            <p className="font-semibold">{user.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="text-purple-400" />
          <div>
            <p className="text-sm text-slate-400">E-mail</p>
            <p>{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Wallet className="text-purple-400" />
          <div>
            <p className="text-sm text-slate-400">Carteiras digitais</p>
            <p className="text-slate-300">Nenhuma carteira conectada.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
