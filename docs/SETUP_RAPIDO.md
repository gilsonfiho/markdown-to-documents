# 🚀 Guia de Setup - Markdown Studio

## Início Rápido (5 minutos)

### 1️⃣ Instale as dependências

```bash
cd markdown-to-docx
npm install
```

### 2️⃣ Configure Google OAuth

**Passo 1: Acesse Google Cloud Console**

- Vá para https://console.cloud.google.com/
- Clique em "Selecionar um projeto" → "Novo projeto"
- Nome: `Markdown Studio`

**Passo 2: Ative Google+ API**

- No menu esquerdo, clique em "APIs e Serviços"
- Clique em "Ativar APIs e Serviços"
- Pesquise por "Google+ API"
- Clique em "Ativar"

**Passo 3: Crie Credenciais OAuth**

- No menu esquerdo, clique em "Credenciais"
- Clique em "Criar Credenciais" → "ID do Cliente OAuth"
- Selecione "Aplicação web"
- Na seção "URIs autorizados de redirecionamento", adicione:
  - `http://localhost:3000/api/auth/callback/google`
- Clique em "Criar"
- Copie o **Client ID** e **Client Secret**

### 3️⃣ Configure .env.local

Crie arquivo `.env.local` na raiz do projeto:

```env
NEXTAUTH_SECRET=sua-chave-secreta-muito-segura-aqui-123456
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=seu-client-id-aqui.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-client-secret-aqui
```

**Para gerar NEXTAUTH_SECRET:**

```bash
openssl rand -base64 32
```

Ou use esse valor (apenas para desenvolvimento):

```
UltraSecretKeyForDevelopmentOnly123456789
```

### 4️⃣ Inicie o servidor

```bash
npm run dev
```

Abra http://localhost:3000 no seu navegador

### 5️⃣ Teste

1. Clique em "Entrar com Google"
2. Selecione sua conta Google
3. Cole um markdown no editor
4. Clique em "Exportar DOCX"
5. Documento será baixado!

---

## 📝 Exemplo de Markdown para Testar

Copie e cole isto no editor:

```markdown
# Meu Documento

## Introdução

Este é um **documento de exemplo** em _markdown_.

### Características

- Editor em tempo real
- Exportação para Word
- Suporte a código

### Exemplo de Código

\`\`\`python
def greet(name):
return f"Hello, {name}!"

print(greet("World"))
\`\`\`

### Lista Ordenada

1. Primeiro passo
2. Segundo passo
3. Terceiro passo

> Uma citação para inspirar

---

[Visitar Google](https://google.com)
```

---

## 🐛 Solução de Problemas

### "Invalid Client"

❌ **Problema**: Credenciais do Google incorretas
✅ **Solução**: Verifique Client ID e Secret em .env.local

### "Erro ao exportar"

❌ **Problema**: Markdown malformado
✅ **Solução**: Tente um markdown simples primeiro

### "Não consigo fazer login"

❌ **Problema**: Callback URI incorreta
✅ **Solução**: Verifique em Google Cloud Console se está exatamente:
`http://localhost:3000/api/auth/callback/google`

### "Porta 3000 em uso"

```bash
npm run dev -- -p 3001
```

---

## 🎯 Funcionalidades

✅ Login com Google
✅ Editor Markdown split-view
✅ Preview em tempo real
✅ Exportar para Word (.docx)
✅ Suporte a markdown completo
✅ Design minimalista

---

## 📚 Estrutura de Arquivos Principais

```
markdown-to-docx/
├── app/
│   ├── page.tsx              ← Página principal
│   ├── layout.tsx            ← Layout
│   ├── globals.css           ← Estilos globais
│   └── api/auth/[...nextauth]/ ← Autenticação
├── components/
│   ├── Header.tsx            ← Header com botões
│   ├── MarkdownEditor.tsx    ← Editor
│   ├── MarkdownPreview.tsx   ← Preview
│   └── Providers.tsx         ← NextAuth Provider
├── lib/
│   ├── store.ts              ← Zustand store
│   └── markdown-to-docx.ts   ← Lógica de export
└── .env.local                ← Configurações (não commit!)
```

---

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm run start

# Lint
npm run lint

# Limpar node_modules
rm -rf node_modules && npm install
```

---

## 🌐 Deploy

### No Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

Siga as instruções na CLI.

---

## ⚙️ Configurações Avançadas

### Modificar Estilos

Os estilos estão em:

- `app/globals.css` - Estilos globais
- `tailwind.config.ts` - Configuração Tailwind
- `components/*.tsx` - Tailwind classes

### Adicionar Novos Idiomas

Em `lib/store.ts`, modifique o markdown padrão.

---

## 💡 Dicas

- Use `Ctrl+S` ou `Cmd+S` para salvar (salva automaticamente)
- O preview atualiza em tempo real
- Markdown completo com:
  - Headings (# ## ###)
  - Bold (**text**)
  - Italic (_text_)
  - Código (```python)
  - Listas
  - Citações (>)
  - Tabelas

---

## ✨ Próximos Passos

1. **Customizar design**: Modifique cores em `tailwind.config.ts`
2. **Adicionar backend**: Integre MongoDB/PostgreSQL
3. **Salvar documentos**: Implemente cloud storage (AWS S3/Firebase)
4. **Compartilhar**: Adicione link de compartilhamento
5. **Histórico**: Implemente versionamento

---

**Desenvolvido com ❤️ por um Senior Full-stack Developer**

Dúvidas? Abra uma issue no GitHub ou consulte o README.md principal.
