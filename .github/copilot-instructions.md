# Markdown Studio - Instruções para Agentes de AI

## 📋 Visão Geral do Projeto

**Markdown Studio** é uma aplicação Next.js 16 que converte markdown para documentos Word (.docx) com autenticação Google. Interface split-view em tempo real com editor markdown e preview lado a lado.

### Stack Tecnológico Principal

- **Next.js 16.1.6** (App Router, TypeScript)
- **NextAuth.js 4.24** (autenticação Google OAuth)
- **React 18.2** com React Markdown + remark-gfm
- **Tailwind CSS 3** + **Framer Motion** (animações)
- **Zustand** (estado global)
- **docx 8.5** (exportação DOCX)
- **ESLint 8.57 + Prettier 3.8** (formatação e linting)

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

- **Parsing**: função `parseMarkdown()` tokeniza markdown em tipo `ParsedMarkdown[]`
- **Tipos suportados**: heading, paragraph, list, code, table, hr
- **Listas**: renderizadas como `Paragraph` com marcadores manuais (`•` ou `1.`) pois `ListItem` não é exportado pela `docx@8.5.0`
- **Formatação inline**: `**bold**`, `_italic_`, `` `code` `` processadas por `formatText()`
- **Export**: `markdownToDocx()` → `Document` → `Packer.toBlob()` → download via `createObjectURL`

### 3. **Tipagem e ESLint**

- TypeScript strict: `tsconfig.json` ativa `strict: true`
- ESLint com Prettier: `.eslintrc.cjs` integra `eslint-plugin-prettier`
- Regras relaxadas: `@typescript-eslint/no-explicit-any: 'warn'` (necessário em alguns handlers react-markdown)
- **Scripts**:
  - `npm run lint` — ESLint com `--max-warnings=0` (falha se houver warnings)
  - `npm run lint:fix` — ESLint com `--fix`
  - `npm run format` — Prettier `--write`
  - `npm run format:check` — Prettier `--check`

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

---

## ⚠️ Armadilhas e Considerações

1. **ListItem Não Exportado**: `docx@8.5.0` não exporta `ListItem`. Listas são renderizadas como `Paragraph` com marcadores inline.
2. **React Markdown Props**: Components customizados (em `MarkdownPreview.tsx`) usam `any` para `props` pois `react-markdown@9` tem tipos complexos. Manter regra ESLint como `warn`.
3. **NEXTAUTH_SECRET Obrigatório**: Produção exige `NEXTAUTH_SECRET` em `.env` (aleatório longo).
4. **Zustand Sem Persistência**: Estado atual não persiste entre reloads. Se precisar, adicionar middleware `persist`.
5. **Tailwind CSS Classes**: Usar espacingem `py-`, `px-`, `mb-`, etc. Tema de cores: `neutral-{50..900}` (sem cores primárias).

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

---

## 💡 Boas Práticas para Agentes

1. **Rodar linting antes de submeter**: `npm run lint` (deve retornar 0 warnings/errors)
2. **Formatar código**: `npm run format` depois de mudanças
3. **Testar localmente**: `npm run dev` e validar manualmente no navegador
4. **Manter types tipificados**: Evitar `any` exceto em componentes `react-markdown` já conhecidos
5. **Respeitar padrões de pasta**: Componentes em `components/`, lógica em `lib/`, páginas em `app/`
6. **Usar Context7** para consultar versões de dependências ao sugerir atualizações

---

## 📌 Versões Críticas

Validar compatibilidade ao atualizar:

- `next@16.1.6` — App Router com Turbopack
- `react@18.2` — Hooks e JSX Transform
- `next-auth@4.24` — OAuth 2.0 Google
- `docx@8.5` — Sem `ListItem` export (usar marcadores inline)
- `eslint@8.57` — Suporta `.eslintrc.cjs` (não ESLint v9 flat config)
- `typescript@5.3` — Suporta TypeScript 5.9.3 (com warning)
