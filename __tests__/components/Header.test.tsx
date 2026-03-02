import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { Header } from '@/components/Header';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';

jest.mock('next-auth/react');
jest.mock('sonner');
jest.mock('@/lib/store');

describe('Header.tsx', () => {
  const mockSession = {
    user: {
      name: 'João Silva',
      email: 'joao@example.com',
      image: 'https://example.com/avatar.jpg',
    },
  };

  const mockAbas = [
    { id: '1', nome: 'Documento 1', conteudo: '# Título 1', salvoAoMemento: null },
    { id: '2', nome: 'Documento 2', conteudo: '# Título 2', salvoAoMemento: null },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppStore as jest.Mock).mockReturnValue({
      abas: mockAbas,
      salvarTodasAsAbas: jest.fn(),
      fecharTodasAsAbas: jest.fn(),
    });
  });

  it('deve renderizar sem erros', () => {
    (SessionProvider as jest.Mock).mockImplementation(({ children }) => children);
    render(<Header />);
    expect(screen.getByText('Markdown Studio')).toBeInTheDocument();
  });

  it('deve exibir informações do usuário quando logado', () => {
    (SessionProvider as jest.Mock).mockImplementation(({ children }) => children);
    (useAppStore as jest.Mock).mockReturnValueOnce({
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
    (useAppStore as jest.Mock).mockReturnValue({
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
    (useAppStore as jest.Mock).mockReturnValue({
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
    (useAppStore as jest.Mock).mockReturnValue({
      abas: [],
      salvarTodasAsAbas: jest.fn(),
      fecharTodasAsAbas: jest.fn(),
    });

    render(<Header />);
    const botaoExportar = screen.getByText('Exportar tudo');

    expect(botaoExportar).toBeDisabled();
  });

  it('deve exibir dropdown menu com opções de exportação', async () => {
    (useAppStore as jest.Mock).mockReturnValue({
      abas: mockAbas,
      salvarTodasAsAbas: jest.fn(),
      fecharTodasAsAbas: jest.fn(),
    });

    render(<Header />);
    const botaoExportar = screen.getByText('Exportar tudo');

    fireEvent.click(botaoExportar);

    await waitFor(() => {
      expect(screen.getByText('Baixar Todas (.docx)')).toBeInTheDocument();
      expect(screen.getByText('Copiar Todas para Área de Transf.')).toBeInTheDocument();
      expect(screen.getByText('Baixar Todas como HTML')).toBeInTheDocument();
      expect(screen.getByText('Exportar Todas como PDF')).toBeInTheDocument();
    });
  });

  it('deve exibir versão da aplicação', () => {
    render(<Header />);
    const versionBadge = screen.getByText(/v\d+\.\d+\.\d+/);
    expect(versionBadge).toBeInTheDocument();
  });
});
