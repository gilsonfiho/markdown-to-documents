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

  it('deve renomear uma aba', () => {
    const { abas, atualizarAba } = useAppStore.getState();
    const idAba = abas[0].id;
    const novoNome = 'Aba Renomeada';

    atualizarAba(idAba, abas[0].conteudo, novoNome);

    const { abas: abasAtualizadas } = useAppStore.getState();
    const abaRenomeada = abasAtualizadas.find((a) => a.id === idAba);
    expect(abaRenomeada?.nome).toBe(novoNome);
  });

  it('deve mudar a aba ativa', () => {
    const { adicionarAba, setAbaAtiva } = useAppStore.getState();
    adicionarAba();

    const { abas } = useAppStore.getState();
    const novoIdAba = abas[1].id;

    setAbaAtiva(novoIdAba);

    const { abaAtiva } = useAppStore.getState();
    expect(abaAtiva).toBe(novoIdAba);
  });

  it('deve salvar todas as abas com timestamp', () => {
    const { adicionarAba, salvarTodasAsAbas } = useAppStore.getState();

    adicionarAba();
    salvarTodasAsAbas();

    const { abas } = useAppStore.getState();
    const todasComTimestamp = abas.every((a) => a.salvoAoMemento !== null);
    expect(todasComTimestamp).toBe(true);
  });

  it('deve definir timestamp de salvamento', () => {
    const { abas, setSalvoAoMemento } = useAppStore.getState();
    const idAba = abas[0].id;
    const timestamp = '14:30:45';

    setSalvoAoMemento(idAba, timestamp);

    const { abas: abasComTimestamp } = useAppStore.getState();
    const abaComSalvo = abasComTimestamp.find((a) => a.id === idAba);
    expect(abaComSalvo?.salvoAoMemento).toBe(timestamp);
  });

  it('deve limpar timestamp quando null', () => {
    const { abas, setSalvoAoMemento } = useAppStore.getState();
    const idAba = abas[0].id;

    setSalvoAoMemento(idAba, '14:30:45');
    setSalvoAoMemento(idAba, null);

    const { abas: abasLimpas } = useAppStore.getState();
    const abaLimpa = abasLimpas.find((a) => a.id === idAba);
    expect(abaLimpa?.salvoAoMemento).toBeNull();
  });

  it('deve rastrear texto selecionado', () => {
    const { setTextoSelecionado } = useAppStore.getState();

    setTextoSelecionado('Texto importante selecionado');

    const { textoSelecionado } = useAppStore.getState();
    expect(textoSelecionado).toBe('Texto importante selecionado');
  });

  it('deve gerar IDs únicos para diferentes abas', () => {
    const { adicionarAba } = useAppStore.getState();

    adicionarAba();
    adicionarAba();
    adicionarAba();

    const { abas: abasDepois } = useAppStore.getState();
    const ids = abasDepois.map((a) => a.id);
    const idsUnicos = new Set(ids);

    expect(idsUnicos.size).toBe(ids.length);
  });

  it('deve salvar todas as abas com timestamp', () => {
    const { adicionarAba, salvarTodasAsAbas } = useAppStore.getState();

    adicionarAba();
    salvarTodasAsAbas();

    const { abas } = useAppStore.getState();
    const todasComTimestamp = abas.every((a) => a.salvoAoMemento !== null);
    expect(todasComTimestamp).toBe(true);
  });

  it('deve resetar tudo ao fechar todas abas', () => {
    const { adicionarAba, atualizarAba, fecharTodasAsAbas } = useAppStore.getState();

    adicionarAba();
    adicionarAba();
    const { abas: abasComAdições } = useAppStore.getState();
    const idPrimeira = abasComAdições[0].id;
    atualizarAba(idPrimeira, 'Conteúdo importante', 'Nome importante');

    fecharTodasAsAbas();

    const { abas: abasReset, abaAtiva } = useAppStore.getState();
    expect(abasReset).toHaveLength(1);
    expect(abasReset[0].nome).toBeDefined();
    expect(abaAtiva).toBeDefined();
  });
});
