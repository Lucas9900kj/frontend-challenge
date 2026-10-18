import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { getNFTs } from "../services/nfts";
import type { CatalogSearch } from "../router";

const defaultFilters: CatalogSearch = {
  search: "",
  category: "all",
  sort: "default",
  page: 1,
};

const collections = [
  { name: "Arte digital", count: 33, category: "Art" },
  { name: "Fotografia", count: 12, category: "Art" },
  { name: "Música", count: 65, category: "Art" },
  { name: "Arte 3D", count: 39, category: "Art" },
  { name: "Colecionáveis", count: 23, category: "Gaming" },
  { name: "Generativa", count: 17, category: "Art" },
  { name: "Jogos", count: 19, category: "Gaming" },
  { name: "Assinaturas", count: 13, category: "Gaming" },
  { name: "Utilidade", count: 18, category: "Gaming" },
];

const networks = [
  { name: "Ethereum", count: 119 },
  { name: "Polygon", count: 78 },
  { name: "Solana", count: 86 },
];

const helpTopics = [
  {
    title: "Como comprar NFTs",
    content:
      "Explore o catálogo, selecione um NFT e clique para visualizar seus detalhes. Adicione o item ao carrinho, confira os valores e avance para o checkout. Neste projeto, a compra é simulada para demonstrar o funcionamento do marketplace.",
  },
  {
    title: "Carteira e segurança",
    content:
      "Acesse a área de carteiras para visualizar as opções de conexão simulada. Em uma plataforma real, nunca compartilhe sua frase de recuperação, senha ou chave privada. As carteiras deste projeto são demonstrativas.",
  },
  {
    title: "Política do mercado",
    content:
      "O KURIO é um marketplace demonstrativo desenvolvido para um desafio técnico. Os NFTs, preços, pagamentos e transações apresentados são simulados e não representam negociações reais em blockchain.",
  },
];

const articles = [
  {
    image: "/nfts/neon.png",
    date: "12 de setembro",
    title: "Como funciona a propriedade de NFTs",
    description: "Aprenda a colecionar, negociar e verificar ativos digitais.",
  },
  {
    image: "/nfts/emerald.png",
    date: "13 de setembro",
    title: "10 artistas digitais para acompanhar",
    description: "Conheça criadores que moldam a cultura digital.",
  },
  {
    image: "/nfts/sage.png",
    date: "15 de setembro",
    title: "Raridade, atributos e procedência",
    description: "Entenda os elementos que tornam cada obra única.",
  },
  {
    image: "/nfts/golden-beat.png",
    date: "15 de setembro",
    title: "Como proteger sua carteira",
    description: "Proteja seus ativos, suas chaves e sua identidade.",
  },
];

type CatalogTab = "all" | "new" | "trending";

export default function Home() {
  const navigate = useNavigate({ from: "/" });
  const filters = useSearch({ from: "/" });

  const [tab, setTab] = useState<CatalogTab>("all");
  const [network, setNetwork] = useState("Ethereum");
  const [priceMax, setPriceMax] = useState(12.3);
  const [appliedPrice, setAppliedPrice] = useState(12.3);
  const [activeArticle, setActiveArticle] = useState<
    (typeof articles)[number] | null
  >(null);
  const [activeHelp, setActiveHelp] = useState<
    (typeof helpTopics)[number] | null
  >(null);

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSent, setNewsletterSent] = useState(false);

  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: ["nfts", filters],
    queryFn: ({ signal }) => getNFTs(filters, signal),
  });

  function updateFilters(changes: Partial<CatalogSearch>) {
    void navigate({
      search: (previous) => ({
        ...previous,
        ...changes,
        page: changes.page ?? 1,
      }),
    });
  }

  function clearFilters() {
    setTab("all");
    setNetwork("Ethereum");
    setPriceMax(12.3);
    setAppliedPrice(12.3);

    void navigate({
      search: defaultFilters,
    });
  }

  const hasActiveFilters =
    filters.search !== "" ||
    filters.category !== "all" ||
    filters.sort !== "default" ||
    tab !== "all" ||
    appliedPrice !== 12.3;

  const visibleNFTs = useMemo(() => {
    if (!data) return [];

    let result = [...data.items];

    result = result.filter((nft) => Number(nft.price) <= appliedPrice);

    if (tab === "new") {
      result = [...result].reverse();
    }

    if (tab === "trending") {
      result = [...result].sort((a, b) => Number(b.price) - Number(a.price));
    }

    return result;
  }, [data, tab, appliedPrice]);

  const scrollToCatalog = () => {
    document.getElementById("catalogo")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <main className="min-h-screen bg-[#120b09] font-mono text-[#f5e9dc]">
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {/* HERO */}
        <section className="grid items-center gap-10 py-12 lg:grid-cols-[1.45fr_1fr] lg:gap-14 lg:py-20">
          <div>
            <p className="mb-7 text-sm font-bold tracking-wide">
              Bem-vindo à Kurio
            </p>

            <h1 className="max-w-3xl text-[clamp(2.1rem,4vw,4.6rem)] font-black uppercase leading-[1.35] tracking-tight text-[#f5f0e9]">
              SEJA DONO DO FUTURO
              <span className="mt-2 block">DA ARTE DIGITAL</span>
            </h1>

            <p className="mt-7 max-w-2xl text-sm leading-7 text-[#cba987] lg:text-base">
              Descubra NFTs selecionados de criadores emergentes e consagrados.
              Colecione arte digital rara, apoie artistas e tenha uma parte da
              cultura da internet.
            </p>

            <button
              type="button"
              onClick={scrollToCatalog}
              className="mt-9 cursor-pointer rounded-md bg-[#d78e4d] px-10 py-3.5 text-sm font-black text-[#1b100c] transition hover:bg-[#e9a66b]"
            >
              EXPLORAR
            </button>

            <div className="mt-12 flex justify-end gap-2 pr-8 lg:mt-16">
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className="h-2.5 w-2.5 rounded-full bg-[#d78e4d]"
                />
              ))}
            </div>
          </div>

          <img
            src="/nfts/emerald.png"
            alt="Emerald Ape, macaco colecionável com óculos e jaqueta verde"
            className="mx-auto aspect-square w-full max-w-[510px] rounded-[26px] object-cover"
          />
        </section>

        {/* CATÁLOGO */}
        <section id="catalogo" className="scroll-mt-24 pt-6">
          <div className="grid gap-7 lg:grid-cols-[230px_minmax(0,1fr)]">
            {/* BARRA LATERAL */}
            <aside className="space-y-5">
              <div className="bg-[#281812] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-base font-bold">Coleções</h2>

                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="cursor-pointer text-xs text-[#e4a164] hover:underline"
                    >
                      Limpar
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {collections.map((collection) => {
                    const selected = filters.category === collection.category;

                    return (
                      <button
                        key={collection.name}
                        type="button"
                        onClick={() =>
                          updateFilters({
                            category: selected ? "all" : collection.category,
                          })
                        }
                        className={`flex w-full cursor-pointer items-center justify-between gap-3 text-left text-xs transition ${
                          selected
                            ? "text-[#e5a166]"
                            : "text-[#cba383] hover:text-[#f5e9dc]"
                        }`}
                      >
                        <span>{collection.name}</span>
                        <span>({collection.count})</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-7 border-t border-[#493026] pt-5">
                  <h3 className="mb-5 text-sm font-bold">Faixa de preço</h3>

                  <input
                    type="range"
                    min="0.02"
                    max="12.3"
                    step="0.01"
                    value={priceMax}
                    onChange={(event) =>
                      setPriceMax(Number(event.target.value))
                    }
                    aria-label="Preço máximo em ETH"
                    className="w-full cursor-pointer accent-[#d78e4d]"
                  />

                  <p className="mt-3 text-xs text-[#cba383]">
                    Preço: 0,02 – {priceMax.toFixed(2)} ETH
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setAppliedPrice(priceMax);
                      updateFilters({ page: 1 });
                    }}
                    className="mt-3 cursor-pointer rounded-sm bg-[#d78e4d] px-4 py-2 text-xs font-bold text-[#1b100c]"
                  >
                    Aplicar
                  </button>
                </div>

                <div className="mt-7 border-t border-[#493026] pt-5">
                  <h3 className="mb-4 text-sm font-bold">Rede</h3>

                  <div className="space-y-3">
                    {networks.map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setNetwork(item.name)}
                        aria-pressed={network === item.name}
                        className={`flex w-full cursor-pointer justify-between text-xs ${
                          network === item.name
                            ? "text-[#e5a166]"
                            : "text-[#b99273] hover:text-[#f5e9dc]"
                        }`}
                      >
                        <span>{item.name}</span>
                        <span>({item.count})</span>
                      </button>
                    ))}
                  </div>

                  <p className="mt-4 text-[10px] leading-4 text-[#96745d]">
                    Rede selecionada: {network}. Visualização demonstrativa.
                  </p>
                </div>
              </div>

              {/* NFT EM DESTAQUE */}
              <div className="bg-[#281812] p-4">
                <p className="text-center text-sm font-bold uppercase text-[#d78e4d]">
                  NFT em destaque
                </p>

                <p className="mt-2 text-center text-xs font-bold uppercase">
                  Oferta limitada
                </p>

                <Link
                  to="/nft/$nftId"
                  params={{ nftId: "2" }}
                  className="mt-4 block overflow-hidden rounded-xl"
                >
                  <img
                    src="/nfts/sage.png"
                    alt="Sage Nomad"
                    className="aspect-square w-full object-cover transition hover:scale-105"
                  />
                </Link>
              </div>

              {/* BUSCA */}
              <div className="bg-[#281812] p-4">
                <label
                  htmlFor="nft-search"
                  className="mb-3 flex items-center gap-2 text-xs font-bold"
                >
                  <SlidersHorizontal size={15} />
                  Buscar NFT
                </label>

                <div className="relative">
                  <Search
                    size={15}
                    className="absolute left-3 top-3 text-[#aa8265]"
                  />

                  <input
                    id="nft-search"
                    type="search"
                    placeholder="Nome do NFT..."
                    value={filters.search}
                    onChange={(event) =>
                      updateFilters({
                        search: event.target.value,
                      })
                    }
                    className="w-full rounded-sm border border-[#5b3928] bg-[#170e0b] py-2.5 pl-9 pr-3 text-xs text-[#f5e9dc] outline-none placeholder:text-[#896b56] focus:border-[#d78e4d]"
                  />
                </div>
              </div>
            </aside>

            {/* ÁREA DOS NFTS */}
            <div className="min-w-0">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                <div
                  role="tablist"
                  aria-label="Exibição do catálogo"
                  className="flex flex-wrap items-center gap-4"
                >
                  {[
                    { id: "all", label: "Todos os NFTs" },
                    { id: "new", label: "Novos lançamentos" },
                    { id: "trending", label: "Em alta" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={tab === item.id}
                      onClick={() => setTab(item.id as CatalogTab)}
                      className={`cursor-pointer border-b-2 pb-2 text-xs font-bold transition ${
                        tab === item.id
                          ? "border-[#d78e4d] text-[#e7a36b]"
                          : "border-transparent text-[#c7aa91] hover:text-white"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <label className="flex items-center gap-2 text-xs text-[#cba383]">
                  <span>Ordenar por:</span>

                  <select
                    value={filters.sort}
                    onChange={(event) =>
                      updateFilters({
                        sort: event.target.value,
                      })
                    }
                    className="max-w-[175px] cursor-pointer border border-[#4c3023] bg-[#1b110d] px-2 py-2 text-xs text-[#f5e9dc] outline-none"
                  >
                    <option value="default">Recentemente</option>
                    <option value="price-asc">Menor preço</option>
                    <option value="price-desc">Maior preço</option>
                  </select>
                </label>
              </div>

              {isFetching && !isPending && (
                <p role="status" className="mb-3 text-xs text-[#d78e4d]">
                  Atualizando catálogo...
                </p>
              )}

              {/* CARREGAMENTO */}
              {isPending && (
                <div
                  role="status"
                  className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {Array.from({ length: 9 }).map((_, index) => (
                    <div key={index} className="animate-pulse bg-[#281812] p-2">
                      <div className="aspect-square bg-[#422a1e]" />
                      <div className="mt-3 h-4 w-3/4 bg-[#422a1e]" />
                      <div className="mt-2 h-3 w-1/3 bg-[#422a1e]" />
                    </div>
                  ))}

                  <span className="sr-only">Carregando NFTs...</span>
                </div>
              )}

              {/* ERRO */}
              {isError && (
                <div
                  role="alert"
                  className="border border-red-900 bg-red-950/30 p-6 text-sm text-red-200"
                >
                  Não foi possível carregar os NFTs.
                  <button
                    type="button"
                    onClick={() => void refetch()}
                    className="ml-3 cursor-pointer font-bold underline"
                  >
                    Tentar novamente
                  </button>
                </div>
              )}

              {/* SEM RESULTADOS */}
              {data && visibleNFTs.length === 0 && (
                <div className="border border-[#493026] bg-[#281812] p-10 text-center">
                  <Search size={28} className="mx-auto text-[#d78e4d]" />

                  <h3 className="mt-4 text-sm font-bold">
                    Nenhum NFT encontrado
                  </h3>

                  <p className="mt-2 text-xs text-[#b99273]">
                    Experimente alterar a busca ou os filtros.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 cursor-pointer bg-[#d78e4d] px-5 py-2 text-xs font-bold text-[#1b100c]"
                  >
                    Limpar filtros
                  </button>
                </div>
              )}

              {/* GRADE DE NFTS */}
              {data && visibleNFTs.length > 0 && (
                <div className="grid gap-x-4 gap-y-7 sm:grid-cols-2 xl:grid-cols-3">
                  {visibleNFTs.map((nft) => (
                    <Link
                      key={nft.id}
                      to="/nft/$nftId"
                      params={{ nftId: nft.id }}
                      className="group block min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-[#d78e4d]"
                    >
                      <div className="bg-[#281812] p-2">
                        <div className="relative aspect-square overflow-hidden rounded-xl">
                          <img
                            src={nft.image}
                            alt={nft.name}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />

                          {nft.available <= 0 && (
                            <span className="absolute left-2 top-2 bg-[#1b100c]/90 px-2 py-1 text-[10px] text-[#f1c59c]">
                              Esgotado
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-3">
                        <h3 className="truncate text-sm font-bold text-[#f5e9dc]">
                          {nft.name}
                        </h3>

                        <p className="mt-2 text-sm font-black text-[#d78e4d]">
                          {nft.price} ETH
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* PAGINAÇÃO */}
              {data && data.totalPages > 1 && (
                <nav
                  aria-label="Paginação do catálogo"
                  className="mt-9 flex flex-wrap justify-end gap-2"
                >
                  <button
                    type="button"
                    disabled={filters.page <= 1}
                    onClick={() =>
                      updateFilters({
                        page: filters.page - 1,
                      })
                    }
                    aria-label="Página anterior"
                    className="cursor-pointer border border-[#65412c] px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowLeft size={14} />
                  </button>

                  {Array.from(
                    { length: data.totalPages },
                    (_, index) => index + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => updateFilters({ page })}
                      aria-current={page === filters.page ? "page" : undefined}
                      className={`min-w-9 cursor-pointer border px-3 py-2 text-xs ${
                        page === filters.page
                          ? "border-[#d78e4d] bg-[#d78e4d] font-bold text-[#1b100c]"
                          : "border-[#65412c] text-[#f5e9dc]"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={filters.page >= data.totalPages}
                    onClick={() =>
                      updateFilters({
                        page: filters.page + 1,
                      })
                    }
                    aria-label="Próxima página"
                    className="cursor-pointer border border-[#65412c] px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowRight size={14} />
                  </button>
                </nav>
              )}

              <p className="mt-4 text-right text-[10px] text-[#99775e]">
                {data
                  ? `${data.total} NFTs no catálogo`
                  : "Carregando coleção..."}
              </p>
            </div>
          </div>
        </section>

        {/* BANNERS PROMOCIONAIS */}
        <section className="mt-20 grid gap-5 md:grid-cols-2">
          <div className="flex min-h-[210px] overflow-hidden bg-[#281812]">
            <img
              src="/nfts/emerald.png"
              alt=""
              loading="lazy"
              className="w-[42%] object-cover"
            />

            <div className="flex flex-1 flex-col items-center justify-center p-5 text-center">
              <h2 className="text-sm font-bold">
                Lançamentos geniais
                <br />
                de edição limitada
              </h2>

              <p className="mt-3 text-xs leading-5 text-[#cba383]">
                Colecione edições escassas diretamente dos criadores antes da
                revelação pública.
              </p>

              <button
                type="button"
                onClick={scrollToCatalog}
                className="mt-4 cursor-pointer rounded-sm bg-[#d78e4d] px-5 py-2 text-xs font-bold text-[#1b100c]"
              >
                Explorar <ArrowUpRight size={12} className="inline" />
              </button>
            </div>
          </div>

          <div className="flex min-h-[210px] overflow-hidden bg-[#281812]">
            <img
              src="/nfts/neon.png"
              alt=""
              loading="lazy"
              className="w-[42%] object-cover"
            />

            <div className="flex flex-1 flex-col items-center justify-center p-5 text-center">
              <h2 className="text-sm font-bold">
                Arte digital selecionada
                <br />e muito mais
              </h2>

              <p className="mt-3 text-xs leading-5 text-[#cba383]">
                Explore novos artistas, coleções verificadas e obras digitais
                que definem a cultura.
              </p>

              <button
                type="button"
                onClick={scrollToCatalog}
                className="mt-4 cursor-pointer rounded-sm bg-[#d78e4d] px-5 py-2 text-xs font-bold text-[#1b100c]"
              >
                Explorar <ArrowUpRight size={12} className="inline" />
              </button>
            </div>
          </div>
        </section>

        {/* DIÁRIO DA CUNHAGEM */}
        <section id="diario" className="mt-20">
          <h2 className="text-center text-2xl font-bold">Diário da Cunhagem</h2>

          <p className="mt-3 text-center text-xs text-[#b99273]">
            Histórias, guias e insights para colecionadores sobre o universo da
            propriedade digital.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {articles.map((article) => (
              <article
                key={article.title}
                role="button"
                tabIndex={0}
                onClick={() => setActiveArticle(article)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActiveArticle(article);
                  }
                }}
                className="cursor-pointer overflow-hidden bg-[#281812] transition hover:-translate-y-1 hover:bg-[#382218]"
              >
                <img
                  src={article.image}
                  alt=""
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />

                <div className="p-4">
                  <p className="text-[10px] text-[#cba383]">
                    {article.date} | Leitura de 3 min
                  </p>

                  <h3 className="mt-3 text-sm font-bold">{article.title}</h3>

                  <p className="mt-2 text-xs leading-5 text-[#cba383]">
                    {article.description}
                  </p>

                  <p className="mt-4 text-xs font-bold text-[#d78e4d]">
                    Ler mais →
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="mt-20 grid gap-7 bg-[#281812] p-6 md:grid-cols-4 md:p-9">
          {[
            {
              initial: "W",
              title: "Segurança da carteira",
              description:
                "Proteja sua carteira e colecione arte digital verificada com confiança.",
            },
            {
              initial: "C",
              title: "Criadores em destaque",
              description:
                "Conheça artistas, estúdios e comunidades que moldam a cultura digital.",
            },
            {
              initial: "D",
              title: "Alertas de lançamentos",
              description:
                "Receba calendários de cunhagem, novidades de listas de acesso e análises.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="border-r-0 border-[#865333] pr-4 md:border-r"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d78e4d] text-lg font-black text-[#1b100c]">
                {feature.initial}
              </div>

              <h3 className="mt-4 text-xs font-bold">{feature.title}</h3>

              <p className="mt-3 text-xs leading-5 text-[#cba383]">
                {feature.description}
              </p>
            </div>
          ))}

          <div>
            <h3 className="text-sm font-bold">
              Antecipe-se ao próximo lançamento
            </h3>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (newsletterEmail.trim()) {
                  setNewsletterSent(true);
                }
              }}
              className="mt-4 flex"
            >
              <input
                type="email"
                required
                aria-label="Seu e-mail"
                placeholder="digite seu e-mail..."
                value={newsletterEmail}
                onChange={(event) => {
                  setNewsletterEmail(event.target.value);
                  setNewsletterSent(false);
                }}
                className="min-w-0 flex-1 border border-[#60402c] bg-[#1b100c] px-3 py-2 text-xs outline-none focus:border-[#d78e4d]"
              />

              <button
                type="submit"
                className="cursor-pointer bg-[#d78e4d] px-3 py-2 text-xs font-bold text-[#1b100c]"
              >
                Enviar
              </button>
            </form>

            {newsletterSent ? (
              <p role="status" className="mt-3 text-xs text-[#d78e4d]">
                E-mail recebido nesta demonstração.
              </p>
            ) : (
              <p className="mt-3 text-[10px] leading-5 text-[#b99273]">
                Receba lançamentos selecionados, histórias de criadores e
                novidades do mercado.
              </p>
            )}
          </div>
        </section>
      </div>

      {activeArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setActiveArticle(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={activeArticle.title}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[#68452e] bg-[#281812] p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveArticle(null)}
              aria-label="Fechar artigo"
              className="absolute right-4 top-4 cursor-pointer bg-[#120b09] px-3 py-2 text-white"
            >
              ✕
            </button>

            <img
              src={activeArticle.image}
              alt=""
              className="mb-6 aspect-video w-full rounded-lg object-cover"
            />

            <p className="text-xs text-[#d78e4d]">
              {activeArticle.date} • Diário da Cunhagem
            </p>

            <h2 className="mt-4 text-2xl font-bold">{activeArticle.title}</h2>

            <p className="mt-5 text-sm leading-7 text-[#cba383]">
              {activeArticle.description}
            </p>

            <button
              type="button"
              onClick={() => setActiveArticle(null)}
              className="mt-7 cursor-pointer bg-[#d78e4d] px-6 py-3 text-sm font-bold text-[#1b100c]"
            >
              Voltar ao marketplace
            </button>
          </div>
        </div>
      )}

      {activeHelp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setActiveHelp(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={activeHelp.title}
            className="relative w-full max-w-xl rounded-xl border border-[#68452e] bg-[#281812] p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveHelp(null)}
              aria-label="Fechar ajuda"
              className="absolute right-4 top-4 cursor-pointer rounded bg-[#120b09] px-3 py-2 text-white"
            >
              ✕
            </button>

            <p className="text-xs font-bold uppercase text-[#d78e4d]">
              Central de Ajuda
            </p>

            <h2 className="mt-4 pr-8 text-xl font-bold text-[#f5e9dc]">
              {activeHelp.title}
            </h2>

            <p className="mt-5 text-sm leading-7 text-[#cba383]">
              {activeHelp.content}
            </p>

            <button
              type="button"
              onClick={() => setActiveHelp(null)}
              className="mt-7 cursor-pointer rounded bg-[#d78e4d] px-6 py-3 text-sm font-bold text-[#1b100c]"
            >
              Entendi
            </button>
          </div>
        </div>
      )}

      {/* RODAPÉ */}
      <footer className="border-t border-[#3d271b] bg-[#21140f]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-7 border-b border-[#493026] pb-8 md:grid-cols-4">
            <div>
              <h3 className="text-sm font-bold">Meu perfil</h3>
              <div className="mt-4 space-y-3 text-xs text-[#cba383]">
                <Link to="/profile" className="block hover:text-white">
                  Meu perfil
                </Link>
                <Link to="/wallets" className="block hover:text-white">
                  Minhas carteiras
                </Link>
                <Link to="/cart" className="block hover:text-white">
                  Meu carrinho
                </Link>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-xs text-[#cba383]">
              {helpTopics.map((topic) => (
                <button
                  key={topic.title}
                  type="button"
                  onClick={() => setActiveHelp(topic)}
                  className="block cursor-pointer text-left transition hover:text-[#d78e4d]"
                >
                  {topic.title}
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-3 text-xs text-[#cba383]">
              {["Arte digital", "Fotografia", "Música", "Arte 3D"].map(
                (collection) => (
                  <button
                    key={collection}
                    type="button"
                    onClick={() => {
                      updateFilters({ category: "Art", page: 1 });
                      scrollToCatalog();
                    }}
                    className="block cursor-pointer text-left transition hover:text-[#d78e4d]"
                  >
                    {collection}
                  </button>
                ),
              )}
            </div>

            <div>
              <h3 className="text-sm font-bold">KURIO</h3>
              <p className="mt-4 text-xs leading-6 text-[#cba383]">
                Feito para colecionadores, criadores e cultura digital.
              </p>
              <Link
                to="/cart"
                className="mt-4 inline-flex items-center gap-2 text-xs text-[#d78e4d]"
              >
                Explorar carrinho
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 py-6 text-xs text-[#cba383]">
            <span className="font-bold text-[#f5e9dc]">KURIO.</span>
            <span>© 2026 Kurio. Propriedade digital para todos.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
