# Git Hooks - Markdown Studio

## 📋 Visão Geral

Git hooks automáticos foram configurados para garantir qualidade de código antes de cada commit. O hook `pre-commit` executa:

1. ✅ **ESLint** — Verifica e corrige problemas de linting
2. ✅ **Prettier** — Formata o código
3. ✅ **Jest** — Executa testes unitários
4. ✅ **TypeScript Build** — Verifica erros de tipo

## 🚀 Instalação

### Opção 1: Instalação Automática (Recomendado)

```bash
npm run setup-hooks
```

Este comando irá:

- Instalar Husky
- Inicializar os hooks
- Configurar permissões

### Opção 2: Instalação Manual

```bash
# Instalar Husky
npm install husky --save-dev

# Inicializar
npx husky install

# Configurar permissões
chmod +x .husky/pre-commit
```

## 🔄 Como Funciona

Quando você tenta fazer um commit:

```bash
git add arquivo.tsx
git commit -m "Minha alteração"
```

O hook `pre-commit` é executado automaticamente:

```
🔍 Executando verificações pre-commit...

📝 Executando ESLint...
✅ ESLint passou

🎨 Formatando com Prettier...
✅ Prettier passou

🧪 Executando testes...
✅ Testes passaram

🔨 Verificando build...
✅ Build passou

✅ Todas as verificações passaram! Commit permitido.
```

Se alguma verificação falhar:

- O commit é **cancelado**
- Você vê qual verificação falhou
- Mensagem de erro detalhada é mostrada
- Corrija e tente novamente

## ⚙️ Configuração do Hook

**Arquivo:** `.husky/pre-commit`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Executando verificações pre-commit..."

# 1. ESLint + Prettier
npm run lint:fix
if [ $? -ne 0 ]; then
  echo "❌ ESLint falhou"
  exit 1
fi

# 2. Prettier
npm run format
if [ $? -ne 0 ]; then
  echo "❌ Prettier falhou"
  exit 1
fi

# 3. Testes
npm run test -- --passWithNoTests
if [ $? -ne 0 ]; then
  echo "❌ Testes falharam"
  exit 1
fi

# 4. Build
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build falhou"
  exit 1
fi

echo "✅ Todas as verificações passaram! Commit permitido."
```

## 🔧 Customizar o Hook

Para modificar o que o hook executa:

1. Editar `.husky/pre-commit`
2. Adicionar/remover comandos conforme necessário
3. Salvar e testar

### Exemplo: Desabilitar Build Verification

```bash
# Comentar linha de build
# npm run build
```

## ⏭️ Ignorar o Hook (Não Recomendado!)

Se absolutamente necessário ignorar o hook:

```bash
git commit --no-verify -m "Mensagem"
```

⚠️ **Aviso:** Isso bypassa todas as verificações! Use apenas em emergências.

## 🐛 Troubleshooting

### "Permission denied: .husky/pre-commit"

```bash
chmod +x .husky/pre-commit
```

### "Husky não está instalado"

```bash
npm run setup-hooks
```

### "Hook executa lentamente"

Alguns comandos (especialmente `npm run build`) podem ser lentos em documentos grandes. Reduzir ou otimizar conforme necessário.

### "Testes falhando no hook"

O hook usa `--passWithNoTests` para não falhar se não houver testes. Se testes estão falhando:

1. Verificar saída de erro
2. Rodar `npm run test` localmente
3. Corrigir testes
4. Tentar commit novamente

### "ESLint/Prettier está tocando em código que não editei"

É normal! O hook corrige todos os problemas de linting e formatação no repositório. Você pode:

1. Fazer stage apenas dos arquivos que editou: `git add arquivo.tsx`
2. Deixar o hook corrigir tudo e fazer commit depois
3. Revisar as alterações: `git diff --cached`

## 📊 Estrutura de Arquivos

```
.husky/
├── _/
│   ├── .gitignore
│   └── husky.sh
└── pre-commit        # Hook configurado

scripts/
├── setup-hooks.sh    # Script de instalação
└── README_HOOKS.md   # Este arquivo
```

## ✅ Checklist de Configuração

- [ ] Rodar `npm run setup-hooks`
- [ ] Tentar fazer um commit test
- [ ] Verificar que hook foi executado
- [ ] Revisar `.husky/pre-commit` se necessário
- [ ] Documentar qualquer customização

## 🔗 Referências

- **Husky Docs:** https://typicode.github.io/husky/
- **Git Hooks:** https://git-scm.com/docs/githooks
- **Pre-commit Best Practices:** https://pre-commit.com/

## 💡 Próximos Passos

Você pode estender o Husky com mais hooks:

- **commit-msg** — Validar formato de mensagem de commit
- **post-commit** — Ações após commit bem-sucedido
- **pre-push** — Verificações antes de push

Exemplo adicionar `commit-msg`:

```bash
npx husky add .husky/commit-msg 'npm run validate:commit'
```

---

Pronto! Seu repositório agora tem qualidade de código garantida antes de cada commit. 🎉
