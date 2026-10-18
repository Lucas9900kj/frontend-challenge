import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "../services/socket";

export function useRealtimeStock() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const refreshStock = () => {
      void queryClient.invalidateQueries({
        queryKey: ["nfts"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["nft"],
      });
    };

    const refreshSnapshot = (updates: unknown[]) => {
      if (updates.length > 0) {
        refreshStock();
      }
    };

    socket.on("stock:updated", refreshStock);
    socket.on("stock:snapshot", refreshSnapshot);

    socket.connect();

    return () => {
      socket.off("stock:updated", refreshStock);
      socket.off("stock:snapshot", refreshSnapshot);
      socket.disconnect();
    };
  }, [queryClient]);
}
