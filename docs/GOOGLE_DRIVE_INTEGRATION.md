# Google Drive Integration - Setup Guide

## Overview

O Markdown Studio agora suporta salvar documentos diretamente no Google Drive! Essa funcionalidade permite que os usuários salvem seus documentos markdown convertidos em arquivos `.docx` no Google Drive com um clique.

## Requirements

- Google OAuth credentials (já configurado no projeto)
- Scope adicional: `https://www.googleapis.com/auth/drive.file`
- NextAuth.js com callbacks para JWT e Session

## Features

- 📁 Salvar documentos individuais no Google Drive
- 📚 Salvar múltiplos documentos em lote
- 🔐 Autenticação segura via Google OAuth
- 📊 Feedback em tempo real com toasts
- ⚡ Sem necessidade de configuração adicional do usuário

## How It Works

### 1. Authentication Flow

```typescript
// Quando o usuário faz login via Google OAuth:
// 1. Google autentica o usuário
// 2. NextAuth solicita o scope: drive.file
// 3. Access token é armazenado na sessão
// 4. O token é passado ao componente via session.user.accessToken
```

### 2. Upload Process

```
Usuário clica "Salvar no Google Drive"
    ↓
Markdown é convertido para DOCX (markdownToDocx)
    ↓
DOCX é enviado para API endpoint (/api/salvar-no-drive)
    ↓
API converte a sessão em credenciais Google
    ↓
Google Drive API cria novo arquivo
    ↓
Sucesso! Arquivo é salvo no Google Drive
```

## Environment Variables

Já configurados no projeto:

```env
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
NEXTAUTH_SECRET=sua_secret
```

## Usage

### Save Single Document

```typescript
// Em um componente:
import { salvarNoGoogleDrive } from '@/lib/google-drive';

const handleSalvarNoGoogleDrive = async () => {
  const resultado = await salvarNoGoogleDrive(
    '# Meu Documento\nConteúdo markdown',
    'documento.docx'
  );

  if (resultado.sucesso) {
    console.log('Salvo em:', resultado.urlArquivo);
  }
};
```

### Save Multiple Documents

```typescript
import { salvarTodasNoGoogleDrive } from '@/lib/google-drive';

const handleSalvarTodos = async () => {
  const abas = [
    { id: '1', nome: 'Doc 1', conteudo: '# Título 1' },
    { id: '2', nome: 'Doc 2', conteudo: '# Título 2' },
  ];

  const resultado = await salvarTodasNoGoogleDrive(abas);
  console.log(`${resultado.sucesso} salvos, ${resultado.falhas} falharam`);
};
```

## API Endpoint

### POST `/api/salvar-no-drive`

**Request:**
```json
{
  "conteudo": "base64_encoded_docx_blob",
  "nomeArquivo": "documento.docx"
}
```

**Response (Success):**
```json
{
  "sucesso": true,
  "mensagem": "Documento salvo no Google Drive com sucesso!",
  "nomeArquivo": "documento.docx",
  "idArquivo": "file_id_from_google_drive",
  "urlArquivo": "https://drive.google.com/file/d/file_id/view"
}
```

**Response (Error):**
```json
{
  "erro": "Não autenticado",
  "status": 401
}
```

## Components Updated

### Header.tsx
- Novo botão "Salvar Todas no Google Drive" no dropdown de exportação
- Estado `isSavingToDrive` para feedback visual
- Função `handleSalvarNoGoogleDrive()` para salvar todas as abas

### TabsBar.tsx
- Novo ícone Cloud em cada aba para salvar individualmente
- Função `handleSalvarNoGoogleDrive()` para salvar uma aba

## Files Created

- `/app/api/salvar-no-drive/route.ts` - Endpoint da API
- `/lib/google-drive.ts` - Funções auxiliares de integração

## Files Modified

- `/app/api/auth/[...nextauth].ts` - Adicionado Google Drive scope e callbacks JWT
- `/components/Header.tsx` - Adicionado botão e lógica
- `/components/TabsBar.tsx` - Adicionado opção individual por aba

## Security Considerations

- Access token é armazenado apenas na sessão do servidor
- Token nunca é exposto ao cliente
- Scope limitado a `drive.file` (apenas acesso a arquivos criados pelo app)
- API endpoint requer autenticação NextAuth

## Error Handling

Todos os erros são capturados e exibidos ao usuário via toast:

```typescript
// Erros comuns:
"Você precisa estar logado para salvar no Google Drive"
"Erro ao salvar no Google Drive"
"Token de acesso não disponível"
"Conteúdo e nome do arquivo são obrigatórios"
```

## Testing

Para testar a funcionalidade:

1. Faça login com sua conta Google
2. Crie/edite um documento
3. Clique em "Salvar Todas no Google Drive" (Header)
4. Ou clique no ícone Cloud em uma aba (TabsBar)
5. Verifique seu Google Drive - o arquivo deve aparecer

## Troubleshooting

### "Token de acesso não disponível"
- Faça logout e login novamente
- Verifique que o Google OAuth está configurado corretamente

### "Erro ao salvar no Google Drive"
- Verifique os logs do servidor
- Confirme que o GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET estão corretos
- Verifique as permissões da conta de serviço

### Arquivo não aparece no Drive
- Pode levar alguns segundos para sincronizar
- Verifique a pasta raiz do Google Drive
- Procure pelo nome do documento

## Future Enhancements

- [ ] Seleção de pasta de destino no Google Drive
- [ ] Sincronização automática em intervalos
- [ ] Histórico de sincronizações
- [ ] Integração com Google Docs
- [ ] Opção de atualizar arquivo existente

