# Exemplos de Uso - Estruturas de Árvore

Este documento mostra exemplos práticos de como usar estruturas de árvore e diagramas ASCII no Markdown Studio.

## Exemplo 1: Fluxo de Processamento

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

## Exemplo 2: Estrutura de Diretórios

```
projeto-frontend/
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── pages/
│   │   ├── index.tsx
│   │   ├── dashboard.tsx
│   │   └── settings.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   ├── utils.ts
│   │   └── store.ts
│   ├── styles/
│   │   └── globals.css
│   └── App.tsx
├── public/
│   ├── images/
│   │   ├── logo.svg
│   │   └── favicon.ico
│   └── data/
│       └── config.json
├── tests/
│   └── unit/
├── package.json
├── tsconfig.json
├── .env.local
└── README.md
```

## Exemplo 3: Arquitetura de Sistema

```
Client (Frontend)
├── React 19
├── TypeScript
└── Tailwind CSS

├─ Server (Backend)
│  ├─ Node.js / Express
│  ├─ PostgreSQL
│  └─ Redis Cache
│
└─ Services
   ├─ Authentication (OAuth)
   ├─ File Storage (S3)
   └─ Email Service (SendGrid)
```

## Exemplo 4: Árvore de Decisão

```
Valida Entrada?
├─ Sim
│  ├─ Valida Autorização?
│  │  ├─ Sim
│  │  │  └─ Processa Requisição
│  │  └─ Não
│  │     └─ Retorna 403 Forbidden
│  └─ Não
│     └─ Retorna 400 Bad Request
└─ Erro
   └─ Retorna 500 Server Error
```

## Exemplo 5: Estrutura de Dados

```
NodoArvre
├─ valor: string
├─ filhos: NodoArvre[]
└─ pai?: NodoArvre

ListaDuplamenteLigada
├─ valor: T
├─ proximo?: ListaDuplamenteLigada<T>
└─ anterior?: ListaDuplamenteLigada<T>

Fila<T>
├─ elementos: T[]
├─ enqueue(item: T)
└─ dequeue(): T | undefined
```

## Exemplo 6: Timeline de Projeto

```
2026-01-15: Fase de Planejamento
├─ Definição de Requisitos
├─ Design de UI/UX
└─ Setup do Ambiente

2026-02-01: Desenvolvimento Backend
├─ API REST
├─ Banco de Dados
└─ Autenticação

2026-02-15: Desenvolvimento Frontend
├─ Componentes
├─ Integração com API
└─ Testes Unitários

2026-03-01: QA e Deploy
├─ Testes de Integração
├─ Deployment em Staging
└─ Deployment em Produção
```

## Exemplo 7: Usando com Backticks (Formato Explícito)

Se preferir usar o formato tradicional de bloco de código:

\`\`\`
projeto/
├── src/
│   └── index.ts
└── package.json
\`\`\`

## Dicas Importantes

1. **Sem backticks necessários**: A aplicação detecta automaticamente estruturas de árvore
2. **Preservação de espaçamento**: Cada nível de indentação é mantido
3. **Exportação DOCX**: Estruturas são mantidas com formatação monoespace no Word
4. **Mobile-friendly**: Em telas pequenas, estruturas largas terão scroll horizontal

## Caracteres Suportados

| Caractere | Nome | Uso |
| :-------: | ---- | --- |
| `├` | Ramificação | Itens intermediários |
| `└` | Última ramificação | Último item de um nível |
| `│` | Linha vertical | Continuação da estrutura |
| `─` | Linha horizontal | Conexão horizontal |
| `┌` | Canto superior esquerdo | Início de estrutura |
| `┐` | Canto superior direito | Fim de primeira linha |
| `┘` | Canto inferior direito | Fim de estrutura |
| `┤` | Junção lateral | Conexão lateral |
| `┬` | Junção superior | Divisão superior |
| `┴` | Junção inferior | Divisão inferior |
| `┼` | Junção central | Cruzamento de linhas |

## Conversão para DOCX

Quando você exporta para `.docx`, a estrutura é mantida com:
- **Font**: Courier New (monoespace)
- **Cor**: #333333 (cinza escuro)
- **Fundo**: #F5F5F5 (cinza claro)
- **Bordas**: Cinzas (#CCCCCC)

Isso garante que a visualização no Word seja fiel ao preview na tela.

## Referências

Para mais informações, consulte:
- Documentação: `/docs/SUPORTE_ESTRUTURAS_ARVORE.md`
- Arquivo de configuração: `/lib/markdown-to-docx.ts`
- Componente Preview: `/components/MarkdownPreview.tsx`

