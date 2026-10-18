import { test, expect, type Page } from "@playwright/test";

async function preencherCadastro(
  page: Page,
  dados: {
    nome: string;
    email: string;
    senha: string;
    confirmacao: string;
  },
) {
  await page.getByRole("textbox", { name: "Nome" }).fill(dados.nome);
  await page.getByRole("textbox", { name: "E-mail" }).fill(dados.email);

  await page.locator("#signup-password").fill(dados.senha);
  await page.locator("#signup-confirm").fill(dados.confirmacao);
}

test.describe("KURIO — Autenticação", () => {
  test("abre a página de login", async ({ page }) => {
    await page.goto("/login");

    await expect(
      page.getByRole("heading", {
        name: "Bem-vindo de volta",
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("button", {
        name: "Entrar na conta",
      }),
    ).toBeVisible();
  });

  test("abre a página de cadastro", async ({ page }) => {
    await page.goto("/signup");

    await expect(
      page.getByRole("heading", {
        name: "Crie sua conta",
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("button", {
        name: "Criar minha conta",
      }),
    ).toBeVisible();
  });

  test("navega do login para o cadastro", async ({ page }) => {
    await page.goto("/login");

    await page
      .getByRole("link", {
        name: /criar conta/i,
      })
      .click();

    await expect(page).toHaveURL(/\/signup/);
  });

  test("navega do cadastro para o login", async ({ page }) => {
    await page.goto("/signup");

    await page
      .getByRole("link", {
        name: "Entrar",
        exact: true,
      })
      .click();

    await expect(page).toHaveURL(/\/login/);
  });

  test("valida campos obrigatórios no login", async ({ page }) => {
    await page.goto("/login");

    await page
      .getByRole("button", {
        name: "Entrar na conta",
      })
      .click();

    await expect(page).toHaveURL(/\/login/);

    await expect(page.locator("#login-email")).toHaveJSProperty(
      "validity.valueMissing",
      true,
    );
  });

  test("valida senhas diferentes no cadastro", async ({ page }) => {
    await page.goto("/signup");

    await preencherCadastro(page, {
      nome: "Lucas Teste",
      email: "teste@kurio.com",
      senha: "Senha12345",
      confirmacao: "Senha54321",
    });

    await page
      .getByRole("button", {
        name: "Criar minha conta",
      })
      .click();

    await expect(page.getByRole("alert")).toContainText(/senhas.*coincidem/i);
  });

  test("permite mostrar e ocultar senha", async ({ page }) => {
    await page.goto("/signup");

    const senha = page.locator("#signup-password");

    await expect(senha).toHaveAttribute("type", "password");

    await page
      .getByRole("button", {
        name: "Mostrar senha",
      })
      .click();

    await expect(senha).toHaveAttribute("type", "text");

    await page
      .getByRole("button", {
        name: "Ocultar senha",
      })
      .click();

    await expect(senha).toHaveAttribute("type", "password");
  });

  test("valida tamanho mínimo da senha", async ({ page }) => {
    await page.goto("/signup");

    await preencherCadastro(page, {
      nome: "Lucas Teste",
      email: "teste@kurio.com",
      senha: "1234567",
      confirmacao: "1234567",
    });

    const senha = page.locator("#signup-password");

    await expect(senha).toHaveAttribute("minlength", "8");

    await page
      .getByRole("button", {
        name: "Criar minha conta",
      })
      .click();

    await expect(page).toHaveURL(/\/signup/);

    await expect(senha).toHaveJSProperty("validity.tooShort", true);
  });
});
