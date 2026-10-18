import { Link, useNavigate } from "@tanstack/react-router";
import { LogIn, LogOut, UserRound, UserPlus } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useRealtimeStock } from "../hooks/useRealtimeStock";

export default function AuthHeader() {
  const navigate = useNavigate();
  const { user, isLoading, logout, isLoggingOut } = useAuth();
  useRealtimeStock();

  async function handleLogout() {
    try {
      await logout();

      await navigate({
        to: "/",
        search: {
          search: "",
          category: "all",
          sort: "default",
          page: 1,
        },
      });
    } catch {
      window.alert("Não foi possível sair da conta.");
    }
  }

  return (
    <header className="border-b border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4">
        <Link
          to="/"
          search={{
            search: "",
            category: "all",
            sort: "default",
            page: 1,
          }}
          className="text-xl font-extrabold tracking-tight"
        >
          JUNGLE <span className="text-purple-400">NFT</span>
        </Link>

        <nav
          aria-label="Navegação principal"
          className="flex flex-wrap items-center gap-4 text-sm"
        >
          <Link to="/cart" className="text-slate-300 hover:text-white">
            Carrinho
          </Link>

          {isLoading ? (
            <span className="text-slate-400">Carregando sessão...</span>
          ) : user ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 text-slate-200 hover:text-purple-400"
              >
                <UserRound size={17} />
                {user.name}
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 hover:bg-slate-800 disabled:opacity-50"
              >
                <LogOut size={16} />
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-2 text-slate-200 hover:text-white"
              >
                <LogIn size={16} />
                Entrar
              </Link>

              <Link
                to="/signup"
                className="flex items-center gap-2 rounded-lg bg-purple-600 px-3 py-2 font-semibold hover:bg-purple-500"
              >
                <UserPlus size={16} />
                Criar conta
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
