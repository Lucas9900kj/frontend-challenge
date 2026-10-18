import { beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "../services/api";
import { createOrder, getOrder } from "../services/orders";

vi.mock("../services/api", () => ({
  api: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

const mockedPost = vi.mocked(api.post);
const mockedGet = vi.mocked(api.get);

const mockOrder = {
  id: "order-123",
  items: [],
  totalItems: 0,
  totalPrice: 0,
  status: "CONFIRMED" as const,
  createdAt: "2026-10-18T10:00:00.000Z",
};

describe("Jungle Gaming - Pedidos", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    mockedPost.mockResolvedValue({
      data: mockOrder,
    });

    mockedGet.mockResolvedValue({
      data: mockOrder,
    });
  });

  it("deve criar um pedido", async () => {
    const order = await createOrder("key-123");

    expect(order.id).toBe("order-123");
    expect(order.status).toBe("CONFIRMED");
  });

  it("deve enviar a chave de idempotência", async () => {
    await createOrder("unique-key-456");

    expect(mockedPost).toHaveBeenCalledWith(
      "/orders",
      {},
      {
        headers: {
          "Idempotency-Key": "unique-key-456",
        },
      },
    );
  });

  it("deve reutilizar a mesma chave quando informada novamente", async () => {
    const key = "same-key-789";

    await createOrder(key);
    await createOrder(key);

    expect(mockedPost).toHaveBeenCalledTimes(2);

    expect(mockedPost.mock.calls[0]?.[2]).toEqual({
      headers: {
        "Idempotency-Key": key,
      },
    });

    expect(mockedPost.mock.calls[1]?.[2]).toEqual({
      headers: {
        "Idempotency-Key": key,
      },
    });
  });

  it("deve consultar um pedido pelo ID", async () => {
    const order = await getOrder("order-123");

    expect(mockedGet).toHaveBeenCalledWith("/orders/order-123", {
      signal: undefined,
    });

    expect(order.id).toBe("order-123");
  });

  it("deve encaminhar o AbortSignal na consulta", async () => {
    const controller = new AbortController();

    await getOrder("order-123", controller.signal);

    expect(mockedGet).toHaveBeenCalledWith("/orders/order-123", {
      signal: controller.signal,
    });
  });
});
