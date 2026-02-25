# 🔐 Guia de Environment Variables

## Arquivo .env.local

Este arquivo contém todas as variáveis sensíveis e **NUNCA deve ser commitado** no Git.

### Estrutura

```
.env.local (LOCAL - NÃO COMMIT!)
├── NextAuth
├── Google OAuth
└── (Futura: Database, APIs, etc)
```

---

## Variables Explicadas

### 1. NEXTAUTH_SECRET

**O que é**: Chave privada para criptografia de sessões do NextAuth

**Como gerar**:
```bash
# Opção 1: OpenSSL (recomendado)
openssl rand -base64 32

# Opção 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Opção 3: Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Opção 4: Online (apenas desenvolvimento)
# https://generate-secret.vercel.app/32
```

**Exemplo**:
```
NEXTAUTH_SECRET=K4kZpL9mN2vQ5xY7aB3cD6eF8gH1jK4l+M7nO9pQ2rS5t=
```

**Importância**: 🔴 CRÍTICA
- Se vazar, todas as sessões são comprometidas
- Mude em produção regularmente
- Nunca compartilhe

**Para Produção**:
```bash
# Gere um novo valor
openssl rand -base64 64  # Mais longo para produção
```

---

### 2. NEXTAUTH_URL

**O que é**: URL base da sua aplicação

**Desenvolvimento**:
```
NEXTAUTH_URL=http://localhost:3000
```

**Staging**:
```
NEXTAUTH_URL=https://staging.markdown-studio.app
```

**Produção**:
```
NEXTAUTH_URL=https://markdown-studio.app
```

**Importância**: 🟡 IMPORTANTE
- Deve ser exato (protocolo://dominio:porta)
- Sem barra final
- Usado para callbacks OAuth

**Valores Inválidos**:
```
❌ http://localhost:3000/     # Tem barra
❌ localhost:3000             # Sem protocolo
❌ https://localhost          # Sem porta (se dev local)
```

---

### 3. GOOGLE_CLIENT_ID

**O que é**: Identificador único do seu app no Google

**Como obter**:

1. Vá para [Google Cloud Console](https://console.cloud.google.com/)
2. Crie ou selecione um projeto
3. Ative "Google+ API"
4. Vá para "Credenciais"
5. Clique em "Criar Credenciais" → "ID do Cliente OAuth"
6. Tipo: "Aplicação web"
7. Copie o "Client ID"

**Formato**:
```
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
```

**Importância**: 🟡 IMPORTANTE
- Pode ser revelado (é um ID público)
- Usado para identificar seu app no Google
- Diferente para cada ambiente (dev/staging/prod)

---

### 4. GOOGLE_CLIENT_SECRET

**O que é**: Senha do seu app no Google (SENSÍVEL)

**Como obter**:
- Mesmo processo que CLIENT_ID
- Na página de credenciais, clique em seu app
- Copie o "Client Secret"

**Formato**:
```
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrst1234567890
```

**Importância**: 🔴 CRÍTICA
- **NUNCA** compartilhe ou commit
- Revogue imediatamente se vazar
- Use diferentes secrets para cada ambiente

**Se vazar**:
```bash
# 1. Google Cloud Console
# 2. Delete o secret comprometido
# 3. Crie um novo
# 4. Update .env.local e servidores
# 5. Monitore atividade suspeita
```

---

## Arquivo .env.local Completo

```env
# ============================================
# NEXTAUTH CONFIGURATION
# ============================================

# Gerar com: openssl rand -base64 32
NEXTAUTH_SECRET=K4kZpL9mN2vQ5xY7aB3cD6eF8gH1jK4l+M7nO9pQ2rS5t=

# Deve ser exato (protocolo://host:porta, sem barra final)
NEXTAUTH_URL=http://localhost:3000


# ============================================
# GOOGLE OAUTH
# ============================================

# ID público do seu app Google
# Obtém em: Google Cloud Console → Credenciais
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com

# SENHA DO SEU APP - NUNCA COMPARTILHE!
# Obtém em: Google Cloud Console → Credenciais
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrst1234567890


# ============================================
# FUTURA: DATABASE (quando implementar backend)
# ============================================

# DATABASE_URL=postgresql://user:password@localhost:5432/markdown-studio
# MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/db


# ============================================
# FUTURA: CLOUD STORAGE (quando implementar)
# ============================================

# AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
# AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
# AWS_S3_BUCKET=markdown-studio-files


# ============================================
# FUTURA: EXTERNAL APIS
# ============================================

# STRIPE_SECRET_KEY=sk_test_4eC39HqLyjWDarhtT657tYrr
# SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## Setup por Ambiente

### 🔧 Desenvolvimento Local

```env
NEXTAUTH_SECRET=dev-secret-123  # Use algo simples para dev
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=seu-dev-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-dev-secret
```

**Arquivo**: `.env.local`
**Commit**: ❌ NÃO (está em .gitignore)

### 📦 Staging/QA

```env
NEXTAUTH_SECRET=openssl rand -base64 32  # Novo, seguro
NEXTAUTH_URL=https://staging.markdown-studio.app

GOOGLE_CLIENT_ID=seu-staging-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-staging-secret
```

**Onde**: Vercel Environment → Staging
**Commit**: ❌ NÃO (credenciais sensíveis)

### 🚀 Produção

```env
NEXTAUTH_SECRET=openssl rand -base64 64  # Bem longo
NEXTAUTH_URL=https://markdown-studio.app

GOOGLE_CLIENT_ID=seu-prod-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-prod-secret
```

**Onde**: Vercel Environment → Production
**Commit**: ❌ NÃO (credenciais sensíveis)
**Backup**: 🔒 Armazenado em password manager corporativo

---

## Como Configurar no Vercel

### Passo 1: Vá para Projeto Vercel

```
Dashboard → Seu Projeto → Settings → Environment Variables
```

### Passo 2: Adicione Variables

| Variable | Value | Preview | Production |
|----------|-------|---------|------------|
| NEXTAUTH_SECRET | (valor) | ✅ | ✅ |
| NEXTAUTH_URL | (url) | ✅ | ✅ |
| GOOGLE_CLIENT_ID | (id) | ✅ | ✅ |
| GOOGLE_CLIENT_SECRET | (secret) | ✅ | ✅ |

### Passo 3: Redeploy

```bash
git push  # Vercel redeploya automaticamente
```

---

## Checklist de Segurança

- [ ] `.env.local` está em `.gitignore`
- [ ] Nunca commitei `.env.local`
- [ ] `NEXTAUTH_SECRET` tem mínimo 32 caracteres
- [ ] `GOOGLE_CLIENT_SECRET` não está em logs
- [ ] Diferentes secrets para dev/staging/prod
- [ ] URLs corretas para cada ambiente
- [ ] Callback URIs adicionadas no Google Cloud
- [ ] Credenciais rotacionadas em produção
- [ ] Acesso restrito em Google Cloud Console
- [ ] Monitoramento de atividade suspeita

---

## Rotina de Segurança

### Mensalmente

```bash
# 1. Verifique logs de acesso
# Google Cloud Console → Logs

# 2. Revise permissões
# Google Cloud Console → IAM

# 3. Backup de secrets em password manager
```

### Trimestralmente

```bash
# 1. Rode novo NEXTAUTH_SECRET
openssl rand -base64 64

# 2. Update em Vercel
# Dashboard → Settings → Environment Variables

# 3. Redeploy todos os ambientes
```

### Se Vazar Credenciais

```bash
# 1. IMEDIATAMENTE revogue em Google Cloud Console
# 2. Crie novos Client ID/Secret
# 3. Update .env.local localmente
# 4. Update em Vercel
# 5. Redeploy
# 6. Check logs para atividade suspeita
# 7. Notifique segurança/DevOps
```

---

## Troubleshooting

### ❌ Erro: "NEXTAUTH_SECRET not configured"

**Causa**: Variável não setada ou vazia

**Solução**:
```bash
# 1. Gere secret
openssl rand -base64 32

# 2. Adicione a .env.local
echo "NEXTAUTH_SECRET=<valor>" >> .env.local

# 3. Reinicie servidor
npm run dev
```

### ❌ Erro: "Invalid Client ID"

**Causa**: CLIENT_ID incorreto ou não encontrado

**Solução**:
1. Google Cloud Console
2. Credenciais
3. Verifique Client ID está correto
4. Copie de novo em .env.local
5. Restart servidor

### ❌ Erro: "Redirect URI Mismatch"

**Causa**: NEXTAUTH_URL não corresponde ao registrado no Google

**Solução**:
1. Google Cloud Console → Credenciais
2. Edite app OAuth
3. Em "URIs autorizados de redirecionamento", adicione:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://staging.markdown-studio.app/api/auth/callback/google` (staging)
   - `https://markdown-studio.app/api/auth/callback/google` (prod)
4. Salve
5. Restart

### ❌ Erro: "Session not persisting"

**Causa**: NEXTAUTH_SECRET diferente entre deploys

**Solução**:
1. Use o MESMO secret em todos os servers
2. Verifique em Vercel → Settings
3. Redeploy

---

## Exemplo: Fluxo Completo

### 1️⃣ Desenvolvimento Local

```bash
# Gere secret
openssl rand -base64 32
# Output: K4kZpL9mN2vQ5xY7aB3cD6eF8gH1jK4l+M7nO9pQ2rS5t=

# Crie .env.local
cat > .env.local << 'EOF'
NEXTAUTH_SECRET=K4kZpL9mN2vQ5xY7aB3cD6eF8gH1jK4l+M7nO9pQ2rS5t=
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrst1234567890
EOF

# Inicie
npm run dev
```

### 2️⃣ Deploy Vercel

```bash
# 1. Push para main
git add .
git commit -m "feat: auth system"
git push origin main

# 2. Vercel detects e começa deployment
# (veja em Dashboard)

# 3. Configure Environment Variables
# Dashboard → Settings → Environment Variables
# Adicione as 4 variables

# 4. Vercel redeploya automaticamente
# (agora com as env vars corretas)

# 5. Teste no link de produção
# https://seu-projeto.vercel.app
```

---

## Best Practices

✅ **DO**
- Use secrets gerados aleatoriamente
- Diferentes secrets por ambiente
- Armazene em password manager corporativo
- Rotacione regularmente (trimestral)
- Revogue imediatamente se vazar
- Use HTTPS em produção
- Monitore logs de acesso

❌ **DON'T**
- Nunca commit .env.local
- Nunca coloque secrets em código
- Nunca compartilhe via Slack/Email
- Nunca reutilize secrets
- Nunca use mesmo secret em dev/prod
- Nunca ignore avisos de segurança

---

## Recursos Úteis

- [NextAuth.js Docs](https://next-auth.js.org)
- [Google Cloud Console](https://console.cloud.google.com)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [Vercel Secrets](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Segurança em primeiro lugar! 🔒**
