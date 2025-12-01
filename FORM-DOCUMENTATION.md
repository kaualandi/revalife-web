# Formulário Multi-Step - Treatment Approach

## 🎯 Arquitetura Implementada

### Sistema Config-Driven com JSON

O formulário foi implementado usando uma **arquitetura config-driven**, onde todas as perguntas, validações e lógica condicional são definidas em JSON/TypeScript.

## 📁 Estrutura de Arquivos

```
src/
├── types/
│   └── form.types.ts                    # Tipos TypeScript para todo o sistema
├── config/
│   └── treatment-form.config.ts         # Configuração das perguntas (JSON)
├── schemas/
│   └── treatment-form.schema.ts         # Validação Zod dinâmica
├── stores/
│   └── treatment-form-store.ts          # Estado global (Zustand)
├── hooks/
│   └── use-form-autosave.ts             # Auto-save com debounce
├── components/form/
│   ├── questions/
│   │   ├── radio-question.tsx           # Pergunta tipo radio
│   │   ├── radio-image-question.tsx     # Radio com imagens
│   │   ├── date-question.tsx            # Pergunta de data
│   │   ├── textarea-question.tsx        # Textarea
│   │   └── checkbox-question.tsx        # Checkbox múltipla escolha
│   ├── question-renderer.tsx            # Renderiza pergunta correta
│   ├── form-step.tsx                    # Renderiza step atual
│   └── form-navigation.tsx              # Navegação + progresso
└── app/(public)/treatment-approach/
    └── page.tsx                         # Página principal
```

## ✨ Funcionalidades

### 1. **Lógica Condicional no JSON**

Perguntas podem aparecer/desaparecer baseadas em respostas anteriores:

```typescript
{
  id: 'motivation-details',
  type: 'textarea',
  label: 'Conte-nos mais sobre sua motivação',
  showWhen: [
    {
      questionId: 'weight-loss-motivation',
      operator: 'equals',
      value: 'other',
    },
  ],
}
```

**Operadores suportados:**
- `equals`: Valor igual
- `notEquals`: Valor diferente
- `contains`: Array contém valor
- `notContains`: Array não contém valor

### 2. **Auto-Save com Debounce**

- Salva automaticamente após 2 segundos de inatividade
- Usa React Query para gerenciar mutations
- Save forçado ao clicar em "Continuar"

### 3. **Persistência com Zustand**

- Estado salvo no localStorage
- Usuário pode sair e voltar sem perder progresso
- Store gerencia toda lógica condicional

### 4. **Tipos de Perguntas Suportados**

- ✅ `date` - Data de nascimento
- ✅ `radio` - Opções simples
- ✅ `radio-image` - Opções com imagens
- ✅ `checkbox` - Múltipla escolha
- ✅ `textarea` - Texto longo
- ✅ `text` - Texto curto (não implementado, mas pronto)
- ✅ `select` - Dropdown (não implementado, mas pronto)

### 5. **Validação com Zod**

Schema gerado dinamicamente baseado nas perguntas visíveis.

### 6. **Barra de Progresso**

Mostra porcentagem de conclusão baseada nos steps.

## 🔧 Como Adicionar Novas Perguntas

### 1. Edite `treatment-form.config.ts`

```typescript
{
  id: 'new-step',
  questions: [
    {
      id: 'my-question',
      type: 'radio',
      label: 'Sua pergunta aqui?',
      required: true,
      options: [
        { value: 'yes', label: 'Sim' },
        { value: 'no', label: 'Não' },
      ],
    },
  ],
}
```

### 2. Para Perguntas Condicionais

```typescript
{
  id: 'conditional-question',
  type: 'textarea',
  label: 'Só aparece se...',
  showWhen: [
    {
      questionId: 'my-question',
      operator: 'equals',
      value: 'yes',
    },
  ],
}
```

### 3. Para Radio com Imagens

```typescript
{
  id: 'body-type',
  type: 'radio-image',
  label: 'Escolha uma imagem',
  grid: {
    cols: 2,        // 2, 3 ou 4 colunas
    imageSize: 'lg' // 'sm', 'md', 'lg'
  },
  options: [
    {
      value: 'type-1',
      label: 'Tipo 1',
      image: '/images/body-types/type-1.svg',
    },
  ],
}
```

## 🔌 Integrando com Backend

### Auto-Save

Edite a função `handleSave` em `page.tsx`:

```typescript
const handleSave = async (formAnswers: FormAnswers) => {
  await fetch('/api/treatment-form/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers: formAnswers }),
  });
};
```

### Submit Final

Edite `handleContinue` quando `isLastStep`:

```typescript
await fetch('/api/treatment-form/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ answers }),
});
```

## 🎨 Personalização

### Alterar delay do auto-save

Em `page.tsx`:

```typescript
const { isSaving, saveNow } = useFormAutoSave({
  answers,
  onSave: handleSave,
  delay: 3000, // 3 segundos
});
```

### Desabilitar auto-save

```typescript
const { isSaving, saveNow } = useFormAutoSave({
  answers,
  onSave: handleSave,
  enabled: false, // Desabilitado
});
```

## 🚀 Próximos Passos

1. **Adicionar validações customizadas** no schema Zod
2. **Criar mais tipos de perguntas** (select, range, etc)
3. **Implementar animações** entre steps
4. **Adicionar suporte a uploads** de imagens
5. **Criar dashboard admin** para gerenciar perguntas

## 💡 Vantagens da Arquitetura

✅ **Escalável**: Adicionar perguntas é só editar JSON  
✅ **Manutenível**: Separação clara de lógica e dados  
✅ **Testável**: Fácil testar lógica condicional  
✅ **Admin-ready**: Pronto para dashboard administrativo  
✅ **Type-safe**: TypeScript garante tipagem forte  
✅ **Performance**: Zustand + React Query otimizados
