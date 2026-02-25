# 📐 Arquitetura Técnica - Markdown Studio

## Visão Geral

Aplicação Next.js 14 full-stack com:

- Frontend: React 18 + TypeScript
- Autenticação: NextAuth.js
- State: Zustand
- Export: docx library
- Styling: Tailwind CSS + Framer Motion

## Fluxo de Dados

```
┌─────────────────────────────────────────────────────────┐
│                   MARKDOWN STUDIO                        │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐                  ┌──────────────┐    │
│  │   EDITOR     │                  │   PREVIEW    │    │
│  │              │                  │              │    │
│  │  textarea    │─ onChange ──────>│  react-md    │    │
│  │              │                  │              │    │
│  └──────────────┘                  └──────────────┘    │
│        │                                  ▲             │
│        └──────────────────────────────────┘             │
│              Zustand Store (markdown)                   │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │          HEADER / CONTROLS                     │    │
│  │  ┌──────────────┐  ┌──────────────────────┐   │    │
│  │  │ User Info    │  │ Export DOCX Button   │   │    │
│  │  └──────────────┘  └──────────────────────┘   │    │
│  └────────────────────────────────────────────────┘    │
│                       │                                  │
│                       v                                  │
│         markdownToDocx(markdown)                        │
│              ▼                                           │
│        docx Package                                     │
│              ▼                                           │
│        .docx File (Download)                           │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Arquitetura de Componentes

```
App (layout.tsx)
├── Providers (NextAuth + SessionProvider)
│   └── Home (page.tsx)
│       ├── Header
│       │   ├── User Info
│       │   ├── Export Button
│       │   └── Auth Button (SignIn/SignOut)
│       ├── Editor Panel
│       │   └── MarkdownEditor
│       └── Preview Panel
│           └── MarkdownPreview
```

## Fluxo de Autenticação

```
1. User clica em "Google"
   │
   └─> signIn('google', { callbackUrl: '/' })
       │
       └─> NextAuth -> Google OAuth
           │
           ├─> Redirect to Google login
           │
           └─> Callback to /api/auth/callback/google
               │
               └─> Session criada
                   │
                   └─> Redirect para '/'
```

## Fluxo de Export DOCX

```
1. User clica em "Exportar DOCX"
   │
   └─> handleExport()
       │
       ├─> setIsExporting(true)
       │
       ├─> markdownToDocx(markdown, fileName)
       │   │
       │   ├─> parseMarkdown() [Parser custom]
       │   │   │
       │   │   ├─> Identifica headings, listas, código, etc
       │   │   │
       │   │   └─> Array de ParsedMarkdown
       │   │
       │   ├─> Cria Document DOCX
       │   │   │
       │   │   └─> Mapeia cada elemento para docx Paragraph
       │   │
       │   ├─> Packer.toBlob(doc) [Browser WASM]
       │   │
       │   ├─> URL.createObjectURL(blob)
       │   │
       │   └─> Download automático
       │
       └─> setIsExporting(false)
```

## Stack Técnico Detalhado

### Frontend Framework

- **Next.js 14**: App Router, SSR capabilities
- **React 18**: Hooks, Context, concurrent features
- **TypeScript**: Type safety completo

### UI & Styling

- **Tailwind CSS 3**: Utility-first CSS
- **Framer Motion**: Smooth animations
- **Lucide React**: Icon library

### State Management

- **Zustand**: Lightweight state (markdown, fileName)
- **NextAuth Session**: User authentication state

### Features

- **react-markdown**: Markdown to JSX converter
- **remark-gfm**: GitHub Flavored Markdown support
- **docx**: Create .docx files in browser (WASM)

### Authentication

- **NextAuth.js 4.24**: OAuth framework
- **Google Provider**: Social login

## Estrutura de Diretórios

```
app/
├── api/
│   └── auth/
│       └── [...nextauth]/
│           ├── route.ts          ← NextAuth API route
│           └── config (em outro arquivo)
├── auth/
│   └── signin/
│       └── page.tsx              ← Login page
├── page.tsx                       ← Home/Dashboard
├── layout.tsx                     ← Root layout
└── globals.css                    ← Global styles

components/
├── Header.tsx                     ← User + Export button
├── MarkdownEditor.tsx             ← Textarea editor
├── MarkdownPreview.tsx            ← Markdown renderer
└── Providers.tsx                  ← NextAuth provider

lib/
├── store.ts                       ← Zustand store
└── markdown-to-docx.ts            ← Export logic

public/
└── (favicon, etc)
```

## Estados da Aplicação

### Global (Zustand)

```typescript
interface AppStore {
  markdown: string; // Conteúdo markdown
  setMarkdown: (content) => void;
  fileName: string; // Nome do arquivo
  setFileName: (name) => void;
}
```

### Component (useState)

```typescript
// Header.tsx
const [isExporting, setIsExporting] = useState(false);

// NextAuth session
const { data: session, status } = useSession();
```

## Performance

### Otimizações Implementadas

1. **Code Splitting**: Next.js automático com dynamic imports
2. **Image Optimization**: Lucide icons (SVG)
3. **CSS Purging**: Tailwind produção
4. **Lazy Loading**: Components com React.lazy (opcional)
5. **Memoization**: Componentes funcionais (puro React)

### Métricas Esperadas

- Lighthouse: 95+
- First Contentful Paint: <1s
- Time to Interactive: <2s
- Build Size: ~500KB gzip

## Segurança

### Implementado

1. **CSRF Protection**: NextAuth built-in
2. **Session Security**: NextAuth secure cookies
3. **Environment Variables**: .env.local não commitado
4. **Input Validation**: React markdown sanitized por padrão
5. **XSS Prevention**: React JSX escaping

### Não Implementado (Backend Future)

- Rate limiting
- API authentication
- Database encryption
- Audit logs

## Escalabilidade

### Atual (Client-side)

- Sem servidor backend
- Tudo roda no browser
- Sem database
- Arquivo markdown ilimitado (RAM do browser)

### Futura (Com Backend)

```
Browser ─────────── NextAuth ─────────── API
                        │
                        └────── Database (MongoDB/PostgreSQL)
                                    └── Cloud Storage (S3)
```

## Fluxo de CI/CD (Recomendado)

```yaml
# .github/workflows/deploy.yml
on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - uses: vercel/action@master
        with:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

## Testing Strategy

### Unit Tests (Jest + React Testing Library)

```typescript
describe('MarkdownEditor', () => {
  it('should update markdown on input', () => {
    // Test logic
  });
});
```

### E2E Tests (Playwright/Cypress)

```typescript
test('Export DOCX flow', async ({ page }) => {
  await page.goto('/');
  await page.fill('textarea', '# Test');
  await page.click('button:has-text("Exportar")');
  // Assert download
});
```

## Debugging

### Ferramentas

1. **React DevTools**: Component inspection
2. **Next.js DevTools**: Server components
3. **Network Tab**: API calls
4. **Console**: Logs
5. **NextAuth Debug**: `NEXTAUTH_DEBUG=true`

### Common Issues

**Issue**: "NEXTAUTH_SECRET missing"

```bash
# Fix: Add to .env.local
NEXTAUTH_SECRET=$(openssl rand -base64 32)
```

**Issue**: "Google callback failed"

```bash
# Fix: Verify in Google Cloud Console
# Callback must be: http://localhost:3000/api/auth/callback/google
```

## Monitoramento (Produção)

### Recomendado

- Vercel Analytics (built-in)
- Sentry para error tracking
- LogRocket para session replay

## Deployment Checklist

- [ ] .env.local não commitado
- [ ] Build local OK (`npm run build`)
- [ ] Google OAuth configurado
- [ ] NEXTAUTH_SECRET gerado
- [ ] NEXTAUTH_URL correto
- [ ] Environment variables no Vercel
- [ ] Domínio custom configurado
- [ ] HTTPS ativado
- [ ] Analytics ativado

## Future Enhancements

### Phase 2

- [ ] Backend API (Node.js)
- [ ] Database (MongoDB/PostgreSQL)
- [ ] Save/Load documents
- [ ] Document history
- [ ] Collaboration features

### Phase 3

- [ ] Rich text editor
- [ ] Templates
- [ ] Themes
- [ ] API para terceiros

### Phase 4

- [ ] Mobile app (React Native)
- [ ] VS Code extension
- [ ] Browser extension

---

**Desenvolvido seguindo melhores práticas de software engineering.**
