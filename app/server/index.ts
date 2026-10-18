import { createServer } from "node:http";
import { Server } from "socket.io";

const PORT = 3001;

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

interface StockUpdate {
  nftId: string;
  available: number;
  version: number;
}

const stock = new Map<string, StockUpdate>();

io.on("connection", (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);

  socket.emit("stock:snapshot", [...stock.values()]);

  socket.on("stock:update", (data: StockUpdate) => {
    if (
      typeof data?.nftId !== "string" ||
      !Number.isInteger(data.available) ||
      data.available < 0 ||
      !Number.isInteger(data.version) ||
      data.version < 1
    ) {
      return;
    }

    const current = stock.get(data.nftId);

    if (current && data.version <= current.version) {
      return;
    }

    stock.set(data.nftId, data);

    io.emit("stock:updated", data);

    console.log(`Estoque atualizado: ${data.nftId} -> ${data.available}`);
  });

  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Socket.IO funcionando em http://localhost:${PORT}`);
});
