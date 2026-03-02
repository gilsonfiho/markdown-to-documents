# Arquitetura - Markdown Studio

## 📋 Visão Geral da Aplicação

**Markdown Studio** é uma aplicação Next.js 16 que converte markdown para documentos Word (.docx) com autenticação Google OAuth. Interface split-view em tempo real com editor markdown e preview lado a lado, suportando múltiplas abas para gerenciamento de múltiplos documentos simultaneamente.

## 🏗️ Estrutura de Pastas

```
markdown-to-docx/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout + SessionProvider
│   ├── page.tsx                 # Home page (split-view + tabs)
│   ├── auth/signin/page.tsx     # Login page (Google OAuth)
│   └── api/
│       ├── auth/[...nextauth]/  # NextAuth endpoints
│       └── salvar-no-drive/     # Google Drive integration
│
├── components/                  # React components (todos 'use client')
│   ├── Header.tsx              # Navbar + Exportar/Salvar/Auth
│   ├── TabsBar.tsx             # Barra de abas com scroll
│   ├── MarkdownEditor.tsx      # Textarea + clipboard inteligente
│   ├── MarkdownPreview.tsx     # Preview com react-markdown
│   ├── MermaidDiagram.tsx      # Renderizador de diagramas
│   ├── Providers.tsx           # SessionProvider wrapper
│   └── ui/                      # Componentes shadcn/ui
│
├── lib/
│   ├── store.ts               # Zustand store (abas, persistência)
│   ├── markdown-to-docx.ts    # Lógica de conversão markdown → DOCX
│   ├── mermaid-cleaner.ts     # Utilitários para limpeza Mermaid
│   ├── google-drive.ts        # Integração Google Drive (client)
│   ├── utils.ts               # Funções utilitárias
│   └── versao.ts              # Versionamento da aplicação
│
├── __tests__/                  # Testes Jest
│   ├── components/
│   └── lib/
│
├── docs/                       # Documentação de desenvolvimento
│   ├── ARCHITECTURE.md         # Este arquivo
│   ├── REMARK_PLUGINS.md       # Plugins remark instalados
│   ├── TROUBLESHOOTING.md      # Debug e soluções
│   ├── CONTRIBUTING.md         # Padrões de desenvolvimento
│   └── API_ROUTES.md           # Documentação de endpoints
│
└── .github/
    └── copilot-instructions.md # Instruções para agentes de IA
```

## 🔄 Fluxo de Dados Principal

### 1. Autenticação e Inicialização

```
Usuário → /auth/signin (Google OAuth)
   ↓
NextAuth cria sessão com accessToken
   ↓
Redirect para / (app/page.tsx)
   ↓
useSession() valida sessão
   ↓
carregarDoStorage() restaura abas do localStorage
```

### 2. Edição em Tempo Real

```
Usuário edita markdown
   ↓
MarkdownEditor.onChange()
   ↓
useAppStore.atualizarAba(abaAtiva, conteudo)
   ↓
Zustand atualiza estado global
   ↓
MarkdownPreview renderiza em tempo real
   ↓
ReactMarkdown + MermaidDiagram renderizam HTML
```

### 3. Gerenciamento de Abas

```
Adicionar:    Botão "+" → adicionarAba() → nova aba com MARKDOWN_PADRAO
Renomear:     Duplo clique → input inline → atualizarAba(id, conteudo, novoNome)
Remover:      Botão "x" → removerAba(id) (mínimo 1 aba)
Selecionar:   Clique em aba → setAbaAtiva(id)
Exportar:     Botão download → markdownToDocx(conteudo, nome)
```

### 4. Persistência

```
Usuário edita → atualizarAba()
   ↓
(Auto-save) salvarNoStorage(abaId)
   ↓
localStorage['markdown-studio-abas'] = JSON.stringify(abas)
localStorage['markdown-studio-aba-ativa'] = abaAtiva
   ↓
salvoAoMemento mostrado por 3s
```

### 5. Exportação DOCX

```
Usuário clica Exportar
   ↓
markdownToDocx(conteudo, nome)
   ↓
Parsing markdown em tokens (heading, paragraph, list, code, etc.)
   ↓
Construir Document do docx
   ↓
Packer.toBlob() → trigger download
   ↓
Arquivo .docx salvo localmente
```

### 6. Integração Google Drive (Opcional)

```
Usuário clica "Salvar no Drive"
   ↓
salvarNoGoogleDrive(conteudo, nome)
   ↓
Client: converte markdown → DOCX Blob
   ↓
POST /api/salvar-no-drive { blob, nome }
   ↓
Server: valida sessão + obtém accessToken
   ↓
google.drive().files.create({ body, media })
   ↓
Retorna link público do arquivo
   ↓
Toast: "Salvo em: https://drive.google.com/..."
```

## 🧠 Gerenciamento de Estado com Zustand

### Interface AppStore (lib/store.ts)

```typescript
interface AbaData {
  id: string; // ID único gerado
  nome: string; // Nome renomeável
  conteudo: string; // Markdown editável
  salvoAoMemento: string | null; // Timestamp "Salvo às HH:MM:SS"
}

interface AppStore {
  // Estado
  abas: AbaData[];
  abaAtiva: string;
  mostrarPreview: boolean;
  textoSelecionado: string;

  // Ações
  setAbaAtiva: (id: string) => void;
  setTextoSelecionado: (texto: string) => void;
  setMostrarPreview: (valor: boolean) => void;
  toggleMostrarPreview: () => void;

  adicionarAba: () => void;
  removerAba: (id: string) => void;
  atualizarAba: (id: string, conteudo: string, nome?: string) => void;
  setSalvoAoMemento: (abaId: string, data: string | null) => void;

  carregarDoStorage: () => void;
  salvarNoStorage: (abaId?: string) => void;
  salvarTodasAsAbas: () => void;
  fecharTodasAsAbas: () => void;
}
```

### Chaves localStorage

- `'markdown-studio-abas'` — Array serializado de todas as abas
- `'markdown-studio-aba-ativa'` — ID da aba ativa

## 🎨 Componentes Principais

### Header.tsx

**Responsabilidades:**

- Exibir versão da aplicação
- Botão "Exportar Todas" (loop com 500ms delay)
- Botão "Salvar Todas" (timestamp em todas as abas)
- User info (nome e email)
- Botões auth (login/logout)

**Padrão de Animação:**

```typescript
{aba.salvoAoMemento ? (
  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
    <CheckCircle2 size={18} />
  </motion.div>
) : (
  <Save size={18} />
)}
```

### TabsBar.tsx

**Responsabilidades:**

- Renderizar array de abas com scroll horizontal
- Adicionar/remover/renomear abas
- Salvar/exportar aba individual
- Trocar aba ativa
- Navegar entre abas (left/right em viewports pequenos)

**Estrutura:**

```
[← botão scroll] [aba1] [aba2] [aba3] [+ botão] [botão scroll →]
```

### MarkdownEditor.tsx

**Responsabilidades:**

- Textarea com suporte a Tab (insere `\t`)
- Dropdown inteligente: Colar / Limpar e Colar
- Feedback visual (CheckCircle2 por 2s após colar)
- Sincronizar com store em tempo real

**Padrão Tab:**

```typescript
if (e.key === 'Tab') {
  e.preventDefault();
  const start = textarea.selectionStart;
  const newValue = value.substring(0, start) + '\t' + value.substring(end);
  onChange(newValue);
  setTimeout(() => {
    textarea.selectionStart = start + 1;
  }, 0);
}
```

### MarkdownPreview.tsx

**Responsabilidades:**

- Renderizar markdown via ReactMarkdown
- Detectar e renderizar diagramas Mermaid
- Aplicar plugins remark (GFM, emojis, TOC, math)
- Handlers customizados para cada elemento HTML

**Plugins Remark (Ordem Importa!):**

1. `remarkGfm` — GitHub Flavored Markdown
2. `remarkBreaks` — Quebras de linha simples
3. `remarkEmoji` — Emojis (`:smile:` → 😄)
4. `remarkToc` — Tabela de conteúdos automática
5. `remarkMath` — Equações matemáticas

**Plugins Rehype:**

- `rehypeKatex` — Renderização KaTeX (requer CSS)

### MermaidDiagram.tsx

**Responsabilidades:**

- Renderizar blocos ` ```mermaid ` como SVG
- Inicializar mermaid com tema e segurança
- Tratamento de erros (div vermelho se inválido)
- Limpeza de tags `<br/>` que quebram parsing

## 📄 Conversão Markdown → DOCX

### Arquivo: lib/markdown-to-docx.ts

**Fluxo:**

1. **Parsing**: Tokenizar markdown linha-por-linha
2. **Tipos**: `heading|paragraph|list|code|table|hr|mermaid`
3. **Processamento**: Formatação inline (`**bold**`, `_italic_`, `` `código` ``)
4. **Construção**: Criar `Document` do docx com estrutura
5. **Export**: `Packer.toBlob()` → trigger download

**Tipos Suportados:**

| Tipo        | Exemplo               | Renderização DOCX                          |
| ----------- | --------------------- | ------------------------------------------ |
| `heading`   | `# Título`            | `HeadingLevel` 1-6                         |
| `paragraph` | Texto simples         | `Paragraph`                                |
| `list`      | `- Item` ou `1. Item` | `Paragraph` com marcadores                 |
| `code`      | ` ```js ... `         | `Paragraph` monospace                      |
| `table`     | `\| col \|`           | `Table`                                    |
| `hr`        | `---`                 | `Paragraph` com border                     |
| `mermaid`   | ` ```mermaid `        | `Paragraph` com código (SVG não suportado) |

### ⚠️ Limitações Importantes

- `docx@8.5.0` **não exporta** `ListItem` → usar `Paragraph` com marcadores inline
- Diagramas Mermaid não são exportados como SVG (renderizados como texto)
- Imagens inline não são suportadas
- CSS customizado não é preservado

## 🔐 Autenticação e Autorização

### NextAuth Configuration (app/api/auth/[...nextauth].ts)

**Providers:**

- Google OAuth com escopo `https://www.googleapis.com/auth/drive.file`

**Callbacks:**

```typescript
jwt({ token, account }) {
  // Armazenar accessToken no JWT
  if (account) {
    token.accessToken = account.access_token;
  }
  return token;
}

session({ session, token }) {
  // Passar accessToken para sessão do cliente
  if (session.user) {
    (session.user as any).accessToken = token.accessToken;
  }
  return session;
}
```

**Fluxo:**

1. User clica "Entrar com Google"
2. Google OAuth autentica
3. NextAuth cria JWT com accessToken
4. SessionProvider disponibiliza para componentes
5. `useSession()` obtém session com `user.accessToken`

## 🌐 API Routes

### POST /api/auth/[...nextauth]

Handled by NextAuth. Endpoints automáticos:

- `GET /api/auth/signin` — Redirects to login
- `GET /api/auth/callback/google` — OAuth callback
- `GET /api/auth/signout` — Logout
- `GET /api/auth/session` — Get current session

### POST /api/salvar-no-drive

**Propósito:** Salvar documento DOCX no Google Drive

**Request:**

```typescript
{
  conteudo: string; // Markdown a converter
  nomeArquivo: string; // Nome do arquivo
}
```

**Response (Sucesso):**

```typescript
{
  sucesso: true;
  mensagem: string;
  idArquivo: string;
  urlArquivo: string; // Link público do arquivo
}
```

**Response (Erro):**

```typescript
{
  sucesso: false;
  mensagem: string; // Descrição do erro
}
```

**Validações:**

- Session autenticada obrigatória
- accessToken deve estar disponível
- MIME type: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

## 🔄 Ciclo de Vida do Componente Page

```typescript
app/page.tsx:

1. useSession() → valida autenticação
2. Se não autenticado → redirect('/auth/signin')
3. Se loading → mostra spinner com Framer Motion
4. useEffect([carregarDoStorage]) → restaura abas
5. Renderiza split-view:
   - Esquerda: MarkdownEditor
   - Direita: MarkdownPreview
   - Abas: TabsBar
   - Header: Header.tsx
```

## 📊 Diagrama de Dependências

```
app/page.tsx (root)
├── Header.tsx
│   ├── useSession (NextAuth)
│   ├── useAppStore (Zustand)
│   └── markdownToDocx (lib)
├── TabsBar.tsx
│   ├── useAppStore
│   ├── markdownToDocx
│   └── salvarNoStorage
├── MarkdownEditor.tsx
│   ├── useAppStore
│   └── salvarNoGoogleDrive (lib)
└── MarkdownPreview.tsx
    ├── ReactMarkdown
    ├── remarkPlugins (remark-gfm, etc.)
    ├── MermaidDiagram
    └── rehypeKatex

NextAuth
├── Providers.tsx (SessionProvider)
└── app/api/auth/[...nextauth]

Google Drive
├── lib/google-drive.ts (client)
├── app/api/salvar-no-drive (server)
└── googleapis (lib)
```

## 🧪 Teste e Build

**Comandos:**

```bash
npm run dev              # Dev server
npm run build            # Build otimizado
npm run lint             # Linting (--max-warnings=0)
npm run test             # Jest tests
npm run test:watch       # Jest watch mode
npm run test:coverage    # Coverage report
npm run format           # Prettier
```

**Jest Configuration:**

- Test Environment: `jsdom`
- Path Mapping: `@/` → raiz
- Setup: `jest.setup.js`
- Coverage: `app/`, `components/`, `lib/` (exclui `.d.ts`, `node_modules`, `.next`)

## 🎯 Stack Tecnológico

| Layer          | Biblioteca                                                       | Versão  |
| -------------- | ---------------------------------------------------------------- | ------- |
| Framework      | Next.js                                                          | 16.1.6  |
| React          | React + React DOM                                                | 19.0.0  |
| State          | Zustand                                                          | 4.4.0   |
| UI Framework   | Tailwind CSS                                                     | 3.3     |
| Components     | shadcn/ui                                                        | latest  |
| Ícones         | lucide-react                                                     | 0.575.0 |
| Animações      | Framer Motion                                                    | 11.0.0  |
| Markdown       | react-markdown                                                   | 9.0.0   |
| Plugins Remark | remark-gfm, remark-breaks, remark-emoji, remark-toc, remark-math | 4.0.0+  |
| Plugins Rehype | rehype-katex                                                     | 7.0.1   |
| Diagramas      | Mermaid                                                          | 11.12.3 |
| DOCX Export    | docx                                                             | 8.5.0   |
| Autenticação   | NextAuth.js                                                      | 4.24.0  |
| Google APIs    | googleapis                                                       | 171.4.0 |
| Tipagem        | TypeScript                                                       | 5.3     |
| Linting        | ESLint                                                           | 8.57    |
| Formatação     | Prettier                                                         | 3.8     |
| Testes         | Jest + RTL                                                       | latest  |

## 🔑 Variáveis de Ambiente

```env
# NextAuth
NEXTAUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_CLIENT_SECRET=seu-google-client-secret
```

## ✅ Checklist de Desenvolvimento

Antes de fazer commit:

1. `npm run lint:fix` — Corrigir linting
2. `npm run format` — Formatar com Prettier
3. `npm run test` — Todos os testes passam
4. `npm run build` — Build sem erros TypeScript
