# Rotas de API - Markdown Studio

## 📋 Visão Geral

As rotas de API são implementadas em Next.js 16 usando App Router em `app/api/`. Todas as rotas usam `NextRequest` e `NextResponse` do `next/server`.

---

## 🔐 Autenticação com NextAuth

### NextAuth Endpoints Automáticos

NextAuth gera endpoints automáticos em `app/api/auth/[...nextauth]/route.ts`:

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/auth/signin` | Redireciona para tela de login Google |
| GET | `/api/auth/callback/google` | OAuth callback (automático) |
| GET | `/api/auth/signout` | Logout e limpa sessão |
| GET | `/api/auth/session` | Retorna sessão atual (para cliente) |
| GET | `/api/auth/providers` | Lista providers configurados |
| GET | `/api/auth/csrf` | CSRF token para formulários |

### Configuração

**Arquivo:** `app/api/auth/[...nextauth].ts`

```typescript
import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { getServerSession } from 'next-auth/next';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid profile email https://www.googleapis.com/auth/drive.file',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
```

### Usar em Componentes

```typescript
'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export const MeuComponente = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Carregando...</div>;

  if (!session) {
    return <button onClick={() => signIn('google')}>Entrar</button>;
  }

  return (
    <div>
      <p>Bem-vindo, {session.user?.name}!</p>
      <p>Email: {session.user?.email}</p>
      <p>Token: {(session.user as any).accessToken}</p>
      <button onClick={() => signOut()}>Sair</button>
    </div>
  );
};
```

---

## 📤 POST /api/salvar-no-drive

**Propósito:** Salvar documento DOCX no Google Drive do usuário

### Request

**Método:** POST  
**Content-Type:** application/json  
**Autenticação:** Obrigatória (NextAuth session)

**Body:**
```json
{
  "conteudo": "# Título\n\nParágrafo...",
  "nomeArquivo": "Meu Documento"
}
```

**Parâmetros:**

| Nome | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `conteudo` | string | Sim | Conteúdo markdown a converter |
| `nomeArquivo` | string | Sim | Nome do arquivo (sem extensão) |

### Response (Sucesso - 200)

```json
{
  "sucesso": true,
  "mensagem": "Arquivo salvo no Google Drive",
  "idArquivo": "1nX5u_zL8cK2xY-aB3cD4eF5gH6iJ7kL8m",
  "urlArquivo": "https://drive.google.com/file/d/1nX5u_zL8cK2xY-aB3cD4eF5gH6iJ7kL8m/view"
}
```

**Campos:**

| Nome | Tipo | Descrição |
|------|------|-----------|
| `sucesso` | boolean | Indica sucesso da operação |
| `mensagem` | string | Mensagem descritiva |
| `idArquivo` | string | ID do arquivo no Google Drive |
| `urlArquivo` | string | Link público para acessar arquivo |

### Response (Erro - 401)

```json
{
  "sucesso": false,
  "mensagem": "Não autenticado"
}
```

**Status Code:** 401 Unauthorized

**Causas:**
- User não fez login
- Sessão expirou
- `NEXTAUTH_SECRET` não configurado

### Response (Erro - 400)

```json
{
  "sucesso": false,
  "mensagem": "Conteúdo ou nome ausente"
}
```

**Status Code:** 400 Bad Request

**Causas:**
- `conteudo` ou `nomeArquivo` vazio
- JSON inválido no body

### Response (Erro - 500)

```json
{
  "sucesso": false,
  "mensagem": "Error: quota_exceeded"
}
```

**Status Code:** 500 Internal Server Error

**Causas:**
- Google Drive quota excedida
- AccessToken expirado
- API erro do Google
- Rede instável

### Exemplo de Uso (Cliente)

```typescript
'use client';

import { useSession } from 'next-auth/react';

export const BotaoSalvarNoDrive = () => {
  const { data: session } = useSession();
  const [carregando, setCarregando] = React.useState(false);

  const handleSalvar = async (conteudo: string, nome: string) => {
    setCarregando(true);
    try {
      const response = await fetch('/api/salvar-no-drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conteudo, nomeArquivo: nome }),
      });

      const dados = await response.json();

      if (dados.sucesso) {
        alert(`Salvo em: ${dados.urlArquivo}`);
        // Copiar URL para clipboard
        navigator.clipboard.writeText(dados.urlArquivo);
      } else {
        alert(`Erro: ${dados.mensagem}`);
      }
    } catch (erro) {
      console.error('Erro ao salvar:', erro);
      alert('Erro ao salvar documento');
    } finally {
      setCarregando(false);
    }
  };

  if (!session) {
    return <div>Faça login para usar este recurso</div>;
  }

  return (
    <button
      onClick={() => handleSalvar('# Teste', 'teste')}
      disabled={carregando}
    >
      {carregando ? 'Salvando...' : 'Salvar no Drive'}
    </button>
  );
};
```

### Implementação do Server

**Arquivo:** `app/api/salvar-no-drive/route.ts`

```typescript
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { authOptions } from '../auth/[...nextauth]';
import { markdownToDocx } from '@/lib/markdown-to-docx';

export async function POST(req: NextRequest) {
  try {
    // 1. Validar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Não autenticado' },
        { status: 401 }
      );
    }

    // 2. Extrair token de acesso
    const accessToken = (session.user as any).accessToken;
    if (!accessToken) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'AccessToken não disponível' },
        { status: 401 }
      );
    }

    // 3. Parse request
    const { conteudo, nomeArquivo } = await req.json();

    if (!conteudo || !nomeArquivo) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Conteúdo ou nome ausente' },
        { status: 400 }
      );
    }

    // 4. Converter markdown para DOCX
    const docxBlob = await markdownToDocx(conteudo, nomeArquivo);

    // 5. Autenticar com Google
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    // 6. Upload para Google Drive
    const drive = google.drive({ version: 'v3', auth });

    const fileMetadata = {
      name: `${nomeArquivo}.docx`,
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };

    const media = {
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      body: docxBlob,
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    });

    // 7. Retornar resposta
    return NextResponse.json({
      sucesso: true,
      mensagem: 'Arquivo salvo no Google Drive',
      idArquivo: response.data.id,
      urlArquivo: response.data.webViewLink,
    });

  } catch (erro) {
    console.error('Erro ao salvar no Drive:', erro);

    // Tratamento de erros específicos
    if ((erro as any).code === 'UNAUTHENTICATED') {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Token expirado. Faça login novamente.' },
        { status: 401 }
      );
    }

    if ((erro as any).message?.includes('quota')) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Quota do Google Drive excedida' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        sucesso: false,
        mensagem: `Erro: ${(erro as Error).message}`,
      },
      { status: 500 }
    );
  }
}
```

### Validações de Segurança

1. **Sessão Obrigatória:**
   - Só usuários autenticados podem usar
   - `getServerSession()` valida JWT do NextAuth

2. **Escopo OAuth:**
   - Requer `https://www.googleapis.com/auth/drive.file`
   - Permite apenas criar/editar próprios arquivos

3. **Limite de Tamanho:**
   - Arquivo DOCX tem limite do Google Drive (5GB por arquivo)
   - Markdown > 100MB pode falhar

4. **Rate Limiting:**
   - Google Drive tem limites de API calls
   - Implementar retry com exponential backoff se necessário

---

## 🔑 Padrão de API Routes

Todas as rotas customizadas devem seguir este padrão:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]';

export async function POST(req: NextRequest) {
  try {
    // 1. Validar método HTTP
    if (req.method !== 'POST') {
      return NextResponse.json(
        { erro: 'Método não permitido' },
        { status: 405 }
      );
    }

    // 2. Validar autenticação (se necessário)
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { erro: 'Não autenticado' },
        { status: 401 }
      );
    }

    // 3. Parse e validar request
    const dados = await req.json();
    if (!dados.campo_obrigatorio) {
      return NextResponse.json(
        { erro: 'Campo obrigatório faltando' },
        { status: 400 }
      );
    }

    // 4. Lógica principal
    const resultado = processarDados(dados);

    // 5. Retornar sucesso
    return NextResponse.json({
      sucesso: true,
      dados: resultado,
    });

  } catch (erro) {
    console.error('Erro na API:', erro);
    return NextResponse.json(
      { erro: (erro as Error).message },
      { status: 500 }
    );
  }
}

function processarDados(dados: any) {
  // Implementação
  return {};
}
```

---

## 🧪 Testar Rotas de API

### Com curl

```bash
# GET /api/auth/session
curl http://localhost:3000/api/auth/session \
  -H "Cookie: next-auth.session-token=seu-token"

# POST /api/salvar-no-drive
curl -X POST http://localhost:3000/api/salvar-no-drive \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=seu-token" \
  -d '{"conteudo":"# Teste","nomeArquivo":"teste"}'
```

### Com fetch (browser console)

```javascript
// Já autenticado (cookie salvo)
const response = await fetch('/api/salvar-no-drive', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    conteudo: '# Teste',
    nomeArquivo: 'teste',
  }),
});

const dados = await response.json();
console.log(dados);
```

### Com Postman

1. Fazer login em http://localhost:3000 no navegador
2. Abrir DevTools → Application → Cookies
3. Copiar valor de `next-auth.session-token`
4. No Postman:
   - Headers → Add: `Cookie: next-auth.session-token=valor`
   - POST http://localhost:3000/api/salvar-no-drive
   - Body JSON com `conteudo` e `nomeArquivo`

---

## 📊 Diagrama de Fluxo

```
Cliente (Browser)
    ↓
    ├─→ GET /api/auth/signin (logout)
    ├─→ GET /api/auth/callback/google (OAuth)
    └─→ POST /api/salvar-no-drive
         ↓
    NextAuth Validação
         ↓
    getServerSession()
         ↓
    Extrair accessToken do JWT
         ↓
    google.drive().files.create()
         ↓
    Retornar { sucesso, idArquivo, urlArquivo }
         ↓
    Cliente renderiza resultado
```

---

## 🔧 Adicionar Nova Rota

### Exemplo: POST /api/validar-markdown

1. **Criar arquivo:**
```bash
touch app/api/validar-markdown/route.ts
```

2. **Implementar:**
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { conteudo } = await req.json();

    if (!conteudo) {
      return NextResponse.json(
        { erro: 'Conteúdo vazio' },
        { status: 400 }
      );
    }

    // Validar markdown
    const erros: string[] = [];

    // Check: code blocks não fechados
    const codeBlocksAbertos = (conteudo.match(/```/g) || []).length % 2;
    if (codeBlocksAbertos !== 0) {
      erros.push('Code block não fechado');
    }

    // Check: links quebrados
    const links = conteudo.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
    links.forEach(link => {
      if (!link.includes('(http')) {
        erros.push(`Link relativo: ${link}`);
      }
    });

    return NextResponse.json({
      valido: erros.length === 0,
      erros,
      avisos: [],
    });

  } catch (erro) {
    return NextResponse.json(
      { erro: (erro as Error).message },
      { status: 500 }
    );
  }
}
```

3. **Usar no cliente:**
```typescript
const response = await fetch('/api/validar-markdown', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ conteudo }),
});

const { valido, erros } = await response.json();
```

---

## 📋 Checklist de API Routes

Antes de publicar nova rota:

- [ ] Autenticação validada
- [ ] Inputs validados
- [ ] Erros tratados adequadamente
- [ ] Status codes corretos
- [ ] Documentação escrita
- [ ] Teste manual com curl/Postman
- [ ] Teste unitário adicionado
- [ ] Console.log removidos (ou usar logger)
- [ ] Performance aceitável
- [ ] Segurança checada

---

## 🔗 Referências

- **Next.js API Routes:** https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- **NextAuth.js:** https://next-auth.js.org
- **Google Drive API:** https://developers.google.com/drive/api/v3/about-sdk
- **HTTP Status Codes:** https://httpwg.org/specs/rfc9110.html

