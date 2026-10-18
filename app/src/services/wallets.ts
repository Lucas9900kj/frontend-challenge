import { api } from "./api";
import { getSavedSession } from "./auth";

export interface Wallet {
  id: string;
  address: string;
  network: "Ethereum";
  connectedAt: string;
}

function authHeaders() {
  const session = getSavedSession();

  return {
    Authorization: `Bearer ${session?.token ?? ""}`,
  };
}

export async function getWallets(): Promise<Wallet[]> {
  const response = await api.get<Wallet[]>("/wallets", {
    headers: authHeaders(),
  });

  return response.data;
}

export async function connectWallet(): Promise<Wallet> {
  const response = await api.post<Wallet>(
    "/wallets",
    {},
    {
      headers: authHeaders(),
    },
  );

  return response.data;
}

export async function disconnectWallet(id: string): Promise<void> {
  await api.delete(`/wallets/${id}`, {
    headers: authHeaders(),
  });
}
