# Análise Técnica — Refatoração SOLID + Template Vue.js

Documento de referência da refatoração aplicada ao projeto. Cobre o diagnóstico do estado anterior, a arquitetura nova, o mapeamento de cada princípio SOLID pra código real, a estratégia de testes e o guia de extensão.

## 1. Diagnóstico do estado anterior

O projeto (`reembolso-pro`) era um SPA Vue 3 funcional, mas com o domínio de negócio (reembolso de despesas) espalhado direto nas camadas de apresentação. Os problemas concretos encontrados:

### 1.1 SRP quebrado nas páginas

`src/pages/expenses/ExpenseListPage.vue` (antiga) fazia, no mesmo `<script setup>`: fetch de despesas, fetch de categorias, filtro por busca/status/categoria, mapeamento de variant de badge por status, abertura/fechamento de modal de detalhe e formatação de coluna — sete responsabilidades numa página só. O mesmo padrão se repetia em `UserListPage.vue` e `DashboardPage.vue`.

### 1.2 OCP quebrado nos services

Todo arquivo em `src/services/*.js` repetia o mesmo bloco:

```js
async getAll() {
  try {
    const response = await api.get('/expenses', { params: filters });
    return response.data;
  } catch (error) {
    if (import.meta.env.DEV) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [ /* dados mockados hardcoded */ ];
    }
    throw error;
  }
}
```

Esse bloco existia, quase idêntico, em `authService`, `expenseService`, `categoryService` e `userService` — 4 cópias de 3 a 5 métodos cada. Adicionar um recurso novo significava copiar e colar o padrão inteiro, não estendê-lo.

### 1.3 ISP/SRP no `useAuth`

O composable original já era razoavelmente enxuto, mas todo consumo de sessão (login, logout, leitura de usuário) passava por ele mesmo quando o chamador só precisava de uma fatia — não havia separação entre "o que a tela de login precisa" e "o que a store de sessão expõe".

### 1.4 DIP quebrado

`src/services/api.js` instanciava o `axios` e lia `import.meta.env.VITE_API_URL` diretamente nesse arquivo — o que é correto — mas não havia nenhuma camada acima disso: qualquer novo service que precisasse de uma env var teria que ler `import.meta.env` de novo, e não existia um contrato único que os services conhecessem.

### 1.5 Duplicação de mapeamento status → cor

`DashboardPage.vue` e `ExpenseListPage.vue` continham, cada um, a mesma função:

```js
const getStatusVariant = (status) => {
  const variants = { 'Pendente': 'warning', 'Aprovado': 'success', 'Rejeitado': 'danger', 'Rascunho': 'default' };
  return variants[status] || 'default';
};
```

### 1.6 Outros problemas

- Sem testes automatizados (nenhum framework configurado).
- `package.json` com dependências mortas de outro boilerplate: `express`, `better-sqlite3`, `dotenv`, `@google/genai`, `@types/express`, `tsx` — nenhuma usada em `src/`.
- `vite` listado tanto em `dependencies` quanto em `devDependencies` (deveria estar só em dev).
- `metadata.json` era resíduo do AI Studio, sem função no build Vite/Vue.
- `eslint.config.js` desligava a regra `vue/multi-word-component-names` do Style Guide oficial do Vue, mesmo o código já sendo compliant.

## 2. Arquitetura nova

```
src/
  app/App.vue
  components/{common,layout}/
  composables/           (useToast, usePermissions, useUpload, useDataTable — cross-cutting)
  config/env.js
  constants/statusVariants.js
  features/
    auth/ dashboard/ tasks/ users/ profile/
      pages/ composables/ services/ components/ routes.js
  router/index.js
  services/http/{httpClient.js, createCrudService.js}
  stores/{auth.js, ui.js}
  utils/
```

Cada feature é uma unidade fechada: sabe buscar seus dados, orquestrar seu estado e renderizar suas telas. `router/index.js` só importa o `routes.js` de cada feature e aplica os guards — não conhece detalhe de nenhuma tela.

O domínio de reembolso foi removido; em seu lugar, `features/tasks` é um módulo de exemplo completo (lista de tarefas com status/prioridade/prazo) que serve como esqueleto pra copiar em features futuras — foi escolhido por ser o exemplo canônico usado na própria documentação oficial do Vue (o tutorial interativo em vuejs.org constrói uma lista de tarefas).

## 3. SOLID: violação antes → solução depois

### 3.1 SRP (Single Responsibility)

**Antes:** `ExpenseListPage.vue` fazia fetch + filtro + formatação + orquestração de modal.

**Depois:** três camadas, cada uma com um motivo pra mudar:

- `features/tasks/pages/TaskListPage.vue` — só template e chamadas.
- `features/tasks/composables/useTasks.js` — estado (`tasks`, `search`, `filterStatus`), computed de filtro (`filteredTasks`) e orquestração de CRUD com toast.
- `features/tasks/services/taskService.js` — só I/O.

Se a regra de filtro mudar, mexe em `useTasks.js`. Se o endpoint mudar, mexe em `taskService.js`. Se o layout mudar, mexe em `TaskListPage.vue`. Nenhuma mudança cruza as três.

### 3.2 OCP (Open/Closed)

**Antes:** cada service reescrevia o try/catch com fallback mock.

**Depois:** `src/services/http/createCrudService.js` é uma factory:

```js
export function createCrudService(resource, { mockData = [], mockDelay = 400 } = {}) {
  // getAll / getById / create / update / patch / remove
  // com fallback de mock isolado em withMockFallback()
}
```

Um recurso novo é só:

```js
export const taskService = createCrudService('tasks', { mockData: MOCK_TASKS });
```

Quando um recurso precisa de uma ação fora do CRUD padrão (ex: `toggleStatus` de usuário), a extensão é por composição, não por edição da factory:

```js
// features/users/services/userService.js
const baseService = createCrudService('users', { mockData: MOCK_USERS });
export const userService = {
  ...baseService,
  async toggleStatus(id) { /* usa baseService.getById + baseService.patch */ },
};
```

A factory nunca precisa saber que "toggleStatus" existe — está fechada pra modificação, aberta pra extensão.

### 3.3 LSP (Liskov Substitution)

Todo serviço que sai de `createCrudService` devolve exatamente a mesma forma: `getAll()` resolve um array, `create()`/`update()` resolvem o objeto salvo, `remove()` resolve `true`. Isso é o que permite `DynamicTable.vue` e `useDataTable.js` (componentes genéricos que não sabem nada sobre tarefas ou usuários) funcionarem com qualquer um dos dois sem `if (isTask) ... else ...` em lugar nenhum.

### 3.4 ISP (Interface Segregation)

`features/auth/composables/useAuth.js` expõe só `{ login, logout, loading, user, isAuthenticated }` — o que `LoginPage.vue`, `AppSidebar.vue` e `ProfilePage.vue` realmente consomem. Os detalhes de como o toast é disparado ou como o loading global é acionado ficam internos ao composable; nenhum consumidor precisa (nem consegue) saber disso.

### 3.5 DIP (Dependency Inversion)

- `src/config/env.js` é o único lugar do projeto que lê `import.meta.env`. Todo o resto (incluindo `httpClient.js`) depende dessa abstração.
- `src/services/http/httpClient.js` é a única abstração que qualquer service conhece. Nenhum componente ou composable importa `axios` diretamente — grep por `from 'axios'` fora de `httpClient.js` não retorna nada.

## 4. Estratégia de testes

Vitest + `@vue/test-utils`, configurados em `vite.config.js` (bloco `test`, ambiente `happy-dom`) com setup em `tests/setup.js`. Testes ficam colocados ao lado do arquivo testado (convenção Vitest), não numa pasta `__tests__` separada — mantém a associação óbvia e evita o teste ficar esquecido quando o arquivo original é movido.

Quatro exemplos representando as quatro camadas da arquitetura:

| Arquivo | Camada | O que cobre |
|---|---|---|
| `src/utils/objectUtils.spec.js` | util puro | leitura/escrita de valor aninhado por path, incluindo caminho ausente |
| `src/composables/useToast.spec.js` | composable com estado | adição, auto-remoção por timer (`vi.useFakeTimers`), remoção manual |
| `src/services/http/createCrudService.spec.js` | service | delega corretamente pro `httpClient` mockado (`vi.mock`) e propaga erro quando `env.isDev` é `false` |
| `src/components/common/AppButton.spec.js` | componente | slot renderizado, evento emitido, estado `disabled`/`loading` |

`npm run test` roda a suíte uma vez (CI); `npm run test:watch` fica observando.

## 5. Limpeza de dependências e config

- Removidos de `package.json`: `express`, `better-sqlite3`, `dotenv`, `@google/genai`, `@types/express`, `tsx` — nenhum usado em `src/`.
- `vite` deixou de aparecer duplicado em `dependencies` e `devDependencies` — fica só em dev, onde pertence.
- Adicionados como devDependencies: `vitest`, `@vue/test-utils`, `happy-dom`.
- `metadata.json` (resíduo do AI Studio) removido.
- `.env.example` reescrito: só `VITE_API_URL` e `VITE_APP_NAME` (branding do template).
- `eslint.config.js`: regra `vue/multi-word-component-names` reativada (o código já era compliant) e globals de teste (`describe`, `it`, `expect`, `vi`, etc.) adicionados pra não conflitar com `no-undef` nos arquivos `*.spec.js`.

## 6. Guia de extensão — criando uma feature nova

1. Copiar `src/features/tasks/` como esqueleto.
2. `services/<recurso>Service.js`: `createCrudService('<recurso>', { mockData: [...] })`. Ação fora do CRUD padrão? Compor por cima, como em `userService.toggleStatus`.
3. `composables/use<Recurso>.js`: estado, fetch, filtro (computed), CRUD orquestrado com toast — sem nada de template aqui.
4. `components/<Recurso>FormModal.vue`: `AppModal` + `DynamicForm` (reaproveita os campos de `src/components/common/`) ou inputs manuais se o formulário for simples.
5. `pages/<Recurso>ListPage.vue`: `DynamicTable` + a composable do passo 3. A página não deveria ter nenhuma lógica de fetch ou filtro escrita nela — só chamar o composable e renderizar.
6. `routes.js`: array de rotas da feature, com `meta.requiresAuth` / `meta.permission` / `meta.role` conforme necessário.
7. Registrar o `routes.js` novo em `src/router/index.js` (um import + um spread no array `children`).
8. Se o recurso tiver campo de status, adicionar o mapa em `src/constants/statusVariants.js` em vez de reescrever a função `getStatusVariant` em cada tela.

## 7. Verificação executada

- `npm run test` — 4 arquivos de teste, 17 testes, todos passando.
- `npm run lint` — 0 erros (349 avisos são só de formatação de template — quebra de linha por atributo —, regra de estilo já presente no projeto original e não relacionada a esta refatoração).
- `npm run build` — build de produção concluído sem erro.
- Servidor de desenvolvimento (`npm run dev`) subiu e todos os módulos críticos (rotas, páginas, composables, layout) foram requisitados através do pipeline de transformação do Vite sem erro de import/sintaxe.
