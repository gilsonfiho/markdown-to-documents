import { create } from 'zustand';

interface AppStore {
  markdown: string;
  setMarkdown: (content: string) => void;
  fileName: string;
  setFileName: (name: string) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  markdown: `# Bem-vindo

## Como usar

1. Cole seu markdown aqui
2. Visualize em tempo real
3. Exporte para Word com um clique

\`\`\`typescript
const greeting = "Hello World";
\`\`\`

**Suporta** _markdown_ completo!`,
  setMarkdown: (content: string) => set({ markdown: content }),
  fileName: 'documento',
  setFileName: (name: string) => set({ fileName: name }),
}));
