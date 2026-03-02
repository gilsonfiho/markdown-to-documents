# 📋 REFERENCE RÁPIDA - Google Drive Integration

## 🎯 Localização dos Botões

### Header (Topo da Página)
```
┌─────────────────────────────────────────────────────────┐
│ [Markdown Studio] v1.0.35    [User] [Save] [Export ▼]   │
│                                              │           │
│                                              ├─ 📄 Baixar
│                                              ├─ ☁️  Salvar Drive ✨
│                                              ├─ 📋 Copiar
│                                              ├─ 📄 HTML
│                                              └─ 📊 PDF
└─────────────────────────────────────────────────────────┘
```

### TabsBar (Abas)
```
┌────────────────────────────────────────────────────┐
│ [Aba 1 ✓] [Aba 2] [+ Nova]                         │
│    │                                                │
│    ├─ 💾 Salvar                                     │
│    └─ 🔽 Mais opções                               │
│       ├─ 📄 Exportar (.docx)                       │
│       ├─ ☁️  Salvar Drive ✨                        │
│       ├─ 📋 Copiar                                 │
│       ├─ 📄 HTML                                   │
│       └─ 📊 PDF                                    │
└────────────────────────────────────────────────────┘
```

---

## 🔑 API Reference

### Endpoint: POST /api/salvar-no-drive

**Request:**
```javascript
POST /api/salvar-no-drive
{
  "conteudo": "base64_encoded_docx",
  "nomeArquivo": "documento.docx"
}
```

**Response (Success):**
```json
{
  "sucesso": true,
  "mensagem": "Documento salvo no Google Drive com sucesso!",
  "nomeArquivo": "documento.docx",
  "idArquivo": "xxx",
  "urlArquivo": "https://drive.google.com/file/d/xxx/view"
}
```

**Response (Error):**
```json
{
  "erro": "Erro específico",
  "status": 401 ou 500
}
```

---

## 💻 Código - Usando a Biblioteca

### Exemplo 1: Salvar Um Documento
```typescript
import { salvarNoGoogleDrive } from '@/lib/google-drive';

const resultado = await salvarNoGoogleDrive(
  '# Meu Documento\nConteúdo',
  'documento'
);

if (resultado.sucesso) {
  console.log('URL:', resultado.urlArquivo);
  // Abrir em nova aba:
  // window.open(resultado.urlArquivo);
}
```

### Exemplo 2: Salvar Múltiplos
```typescript
import { salvarTodasNoGoogleDrive } from '@/lib/google-drive';

const abas = [
  { id: '1', nome: 'Doc 1', conteudo: '# Título 1' },
  { id: '2', nome: 'Doc 2', conteudo: '# Título 2' },
];

const resultado = await salvarTodasNoGoogleDrive(abas);
console.log(`${resultado.sucesso} salvos, ${resultado.falhas} erros`);
```

---

## 🔐 Segurança

### Variáveis de Ambiente
```env
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
NEXTAUTH_SECRET=algo_aleatorio_de_32_bytes
NEXTAUTH_URL=https://seu-dominio.com
```

### Scopes OAuth
```
openid                                              (obrigatório)
email                                              (obrigatório)
profile                                            (obrigatório)
https://www.googleapis.com/auth/drive.file         (novo - Google Drive)
```

---

## 🧪 Testes

### Executar Testes
```bash
npm test                    # Todos os testes
npm test -- TabsBar         # Apenas TabsBar
npm test -- --watch        # Modo watch
npm test -- --coverage     # Com coverage
```

### Mock da Biblioteca
```typescript
jest.mock('@/lib/google-drive', () => ({
  salvarNoGoogleDrive: jest.fn(),
  salvarTodasNoGoogleDrive: jest.fn(),
}));
```

---

## 📊 Verificação

### TypeScript
```bash
npx tsc --noEmit     # Verificar tipos (0 erros esperado)
```

### ESLint
```bash
npm run lint         # Verificar linting (0 warnings)
npm run lint:fix     # Corrigir automaticamente
```

### Testes
```bash
npm test             # 58 testes esperado passar
```

---

## 🐛 Debugging

### Console Logs Úteis
```javascript
// Verificar se usuário está autenticado
console.log(session);  // deve ter session.user.accessToken

// Verificar resposta da API
fetch('/api/salvar-no-drive', {...})
  .then(r => r.json())
  .then(d => console.log(d));  // verificar sucesso/erro
```

### DevTools Network
1. F12 → Network tab
2. Filtrar por: "salvar-no-drive"
3. Status esperado: 200 (sucesso) ou 401 (não autenticado)

---

## 📁 Estrutura de Arquivos

```
app/
├── api/
│   ├── auth/
│   │   └── [...nextauth].ts          (modificado)
│   └── salvar-no-drive/
│       └── route.ts                  (novo)

components/
├── Header.tsx                         (modificado)
└── TabsBar.tsx                        (modificado)

lib/
├── google-drive.ts                    (novo)
└── markdown-to-docx.ts               (existente)

docs/
├── GOOGLE_DRIVE_INTEGRATION.md        (novo)
├── GOOGLE_DRIVE_QUICKSTART.md         (novo)
├── GOOGLE_DRIVE_SUMMARY.md            (novo)
├── IMPLEMENTACAO_GOOGLE_DRIVE.md      (novo)
└── CHANGELOG_GOOGLE_DRIVE.md          (novo)

__tests__/
├── components/
│   └── TabsBar.test.tsx              (modificado)
└── lib/
    └── store.test.ts                 (modificado)
```

---

## 🚀 Deploy Checklist

- ✅ Código compilado (npm run build)
- ✅ Testes passando (npm test)
- ✅ TypeScript validado (npx tsc --noEmit)
- ✅ Variáveis de ambiente configuradas
- ✅ Google OAuth credenciais ativas
- ✅ 0 vulnerabilidades (npm audit)
- ✅ Documentação completa
- ✅ Sem console.logs de debug

---

## 📞 Links Úteis

| Recurso | URL |
|---------|-----|
| Google Drive | https://drive.google.com |
| Google Cloud Console | https://console.cloud.google.com |
| NextAuth Docs | https://next-auth.js.org |
| Google APIs | https://developers.google.com/drive |

---

## 🎓 Padrões Adotados

### Nomenclatura
```
Funções:     salvarNoGoogleDrive (camelCase)
Componentes: Header, TabsBar (PascalCase)
Variáveis:   isSavingToDrive (camelCase)
Arquivos:    google-drive.ts (kebab-case)
```

### Padrões de Código
```typescript
// Interface typing
interface RespostaSalvoDrive { }

// Error handling
try {
  // ...
} catch (erro) {
  console.error('Erro:', erro);
  return { sucesso: false, erro };
}

// Async/await
const resultado = await salvarNoGoogleDrive(conteudo, nome);
```

### Estados React
```typescript
const [isSavingToDrive, setIsSavingToDrive] = useState(false);
const [abaSalvandoNoDrive, setAbaSalvandoNoDrive] = useState<string | null>(null);
```

---

## 💡 Tips & Tricks

### Abrir arquivo direto no Google Drive
```typescript
window.open(resultado.urlArquivo);  // Abre em nova aba
```

### Compartilhar documento
```
Google Drive → Arquivo → Compartilhar → Link
Copiar link e enviar para contatos
```

### Editar como Google Docs
```
Google Drive → Clique direito → Abrir com → Google Docs
```

### Download local
```
Google Drive → Clique direito → Download
Salva como .docx no computador
```

---

## ❌ Erros Comuns

| Erro | Causa | Solução |
|------|-------|---------|
| "Não autenticado" | Sem login | Faça login com Google |
| "Token não disponível" | NextAuth config | Refaça login |
| "Arquivo não aparece" | Sincronização lenta | Aguarde 10s |
| "Permissão negada" | Credentials revogadas | Refaça login |

---

## 📝 Notas Importantes

1. **Delay 500ms entre uploads** - Evita rate limiting
2. **base64 para JSON** - Necessário para serialização
3. **drive.file scope** - Seguro, apenas arquivos da app
4. **JWT storage** - Tokens seguros no servidor
5. **Toast feedback** - UX feedback importante

---

## 🎯 Quick Reference

```bash
# Iniciar dev
npm run dev

# Rodar testes
npm test

# Verificar tipos
npx tsc --noEmit

# Linting
npm run lint

# Build produção
npm run build
npm start
```

---

**Última atualização:** 02/03/2026  
**Versão:** 1.0.0  
**Status:** ✅ Pronto para produção

