# Copilot Instructions Update Summary

**Date**: March 2, 2026  
**Version**: Updated for Markdown Studio v1.0.18  
**File**: `.github/copilot-instructions.md`

## 📝 Mudanças Realizadas

### 1. **Corrigidas Informações sobre Componentes React** ✅

- Atualizado exemplo de `useAppStore` para refletir uso real: `{ abas, abaAtiva, salvarNoStorage }`
- Adicionada seção **"Renderização Condicional com Preview Toggle"** explicando as funções `mostrarPreview` e `toggleMostrarPreview()`
- Documentadas propriedades completas do Zustand store: `setMostrarPreview()` e `toggleMostrarPreview()`

### 2. **Expandida Documentação do Zustand Store** ✅

- Adicionadas propriedades faltantes na interface `AppStore`:
  - `mostrarPreview: boolean` — Controla visibilidade do preview
  - `textoSelecionado: string` — Rastreamento de seleção
  - `setMostrarPreview()` e `toggleMostrarPreview()` — Funções para toggle

### 3. **Corrigida Configuração Prettier** ✅

- **Antes**: `printWidth: 100`
- **Depois**: `printWidth: 250` (valor real usado no projeto)

### 4. **Adicionada Seção Completa de Testes** 🧪

Novo conteúdo em `## 🧪 Padrões de Testes (Jest + React Testing Library)`:

#### a) Configuração Jest

- Explicação sobre `jest-environment-jsdom`
- Path mapping `@/`
- Setup file e padrões de testes
- Coverage excludes

#### b) Estrutura de Testes para Zustand Store

- Padrão `useAppStore.getState()` para testes sem componentes
- Exemplos completos de testes de abas:
  - Adicionar aba
  - Atualizar conteúdo
  - Manter mínimo 1 aba
  - Reset state

#### c) Estrutura de Testes para Componentes

- Padrão com `render()` do React Testing Library
- Mock de sessão NextAuth
- Exemplo funcional completo

#### d) Scripts de Teste

- `npm run test` — Executar testes
- `npm run test:watch` — Modo watch
- `npm run test:coverage` — Coverage report

### 5. **Documentação Detalhada dos Remark Plugins** 📚

Expandida seção "Renderização de Diagramas Mermaid e Plugins Remark":

- **`remarkGfm`** 4.0.0 — GFM, tabelas, strikethrough
- **`remarkBreaks`** 4.0.0 — Quebras de linha em `<br>`
- **`remarkEmoji`** 5.0.2 — Emojis markdown (`:smile:` → 😄)
- **`remarkToc`** 9.0.0 — Tabela de conteúdos automática
- **`remarkMath`** 6.0.0 — Equações matemáticas (`$$..$$`)
- **`rehypeKatex`** 7.0.1 — Renderização KaTeX com CSS obrigatório

### 6. **Melhorado Debug Comum** 🐛

Expandidas seções de troubleshooting:

**Novos itens adicionados**:

- `"Jest test fails com 'module is not defined'"` — Explicação sobre ES modules em `jest.config.js`
- `"ReferenceError: localStorage is not defined"` — SSR safety check
- `"Plugins remark não funcionam"` — Ordem dos plugins importa!
- `"KaTeX não renderiza"` — Necessário import CSS

**Melhorias**:

- Adicionados contextos específicos (ex: "verificar localStorage em DevTools")
- Links diretos para recursos ([mermaid.live](https://mermaid.live))
- Dicas de como gerar `NEXTAUTH_SECRET`

### 7. **Detalhes sobre NextAuth.js adicionados** 🔐

Mantida documentação sobre:

- Google OAuth com `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`
- Callback em `/api/auth/callback/google`
- SessionProvider em `Providers.tsx`
- Hook `useSession()` para acesso em componentes

## 📊 Cobertura de Documentação

### O que está documentado:

✅ **Arquitetura**

- Sistema de abas com Zustand
- Fluxo de dados completo
- Componentes principais
- Persistência localStorage

✅ **Padrões de Código**

- Estrutura de componentes client
- Preview toggle
- Animações Framer Motion
- Custom ReactMarkdown handlers

✅ **Autenticação**

- NextAuth.js configuração
- Google OAuth flow
- Session management

✅ **Estado Global (Zustand)**

- Interface AppStore completa
- Padrões de uso por componente
- Chaves localStorage

✅ **Testes (Jest + RTL)**

- Configuração e setup
- Testes de store (Zustand)
- Testes de componentes
- Scripts disponíveis

✅ **Ferramentas de Desenvolvimento**

- ESLint configuração
- Prettier configuração (atualizado)
- Scripts npm
- Debugging comum

✅ **Markdown e Export**

- Conversão markdown → DOCX
- Suporte GFM
- Formatação inline
- Estruturas ASCII
- Diagramas Mermaid
- Equações LaTeX/KaTeX

✅ **Padrões Específicos**

- Header component
- MarkdownEditor component
- TabsBar component
- Page component com proteção

## 🔍 Validações Realizadas

- ✅ Verificado `lib/store.ts` — todas as funções documentadas
- ✅ Verificado `package.json` — versões sincronizadas
- ✅ Verificado `.prettierrc.cjs` — printWidth = 250 (corrigido)
- ✅ Verificado `.eslintrc.cjs` — regras listadas com precisão
- ✅ Verificado `jest.config.js` — nota sobre ES modules adicionada
- ✅ Verificado `__tests__/lib/store.test.ts` — padrões refletidos
- ✅ Verificado `components/MarkdownPreview.tsx` — plugins listados
- ✅ Verificado `app/page.tsx` — fluxo de autenticação confirmado

## 💡 Recomendações para AI Agents

### Para desenvolver novas funcionalidades:

1. **Sempre usar `'use client'`** em componentes que usam hooks
2. **Acessar store com**: `const { abas, abaAtiva } = useAppStore();`
3. **Para testes**: Usar `useAppStore.getState()` para não precisar de componentes wrapper
4. **Para export DOCX**: Verificar `lib/markdown-to-docx.ts` — usar `Paragraph` com marcadores, não `ListItem`
5. **Para diagramas**: Ordem dos plugins Remark importa! `[remarkGfm, remarkBreaks, remarkEmoji, remarkToc, remarkMath]`
6. **Para localStorage**: Sempre check `typeof window !== 'undefined'` (SSR safety)

### Para debugging:

1. Verificar localStorage em DevTools → Application → Storage
2. Testar sintaxe Mermaid em [mermaid.live](https://mermaid.live) antes de integrar
3. Rodar `npm run test:watch` durante desenvolvimento
4. Usar `npm run lint:fix` para corrigir automaticamente

## 📌 Próximos Passos (Opcional)

Se desejar aprimoramentos futuros:

1. Adicionar exemplos de **implementação de novos plugins remark**
2. Documentar **padrões de performance** (lazy loading de componentes)
3. Adicionar **guia de contribuição** para novos agentes AI
4. Criar **troubleshooting interativo** com flowchart
5. Documentar **processo de release** e versionamento

---

**Versão do Documento**: 1.0  
**Compatível com**: Markdown Studio v1.0.18+  
**Framework**: Next.js 16.1.6, React 19.0.0, Zustand 4.4.0
