import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";

import Home from "./pages/Home";
import NFTDetails from "./pages/NFTDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Wallets from "./pages/Wallets";
import AuthHeader from "./components/AuthHeader";

// Tipo utilizado pelo catálogo e seus filtros
export interface CatalogSearch {
  search: string;
  category: string;
  sort: string;
  page: number;
}

// ========================================
// ROTA PRINCIPAL
// ========================================

const rootRoute = createRootRoute({
  component: () => (
    <>
      <AuthHeader />
      <Outlet />
    </>
  ),
});

// ========================================
// HOME / CATÁLOGO
// ========================================

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

// ========================================
// DETALHES DO NFT
// ========================================

const nftDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/nft/$nftId",
  component: NFTDetails,
});

// ========================================
// CARRINHO
// ========================================

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: Cart,
});

// ========================================
// CHECKOUT
// ========================================

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: Checkout,
});

// ========================================
// CONFIRMAÇÃO DO PEDIDO
// ========================================

const orderConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/order/$orderId",
  component: OrderConfirmation,
});

// ========================================
// LOGIN
// ========================================

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});

// ========================================
// CADASTRO
// ========================================

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: Signup,
});

// ========================================
// PERFIL
// ========================================

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: Profile,
});

// ========================================
// CARTEIRAS DIGITAIS
// ========================================

const walletsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wallets",
  component: Wallets,
});

// ========================================
// ÁRVORE DE ROTAS
// ========================================

const routeTree = rootRoute.addChildren([
  homeRoute,
  nftDetailsRoute,
  cartRoute,
  checkoutRoute,
  orderConfirmationRoute,
  loginRoute,
  signupRoute,
  profileRoute,
  walletsRoute,
]);

// ========================================
// CONFIGURAÇÃO DO ROUTER
// ========================================

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

// ========================================
// TIPAGEM DO TANSTACK ROUTER
// ========================================

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
