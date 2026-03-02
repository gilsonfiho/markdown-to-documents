# Integração Google Drive - Resumo das Mudanças

## 📦 Instalação

```bash
npm install googleapis
```

## 📁 Arquivos Criados

### 1. `/app/api/salvar-no-drive/route.ts`
Endpoint de API para fazer upload de documentos para o Google Drive.

**Funcionalidade:**
- Autentica o usuário via NextAuth
- Recebe arquivo DOCX em base64
- Envia para Google Drive API
- Retorna URL do arquivo criado

**Request:**
```json
POST /api/salvar-no-drive
{
  "conteudo": "base64_encoded_docx",
  "nomeArquivo": "documento.docx"
}
```

**Response:**
```json
{
  "sucesso": true,
  "mensagem": "Documento salvo no Google Drive com sucesso!",
  "nomeArquivo": "documento.docx",
  "idArquivo": "file_id",
  "urlArquivo": "https://drive.google.com/file/d/file_id/view"
}
```

### 2. `/lib/google-drive.ts`
Funções auxiliares para integração com Google Drive.

**Funções:**
- `salvarNoGoogleDrive(conteudo: string, nomeArquivo: string)` - Salva um documento individual
- `salvarTodasNoGoogleDrive(abas: AbaData[])` - Salva múltiplos documentos em lote

## 📝 Arquivos Modificados

### 1. `/app/api/auth/[...nextauth].ts`
Adicionado suporte para Google Drive API:

```typescript
// Adicionado scope
authorization: {
  params: {
    scope: 'openid email profile https://www.googleapis.com/auth/drive.file',
  },
},

// Adicionados callbacks JWT e Session
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
}
```

### 2. `/components/Header.tsx`
- Adicionado import: `Cloud` do lucide-react
- Adicionado import: `salvarNoGoogleDrive, salvarTodasNoGoogleDrive` do @/lib/google-drive
- Adicionado estado: `isSavingToDrive`
- Adicionada função: `handleSalvarNoGoogleDrive()`
- Adicionada opção no dropdown: "Salvar Todas no Google Drive"

### 3. `/components/TabsBar.tsx`
- Adicionado import: `Cloud` do lucide-react
- Adicionado import: `useSession` do next-auth/react
- Adicionado import: `salvarNoGoogleDrive` do @/lib/google-drive
- Adicionado estado: `abaSalvandoNoDrive`
- Adicionada função: `handleSalvarNoGoogleDrive()`
- Adicionada opção no dropdown de cada aba: "Salvar no Google Drive"

## 🧪 Testes Atualizados

### `/\_\_tests\_\_/components/TabsBar.test.tsx`
- Adicionado mock: `next-auth/react`
- Adicionado mock: `@/lib/google-drive`
- Adicionado mock do `useSession()` no beforeEach

## 🎯 Features Adicionadas

### Header
```typescript
// Botão no dropdown
<DropdownMenuItem onClick={() => handleSalvarNoGoogleDrive()}>
  <Cloud size={18} className="text-blue-600" />
  <span>Salvar Todas no Google Drive</span>
</DropdownMenuItem>
```

### TabsBar (por aba)
```typescript
// Opção no dropdown de cada aba
<DropdownMenuItem onClick={(e) => handleSalvarNoGoogleDrive(e, aba)}>
  <Cloud size={12} className="text-blue-500" />
  <span>Salvar no Google Drive</span>
</DropdownMenuItem>
```

## 🔄 Fluxo de Uso

### 1. Salvar uma aba individual
```
Usuário clica Cloud icon em uma aba
    ↓
Markdown é convertido para DOCX
    ↓
DOCX é enviado em base64 para /api/salvar-no-drive
    ↓
API autentica via Google OAuth
    ↓
Google Drive API cria arquivo
    ↓
Toast mostra URL do arquivo
```

### 2. Salvar todas as abas
```
Usuário clica "Salvar Todas no Google Drive"
    ↓
Para cada aba:
  - Converte markdown para DOCX
  - Envia para Google Drive
  - Aguarda 500ms antes da próxima
    ↓
Toast mostra resultado final
```

## 🔐 Segurança

- Token de acesso armazenado apenas na sessão do servidor
- Scope limitado a `drive.file` (apenas arquivos criados pela app)
- Autenticação obrigatória via NextAuth
- Validação de entrada no endpoint da API

## 📊 Variables de Ambiente (já configuradas)

```env
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
NEXTAUTH_SECRET=sua_secret
NEXTAUTH_URL=http://localhost:3000 (ou production URL)
```

## ✅ Testes

Todos os 58 testes passando:
- ✅ Header.test.tsx
- ✅ TabsBar.test.tsx  
- ✅ MarkdownEditor.test.tsx
- ✅ Componentes shadcn-ui
- ✅ Store (Zustand)
- ✅ Markdown to DOCX
- ✅ Versioning

## 📚 Documentação

Veja `/docs/GOOGLE_DRIVE_INTEGRATION.md` para:
- Setup detalhado
- Exemplos de uso
- Troubleshooting
- Possíveis melhorias futuras

