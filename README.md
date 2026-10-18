# KURIO — NFT Marketplace

Marketplace de NFTs desenvolvido como solução para o Desafio Frontend da Jungle Gaming.

O projeto foi construído com React e TypeScript, inspirado no layout fornecido no Figma, com foco na experiência do colecionador, navegação, integração com APIs simuladas e fluxo de compra.

## Links

- Repositório: https://github.com/Lucas9900kj/frontend-challenge
- Aplicação publicada: https://frontend-challenge-roan-alpha.vercel.app
- Figma: https://www.figma.com/design/Ff0SksUi7UFtPWUO8kyNtw/Frontend-Challenge?node-id=0-1

## Tecnologias

- React e TypeScript
- Vite
- TanStack Router
- TanStack Query
- Axios
- Tailwind CSS
- shadcn/ui
- MSW (Mock Service Worker)
- Socket.IO / simulação de eventos
- Vitest e Testing Library

## Funcionalidades

### Marketplace

- Catálogo de NFTs com imagens e informações
- Busca por nome
- Filtros por categoria
- Ordenação por preço
- Paginação
- Detalhes dos NFTs
- Exibição de disponibilidade

### Compra

- Carrinho de compras
- Alteração de quantidades
- Remoção de produtos
- Checkout simulado
- Confirmação de pedido
- Atualização de estoque

### Conta do colecionador

- Cadastro
- Login
- Perfil
- Carteiras simuladas

### Experiência visual

- Interface baseada no Figma
- Layout responsivo
- Estados de carregamento e erro
- Diário da Cunhagem interativo
- Central de Ajuda

## Como executar

### Pré-requisitos

- Node.js compatível com a versão do Vite utilizada
- npm

### Instalação

Clone o repositório:

```bash
git clone https://github.com/Lucas9900kj/frontend-challenge.git
cd frontend-challenge/app
```

Instale as dependências:

```bash
npm ci
```

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

Abra o endereço indicado pelo Vite, normalmente:

http://localhost:5173

## Build de produção

```bash
npm run build
```

Para visualizar a build:

```bash
npm run preview
```

## Testes automatizados

```bash
npx vitest run
```

Resultado da última execução local informada:

- 3 arquivos de teste aprovados
- 13 testes aprovados

Esses testes não substituem a cobertura E2E exigida com Playwright.

## Estrutura principal

```text
app/
├── public/
│   └── nfts/
├── src/
│   ├── components/
│   ├── lib/
│   ├── mocks/
│   ├── pages/
│   ├── services/
│   ├── test/
│   └── router.tsx
├── package.json
├── vite.config.ts
└── index.html
```

## APIs e dados simulados

O projeto utiliza MSW para simular respostas HTTP sem depender de um backend externo.

Os dados dos NFTs são definidos em fixtures e utilizados nas operações do marketplace.

As compras, contas e carteiras são demonstrativas. Não são realizadas transações reais em blockchain nem pagamentos com valores reais.

## Persistência

O projeto utiliza mecanismos locais de persistência para manter dados simulados entre determinadas navegações e recarregamentos.

Os dados da demonstração não devem ser considerados armazenamento seguro de produção.

## Variáveis de ambiente

A aplicação utiliza dados simulados. Antes de configurar variáveis de ambiente no deploy, consulte as configurações do projeto para identificar quais são realmente necessárias.

Nenhuma credencial real de blockchain ou gateway de pagamento deve ser utilizada.

## Deploy

A aplicação pode ser publicada na Vercel como projeto Vite.

Configuração esperada:

- Root Directory: `app`
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm ci`

As rotas SPA precisam de fallback para `index.html`.

Após publicar, valide o acesso direto às rotas, o carregamento dos mocks e o fluxo de compra.

## Limitações conhecidas

- Carteiras e pagamentos são simulados.
- Não existe integração real com blockchain.
- Os filtros de coleções específicas e redes ainda utilizam dados demonstrativos.
- A newsletter não possui serviço real de envio de e-mails.
- A cobertura E2E com Playwright e as auditorias Lighthouse ainda precisam ser comprovadas.
- O comportamento de reconexão e sincronização Socket.IO no ambiente publicado precisa ser validado.

## Referência visual

Layout original disponibilizado pela Jungle Gaming no Figma.

## Autor

Lucas Soares

Desenvolvido para o desafio técnico Frontend da Jungle Gaming.
