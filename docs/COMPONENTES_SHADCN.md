# 🎨 Componentes shadcn/ui Disponíveis

## Componentes Instalados

### 1. **Button**

**Arquivo**: `components/ui/button.tsx`

```typescript
import { Button } from "@/components/ui/button"

// Variantes disponíveis
<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Tamanhos
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>

// Desabilitado
<Button disabled>Disabled</Button>
```

**Uso no Projeto**:

- Header: Salvar tudo, Exportar tudo, Fechar tudo, Login
- TabsBar: Botões de scroll, adicionar aba, salvar aba

---

### 2. **Dropdown Menu**

**Arquivo**: `components/ui/dropdown-menu.tsx`

```typescript
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Abrir Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem>Opção 1</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Opção 2</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

**Uso no Projeto**:

- Header: Menu de exportação (Exportar todas, Copiar, HTML, PDF)
- TabsBar: Menu de exportação por aba
- MarkdownEditor: Menu de colar (Colar, Limpar e colar)

---

### 3. **Input**

**Arquivo**: `components/ui/input.tsx`

```typescript
import { Input } from "@/components/ui/input"

<Input placeholder="Digite algo..." />
<Input type="email" />
<Input disabled />
```

**Uso no Projeto**:

- TabsBar: Input para renomear abas (em edição)

---

### 4. **Textarea**

**Arquivo**: `components/ui/textarea.tsx`

```typescript
import { Textarea } from "@/components/ui/textarea"

<Textarea placeholder="Digite markdown aqui..." />
<Textarea disabled />
```

**Uso no Projeto**:

- MarkdownEditor: Área de edição de markdown

---

### 5. **Dialog**

**Arquivo**: `components/ui/dialog.tsx`

```typescript
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger asChild>
    <Button>Abrir Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Título</DialogTitle>
      <DialogDescription>Descrição</DialogDescription>
    </DialogHeader>
    {/* Conteúdo */}
  </DialogContent>
</Dialog>
```

**Uso Potencial**:

- Confirmação de deleção de aba
- Confirmação de fechar todas as abas
- Diálogo de configurações

---

### 6. **Badge**

**Arquivo**: `components/ui/badge.tsx`

```typescript
import { Badge } from "@/components/ui/badge"

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

**Uso Potencial**:

- Status "Salvo em..." (em lugar de CheckCircle2)
- Versão da aplicação no header
- Número de caracteres/palavras

---

### 7. **Tabs**

**Arquivo**: `components/ui/tabs.tsx`

```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Conteúdo 1</TabsContent>
  <TabsContent value="tab2">Conteúdo 2</TabsContent>
</Tabs>
```

**Nota**: Você tem um sistema de abas custom muito bom. Este componente é alternativa se quiser refatorar no futuro.

---

### 8. **Separator**

**Arquivo**: `components/ui/separator.tsx`

```typescript
import { Separator } from "@/components/ui/separator"

<div>
  <p>Conteúdo 1</p>
  <Separator />
  <p>Conteúdo 2</p>
</div>
```

**Uso Potencial**:

- Dividir seções do header
- Separar abas visualmente

---

## 📦 Adicionar Mais Componentes

Para instalar componentes adicionais do shadcn/ui:

```bash
npx shadcn@latest add [component-name]

# Exemplos:
npx shadcn@latest add tooltip
npx shadcn@latest add alert-dialog
npx shadcn@latest add popover
npx shadcn@latest add card
npx shadcn@latest add skeleton
```

---

## 🎯 Componentes Recomendados para o Futuro

| Componente       | Caso de Uso            | Prioridade  |
| ---------------- | ---------------------- | ----------- |
| **Tooltip**      | Hover info em ícones   | ⭐⭐⭐ Alta |
| **Alert Dialog** | Confirmações críticas  | ⭐⭐⭐ Alta |
| **Card**         | Containers de conteúdo | ⭐⭐ Média  |
| **Popover**      | Conteúdo flutuante     | ⭐⭐ Média  |
| **Skeleton**     | Loading placeholders   | ⭐ Baixa    |
| **Progress**     | Barra de progresso     | ⭐ Baixa    |

---

## 🔧 Customizando Componentes

Todos os componentes estão em `components/ui/` e são completamente customizáveis:

```typescript
// components/ui/button.tsx - Você pode editar colors, tamanhos, etc
export const buttonVariants = cva('inline-flex items-center justify-center gap-2 ...', {
  variants: {
    variant: {
      default: 'bg-neutral-900 text-neutral-50 ...',
      secondary: 'bg-neutral-100 text-neutral-900 ...',
      // ... mais variantes
    },
  },
});
```

---

## 🎨 Design System

O projeto usa o design system **New York** do shadcn/ui com:

- **Cores**: Neutral (cinza)
- **Radius**: 0.5rem
- **CSS Variables**: Sim (para tema dark/light no futuro)

**Configuração** em `components.json`:

```json
{
  "style": "new-york",
  "tailwind": {
    "baseColor": "neutral"
  }
}
```

---

## ✨ Prós e Contras

### ✅ Prós

- Componentes profissionais prontos para uso
- Acessibilidade garantida (Radix UI)
- Totalmente customizáveis
- Zero vendor lock-in (código é seu)
- Suporta dark mode facilmente
- Ótima documentação

### ⚠️ Contras

- Bundle size +50KB (aceitável)
- Precisa copiar novos componentes manualmente
- Curva de aprendizado mínima

---

## 🚀 Próximos Passos

1. ✅ **Fase 1**: Instalação e componentes essenciais (CONCLUÍDO)
2. **Fase 2**: Adicionar componentes complementares conforme necessário
3. **Fase 3**: Criar dark mode com CSS variables
4. **Fase 4**: Documentação de componentes com Storybook

---

## 📚 Documentação

- **shadcn/ui Official**: https://ui.shadcn.com
- **Radix UI**: https://www.radix-ui.com
- **Tailwind CSS**: https://tailwindcss.com

Seu projeto está com a melhor stack de UI disponível! 🎉
