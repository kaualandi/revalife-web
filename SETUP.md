# RevaLife - Configuração do Projeto

## Bibliotecas Instaladas e Configuradas

### Gerenciamento de Estado

- **Zustand**: State management simples e performático
  - Arquivos de exemplo: `src/stores/example-store.ts` e `src/stores/user-store.ts`
  - Suporte a DevTools e persistência (localStorage)

### Gerenciamento de Dados

- **React Query (@tanstack/react-query)**: Gerenciamento de estado assíncrono
  - Provider configurado em: `src/providers/query-provider.tsx`
  - DevTools incluídas
  - Exemplo de uso: `src/hooks/use-example-query.ts`

### Validação e Formulários

- **Zod**: Validação de schemas TypeScript-first
- **React Hook Form**: Gerenciamento de formulários performático
- **@hookform/resolvers**: Integração entre React Hook Form e Zod
  - Exemplo de schema: `src/schemas/auth.schema.ts`

### Code Quality

- **Prettier**: Formatação automática de código
  - Configuração: `.prettierrc`
  - Comandos: `npm run format` e `npm run format:check`
  - Plugin Tailwind CSS integrado

- **ESLint**: Linting rigoroso
  - Configuração: `eslint.config.mjs`
  - Regras TypeScript e React configuradas
  - Integração com Prettier

## Scripts Disponíveis

```bash
npm run dev          # Inicia o servidor de desenvolvimento
npm run build        # Cria build de produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa o ESLint
npm run format       # Formata todos os arquivos
npm run format:check # Verifica formatação sem modificar
```

## Exemplos de Uso

### React Query

```tsx
import { useExample } from '@/hooks/use-example-query';

function Component() {
  const { data, isLoading } = useExample();
  // ...
}
```

### Zustand

```tsx
import { useExampleStore } from '@/stores/example-store';

function Component() {
  const { count, increment } = useExampleStore();
  // ...
}
```

### React Hook Form + Zod

```tsx
import { useLoginForm } from '@/schemas/auth.schema';

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useLoginForm();
  // ...
}
```
