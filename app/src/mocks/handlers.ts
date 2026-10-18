import { http, HttpResponse } from "msw";
import { nfts } from "./fixtures";
import type { NFT } from "./fixtures";
import { publishStockUpdate } from "../services/socket";

// ======================================================
// TIPOS
// ======================================================

interface ServerCartItem {
  nft: NFT;
  quantity: number;
}

interface Order {
  id: string;
  items: ServerCartItem[];
  totalItems: number;
  totalPrice: number;
  status: "CONFIRMED";
  createdAt: string;
}

interface SavedState {
  cart: {
    nftId: string;
    quantity: number;
  }[];
  orders: Order[];
  idempotency: {
    key: string;
    orderId: string;
    fingerprint: string;
  }[];
  stock: {
    id: string;
    available: number;
    version: number;
  }[];
}

interface DemoUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface PublicUser {
  id: string;
  name: string;
  email: string;
}

interface AuthSession {
  token: string;
  user: PublicUser;
}

interface DemoWallet {
  id: string;
  userId: string;
  address: string;
  network: "Ethereum";
  connectedAt: string;
}

// ======================================================
// CHAVES DE ARMAZENAMENTO
// ======================================================

const STORAGE_KEY = "jungle-marketplace-state-v1";
const USERS_KEY = "jungle-demo-users-v1";
const SESSION_KEY = "jungle-demo-session-v1";
const WALLETS_KEY = "jungle-demo-wallets-v1";

// ======================================================
// ESTADO DO MARKETPLACE
// ======================================================

const orders = new Map<string, Order>();

const idempotencyKeys = new Map<
  string,
  {
    order: Order;
    fingerprint: string;
  }
>();

let serverCart: ServerCartItem[] = [];

// ======================================================
// PERSISTÊNCIA DO MARKETPLACE
// ======================================================

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return;

    const state = JSON.parse(raw) as SavedState;

    if (Array.isArray(state.stock)) {
      for (const saved of state.stock) {
        const nft = nfts.find((item) => item.id === saved.id);

        if (
          nft &&
          Number.isInteger(saved.available) &&
          saved.available >= 0 &&
          Number.isInteger(saved.version) &&
          saved.version >= 1
        ) {
          nft.available = saved.available;
          nft.version = saved.version;
        }
      }
    }

    if (Array.isArray(state.orders)) {
      for (const order of state.orders) {
        if (order?.id) {
          orders.set(order.id, order);
        }
      }
    }

    if (Array.isArray(state.idempotency)) {
      for (const saved of state.idempotency) {
        const order = orders.get(saved.orderId);

        if (order && saved.key) {
          idempotencyKeys.set(saved.key, {
            order,
            fingerprint: saved.fingerprint,
          });
        }
      }
    }

    if (Array.isArray(state.cart)) {
      serverCart = state.cart.flatMap((saved) => {
        const nft = nfts.find((item) => item.id === saved.nftId);

        if (
          !nft ||
          !Number.isInteger(saved.quantity) ||
          saved.quantity < 1 ||
          saved.quantity > nft.available
        ) {
          return [];
        }

        return [
          {
            nft,
            quantity: saved.quantity,
          },
        ];
      });
    }
  } catch (error) {
    console.error("Erro ao carregar dados do marketplace:", error);
  }
}

function saveState() {
  const state: SavedState = {
    cart: serverCart.map(({ nft, quantity }) => ({
      nftId: nft.id,
      quantity,
    })),

    orders: [...orders.values()],

    idempotency: [...idempotencyKeys.entries()].map(([key, value]) => ({
      key,
      orderId: value.order.id,
      fingerprint: value.fingerprint,
    })),

    stock: nfts.map((nft) => ({
      id: nft.id,
      available: nft.available,
      version: nft.version,
    })),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Erro ao salvar dados do marketplace:", error);
  }
}

loadState();

// ======================================================
// FUNÇÕES DO CARRINHO
// ======================================================

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

function getCartFingerprint() {
  return JSON.stringify(
    serverCart
      .map(({ nft, quantity }) => ({
        nftId: nft.id,
        quantity,
      }))
      .sort((a, b) => a.nftId.localeCompare(b.nftId)),
  );
}

// ======================================================
// FUNÇÕES DE AUTENTICAÇÃO DEMONSTRATIVA
// ======================================================

function readUsers(): DemoUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);

    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);

    return Array.isArray(parsed) ? (parsed as DemoUser[]) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: DemoUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);

    if (!raw) return null;

    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

function saveSession(session: AuthSession | null) {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

function createSession(user: DemoUser): AuthSession {
  const session: AuthSession = {
    token: crypto.randomUUID(),

    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };

  saveSession(session);

  return session;
}

function getAuthenticatedUser(request: Request): PublicUser | null {
  const session = readSession();

  if (
    !session ||
    request.headers.get("Authorization") !== `Bearer ${session.token}`
  ) {
    return null;
  }

  const user = readUsers().find((item) => item.id === session.user.id);

  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

// ======================================================
// FUNÇÕES DAS CARTEIRAS DIGITAIS
// ======================================================

function readWallets(): DemoWallet[] {
  try {
    const raw = localStorage.getItem(WALLETS_KEY);

    const parsed: unknown = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed) ? (parsed as DemoWallet[]) : [];
  } catch {
    return [];
  }
}

function saveWallets(wallets: DemoWallet[]) {
  localStorage.setItem(WALLETS_KEY, JSON.stringify(wallets));
}

function createDemoAddress(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(20));

  return (
    "0x" +
    Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")
  );
}

function publicWallet(wallet: DemoWallet) {
  return {
    id: wallet.id,
    address: wallet.address,
    network: wallet.network,
    connectedAt: wallet.connectedAt,
  };
}

// ======================================================
// ENDPOINTS MSW
// ======================================================

export const handlers = [
  // ====================================================
  // AUTENTICAÇÃO — CADASTRO
  // ====================================================

  http.post("/api/auth/signup", async ({ request }) => {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
    };

    const name = body.name?.trim() ?? "";

    const email = body.email?.trim().toLowerCase() ?? "";

    const password = body.password ?? "";

    if (name.length < 2) {
      return HttpResponse.json(
        {
          message: "Informe um nome com pelo menos 2 caracteres.",
        },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return HttpResponse.json(
        { message: "Informe um e-mail válido." },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return HttpResponse.json(
        {
          message: "A senha deve ter pelo menos 8 caracteres.",
        },
        { status: 400 },
      );
    }

    const users = readUsers();

    if (users.some((user) => user.email === email)) {
      return HttpResponse.json(
        { message: "Este e-mail já está cadastrado." },
        { status: 409 },
      );
    }

    const user: DemoUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
    };

    saveUsers([...users, user]);

    return HttpResponse.json(createSession(user), { status: 201 });
  }),

  // ====================================================
  // AUTENTICAÇÃO — LOGIN
  // ====================================================

  http.post("/api/auth/login", async ({ request }) => {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const email = body.email?.trim().toLowerCase() ?? "";

    const password = body.password ?? "";

    const user = readUsers().find(
      (item) => item.email === email && item.password === password,
    );

    if (!user) {
      return HttpResponse.json(
        { message: "E-mail ou senha inválidos." },
        { status: 401 },
      );
    }

    return HttpResponse.json(createSession(user));
  }),

  // ====================================================
  // AUTENTICAÇÃO — USUÁRIO ATUAL
  // ====================================================

  http.get("/api/auth/me", ({ request }) => {
    const user = getAuthenticatedUser(request);

    if (!user) {
      return HttpResponse.json(
        { message: "Sessão não autenticada." },
        { status: 401 },
      );
    }

    return HttpResponse.json(user);
  }),

  // ====================================================
  // AUTENTICAÇÃO — LOGOUT
  // ====================================================

  http.post("/api/auth/logout", () => {
    saveSession(null);

    return HttpResponse.json({
      success: true,
    });
  }),

  // ====================================================
  // CARTEIRAS — LISTAR
  // ====================================================

  http.get("/api/wallets", ({ request }) => {
    const user = getAuthenticatedUser(request);

    if (!user) {
      return HttpResponse.json(
        {
          message: "Faça login para acessar suas carteiras.",
        },
        { status: 401 },
      );
    }

    const wallets = readWallets()
      .filter((wallet) => wallet.userId === user.id)
      .map(publicWallet);

    return HttpResponse.json(wallets);
  }),

  // ====================================================
  // CARTEIRAS — CONECTAR
  // ====================================================

  http.post("/api/wallets", ({ request }) => {
    const user = getAuthenticatedUser(request);

    if (!user) {
      return HttpResponse.json(
        {
          message: "Faça login para conectar uma carteira.",
        },
        { status: 401 },
      );
    }

    const wallets = readWallets();

    const userWallets = wallets.filter((wallet) => wallet.userId === user.id);

    if (userWallets.length >= 3) {
      return HttpResponse.json(
        {
          message: "Limite de 3 carteiras atingido.",
        },
        { status: 409 },
      );
    }

    const wallet: DemoWallet = {
      id: crypto.randomUUID(),
      userId: user.id,
      address: createDemoAddress(),
      network: "Ethereum",
      connectedAt: new Date().toISOString(),
    };

    saveWallets([...wallets, wallet]);

    return HttpResponse.json(publicWallet(wallet), { status: 201 });
  }),

  // ====================================================
  // CARTEIRAS — DESCONECTAR
  // ====================================================

  http.delete("/api/wallets/:walletId", ({ request, params }) => {
    const user = getAuthenticatedUser(request);

    if (!user) {
      return HttpResponse.json(
        {
          message: "Sessão não autenticada.",
        },
        { status: 401 },
      );
    }

    const wallets = readWallets();

    const wallet = wallets.find(
      (item) => item.id === params.walletId && item.userId === user.id,
    );

    if (!wallet) {
      return HttpResponse.json(
        {
          message: "Carteira não encontrada.",
        },
        { status: 404 },
      );
    }

    saveWallets(wallets.filter((item) => item.id !== wallet.id));

    return HttpResponse.json({
      success: true,
    });
  }),

  // ====================================================
  // CATÁLOGO — LISTAR NFTS
  // ====================================================

  http.get("/api/nfts", ({ request }) => {
    const url = new URL(request.url);

    const search = url.searchParams.get("search")?.toLowerCase() ?? "";

    const category = url.searchParams.get("category") ?? "all";

    const sort = url.searchParams.get("sort") ?? "default";

    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);

    const limit = 9;

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

  // ====================================================
  // CATÁLOGO — DETALHES
  // ====================================================

  http.get("/api/nfts/:id", ({ params }) => {
    const nft = nfts.find((item) => item.id === params.id);

    if (!nft) {
      return HttpResponse.json(
        {
          message: "NFT não encontrado.",
        },
        { status: 404 },
      );
    }

    return HttpResponse.json(nft);
  }),

  // ====================================================
  // CARRINHO — CONSULTAR
  // ====================================================

  http.get("/api/cart", () => {
    return HttpResponse.json(getCartResponse());
  }),

  // ====================================================
  // CARRINHO — ADICIONAR
  // ====================================================

  http.post("/api/cart/items", async ({ request }) => {
    const body = (await request.json()) as {
      nftId?: string;
      quantity?: number;
    };

    const nft = nfts.find((item) => item.id === body.nftId);

    if (!nft) {
      return HttpResponse.json(
        {
          message: "NFT não encontrado.",
        },
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
        {
          message: "Quantidade inválida.",
        },
        { status: 400 },
      );
    }

    const existing = serverCart.find((item) => item.nft.id === nft.id);

    const currentQuantity = existing?.quantity ?? 0;

    if (currentQuantity + quantity > nft.available) {
      return HttpResponse.json(
        {
          message: "Estoque insuficiente.",
        },
        { status: 409 },
      );
    }

    if (existing) {
      serverCart = serverCart.map((item) =>
        item.nft.id === nft.id
          ? {
              ...item,
              quantity: item.quantity + quantity,
            }
          : item,
      );
    } else {
      serverCart = [...serverCart, { nft, quantity }];
    }

    saveState();

    return HttpResponse.json(getCartResponse(), { status: 201 });
  }),

  // ====================================================
  // CARRINHO — ALTERAR QUANTIDADE
  // ====================================================

  http.patch("/api/cart/items/:nftId", async ({ params, request }) => {
    const body = (await request.json()) as {
      quantity?: number;
    };

    const existing = serverCart.find((item) => item.nft.id === params.nftId);

    if (!existing) {
      return HttpResponse.json(
        {
          message: "Item não encontrado no carrinho.",
        },
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
        {
          message: "Quantidade inválida.",
        },
        { status: 400 },
      );
    }

    if (quantity > existing.nft.available) {
      return HttpResponse.json(
        {
          message: "Estoque insuficiente.",
        },
        { status: 409 },
      );
    }

    serverCart = serverCart.map((item) =>
      item.nft.id === params.nftId ? { ...item, quantity } : item,
    );

    saveState();

    return HttpResponse.json(getCartResponse());
  }),

  // ====================================================
  // CARRINHO — REMOVER ITEM
  // ====================================================

  http.delete("/api/cart/items/:nftId", ({ params }) => {
    serverCart = serverCart.filter((item) => item.nft.id !== params.nftId);

    saveState();

    return HttpResponse.json(getCartResponse());
  }),

  // ====================================================
  // CARRINHO — ESVAZIAR
  // ====================================================

  http.delete("/api/cart", () => {
    serverCart = [];

    saveState();

    return HttpResponse.json(getCartResponse());
  }),

  // ====================================================
  // PEDIDOS — CRIAR COM IDEMPOTÊNCIA
  // ====================================================

  http.post("/api/orders", async ({ request }) => {
    const key = request.headers.get("Idempotency-Key");

    if (!key || key.trim().length < 8) {
      return HttpResponse.json(
        {
          message: "Chave de idempotência inválida.",
        },
        { status: 400 },
      );
    }

    const previous = idempotencyKeys.get(key);

    if (previous) {
      return HttpResponse.json(previous.order, { status: 200 });
    }

    if (serverCart.length === 0) {
      return HttpResponse.json(
        {
          message: "O carrinho está vazio.",
        },
        { status: 400 },
      );
    }

    const stockUpdates: {
      nftId: string;
      available: number;
      version: number;
    }[] = [];

    for (const item of serverCart) {
      const nft = nfts.find((current) => current.id === item.nft.id);

      if (nft) {
        nft.available -= item.quantity;
        nft.version += 1;

        stockUpdates.push({
          nftId: nft.id,
          available: nft.available,
          version: nft.version,
        });
      }
    }

    const fingerprint = getCartFingerprint();

    const summary = getCartResponse();

    const order: Order = {
      id: crypto.randomUUID(),

      items: serverCart.map((item) => ({
        nft: { ...item.nft },
        quantity: item.quantity,
      })),

      totalItems: summary.totalItems,
      totalPrice: summary.totalPrice,
      status: "CONFIRMED",
      createdAt: new Date().toISOString(),
    };

    orders.set(order.id, order);

    idempotencyKeys.set(key, {
      order,
      fingerprint,
    });

    // Publicar atualizações de estoque
    for (const update of stockUpdates) {
      publishStockUpdate(update);
    }

    serverCart = [];

    saveState();

    return HttpResponse.json(order, { status: 201 });
  }),

  // ====================================================
  // PEDIDOS — CONSULTAR
  // ====================================================

  http.get("/api/orders/:orderId", ({ params }) => {
    const order = orders.get(String(params.orderId));

    if (!order) {
      return HttpResponse.json(
        {
          message: "Pedido não encontrado.",
        },
        { status: 404 },
      );
    }

    return HttpResponse.json(order);
  }),
];
