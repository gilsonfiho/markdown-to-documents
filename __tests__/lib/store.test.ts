import { useAppStore } from '@/lib/store';

describe('useAppStore', () => {
  beforeEach(() => {
    // Limpar localStorage antes de cada teste
    const { fecharTodasAsAbas } = useAppStore.getState();
    fecharTodasAsAbas();
  });

  it('deve adicionar uma nova aba', () => {
    const { adicionarAba, abas } = useAppStore.getState();
    const abasAntes = abas.length;

    adicionarAba();

    const { abas: abasDepois } = useAppStore.getState();
    expect(abasDepois.length).toBe(abasAntes + 1);
  });

  it('deve remover uma aba', () => {
    const { adicionarAba, removerAba } = useAppStore.getState();
    adicionarAba();

    const { abas: abasComNova } = useAppStore.getState();
    const idAbaPrimeira = abasComNova[0].id;

    removerAba(idAbaPrimeira);

    const { abas: abasComRemocao } = useAppStore.getState();
    expect(abasComRemocao.length).toBe(abasComNova.length - 1);
  });

  it('deve atualizar conteúdo de uma aba', () => {
    const { abas, atualizarAba } = useAppStore.getState();
    const idAba = abas[0].id;
    const novoConteudo = '# Novo Título\n\nNovo conteúdo';

    atualizarAba(idAba, novoConteudo);

    const { abas: abasAtualizado } = useAppStore.getState();
    const abaAtualizada = abasAtualizado.find((a) => a.id === idAba);
    expect(abaAtualizada?.conteudo).toBe(novoConteudo);
  });

  it('deve manter sempre pelo menos 1 aba', () => {
    const { removerAba, abas } = useAppStore.getState();
    const idAbaUnica = abas[0].id;

    // Tentar remover a única aba não deve funcionar
    removerAba(idAbaUnica);

    const { abas: abasAposTentarRemover } = useAppStore.getState();
    expect(abasAposTentarRemover.length).toBeGreaterThanOrEqual(1);
  });

  it('deve retornar a aba ativa corretamente', () => {
    const { abaAtiva } = useAppStore.getState();
    expect(abaAtiva).toBeDefined();
    expect(typeof abaAtiva).toBe('string');
  });
});
