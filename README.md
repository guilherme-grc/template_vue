# Vue SOLID Starter

Template Vue 3 + Vite + Pinia + Vue Router organizado por feature, com as camadas separadas seguindo os princípios SOLID. Inclui um módulo de exemplo completo (`tasks`) pra copiar quando for começar um recurso novo.

## Stack

- [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`)
- [Vite 6](https://vite.dev/)
- [Pinia](https://pinia.vuejs.org/) — estado global (sessão, UI)
- [Vue Router 4](https://router.vuejs.org/) — rotas modulares por feature
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Axios](https://axios-http.com/) — via `httpClient` central
- [Vitest](https://vitest.dev/) + [@vue/test-utils](https://test-utils.vuejs.org/) — testes

## Rodando o projeto

```bash
npm install
npm run dev        # http://localhost:3000
npm run test        # roda a suíte Vitest uma vez
npm run test:watch  # Vitest em modo watch
npm run lint         # ESLint (regras oficiais do Vue Style Guide)
npm run build         # build de produção
```

Login de demonstração (fallback mock, ativo quando `VITE_API_URL` não responde e `import.meta.env.DEV` é `true`):
- `admin@example.com` / `admin123` (perfil ADMIN)
- `user@example.com` / `user123` (perfil USER)

## Estrutura de pastas

```
src/
  app/App.vue          # componente raiz
  assets/
  components/
    common/              # componentes "dumb" reutilizáveis (AppButton, AppInput, DynamicTable, DynamicForm...)
    layout/              # casca da aplicação (MainLayout, AppSidebar, AppHeader, AppBottomNav)
  composables/           # lógica reutilizável cross-cutting (useToast, usePermissions, useUpload, useDataTable)
  config/
    env.js                # único ponto de leitura de import.meta.env
  constants/
    statusVariants.js      # mapas status -> label/cor, evita duplicação entre telas
  features/
    auth/       pages, composables, services, routes.js
    dashboard/  pages, composables, components, routes.js
    tasks/       pages, composables, services, components, routes.js   <- módulo de referência
    users/       pages, composables, services, components, routes.js
    profile/    pages, routes.js
  router/index.js       # agrega routes.js de cada feature + guards
  services/http/
    httpClient.js          # instância axios + interceptors (única abstração HTTP do app)
    createCrudService.js    # factory de serviço CRUD padrão, reutilizada por cada feature
  stores/                # Pinia — só estado verdadeiramente global (auth, ui)
  utils/
```

## Por que essa organização (princípios SOLID aplicados)

| Princípio | Como é aplicado aqui |
|---|---|
| **SRP** | Página = template + chamada de composable. Composable = estado e orquestração. Service = só I/O. Store = só estado global de verdade. |
| **OCP** | `createCrudService(resource, options)` gera um serviço CRUD completo. Um recurso novo é configuração, não código copiado. |
| **LSP** | Todo serviço gerado pela factory devolve a mesma forma de retorno, então componentes genéricos (`DynamicTable`, `useDataTable`) funcionam com qualquer um deles sem checagem especial. |
| **ISP** | Composables expõem só o que quem os chama precisa (ex: `useAuth` não vaza detalhes de toast/loading pra fora). |
| **DIP** | Componentes dependem de `httpClient`/`config/env.js`, nunca de `axios` ou `import.meta.env` diretamente. |

Detalhamento completo, com "antes vs depois" de cada violação encontrada: [`docs/ANALISE_TECNICA.md`](docs/ANALISE_TECNICA.md).

## Como adicionar uma feature nova

Copie a pasta `src/features/tasks/` como esqueleto:

1. `services/<recurso>Service.js` — `createCrudService('recurso', { mockData: [...] })`, mais qualquer ação específica composta por cima (veja `features/users/services/userService.js` para um exemplo com `toggleStatus`).
2. `composables/use<Recurso>.js` — estado, fetch, filtro, CRUD orquestrado, toasts.
3. `components/<Recurso>FormModal.vue` — `AppModal` + `DynamicForm` (ou campos manuais, se preferir).
4. `pages/<Recurso>ListPage.vue` — `DynamicTable` + a composable acima.
5. `routes.js` — exporta o array de rotas da feature.
6. Registre o `routes.js` em `src/router/index.js`.
7. Se o recurso tiver status, adicione o mapa em `src/constants/statusVariants.js` em vez de hardcodar cores na página.

## Testes

Testes ficam colocados junto ao código (`*.spec.js` ao lado do arquivo testado), convenção usada pelo Vitest. Exemplos incluídos:

- `src/utils/objectUtils.spec.js` — util puro
- `src/composables/useToast.spec.js` — composable com estado e timers
- `src/services/http/createCrudService.spec.js` — service com `httpClient` mockado
- `src/components/common/AppButton.spec.js` — componente via `@vue/test-utils`

## Variáveis de ambiente

Veja `.env.example`. `VITE_API_URL` aponta pro backend; sem backend disponível em `DEV`, os services caem automaticamente no fallback mock (ver `services/http/createCrudService.js`).
