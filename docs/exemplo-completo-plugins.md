# 🚀 Exemplo Completo - Todos os Plugins Remark

## Índice

(Este índice será gerado automaticamente pelos seus headings)

---

## 1️⃣ Quebras de Linha (remark-breaks)

Primeira linha
Segunda linha sem necessidade de duplo espaço
Terceira linha também aparece corretamente
Você pode quebrar linhas naturalmente

---

## 2️⃣ Emojis (remark-emoji)

Este documento usa todos os plugins remark! :fire:

Aqui estão alguns emojis populares:

- :rocket: Foguete
- :heart: Coração
- :star: Estrela
- :tada: Confete
- :thumbsup: Polegar para cima
- :smile: Sorriso
- :book: Livro
- :gear: Engrenagem

Você pode usar emojis em qualquer lugar do documento! :sparkles:

---

## 3️⃣ Equações Matemáticas (remark-math + rehype-katex)

### Equações Inline

O teorema de Pitágoras é $a^2 + b^2 = c^2$ e é fundamental na geometria.

A velocidade da luz é $c = 299.792.458 \text{ m/s}$. :star:

### Equações em Bloco

Fórmula quadrática:

$$
x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}
$$

Integral definida:

$$
\int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$

Derivada:

$$
\frac{d}{dx}\left(x^2 + 3x + 2\right) = 2x + 3
$$

---

## 4️⃣ Links Internos com Slugs (remark-slug)

Clique nos links abaixo para navegar entre seções:

- [Voltar para Quebras de Linha](#quebras-de-linha-remark-breaks)
- [Ir para Tabelas e Listas](#tabelas-e-listas)
- [Ir para Conclusão](#conclusão)

Os slugs são gerados automaticamente a partir dos títulos das seções!

---

## 5️⃣ Tabelas e Listas

### Tabelas com Suporte Completo

| Componente      | Descrição                  | Status             |
| :-------------- | :------------------------- | :----------------- |
| Editor          | Textarea com suporte a Tab | ✅ Funcional       |
| Preview         | Renderização em tempo real | ✅ Funcional       |
| Exportação DOCX | Converter para Word        | ✅ Funcional       |
| Emojis          | Suporte para emojis        | :smile: Adicionado |
| Equações        | Renderização LaTeX         | :fire: Adicionado  |

### Listas Ordenadas

1. Primeiro passo :one:
2. Segundo passo :two:
3. Terceiro passo :three:
4. Quarto passo e final :four:

### Listas Desordenadas

- Item principal
  - Subitem A
  - Subitem B
- Outro item
  - Subitem C
  - Subitem D

---

## 6️⃣ Combinando Múltiplos Recursos

### Exemplo: Documentação Técnica Completa :book:

A equação de Schrödinger é uma das mais importantes da mecânica quântica:

$$
i\hbar\frac{\partial}{\partial t}|\psi\rangle = \hat{H}|\psi\rangle
$$

Funcionalidades implementadas:

1. Preview em tempo real :fast_forward:
2. Suporte a múltiplas abas :memo:
3. Exportação para DOCX :page_facing_up:
4. Autenticação Google :lock:
5. Equações matemáticas :1234:
6. Emojis em qualquer lugar :sparkles:

### Código com Syntax Highlight

```typescript
// Exemplo de código TypeScript
interface PluginConfig {
  nome: string;
  versao: string;
  ativo: boolean;
}

const plugins: PluginConfig[] = [
  { nome: 'remark-breaks', versao: '4.0.0', ativo: true },
  { nome: 'remark-emoji', versao: '5.0.2', ativo: true },
  { nome: 'remark-math', versao: '6.0.0', ativo: true },
];
```

### Bloco de Citação

> "A matemática é a linguagem na qual Deus escreveu o universo." — Galileu Galilei
>
> E com esses plugins remark, você pode expressar ideias complexas de forma elegante! :rocket:

---

## 7️⃣ Comparação: Antes vs Depois

### Antes (sem os plugins):

- Quebras de linha requeriam 2 espaços ou `<br>`
- Emojis precisavam ser copiados/colados manualmente
- Equações matemáticas não era possível renderizar
- Navegação interna era complicada
- Tabelas de conteúdos tinham que ser criadas manualmente

### Depois (com os plugins): :tada:

- Quebras de linha simples funcionam naturalmente
- Emojis são escritos como `:emoji-name:` 😄
- Equações LaTeX são renderizadas perfeitamente $E=mc^2$
- Navegação automática com slugs [link](#conclusão)
- Índice gerado automaticamente

---

## 🎯 Casos de Uso

| Tipo de Documento        | Plugins Recomendados     | Exemplo                             |
| :----------------------- | :----------------------- | :---------------------------------- |
| **Documentação Técnica** | gfm, toc, math, slug     | Guias, tutoriais :book:             |
| **Blogging**             | breaks, emoji, toc, slug | Posts, artigos :pencil:             |
| **Pesquisa Científica**  | math, toc, slug, gfm     | Papers, teses :scientist:           |
| **Comunicação Geral**    | breaks, emoji, gfm       | Mensagens, anúncios :speech_bubble: |

---

## 📊 Estatísticas Desta Página

Informações sobre este documento:

- **Emojis utilizados**: 25+ :tada:
- **Equações matemáticas**: 4 principais $E=mc^2$
- **Seções com links internos**: Navegáveis
- **Tabelas incluídas**: 2 tabelas
- **Blocos de código**: 1 exemplo TypeScript

---

## ✨ Recursos Avançados

### Slug com Caracteres Especiais

Qualquer caractere especial é automaticamente removido ou convertido:

- `# Título com Acentuação` → `titulo-com-acentuacao`
- `# CamelCase Automático` → `camelcase-automatico`
- `# LETRAS MAIÚSCULAS` → `letras-maiusculas`

### Equações Complexas em Markdown

Derivada parcial com múltiplas variáveis:

$$
\frac{\partial f}{\partial x}\Big|_{y=const} = \lim_{h \to 0} \frac{f(x+h,y) - f(x,y)}{h}
$$

### Listas Aninhadas com Tudo

- Nível 1 :one:
  - Nível 2 com **negrito**
    - Nível 3 com `código inline`
      1. Sublista ordenada
      2. Segunda item

---

## 🔗 Navegação Final

Agora você conhece todos os plugins! Escolha sua próxima ação:

- [Voltar ao Índice](#-exemplo-completo---todos-os-plugins-remark)
- [Ir para Quebras de Linha](#quebras-de-linha-remark-breaks)
- [Ir para Tabelas e Listas](#tabelas-e-listas)

---

## Conclusão

Os plugins remark transformam a experiência de escrita em Markdown, adicionando funcionalidades poderosas:

✅ **remark-breaks** - Quebras de linha naturais
✅ **remark-emoji** - Emojis expressivos
✅ **remark-toc** - Tabelas de conteúdo automáticas
✅ **remark-math + rehype-katex** - Matemática profissional
✅ **remark-slug** - Navegação interna perfeita

Use este documento como referência para suas próprias criações! :rocket: :sparkles: :fire:

---

**Criado em**: 27 de Fevereiro de 2026
**Markdown Studio**: Versão 1.0.18+
**Status**: 🟢 Todos os plugins funcionando perfeitamente!
