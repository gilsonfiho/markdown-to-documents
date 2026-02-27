import { create } from 'zustand';

export interface AbaData {
  id: string;
  nome: string;
  conteudo: string;
  salvoAoMemento: string | null;
}

interface AppStore {
  abas: AbaData[];
  abaAtiva: string;
  textoSelecionado: string;
  setAbaAtiva: (id: string) => void;
  setTextoSelecionado: (texto: string) => void;
  adicionarAba: () => void;
  removerAba: (id: string) => void;
  atualizarAba: (id: string, conteudo: string, nome?: string) => void;
  setSalvoAoMemento: (abaId: string, data: string | null) => void;
  carregarDoStorage: () => void;
  salvarNoStorage: (abaId?: string) => void;
  salvarTodasAsAbas: () => void;
  fecharTodasAsAbas: () => void;
}

const CHAVE_STORAGE_ABAS = 'markdown-studio-abas';
const CHAVE_STORAGE_ABA_ATIVA = 'markdown-studio-aba-ativa';

const MARKDOWN_PADRAO = `# Bem-vindo

## Como usar

1. Cole seu markdown aqui
2. Visualize em tempo real
3. Exporte para Word com um clique

\`\`\`typescript
const greeting = "Hello World";
\`\`\`

**Suporta** _markdown_ completo!`;

const gerarIdUnico = () => `aba-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const criarNovaAba = (nome: string = 'Novo documento'): AbaData => ({
  id: gerarIdUnico(),
  nome,
  conteudo: MARKDOWN_PADRAO,
  salvoAoMemento: null,
});

export const useAppStore = create<AppStore>((set, get) => ({
  abas: [criarNovaAba('Documento 1')],
  abaAtiva: '',
  textoSelecionado: '',
  setAbaAtiva: (id: string) => set({ abaAtiva: id }),
  setTextoSelecionado: (texto: string) => set({ textoSelecionado: texto }),
  adicionarAba: () => {
    const estado = get();
    const novaAba = criarNovaAba(`Documento ${estado.abas.length + 1}`);
    set({
      abas: [...estado.abas, novaAba],
      abaAtiva: novaAba.id,
    });
  },
  removerAba: (id: string) => {
    const estado = get();
    const novasAbas = estado.abas.filter((aba) => aba.id !== id);

    if (novasAbas.length === 0) {
      const novaAba = criarNovaAba('Documento 1');
      set({
        abas: [novaAba],
        abaAtiva: novaAba.id,
      });
    } else {
      const proximaAba = estado.abaAtiva === id ? novasAbas[novasAbas.length - 1] : estado.abas.find((a) => a.id !== id);
      set({
        abas: novasAbas,
        abaAtiva: proximaAba?.id || novasAbas[0].id,
      });
    }
  },
  atualizarAba: (id: string, conteudo: string, nome?: string) => {
    const estado = get();
    set({
      abas: estado.abas.map((aba) =>
        aba.id === id
          ? {
              ...aba,
              conteudo,
              nome: nome !== undefined ? nome : aba.nome,
            }
          : aba,
      ),
    });
  },
  setSalvoAoMemento: (abaId: string, data: string | null) => {
    const estado = get();
    set({
      abas: estado.abas.map((aba) =>
        aba.id === abaId
          ? {
              ...aba,
              salvoAoMemento: data,
            }
          : aba,
      ),
    });
  },
  carregarDoStorage: () => {
    if (typeof window !== 'undefined') {
      const abasSalvas = localStorage.getItem(CHAVE_STORAGE_ABAS);
      const abaAtivaId = localStorage.getItem(CHAVE_STORAGE_ABA_ATIVA);

      if (abasSalvas) {
        const abas = JSON.parse(abasSalvas) as AbaData[];
        const abaAtiva = abaAtivaId || abas[0]?.id || '';
        set({
          abas,
          abaAtiva,
        });
      } else {
        const novaAba = criarNovaAba('Documento 1');
        set({
          abas: [novaAba],
          abaAtiva: novaAba.id,
        });
      }
    }
  },
  salvarNoStorage: (abaId?: string) => {
    if (typeof window !== 'undefined') {
      const estado = get();
      const idAba = abaId || estado.abaAtiva;

      localStorage.setItem(CHAVE_STORAGE_ABAS, JSON.stringify(estado.abas));
      localStorage.setItem(CHAVE_STORAGE_ABA_ATIVA, estado.abaAtiva);

      const horario = new Date().toLocaleTimeString('pt-BR');
      get().setSalvoAoMemento(idAba, horario);

      setTimeout(() => {
        get().setSalvoAoMemento(idAba, null);
      }, 3000);
    }
  },
  salvarTodasAsAbas: () => {
    if (typeof window !== 'undefined') {
      const estado = get();
      localStorage.setItem(CHAVE_STORAGE_ABAS, JSON.stringify(estado.abas));
      localStorage.setItem(CHAVE_STORAGE_ABA_ATIVA, estado.abaAtiva);

      const horario = new Date().toLocaleTimeString('pt-BR');
      estado.abas.forEach((aba) => {
        get().setSalvoAoMemento(aba.id, horario);
        setTimeout(() => {
          get().setSalvoAoMemento(aba.id, null);
        }, 3000);
      });
    }
  },
  fecharTodasAsAbas: () => {
    const novaAba = criarNovaAba('Documento 1');
    set({
      abas: [novaAba],
      abaAtiva: novaAba.id,
    });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('markdown-studio-abas');
      localStorage.removeItem('markdown-studio-aba-ativa');
    }
  },
}));
