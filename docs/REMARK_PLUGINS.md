# Plugins Remark - Markdown Studio

## 📚 Visão Geral dos Plugins

Os plugins remark são usados em `components/MarkdownPreview.tsx` para estender a funcionalidade de parsing e renderização de markdown. A **ordem dos plugins é crítica** — devem estar nesta sequência:

```typescript
const remarkPlugins = [
  remarkGfm,       // 1. GitHub Flavored Markdown
  remarkBreaks,    // 2. Quebras de linha simples
  remarkEmoji,     // 3. Suporte a emojis
  remarkToc,       // 4. Tabela de conteúdos
  remarkMath,      // 5. Equações matemáticas
];

const rehypePlugins = [
  [rehypeKatex, {}], // Renderização KaTeX
];
```

## 1️⃣ remarkGfm (4.0.0)

**Propósito:** Suporte para GitHub Flavored Markdown

**Funcionalidades:**
- Tabelas
- Strikethrough (`~~texto~~`)
- Task lists (`- [x] Tarefa completa`)
- Autolinks (`www.exemplo.com` → link)
- URLs de mídia (`![alt](url)` com validação)

### Exemplos

**Tabelas:**
```markdown
| Coluna 1 | Coluna 2 |
|----------|----------|
| Célula 1 | Célula 2 |
| Célula 3 | Célula 4 |
```

**Strikethrough:**
```markdown
~~Texto riscado~~
```

**Task Lists:**
```markdown
- [x] Tarefa completa
- [ ] Tarefa pendente
```

### Saída HTML

```html
<table>
  <thead>
    <tr>
      <th>Coluna 1</th>
      <th>Coluna 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Célula 1</td>
      <td>Célula 2</td>
    </tr>
  </tbody>
</table>

<del>Texto riscado</del>

<ul>
  <li><input type="checkbox" checked /> Tarefa completa</li>
  <li><input type="checkbox" /> Tarefa pendente</li>
</ul>
```

### Integração em DOCX

⚠️ **Limitação:** Tabelas em markdown são convertidas para `Table` em DOCX, mas task lists e strikethrough são renderizados como `Paragraph` com símbolos.

## 2️⃣ remarkBreaks (4.0.0)

**Propósito:** Converter quebras de linha simples (`\n`) em tags `<br/>`

**Por que é importante:**
- Markdown padrão ignora quebras de linha simples
- `remarkBreaks` permite quebras de linha sem precisar de duplos espaços ou `<br/>`

### Exemplos

**Sem remarkBreaks:**
```markdown
Linha 1
Linha 2
```

Renderiza como:
```html
<p>Linha 1 Linha 2</p>
```

**Com remarkBreaks:**
```markdown
Linha 1
Linha 2
```

Renderiza como:
```html
<p>Linha 1<br/>Linha 2</p>
```

### Casos de Uso

- Endereços com quebras de linha
- Poesia
- Listagens formatadas visualmente

## 3️⃣ remarkEmoji (5.0.2)

**Propósito:** Converter codes de emoji em caracteres reais

**Sintaxe:** `:nome-do-emoji:`

### Exemplos

| Código | Resultado | Código | Resultado |
|--------|-----------|--------|-----------|
| `:smile:` | 😄 | `:heart:` | ❤️ |
| `:rocket:` | 🚀 | `:star:` | ⭐ |
| `:thumbsup:` | 👍 | `:tada:` | 🎉 |
| `:bug:` | 🐛 | `:fire:` | 🔥 |
| `:warning:` | ⚠️ | `:check:` | ✅ |

### Markdown Completo

```markdown
# Bem-vindo! :wave:

Este projeto é :rocket: e :star: demais!

- :thumbsup: Ótimo
- :fire: Excelente
- :tada: Fantástico
```

### Saída HTML

```html
<h1>Bem-vindo! 👋</h1>
<p>Este projeto é 🚀 e ⭐ demais!</p>
<ul>
  <li>👍 Ótimo</li>
  <li>🔥 Excelente</li>
  <li>🎉 Fantástico</li>
</ul>
```

### Integração em DOCX

✅ Emojis são preservados naturalmente em DOCX (compatibilidade dependente do Word/versão)

## 4️⃣ remarkToc (9.0.0)

**Propósito:** Gerar tabela de conteúdos automática

**Acionador:** Inserir `## Table of Contents` no markdown

### Exemplos

**Markdown:**
```markdown
# Meu Documento

## Table of Contents

## Seção 1

### Subseção 1.1

## Seção 2

### Subseção 2.1

#### Subsubseção 2.1.1
```

**Saída HTML Gerada:**
```html
<h1>Meu Documento</h1>

<h2>Table of Contents</h2>
<ul>
  <li><a href="#seção-1">Seção 1</a>
    <ul>
      <li><a href="#subseção-11">Subseção 1.1</a></li>
    </ul>
  </li>
  <li><a href="#seção-2">Seção 2</a>
    <ul>
      <li><a href="#subseção-21">Subseção 2.1</a>
        <ul>
          <li><a href="#subsubseção-211">Subsubseção 2.1.1</a></li>
        </ul>
      </li>
    </ul>
  </li>
</ul>

<h2 id="seção-1">Seção 1</h2>
<!-- ... conteúdo ... -->
```

### Comportamento

- Scans todos os headings (`h2` e abaixo)
- Gera slugs automáticos (minúsculas, sem acentos)
- Cria links internos (anchor links)
- Respeita hierarquia de headings

### Integração em DOCX

⚠️ **Limitação:** Tabela de conteúdos é exportada como lista aninhada em DOCX. Anchors não funcionam em DOCX nativamente.

## 5️⃣ remarkMath (6.0.0) + rehypeKatex (7.0.1)

**Propósito:** Suporte para equações matemáticas via LaTeX

**Delimitadores:**

| Tipo | Exemplo | Saída |
|------|---------|-------|
| Inline | `$a + b = c$` | Fórmula inline |
| Display | `$$a^2 + b^2 = c^2$$` | Fórmula centrada |

### Exemplos

**Inline Math:**
```markdown
A fórmula de Pitágoras é $a^2 + b^2 = c^2$, onde...
```

Renderiza como:
```
A fórmula de Pitágoras é [fórmula renderizada], onde...
```

**Display Math:**
```markdown
A integral de $f(x)$ é:

$$\int_{a}^{b} f(x) \, dx = F(b) - F(a)$$

Onde $F$ é a antiderivada.
```

### Sintaxe LaTeX Comum

```latex
% Potências
a^2      % a ao quadrado
a^{2+3}  % a elevado a (2+3)

% Índices
a_1      % a com índice 1
a_{1,2}  % a com índice (1,2)

% Frações
\frac{a}{b}    % a / b

% Raízes
\sqrt{a}       % raiz quadrada
\sqrt[n]{a}    % raiz enésima

% Somatórios
\sum_{i=1}^{n} i  % soma de i=1 até n

% Integrais
\int_{a}^{b} f(x) \, dx  % integral definida

% Limites
\lim_{x \to \infty} f(x)  % limite

% Matrizes
\begin{matrix}
a & b \\
c & d
\end{matrix}

% Símbolos
\alpha \beta \gamma \delta \epsilon \zeta \eta \theta

% Operadores
\leq \geq \neq \approx \sim \propto \pm \times \div
```

### ⚠️ Importação CSS Obrigatória

**Em `app/layout.tsx` ou `components/MarkdownPreview.tsx`:**
```typescript
import 'katex/dist/katex.min.css';
```

**Sem esta importação:** Fórmulas renderizam como texto em vez de elementos formatados.

### Saída HTML

```html
<!-- Inline: $a + b = c$ -->
<span class="katex">
  <span class="katex-mathml">
    <math><!-- MathML aqui --></math>
  </span>
  <span class="katex-html"><!-- HTML renderizado --></span>
</span>

<!-- Display: $$...$$ -->
<div class="katex-display">
  <span class="katex"><!-- ... --></span>
</div>
```

### Integração em DOCX

⚠️ **Limitação:** Equações matemáticas não são exportadas para DOCX. São renderizadas como texto plano ou blocos de código.

**Solução Alternativa:** Usar MathML ou imagem de equação (não suportado nativamente)

## 📦 Ordem de Plugins - CRÍTICO!

A ordem importa porque cada plugin modifica o AST (Abstract Syntax Tree) para o próximo:

```
Markdown bruto
    ↓
remarkGfm (parse tabelas, strikethrough, etc.)
    ↓
remarkBreaks (convertter \n em <br/>)
    ↓
remarkEmoji (substituir :emoji: em emojis)
    ↓
remarkToc (gerar Table of Contents)
    ↓
remarkMath (parse delimitadores $...$)
    ↓
HTML com placeholders
    ↓
rehypeKatex (renderizar placeholders com KaTeX)
    ↓
HTML Final
```

**⚠️ Se mudar a ordem:**
- `remarkGfm` **deve ser primeiro** (baseline para GFM)
- `remarkMath` **deve ser último** nos remark plugins (prepara para rehype)
- `rehypeKatex` **deve ser depois** de toda a cadeia remark

## 🔧 Adicionar Novo Plugin

### Exemplo: Adicionar `remark-slug` (para gerar IDs automáticos em headings)

**1. Instalar:**
```bash
npm install remark-slug
```

**2. Importar em `MarkdownPreview.tsx`:**
```typescript
import remarkSlug from 'remark-slug';

const remarkPlugins = [
  remarkGfm,
  remarkBreaks,
  remarkEmoji,
  [remarkSlug, {}],  // Novo plugin aqui
  remarkToc,         // Após remarkSlug (porque TOC usa slugs)
  remarkMath,
];
```

**3. Testar:**
```markdown
# Meu Heading

Renderiza como:
<h1 id="meu-heading">Meu Heading</h1>
```

## 🐛 Problemas Comuns com Plugins

### Problema: "Plugin não funciona"

**Checklist:**
- ✅ Plugin está instalado (`npm list remark-xxx`)
- ✅ Importado corretamente em `MarkdownPreview.tsx`
- ✅ Adicionado no array `remarkPlugins`
- ✅ Ordem está correta
- ✅ CSS obrigatório importado (ex: `katex.min.css`)

### Problema: "KaTeX renderiza como texto"

**Causa:** Falta `import 'katex/dist/katex.min.css'`

**Solução:**
```typescript
// Em MarkdownPreview.tsx
import 'katex/dist/katex.min.css';
import { renderToString } from 'react-markdown';
```

### Problema: "Table of Contents não gera"

**Causa:** Não tem `## Table of Contents` no markdown

**Solução:** Adicionar linha ao markdown:
```markdown
# Meu Documento

## Table of Contents

## Seção 1
...
```

### Problema: "Tabelas quebradas após adicionar remarkXXX"

**Causa:** `remarkGfm` não é o primeiro plugin

**Solução:** Colocar `remarkGfm` **sempre primeiro**:
```typescript
const remarkPlugins = [
  remarkGfm,        // SEMPRE PRIMEIRO
  outroPlugin,
];
```

### Problema: "Diagramas Mermaid não funcionam com markdown"

**Nota:** Mermaid é renderizado separadamente em `MermaidDiagram.tsx`, não via plugins remark.

Plugins remark são para markdown. Mermaid tem:
- Detecção: ` ```mermaid ` code blocks
- Renderização: Component `<MermaidDiagram>`
- Limpeza: Função `limparDiagramaMermaid()` em `lib/mermaid-cleaner.ts`

## 📊 Matriz de Compatibilidade

| Plugin | Versão | React 19 | Next.js 16 | DOCX | Observação |
|--------|--------|----------|-----------|------|-----------|
| remarkGfm | 4.0.0 | ✅ | ✅ | ⚠️ | Deve ser primeiro |
| remarkBreaks | 4.0.0 | ✅ | ✅ | ✅ | Preserva quebras |
| remarkEmoji | 5.0.2 | ✅ | ✅ | ✅ | Compatível |
| remarkToc | 9.0.0 | ✅ | ✅ | ⚠️ | Links não funcionam em DOCX |
| remarkMath | 6.0.0 | ✅ | ✅ | ❌ | Não exporta para DOCX |
| rehypeKatex | 7.0.1 | ✅ | ✅ | ❌ | Requer CSS obrigatório |

## 📝 Referências de Sintaxe Rápida

**GFM:**
```markdown
| Col 1 | Col 2 |
|-------|-------|
| Dado  | Dado  |

~~Riscado~~

- [x] Feito
- [ ] Pendente
```

**Emojis:**
```markdown
:smile: :rocket: :tada: :heart: :thumbsup:
```

**Quebras de Linha:**
```markdown
Linha 1
Linha 2
```

**Table of Contents:**
```markdown
## Table of Contents
```

**Math:**
```markdown
Inline: $a + b = c$

Display:
$$\int_0^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}$$
```

