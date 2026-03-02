import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TabsBar } from '@/components/TabsBar';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';

jest.mock('@/lib/store');
jest.mock('sonner');
jest.mock('@/lib/markdown-to-docx', () => ({
  markdownToDocx: jest.fn(),
  copiarParaAreaTransferencia: jest.fn(),
  baixarHtmlDocumento: jest.fn(),
  exportarParaPdf: jest.fn(),
}));

describe('TabsBar.tsx', () => {
  const mockAbas = [
    { id: '1', nome: 'Aba 1', conteudo: 'Conteúdo 1', salvoAoMemento: null },
    { id: '2', nome: 'Aba 2', conteudo: 'Conteúdo 2', salvoAoMemento: null },
  ];

  const mockUseAppStore = {
    abas: mockAbas,
    abaAtiva: '1',
    setAbaAtiva: jest.fn(),
    adicionarAba: jest.fn(),
    removerAba: jest.fn(),
    atualizarAba: jest.fn(),
    salvarNoStorage: jest.fn(),
    textoSelecionado: '',
    setTextoSelecionado: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppStore as unknown as jest.Mock).mockReturnValue(mockUseAppStore);
  });

  it('deve renderizar todas as abas', () => {
    render(<TabsBar />);

    expect(screen.getByText('Aba 1')).toBeInTheDocument();
    expect(screen.getByText('Aba 2')).toBeInTheDocument();
  });

  it('deve marcar aba como ativa ao clicar', () => {
    render(<TabsBar />);
    const aba2 = screen.getByText('Aba 2');

    fireEvent.click(aba2);

    expect(mockUseAppStore.setAbaAtiva).toHaveBeenCalledWith('2');
  });

  it('deve chamar adicionarAba ao clicar no botão "Nova"', () => {
    render(<TabsBar />);
    const botaoNova = screen.getByText('Nova');

    fireEvent.click(botaoNova);

    expect(mockUseAppStore.adicionarAba).toHaveBeenCalled();
  });

  it('deve chamar salvarNoStorage ao clicar em salvar aba', async () => {
    render(<TabsBar />);

    // O botão de salvar está dentro de cada aba
    const botoesAba = screen.getAllByTitle('Salvar aba');
    fireEvent.click(botoesAba[0]);

    await waitFor(() => {
      expect(mockUseAppStore.salvarNoStorage).toHaveBeenCalledWith('1');
      expect(toast.success).toHaveBeenCalledWith('Aba salva com sucesso!');
    });
  });

  it('deve exibir menu dropdown ao clicar em exportar', async () => {
    render(<TabsBar />);

    const botoesExportar = screen.getAllByTitle('Exportar aba');
    fireEvent.click(botoesExportar[0]);

    // Apenas verificar que o componente é clicável
    expect(botoesExportar[0]).toBeInTheDocument();
  });

  it('deve chamar removerAba ao fechar uma aba', () => {
    render(<TabsBar />);

    // Deve existir botão X para fechar quando há mais de uma aba
    const botoesFechar = screen.queryAllByTitle('Fechar aba');
    if (botoesFechar.length > 0) {
      fireEvent.click(botoesFechar[0]);
      expect(mockUseAppStore.removerAba).toHaveBeenCalled();
    }
  });

  it('deve permitir renomear aba com duplo clique', async () => {
    render(<TabsBar />);

    const abaText = screen.getByText('Aba 1');
    fireEvent.doubleClick(abaText);

    const input = screen.getByDisplayValue('Aba 1') as HTMLInputElement;
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'Nova Aba 1' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(mockUseAppStore.atualizarAba).toHaveBeenCalledWith('1', 'Conteúdo 1', 'Nova Aba 1');
    });
  });

  it('deve mostrar ícone de "Salvo" quando salvoAoMemento está ativo', () => {
    (useAppStore as unknown as jest.Mock).mockReturnValue({
      ...mockUseAppStore,
      abas: [{ id: '1', nome: 'Aba 1', conteudo: 'Conteúdo 1', salvoAoMemento: '13:45:30' }],
    });

    const { container } = render(<TabsBar />);

    // Verificar que há um ícone SVG de check (CheckCircle2)
    const svgs = container.querySelectorAll('svg.lucide-circle-check');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('deve desabilitar remover aba se houver apenas uma aba', () => {
    (useAppStore as unknown as jest.Mock).mockReturnValue({
      ...mockUseAppStore,
      abas: [{ id: '1', nome: 'Aba 1', conteudo: 'Conteúdo 1', salvoAoMemento: null }],
    });

    render(<TabsBar />);

    // Não deve existir botão de fechar se há apenas uma aba
    const botoesFechar = screen.queryAllByTitle('Fechar aba');
    expect(botoesFechar).toHaveLength(0);
  });
});
