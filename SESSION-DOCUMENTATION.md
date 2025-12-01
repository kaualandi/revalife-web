# Sistema de Sessão do Formulário

## 🔐 Arquitetura de Sessão com ID Único (CUID)

O sistema foi atualizado para usar um **ID único de sessão** gerado pelo backend, permitindo:
- Persistência de dados no servidor
- Recuperação automática de formulários em andamento
- Auto-save incremental
- Proteção contra perda de dados

## 📊 Fluxo Completo

### 1. **Home Page** (`/`)

```
Usuário clica "Continuar"
    ↓
Tem sessionId no localStorage?
    ↓ SIM                    ↓ NÃO
Carrega sessão existente    Cria nova sessão
    ↓                            ↓
GET /api/.../session/{id}   POST /api/.../session
    ↓                            ↓
Tem progresso (step > 0)?   Recebe novo sessionId
    ↓ SIM        ↓ NÃO          ↓
Auto-redirect   Normal redirect
    ↓               ↓
  /treatment-approach
```

### 2. **Treatment Page** (`/treatment-approach`)

```
Componente monta
    ↓
Tem sessionId?
    ↓ NÃO → Redirect para /
    ↓ SIM
Carrega dados da sessão
    ↓
[Loading...]
    ↓
Exibe formulário
    ↓
Auto-save a cada mudança (debounce 2s)
    ↓
PATCH /api/.../session/{id}
```

## 🗄️ Persistência

### LocalStorage
Armazena **apenas** o `sessionId`:
```json
{
  "sessionId": "clxxx..."
}
```

### Backend
Armazena todos os dados da sessão:
```json
{
  "sessionId": "clxxx...",
  "currentStepIndex": 2,
  "answers": {
    "birthdate": "1990-01-01",
    "biological-sex": "male",
    ...
  },
  "createdAt": "2025-11-30T...",
  "updatedAt": "2025-11-30T..."
}
```

## 🔌 Endpoints Necessários

### 1. Criar Nova Sessão
```http
POST /api/treatment-form/session
Response: { "sessionId": "clxxx..." }
```

### 2. Carregar Sessão Existente
```http
GET /api/treatment-form/session/{sessionId}
Response: {
  "sessionId": "clxxx...",
  "currentStepIndex": 0,
  "answers": {}
}
```

### 3. Auto-Save (Update Parcial)
```http
PATCH /api/treatment-form/session/{sessionId}
Body: {
  "currentStepIndex": 2,
  "answers": { ... }
}
```

### 4. Submit Final
```http
POST /api/treatment-form/session/{sessionId}/submit
Body: { "answers": { ... } }
```

## 💾 Store Zustand Atualizado

### Estados
- `sessionId`: ID único da sessão (CUID do backend)
- `currentStepIndex`: Step atual (0-based)
- `answers`: Respostas do formulário
- `isSubmitting`: Está submetendo formulário final
- `isLoading`: Está carregando dados

### Ações
- `setSessionId()`: Define o ID da sessão
- `loadFormData()`: Carrega dados do backend
- `setAnswer()`: Define resposta de uma pergunta
- `nextStep()` / `previousStep()`: Navegação
- `resetForm()`: Limpa tudo

## 🎯 Hooks Criados

### `useFormSession()`
Gerencia criação e carregamento de sessões.

```tsx
const {
  sessionId,
  isLoading,
  createSession,
  loadSession,
  initializeSession,
  hasExistingSession,
} = useFormSession();
```

**Métodos:**
- `createSession()`: Cria nova sessão no backend
- `loadSession(id)`: Carrega sessão existente
- `initializeSession()`: Cria ou carrega automaticamente
- `hasExistingSession`: Boolean se tem sessionId no localStorage

### `useFormAutoSave()` (atualizado)
Auto-save com debounce.

```tsx
const { isSaving, saveNow } = useFormAutoSave({
  answers,
  onSave: handleSave,
  delay: 2000,
  enabled: !!sessionId, // Novo: só salva se tem sessionId
});
```

## 🎨 UI/UX

### Home (`/`)
```tsx
<Button onClick={handleContinue} disabled={isLoading}>
  {isLoading
    ? hasExistingSession
      ? 'Recuperando preenchimento...'
      : 'Carregando...'
    : 'Continuar'}
</Button>
```

**Comportamento:**
- Se tem sessionId → "Recuperando preenchimento..."
- Se não tem → "Carregando..." (criando nova sessão)
- Se já tem progresso → Auto-redirect para `/treatment-approach`

### Treatment Page
```tsx
// Loading state
if (isLoadingSession || !sessionId) {
  return <div>Carregando formulário...</div>;
}
```

**Comportamento:**
- Sem sessionId → Redirect para `/`
- Loading enquanto carrega dados
- Auto-save transparente (usuário não percebe)

## 🔄 Exemplo Completo de Uso

### 1. Usuário Novo
```
1. Acessa /
2. Clica "Continuar"
3. POST /api/.../session → { sessionId: "clxxx" }
4. Salva no localStorage
5. Redirect /treatment-approach
6. Começa a preencher
7. Auto-save a cada mudança
```

### 2. Usuário Retornando
```
1. Acessa /
2. Detecta sessionId no localStorage
3. Mostra "Recuperando preenchimento..."
4. GET /api/.../session/clxxx → dados
5. Carrega currentStepIndex=2, answers={...}
6. Auto-redirect /treatment-approach
7. Mostra step 2 com respostas preenchidas
```

### 3. Sessão Inválida/Expirada
```
1. Acessa /
2. Detecta sessionId
3. GET /api/.../session/clxxx → 404/401
4. Limpa localStorage
5. Cria nova sessão
6. Redirect /treatment-approach (formulário limpo)
```

## 🛠️ Para Implementar no Backend

1. **Gerar CUID**: Use `@paralleldrive/cuid2`
2. **Criar tabela sessões** com TTL (ex: 7 dias)
3. **Endpoints** conforme documentado acima
4. **Validação** de sessionId em todas as requests
5. **Cleanup** de sessões expiradas

## 🎁 Benefícios

✅ **Zero perda de dados**: Tudo salvo no servidor  
✅ **Cross-device**: Pode continuar em outro dispositivo (futuro)  
✅ **Performance**: Apenas sessionId no localStorage  
✅ **Segurança**: Dados sensíveis no backend  
✅ **UX Superior**: Recuperação automática transparente  
✅ **Admin-ready**: Fácil gerenciar sessões no admin
