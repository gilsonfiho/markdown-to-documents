# Markdown Studio

Uma aplicação web moderna para converter markdown para documentos Word (.docx) com autenticação via Google.

## 🎯 Funcionalidades

- ✅ **Editor Split-View**: Editor markdown lado a lado com preview em tempo real
- ✅ **Autenticação Google**: Login seguro com NextAuth.js
- ✅ **Exportação DOCX**: Converta markdown para Word com um clique
- ✅ **Suporte Markdown Completo**: Headings, listas, código, citações, etc.
- ✅ **Interface Minimalista**: Design refinado e profissional
- ✅ **Responsivo**: Funciona em desktop e mobile

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + Next.js 14
- **Autenticação**: NextAuth.js
- **Markdown**: react-markdown + remark-gfm
- **Export**: docx library
- **Styling**: Tailwind CSS 3
- **Animações**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React

## 📋 Pré-requisitos

- Node.js 22+
- npm/yarn/pnpm
- Credenciais Google OAuth

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

## 📚 Uso

### Editor Markdown

1. Faça login com sua conta Google
2. Cole ou escreva markdown no painel esquerdo
3. Veja o preview em tempo real no painel direito
4. Clique em "Exportar DOCX" para baixar o documento

### Markdown Suportado

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*
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
|----------|----------|
| Cell 1   | Cell 2   |
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

## 🎨 Design

O app utiliza um design minimalista e refinado com:

- Paleta neutra (grays)
- Typography elegante
- Espaçamento generoso
- Animações suaves com Framer Motion
- Interface split-view para máxima produtividade

## 🔐 Segurança

- Autenticação via NextAuth.js
- Suporte a CSRF protection
- Senhas criptografadas
- Sessões seguras

## 📱 Responsividade

A aplicação é responsiva e funciona em:

- ✅ Desktop (1024px+)
- ✅ Tablets (768px+)
- ✅ Móvel (320px+)

## 🐛 Troubleshooting

### Erro de autenticação Google

- Verifique as credenciais em `.env.local`
- Confirme as URIs autorizadas no Google Cloud Console
- Certifique-se de que `NEXTAUTH_SECRET` está definido

### Erro ao exportar DOCX

- Verifique o console do navegador para erros
- Certifique-se de que o markdown é válido
- Tente um markdown simples primeiro

### Porta 3000 já em uso

```bash
npm run dev -- -p 3001
```

## 🚀 Deploy

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

### Outras plataformas

Siga a documentação Next.js para sua plataforma escolhida.

## 📄 Licença

MIT

## 👨‍💻 Desenvolvimento

### Scripts disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Build para produção
npm run start    # Inicia servidor de produção
npm run lint     # Executa linter
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, abra uma issue no repositório.

## 🎓 Aprendizados

Este projeto demonstra:

- Next.js 14 com App Router
- NextAuth.js para autenticação
- React Hooks e Context API
- Zustand para state management
- Tailwind CSS para styling
- Framer Motion para animações
- TypeScript para type safety
- Export de documentos com docx library

Desenvolvido com ❤️ por um Senior Full-stack Developer
