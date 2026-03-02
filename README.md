# Markdown Studio

Uma aplicação web moderna e minimalista que permite converter markdown para documentos Word (.docx) em tempo real, com autenticação segura via Google. Desenvolvida com Next.js 16.1.6, React 19.0.0 e Tailwind CSS 3.3.0, oferece uma interface split-view profissional com suporte a múltiplas abas renomeáveis para máxima produtividade.

**Versão**: 1.0.18 | **Status**: ✅ Completo e funcional

## 🎯 Funcionalidades

- ✅ **Editor Split-View**: Editor markdown lado a lado com preview em tempo real (sem delay)
- ✅ **Sistema de Abas**: Gerencia múltiplos documentos simultaneamente com abas renomeáveis
- ✅ **Autenticação Google**: Login seguro com NextAuth.js
- ✅ **Exportação DOCX Individual e em Lote**: Exporte um documento ou todos de uma vez
- ✅ **Suporte Markdown Completo**: Headings (H1-H6), listas ordenadas/desordenadas, código com syntax highlight, blocos de citação, links, tabelas, linhas horizontais
- ✅ **Diagramas Mermaid**: Renderização em tempo real de diagramas (flow, sequence, state, gantt, etc.) com suporte completo
- ✅ **Estruturas de Árvore e Diagramas ASCII**: Detecta e renderiza automaticamente diagramas com caracteres `├──`, `└──`, `│`, etc.
- ✅ **Plugins Remark Avançados**:
  - 📝 **remark-breaks** - Quebras de linha simples em `<br>` tags
  - 😄 **remark-emoji** - Suporte para emojis (`:smile:` → 😄)
  - 📚 **remark-toc** - Tabela de conteúdos automática
  - 🧮 **remark-math + rehype-katex** - Equações matemáticas LaTeX renderizadas com KaTeX
  - 🔗 **remark-slug** - Links internos com slugs automáticos nos headings
- ✅ **Interface Minimalista**: Design refinado e profissional
- ✅ **Responsivo**: Funciona em desktop, tablets e mobile
- ✅ **Formatação Inline**: Suporte a **negrito**, _itálico_ e `` `código inline` ``
- ✅ **Animações Suaves**: Transições elegantes com Framer Motion
- ✅ **Persistência Local**: Salva automaticamente todas as abas e seus conteúdos no localStorage
- ✅ **Linting e Formatting**: ESLint + Prettier pré-configurados
- ✅ **Clipboard Inteligente**: Colar conteúdo normalmente ou limpar e colar de uma vez

## 🛠️ Stack Tecnológico

### Frontend e Bibliotecas Principais

- **Next.js 16.1.6** (App Router, Turbopack)
- **React 19.0.0** com React Markdown 9.0.0 + remark-gfm 4.0.0
- **NextAuth.js 4.24.0** (autenticação Google OAuth)
- **Tailwind CSS 3.3.0** + **Framer Motion 11.0.0** (animações suaves)
- **Zustand 4.4.0** (gerenciamento de estado global com persistência localStorage)
- **docx 8.5.0** (exportação DOCX)
- **Mermaid 11.12.3** (renderização de diagramas em preview)
- **Lucide React 0.575.0** (ícones SVG)
- **Plugins Remark** (markdown avançado):
  - **remark-gfm 4.0.0** (GitHub Flavored Markdown - tabelas, strikethrough, task lists)
  - **remark-breaks 4.0.0** (quebras de linha simples em `<br>`)
  - **remark-emoji** (suporte para emojis)
  - **remark-toc** (tabela de conteúdos automática)
  - **remark-math** + **rehype-katex** (equações matemáticas LaTeX)
  - **remark-slug** (slugs automáticos para headings)

### Ferramentas de Desenvolvimento

- **TypeScript 5.3.0** (tipagem estrita com strict mode)
- **ESLint 8.57.1** + **@typescript-eslint 8.0.0** (linting com regras TypeScript)
- **Prettier 3.8.1** (formatação de código com overrides para TSX/HTML)
- **@tailwindcss/typography 0.5.19** (prose styling para markdown)

## 🏗️ Arquitetura

### Componentes Principais

```
App/
├── Header.tsx (Navbar + Exportar/Salvar/Auth)
├── TabsBar.tsx (Gerenciamento de abas com scroll)
├── Editor (Split-view editor + preview)
│   ├── MarkdownEditor.tsx (Textarea esquerda + clipboard inteligente)
│   └── MarkdownPreview.tsx (Preview direita com react-markdown)
│       └── MermaidDiagram.tsx (Renderizador de diagramas Mermaid)
└── Auth (Sign in com Google OAuth)

State Management: Zustand (store.ts com persistência localStorage)
Export: markdown-to-docx.ts (parse markdown → DOCX via docx library)
```

### Fluxo de Dados

1. **Autenticação**: User → `/auth/signin` → Google OAuth → `app/page.tsx`
2. **Carregar Estado**: `useEffect([carregarDoStorage])` → restaura abas do localStorage
3. **Edição**: User edita markdown → `onChange()` → `atualizarAba(abaAtiva, conteudo)`
4. **Preview Tempo Real**: `abaAtual.conteudo` → `MarkdownPreview` → renderização instantânea
5. **Gerenciamento de Abas**: Adicionar (+) | Renomear (duplo clique) | Remover (x) | Exportar individual
6. **Exportar Todas**: Loop `markdownToDocx()` com 500ms delay entre downloads
7. **Persistência**: `salvarNoStorage()` → localStorage `markdown-studio-abas` e `markdown-studio-aba-ativa`

## 📋 Pré-requisitos

- Node.js 22+
- npm 10+ (ou yarn/pnpm)
- Credenciais Google OAuth
- `.env.local` com variáveis de ambiente

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone <seu-repo>
cd markdown-to-docx
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
cp .env.local.example .env.local
```

Edite `.env.local` com suas credenciais:

```env
NEXTAUTH_SECRET=sua-chave-secreta-aqui
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_CLIENT_SECRET=seu-google-client-secret
```

### 4. Configure Google OAuth

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto
3. Ative a API "Google+ API"
4. Crie credenciais OAuth 2.0 (aplicação web)
5. Adicione `http://localhost:3000/api/auth/callback/google` às URIs autorizadas
6. Copie Client ID e Client Secret para `.env.local`

### 5. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### Scripts Disponíveis

- `npm run dev` — Dev server
- `npm run build && npm start` — Produção
- `npm run lint` — ESLint (falha se houver warnings)

## 📚 Documentação dos Plugins Remark

Para conhecer em detalhes como usar os plugins remark instalados (emojis, equações matemáticas, tabela de conteúdos, etc.), consulte o documento:

👉 **[docs/REMARK_PLUGINS.md](docs/REMARK_PLUGINS.md)**

Nele você encontrará:

- Como usar cada plugin
- Exemplos práticos
- Limitações na exportação DOCX
- Dicas e truques para combinar múltiplos recursos

- `npm run format:check` — Prettier --check

## 📚 Uso

### Editor Markdown

1. Faça login com sua conta Google
2. Cole ou escreva markdown no painel esquerdo
3. Veja o preview em tempo real no painel direito
4. Clique em "Exportar DOCX" para baixar o documento

### Markdown Suportado

```markdown
## Headings (H1-H6)

# H1 - Heading 1

## H2 - Heading 2

**Bold text**
_Italic text_
`inline code`

- Lista não ordenada
- Item 2

1. Lista ordenada
2. Item 2

\`\`\`python

# Bloco de código

def hello():
print("Hello World")
\`\`\`

> Citação

---

[Link](https://example.com)

| Coluna 1 | Coluna 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |

# Estruturas de Árvore (novo!)

A aplicação agora detecta automaticamente diagramas ASCII com caracteres especiais:

Input (inicial)
├── token, app_origem, client_app_header
├── num_processo, analise
└── errors: [], pecas: []

[Nó 1] BuscarPecasProcesso
├── Output: pecas[], nome_beneficiario
└── is_pecas_processo

[Nó 2] VerificacaoPreenchimento
├── Output: ano_exercicio, telefone
└── contatos_indicador
```

## 📊 Diagramas Mermaid

A aplicação suporta renderização em tempo real de diagramas Mermaid. Basta usar um bloco de código com `mermaid`:

\`\`\`mermaid
graph TD
A[Início] --> B{Decisão}
B -->|Sim| C[Ação 1]
B -->|Não| D[Ação 2]
C --> E[Fim]
D --> E
\`\`\`

Tipos suportados:

- **Flowchart**: `graph TD`, `graph LR`, etc.
- **Sequence Diagram**: `sequenceDiagram`
- **Class Diagram**: `classDiagram`
- **State Diagram**: `stateDiagram-v2`
- **ER Diagram**: `erDiagram`
- **Gantt Chart**: `gantt`
- **Pie Chart**: `pie title`

**Nota**: Diagramas Mermaid são renderizados no preview, mas exportados como texto em DOCX (o formato DOCX não suporta SVG inline).

---

## 📦 Estrutura do Projeto

```
markdown-to-docx/
├── app/
│   ├── api/
│   │   └── auth/[...nextauth]/
│   ├── auth/signin/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Header.tsx
│   ├── MarkdownEditor.tsx
│   ├── MarkdownPreview.tsx
│   ├── MermaidDiagram.tsx
│   ├── TabsBar.tsx
│   └── Providers.tsx
├── lib/
│   ├── markdown-to-docx.ts
│   ├── mermaid-cleaner.ts
│   ├── store.ts
│   └── versao.ts
├── public/
├── .env.local.example
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

## 🔑 Padrões Importantes do Projeto

### Sistema de Gerenciamento de Abas

Cada aba possui:

```typescript
interface AbaData {
  id: string; // ID único gerado automaticamente
  nome: string; // Nome renomeável da aba
  conteudo: string; // Markdown editável
  salvoAoMemento: string | null; // Timestamp "Salvo às HH:MM:SS" (limpa após 3s)
}
```

**Funcionalidades**:

- ✅ **Adicionar**: Botão "+" → nova aba com markdown padrão
- ✅ **Renomear**: Duplo clique no nome → input inline → Enter para confirmar
- ✅ **Remover**: Botão "x" → remove (sempre mínimo 1 aba)
- ✅ **Salvar Individual**: Save icon → `salvarNoStorage(abaId)` → mostra timestamp
- ✅ **Exportar Individual**: Download icon → `markdownToDocx(conteudo, nome)`

**localStorage Keys**:

- `markdown-studio-abas` — Array serializado de todas as abas
- `markdown-studio-aba-ativa` — ID da aba ativa atual

### Client vs Server Components

- ✅ Components com hooks (`useState`, `useSession`, `useAppStore`) → `'use client'`
- ✅ `app/layout.tsx` → Server Component (wraps `<SessionProvider>`)
- ✅ Todos components em `components/` → `'use client'` (usam hooks)

### Conversão Markdown → DOCX (`lib/markdown-to-docx.ts`)

- **Headings**: Detecta `#` e mapeia `HeadingLevel` 1-6
- **Listas**: Usa `Paragraph` com marcadores (⚠️ `docx@8.5.0` não exporta `ListItem`)
- **Code Blocks**: ` ```typescript ` → bloco com fonte monospace
- **Diagramas Mermaid**: ` ```mermaid ` → renderizados como texto em DOCX
- **Estruturas ASCII**: Blocos com `├──`, `└──` → mantidos como código formatado
- **Inline**: Bold, italic, inline code via `TextRun` com formatação

## 🔐 Configuração de Segurança

### Variáveis de Ambiente

**Obrigatórias** (desenvolvimento):

```env
NEXTAUTH_SECRET=seu-secret-aleatorio-de-32-caracteres
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=seu-client-id
GOOGLE_CLIENT_SECRET=seu-client-secret
```

**Produção**: Configurar em plataforma de deploy (Vercel, etc.)

### NextAuth.js

- CSRF protection automático
- JWT sessions
- Refresh tokens via Google OAuth
- Suporte para múltiplos providers (extensível)

## 🎨 Design e UX

O app utiliza um design **minimalista e refinado**:

- **Paleta de Cores**: Neutra (grays: 50-900) + branco/preto
- **Typography**: Escalas harmônicas, fonte system stack
- **Espaçamento**: Tailwind spacing scale (4px base)
- **Animações**: Framer Motion (spring, transitions)
- **Accessibility**: ARIA labels, keyboard navigation
- **Split-view**: Máxima produtividade (editor + preview lado a lado)

## 📱 Responsividade

A aplicação é **100% responsiva**:

- ✅ **Desktop** (1920px+) — split-view completo
- ✅ **Tablets** (768px - 1024px) — ajuste de painéis
- ✅ **Móvel** (320px - 767px) — stack vertical (ajustável)

## 🐛 Troubleshooting

### Autenticação e Variáveis de Ambiente

**"Session is null" ou "Not authenticated"**

```bash
# Verificar .env.local:
- NEXTAUTH_SECRET= (mínimo 32 caracteres, gerar com: openssl rand -base64 32)
- NEXTAUTH_URL=http://localhost:3000 (desenvolvimento)
- GOOGLE_CLIENT_ID=... (de Google Cloud Console)
- GOOGLE_CLIENT_SECRET=... (de Google Cloud Console)

# Solução:
1. Regenerar NEXTAUTH_SECRET com: openssl rand -base64 32
2. Verificar Google Cloud Console → credenciais OAuth 2.0
3. Adicionar URI: http://localhost:3000/api/auth/callback/google
4. Limpar cookies/cache: Cmd+Shift+Del (Safari) ou Ctrl+Shift+Del (Chrome)
5. Reiniciar servidor: npm run dev
```

**Erro de autenticação Google**

- ✅ Verifique Client ID e Client Secret em `.env.local`
- ✅ Confirme URIs autorizadas no Google Cloud: `http://localhost:3000/api/auth/callback/google`
- ✅ API "Google+ API" está ativada no projeto Google Cloud
- ✅ Limpe cookies e tente novamente

### Markdown e Renderização

**Markdown não renderiza preview**

- Verificar se `abaAtiva` está definida corretamente em `page.tsx`
- Testar com markdown simples: `# Título\nParágrafo`
- Verificar console do navegador para erros do `ReactMarkdown`
- Validar que `remark-gfm` está instalado

**Diagramas Mermaid não renderizam**

- Validar sintaxe em https://mermaid.live
- Remover tags `<br/>` dentro do diagrama (não suportadas)
- Verificar console para mensagens de erro específicas
- Reiniciar servidor: `npm run dev`

### Exportação DOCX

**Erro ao exportar DOCX**

- ✅ Testar com markdown simples (ex: `# Título\nParágrafo`)
- ✅ Verificar console do navegador (F12 > Console) para detalhes
- ✅ Validar caracteres especiais no markdown
- ✅ Se muito grande, quebrar em seções menores
- ✅ Usuário deve estar autenticado

**Múltiplas exportações travadas**

- Verificar timeout em `Header.tsx` (500ms delay padrão)
- Aumentar delay se houver muitas abas (ex: 800ms)
- Verificar se navegador permite múltiplos downloads simultâneos

### Linting e Build

**ESLint/Prettier errors**

```bash
npm run lint:fix     # Corrige automaticamente
npm run format       # Formata com Prettier
npm run lint         # Verifica (falha se houver warnings)
```

**Type errors ao fazer build**

```bash
npx tsc --noEmit     # Verificar tipos sem build
npm run build         # Build completo com otimizações
```

Se persistirem, verificar que `tsconfig.json` tem `"strict": true` e todos os tipos estão corretos.

### Estado e Persistência

**Abas não salvam**

- Verificar localStorage em DevTools: F12 > Application > Storage
- Confirmar que `salvarNoStorage()` é chamado
- Verificar keys: `markdown-studio-abas` e `markdown-studio-aba-ativa`
- Limpar localStorage manualmente e recarregar: `localStorage.clear()`

**Zustand state não atualiza**

- Certificar que componente tem `'use client'` no topo
- Verificar que `carregarDoStorage()` é chamado em `useEffect` ao montar
- Verificar console do navegador para erros

### Desenvolvidor

**Porta 3000 já em uso**

```bash
# macOS/Linux
kill -9 $(lsof -t -i :3000)

# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Ou usar porta diferente
PORT=3001 npm run dev
```

**Dependências com conflito**

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📦 Estrutura do Projeto

```
markdown-to-docx/
├── app/                               # Next.js App Router
│   ├── api/
│   │   └── auth/[...nextauth]/
│   │       └── route.ts               # NextAuth endpoints
│   ├── auth/signin/
│   │   └── page.tsx                   # Página de login
│   ├── globals.css                    # Estilos globais
│   ├── layout.tsx                     # Root layout + SessionProvider
│   └── page.tsx                       # Home (split-view + tabs)
├── components/                        # React components (todos 'use client')
│   ├── Header.tsx                     # Navbar + Export/Save/Auth
│   ├── MarkdownEditor.tsx             # Textarea editor
│   ├── MarkdownPreview.tsx            # Preview com react-markdown
│   ├── MermaidDiagram.tsx             # Renderizador Mermaid
│   ├── TabsBar.tsx                    # Gerenciador de abas
│   └── Providers.tsx                  # SessionProvider wrapper
├── lib/                               # Utilitários e lógica
│   ├── store.ts                       # Zustand store com persistência
│   ├── markdown-to-docx.ts            # Parser markdown → DOCX
│   ├── mermaid-cleaner.ts             # Limpeza diagramas Mermaid
│   └── versao.ts                      # Versionamento (1.0.18)
├── docs/                              # Documentação adicional
├── public/                            # Assets estáticos
├── .env.local.example                 # Template de variáveis
├── .eslintrc.cjs                      # Configuração ESLint
├── .prettierrc.cjs                    # Configuração Prettier
├── package.json                       # Dependências
├── tailwind.config.ts                 # Configuração Tailwind
├── tsconfig.json                      # Configuração TypeScript
├── next.config.ts                     # Configuração Next.js
└── README.md                          # Este arquivo
```

## 📦 Dependências Principais

| Pacote                  | Versão  | Propósito                                |
| ----------------------- | ------- | ---------------------------------------- |
| next                    | 16.1.6  | Framework web com App Router + Turbopack |
| react                   | 19.0.0  | UI library (JSX Transform automático)    |
| react-dom               | 19.0.0  | React DOM rendering                      |
| next-auth               | 4.24.0  | Autenticação OAuth 2.0 Google            |
| docx                    | 8.5.0   | Export DOCX                              |
| react-markdown          | 9.0.0   | Parse e renderização markdown            |
| remark-gfm              | 4.0.0   | GitHub Flavored Markdown support         |
| mermaid                 | 11.12.3 | Renderização de diagramas                |
| zustand                 | 4.4.0   | State management minimalista             |
| framer-motion           | 11.0.0  | Animações e transições suaves            |
| tailwindcss             | 3.3.0   | CSS utilitário                           |
| lucide-react            | 0.575.0 | Ícones SVG de qualidade                  |
| @tailwindcss/typography | 0.5.19  | Prose styling para markdown              |
| eslint                  | 8.57.1  | Linting JavaScript/TypeScript            |
| prettier                | 3.8.1   | Code formatting                          |
| typescript              | 5.3.0   | Tipagem estática (strict mode)           |

## 🚀 Deploy

### Vercel (Recomendado)

1. Fazer push para GitHub
2. Conectar repo em https://vercel.com
3. Adicionar env vars no dashboard Vercel
4. Deploy automático em cada push

### Variáveis de Ambiente para Produção

```
NEXTAUTH_SECRET=<gerar novo com `openssl rand -base64 32`>
NEXTAUTH_URL=https://seu-dominio.com
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

## 🤖 Documentação para Agentes de IA

Para agentes de IA (GitHub Copilot, Claude, etc.), consulte [`.github/copilot-instructions.md`](.github/copilot-instructions.md) que contém:

- **Arquitetura detalhada** do projeto com fluxo de dados completo
- **Padrões de componentes** React e Next.js específicos do projeto
- **Gerenciamento de estado** com Zustand (interface AppStore completa)
- **Sistema de abas** com interface AbaData e persistência localStorage
- **Conversão Markdown → DOCX** (parsing linha-por-linha e tipos suportados)
- **Renderização de Mermaid** e detecção de diagramas ASCII
- **Configurações ESLint/Prettier** precisas (typescript-eslint, prettier-plugin-tailwind)
- **Workflows essenciais** (dev, build, lint, format com regras específicas)
- **Armadilhas e considerações** importantes (ListItem não exportado, NEXTAUTH_SECRET obrigatório, etc.)
- **Versões críticas** de todas as dependências sincronizadas com package.json

---

## 📄 Licença

MIT License - Veja arquivo LICENSE para detalhes

Copyright (c) 2026 Markdown Studio Contributors

---

## 🤝 Contribuindo

1. Fork o repo
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Antes de submeter PR

```bash
npm run format
npm run lint
npm run build
```

## 📞 Suporte

- Issues: [GitHub Issues](https://github.com/seu-usuario/markdown-to-docx/issues)
- Discussões: [GitHub Discussions](https://github.com/seu-usuario/markdown-to-docx/discussions)
