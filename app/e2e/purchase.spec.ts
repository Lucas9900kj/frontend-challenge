import { test, expect, type Page } from "@playwright/test";

// Encontra um NFT disponível no catálogo.

async function abrirNFTDisponivel(page: Page) {
  await page.goto("/");

  const links = page.locator('a[href^="/nft/"]');

  await expect(links.first()).toBeVisible();

  const enderecos = [
    ...new Set(
      await links.evaluateAll((elements) =>
        elements
          .map((element) => element.getAttribute("href"))
          .filter((href): href is string => Boolean(href)),
      ),
    ),
  ];

  for (const href of enderecos) {
    await page.goto(href);

    const adicionar = page.getByRole("button", {
      name: "Adicionar ao carrinho",
      exact: true,
    });

    try {
      // Espera o carregamento real do botão.
      await expect(adicionar).toBeVisible({
        timeout: 5000,
      });

      await expect(adicionar).toBeEnabled({
        timeout: 5000,
      });

      return;
    } catch {
      // Tenta o próximo NFT caso este esteja indisponível.
      continue;
    }
  }

  throw new Error(
    "Nenhum NFT disponível para compra foi encontrado no catálogo.",
  );
}

// Adiciona um NFT e verifica se ele aparece no carrinho.
async function adicionarAoCarrinho(page: Page) {
  await abrirNFTDisponivel(page);

  const adicionar = page.getByRole("button", {
    name: /adicionar ao carrinho/i,
  });

  await expect(adicionar).toBeEnabled();
  await adicionar.click();

  // Aguarda a confirmação da operação antes de navegar.
  await expect(
    page.getByRole("status").filter({
      hasText: /adicionad/i,
    }),
  ).toBeVisible();

  await page.goto("/cart");

  await expect(
    page.getByRole("region", {
      name: "Itens do carrinho",
    }),
  ).toBeVisible();
}

test.describe("KURIO — Carrinho e Checkout", () => {
  test("exibe o carrinho vazio ou carregado", async ({ page }) => {
    await page.goto("/cart");

    await expect(
      page.getByRole("heading", {
        name: /meu carrinho/i,
      }),
    ).toBeVisible();

    const itens = page.getByRole("region", {
      name: "Itens do carrinho",
    });

    const vazio = page.getByRole("heading", {
      name: /seu carrinho está vazio/i,
    });

    await expect(itens.or(vazio)).toBeVisible();
  });

  test("adiciona NFT ao carrinho", async ({ page }) => {
    await adicionarAoCarrinho(page);

    await expect(
      page.getByRole("link", {
        name: /finalizar compra/i,
      }),
    ).toBeVisible();
  });

  test("mantém os itens após atualizar a página", async ({ page }) => {
    await adicionarAoCarrinho(page);

    await page.reload();

    await expect(
      page.getByRole("region", {
        name: "Itens do carrinho",
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("link", {
        name: /finalizar compra/i,
      }),
    ).toBeVisible();
  });

  test("permite remover um NFT do carrinho", async ({ page }) => {
    await adicionarAoCarrinho(page);

    const remover = page
      .getByRole("button", {
        name: /remover .* do carrinho/i,
      })
      .first();

    await expect(remover).toBeVisible();
    await remover.click();

    await expect(
      page.getByRole("heading", {
        name: /seu carrinho está vazio/i,
      }),
    ).toBeVisible();
  });

  test("bloqueia confirmação sem aceitar os termos", async ({ page }) => {
    await adicionarAoCarrinho(page);

    await page
      .getByRole("link", {
        name: /finalizar compra/i,
      })
      .click();

    await expect(page).toHaveURL(/\/checkout/);

    await expect(
      page.getByRole("button", {
        name: /confirmar pedido/i,
      }),
    ).toBeDisabled();
  });

  test("permite aceitar os termos do checkout", async ({ page }) => {
    await adicionarAoCarrinho(page);

    await page
      .getByRole("link", {
        name: /finalizar compra/i,
      })
      .click();

    await expect(page).toHaveURL(/\/checkout/);

    await page.getByRole("checkbox").check();

    await expect(
      page.getByRole("button", {
        name: /confirmar pedido/i,
      }),
    ).toBeEnabled();
  });

  test("conclui uma compra simulada", async ({ page }) => {
    await adicionarAoCarrinho(page);

    await page
      .getByRole("link", {
        name: /finalizar compra/i,
      })
      .click();

    await expect(page).toHaveURL(/\/checkout/);

    await page.getByRole("checkbox").check();

    const confirmar = page.getByRole("button", {
      name: /confirmar pedido/i,
    });

    await expect(confirmar).toBeEnabled();
    await confirmar.click();

    await expect(page).toHaveURL(/\/order\/[^/?]+/, {
      timeout: 15000,
    });
  });
});
