# 💡 Exemplos de Uso - Markdown Studio

## 1. Documento Profissional

### Input Markdown:

```markdown
# Relatório Mensal - Janeiro 2025

## Resumo Executivo

Este relatório apresenta os resultados de **janeiro de 2025**, com foco em:

1. Análise de performance
2. Métricas-chave
3. Recomendações

## Seção 1: Performance

### KPIs Atingidos

| Métrica   | Meta    | Realizado | Status |
| --------- | ------- | --------- | ------ |
| Receita   | R$ 100k | R$ 125k   | ✅     |
| Usuários  | 5k      | 7.2k      | ✅     |
| Conversão | 5%      | 6.2%      | ✅     |

### Detalhes

A performance foi **excepcional** este mês. Conseguimos ultrapassar as metas em _todas as métricas_.

#### Pontos Positivos

- Aumento de 44% na receita
- Crescimento de 44% em usuários
- Taxa de conversão acima do esperado

#### Desafios

- Infraestrutura precisou ser escalada
- Suporte ao cliente sobrecarregado

## Seção 2: Código

Implementamos a seguinte solução:

\`\`\`typescript
// Função de cálculo de ROI
function calculateROI(investment: number, revenue: number): number {
const profit = revenue - investment;
return (profit / investment) \* 100;
}

// Exemplo de uso
const roi = calculateROI(100000, 125000);
console.log(\`ROI: \${roi}%\`); // ROI: 25%
\`\`\`

## Conclusão

> "O sucesso não é final, o fracasso não é fatal. O que importa é a coragem de continuar."
> — Winston Churchill

Continuaremos com essa estratégia em **fevereiro**.

---

_Relatório preparado em 31 de janeiro de 2025_
```

### Output DOCX:

- Documento formatado com headings hierárquicos
- Tabela renderizada corretamente
- Código com destaque
- Citação formatada
- Linhas horizontais
- Tudo bem estruturado para impressão

---

## 2. Guia de Procedimentos

### Input Markdown:

```markdown
# Guia de Onboarding - Novos Desenvolvedores

## Bem-vindo! 👋

Este guia ajudará você a se integrar à equipe em **5 dias**.

## Dia 1: Setup

### Passo 1: Acesso aos Sistemas

- Solicit credenciais ao RH
- Configure autenticação 2FA
- Teste acesso ao GitHub

### Passo 2: Ambiente Local

\`\`\`bash

# Clone os repositórios

git clone https://github.com/company/backend.git
git clone https://github.com/company/frontend.git

# Instale dependências

cd backend && npm install
cd ../frontend && npm install

# Inicie servidores

npm run dev
\`\`\`

### Passo 3: Primeiros Commits

1. Crie branch: \`git checkout -b onboarding/seu-nome\`
2. Modifique arquivo README.md
3. Faça commit: \`git commit -m "docs: add nome to team"\`
4. Abra Pull Request

## Dia 2-5: Treinamento

**Importante**: Faça _muitas_ perguntas!

---

Dúvidas? Procure seu **mentor designado** ou abra uma issue.
```

### Output DOCX:

- Documento de procedimentos bem estruturado
- Instruções passo-a-passo
- Comandos destacados
- Totalmente imprimível para novos hires

---

## 3. Relatório Técnico

### Input Markdown:

```markdown
# Migração de Banco de Dados: MongoDB → PostgreSQL

## Contexto

A empresa está migrando de **MongoDB** para **PostgreSQL** devido a:

1. **Performance**: Queries SQL são 40% mais rápidas
2. **Conformidade**: GDPR requer garantias de ACID
3. **Custo**: PostgreSQL é open-source

## Timeline

| Fase            | Data            | Responsável  |
| --------------- | --------------- | ------------ |
| Planejamento    | 01-15 jan       | TechLead     |
| Desenvolvimento | 15 jan - 15 fev | Backend Team |
| Testes          | 15-28 fev       | QA + Backend |
| Migração        | 01 mar          | DevOps       |

## Riscos

### Alto Risco 🔴

- Downtime durante migração
- Perda de dados (mitigado com backup)

### Médio Risco 🟡

- Incompatibilidade de schemas
- Performance em queries complexas

### Baixo Risco 🟢

- Capacitação do time
- Documentação

## Solução

\`\`\`sql
-- Criar nova tabela em PostgreSQL
CREATE TABLE users (
id SERIAL PRIMARY KEY,
email VARCHAR(255) NOT NULL UNIQUE,
name VARCHAR(255) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices
CREATE INDEX idx_users_email ON users(email);
\`\`\`

## Conclusão

A migração é **essencial** e viável com as mitigações propostas.

Aprovado por: CTO
Data: 15 de janeiro de 2025
```

### Output DOCX:

- Relatório executivo formatado
- Tabela de timeline
- Code blocks SQL
- Emojis e formatação especial

---

## 4. Apresentação de Produto

### Input Markdown:

```markdown
# Markdown Studio - Apresentação

## O Problema

Profissionais e escritores precisam:

- **Editar** markdown
- **Visualizar** em tempo real
- **Exportar** para Word (.docx)

Atualmente, precisam usar _múltiplas ferramentas_.

## A Solução

**Markdown Studio** oferece:

✅ Editor split-view
✅ Preview em tempo real
✅ Exportação com um clique
✅ Login com Google
✅ Design minimalista

## Features

### 1. Editor Inteligente

- Suporte a markdown completo
- Syntax highlighting visual
- Tab support para indentação

### 2. Preview em Tempo Real

- Atualização instantânea
- Suporte a tabelas
- Syntax highlight para código

### 3. Exportação Smart

- Converte markdown para DOCX
- Preserva formatação
- Suporta imagens (future)

## Pricing

| Plano  | Preço   | Features               |
| ------ | ------- | ---------------------- |
| Grátis | $0/mês  | 5 exports/mês          |
| Pro    | $9/mês  | Exportações ilimitadas |
| Team   | $29/mês | Colaboração + API      |

## Roadmap

### Q1 2025 ✅

- [ ] MVP com autenticação
- [ ] Exportação DOCX
- [ ] Preview split-view

### Q2 2025

- [ ] Colaboração em tempo real
- [ ] Upload de imagens
- [ ] Histórico de versões

### Q3 2025

- [ ] API pública
- [ ] Integrações (Slack, Notion)
- [ ] Mobile app

> "Markdown Studio simplifica o workflow de criação de documentos."

---

Pronto para começar? [Clique aqui](https://markdown-studio.app)
```

### Output DOCX:

- Apresentação bem estruturada
- Tabela de pricing
- Roadmap visual
- CTA (call-to-action) destacado

---

## 5. Artigo / Blog Post

### Input Markdown:

```markdown
# As 5 Melhores Práticas de Markdown em 2025

## Introdução

O markdown se tornou a _linguagem de documentação_ padrão. Vamos explorar as melhores práticas atuais.

## 1. Use Headings Hierarquicamente

❌ **Errado**:
\`\`\`markdown

# Seção 1

## Subseção

# Seção 2 # Pulou nível!

\`\`\`

✅ **Correto**:
\`\`\`markdown

# Seção 1

## Subseção 1.1

### Subseção 1.1.1

## Subseção 1.2

\`\`\`

## 2. Use Listas Apropriadamente

### Listas não-ordenadas

- Use quando ordem não importa
- Mais **fluidas** visualmente
- Melhor para bullets

### Listas ordenadas

1. Use quando ordem **importa**
2. Procedimentos passo-a-passo
3. Mais estruturado

## 3. Código é Essencial

Sempre use code blocks com linguagem:

\`\`\`python

# ✅ Com linguagem

def hello():
return "Hello, World!"
\`\`\`

\`\`\`

# ❌ Sem linguagem

def hello():
return "Hello, World!"
\`\`\`

## 4. Tabelas para Dados

| Prática  | Benefício       | Dificuldade |
| -------- | --------------- | ----------- |
| Headings | Estrutura       | Baixa       |
| Listas   | Legibilidade    | Baixa       |
| Tabelas  | Dados tabulares | Média       |
| Código   | Exemplos        | Alta        |

## 5. Quebras Visuais

Use linhas horizontais para separar seções:

---

Assim você melhora a **legibilidade**.

## Conclusão

Markdown é **poderoso** quando bem utilizado. Práticas consistentes resulta em documentação melhor.

Comece hoje mesmo com **Markdown Studio**! 🚀

---

_Artigo por: Dev Senior_
_Data: 15 de janeiro de 2025_
```

### Output DOCX:

- Artigo bem formatado
- Exemplos de código lado a lado
- Emojis destacados
- Tabela comparativa
- Totalmente pronto para publicação

---

## 6. Template: Spec Técnico

### Input Markdown:

```markdown
# Technical Specification: Auth v2

## Overview

Upgrade do sistema de autenticação para suportar **OAuth2**, **MFA** e **SAML**.

## Requirements

### Funcional

- [ ] Suporte OAuth2 (Google, GitHub, Microsoft)
- [ ] MFA via SMS e TOTP
- [ ] Persistência de sessão
- [ ] Logout em todos os dispositivos

### Não-Funcional

- Response time < 200ms
- 99.99% uptime
- Suporte a 10k concurrent users

## Architecture

\`\`\`
┌─────────────┐
│ Frontend │
└──────┬──────┘
│ /api/auth
▼
┌─────────────────┐
│ Auth Service │
│ (Node.js) │
└──────┬──────────┘
│
├─► OAuth Provider
├─► Database
└─► Cache (Redis)
\`\`\`

## Data Model

\`\`\`sql
CREATE TABLE auth_sessions (
id UUID PRIMARY KEY,
user_id INT NOT NULL,
provider VARCHAR(50),
token VARCHAR(500),
expires_at TIMESTAMP,
created_at TIMESTAMP
);
\`\`\`

## Testing Strategy

- Unit tests: 90% coverage
- Integration tests: Auth flow completo
- E2E tests: Selenium

## Timeline

| Milestone      | Data           |
| -------------- | -------------- |
| Design review  | 20 jan         |
| Implementation | 20-30 jan      |
| Testing        | 30 jan - 5 fev |
| Deployment     | 6 fev          |

## Sign-off

- [ ] Product Manager
- [ ] CTO
- [ ] Security Team
```

### Output DOCX:

- Documento técnico profissional
- Diagramas ASCII renderizados
- SQL code blocks
- Checklist
- Timeline clara

---

## 7. Tutoriais e How-To

### Input Markdown:

```markdown
# Como Criar um Blog com Next.js

## Objetivo

Criar um blog estático com **Next.js**, **MDX** e deploy no **Vercel**.

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conhecimento básico de React

## Passo 1: Setup Inicial

\`\`\`bash

# Crie novo projeto

npx create-next-app@latest blog --typescript

# Instale MDX

npm install @mdx-js/loader @mdx-js/react
\`\`\`

## Passo 2: Estrutura de Posts

\`\`\`
blog/
├── posts/
│ ├── primeiro-post.mdx
│ ├── segundo-post.mdx
│ └── index.ts
├── pages/
│ ├── blog/
│ │ └── [slug].tsx
│ └── index.tsx
└── lib/
└── posts.ts
\`\`\`

## Passo 3: Componente Post

\`\`\`typescript
export default function Post({ post }) {
return (

<article>
<h1>{post.title}</h1>
<p>{post.date}</p>
{post.content}
</article>
)
}
\`\`\`

## Resultado Final

Você terá um **blog profissional** com:

✅ Posts em MDX
✅ SEO otimizado
✅ Deploy automático
✅ Performance excelente

---

Parabéns! Seu blog está pronto. 🎉
```

### Output DOCX:

- Tutorial completo e seguível
- Código bem organizado
- Estrutura clara
- Pronto para impressão ou compartilhamento

---

## 8. Notas de Meeting

### Input Markdown:

```markdown
# Meeting Notes - Planejamento Q2

**Data**: 15 de janeiro de 2025
**Presentes**: TechLead, Product Manager, 3 Desenvolvedores
**Duração**: 1h

## Agenda

1. Resultados Q1
2. Prioridades Q2
3. Blockers atuais
4. Próximos passos

## Discussão

### Resultados Q1

✅ **Ótimo**: Atingimos 100% das features planejadas
⚠️ **Alerta**: Performance degradou 20% no final do quarter
🎯 **Oportunidade**: Refactoring do banco de dados

### Prioridades Q2

**Alta Prioridade**

1. Migração MongoDB → PostgreSQL
2. Implementar caching com Redis
3. Otimizar queries N+1

**Média Prioridade**

- Melhorar UI do dashboard
- Documentação técnica
- Automated testing

### Blockers

| Blocker         | Severidade | Owner   | ETA      |
| --------------- | ---------- | ------- | -------- |
| Acesso ao prod  | Alta       | DevOps  | Semana 1 |
| Licença Datadog | Média      | Finance | Semana 2 |
| Design specs    | Baixa      | Design  | Semana 3 |

### Action Items

- [ ] @tech-lead: Preparar design doc de migração DB (22 jan)
- [ ] @product: Priorizar features do roadmap (17 jan)
- [ ] @team: Revisar performance bottlenecks (20 jan)

## Próximas Reuniões

- Daily standup: Segunda-sexta, 10h
- Weekly retro: Sexta, 16h
- Next planning: 29 de janeiro

---

_Prepared by: Dev Senior_
_Distribuir para: @equipe-tech_
```

### Output DOCX:

- Notas bem estruturadas
- Action items claros
- Tabela de blockers
- Pronto para compartilhar

---

## 9. Documentation API (Readme)

### Input Markdown:

```markdown
# API Documentation

## Base URL

\`\`\`
https://api.markdown-studio.app/v1
\`\`\`

## Authentication

Todas as requests devem incluir header:

\`\`\`
Authorization: Bearer YOUR_API_TOKEN
\`\`\`

## Endpoints

### GET /documents

Lista todos os documentos do usuário.

**Request**:
\`\`\`bash
curl -H "Authorization: Bearer token" \
 https://api.markdown-studio.app/v1/documents
\`\`\`

**Response** (200):
\`\`\`json
{
"data": [
{
"id": "doc_123",
"title": "Meu Documento",
"created_at": "2025-01-15T10:30:00Z"
}
]
}
\`\`\`

### POST /documents/:id/export

Exporta documento para DOCX.

**Parameters**:
| Param | Type | Required |
|-------|------|----------|
| id | string | ✅ |
| format | string | ❌ (default: docx) |

**cURL Example**:
\`\`\`bash
curl -X POST \
 -H "Authorization: Bearer token" \
 https://api.markdown-studio.app/v1/documents/doc_123/export
\`\`\`

## Error Handling

**401 Unauthorized**:
\`\`\`json
{
"error": "Invalid or expired token"
}
\`\`\`

**404 Not Found**:
\`\`\`json
{
"error": "Document not found"
}
\`\`\`

---

Para mais informações, visite [docs.markdown-studio.app](https://docs.markdown-studio.app)
```

### Output DOCX:

- Documentação API bem estruturada
- Exemplos práticos
- Tabelas de parâmetros
- Pronto para desenvolvedores

---

## Dicas Extras

### ✨ Para melhor resultado DOCX:

1. **Mantenha hierarquia de headings** (# → ## → ###)
2. **Use listas ordenadas** quando ordem importa
3. **Use listas não-ordenadas** para items aleatórios
4. **Adicione quebras horizontais** entre seções
5. **Use `>` para citações** importantes
6. **Code blocks com linguagem** (`python, `bash)
7. **Tabelas** para dados estruturados
8. **Negrito/Itálico** para ênfase

### 🎯 Casos de Uso Ideais:

✅ Relatórios executivos
✅ Documentação técnica
✅ Guias de procedimentos
✅ Meeting notes
✅ Tutoriais
✅ Blog posts
✅ Especificações
✅ Proposal documents
✅ CVs/Currículos (com markdown simples)
✅ Newsletters

---

**Desenvolvido para profissionais que querem produtividade sem complicação.**
