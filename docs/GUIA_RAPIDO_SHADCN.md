# 📖 Guia Rápido: Usar shadcn/ui no Projeto

## 🎯 Imports Padrão

```typescript
// Botão
import { Button } from '@/components/ui/button';

// Menu Dropdown
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Input
import { Input } from '@/components/ui/input';

// Textarea
import { Textarea } from '@/components/ui/textarea';

// Badge
import { Badge } from '@/components/ui/badge';

// Dialog
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Tabs
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Separator
import { Separator } from '@/components/ui/separator';
```

---

## 🔗 Padrão Básico: Button + DropdownMenu

```typescript
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, Copy } from "lucide-react"

export const MeuComponente = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
          <Download size={18} />
          <span>Exportar</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuItem onClick={() => console.log("Opção 1")} className="flex gap-2 cursor-pointer">
          <Download size={12} />
          <span>Baixar (.docx)</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => console.log("Opção 2")} className="flex gap-2 cursor-pointer">
          <Copy size={12} />
          <span>Copiar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

---

## 🔔 Usar Toasts (Sonner)

```typescript
import { toast } from "sonner"

// Sucesso
toast.success("Documento exportado com sucesso!")

// Erro
toast.error("Erro ao exportar")

// Info
toast.info("Operação em andamento...")

// Warning
toast.warning("Aviso!")

// Custom
toast.custom((t) => (
  <div>Notificação personalizada</div>
))

// Com promise
toast.promise(
  promiseFunc,
  {
    loading: "Carregando...",
    success: "Sucesso!",
    error: "Erro!",
  }
)
```

---

## 🎨 Variantes de Button

```typescript
// Cores
<Button className="bg-green-600 hover:bg-green-700 text-white">Green</Button>
<Button className="bg-red-600 hover:bg-red-700 text-white">Red</Button>
<Button className="bg-purple-600 hover:bg-purple-700 text-white">Purple</Button>

// Variantes
<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Tamanhos
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>

// Com ícone
<Button className="gap-2">
  <Save size={18} />
  <span>Salvar</span>
</Button>

// Desabilitado
<Button disabled>Disabled</Button>

// Loading state
<Button disabled className="animate-pulse">
  <div className="animate-spin"><Package size={18} /></div>
  Processando...
</Button>
```

---

## 🛠️ Padrão: Dialog

```typescript
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export const MeuDialog = () => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Abrir</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar ação</DialogTitle>
          <DialogDescription>
            Tem certeza que quer fazer isso?
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={() => {
            // Fazer algo
            setOpen(false)
            toast.success("Feito!")
          }}>
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

---

## 📋 Padrão: Textarea

```typescript
import { Textarea } from "@/components/ui/textarea"

export const Editor = () => {
  const [value, setValue] = useState("")

  return (
    <Textarea
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Digite markdown aqui..."
      className="flex-1 p-6 font-mono text-sm resize-none"
    />
  )
}
```

---

## 📝 Padrão: Input

```typescript
import { Input } from "@/components/ui/input"

export const Renomear = () => {
  const [nome, setNome] = useState("")

  return (
    <Input
      type="text"
      value={nome}
      onChange={(e) => setNome(e.target.value)}
      placeholder="Novo nome..."
      className="h-6 px-2 text-sm max-w-[150px]"
    />
  )
}
```

---

## 🏷️ Padrão: Badge

```typescript
import { Badge } from "@/components/ui/badge"

// Variantes
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>

// Uso prático
<Badge className="bg-green-100 text-green-800">Salvo</Badge>
<Badge className="bg-blue-100 text-blue-800">Processando</Badge>
```

---

## ➕ Adicionar Novo Componente

Se precisar de outro componente do shadcn/ui:

```bash
# Ver disponíveis
npx shadcn@latest list

# Instalar
npx shadcn@latest add [componente]

# Exemplos
npx shadcn@latest add tooltip
npx shadcn@latest add alert-dialog
npx shadcn@latest add card
npx shadcn@latest add popover
```

---

## 🎯 Checklist: Ao Criar Novo Componente

- ✅ Usar `'use client'` se usar hooks
- ✅ Importar componentes shadcn do `@/components/ui/*`
- ✅ Usar `toast` do Sonner para feedback
- ✅ Usar `Button` em lugar de `button` HTML
- ✅ Usar `DropdownMenu` em lugar de menu custom
- ✅ Aplicar Tailwind classes para styling
- ✅ Manter compatibilidade com Framer Motion

---

## 🔍 Troubleshooting

### Button não está com o estilo esperado

```typescript
// ❌ Errado - o classname substitui tudo
<Button className="px-4 py-2">Click</Button>

// ✅ Correto - merge com classes existentes
<Button className="bg-purple-600 hover:bg-purple-700 text-white">Click</Button>
```

### DropdownMenu não fecha após click

```typescript
// ✅ Usar em DropdownMenuTrigger
<DropdownMenuTrigger asChild>
  <Button>Menu</Button>
</DropdownMenuTrigger>

// O menu fecha automaticamente após onClick
<DropdownMenuItem onClick={() => handleAction()}>
  Opção
</DropdownMenuItem>
```

### Input/Textarea com outline azul

```typescript
// ✅ shadcn/ui usa focus-visible:ring
// Se quiser remover o outline:
<Textarea className="focus-visible:ring-0" />
```

---

## 📚 Recursos Úteis

- **Docs shadcn**: https://ui.shadcn.com/docs
- **Exemplos Code**: https://github.com/shadcn-ui/ui/tree/main/apps/www/app/examples
- **Radix Docs**: https://www.radix-ui.com/docs/primitives/overview/introduction
- **Tailwind Classes**: https://tailwindcss.com/docs

---

## 💡 Dicas Profissionais

1. **Reutilize componentes**: Não crie botão novo, use `Button` do shadcn
2. **Customize em `components/ui/*`**: Nunca altere a lógica, customize o CSS
3. **Use Framer Motion**: Compatível 100%, adicione `motion.div` ao redor
4. **Mantém a cor do tema**: Use neutral-\* do Tailwind (já configurado)
5. **CSS Variables**: Os componentes usam `--primary`, `--destructive`, etc. Customize em `globals.css`

---

**Você está usando os melhores componentes da comunidade React! 🚀**
