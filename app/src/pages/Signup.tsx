import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { signup } from "../services/auth";

export default function Signup() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: signup,
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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
        name,
        email,
        password,
      });

      await queryClient.invalidateQueries({
        queryKey: ["auth", "me"],
      });

      await navigate({
        to: "/",
        search: { search: "", category: "all", sort: "default", page: 1 },
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
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 py-12 text-white">
      <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8">
        <h1 className="mb-2 text-3xl font-bold">Criar conta</h1>

        <p className="mb-8 text-slate-400">
          Cadastre-se para explorar o marketplace.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="signup-name" className="mb-2 block">
              Nome
            </label>

            <input
              id="signup-name"
              required
              minLength={2}
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3"
            />
          </div>

          <div>
            <label htmlFor="signup-email" className="mb-2 block">
              E-mail
            </label>

            <input
              id="signup-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3"
            />
          </div>

          <div>
            <label htmlFor="signup-password" className="mb-2 block">
              Senha
            </label>

            <input
              id="signup-password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3"
            />
          </div>

          <div>
            <label htmlFor="signup-confirm" className="mb-2 block">
              Confirmar senha
            </label>

            <input
              id="signup-confirm"
              type="password"
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-xl bg-purple-600 px-5 py-4 font-bold disabled:opacity-50"
          >
            {mutation.isPending ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-400">
          Já possui uma conta?{" "}
          <Link to="/login" className="text-purple-400">
            Entrar
          </Link>
        </p>
      </section>
    </main>
  );
}
