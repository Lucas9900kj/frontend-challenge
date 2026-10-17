import { api } from "./api";
import type { NFT } from "../mocks/fixtures";

export interface NFTListResponse {
  items: NFT[];
  total: number;
  page: number;
  totalPages: number;
}

export interface NFTFilters {
  search?: string;
  category?: string;
  sort?: string;
  page?: number;
}

export async function getNFTs(
  filters: NFTFilters = {},
  signal?: AbortSignal,
): Promise<NFTListResponse> {
  const response = await api.get<NFTListResponse>("/nfts", {
    params: filters,
    signal,
  });

  return response.data;
}

export async function getNFT(id: string, signal?: AbortSignal): Promise<NFT> {
  const response = await api.get<NFT>(`/nfts/${id}`, { signal });
  return response.data;
}
