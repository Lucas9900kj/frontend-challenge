import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  LogIn,
  LogOut,
  Menu,
  ShoppingCart,
  Sparkles,
  UserPlus,
  UserRound,
  Wallet,
  X,
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import { useRealtimeStock } from "../hooks/useRealtimeStock";

const catalogSearch = {
  search: "",
  category: "all",
  sort: "default",
  page: 1,
};

const navClass =
  "flex items-center gap-2 rounded-sm px-3 py-2 text-xs font-medium text-[#c7a88c] transition hover:bg-[#2b1b14] hover:text-[#f2b77e]";

const activeNavClass =
  "flex items-center gap-2 rounded-sm bg-[#352015] px-3 py-2 text-xs font-semibold text-[#e7a366]";

export default function AuthHeader() {
  const navigate = useNavigate();

  const { user, isLoading, logout, isLoggingOut } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  useRealtimeStock();

  function closeMenu() {
    setMenuOpen(false);
  }

  async function handleLogout() {
    try {
      await logout();
      closeMenu();

      await navigate({
        to: "/",
        search: catalogSearch,
      });
    } catch {
      window.alert("Não foi possível sair da conta.");
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#38251b] bg-[#160e0b]/95 text-[#f5e5cf] shadow-lg shadow-black/20 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* LOGO */}
        <Link
          to="/"
          search={catalogSearch}
          onClick={closeMenu}
          className="group flex shrink-0 items-center gap-2.5"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#6c432d] bg-[#302016] transition group-hover:border-[#d58a49]">
            <Sparkles className="h-4 w-4 text-[#d58a49]" />
          </span>

          <span className="text-sm font-black tracking-[0.12em] sm:text-base">
            KURIO
            <span className="ml-1 text-[#d58a49]">.</span>
          </span>
        </Link>

        {/* NAVEGAÇÃO DESKTOP */}
        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-1 md:flex"
        >
          <Link
            to="/"
            search={catalogSearch}
            activeOptions={{ exact: true }}
            className={navClass}
            activeProps={{
              className: activeNavClass,
            }}
          >
            Início
          </Link>
          <a href="/#catalogo" className={navClass}>Mercado</a>
          <a href="/#diario" className={navClass}>Criadores</a>
          <a href="/#diario" className={navClass}>Aprenda</a>

          <Link
            to="/cart"
            className={navClass}
            activeProps={{
              className: activeNavClass,
            }}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Carrinho
          </Link>

          {user && (
            <Link
              to="/wallets"
              className={navClass}
              activeProps={{
                className: activeNavClass,
              }}
            >
              <Wallet className="h-3.5 w-3.5" />
              Carteiras
            </Link>
          )}
        </nav>

        {/* CONTA DESKTOP */}
        <div className="hidden items-center gap-2 md:flex">
          {isLoading ? (
            <span className="text-xs text-[#a88b73]">Carregando sessão...</span>
          ) : user ? (
            <>
              <Link
                to="/profile"
                className="flex max-w-40 items-center gap-2 rounded-sm px-3 py-2 text-xs text-[#d6b99c] transition hover:bg-[#2b1b14] hover:text-[#e7a366]"
              >
                <UserRound className="h-4 w-4 shrink-0 text-[#d58a49]" />

                <span className="truncate">{user.name}</span>
              </Link>

              <button
                type="button"
                onClick={() => void handleLogout()}
                disabled={isLoggingOut}
                className="flex cursor-pointer items-center gap-2 rounded-sm border border-[#60402b] px-3 py-2 text-xs font-semibold text-[#d6b99c] transition hover:bg-[#302016] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LogOut className="h-3.5 w-3.5" />

                {isLoggingOut ? "Saindo..." : "Sair"}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-sm px-3 py-2 text-xs font-semibold text-[#d6b99c] transition hover:text-[#e7a366]"
              >
                <LogIn className="h-3.5 w-3.5" />
                Entrar
              </Link>

              <Link
                to="/signup"
                className="flex items-center gap-2 rounded-sm bg-[#d58a49] px-4 py-2 text-xs font-bold text-[#1b100b] transition hover:bg-[#f0a865]"
              >
                <UserPlus className="h-3.5 w-3.5" />
                Criar conta
              </Link>
            </>
          )}
        </div>

        {/* MENU MOBILE */}
        <button
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="jungle-mobile-menu"
          onClick={() => setMenuOpen((current) => !current)}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-sm border border-[#60402b] bg-[#251710] text-[#e7a366] transition hover:border-[#d58a49] md:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* NAVEGAÇÃO MOBILE */}
      {menuOpen && (
        <nav
          id="jungle-mobile-menu"
          aria-label="Navegação para celular"
          className="border-t border-[#38251b] bg-[#160e0b] px-4 pb-5 pt-4 md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            <Link
              to="/"
              search={catalogSearch}
              onClick={closeMenu}
              className="flex items-center justify-between rounded-sm px-4 py-3 text-sm text-[#e5c5a5] transition hover:bg-[#2b1b14]"
            >
              Mercado
              <ArrowRight className="h-4 w-4 text-[#d58a49]" />
            </Link>

            <Link
              to="/cart"
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-sm px-4 py-3 text-sm text-[#e5c5a5] transition hover:bg-[#2b1b14]"
            >
              <ShoppingCart className="h-4 w-4 text-[#d58a49]" />
              Carrinho
            </Link>

            <div className="my-2 border-t border-[#38251b]" />

            {isLoading ? (
              <p className="px-4 py-3 text-sm text-[#a88b73]">
                Carregando sessão...
              </p>
            ) : user ? (
              <>
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-sm px-4 py-3 text-sm text-[#e5c5a5] transition hover:bg-[#2b1b14]"
                >
                  <UserRound className="h-4 w-4 text-[#d58a49]" />

                  <span className="truncate">{user.name}</span>
                </Link>

                <Link
                  to="/wallets"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-sm px-4 py-3 text-sm text-[#e5c5a5] transition hover:bg-[#2b1b14]"
                >
                  <Wallet className="h-4 w-4 text-[#d58a49]" />
                  Minhas carteiras
                </Link>

                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  disabled={isLoggingOut}
                  className="flex cursor-pointer items-center gap-3 rounded-sm px-4 py-3 text-left text-sm font-medium text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
                >
                  <LogOut className="h-4 w-4" />

                  {isLoggingOut ? "Saindo..." : "Sair da conta"}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-sm px-4 py-3 text-sm text-[#e5c5a5] transition hover:bg-[#2b1b14]"
                >
                  <LogIn className="h-4 w-4 text-[#d58a49]" />
                  Entrar
                </Link>

                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 rounded-sm bg-[#d58a49] px-4 py-3 text-sm font-bold text-[#1b100b] transition hover:bg-[#f0a865]"
                >
                  <UserPlus className="h-4 w-4" />
                  Criar conta
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
