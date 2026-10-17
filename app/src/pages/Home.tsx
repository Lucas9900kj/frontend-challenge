import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { getNFTs } from "../services/nfts";
import type { CatalogSearch } from "../router";

export default function Home() {
  const navigate = useNavigate({ from: "/" });
  const filters = useSearch({ from: "/" });

  function updateFilters(changes: Partial<CatalogSearch>) {
    navigate({
      search: (previous) => ({
        ...previous,
        ...changes,
        page: changes.page ?? 1,
      }),
    });
  }

  const { data, isPending, isError, refetch, isFetching } = useQuery({
    queryKey: ["nfts", filters],
    queryFn: ({ signal }) => getNFTs(filters, signal),
  });

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 flex items-center justify-between gap-4">
          <Link
            to="/"
            search={{
              search: "",
              category: "all",
              sort: "default",
              page: 1,
            }}
          >
            <h1 className="text-3xl font-bold">
              Jungle <span className="text-purple-400">NFT</span>
            </h1>
          </Link>

          <Link
            to="/cart"
            className="rounded-xl bg-purple-600 px-5 py-3 font-semibold"
          >
            Meu carrinho
          </Link>
        </header>

        <h2 className="mb-2 text-4xl font-bold">Explore NFTs exclusivos</h2>

        <p className="mb-8 text-slate-400">
          Descubra colecionáveis digitais incríveis.
        </p>

        <section
          aria-label="Filtros do catálogo"
          className="mb-10 grid gap-4 md:grid-cols-3"
        >
          <div>
            <label htmlFor="search" className="mb-2 block text-sm">
              Buscar NFT
            </label>

            <input
              id="search"
              type="search"
              placeholder="Digite o nome do NFT..."
              value={filters.search}
              onChange={(event) =>
                updateFilters({ search: event.target.value })
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white"
            />
          </div>

          <div>
            <label htmlFor="category" className="mb-2 block text-sm">
              Categoria
            </label>

            <select
              id="category"
              value={filters.category}
              onChange={(event) =>
                updateFilters({ category: event.target.value })
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white"
            >
              <option value="all">Todas as categorias</option>
              <option value="Art">Arte</option>
              <option value="Gaming">Gaming</option>
            </select>
          </div>

          <div>
            <label htmlFor="sort" className="mb-2 block text-sm">
              Ordenar por
            </label>

            <select
              id="sort"
              value={filters.sort}
              onChange={(event) => updateFilters({ sort: event.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white"
            >
              <option value="default">Padrão</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
            </select>
          </div>
        </section>

        {isFetching && !isPending && (
          <p role="status" className="mb-4 text-sm text-purple-400">
            Atualizando catálogo...
          </p>
        )}

        {isPending && (
          <div
            role="status"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-2xl bg-slate-800 motion-reduce:animate-none"
              />
            ))}
            <span className="sr-only">Carregando NFTs...</span>
          </div>
        )}

        {isError && (
          <div role="alert">
            <p>Não foi possível carregar os NFTs.</p>
            <button
              onClick={() => refetch()}
              className="mt-4 rounded-lg bg-purple-600 px-5 py-2"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {data && data.items.length === 0 && (
          <p>Nenhum NFT encontrado para os filtros selecionados.</p>
        )}

        {data && (
          <>
            <p className="mb-5 text-sm text-slate-400">
              {data.total} NFTs encontrados
            </p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {data.items.map((nft) => (
                <Link
                  key={nft.id}
                  to="/nft/$nftId"
                  params={{ nftId: nft.id }}
                  className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition hover:border-purple-500"
                >
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="aspect-square w-full object-cover"
                    loading="lazy"
                  />

                  <div className="p-5">
                    <p className="text-sm text-purple-400">{nft.creator}</p>

                    <h3 className="mt-2 text-xl font-bold">{nft.name}</h3>

                    <div className="mt-5 flex justify-between">
                      <span className="text-slate-400">Preço</span>
                      <span className="font-bold">{nft.price} ETH</span>
                    </div>

                    <p className="mt-3 text-sm text-slate-400">
                      {nft.available} disponíveis
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {data.totalPages > 1 && (
              <nav
                aria-label="Paginação do catálogo"
                className="mt-10 flex items-center justify-center gap-4"
              >
                <button
                  disabled={filters.page <= 1}
                  onClick={() => updateFilters({ page: filters.page - 1 })}
                  className="rounded-lg bg-slate-800 px-5 py-3 disabled:opacity-40"
                >
                  Anterior
                </button>

                <span>
                  Página {filters.page} de {data.totalPages}
                </span>

                <button
                  disabled={filters.page >= data.totalPages}
                  onClick={() => updateFilters({ page: filters.page + 1 })}
                  className="rounded-lg bg-purple-600 px-5 py-3 disabled:opacity-40"
                >
                  Próxima
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </main>
  );
}
