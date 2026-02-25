# Suporte Mermaid - Markdown Studio

## Visão Geral

O Markdown Studio agora oferece suporte completo para diagramas **Mermaid**, permitindo criar diagramas e gráficos diretamente em seus documentos markdown.

## Como Usar

Para adicionar um diagrama Mermaid, utilize um bloco de código markdown com a linguagem `mermaid`:

````markdown
```mermaid
diagrama aqui
```
````

## Exemplos

### Fluxograma Simples

````markdown
```mermaid
flowchart TD
    A[Início] --> B{Decisão?}
    B -->|Sim| C[Ação 1]
    B -->|Não| D[Ação 2]
    C --> E[Fim]
    D --> E
```
````

### Diagrama de Sequência

````markdown
```mermaid
sequenceDiagram
    participant Cliente
    participant Servidor
    Cliente->>Servidor: Requisição
    Servidor-->>Cliente: Resposta
    Cliente->>Servidor: Novo Pedido
    Servidor-->>Cliente: Confirmação
```
````

### Diagrama de Classes

````markdown
```mermaid
classDiagram
    class Veiculo {
        - marca: String
        - modelo: String
        + acelerar()
        + frear()
    }
    class Carro {
        - portas: Int
    }
    class Moto {
        - cilindradas: Int
    }
    Veiculo <|-- Carro
    Veiculo <|-- Moto
```
````

### Diagrama de Entidade-Relacionamento

````markdown
```mermaid
erDiagram
    USUARIO ||--o{ PEDIDO : faz
    PEDIDO ||--|{ ITEM_PEDIDO : contém
    ITEM_PEDIDO }o--|| PRODUTO : referencia
    USUARIO {
        int id
        string nome
        string email
    }
    PEDIDO {
        int id
        date data_pedido
        decimal total
    }
    PRODUTO {
        int id
        string nome
        decimal preco
    }
```
````

### Gráfico de Gantt

````markdown
```mermaid
gantt
    title Cronograma do Projeto
    dateFormat YYYY-MM-DD
    section Planejamento
    Análise           :a1, 2024-01-01, 30d
    Design            :a2, after a1, 20d
    section Desenvolvimento
    Backend           :b1, 2024-02-10, 40d
    Frontend          :b2, 2024-02-10, 35d
    section Testes
    QA                :c1, after b1, 15d
```
````

### Gráfico de Pizza

````markdown
```mermaid
pie title Distribuição de Tempo
    "Desenvolvimento" : 40
    "Testes" : 25
    "Documentação" : 20
    "Reuniões" : 15
```
````

## Funcionalidades

### Preview em Tempo Real

Os diagramas são renderizados instantaneamente no painel de preview enquanto você digita o markdown.

### Exportação para DOCX

Quando você exporta o documento para `.docx`, os diagramas Mermaid são incluídos como blocos de código formatados com:

- Rótulo identificador: **[Diagrama Mermaid]**
- Sintaxe do diagrama preservada
- Formatação com fundo azulado para fácil identificação

## Dicas e Boas Práticas

1. **Validação de Sintaxe**: Mermaid fornecerá feedback visual se houver erros na sintaxe do diagrama
2. **Temas**: Os diagramas usam o tema padrão do Mermaid
3. **Performance**: Para documentos muito grandes com muitos diagramas, o preview pode levar alguns segundos para renderizar
4. **Compatibilidade**: Os diagramas são renderizados como código no arquivo DOCX exportado, preservando a estrutura

## Tipos de Diagramas Suportados

- Flowchart / Fluxograma
- Sequence Diagram / Diagrama de Sequência
- Class Diagram / Diagrama de Classe
- State Diagram / Diagrama de Estado
- Entity Relationship Diagram / Diagrama ER
- Gantt Chart / Gráfico de Gantt
- Pie Chart / Gráfico de Pizza
- Git Graph / Gráfico Git
- XY Chart / Gráfico XY

## Referência Oficial

Para sintaxe completa e mais exemplos, consulte a documentação oficial: https://mermaid.js.org/

## Troubleshooting

### Diagrama não está sendo renderizado

- Verifique se o bloco está marcado com ` ```mermaid `
- Procure por erros de sintaxe no console do navegador
- Certifique-se de que a indentação está correta

### Erro "Erro ao renderizar diagrama Mermaid"

- Verifique a sintaxe do diagrama
- Consulte a documentação oficial do Mermaid para a sintaxe correta
- Tente simplificar o diagrama para identificar o problema
