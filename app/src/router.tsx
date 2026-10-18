/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from "react";

import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  Link,
} from "@tanstack/react-router";

import AuthHeader from "./components/AuthHeader";

// Lazy Loading: cada página é carregada quando necessária.
const Home = lazy(() => import("./pages/Home"));
const NFTDetails = lazy(() => import("./pages/NFTDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));

const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));

const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Profile = lazy(() => import("./pages/Profile"));
const Wallets = lazy(() => import("./pages/Wallets"));

// Parâmetros de busca do catálogo.
export type CatalogSearch = {
  search: string;
  category: string;
  sort: string;
  page: number;
};

// Exibido enquanto uma página está sendo carregada.
function PageLoading() {
  return (
    <main
      role="status"
      className="flex min-h-[70vh] flex-col items-center justify-center bg-slate-950 px-4 text-white"
    >
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-purple-500" />

      <p className="mt-5 text-sm font-medium text-slate-400">
        Carregando página...
      </p>
    </main>
  );
}

// Layout principal.
function RootLayout() {
  return (
    <>
      <AuthHeader />

      <Suspense fallback={<PageLoading />}>
        <Outlet />
      </Suspense>
    </>
  );
}

// Rota principal.
const rootRoute = createRootRoute({
  component: RootLayout,
});

// Catálogo.
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",

  validateSearch: (search: Record<string, unknown>): CatalogSearch => ({
    search: typeof search.search === "string" ? search.search : "",

    category: typeof search.category === "string" ? search.category : "all",

    sort: typeof search.sort === "string" ? search.sort : "default",

    page:
      typeof search.page === "number" &&
      Number.isInteger(search.page) &&
      search.page > 0
        ? search.page
        : 1,
  }),

  component: Home,
});

// Detalhes do NFT.
const nftRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/nft/$nftId",
  component: NFTDetails,
});

// Carrinho.
const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: Cart,
});

// Checkout.
const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: Checkout,
});

// Confirmação do pedido.
const orderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/order/$orderId",
  component: OrderConfirmation,
});

// Login.
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});

// Cadastro.
const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: Signup,
});

// Perfil.
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: Profile,
});

// Carteiras.
const walletsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wallets",
  component: Wallets,
});

// Registro das rotas.
const routeTree = rootRoute.addChildren([
  homeRoute,
  nftRoute,
  cartRoute,
  checkoutRoute,
  orderRoute,
  loginRoute,
  signupRoute,
  profileRoute,
  walletsRoute,
]);

export const router = createRouter({
  routeTree,

  defaultNotFoundComponent: () => (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-slate-950 px-4 text-center text-white">
      <h1 className="text-5xl font-bold text-purple-400">404</h1>

      <p className="mt-4 text-xl font-semibold">Página não encontrada</p>

      <Link
        to="/"
        search={{
          search: "",
          category: "all",
          sort: "default",
          page: 1,
        }}
        className="mt-6 rounded-xl bg-purple-600 px-6 py-3 font-semibold transition hover:bg-purple-500"
      >
        Voltar ao catálogo
      </Link>
    </main>
  ),
});

// Tipagem das rotas do TanStack Router.
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
