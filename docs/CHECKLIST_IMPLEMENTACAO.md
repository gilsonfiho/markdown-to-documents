# ✅ Checklist de Implementação

## 🚀 Phase 1: Setup Inicial (Tempo: 15 minutos)

### Preparação
- [ ] Clonar/baixar projeto
- [ ] Node.js 22+ instalado? (`node --version`)
- [ ] npm/yarn instalado? (`npm --version`)
- [ ] Editor de código pronto (VS Code, etc)

### Instalação
- [ ] Abrir terminal na pasta do projeto
- [ ] Executar `npm install`
- [ ] Aguardar conclusão (2-3 minutos)
- [ ] Verificar se não houve erros

### Git (Opcional)
- [ ] Inicializar git: `git init`
- [ ] Criar `.gitignore` (já incluído ✅)
- [ ] Fazer commit inicial: `git add . && git commit -m "init: project setup"`

---

## 🔐 Phase 2: Google OAuth Setup (Tempo: 10-15 minutos)

### Criar Projeto Google Cloud

- [ ] Acessar https://console.cloud.google.com/
- [ ] Fazer login com conta Google pessoal
- [ ] Clicar em "Select a Project" → "New Project"
- [ ] Nome: `Markdown Studio`
- [ ] Organização: deixar vazio
- [ ] Clicar "Create"
- [ ] Aguardar criação (pode levar 1 min)

### Ativar Google+ API

- [ ] No painel, clique em "Enable APIs and Services"
- [ ] Pesquisar por "Google+ API"
- [ ] Clicar no resultado
- [ ] Clicar em "Enable"
- [ ] Aguardar ativação

### Criar Credenciais OAuth

- [ ] No menu esquerdo, clicar "Credentials"
- [ ] Clicar em "Create Credentials" → "OAuth client ID"
- [ ] Selecionar "Web application"
- [ ] Preencher:
  - **Name**: `Markdown Studio Web`
  - **Authorized JavaScript origins**: `http://localhost:3000`
  - **Authorized redirect URIs**: 
    - `http://localhost:3000/api/auth/callback/google`
- [ ] Clicar "Create"
- [ ] Uma modal aparecerá com Client ID e Secret
- [ ] **COPIAR** Client ID
- [ ] **COPIAR** Client Secret
- [ ] Salvar em local seguro (password manager)

---

## 🔑 Phase 3: Configurar Environment (Tempo: 5 minutos)

### Criar .env.local

```bash
# No terminal, na raiz do projeto:

# Gerar NEXTAUTH_SECRET
openssl rand -base64 32
# Copiar o resultado

# Criar arquivo .env.local
cat > .env.local << 'EOF'
NEXTAUTH_SECRET=<valor-gerado-acima>
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=<seu-client-id>
GOOGLE_CLIENT_SECRET=<seu-client-secret>
EOF
```

### Verificar .env.local

- [ ] Arquivo `.env.local` criado na raiz
- [ ] `NEXTAUTH_SECRET` preenchido (32+ caracteres)
- [ ] `NEXTAUTH_URL` = `http://localhost:3000`
- [ ] `GOOGLE_CLIENT_ID` preenchido
- [ ] `GOOGLE_CLIENT_SECRET` preenchido
- [ ] ⚠️ **Não** commitou este arquivo

---

## 🚀 Phase 4: Inicie o Servidor (Tempo: 2 minutos)

### Comando

```bash
npm run dev
```

### Verificações

- [ ] Terminal mostra: "ready - started server on 0.0.0.0:3000"
- [ ] Sem erros TypeScript
- [ ] Sem erros de compilação

### No Navegador

- [ ] Abrir http://localhost:3000
- [ ] Deve mostrar página de login
- [ ] Botão "Entrar com Google" visível
- [ ] Design minimalista com fundo escuro

---

## 🧪 Phase 5: Teste de Login (Tempo: 3 minutos)

### Fazer Login

- [ ] Clicar em "Entrar com Google"
- [ ] Será redirecionado para Google login
- [ ] Fazer login com sua conta Google
- [ ] Autorizar app ("Markdown Studio quer acessar...")
- [ ] Será redirecionado de volta para app
- [ ] Página principal aparece
- [ ] Nome/email no header (canto superior direito)

### Botões Funcionam?

- [ ] Header mostra info do usuário
- [ ] Botão "Exportar DOCX" visível
- [ ] Botão "Sair" visível

---

## 📝 Phase 6: Teste do Editor (Tempo: 3 minutos)

### Editor

- [ ] Painel esquerdo tem textarea
- [ ] Pode digitar/colar markdown
- [ ] Cursor funciona normalmente

### Preview

- [ ] Painel direito mostra preview
- [ ] Atualiza em tempo real (enquanto digita)
- [ ] Markdown renderiza corretamente

### Teste com Exemplo

Cole isto no editor:

```markdown
# Teste

**Bold** e *italic*

- Lista 1
- Lista 2

## Sub-heading

```code```
```

Verifique no preview:
- [ ] Heading renderizado
- [ ] Bold e italic funcionam
- [ ] Lista renderizada
- [ ] Code block está lá

---

## 💾 Phase 7: Teste de Exportação (Tempo: 2 minutos)

### Pré-requisitos

- [ ] Markdown no editor (use o teste acima)
- [ ] Logged in (mostra nome no header)

### Export

- [ ] Clicar em "Exportar DOCX"
- [ ] Botão fica "Exportando..." com spinner
- [ ] Arquivo baixa automaticamente
- [ ] Nome: `documento.docx`

### Verificar DOCX

- [ ] Arquivo está no Downloads
- [ ] Abrir com Microsoft Word / LibreOffice
- [ ] Formatação preservada:
  - [ ] Headings estão grandes
  - [ ] Bold está bold
  - [ ] Italic está italic
  - [ ] Lista renderizada
  - [ ] Code block com fundo cinza

---

## 🎉 Phase 8: Testes Adicionais (Tempo: 5 minutos)

### Responsividade

- [ ] F12 (DevTools)
- [ ] Ctrl+Shift+M (toggle device toolbar)
- [ ] Testar em Mobile (375px)
- [ ] Testar em Tablet (768px)
- [ ] Testar em Desktop (1024px)
- [ ] Layout funciona em todos

### Escuro/Claro

- [ ] Sistema operacional em dark mode
- [ ] Design se adapta automaticamente (ou fica claro)

### Performance

- [ ] DevTools → Lighthouse
- [ ] Rodar audit
- [ ] Score deve ser 90+

### Diferentes Markdowns

Teste com:
- [ ] Tabelas
- [ ] Citações
- [ ] Links
- [ ] Código com diferentes linguagens
- [ ] Listas aninhadas

---

## 🚀 Phase 9: Preparar para Deploy (Tempo: 10 minutos)

### Criar repositório GitHub

- [ ] https://github.com/new
- [ ] Nome: `markdown-studio`
- [ ] Descrição: "Markdown to DOCX converter with Google auth"
- [ ] Private (recomendado)
- [ ] Não inicializar com README (já tem)
- [ ] Criar repositório

### Fazer Push

```bash
# Adicionar remote
git remote add origin https://github.com/SEU_USER/markdown-studio.git

# Push
git branch -M main
git push -u origin main
```

- [ ] Código no GitHub
- [ ] `.env.local` NÃO foi commitado
- [ ] Verificar `.gitignore` tem `.env.local`

---

## 🌐 Phase 10: Deploy no Vercel (Tempo: 5 minutos)

### Conectar Vercel

- [ ] Ir para https://vercel.com
- [ ] Fazer login ou criar conta
- [ ] Clicar "New Project"
- [ ] Conectar GitHub
- [ ] Selecionar `markdown-studio`
- [ ] Clicar "Import"

### Configurar Environment Variables

Na página de projeto, ir para "Settings" → "Environment Variables"

- [ ] Adicionar `NEXTAUTH_SECRET`
  - Value: (gerar novo com `openssl rand -base64 32`)
  - Environments: ✅ Preview, ✅ Production
- [ ] Adicionar `NEXTAUTH_URL`
  - Value: `https://seu-projeto-vercel.app` (será fornecido)
  - Environments: ✅ Preview, ✅ Production
- [ ] Adicionar `GOOGLE_CLIENT_ID`
  - Value: seu client ID
  - Environments: ✅ Preview, ✅ Production
- [ ] Adicionar `GOOGLE_CLIENT_SECRET`
  - Value: seu secret
  - Environments: ✅ Preview, ✅ Production

### Permitir Deploy

- [ ] Clicar "Deploy"
- [ ] Aguardar deployment
- [ ] Deve levar 1-2 minutos
- [ ] Status: "✓ Ready"

### Atualizar Google OAuth

De volta ao Google Cloud Console:

- [ ] Credenciais
- [ ] Editar sua aplicação OAuth
- [ ] Em "Authorized redirect URIs", adicionar:
  - `https://seu-projeto-vercel.app/api/auth/callback/google`
- [ ] Salvar

---

## ✨ Phase 11: Validação Final (Tempo: 5 minutos)

### Production Testing

- [ ] Abrir URL do Vercel
- [ ] Página de login carrega
- [ ] Clicar "Entrar com Google"
- [ ] Login funciona
- [ ] Dashboard aparece
- [ ] Testar editor
- [ ] Testar preview
- [ ] Testar export DOCX
- [ ] Download funciona
- [ ] DOCX tem formatação correta

### Performance em Prod

- [ ] Lighthouse score
- [ ] Deve ser 90+

### Monitoring

- [ ] Vercel Analytics está ativado
- [ ] Verifique dashboard para erros

---

## 📚 Phase 12: Documentação (Tempo: 5 minutos)

### Ler Documentação

- [ ] README.md (no projeto)
- [ ] SETUP_RAPIDO.md
- [ ] ARQUITETURA_TECNICA.md
- [ ] ENV_VARIABLES.md

### Criar Sua Documentação

- [ ] README.md customizado
- [ ] Adicionar seu próprio deploy link
- [ ] Documentar qualquer customização

---

## 🔒 Phase 13: Segurança (Tempo: 5 minutos)

### Checklist Segurança

- [ ] `.env.local` em `.gitignore`
- [ ] `.env.local` NUNCA foi commitado
- [ ] Secrets armazenados em password manager
- [ ] Google OAuth secrets protegidos
- [ ] Vercel Environment variables setadas
- [ ] HTTPS habilitado em produção
- [ ] CORS configurado (se necessário)

### Rotina

- [ ] Adicionar ao calendar: rotacionar secrets trimestralmente
- [ ] Adicionar ao calendar: revisar logs mensalmente

---

## 🎯 Phase 14: Próximos Passos (Opcional)

### Imediato (Semana 1)
- [ ] Customizar design/cores
- [ ] Adicionar seu logo
- [ ] Testar com mais exemplos

### Curto Prazo (Mês 1)
- [ ] Implementar backend (Node.js + DB)
- [ ] Adicionar salvamento de documentos
- [ ] Adicionar histórico de versões

### Médio Prazo (Mês 2-3)
- [ ] Autenticação com outros provedores
- [ ] Features de colaboração
- [ ] Temas customizáveis

### Longo Prazo (Mês 3+)
- [ ] Mobile app
- [ ] Browser extensions
- [ ] API pública
- [ ] Marketplace de templates

---

## 🐛 Troubleshooting Rápido

### "Port 3000 já em uso"
```bash
npm run dev -- -p 3001
```

### "Module not found"
```bash
rm -rf node_modules && npm install
```

### "Erro TypeScript"
```bash
# Limpar cache
rm -rf .next
npm run dev
```

### "Google login não funciona"
- Verify: NEXTAUTH_SECRET em .env.local
- Verify: NEXTAUTH_URL correto
- Verify: Google OAuth credentials corretos
- Verify: Callback URI registrado no Google Cloud

### "DOCX export falha"
- Tente markdown simples primeiro
- Limpar cache do navegador (Ctrl+Shift+Del)
- Abrir DevTools → Console para ver erro

---

## ✅ Finalizado!

Se completou todos os checkpoints:

- ✅ Setup local OK
- ✅ Google OAuth configurado
- ✅ Aplicação funcionando
- ✅ Deploy em produção
- ✅ Segurança checada
- ✅ Documentação revisada

### Parabéns! 🎉

Você tem uma aplicação **pronta para uso**, **segura** e **escalável**.

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os documentos de troubleshooting
2. Procure no Google (stackoverflow, GitHub issues)
3. Consulte a documentação do Next.js/NextAuth
4. Abra issue no GitHub

---

## 📋 Tempo Total

- Phase 1-4: 32 minutos
- Phase 5-8: 13 minutos
- Phase 9-13: 30 minutos
- **Total estimado: 75 minutos (~1h15m)**

Para um senior developer: **30-45 minutos**
Para um junior developer: **2-3 horas**

---

## 🏆 Checklist Master

Marque aqui quando terminar cada fase:

```
Phase 1: Setup           ☐
Phase 2: Google OAuth    ☐
Phase 3: Environment     ☐
Phase 4: Dev Server      ☐
Phase 5: Login Test      ☐
Phase 6: Editor Test     ☐
Phase 7: Export Test     ☐
Phase 8: Extra Tests     ☐
Phase 9: GitHub          ☐
Phase 10: Vercel Deploy  ☐
Phase 11: Prod Test      ☐
Phase 12: Documentation  ☐
Phase 13: Segurança      ☐
Phase 14: Próximos Step  ☐

Status: ____________/14
```

---

**Desenvolvido para profissionais que valorizam produtividade e qualidade.** 🚀
