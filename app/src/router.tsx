import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";

import Home from "./pages/Home";
import NFTDetails from "./pages/NFTDetails";
import Cart from "./pages/Cart";

export interface CatalogSearch {
  search: string;
  category: string;
  sort: string;
  page: number;
}

const rootRoute = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: () => (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <h1 className="text-3xl font-bold">Página não encontrada</h1>
      <a href="/" className="mt-4 inline-block text-purple-400">
        Voltar ao início
      </a>
    </main>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  validateSearch: (search: Record<string, unknown>): CatalogSearch => {
    const page = Number(search.page);

    return {
      search: typeof search.search === "string" ? search.search : "",
      category: typeof search.category === "string" ? search.category : "all",
      sort: typeof search.sort === "string" ? search.sort : "default",
      page: Number.isInteger(page) && page > 0 ? page : 1,
    };
  },
  component: Home,
});

const nftRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/nft/$nftId",
  component: NFTDetails,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: Cart,
});

const routeTree = rootRoute.addChildren([homeRoute, nftRoute, cartRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
