export interface NFT {
  id: string;
  name: string;
  creator: string;
  price: string;
  image: string;
  category: string;
  available: number;
  version: number;
}

export const nfts: NFT[] = [
  { id: "1", name: "Emerald Ape #042", creator: "KURIO Studio", price: "1.19", image: "/nfts/emerald.png", category: "Art", available: 8, version: 1 },
  { id: "2", name: "Sage Nomad #009", creator: "Pixel Collective", price: "1.69", image: "/nfts/sage.png", category: "Art", available: 5, version: 1 },
  { id: "3", name: "Neon Vessel #552", creator: "Web3 Creator", price: "1.99", image: "/nfts/neon.png", category: "Gaming", available: 12, version: 1 },
  { id: "4", name: "Cosmic Bloom #118", creator: "Pixel Collective", price: "1.29", image: "/nfts/cosmic.png", category: "Art", available: 3, version: 1 },
  { id: "5", name: "Violet Nomad #314", creator: "Pixel Collective", price: "1.39", image: "/nfts/violet.png", category: "Art", available: 7, version: 1 },
  { id: "6", name: "Ivory Baron #088", creator: "KURIO Studio", price: "1.79", image: "/nfts/ivory.png", category: "Art", available: 6, version: 1 },
  { id: "7", name: "Golden Beat #207", creator: "Web3 Creator", price: "0.99", image: "/nfts/golden-beat.png", category: "Gaming", available: 9, version: 1 },
  { id: "8", name: "Golden Wave #143", creator: "KURIO Studio", price: "0.89", image: "/nfts/golden-wave.png", category: "Art", available: 4, version: 1 },
  { id: "9", name: "Golden Signal #160", creator: "Pixel Collective", price: "0.39", image: "/nfts/golden-signal.png", category: "Gaming", available: 10, version: 1 },
];
