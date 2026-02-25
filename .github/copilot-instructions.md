# Markdown Studio - Instruções para Agentes de AI

## 📋 Visão Geral do Projeto

**Markdown Studio** é uma aplicação Next.js 16 que converte markdown para documentos Word (.docx) com autenticação Google. Interface split-view em tempo real com editor markdown e preview lado a lado.

### Stack Tecnológico Principal

- **Next.js 16.1.6** (App Router, Turbopack)
- **React 19.0.0** com React Markdown 9.0.0 + remark-gfm 4.0.0
- **NextAuth.js 4.24.0** (autenticação Google OAuth)
- **Tailwind CSS 3.3** + **Framer Motion 11.0.0** (animações)
- **Zustand 4.4.0** (estado global, com persistência via localStorage)
- **docx 8.5.0** (exportação DOCX)
- **Mermaid 11.12.3** (renderização de diagramas em preview)
- **TypeScript 5.3** + **ESLint 8.57 + Prettier 3.8** (linting e formatação)

---

## 🏗️ Arquitetura e Fluxo de Dados

### Estrutura de Pastas

```
app/                          # Next.js App Router
├── layout.tsx               # Root layout + SessionProvider
├── page.tsx                 # Home page (split-view editor)
├── auth/signin/page.tsx     # Login page (Google OAuth)
└── api/auth/[...nextauth]/  # NextAuth endpoints

components/                  # React components (todos 'use client')
├── Header.tsx              # Navbar + Export/Auth buttons
├── MarkdownEditor.tsx      # Textarea left panel
├── MarkdownPreview.tsx     # Right panel com react-markdown
└── Providers.tsx           # SessionProvider wrapper

lib/
├── store.ts               # Zustand global state (markdown, fileName)
└── markdown-to-docx.ts    # Lógica de conversão markdown → DOCX

docs/                      # Documentação adicional (arquitetura, setup, etc)
```

### Fluxo de Dados Principal

1. **Autenticação**: User → `app/auth/signin/page.tsx` → NextAuth → `app/page.tsx` (protected)
2. **Edição**: User digita markdown → `MarkdownEditor` → `useAppStore.setMarkdown()` → estado global Zustand
3. **Preview em Tempo Real**: Estado Zustand → `MarkdownPreview` → `ReactMarkdown` renderiza HTML
4. **Exportação**: User clica "Exportar DOCX" → `Header.handleExport()` → `markdownToDocx()` → `docx.Packer` → download

### Gerenciamento de Estado

**Zustand store** (`lib/store.ts`) com persistência via localStorage:

```typescript
interface AppStore {
  markdown: string;
  setMarkdown: (content: string) => void;
  fileName: string;
  setFileName: (name: string) => void;
  salvoAoMemento: string | null;
  setSalvoAoMemento: (data: string) => void;
  carregarDoStorage: () => void;      // Carrega markdown e fileName do localStorage
  salvarNoStorage: () => void;        // Persiste estado + mostra timestamp "Salvo às HH:MM:SS"
}
```

**Padrão de uso em componentes**:
1. Em `page.tsx`: chamar `carregarDoStorage()` em `useEffect([carregarDoStorage])` para restaurar estado ao montar
2. Em `Header.tsx`: chamar `salvarNoStorage()` ao clicar botão "Salvar" — mostra animação e limpa `salvoAoMemento` após 3s
3. Chaves localStorage: `'markdown-studio-markdown'` e `'markdown-studio-nome-arquivo'`

Consumido em: `MarkdownEditor`, `MarkdownPreview`, `Header`.

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

### 2.5. **Renderização de Diagramas Mermaid** (`components/MermaidDiagram.tsx`, `lib/mermaid-cleaner.ts`)

- **Preview**: `MarkdownPreview.tsx` detecta blocos ` ```mermaid ` e renderiza via `<MermaidDiagram>` component
- **Inicialização**: `mermaid.initialize()` com `theme: 'default'` e `securityLevel: 'loose'`
- **Erro Handling**: Renderiza div vermelho com mensagem de erro se diagrama falhar (ex: sintaxe inválida)
- **Limpeza**: `limparDiagramaMermaid()` remove tags `<br/>`, `<br>`, `</br>` que quebram parseamento Mermaid
- **Limitação DOCX**: Diagramas Mermaid não são exportados para DOCX — renderizados como bloco de código

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
  const { markdown, setMarkdown } = useAppStore();
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
- `printWidth: 100` — Limite de 100 caracteres por linha
- `singleQuote: true` — Aspas simples em JS/TS
- **Overrides**: TSX usa `jsxSingleQuote: false` (aspas duplas em JSX)
- HTML usa `htmlWhitespaceSensitivity: 'css'`
- Markdown e MDX com parser `markdown`

**`.eslintrc.cjs`** (regras críticas):
- `@typescript-eslint/no-explicit-any: ['off']` — Necessário para props em `react-markdown`
- `@typescript-eslint/no-unused-vars: ['warn', { argsIgnorePattern: '^_' }]` — Permite underscore para variáveis não utilizadas
- `react/react-in-jsx-scope: 'off'` — React 19 não requer import
- `prettier/prettier` integrado diretamente

---

## 🎨 Padrões Específicos Críticos

### Header Component (`components/Header.tsx`)

**Funcionalidades principais**:
1. **Botão Exportar DOCX**: Chama `markdownToDocx()` com `setIsExporting` para UI feedback
2. **Botão Salvar**: Chama `salvarNoStorage()` → exibe timestamp animado via `salvoAoMemento` → limpa após 3s
3. **User Info**: Exibe `session.user.name` e `session.user.email` quando autenticado
4. **Auth Buttons**: Toggle entre `signIn()` e `signOut()` baseado em `useSession()`
5. **Versioning**: Exibe versão formatada com `obterVersaoFormatada()` de `lib/versao.ts`

**Padrão animação save feedback**:
```typescript
{salvoAoMemento ? (
  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
    <CheckCircle2 size={18} />
  </motion.div>
) : (
  <Save size={18} />
)}
<span>{salvoAoMemento || 'Salvar'}</span>
```

### Editor Component (`components/MarkdownEditor.tsx`)

**Padrão Tab handling**:
```typescript
const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === 'Tab') {
    e.preventDefault();
    // Insere \t e repositiciona cursor
    const start = textarea.selectionStart;
    const newValue = value.substring(0, start) + '\t' + value.substring(end);
    onChange(newValue);
    setTimeout(() => { textarea.selectionStart = start + 1; }, 0);
  }
};
```

### Page Component (`app/page.tsx`)

**Padrão de proteção e estado initial**:
- `useSession()` + `useRouter().push('/auth/signin')` se não autenticado
- `carregarDoStorage()` em `useEffect([carregarDoStorage])` ao montar
- `status === 'loading'` renderiza spinner animado com Framer Motion
- Split-view: editor esquerda + preview direita com animações de entrada

---

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

- **"Export button disabled"**: Verificar `session` em `Header.tsx` — usuário não autenticado
- **"Markdown não renderiza preview"**: Verificar `MarkdownPreview.tsx` se `ReactMarkdown` está recebendo prop `content`
- **"DOCX não baixa"**: Verificar console — `Packer.toBlob()` em `markdown-to-docx.ts` pode falhar se markdown é inválido
- **"Type errors"**: Rodar `npx tsc --noEmit` para verificar tipos antes de submeter PR
- **"NEXTAUTH_SECRET missing"**: Em produção, adicionar variável de ambiente aleatória (mínimo 32 bytes)
- **"Zustand state not updating"**: Verificar que componente está marcado com `'use client'`
- **"Packer.toBlob() timeout"**: Se markdown é muito grande, considerar quebrar em múltiplos documentos

---

## ⚠️ Armadilhas e Considerações

1. **ListItem Não Exportado**: `docx@8.5.0` não exporta `ListItem`. Listas são renderizadas como `Paragraph` com marcadores inline.
2. **React Markdown Props**: Components customizados (em `MarkdownPreview.tsx`) usam `any` para `props` pois `react-markdown@9` tem tipos complexos. Manter regra ESLint como `off`.
3. **NEXTAUTH_SECRET Obrigatório**: Produção exige `NEXTAUTH_SECRET` em `.env` (aleatório longo).
4. **Zustand Sem Persistência**: Estado atual não persiste entre reloads. Se precisar, adicionar middleware `persist`.
5. **Tailwind CSS Classes**: Usar spacing em `py-`, `px-`, `mb-`, etc. Tema de cores: `neutral-{50..900}` (sem cores primárias).
6. **React 19 - Sem import React**: Em React 19, não é necessário importar React em arquivos JSX. Se vir `import React from 'react'`, remova (otimização de bundle).
7. **lucide-react peer warning**: Pacote declara suporte React 16-18, mas funciona com React 19. Aviso é seguro ignorar.

---

## 📝 Exemplos de Padrões

### Adicionar Nova Funcionalidade (ex: tema dark mode)

1. Adicionar state em `lib/store.ts`: `isDarkMode: boolean`
2. Adicionar toggle em `Header.tsx`
3. Aplicar classes condicionais em componentes: `className={isDarkMode ? 'bg-black' : 'bg-white'}`

### Corrigir Tipo em React Markdown

```typescript
// ❌ Evitar
code: (props) => <code {...props} />

// ✅ Fazer
code: (props: any) => <code {...(props as any)} />
// Usar 'any' temporariamente se tipos são complexos
```

### Exportar Novo Formato (ex: PDF)

1. Adicionar biblioteca em `package.json` (ex: `html2pdf`)
2. Criar `lib/markdown-to-pdf.ts` seguindo padrão `markdown-to-docx.ts`
3. Chamar em `Header.tsx` semelhante ao botão DOCX

---

## 🔗 Referências Rápidas

- **Documentação Técnica**: `/docs/ARQUITETURA_TECNICA.md`, `/docs/SETUP_RAPIDO.md`
- **Configuração**: `.env.local.example` para variáveis obrigatórias
- **Config ESLint**: `.eslintrc.cjs` (integrado com Prettier)
- **Config Prettier**: `.prettierrc.cjs` (overrides para TSX e HTML)
- **TypeScript**: `tsconfig.json` com `strict: true`
- **Atualização React 19**: Veja `ATUALIZACAO_REACT_19.md` para detalhes da migração recente

---

## 📌 Versões Críticas

Versões instaladas (atualizado em fevereiro 2026, sincronizadas com `package.json`):

- `next@16.1.6` — App Router com Turbopack
- `react@19.0.0` — Hooks e JSX Transform (sem import React necessário)
- `react-dom@19.0.0` — Sincronizar com React
- `next-auth@4.24.0` — OAuth 2.0 Google (compatível com React 19)
- `framer-motion@11.0.0` — Atualizado para React 19
- `mermaid@11.12.3` — Renderização de diagramas em tempo real
- `docx@8.5.0` — Sem `ListItem` export (usar marcadores inline)
- `react-markdown@9.0.0` — Processamento markdown com plugins
- `remark-gfm@4.0.0` — GitHub Flavored Markdown support
- `zustand@4.4.0` — State management leve
- `tailwindcss@3.3.0` — Utility-first CSS
- `@tailwindcss/typography@0.5.19` — Prose styling para markdown
- `lucide-react@0.575.0` — Ícones SVG (declara React 16-18, funciona com React 19)
- `eslint@8.57.1` — Suporta `.eslintrc.cjs` (não ESLint v9 flat config)
- `@typescript-eslint/parser@8.0.0` e `@typescript-eslint/eslint-plugin@8.0.0` — Compatível com React 19
- `prettier@3.8.1` — Code formatting com configuração customizada
- `typescript@5.3.0` — Modo strict ativado
