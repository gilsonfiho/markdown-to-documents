# Plugins Remark - Guia de Uso

Este documento descreve os plugins remark instalados e como utilizá-los no Markdown Studio.

## Plugins Instalados

### 1. **remark-breaks**

Converte quebras de linha simples em tags `<br>` HTML.

**Como usar:**

```markdown
Primeira linha
Segunda linha será exibida abaixo

(sem necessidade de duplo espaço ou dois <br> no final)
```

**Resultado em preview:**

```
Primeira linha
Segunda linha será exibida abaixo
```

---

### 2. **remark-emoji**

Converte códigos de emoji em emojis reais.

**Como usar:**

```markdown
:smile: Bem-vindo ao Markdown Studio! :rocket:
:heart: Isso é incrível! :tada:
:fire: Código fogo :fire:
```

**Emojis suportados:**

- `:smile:` → 😄
- `:rocket:` → 🚀
- `:heart:` → ❤️
- `:fire:` → 🔥
- `:tada:` → 🎉
- `:sun:` → ☀️
- `:star:` → ⭐
- E centenas de outros...

[Lista completa de emojis suportados](https://github.com/rhysd/remark-emoji)

---

### 3. **remark-toc**

Gera automaticamente um índice (tabela de conteúdos) a partir dos headings.

**Como usar:**

```markdown
# Meu Documento

## Índice

(o conteúdo será preenchido automaticamente aqui)

## Seção 1

Conteúdo da seção 1...

## Seção 2

Conteúdo da seção 2...

### Subsseção 2.1

Conteúdo da subseção...
```

**Resultado:**
O índice será automaticamente preenchido com links para cada seção (H2, H3, etc.)

**Marcadores válidos para o índice:**

- `## Índice`
- `## Table of Contents`
- `## Tabela de Conteúdos`
- `## Contents`

---

### 4. **remark-math**

Adiciona suporte para equações matemáticas no formato LaTeX.

**Como usar:**

**Matemática inline:**

```markdown
A fórmula do teorema de Pitágoras é $a^2 + b^2 = c^2$.
```

**Bloco matemático:**

```markdown
$$
\int_{-\infty}^{+\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

**Exemplos:**

- Quadrado: `$x^2$`
- Raiz quadrada: `$\sqrt{x}$`
- Fração: `$\frac{a}{b}$`
- Letra grega: `$\alpha, \beta, \gamma$`
- Somatório: `$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$`
- Integral: `$\int_a^b f(x) dx$`

**Equações complexas:**

```markdown
$$
\begin{align}
y &= mx + b \\
x &= \frac{y - b}{m}
\end{align}
$$
```

---

### 5. **rehype-katex**

Plugin rehype que renderiza as equações matemáticas do remark-math usando KaTeX.

**Instalado junto com remark-math** - Trabalham juntos!

---

## Exemplos Combinados

### Documento Técnico Completo

```markdown
# Guia de Cálculo Diferencial

## Índice

(preenchido automaticamente)

## Introdução :wave:

O cálculo diferencial estuda as **derivadas** e suas aplicações.

## Conceitos Fundamentais

### Definição de Derivada

A derivada de uma função $f(x)$ é definida como:

$$
f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}
$$

### Exemplo Prático

Primeira linha de código
Segunda linha de código
(quebras de linha simples funcionam agora)

### Tabela de Derivadas Comuns

| Função    | Derivada   |
| --------- | ---------- |
| $x^n$     | $nx^{n-1}$ |
| $e^x$     | $e^x$      |
| $\sin(x)$ | $\cos(x)$  |

## Exercícios :pencil:

1. Calcule a derivada de $f(x) = 3x^2 + 2x + 1$
2. Encontre $f'(2)$ para $f(x) = x^3$
3. Determine os pontos críticos de $f(x) = x^3 - 3x$

---

[Voltar ao topo](#guia-de-calculo-diferencial)
```

---

## Performance e Considerações

### Quando usar cada plugin

| Plugin        |               Use quando...                |                 Evite quando...                  |
| ------------- | :----------------------------------------: | :----------------------------------------------: |
| remark-breaks | Precisa respeitar quebras de linha simples | Quer o comportamento padrão markdown (2 espaços) |
| remark-emoji  |  Quer documentos mais amigáveis e visuais  |    Cria documentos formais (relatórios, PDFs)    |
| remark-toc    |       Documento tem mais de 5 seções       |       Documento é muito curto (<1 página)        |
| remark-math   |  Contém equações matemáticas/científicas   |          Documentos puramente textuais           |
| remark-slug   | Quer navegação interna e índices clicáveis |          Documentos sem links internos           |

---

## Limitações na Exportação DOCX

⚠️ **Importante**: Nem todos os recursos funcionam na exportação para DOCX:

- ✅ **Emojis** - Exportam normalmente
- ✅ **Quebras de linha** - Exportam como `<br>`
- ✅ **Slugs** - IDs dos headings são preservados
- ⚠️ **Tabela de conteúdos** - Exporte como texto, não como índice dinâmico
- ⚠️ **Equações matemáticas** - Exportam como imagens estáticas (renderizadas pelo KaTeX)
- ⚠️ **Links internos** - Funcionam no preview, podem não funcionar em alguns visualizadores DOCX

---

## Dicas e Truques

### 1. **Combinar Múltiplos Recursos**

```markdown
# Projeto :rocket:

## Índice

(gerado automaticamente)

### Equação Principal

A fórmula é $E = mc^2$ :fire:

Primeira linha
Segunda linha
(ambas aparecem com quebra de linha)
```

### 2. **Emojis em Headings**

```markdown
# 📚 Documentação

## ✨ Features

### 🎯 Objetivos
```

### 3. **Equações em Listas**

```markdown
1. Primeira equação: $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$
2. Segunda equação: $y = mx + b$
3. Terceira equação: $E = mc^2$
```

### 4. **Navegação com Slugs**

```markdown
# Capítulo 1

[Ir para Capítulo 2](#capitulo-2)

---

# Capítulo 2

[Voltar para Capítulo 1](#capitulo-1)
[Ir para Capítulo 3](#capitulo-3)

---

# Capítulo 3

[Voltar para Capítulo 2](#capitulo-2)
```

---

## Referências

- [remark-breaks](https://github.com/remarkjs/remark-breaks)
- [remark-emoji](https://github.com/rhysd/remark-emoji)
- [remark-toc](https://github.com/remarkjs/remark-toc)
- [remark-math](https://github.com/remarkjs/remark-math)
- [remark-slug](https://github.com/remarkjs/remark-slug)
- [KaTeX Documentation](https://katex.org/)
- [emoji cheat sheet](https://www.webfx.com/tools/emoji-cheat-sheet/)

---

## Suporte

Para dúvidas ou problemas com os plugins:

1. Verifique a documentação oficial do plugin
2. Abra uma issue no repositório
3. Consulte os exemplos neste documento
