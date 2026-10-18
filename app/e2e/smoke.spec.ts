import { test, expect } from "@playwright/test";

test.describe("KURIO — Smoke Tests", () => {
  test("carrega o marketplace e mantém os filtros na URL", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("body")).toBeVisible();

    await expect(page).toHaveURL((url) => {
      return (
        url.pathname === "/" &&
        url.searchParams.get("category") === "all" &&
        url.searchParams.get("sort") === "default" &&
        url.searchParams.get("page") === "1"
      );
    });
  });

  test("carrega a seção do catálogo de NFTs", async ({ page }) => {
    await page.goto("/");

    const catalogo = page.locator("#catalogo");

    await expect(catalogo).toBeVisible();

    await expect(catalogo.locator("h1, h2, h3").first()).toBeVisible();
  });

  test("não apresenta erros fatais de JavaScript", async ({ page }) => {
    const erros: string[] = [];

    page.on("pageerror", (error) => {
      erros.push(error.message);
    });

    await page.goto("/");

    await expect(page.locator("#catalogo")).toBeVisible();

    expect(erros).toEqual([]);
  });

  test("não possui rolagem horizontal indevida", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("#catalogo")).toBeVisible();

    const overflow = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1
      );
    });

    expect(overflow).toBe(false);
  });
});
