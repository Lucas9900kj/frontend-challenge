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
  {
    id: "1",
    name: "Cyber Ape",
    creator: "Jungle Studio",
    price: "0.85",
    image: "https://picsum.photos/seed/cyberape/600/600",
    category: "Art",
    available: 8,
    version: 1,
  },
  {
    id: "2",
    name: "Neon Warrior",
    creator: "Crypto Artist",
    price: "1.20",
    image: "https://picsum.photos/seed/neonwarrior/600/600",
    category: "Gaming",
    available: 5,
    version: 1,
  },
  {
    id: "3",
    name: "Digital Jungle",
    creator: "Jungle Studio",
    price: "0.65",
    image: "https://picsum.photos/seed/digitaljungle/600/600",
    category: "Art",
    available: 12,
    version: 1,
  },
  {
    id: "4",
    name: "Meta Dragon",
    creator: "Web3 Creator",
    price: "2.50",
    image: "https://picsum.photos/seed/metadragon/600/600",
    category: "Gaming",
    available: 3,
    version: 1,
  },
];
