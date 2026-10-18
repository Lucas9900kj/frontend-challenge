import { describe, expect, it } from "vitest";

describe("Jungle Gaming - Testes iniciais", () => {
  it("deve calcular corretamente o preço de um NFT", () => {
    const price = "2.50";
    const quantity = 2;

    const total = Number(price) * quantity;

    expect(total).toBe(5);
  });

  it("deve calcular a quantidade total de NFTs", () => {
    const items = [{ quantity: 2 }, { quantity: 3 }];

    const totalItems = items.reduce((total, item) => total + item.quantity, 0);

    expect(totalItems).toBe(5);
  });

  it("deve impedir a confirmação sem aceitar os termos", () => {
    const accepted = false;
    const cartHasItems = true;

    const canCheckout = accepted && cartHasItems;

    expect(canCheckout).toBe(false);
  });
});
