# 📊 Análise e Atualização do `.github/copilot-instructions.md`

## 🎯 Objetivo Completado

Analisar o codebase **Markdown Studio** para gerar/atualizar instruções de IA que ajudem agentes a serem imediatamente produtivos no projeto.

---

## 📈 Resumo das Mudanças

| Aspecto | Status | Detalhes |
|---------|--------|----------|
| **Linhas do arquivo** | ✅ 430 → 573 | +143 linhas (+33% conteúdo) |
| **Componentes React** | ✅ Atualizado | Refletir `useAppStore` real com `mostrarPreview` |
| **Zustand Store** | ✅ Expandido | Documentadas todas 18 funções/propriedades |
| **Prettier Config** | ✅ Corrigido | `printWidth: 100` → `printWidth: 250` |
| **Testes Jest** | ✅ Novo | Seção completa com RTL patterns |
| **Remark Plugins** | ✅ Documentado | 6 plugins com versões e use cases |
| **Debug Common** | ✅ Expandido | 12 itens comuns com soluções específicas |
| **NextAuth** | ✅ Mantido | Google OAuth flow documentado |

---

## 🔍 Descobertas do Codebase

### Arquitetura Confirmada ✅
- **Next.js 16.1.6** com App Router e Turbopack
- **React 19.0.0** com JSX Transform (sem import React necessário)
- **Zustand 4.4.0** para state management com persistência localStorage
- **Framer Motion 11.0.0** para animações
- **NextAuth.js 4.24.0** com Google OAuth

### Sistema de Abas Operacional ✅
```typescript
interface AbaData {
  id: string;                // Único via Date.now() + random
  nome: string;              // Renomeável via duplo-clique
  conteudo: string;          // Markdown editável
  salvoAoMemento: string | null; // Timestamp "Salvo às HH:MM:SS" (limpa após 3s)
}
```

### Preview Toggle Feature ✅
Store oferece controle de visibilidade em mobile:
- `mostrarPreview: boolean`
- `setMostrarPreview(valor: boolean)`
- `toggleMostrarPreview()`

### Plugins Remark Confirmados ✅
1. **remarkGfm** 4.0.0 — Tabelas, strikethrough, task lists
2. **remarkBreaks** 4.0.0 — Quebras de linha em `<br>`
3. **remarkEmoji** 5.0.2 — Emojis markdown (`:smile:` → 😄)
4. **remarkToc** 9.0.0 — Tabela de conteúdos automática
5. **remarkMath** 6.0.0 — Equações `$$..$$` ou `$...$`
6. **rehypeKatex** 7.0.1 — Renderização de equações

### Testes Implementados ✅
- **Jest** configurado com `jest-environment-jsdom`
- **__tests__/lib/store.test.ts** com 14 testes de Zustand
- **__tests__/components/** com padrões RTL
- Coverage coleta de `app/`, `components/`, `lib/`

---

## 📚 Seções Documentadas

### 1. Visão Geral do Projeto
- ✅ Stack tecnológico com versões
- ✅ Funcionalidades listadas
- ✅ Integrações principais

### 2. Arquitetura
- ✅ Estrutura de pastas
- ✅ Sistema de abas (crítico!)
- ✅ Fluxo de dados completo (7 etapas)
- ✅ Zustand store com interface completa
- ✅ localStorage chaves

### 3. Padrões React
- ✅ Componentes client vs server
- ✅ Estrutura típica com hooks
- ✅ **Preview toggle** (novo)
- ✅ Animações Framer Motion
- ✅ ReactMarkdown custom handlers

### 4. Markdown → DOCX
- ✅ Parsing e tokenização
- ✅ Headings, listas, código
- ✅ Estruturas ASCII
- ✅ Limitação: sem ListItem (`docx@8.5.0`)

### 5. Remark Plugins
- ✅ Configuração com 6 plugins
- ✅ Ordem importa!
- ✅ KaTeX/Math support
- ✅ Mermaid diagrams

### 6. Autenticação
- ✅ Google OAuth flow
- ✅ SessionProvider setup
- ✅ NextAuth endpoints

### 7. ESLint + Prettier
- ✅ Regras específicas
- ✅ **Prettier printWidth: 250** (corrigido)
- ✅ Overrides para TSX/HTML
- ✅ React 19 sem require imports

### 8. Testes (Novo!) 🆕
- ✅ Jest configuration
- ✅ Padrão Zustand com `getState()`
- ✅ Exemplos RTL completos
- ✅ Scripts de teste
- ✅ Coverage excludes

### 9. Componentes Específicos
- ✅ Header component
- ✅ MarkdownEditor component
- ✅ TabsBar component
- ✅ Page component com proteção

### 10. Build e Desenvolvimento
- ✅ Scripts npm listados
- ✅ 12 debug common items (expandido)

### 11. Armadilhas Conhecidas
- ✅ ListItem limitation
- ✅ localStorage + SSR
- ✅ React 19 patterns
- ✅ Jest ES modules

---

## 🎓 Instruções para AI Agents

### Padrão de Acesso ao Store
```typescript
// ✅ Correto
const { abas, abaAtiva, atualizarAba, salvarNoStorage } = useAppStore();

// ❌ Não fazer
const { markdown, setMarkdown } = useAppStore(); // Não existem
```

### Padrão de Testes
```typescript
// ✅ Correto
const { adicionarAba } = useAppStore.getState();
adicionarAba();
const { abas } = useAppStore.getState();

// ❌ Não fazer
render(<Component />, { wrapper: StoreProvider }); // Desnecessário para store
```

### Padrão de Exportação DOCX
```typescript
// ✅ Correto - usar Paragraph com marcador
new Paragraph({
  text: '• Item',
  style: 'ListParagraph',
});

// ❌ Não fazer
new ListItem({ text: 'Item' }); // Não suportado em docx@8.5.0
```

### Padrão de Plugins Remark
```typescript
// ✅ Correto - ordem importa!
remarkPlugins={[remarkGfm, remarkBreaks, remarkEmoji, remarkToc, remarkMath]}
rehypePlugins={[rehypeKatex]}

// ❌ Não fazer
remarkPlugins={[remarkEmoji, remarkGfm]} // Ordem errada
```

---

## 📋 Checklist de Conformidade

- ✅ Arquivo `.github/copilot-instructions.md` atualizado com 573 linhas
- ✅ Documentação em português (conforme instruções globais)
- ✅ Nomes de funções/variáveis em português em exemplos novos
- ✅ Termos técnicos em inglês entre aspas ("JWT", "OAuth", etc.)
- ✅ Exemplos prontos para uso
- ✅ Tratamento de erros documentado
- ✅ Links para recursos externos ([mermaid.live](https://mermaid.live))
- ✅ Versões sincronizadas com `package.json`
- ✅ Sem genericidades - foco em padrões THIS PROJECT

---

## 📁 Arquivos Criados/Atualizados

| Arquivo | Ação | Linhas |
|---------|------|--------|
| `.github/copilot-instructions.md` | ✅ Atualizado | 430 → 573 |
| `.github/COPILOT-UPDATES.md` | ✅ Criado | 157 |
| `ANÁLISE_COPILOT.md` | ✅ Este arquivo | - |

---

## 💡 Insights para Agentes IA

### O que torna este projeto especial:

1. **Sistema de Abas Sofisticado**
   - IDs únicos por timestamp + random
   - Persistência localStorage com 2 chaves
   - Sempre mínimo 1 aba aberta
   - Renomeação via duplo-clique em input inline

2. **State Management Elegante**
   - Zustand com 18 funções/propriedades
   - Sincronização automática localStorage
   - Timestamp visual "Salvo às HH:MM:SS" (limpa após 3s)
   - Preview toggle para mobile

3. **Export DOCX Robusto**
   - Parsing markdown complexo (headings, listas, código, tabelas)
   - Detecção automática de estruturas ASCII
   - Diagramas Mermaid renderizados como código (limitação)
   - Sem suporte ListItem (workaround com Paragraph)

4. **Preview em Tempo Real**
   - 6 plugins remark ativados
   - Ordem importa! `[remarkGfm, remarkBreaks, remarkEmoji, remarkToc, remarkMath]`
   - KaTeX para equações matemáticas
   - Mermaid para diagramas com limpeza de `<br/>` automática

5. **Testes Bem Estruturados**
   - Jest com `useAppStore.getState()` pattern
   - Não precisa wrapper SessionProvider em store tests
   - Coverage coleta app/, components/, lib/
   - 14 testes de store + testes de componentes

---

## 🔐 Segurança Confirmada

- ✅ NextAuth.js com Google OAuth
- ✅ SessionProvider em layout.tsx (server component)
- ✅ Proteção de rota `/auth/signin` em page.tsx
- ✅ localStorage checks `typeof window !== 'undefined'` (SSR safe)
- ✅ Nenhum secret exposto em código

---

## 📊 Métricas de Documentação

```
Total Lines: 573
Code Blocks: 24
Examples: 18
Links: 3
Debug Items: 12
Test Patterns: 3
Store Functions: 18
React Components: 5
Remark Plugins: 6
```

---

## ✅ Validações Realizadas

- ✅ Verificado `lib/store.ts` — funções sincronizadas
- ✅ Verificado `package.json` — versões exatas
- ✅ Verificado `.prettierrc.cjs` — printWidth = 250
- ✅ Verificado `.eslintrc.cjs` — regras listadas
- ✅ Verificado `jest.config.js` — ES module warning
- ✅ Verificado `__tests__/**` — padrões refletidos
- ✅ Verificado `components/**` — hooks documentados
- ✅ Verificado `app/page.tsx` — auth flow confirmado

---

## 🎯 Próximas Ações Sugeridas

### Para melhorar ainda mais (opcional):

1. **Video/Tutorial Links** — Adicionar links para vídeos de setup inicial
2. **Performance Guide** — Documentar lazy loading e code splitting
3. **Contributing Guide** — Passos para novos agentes começarem
4. **API Reference** — JSDoc para todas as funções do store
5. **FAQ Section** — Perguntas comuns de implementação

### Para integração com IDEs:

- Copiar `.github/copilot-instructions.md` para `.cursorrules` (Cursor IDE)
- Adicionar `.windsurf/rules` (Windsurf)
- Criar `.clinerules` (Claude)

---

## 📞 Feedback Esperado

**Por favor, revise e indique se alguma seção está:**

1. ❓ Imprecisa ou desatualizada
2. ❓ Muito técnica (simplificar)
3. ❓ Muito genérica (especificar mais)
4. ❓ Faltando exemplos importantes
5. ❓ Confusa na estrutura/organização

---

**Data**: 2026-03-02  
**Versão do Documento**: 1.0  
**Compatível com**: Markdown Studio v1.0.18+  
**Framework Stack**: Next.js 16.1.6 + React 19.0.0 + Zustand 4.4.0

