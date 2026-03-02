# Markdown Studio - Instruções para Agentes de AI

## 📋 Visão Geral do Projeto

**Markdown Studio** é uma aplicação Next.js 16 que converte markdown para documentos Word (.docx) com autenticação Google OAuth. Interface split-view em tempo real com editor markdown e preview lado a lado, suportando **múltiplas abas** para gerenciamento de múltiplos documentos simultaneamente.

### Stack Tecnológico Principal

- **Next.js 16.1.6** (App Router, Turbopack)
- **React 19.0.0** com React Markdown 9.0.0 + remark-gfm 4.0.0
- **NextAuth.js 4.24.0** (autenticação Google OAuth)
- **Tailwind CSS 3.3** + **Framer Motion 11.0.0** (animações)
- **Zustand 4.4.0** (estado global com abas, persistência localStorage)
- **docx 8.5.0** (exportação DOCX)
- **Mermaid 11.12.3** (renderização de diagramas em preview)
- **TypeScript 5.3** + **ESLint 8.57 + Prettier 3.8** (linting e formatação)

## 🏗️ Arquitetura e Fluxo de Dados

### Estrutura de Pastas (Atual)

```
app/                          # Next.js App Router
├── layout.tsx               # Root layout + SessionProvider
├── page.tsx                 # Home page (split-view + tabs)
├── auth/signin/page.tsx     # Login page (Google OAuth)
└── api/auth/[...nextauth]/  # NextAuth endpoints

components/                  # React components (todos 'use client')
├── Header.tsx              # Navbar + Exportar Todas/Salvar Todas/Auth
├── TabsBar.tsx             # Barra de abas com scroll, adicionar/remover/renomear
├── MarkdownEditor.tsx      # Textarea (esquerda) + clipboard inteligente
├── MarkdownPreview.tsx     # Preview com react-markdown (direita)
├── MermaidDiagram.tsx      # Renderizador de diagramas Mermaid
└── Providers.tsx           # SessionProvider wrapper

lib/
├── store.ts               # Zustand store (abas[], abaAtiva, persistência)
├── markdown-to-docx.ts    # Lógica de conversão markdown → DOCX
├── mermaid-cleaner.ts     # Utilitários para limpeza de diagramas Mermaid
└── versao.ts              # Versionamento da aplicação
```

### Sistema de Abas (Novo - Crítico!)

O projeto agora gerencia **múltiplas abas** ao invés de um único documento. Cada aba:

- Tem ID único gerado por `gerarIdUnico()` em `store.ts`
- Contém `nome` (renomeável em `TabsBar.tsx`)
- Contém `conteudo` (markdown editável)
- Contém `salvoAoMemento` (timestamp visual "Salvo às HH:MM:SS")

**Interface AbaData** (`lib/store.ts`):

```typescript
interface AbaData {
  id: string; // ID único
  nome: string; // Nome da aba (ex: "Documento 1")
  conteudo: string; // Markdown editável
  salvoAoMemento: string | null; // Timestamp quando salva (limpa após 3s)
}
```

### Fluxo de Dados

1. **Auth**: User → `/auth/signin` → NextAuth Google → `app/page.tsx` (redirect se não autenticado)
2. **Carregar Estado**: `app/page.tsx` → `useEffect([carregarDoStorage])` → restaura abas do localStorage
3. **Edição Ativa**: User edita markdown → `MarkdownEditor.onChange()` → `useAppStore.atualizarAba(abaAtiva, conteudo)`
4. **Preview em Tempo Real**: `abaAtual.conteudo` → `MarkdownPreview` → `ReactMarkdown` renderiza HTML + `MermaidDiagram` detecta ` ```mermaid `
5. **Gerenciamento de Abas**:
   - Adicionar: `TabsBar` → botão "+" → `adicionarAba()` → nova aba com `MARKDOWN_PADRAO`
   - Renomear: `TabsBar` → duplo clique → `finalizarRenomeacao()` → `atualizarAba(id, conteudo, novoNome)`
   - Remover: `TabsBar` → botão "x" → `removerAba(id)` (sempre mínimo 1 aba)
   - Exportar individual: `TabsBar` → botão download → `markdownToDocx(aba.conteudo, aba.nome)`
6. **Exportar Todas**: `Header` → botão "Exportar Todas" → loop `markdownToDocx()` para cada aba com `setTimeout(500ms)` entre elas
7. **Persistência**: `salvarNoStorage(abaId?)` → localStorage com `CHAVE_STORAGE_ABAS` e `CHAVE_STORAGE_ABA_ATIVA`

### Gerenciamento de Estado com Zustand (`lib/store.ts`)

**Interface completa AppStore**:

```typescript
interface AppStore {
  // Dados
  abas: AbaData[]; // Array de todas as abas
  abaAtiva: string; // ID da aba ativa
  mostrarPreview: boolean; // Controlar visibilidade do preview (mobile)
  textoSelecionado: string; // Rastreamento de texto selecionado

  // Setters simples
  setAbaAtiva: (id: string) => void; // Muda aba ativa
  setTextoSelecionado: (texto: string) => void; // Atualiza texto selecionado
  setMostrarPreview: (valor: boolean) => void; // Define visibilidade preview
  toggleMostrarPreview: () => void; // Alterna visibilidade preview

  // Operações em abas
  adicionarAba: () => void; // Cria nova aba com MARKDOWN_PADRAO
  removerAba: (id: string) => void; // Remove aba (mínimo 1)
  atualizarAba: (id: string, conteudo: string, nome?: string) => void; // Atualiza conteúdo/nome
  setSalvoAoMemento: (abaId: string, data: string | null) => void; // Set timestamp

  // Persistência
  carregarDoStorage: () => void; // Restaura abas do localStorage ao iniciar
  salvarNoStorage: (abaId?: string) => void; // Salva todas as abas + mostra timestamp em uma aba
  salvarTodasAsAbas: () => void; // Salva todas + mostra timestamp em todas
  fecharTodasAsAbas: () => void; // Limpa localStorage + reinicia com 1 aba vazia
}
```

**Padrão de uso em componentes**:

1. **Em `page.tsx`**:

   ```typescript
   const { carregarDoStorage } = useAppStore();
   useEffect(() => {
     carregarDoStorage();
   }, [carregarDoStorage]);
   ```

2. **Em `MarkdownEditor.tsx`**:

   ```typescript
   const { abaAtiva, atualizarAba } = useAppStore();
   onChange={(conteudo) => atualizarAba(abaAtiva, conteudo)}
   ```

3. **Em `TabsBar.tsx`**:

   ```typescript
   const { abas, abaAtiva, adicionarAba, removerAba, atualizarAba, salvarNoStorage } = useAppStore();
   ```

4. **Em `Header.tsx`**:
   ```typescript
   const { abas, salvarTodasAsAbas, fecharTodasAsAbas } = useAppStore();
   ```

**Chaves localStorage**:

- `'markdown-studio-abas'` — Array serializado de todas as abas
- `'markdown-studio-aba-ativa'` — ID da aba ativa

---

## 🔑 Padrões e Convenções Críticas

### 1. **Client vs Server Components**

- ✅ Todos os componentes que usam hooks (`useState`, `useSession`, `useAppStore`) são marcados com `'use client'`
- ✅ `layout.tsx` é Server Component (wraps `<Providers>` para SessionProvider)
- ✅ Paginas com `'use client'` passam a Session via context NextAuth

### 2. **Conversão Markdown → DOCX** (`lib/markdown-to-docx.ts`)

- **Parsing**: Tokenização linha-por-linha em tipo `ParsedMarkdown[]` com tipos: `heading|paragraph|list|code|table|hr|mermaid`
- **Headings**: Detecta `#` e ajusta `HeadingLevel` 1-6 automaticamente
- **Listas**: Renderizadas como `Paragraph` com marcadores manuais (`•` para unordered, `1.` para ordered)
  - ⚠️ `docx@8.5.0` **não exporta** `ListItem` — usar `Paragraph` com marcadores inline
- **Formatação inline**: Processa `**bold**`, `_italic_`, `` `código` `` via `formatText()` com `TextRun`
- **Code blocks**: Suporta ` ```typescript ` com `language` tag (ignorado em DOCX)
- **Estruturas ASCII**: Detecta blocos com `├──`, `└──`, `│`, etc. (padrão de árvore) e renderiza como `code` block em DOCX
- **Diagramas Mermaid**: Blocos ` ```mermaid ` são detectados mas renderizados como texto em DOCX (não suporta SVG inline)
- **Export**: `markdownToDocx()` → `Document` → `Packer.toBlob()` → trigger download com `createObjectURL()`

**Padrão de lista** (evitar `ListItem`):

```typescript
// ✅ Correto: usar Paragraph com prefix
new Paragraph({
  text: '• Item da lista',
  style: 'ListParagraph',
});
```

### 2.5. **Renderização de Diagramas Mermaid e Plugins Remark** (`components/MarkdownPreview.tsx`, `lib/mermaid-cleaner.ts`)

**Plugins Remark Configurados**:

- **`remarkGfm`** (4.0.0) — GitHub Flavored Markdown (tabelas, strikethrough, task lists)
- **`remarkBreaks`** (4.0.0) — Quebras de linha simples em tags `<br>`
- **`remarkEmoji`** (5.0.2) — Suporte para emojis (`:smile:` → 😄)
- **`remarkToc`** (9.0.0) — Tabela de conteúdos automática `## Table of Contents`
- **`remarkMath`** (6.0.0) — Equações matemáticas com delimitadores `$$..$$` ou `$...$`
- **`rehypeKatex`** (7.0.1) — Renderização KaTeX (requer import CSS: `import 'katex/dist/katex.min.css'`)

**Preview**: `MarkdownPreview.tsx` detecta blocos ` ```mermaid ` e renderiza via `<MermaidDiagram>` component

**Inicialização Mermaid**: `mermaid.initialize()` com `theme: 'default'` e `securityLevel: 'loose'`

**Erro Handling**: Renderiza div vermelho com mensagem de erro se diagrama falhar (ex: sintaxe inválida)

**Limpeza**: `limparDiagramaMermaid()` remove tags `<br/>`, `<br>`, `</br>` que quebram parseamento Mermaid

**Limitação DOCX**: Diagramas Mermaid não são exportados para DOCX — renderizados como bloco de código

**Ordem dos plugins importa**: `[remarkGfm, remarkBreaks, remarkEmoji, remarkToc, remarkMath]` e `[rehypeKatex]`

---

## 🏗️ Padrões de Componentes React

### **Estrutura Típica de Component Client**

```typescript
'use client';  // ✅ Obrigatório para componentes com hooks

import React, { useRef, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useAppStore } from '@/lib/store';

interface ComponentProps {
  content: string;
}

export const MyComponent: React.FC<ComponentProps> = ({ content }) => {
  // Hooks
  const { data: session } = useSession();
  const { abas, abaAtiva, salvarNoStorage } = useAppStore(); // ✅ Padrão para acessar store
  const [localState, setLocalState] = useState(false);
  const ref = useRef<HTMLElement>(null);

  // Effects and handlers
  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
};
```

### **Renderização Condicional com Preview Toggle**

O store oferece `mostrarPreview` e `toggleMostrarPreview()` para permitir esconder/mostrar o preview em mobile:

```typescript
const { mostrarPreview, toggleMostrarPreview } = useAppStore();

return (
  <div className="flex flex-1 overflow-hidden gap-px">
    {/* Editor sempre visível */}
    <MarkdownEditor />

    {/* Preview toggle em mobile */}
    {mostrarPreview && <MarkdownPreview />}

    <button onClick={toggleMostrarPreview}>
      {mostrarPreview ? <Eye /> : <EyeOff />}
    </button>
  </div>
);
```

### **Animações com Framer Motion**

Padrão usado em `Header.tsx` e `page.tsx`:

```typescript
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.2, duration: 0.5 }}
>
  {/* Conteúdo */}
</motion.div>

<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={handler}
>
  {/* Botão */}
</motion.button>
```

### **Custom ReactMarkdown Handlers**

Em `MarkdownPreview.tsx`, cada elemento HTML tem handler customizado:

```typescript
components={{
  h1: (props: any) => <h1 className="text-3xl font-bold ..." {...props} />,
  code: (props: any) => {
    const { inline, className, children, ...rest } = props as any;
    // Lógica especial: detectar Mermaid, Inline Code, etc.
    return <code {...rest}>{children}</code>;
  },
}}
```

⚠️ Props complexos usam `any` — regra ESLint `@typescript-eslint/no-explicit-any: 'off'` permite isso.

---

- TypeScript strict: `tsconfig.json` ativa `strict: true`
- ESLint com Prettier: `.eslintrc.cjs` integra `eslint-plugin-prettier`
- Regras: `@typescript-eslint/no-explicit-any: 'off'` (necessário em handlers `react-markdown`)
- **Regra crítica**: `@typescript-eslint/no-require-imports` — Usar imports ES6, não `require()`
- **Scripts**:
  - `npm run lint` — ESLint com `--max-warnings=0` (falha se houver warnings)
  - `npm run lint:fix` — ESLint com `--fix`
  - `npm run format` — Prettier `--write`
  - `npm run format:check` — Prettier `--check`

**Padrão ES6 obrigatório** — Evite `require()`:

```typescript
// ❌ Não fazer
const typography = require('@tailwindcss/typography');

// ✅ Fazer
import typography from '@tailwindcss/typography';
```

### 4. **Autenticação NextAuth**

- Google OAuth via `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`
- Callback: `/api/auth/callback/google`
- Sessão persistida em context React (`SessionProvider` em `Providers.tsx`)
- Acesso em componentes: `useSession()` hook
- **Configuração**: `app/api/auth/[...nextauth].ts` define `authOptions` e pagina signin customizada `/auth/signin/page.tsx`

### 5. **Configuração Prettier e ESLint Específicas**

**`.prettierrc.cjs`** (configs importantes):

- `printWidth: 250` — Limite de 250 caracteres por linha
- `singleQuote: true` — Aspas simples em JS/TS
- **Overrides**: TSX usa `jsxSingleQuote: false` (aspas duplas em JSX)
- HTML usa `htmlWhitespaceSensitivity: 'css'`
- Markdown com parser `markdown`

**`.eslintrc.cjs`** (regras críticas):

- `@typescript-eslint/no-explicit-any: ['off']` — Necessário para props em `react-markdown`
- `@typescript-eslint/no-unused-vars: ['warn', { argsIgnorePattern: '^_|^node$' }]` — Permite underscore para variáveis não utilizadas
- `react/react-in-jsx-scope: 'off'` — React 19 não requer import
- `prettier/prettier` integrado diretamente

---

## 🧪 Padrões de Testes (Jest + React Testing Library)

### **Configuração Jest** (`jest.config.js`)

- **Test Environment**: `jest-environment-jsdom` (para componentes React)
- **Path Mapping**: `@/` mapeia para raiz do projeto
- **Setup File**: `jest.setup.js` (configuração global)
- **Padrão de testes**: `**/__tests__/**/*.[jt]s?(x)` ou `**/?(*.)+(spec|test).[jt]s?(x)`
- **Coverage**: Coleta de `app/`, `components/`, `lib/` (exclui `.d.ts`, `node_modules`, `.next`, `coverage`)

⚠️ **Nota crítica**: `jest.config.js` usa ES modules com `import nextJest from 'next/jest.js'`. O último `module.exports` é necessário para compatibilidade com Jest.

### **Estrutura de Testes para Store Zustand** (`__tests__/lib/store.test.ts`)

Padrão usando `useAppStore.getState()` para acessar estado sem componentes:

```typescript
import { useAppStore } from '@/lib/store';

describe('useAppStore', () => {
  beforeEach(() => {
    const { fecharTodasAsAbas } = useAppStore.getState();
    fecharTodasAsAbas(); // Reset state antes de cada teste
  });

  it('deve adicionar uma nova aba', () => {
    const { adicionarAba, abas } = useAppStore.getState();
    const abasAntes = abas.length;

    adicionarAba();

    const { abas: abasDepois } = useAppStore.getState();
    expect(abasDepois.length).toBe(abasAntes + 1);
  });

  it('deve atualizar conteúdo de uma aba', () => {
    const { abas, atualizarAba } = useAppStore.getState();
    const idAba = abas[0].id;
    const novoConteudo = '# Novo Título';

    atualizarAba(idAba, novoConteudo);

    const { abas: abasAtualizado } = useAppStore.getState();
    const abaAtualizada = abasAtualizado.find((a) => a.id === idAba);
    expect(abaAtualizada?.conteudo).toBe(novoConteudo);
  });

  it('deve manter sempre pelo menos 1 aba', () => {
    const { removerAba, abas } = useAppStore.getState();
    const idAbaUnica = abas[0].id;

    removerAba(idAbaUnica);

    const { abas: abasAposTentarRemover } = useAppStore.getState();
    expect(abasAposTentarRemover.length).toBeGreaterThanOrEqual(1);
  });
});
```

### **Estrutura de Testes para Componentes** (`__tests__/components/*.test.tsx`)

Padrão com `render()` do React Testing Library e `useAppStore` em mocks:

```typescript
import { render, screen } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { MyComponent } from '@/components/MyComponent';

// Mock da sessão
const mockSession = {
  user: { name: 'Test User', email: 'test@example.com' },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

describe('MyComponent', () => {
  it('deve renderizar conteúdo corretamente', () => {
    render(
      <SessionProvider session={mockSession}>
        <MyComponent content="Test content" />
      </SessionProvider>,
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });
});
```

### **Scripts de Teste**

```bash
npm run test                # Rodar testes uma vez
npm run test:watch         # Modo watch (re-roda ao salvar)
npm run test:coverage      # Coverage report (exclui .d.ts, node_modules, .next)
```

---

## 🎨 Padrões Específicos Críticos

### Header Component (`components/Header.tsx`)

**Funcionalidades principais**:

1. **Botão Exportar Todas**: Loop `markdownToDocx()` para cada aba com 500ms delay
2. **Botão Salvar Todas**: `salvarTodasAsAbas()` → mostra timestamp em todas as abas → limpa após 3s
3. **User Info**: Exibe `session.user.name` e `session.user.email`
4. **Auth Buttons**: Toggle entre `signIn()` e `signOut()`
5. **Versioning**: Exibe versão de `lib/versao.ts`

**Padrão animação save feedback**:

```typescript
{aba.salvoAoMemento ? (
  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
    <CheckCircle2 size={18} />
  </motion.div>
) : (
  <Save size={18} />
)}
```

### MarkdownEditor Component (`components/MarkdownEditor.tsx`)

**Funcionalidades**:

- Textarea com suporte a Tab (insere `\t`)
- Dropdown inteligente: Colar / Limpar e Colar
- Estado `colado` para feedback visual (mostra CheckCircle2 por 2s)

**Padrão Tab handling**:

```typescript
const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === 'Tab') {
    e.preventDefault();
    const start = textarea.selectionStart;
    const newValue = value.substring(0, start) + '\t' + value.substring(end);
    onChange(newValue);
    setTimeout(() => {
      textarea.selectionStart = start + 1;
    }, 0);
  }
};
```

### TabsBar Component (`components/TabsBar.tsx`)

**Funcionalidades**:

- Array de abas com scroll horizontal
- Adicionar aba: botão "+" → `adicionarAba()`
- Remover aba: botão "x" por aba → `removerAba(id)` (mínimo 1)
- Renomear: duplo clique em aba → input inline → `finalizarRenomeacao()`
- Salvar individual: botão Save por aba → `salvarNoStorage(id)`
- Exportar individual: botão Download por aba → `markdownToDocx(aba.conteudo, aba.nome)`
- Scroll: botões left/right para navegar entre abas em viewports pequenos

### Page Component (`app/page.tsx`)

**Padrão de proteção e estado initial**:

- `useSession()` + `useRouter().push('/auth/signin')` se não autenticado
- `carregarDoStorage()` em `useEffect([carregarDoStorage])` ao montar
- `status === 'loading'` renderiza spinner animado com Framer Motion
- Split-view: editor esquerda + preview direita com animações de entrada

---

### Documemtação de Desenvolvimento e Debug

Usar a pasta ./docs para documentação de desenvolvimento, debug e armadilhas comuns. Esta seção é crítica para manutenção futura e onboarding de novos desenvolvedores.
Todos os detalhes técnicos, padrões de código, armadilhas comuns e soluções de debug devem ser documentados aqui para referência rápida.
O padrao é markdown com seções claras, exemplos de código e explicações detalhadas.

### Build e Desenvolvimento

```bash
npm install                    # Instalar dependências
npm run dev                   # Dev server (localhost:3000)
npm run build                 # Build otimizado
npm start                     # Produção
npm run lint                  # Verificar linting
npm run lint:fix              # Corrigir problemas automáticos
npm run format                # Formatar código com Prettier
```

### Debug Comum

- **"Abas não salvam"**: Verificar `salvarNoStorage()` e localStorage em DevTools → localStorage
- **"Aba não renderiza preview"**: Verificar `abaAtual` em `page.tsx` (deve ser não-nulo) → pode estar undefined
- **"Export não funciona"**: Verificar console — `markdownToDocx()` deve não lançar erro
- **"Type errors"**: Rodar `npx tsc --noEmit` para verificar tipos
- **"NEXTAUTH_SECRET missing"**: Adicionar variável de ambiente aleatória (mínimo 32 bytes) → `openssl rand -base64 32`
- **"Session null"**: Verificar `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET` em `.env.local`
- **"Mermaid não renderiza"**: Verificar sintaxe em [mermaid.live](https://mermaid.live) → provavelmente erro na sintaxe do diagrama
- **"Zustand state não atualiza"**: Verificar que componente está marcado com `'use client'` → necessário para hooks
- **"Jest test fails com 'module is not defined'"**: `jest.config.js` está em ES module mas precisa `module.exports` no final — regra ESLint `@typescript-eslint/no-require-imports` desativada para este arquivo
- **"ReferenceError: localStorage is not defined"**: Sempre usar `typeof window !== 'undefined'` antes de acessar `localStorage` (SSR safety)
- **"Plugins remark não funcionam"**: Verificar ordem em `remarkPlugins={[remarkGfm, remarkBreaks, remarkEmoji, remarkToc, remarkMath]}` — ordem importa!
- **"KaTeX não renderiza"**: Incluir `import 'katex/dist/katex.min.css'` antes de usar `rehypeKatex`

---

## ⚠️ Armadilhas e Considerações

1. **ListItem Não Exportado**: `docx@8.5.0` não exporta `ListItem` — usar `Paragraph` com marcadores inline
2. **React Markdown Props**: Components customizados usam `any` (regra ESLint desativada)
3. **NEXTAUTH_SECRET Obrigatório**: Produção exige `NEXTAUTH_SECRET` em `.env` (aleatório longo)
4. **Mínimo 1 aba**: Sempre manter pelo menos 1 aba aberta (validação em `removerAba()`)
5. **Tailwind CSS Colors**: Usar `neutral-{50..900}` (sem cores primárias por padrão)
6. **React 19 - Sem import React**: Em arquivos JSX, não importar React (otimização)
7. **lucide-react peer warning**: Seguro ignorar (compatível com React 19)
8. **localStorage Síncrono**: `carregarDoStorage()` lê localStorage no cliente apenas (`typeof window !== 'undefined'`)

---

## 📌 Versões Críticas

Sincronizadas com `package.json`:

- `next@16.1.6` — App Router com Turbopack
- `react@19.0.0` — JSX Transform (sem import React)
- `react-dom@19.0.0` — Sincronizar com React
- `next-auth@4.24.0` — OAuth 2.0 Google (React 19)
- `framer-motion@11.0.0` — Animações (React 19)
- `mermaid@11.12.3` — Diagramas em tempo real
- `docx@8.5.0` — Export DOCX (sem `ListItem`)
- `react-markdown@9.0.0` — Parse markdown
- `remark-gfm@4.0.0` — GFM support
- `zustand@4.4.0` — State management
- `tailwindcss@3.3.0` — Utility CSS
- `@tailwindcss/typography@0.5.19` — Prose styling
- `lucide-react@0.575.0` — Ícones SVG
- `eslint@8.57.1` — Linting (`.eslintrc.cjs`)
- `@typescript-eslint@8.0.0` — TypeScript ESLint
- `prettier@3.8.1` — Code formatting
- `typescript@5.3.0` — Tipagem estrita
