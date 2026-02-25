# Markdown Studio - Instruções para Agentes de AI

## 📋 Visão Geral do Projeto

**Markdown Studio** é uma aplicação Next.js 16 que converte markdown para documentos Word (.docx) com autenticação Google. Interface split-view em tempo real com editor markdown e preview lado a lado.

### Stack Tecnológico Principal

- **Next.js 16.1.6** (App Router, Turbopack)
- **React 19.2.4** com React Markdown 9.1.0 + remark-gfm 4.0.0
- **NextAuth.js 4.24.13** (autenticação Google OAuth)
- **Tailwind CSS 3.3** + **Framer Motion 11.18.2** (animações)
- **Zustand 4.4.0** (estado global)
- **docx 8.5.0** (exportação DOCX)
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

**Zustand store** (`lib/store.ts`):

```typescript
interface AppStore {
  markdown: string;
  setMarkdown: (content: string) => void;
  fileName: string;
  setFileName: (name: string) => void;
}
```

Consumido em: `MarkdownEditor`, `MarkdownPreview`, `Header`.

---

## 🔑 Padrões e Convenções Críticas

### 1. **Client vs Server Components**

- ✅ Todos os componentes que usam hooks (`useState`, `useSession`, `useAppStore`) são marcados com `'use client'`
- ✅ `layout.tsx` é Server Component (wraps `<Providers>` para SessionProvider)
- ✅ Paginas com `'use client'` passam a Session via context NextAuth

### 2. **Conversão Markdown → DOCX** (`lib/markdown-to-docx.ts`)

- **Parsing**: Tokenização linha-por-linha em tipo `ParsedMarkdown[]` com tipos: `heading|paragraph|list|code|table|hr`
- **Headings**: Detecta `#` e ajusta `HeadingLevel` 1-6 automaticamente
- **Listas**: Renderizadas como `Paragraph` com marcadores manuais (`•` para unordered, `1.` para ordered)
  - ⚠️ `docx@8.5.0` **não exporta** `ListItem` — usar `Paragraph` com marcadores inline
- **Formatação inline**: Processa `**bold**`, `_italic_`, `` `código` `` via `formatText()` com `TextRun`
- **Code blocks**: Suporta ` ```typescript ` com `language` tag (ignorado)
- **Export**: `markdownToDocx()` → `Document` → `Packer.toBlob()` → trigger download com `createObjectURL()`

**Padrão de lista** (evitar `ListItem`):

```typescript
// ✅ Correto: usar Paragraph com prefix
new Paragraph({
  text: '• Item da lista',
  style: 'ListParagraph',
});
```

### 3. **Tipagem e ESLint**

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

---

## 🛠️ Workflows Essenciais

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

Versões instaladas (atualizado em fevereiro 2026):

- `next@16.1.6` — App Router com Turbopack
- `react@19.2.4` — Hooks e JSX Transform (sem import React necessário)
- `react-dom@19.2.4` — Sincronizar com React
- `next-auth@4.24.13` — OAuth 2.0 Google (compatível com React 19)
- `framer-motion@11.18.2` — Atualizado para React 19
- `docx@8.5.0` — Sem `ListItem` export (usar marcadores inline)
- `eslint@8.57.1` — Suporta `.eslintrc.cjs` (não ESLint v9 flat config)
- `@typescript-eslint/parser@8.0.0` e `@typescript-eslint/eslint-plugin@8.0.0` — Compatível com React 19
- `typescript@5.3.3` — Modo strict ativado
- `lucide-react@0.294.0` — Ícones SVG (declarado para React 16-18, funciona com React 19)
