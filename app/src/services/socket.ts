import { io } from "socket.io-client";

export interface StockUpdate {
  nftId: string;
  available: number;
  version: number;
}

const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

export const socket = io(socketUrl, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 10000,
});

export function publishStockUpdate(update: StockUpdate) {
  if (!socket.connected) {
    console.warn(
      "Socket.IO desconectado: atualização de estoque não enviada.",
      update.nftId,
    );
    return;
  }

  socket.emit("stock:update", update);
}
