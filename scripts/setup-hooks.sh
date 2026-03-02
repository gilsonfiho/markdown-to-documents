#!/bin/bash

# Script para configurar Husky e Git hooks
# Uso: npm run setup-hooks

echo "🚀 Configurando Husky e Git hooks..."
echo ""

# 1. Instalar Husky
echo "📦 Instalando Husky..."
npm install husky --save-dev

if [ $? -ne 0 ]; then
  echo "❌ Erro ao instalar Husky"
  exit 1
fi

echo "✅ Husky instalado"
echo ""

# 2. Inicializar Husky
echo "🔧 Inicializando Husky..."
npx husky install

if [ $? -ne 0 ]; then
  echo "❌ Erro ao inicializar Husky"
  exit 1
fi

echo "✅ Husky inicializado"
echo ""

# 3. Adicionar permissão de execução ao hook
echo "🔐 Configurando permissões..."
chmod +x .husky/pre-commit

if [ $? -ne 0 ]; then
  echo "❌ Erro ao configurar permissões"
  exit 1
fi

echo "✅ Permissões configuradas"
echo ""

# 4. Verificar instalação
echo "✅ Setup completo!"
echo ""
echo "📋 Hooks instalados:"
ls -la .husky/
echo ""
echo "💡 Próxima vez que você tentar fazer commit:"
echo "   - ESLint será executado automaticamente"
echo "   - Prettier formatará o código"
echo "   - Testes serão executados"
echo "   - Build será verificado"
echo ""
echo "Para ignorar o hook (não recomendado):"
echo "   git commit --no-verify"

