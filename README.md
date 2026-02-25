# Markdown Studio

Uma aplicação web moderna e minimalista que permite converter markdown para documentos Word (.docx) em tempo real, com autenticação segura via Google. Desenvolvida com Next.js 16, React 18 e Tailwind CSS, oferece uma interface split-view profissional para máxima produtividade.

**Status**: ✅ Completo e funcional

## 🎯 Funcionalidades

- ✅ **Editor Split-View**: Editor markdown lado a lado com preview em tempo real (sem delay)
- ✅ **Autenticação Google**: Login seguro com NextAuth.js
- ✅ **Exportação DOCX**: Converta markdown para Word com um clique
- ✅ **Suporte Markdown Completo**: Headings (H1-H6), listas ordenadas/desordenadas, código com syntax highlight, blocos de citação, links, tabelas, linhas horizontais
- ✅ **Estruturas de Árvore e Diagramas ASCII**: Detecta e renderiza automaticamente diagramas com caracteres `├──`, `└──`, `│`, etc.
- ✅ **Interface Minimalista**: Design refinado e profissional
- ✅ **Responsivo**: Funciona em desktop, tablets e mobile
- ✅ **Formatação Inline**: Suporte a **negrito**, _itálico_ e `` `código inline` ``
- ✅ **Animações Suaves**: Transições elegantes com Framer Motion
- ✅ **Linting e Formatting**: ESLint + Prettier pré-configurados

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + Next.js 16
- **Autenticação**: NextAuth.js 4.24
- **Markdown**: react-markdown + remark-gfm
- **Export**: docx library 8.5
- **Styling**: Tailwind CSS 3
- **Animações**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React

### Ferramentas de Desenvolvimento

- **ESLint 8.57 + @typescript-eslint**: Linting com regras TypeScript
- **Prettier 3.8**: Code formatting com overrides para TSX e HTML
- **TypeScript 5.3**: Tipagem estrita (strict mode ativado)
- **Tailwind CSS 3**: Utility-first CSS

## 🏗️ Arquitetura

### Componentes Principais

```
App/
├── Header (Navbar + Export/Auth)
├── Editor (Split-view)
│   ├── MarkdownEditor (esquerda)
│   └── MarkdownPreview (direita)
└── Auth (Sign in com Google)

State: Zustand (markdown, fileName)
Export: markdown-to-docx.ts (parse → DOCX via docx library)
```

### Fluxo de Dados

1. User edita markdown em `MarkdownEditor`
2. Estado atualiza em Zustand `useAppStore`
3. `MarkdownPreview` renderiza em tempo real com `ReactMarkdown`
4. Ao clicar "Exportar DOCX", `markdown-to-docx.ts` converte e faz download

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
- `npm run lint:fix` — Corrigir automaticamente
- `npm run format` — Prettier --write
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
│   └── Providers.tsx
├── lib/
│   ├── markdown-to-docx.ts
│   └── store.ts
├── public/
├── .env.local.example
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

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

### Erro de autenticação Google

- Verifique as credenciais em `.env.local`
- Confirme as URIs autorizadas no Google Cloud Console
- Certifique-se de que `NEXTAUTH_SECRET` está definido

### Erro ao exportar DOCX

### Erro ao exportar DOCX

- ✅ Verifique console do navegador (`F12 > Console`)
- ✅ Teste com markdown simples (ex: `# Título\nParágrafo`)
- ✅ Valide que não há caracteres especiais problemáticos
- ✅ Tente exportar a partir da página de home, não de preview

### ESLint/Prettier errors

```bash
npm run lint:fix     # Corrige a maioria dos erros
npm run format       # Formata código
npm run lint         # Verifica (--max-warnings=0)
```

### "Session is null" após login

- ✅ Verificar `NEXTAUTH_SECRET` em `.env.local`
- ✅ Verificar `NEXTAUTH_URL` corresponde ao domínio
- ✅ Limpar cache/cookies do navegador
- ✅ Reiniciar dev server

### Porta 3000 já em uso

```bash
# macOS/Linux
kill -9 $(lsof -t -i :3000)

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Ou usar porta diferente
PORT=3001 npm run dev
```

## 📦 Dependências Principais

| Pacote         | Versão  | Propósito                |
| -------------- | ------- | ------------------------ |
| next           | ^16.1.6 | Framework web            |
| react          | ^18.2   | UI library               |
| next-auth      | ^4.24   | Autenticação             |
| docx           | ^8.5    | Export DOCX              |
| react-markdown | ^9.0    | Parse markdown           |
| remark-gfm     | ^4.0    | GitHub Flavored Markdown |
| zustand        | ^4.4    | State management         |
| framer-motion  | ^10.16  | Animações                |
| tailwindcss    | ^3.3    | CSS utilitário           |
| eslint         | ^8.57   | Linting                  |
| prettier       | ^3.8    | Code formatting          |

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

## 📄 Licença

MIT License

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
