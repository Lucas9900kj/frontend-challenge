import { useState, type FormEvent } from "react";

import { Link, useNavigate } from "@tanstack/react-router";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import axios from "axios";

import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import { signup } from "../services/auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Signup() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const mutation = useMutation({
    mutationFn: signup,
  });
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (name.trim().length < 2) {
      setError("Informe um nome com pelo menos 2 caracteres.");
      return;
    }
    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    try {
      await mutation.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      await queryClient.invalidateQueries({
        queryKey: ["auth", "me"],
      });
      await navigate({
        to: "/",
        search: {
          search: "",
          category: "all",
          sort: "default",
          page: 1,
        },
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        setError(data?.message ?? "Não foi possível cadastrar.");
      } else {
        setError("Erro inesperado ao cadastrar.");
      }
    }
  }
  return (
    <main className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-[#160e0b] px-4 py-12 text-[#f5e5cf]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-[#bd743b]/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[#d58a49]/5 blur-3xl"
      />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#9c633b]/40 bg-[#d58a49]/10 shadow-lg shadow-black/20">
            <Sparkles className="h-7 w-7 text-[#d58a49]" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d58a49]">
            Jungle Marketplace
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Crie sua conta
          </h1>
          <p className="mt-3 text-sm text-[#c1a88f]">
            Entre para o universo dos colecionáveis digitais.
          </p>
        </div>
        <Card className="border-[#503526] bg-[#291a14] text-[#f5e5cf] shadow-2xl shadow-black/30 backdrop-blur">
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl font-bold">
              Comece sua jornada
            </CardTitle>
            <CardDescription className="text-[#c1a88f]">
              Preencha seus dados para criar uma conta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="signup-name"
                  className="flex items-center gap-2 text-sm font-medium text-[#f0ddc5]"
                >
                  <UserRound className="h-4 w-4 text-[#d58a49]" />
                  Nome
                </label>
                <Input
                  id="signup-name"
                  type="text"
                  required
                  minLength={2}
                  autoComplete="name"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  disabled={mutation.isPending}
                  className="h-12 border-[#65452f] bg-[#160e0b] text-[#f5e5cf] placeholder:text-[#a78b73] focus-visible:border-[#d58a49] focus-visible:ring-[#d58a49]/30"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="signup-email"
                  className="flex items-center gap-2 text-sm font-medium text-[#f0ddc5]"
                >
                  <Mail className="h-4 w-4 text-[#d58a49]" />
                  E-mail
                </label>
                <Input
                  id="signup-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={mutation.isPending}
                  className="h-12 border-[#65452f] bg-[#160e0b] text-[#f5e5cf] placeholder:text-[#a78b73] focus-visible:border-[#d58a49] focus-visible:ring-[#d58a49]/30"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="signup-password"
                  className="flex items-center gap-2 text-sm font-medium text-[#f0ddc5]"
                >
                  <LockKeyhole className="h-4 w-4 text-[#d58a49]" />
                  Senha
                </label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="Mínimo de 8 caracteres"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={mutation.isPending}
                    className="h-12 border-[#65452f] bg-[#160e0b] pr-12 text-[#f5e5cf] placeholder:text-[#a78b73] focus-visible:border-[#d58a49] focus-visible:ring-[#d58a49]/30"
                  />
                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#c1a88f] transition hover:text-[#d58a49]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-[#a78b73]">
                  Use pelo menos 8 caracteres.
                </p>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="signup-confirm"
                  className="flex items-center gap-2 text-sm font-medium text-[#f0ddc5]"
                >
                  <LockKeyhole className="h-4 w-4 text-[#d58a49]" />
                  Confirmar senha
                </label>
                <div className="relative">
                  <Input
                    id="signup-confirm"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="Digite sua senha novamente"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    disabled={mutation.isPending}
                    className="h-12 border-[#65452f] bg-[#160e0b] pr-12 text-[#f5e5cf] placeholder:text-[#a78b73] focus-visible:border-[#d58a49] focus-visible:ring-[#d58a49]/30"
                  />
                  <button
                    type="button"
                    aria-label={
                      showConfirmPassword
                        ? "Ocultar confirmação de senha"
                        : "Mostrar confirmação de senha"
                    }
                    aria-pressed={showConfirmPassword}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#c1a88f] transition hover:text-[#d58a49]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {error && (
                <Alert
                  role="alert"
                  variant="destructive"
                  className="border-red-500/30 bg-red-500/10 text-red-300"
                >
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="h-12 w-full cursor-pointer bg-[#bd743b] text-base font-bold text-[#f5e5cf] hover:bg-[#d58a49] disabled:opacity-60"
              >
                {mutation.isPending ? "Criando conta..." : "Criar minha conta"}
              </Button>
              <div className="flex items-center justify-center gap-2 text-xs text-[#a78b73]">
                <ShieldCheck className="h-4 w-4 text-[#d58a49]" />
                Cadastro demonstrativo do marketplace
              </div>
            </form>
          </CardContent>
        </Card>
        <p className="mt-7 text-center text-sm text-[#c1a88f]">
          Já possui uma conta?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#d58a49] transition hover:text-[#e4aa74]"
          >
            Entrar
          </Link>
        </p>
        <Link
          to="/"
          search={{
            search: "",
            category: "all",
            sort: "default",
            page: 1,
          }}
          className="mt-6 flex items-center justify-center gap-2 text-sm text-[#a78b73] transition hover:text-[#f5e5cf]"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao catálogo
        </Link>
      </div>
    </main>
  );
}
