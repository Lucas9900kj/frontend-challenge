import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { login } from "../services/auth";

export default function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: login,
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      await mutation.mutateAsync({ email, password });

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

        setError(data?.message ?? "Não foi possível entrar.");
      } else {
        setError("Erro inesperado ao entrar.");
      }
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 py-12 text-white">
      <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8">
        <h1 className="mb-2 text-3xl font-bold">Entrar</h1>

        <p className="mb-8 text-slate-400">
          Acesse sua conta no Jungle Marketplace.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="login-email" className="mb-2 block">
              E-mail
            </label>

            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="mb-2 block">
              Senha
            </label>

            <input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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
            {mutation.isPending ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-400">
          Não tem uma conta?{" "}
          <Link to="/signup" className="text-purple-400">
            Cadastre-se
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
          className="mt-5 block text-center text-sm text-slate-400"
        >
          Voltar ao catálogo
        </Link>
      </section>
    </main>
  );
}
