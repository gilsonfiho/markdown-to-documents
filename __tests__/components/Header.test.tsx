import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Header } from '@/components/Header';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

jest.mock('next-auth/react');
jest.mock('sonner');
jest.mock('@/lib/store');

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;

describe('Header.tsx', () => {
  const mockSession = {
    user: {
      name: 'João Silva',
      email: 'joao@example.com',
      image: 'https://example.com/avatar.jpg',
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };

  const mockAbas = [
    { id: '1', nome: 'Documento 1', conteudo: '# Título 1', salvoAoMemento: null },
    { id: '2', nome: 'Documento 2', conteudo: '# Título 2', salvoAoMemento: null },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock useSession com dados padrão
    mockUseSession.mockReturnValue({
      data: mockSession,
      status: 'authenticated',
      update: jest.fn(),
    } as any);

    (useAppStore as unknown as jest.Mock).mockReturnValue({
      abas: mockAbas,
      salvarTodasAsAbas: jest.fn(),
      fecharTodasAsAbas: jest.fn(),
    });
  });

  it('deve renderizar sem erros', () => {
    render(<Header />);
    expect(screen.getByText('Markdown Studio')).toBeInTheDocument();
  });

  it('deve exibir informações do usuário quando logado', () => {
    mockUseSession.mockReturnValue({
      data: mockSession,
      status: 'authenticated',
      update: jest.fn(),
    } as any);

    (useAppStore as unknown as jest.Mock).mockReturnValue({
      abas: mockAbas,
      salvarTodasAsAbas: jest.fn(),
      fecharTodasAsAbas: jest.fn(),
    });

    render(<Header />);
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('joao@example.com')).toBeInTheDocument();
  });

  it('deve chamar salvarTodasAsAbas ao clicar em "Salvar tudo"', async () => {
    const mockSalvarTodas = jest.fn();
    (useAppStore as unknown as jest.Mock).mockReturnValue({
      abas: mockAbas,
      salvarTodasAsAbas: mockSalvarTodas,
      fecharTodasAsAbas: jest.fn(),
    });

    render(<Header />);
    const botaoSalvar = screen.getByText('Salvar tudo');

    fireEvent.click(botaoSalvar);

    await waitFor(() => {
      expect(mockSalvarTodas).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Todos os documentos foram salvos!');
    });
  });

  it('deve chamar fecharTodasAsAbas ao clicar em "Fechar tudo"', async () => {
    const mockFecharTodas = jest.fn();
    (useAppStore as unknown as jest.Mock).mockReturnValue({
      abas: mockAbas,
      salvarTodasAsAbas: jest.fn(),
      fecharTodasAsAbas: mockFecharTodas,
    });

    render(<Header />);
    const botaoFechar = screen.getByText('Fechar tudo');

    fireEvent.click(botaoFechar);

    await waitFor(() => {
      expect(mockFecharTodas).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Área de trabalho limpa!');
    });
  });

  it('deve desabilitar botão "Exportar tudo" quando não há abas', () => {
    (useAppStore as unknown as jest.Mock).mockReturnValue({
      abas: [],
      salvarTodasAsAbas: jest.fn(),
      fecharTodasAsAbas: jest.fn(),
    });

    render(<Header />);
    const buttons = screen.getAllByRole('button');
    const botaoExportar = buttons.find((btn) => btn.textContent?.includes('Exportar tudo'));

    expect(botaoExportar).toBeDisabled();
  });

  it('deve exibir dropdown menu com opções de exportação', async () => {
    (useAppStore as unknown as jest.Mock).mockReturnValue({
      abas: mockAbas,
      salvarTodasAsAbas: jest.fn(),
      fecharTodasAsAbas: jest.fn(),
    });

    render(<Header />);
    const buttons = screen.getAllByRole('button');
    const botaoExportar = buttons.find((btn) => btn.textContent?.includes('Exportar tudo'));

    expect(botaoExportar).toBeInTheDocument();
    expect(botaoExportar).not.toBeDisabled();
  });

  it('deve exibir versão da aplicação', () => {
    render(<Header />);
    const versionBadge = screen.getByText(/v\d+\.\d+\.\d+/);
    expect(versionBadge).toBeInTheDocument();
  });
});
