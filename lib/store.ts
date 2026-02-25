import { create } from 'zustand';

interface AppStore {
  markdown: string;
  setMarkdown: (content: string) => void;
  fileName: string;
  setFileName: (name: string) => void;
  salvoAoMemento: string | null;
  setSalvoAoMemento: (data: string) => void;
  carregarDoStorage: () => void;
  salvarNoStorage: () => void;
}

const CHAVE_STORAGE_MARKDOWN = 'markdown-studio-markdown';
const CHAVE_STORAGE_NOME_ARQUIVO = 'markdown-studio-nome-arquivo';

const MARKDOWN_PADRAO = `# Bem-vindo

## Como usar

1. Cole seu markdown aqui
2. Visualize em tempo real
3. Exporte para Word com um clique

\`\`\`typescript
const greeting = "Hello World";
\`\`\`

**Suporta** _markdown_ completo!`;

export const useAppStore = create<AppStore>((set, get) => ({
  markdown: MARKDOWN_PADRAO,
  setMarkdown: (content: string) => set({ markdown: content }),
  fileName: 'documento',
  setFileName: (name: string) => set({ fileName: name }),
  salvoAoMemento: null,
  setSalvoAoMemento: (data: string) => set({ salvoAoMemento: data }),
  carregarDoStorage: () => {
    if (typeof window !== 'undefined') {
      const markdownSalvo = localStorage.getItem(CHAVE_STORAGE_MARKDOWN);
      const nomeArquivoSalvo = localStorage.getItem(CHAVE_STORAGE_NOME_ARQUIVO);

      set({
        markdown: markdownSalvo || MARKDOWN_PADRAO,
        fileName: nomeArquivoSalvo || 'documento',
      });
    }
  },
  salvarNoStorage: () => {
    if (typeof window !== 'undefined') {
      const estado = get();
      localStorage.setItem(CHAVE_STORAGE_MARKDOWN, estado.markdown);
      localStorage.setItem(CHAVE_STORAGE_NOME_ARQUIVO, estado.fileName);
      set({ salvoAoMemento: new Date().toLocaleTimeString('pt-BR') });

      setTimeout(() => {
        set({ salvoAoMemento: null });
      }, 3000);
    }
  },
}));
