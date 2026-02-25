# Teste Rápido - Suporte Mermaid

Cole este conteúdo no editor Markdown para testar o suporte Mermaid:

## Fluxograma de Login

```mermaid
flowchart TD
    A[Usuário Acessa] --> B[Tela de Login]
    B --> C{Credenciais OK?}
    C -->|Não| D[Erro de Autenticação]
    D --> B
    C -->|Sim| E[Google OAuth]
    E --> F[Usuário Autenticado]
    F --> G[Home Page]
```

## Arquitetura Markdown Studio

```mermaid
graph LR
    A[Browser] -->|Digite Markdown| B[MarkdownEditor]
    B -->|Estado Zustand| C[Store]
    C -->|Preview| D[MarkdownPreview]
    D -->|React Markdown| E[Mermaid Diagram]
    D --> F[HTML Preview]
    C -->|Exportar| G[markdown-to-docx]
    G -->|docx Packer| H[DOCX File]
```

## Diagrama ER - Banco de Dados

```mermaid
erDiagram
    USUARIO ||--o{ DOCUMENTO : cria
    DOCUMENTO ||--|{ LINHA : contém
    USUARIO {
        int id
        string nome
        string email
        date data_criacao
    }
    DOCUMENTO {
        int id
        string titulo
        string conteudo
        date criado_em
        date atualizado_em
    }
    LINHA {
        int numero
        string tipo
        string conteudo
    }
```

## Timeline de Desenvolvimento

```mermaid
timeline
    title Evolução do Markdown Studio
    2026-01 : Setup Next.js 16
         : NextAuth Google OAuth
    2026-02 : React 19 Migration
         : Tailwind CSS
    2026-02 : Suporte Mermaid
         : Diagramas em Tempo Real
    2026-02-Future : Temas Customizáveis
         : Exportação Avançada
```

Todos esses diagramas serão renderizados em tempo real no painel de preview!

