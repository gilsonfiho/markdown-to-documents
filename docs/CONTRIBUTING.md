# Contribuindo - Markdown Studio

## 👋 Bem-vindo!

Este documento descreve como contribuir para o projeto Markdown Studio. Leia as instruções abaixo antes de começar a trabalhar.

## 📋 Pré-requisitos

- Node.js 18+
- Git
- Conta Google (para OAuth durante testes)
- Familiaridade com Next.js 16, React 19, TypeScript

## 🚀 Configuração Inicial

### 1. Clonar e Instalar

```bash
git clone <repositório>
cd markdown-studio-completo/markdown-to-docx
npm install
```

### 2. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env.local

# Editar com seus valores
nano .env.local
```

**Variáveis obrigatórias:**
```env
NEXTAUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_CLIENT_SECRET=seu-google-client-secret
```

### 3. Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

Abrir http://localhost:3000 no navegador.

---

## 🏗️ Padrões de Desenvolvimento

### 1. Estrutura de Componentes

Todos os componentes React são `'use client'` (Client Components):

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAppStore } from '@/lib/store';

interface MinhaComponenteProps {
  titulo: string;
  onClick?: () => void;
}

export const MinhaComponente: React.FC<MinhaComponenteProps> = ({ titulo, onClick }) => {
  const { data: session } = useSession();
  const { abaAtiva, abas } = useAppStore();
  const [estado, setEstado] = useState(false);

  useEffect(() => {
    // Efeitos aqui
  }, [abaAtiva]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{titulo}</h1>
      {/* JSX */}
    </div>
  );
};
```

### 2. Usar TypeScript Strict

Sempre usar tipos explícitos:

```typescript
// ❌ Ruim
const handleClick = (e) => {
  const value = e.target.value;
};

// ✅ Bom
const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value: string = e.currentTarget.value;
};
```

### 3. Zustand Store Pattern

Acessar estado global corretamente:

```typescript
// ✅ Padrão correto
const { abaAtiva, atualizarAba, salvarNoStorage } = useAppStore();

// Atualizar estado
atualizarAba(abaAtiva, novoConteudo);

// Persistir
salvarNoStorage(abaAtiva);
```

### 4. Nomes em Português

Conforme instruções globais, usar português para nomes de funções e variáveis:

```typescript
// ✅ Correto (português)
const obterAbas = (): AbaData[] => { /* ... */ };
const renderizarEditor = () => { /* ... */ };

// ❌ Evitar (inglês)
const getAbas = (): AbaData[] => { /* ... */ };
const renderEditor = () => { /* ... */ };
```

### 5. Comentários e Documentação

Documentação só quando solicitado com `/doc` ou `/documentação`:

```typescript
// ✅ Sem comentários desnecessários (padrão)
const atualizarAba = (id: string, conteudo: string) => {
  // lógica
};

// ✅ Com documentação quando solicitado
/**
 * Atualiza o conteúdo de uma aba específica
 *
 * @param id ID único da aba
 * @param conteudo Novo conteúdo markdown
 */
const atualizarAba = (id: string, conteudo: string) => {
  // lógica
};
```

### 6. Tratamento de Erros

Sempre validar e tratar erros:

```typescript
// ✅ Com tratamento
try {
  const resultado = await markdownToDocx(conteudo, nome);
  if (resultado.sucesso) {
    // sucesso
  }
} catch (erro) {
  console.error('Erro ao exportar:', erro);
  mostrarToast('Erro ao exportar documento', 'erro');
}

// ❌ Sem tratamento
const resultado = await markdownToDocx(conteudo, nome);
```

### 7. Tailwind CSS

Usar utility classes. Evitar CSS customizado:

```typescript
// ✅ Tailwind utilities
<div className="flex gap-4 p-4 rounded-lg bg-neutral-100 border border-neutral-300">
  {/* conteúdo */}
</div>

// ❌ CSS customizado (evitar)
<div style={{ display: 'flex', gap: '1rem', /* ... */ }}>
  {/* conteúdo */}
</div>
```

### 8. Animações com Framer Motion

Padrão para animações:

```typescript
import { motion } from 'framer-motion';

export const MeuComponente = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4"
    >
      Conteúdo animado
    </motion.div>
  );
};
```

---

## 🧪 Testes

### Executar Testes

```bash
npm run test              # Uma vez
npm run test:watch       # Modo watch
npm run test:coverage    # Com cobertura
```

### Padrão de Teste para Store Zustand

```typescript
import { useAppStore } from '@/lib/store';

describe('useAppStore', () => {
  beforeEach(() => {
    const { fecharTodasAsAbas } = useAppStore.getState();
    fecharTodasAsAbas(); // Reset antes de cada teste
  });

  it('deve adicionar uma nova aba', () => {
    const { adicionarAba, abas } = useAppStore.getState();
    const abasAntes = abas.length;

    adicionarAba();

    const { abas: abasDepois } = useAppStore.getState();
    expect(abasDepois.length).toBe(abasAntes + 1);
  });
});
```

### Padrão de Teste para Componentes

```typescript
import { render, screen } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { MeuComponente } from '@/components/MeuComponente';

const mockSession = {
  user: { name: 'Test User', email: 'test@example.com' },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

describe('MeuComponente', () => {
  it('deve renderizar título corretamente', () => {
    render(
      <SessionProvider session={mockSession}>
        <MeuComponente titulo="Teste" />
      </SessionProvider>,
    );

    expect(screen.getByText('Teste')).toBeInTheDocument();
  });
});
```

---

## 🎯 Adicionando Novas Funcionalidades

### Adicionar Plugin Remark

**Exemplo: Adicionar `remark-slug`**

1. **Instalar:**
```bash
npm install remark-slug
```

2. **Importar em `MarkdownPreview.tsx`:**
```typescript
import remarkSlug from 'remark-slug';

const remarkPlugins = [
  remarkGfm,
  remarkBreaks,
  remarkEmoji,
  [remarkSlug, {}],  // ← Novo plugin
  remarkToc,
  remarkMath,
];
```

3. **Testar:**
```markdown
# Meu Heading

Renderiza como:
<h1 id="meu-heading">Meu Heading</h1>
```

### Estender o Sistema de Abas

**Exemplo: Adicionar campo `tags` a cada aba**

1. **Atualizar interface em `lib/store.ts`:**
```typescript
interface AbaData {
  id: string;
  nome: string;
  conteudo: string;
  salvoAoMemento: string | null;
  tags: string[];  // ← Novo campo
}
```

2. **Atualizar inicialização:**
```typescript
const MARKDOWN_PADRAO: AbaData = {
  id: gerarIdUnico(),
  nome: 'Documento 1',
  conteudo: '',
  salvoAoMemento: null,
  tags: [],  // ← Inicializar
};
```

3. **Adicionar ação no store:**
```typescript
adicionarTag: (abaId: string, tag: string) => {
  set(state => ({
    abas: state.abas.map(aba =>
      aba.id === abaId
        ? { ...aba, tags: [...new Set([...aba.tags, tag])] }
        : aba
    ),
  }));
},
```

4. **Usar em componente:**
```typescript
const { abas, adicionarTag } = useAppStore();
const aba = abas.find(a => a.id === abaAtiva);

const handleAddTag = (tag: string) => {
  adicionarTag(abaAtiva, tag);
  salvarNoStorage(abaAtiva);
};
```

### Adicionar Nova Rota API

**Exemplo: Endpoint para validar markdown**

1. **Criar `app/api/validar-markdown/route.ts`:**
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { conteudo } = await req.json();

    if (!conteudo) {
      return NextResponse.json(
        { valido: false, erro: 'Conteúdo vazio' },
        { status: 400 }
      );
    }

    // Validar markdown
    const erros = validarMarkdown(conteudo);

    return NextResponse.json({
      valido: erros.length === 0,
      erros,
    });
  } catch (erro) {
    return NextResponse.json(
      { valido: false, erro: (erro as Error).message },
      { status: 500 }
    );
  }
}

function validarMarkdown(conteudo: string): string[] {
  const erros: string[] = [];

  // Validar sintaxe
  if (conteudo.match(/```[^`]+$/)) {
    erros.push('Code block não fechado');
  }

  return erros;
}
```

2. **Usar em componente:**
```typescript
const handleValidar = async () => {
  const resposta = await fetch('/api/validar-markdown', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conteudo }),
  });

  const dados = await resposta.json();
  if (!dados.valido) {
    console.error('Erros:', dados.erros);
  }
};
```

---

## 🔍 Linting e Formatação

### Verificar Qualidade do Código

```bash
npm run lint           # Detectar problemas
npm run lint:fix      # Corrigir automaticamente
npm run format:check  # Verificar formatação
npm run format        # Formatar com Prettier
```

### Regras ESLint Importantes

```javascript
// .eslintrc.cjs
{
  rules: {
    '@typescript-eslint/no-explicit-any': ['off'],  // Permitido em react-markdown
    '@typescript-eslint/no-unused-vars': ['warn'],
    'react/react-in-jsx-scope': 'off',              // React 19
    'prettier/prettier': 'error',                    // Integração Prettier
  }
}
```

---

## 📝 Git Workflow

### 1. Criar Branch

```bash
# Para nova feature
git checkout -b feature/nome-descritivo

# Para bug fix
git checkout -b fix/descricao-do-bug

# Exemplo:
git checkout -b feature/adicionar-filtro-abas
```

### 2. Fazer Commits

```bash
# Commits pequenos e focados
git add componente.tsx
git commit -m "Adicionar validação de entrada"

git add lib/store.ts
git commit -m "Estender store com novo campo"
```

### 3. Antes de Push

```bash
# Verificar qualidade
npm run lint:fix
npm run format
npm run test

# Build sem erros
npm run build

# Verificar commits
git log --oneline origin/main..HEAD
```

### 4. Criar Pull Request

```bash
# Push do branch
git push origin feature/nome-descritivo

# No GitHub: Criar PR com descrição detalhada
```

**Descrição de PR deve incluir:**
- O que foi alterado
- Por que foi alterado
- Como testar
- Checklist de testes (npm run test, npm run build, etc.)

---

## 🔐 Segurança

### Boas Práticas

1. **Nunca commitar `.env.local`:**
```bash
# Já ignorado em .gitignore
echo ".env.local" >> .gitignore
```

2. **Validar inputs em API routes:**
```typescript
// ✅ Validar
const { conteudo } = await req.json();
if (!conteudo || typeof conteudo !== 'string') {
  return NextResponse.json({ erro: 'Inválido' }, { status: 400 });
}
```

3. **Usar NextAuth para proteção:**
```typescript
// ✅ Validar sessão em API route
const session = await getServerSession(authOptions);
if (!session?.user) {
  return NextResponse.json({ erro: 'Não autenticado' }, { status: 401 });
}
```

4. **Sanitizar inputs user-facing:**
```typescript
// Markdown é escapado por ReactMarkdown
// Evitar dangerouslySetInnerHTML
```

---

## 📚 Referências de Arquitetura

Antes de começar, ler:
- `docs/ARCHITECTURE.md` — Fluxo de dados
- `docs/REMARK_PLUGINS.md` — Plugins de markdown
- `.github/copilot-instructions.md` — Padrões do projeto

---

## 🤝 Revisão de Código

### O que Esperar em Code Review

- ✅ Tipagem TypeScript correta
- ✅ Testes passando
- ✅ Sem ESLint warnings
- ✅ Padrões do projeto seguidos
- ✅ Nomes em português (conforme instruções)
- ✅ Comentários apenas quando solicitado

### Como Responder Feedback

1. Ler comentário com atenção
2. Fazer alterações
3. Responder comentário explicando mudança
4. Re-request review

---

## 🚀 Deploy

### Vercel (Recomendado)

1. Push para main
2. Vercel detecta automaticamente
3. Variáveis de ambiente em Project Settings:
   - `NEXTAUTH_SECRET` (novo valor para produção)
   - `NEXTAUTH_URL` (seu domínio)
   - `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`

4. Verificar em https://seu-dominio.com

---

## 📞 Suporte

### Dúvidas?

- Ler `docs/TROUBLESHOOTING.md` para problemas comuns
- Verificar issues existentes no GitHub
- Abrir nova issue com contexto detalhado

---

## ✅ Checklist Final Antes de Submeter PR

- [ ] Branch criada de `main`
- [ ] Código segue padrões do projeto
- [ ] `npm run lint:fix` executado
- [ ] `npm run format` executado
- [ ] `npm run test` passa
- [ ] `npm run build` sem erros
- [ ] Novos testes adicionados (se aplicável)
- [ ] Documentação atualizada (se aplicável)
- [ ] Commit messages descritivas
- [ ] PR description preenchida
- [ ] Nenhum console.log deixado
- [ ] Nenhum `any` desnecessário

---

Obrigado por contribuir! 🎉

