# Suporte para Estruturas de Árvore e Diagramas ASCII

## Visão Geral

A aplicação **Markdown Studio** agora suporta a renderização correta de estruturas de árvore e diagramas ASCII em markdown. Isso inclui diagramas criados com caracteres especiais como `├──`, `└──`, `│`, etc.

## O Problema Original

Anteriormente, markdown com estruturas de árvore era tratado como parágrafos normais, perdendo:
- Espaçamento e indentação
- Caracteres especiais Unicode como `├──`, `└──`, `│`
- Formatação monoespace
- Alinhamento visual

## A Solução Implementada

### 1. **Detecção Automática de Blocos de Árvore**

A função `detectarBlocoArvore()` identifica automaticamente linhas que contêm caracteres de estrutura:

```typescript
const padraoArvore = /[├─└│┌┐┘┤┬┴┼]/;
```

Suporta os seguintes caracteres Unicode:
- `├──` — ramificação
- `└──` — última ramificação
- `│` — linha vertical
- `┌` — canto superior esquerdo
- `┐` — canto superior direito
- `└` — canto inferior esquerdo
- `┘` — canto inferior direito
- `┤` — junção lateral
- `┬` — junção superior
- `┴` — junção inferior
- `┼` — junção central

### 2. **Renderização no Preview**

O componente `MarkdownPreview` foi atualizado para:
- Adicionar classe `whitespace-pre-wrap` ao elemento `<pre>`
- Adicionar classe `break-words` para quebra de linha automática em telas pequenas
- Preservar formatação monoespace via fonte `font-mono`

**Classes Tailwind adicionadas:**
```tsx
className="bg-neutral-900 text-neutral-50 p-4 rounded-lg overflow-x-auto my-4 border border-neutral-700 whitespace-pre-wrap break-words"
```

### 3. **Exportação para DOCX**

A função `markdownToDocx()` foi melhorada para:
- Dividir blocos de código em múltiplos parágrafos (um por linha)
- Aplicar bordas apenas na primeira e última linha
- Preservar espaçamento e caracteres especiais
- Usar fonte `Courier New` monoespace para mantê-lo visualmente correto

**Resultado no DOCX:**
- Primeira linha: borda superior + inferior + laterais
- Linhas do meio: apenas bordas laterais
- Última linha: borda inferior + laterais

## Exemplos de Uso

### Exemplo 1: Fluxo de Processamento

```
Input (inicial)
├── token, app_origem, client_app_header
├── num_processo, analise
└── errors: [], pecas: []

[Nó 1] BuscarPecasProcesso
├── Output: pecas[], nome_beneficiario, is_pecas_processo

[Nó 2] VerificacaoPreenchimento
├── Output: ano_exercicio, telefone, contatos_indicador

[Nó 3] ChecagemDocumentosFiscais
├── Output: prompt_regras, prompt_insumos

[Nó 4] AnalisePrestacaoContasTIC
├── Output: check_list_validacoes[], analise.analise
├── MongoDB: insert analise_doc
└── SSE: metadata + end_step + stop_stream
```

### Exemplo 2: Estrutura de Diretórios

```
projeto/
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── pages/
│       └── index.tsx
├── public/
│   └── images/
└── package.json
```

### Exemplo 3: Usando Backticks (Alternativa)

Se desejar garantir formatação explícita, use blocos de código:

````
```
├── Item 1
│   ├── Subitem 1.1
│   └── Subitem 1.2
└── Item 2
```
````

## Comportamento na Preview

- **Sem backticks**: A estrutura é detectada automaticamente e renderizada em estilo `<pre>`
- **Com backticks**: Renderizada normalmente como bloco de código

## Comportamento na Exportação DOCX

Ambos os formatos (com e sem backticks) são exportados como:
- Font: Courier New (monoespace)
- Cor: #333333 (cinza escuro)
- Fundo: #F5F5F5 (cinza muito claro)
- Bordas: Cinzas (#CCCCCC)

## Configuração Técnica

### Detecção

```typescript
function detectarBlocoArvore(
  linhas: string[],
  indiceInicial: number,
): { linhas: string[]; quantidade: number } | null
```

Retorna:
- `null` — se não for estrutura de árvore
- `{ linhas: string[], quantidade: number }` — bloco detectado

### Parsing

O parser agora reconhece no seguinte ordem:
1. Headings (`#`, `##`, etc.)
2. Code blocks (com backticks)
3. **Estruturas de árvore** (novo)
4. Horizontal rules (`---`, `***`, `___`)
5. Listas (`-`, `*`, `+`, `1.`)
6. Parágrafos normais

## Limitações Conhecidas

1. **Caracteres especiais**: Alguns caracteres Unicode podem não renderizar em navegadores muito antigos
2. **Mobile**: Em telas pequenas, estruturas muito largas podem precisar scroll horizontal
3. **Copy-paste**: Ao copiar do preview, espaçamento pode não ser preservado

## Compatibilidade

- **Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Node.js**: 18.x+
- **Next.js**: 16.1+
- **React**: 19.x+

## Melhorias Futuras

- [ ] Suporte a temas (dark/light mode) com cores personalizadas
- [ ] Conversão para PDF com preservação de formatação
- [ ] Suporte a gráficos Mermaid
- [ ] Editor visual para diagrama de árvore

## Referências

- [Unicode Box Drawing Characters](https://en.wikipedia.org/wiki/Box_Drawing)
- [React Markdown Documentation](https://github.com/remarkjs/react-markdown)
- [DOCX Format Specification](https://www.ecma-international.org/publications-and-standards/standards/ecma-376-1/)

