import { Link } from "@tanstack/react-router";
import { Mail, UserRound, Wallet, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Profile() {
  const { user, isLoading } = useAuth();
  return (
    <main className="min-h-screen bg-[#160e0b] px-4 py-10 text-[#f5e5cf] sm:px-6">
      <div className="mx-auto max-w-5xl">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#d58a49]">
          Minha conta
        </p>
        <h1 className="mb-3 text-3xl font-extrabold sm:text-4xl">Meu perfil</h1>
        <p className="mb-8 text-sm text-[#c1a88f]">
          Gerencie suas informações e suas carteiras digitais.
        </p>
        {isLoading ? (
          <div
            role="status"
            className="rounded-2xl border border-[#503526] bg-[#291a14] p-8"
          >
            Carregando perfil...
          </div>
        ) : !user ? (
          <section className="rounded-2xl border border-[#503526] bg-[#291a14] p-8">
            <h2 className="text-xl font-bold">Acesso restrito</h2>
            <p className="mb-6 mt-2 text-[#c1a88f]">
              Entre na sua conta para visualizar o perfil.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-[#bd743b] px-5 py-3 font-bold text-[#160e0b] hover:bg-[#d58a49]"
            >
              Fazer login <ArrowRight size={17} />
            </Link>
          </section>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[240px_1fr]">
            <aside className="rounded-2xl border border-[#503526] bg-[#291a14] p-5">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#39251b]">
                <UserRound className="h-8 w-8 text-[#d58a49]" />
              </div>
              <p className="break-words text-lg font-bold">{user.name}</p>
              <p className="mt-1 break-all text-xs text-[#c1a88f]">
                {user.email}
              </p>
              <div className="mt-6 border-t border-[#503526] pt-4">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 rounded-lg bg-[#39251b] px-3 py-3 text-sm font-semibold text-[#d58a49]"
                >
                  <UserRound size={17} /> Meu perfil
                </Link>
                <Link
                  to="/wallets"
                  className="mt-2 flex items-center gap-2 rounded-lg px-3 py-3 text-sm text-[#dfcbb5] hover:bg-[#39251b]"
                >
                  <Wallet size={17} /> Minhas carteiras
                </Link>
              </div>
            </aside>
            <section className="rounded-2xl border border-[#503526] bg-[#291a14] p-6 sm:p-8">
              <h2 className="mb-6 text-xl font-bold">Informações pessoais</h2>
              <div className="space-y-5">
                <div className="rounded-xl border border-[#503526] bg-[#21150f] p-4">
                  <p className="mb-2 flex items-center gap-2 text-xs text-[#c1a88f]">
                    <UserRound size={15} className="text-[#d58a49]" /> Nome
                  </p>
                  <p className="font-semibold">{user.name}</p>
                </div>
                <div className="rounded-xl border border-[#503526] bg-[#21150f] p-4">
                  <p className="mb-2 flex items-center gap-2 text-xs text-[#c1a88f]">
                    <Mail size={15} className="text-[#d58a49]" /> E-mail
                  </p>
                  <p className="break-all font-semibold">{user.email}</p>
                </div>
              </div>
              <div className="mt-7 rounded-xl border border-[#65452f] bg-[#39251b] p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#d58a49]" />
                  <div>
                    <h3 className="font-bold">Carteiras digitais</h3>
                    <p className="mt-1 text-sm text-[#c1a88f]">
                      Conecte e gerencie suas carteiras simuladas na área de
                      carteiras.
                    </p>
                  </div>
                </div>
                <Link
                  to="/wallets"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#d58a49] hover:text-[#e4aa74]"
                >
                  Gerenciar carteiras <ArrowRight size={16} />
                </Link>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
