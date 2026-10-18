import { io } from "socket.io-client";

export interface StockUpdate {
  nftId: string;
  available: number;
  version: number;
}

export const socket = io("http://localhost:3001", {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});

export function publishStockUpdate(update: StockUpdate) {
  if (socket.connected) {
    socket.emit("stock:update", update);
  }
}
