# 🧪 GUIA DE TESTES - Instruções Práticas

## ⚡ Quick Start - Executar Testes

### 1. Primeiro Teste

```bash
npm test
```

### 2. Modo Interativo (Watch)

```bash
npm run test:watch
```

- Reexecuta testes ao salvar arquivos
- Perfeit para desenvolvimento
- Pressione `q` para sair

### 3. Com Relatório de Cobertura

```bash
npm run test:coverage
```

---

## 📋 Estrutura dos Testes

```
__tests__/
├── components/
│   ├── Header.test.tsx          (7 testes)
│   ├── TabsBar.test.tsx         (10 testes)
│   ├── MarkdownEditor.test.tsx  (9 testes)
│   └── shadcn-ui.test.tsx       (11 testes)
├── lib/
│   ├── store.test.ts            (15 testes)
│   ├── versao.test.ts           (4 testes)
│   └── markdown-to-docx.test.ts (2 testes)
└── jest.setup.js                (configuração)
```

---

## 🎯 Padrão de Teste AAA

Todos os testes seguem o padrão:

```typescript
it('descrição do que é testado', () => {
  // 1. ARRANGE - Preparar dados
  const dados = { id: '1', nome: 'Teste' };

  // 2. ACT - Executar ação
  const resultado = minhaFuncao(dados);

  // 3. ASSERT - Validar resultado
  expect(resultado).toBe(esperado);
});
```

---

## 🛠️ Escrevendo Novo Teste

### Template Básico

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { MeuComponente } from '@/components/MeuComponente';

describe('MeuComponente', () => {
  it('deve renderizar sem erros', () => {
    render(<MeuComponente />);
    expect(screen.getByText('Texto esperado')).toBeInTheDocument();
  });
});
```

### Template com Mock

```typescript
import { render, screen } from '@testing-library/react';
import { MeuComponente } from '@/components/MeuComponente';
import { minhaFuncao } from '@/lib/funcao';

jest.mock('@/lib/funcao');

describe('MeuComponente', () => {
  it('deve chamar função ao clicar', () => {
    const mockFn = jest.fn();
    (minhaFuncao as jest.Mock).mockImplementation(mockFn);

    render(<MeuComponente />);
    fireEvent.click(screen.getByText('Clique'));

    expect(mockFn).toHaveBeenCalled();
  });
});
```

---

## 🔍 Utilitários Comuns

### Renderizar componente

```typescript
const { container } = render(<MeuComponente />);
```

### Buscar elementos

```typescript
screen.getByText('texto');
screen.getByPlaceholderText('placeholder');
screen.getByTitle('title');
screen.queryAllByText('texto'); // retorna array
```

### Simular eventos

```typescript
fireEvent.click(element);
fireEvent.change(input, { target: { value: 'novo valor' } });
fireEvent.keyDown(element, { key: 'Tab' });
```

### Assertions comuns

```typescript
expect(element).toBeInTheDocument();
expect(element).toBeDisabled();
expect(element).toHaveClass('classe');
expect(element).toHaveAttribute('aria-label');
expect(fn).toHaveBeenCalled();
expect(fn).toHaveBeenCalledWith('argumento');
```

### Aguardar elementos assincronos

```typescript
await waitFor(() => {
  expect(screen.getByText('texto')).toBeInTheDocument();
});
```

---

## ✅ Checklist para Novo Teste

- [ ] Nome descritivo do teste
- [ ] Teste uma única funcionalidade
- [ ] Sem dependências entre testes
- [ ] Cleanup automático (beforeEach/afterEach)
- [ ] Mocks configurados corretamente
- [ ] Assertions significativas
- [ ] Testes passando ✅

---

## 🐛 Debugging de Testes

### Ver HTML renderizado

```typescript
const { debug } = render(<MeuComponente />);
debug(); // imprime o HTML
```

### Pausar teste

```typescript
it('teste com pausa', async () => {
  render(<MeuComponente />);
  debugger; // coloca breakpoint aqui
  // Inicie com: node --inspect-brk node_modules/jest
});
```

### Ver logs

```typescript
console.log('Valor:', valor);
// Visto ao rodar npm test
```

---

## 🚨 Erros Comuns

### Erro: "Cannot find module"

**Solução:** Verificar imports e paths no tsconfig.json

### Erro: "Element not found"

**Solução:** Elemento pode estar em Dropdown/Modal. Use `screen.debug()`

### Erro: "Act() warning"

**Solução:** Envolver em `act()` ou usar `waitFor()`

### Erro: "timeout"

**Solução:** Aumentar timeout: `waitFor(() => {...}, { timeout: 5000 })`

---

## 📊 Interpretando Resultados

### Output Normal

```
PASS __tests__/components/Header.test.tsx
  ✓ deve renderizar sem erros (15ms)
  ✓ deve exibir informações (10ms)
```

### Com Falhas

```
FAIL __tests__/components/Header.test.tsx
  ✗ deve renderizar sem erros
    Expected "Markdown Studio" but got "undefined"
```

---

## 🔄 Integração Contínua

### GitHub Actions (exemplo)

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
```

---

## 📈 Melhorando Cobertura

### Executar com cobertura

```bash
npm run test:coverage
```

### Gera relatório em

```
coverage/
├── coverage/lcov-report/index.html (abrir no navegador)
├── coverage/coverage-final.json
└── coverage/clover.xml
```

### Adicionar ao .gitignore

```
coverage/
.nyc_output/
```

---

## 🎓 Boas Práticas

### ✅ Faça

- Testes focados e pequenos
- Nomes descritivos
- Dados de teste realistas
- Assertions específicas
- Testes independentes

### ❌ Evite

- Testes muito longos
- Testes interdependentes
- Mocks desnecessários
- Assertions genéricas
- Lógica complexa em testes

---

## 📚 Recursos

- **Jest Docs**: https://jestjs.io/docs/getting-started
- **Testing Library**: https://testing-library.com/docs/react-testing-library/intro/
- **React Testing**: https://react.dev/learn/testing

---

## 🎯 Próximos Passos

1. **Adicionar mais testes** para outros componentes
2. **E2E tests** com Playwright
3. **Performance testing** com Lighthouse
4. **Accessibility testing** com axe-core
5. **Coverage goals** (80%+)

---

**Parabéns! Agora você está pronto para escrever e manter testes!** 🚀
