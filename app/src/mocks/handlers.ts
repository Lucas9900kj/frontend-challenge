import { http, HttpResponse } from "msw";
import { nfts } from "./fixtures";
import type { NFT } from "./fixtures";

interface ServerCartItem {
  nft: NFT;
  quantity: number;
}

let serverCart: ServerCartItem[] = [];

function getCartResponse() {
  return {
    items: serverCart,
    totalItems: serverCart.reduce((total, item) => total + item.quantity, 0),
    totalPrice: serverCart.reduce(
      (total, item) => total + Number(item.nft.price) * item.quantity,
      0,
    ),
  };
}

export const handlers = [
  http.get("/api/nfts", ({ request }) => {
    const url = new URL(request.url);

    const search = url.searchParams.get("search")?.toLowerCase() ?? "";
    const category = url.searchParams.get("category") ?? "all";
    const sort = url.searchParams.get("sort") ?? "default";
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const limit = 2;

    let result = nfts.filter((nft) => {
      const matchesSearch = nft.name.toLowerCase().includes(search);
      const matchesCategory = category === "all" || nft.category === category;

      return matchesSearch && matchesCategory;
    });

    if (sort === "price-asc") {
      result = [...result].sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sort === "price-desc") {
      result = [...result].sort((a, b) => Number(b.price) - Number(a.price));
    }

    const total = result.length;
    const start = (page - 1) * limit;

    return HttpResponse.json({
      items: result.slice(start, start + limit),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  }),

  http.get("/api/nfts/:id", ({ params }) => {
    const nft = nfts.find((item) => item.id === params.id);

    if (!nft) {
      return HttpResponse.json(
        { message: "NFT não encontrado" },
        { status: 404 },
      );
    }

    return HttpResponse.json(nft);
  }),

  // Consultar carrinho
  http.get("/api/cart", () => {
    return HttpResponse.json(getCartResponse());
  }),

  // Adicionar NFT ao carrinho
  http.post("/api/cart/items", async ({ request }) => {
    const body = (await request.json()) as {
      nftId?: string;
      quantity?: number;
    };

    const nft = nfts.find((item) => item.id === body.nftId);

    if (!nft) {
      return HttpResponse.json(
        { message: "NFT não encontrado." },
        { status: 404 },
      );
    }

    const quantity = body.quantity;

    if (
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      return HttpResponse.json(
        { message: "Quantidade inválida." },
        { status: 400 },
      );
    }

    const existing = serverCart.find((item) => item.nft.id === nft.id);

    const currentQuantity = existing?.quantity ?? 0;

    if (currentQuantity + quantity > nft.available) {
      return HttpResponse.json(
        { message: "Estoque insuficiente." },
        { status: 409 },
      );
    }

    if (existing) {
      serverCart = serverCart.map((item) =>
        item.nft.id === nft.id
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      );
    } else {
      serverCart = [...serverCart, { nft, quantity }];
    }

    return HttpResponse.json(getCartResponse(), {
      status: 201,
    });
  }),

  // Alterar quantidade de um NFT no carrinho
  http.patch("/api/cart/items/:nftId", async ({ params, request }) => {
    const body = (await request.json()) as {
      quantity?: number;
    };

    const existing = serverCart.find((item) => item.nft.id === params.nftId);

    if (!existing) {
      return HttpResponse.json(
        { message: "Item não encontrado no carrinho." },
        { status: 404 },
      );
    }

    const quantity = body.quantity;

    if (
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      return HttpResponse.json(
        { message: "Quantidade inválida." },
        { status: 400 },
      );
    }

    if (quantity > existing.nft.available) {
      return HttpResponse.json(
        { message: "Estoque insuficiente." },
        { status: 409 },
      );
    }

    serverCart = serverCart.map((item) =>
      item.nft.id === params.nftId ? { ...item, quantity } : item,
    );

    return HttpResponse.json(getCartResponse());
  }),

  // Remover um NFT do carrinho
  http.delete("/api/cart/items/:nftId", ({ params }) => {
    serverCart = serverCart.filter((item) => item.nft.id !== params.nftId);

    return HttpResponse.json(getCartResponse());
  }),

  // Esvaziar o carrinho
  http.delete("/api/cart", () => {
    serverCart = [];

    return HttpResponse.json(getCartResponse());
  }),
];
