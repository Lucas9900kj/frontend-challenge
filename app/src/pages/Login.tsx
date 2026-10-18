import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  ArrowLeft,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { login } from "../services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

const catalogSearch = { search: "", category: "all", sort: "default", page: 1 };
const inputStyle =
  "h-12 border-[#65452f] bg-[#160e0b] text-[#f5e5cf] placeholder:text-[#a78b73] focus-visible:border-[#d58a49] focus-visible:ring-[#d58a49]/20";

export default function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const mutation = useMutation({ mutationFn: login });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      await mutation.mutateAsync({ email: email.trim(), password });
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      await navigate({ to: "/", search: catalogSearch });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        setError(data?.message ?? "Não foi possível entrar.");
      } else setError("Erro inesperado ao entrar.");
    }
  }

  return (
    <main className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-[#160e0b] px-4 py-12 text-[#f5e5cf]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(151,92,47,0.16),transparent_60%)]"
      />
      <div className="relative w-full max-w-md">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#65452f] bg-[#39251b]">
            <Sparkles className="h-7 w-7 text-[#d58a49]" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d58a49]">
            Jungle Marketplace
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Bem-vindo de volta
          </h1>
          <p className="mt-3 text-sm text-[#c1a88f]">
            Entre na sua conta para explorar o universo NFT.
          </p>
        </div>
        <section className="rounded-2xl border border-[#503526] bg-[#291a14] p-6 shadow-2xl shadow-black/30 sm:p-8">
          <h2 className="text-xl font-bold">Acessar conta</h2>
          <p className="mt-1 text-sm text-[#c1a88f]">
            Informe suas credenciais para continuar.
          </p>
          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="login-email"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Mail className="h-4 w-4 text-[#d58a49]" /> E-mail
              </label>
              <Input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={mutation.isPending}
                className={inputStyle}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="login-password"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <LockKeyhole className="h-4 w-4 text-[#d58a49]" /> Senha
              </label>
              <Input
                id="login-password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={mutation.isPending}
                className={inputStyle}
              />
            </div>
            {error && (
              <Alert
                role="alert"
                className="border-red-500/30 bg-red-500/10 text-red-300"
              >
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="h-12 w-full cursor-pointer bg-[#bd743b] text-base font-bold text-[#160e0b] hover:bg-[#d58a49] disabled:opacity-60"
            >
              {mutation.isPending ? "Entrando..." : "Entrar na conta"}
            </Button>
            <p className="flex items-center justify-center gap-2 text-xs text-[#a78b73]">
              <ShieldCheck className="h-4 w-4 text-[#d58a49]" /> Acesso
              demonstrativo ao marketplace
            </p>
          </form>
        </section>
        <p className="mt-7 text-center text-sm text-[#c1a88f]">
          Ainda não tem uma conta?{" "}
          <Link
            to="/signup"
            className="font-semibold text-[#d58a49] hover:text-[#e4aa74]"
          >
            Criar conta grátis
          </Link>
        </p>
        <Link
          to="/"
          search={catalogSearch}
          className="mt-6 flex items-center justify-center gap-2 text-sm text-[#a78b73] hover:text-[#f5e5cf]"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao catálogo
        </Link>
      </div>
    </main>
  );
}
