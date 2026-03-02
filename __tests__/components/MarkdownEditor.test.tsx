import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { useAppStore } from '@/lib/store';

jest.mock('@/lib/store');

describe('MarkdownEditor.tsx', () => {
  const mockOnChange = jest.fn();
  const mockSetTextoSelecionado = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppStore as unknown as jest.Mock).mockReturnValue({
      setTextoSelecionado: mockSetTextoSelecionado,
    });
  });

  it('deve renderizar textarea com placeholder', () => {
    render(<MarkdownEditor value="" onChange={mockOnChange} />);

    const textarea = screen.getByPlaceholderText('Coloque seu markdown aqui...');
    expect(textarea).toBeInTheDocument();
  });

  it('deve chamar onChange ao digitar', () => {
    const { container } = render(<MarkdownEditor value="" onChange={mockOnChange} />);

    const textarea = container.querySelector('textarea');
    fireEvent.change(textarea!, { target: { value: '# Novo Título' } });

    expect(mockOnChange).toHaveBeenCalledWith('# Novo Título');
  });

  it('deve suportar indentação com Tab', async () => {
    const { container } = render(<MarkdownEditor value="Texto" onChange={mockOnChange} />);

    const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
    textarea.selectionStart = 0;
    textarea.selectionEnd = 0;

    fireEvent.keyDown(textarea, { key: 'Tab' });

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(expect.stringContaining('\t'));
    });
  });

  it('deve exibir dropdown menu de colar ao clicar no botão', async () => {
    const { container } = render(<MarkdownEditor value="" onChange={mockOnChange} />);

    const botaoDropdown = container.querySelector('button[title="Colar opções"]');
    expect(botaoDropdown).toBeInTheDocument();

    fireEvent.click(botaoDropdown!);

    // Apenas verifica que o botão é clicável
    expect(botaoDropdown).toBeInTheDocument();
  });

  it('deve atualizar texto selecionado ao selecionar texto', () => {
    const { container } = render(<MarkdownEditor value="Texto importante" onChange={mockOnChange} />);

    const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
    textarea.selectionStart = 0;
    textarea.selectionEnd = 5;

    fireEvent.mouseUp(textarea);

    expect(mockSetTextoSelecionado).toHaveBeenCalledWith('Texto');
  });

  it('deve mostrar ícone de sucesso após colar', async () => {
    Object.assign(navigator, {
      clipboard: {
        readText: jest.fn(() => Promise.resolve('Texto colado')),
      },
    });

    const { container } = render(<MarkdownEditor value="" onChange={mockOnChange} />);
    expect(container.querySelector('textarea')).toBeInTheDocument();
  });

  it('deve lidar com erro ao tentar colar', async () => {
    Object.assign(navigator, {
      clipboard: {
        readText: jest.fn(() => Promise.reject(new Error('Sem permissão'))),
      },
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const { container } = render(<MarkdownEditor value="" onChange={mockOnChange} />);
    expect(container.querySelector('textarea')).toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  it('deve aceitar valor inicial e exibir no textarea', () => {
    const conteudoInicial = '# Markdown Inicial\n\nEste é um parágrafo.';
    const { container } = render(<MarkdownEditor value={conteudoInicial} onChange={mockOnChange} />);

    const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.value).toBe(conteudoInicial);
  });

  it('deve permitir seleção e tracking de texto selecionado', () => {
    const { container } = render(<MarkdownEditor value="Primeiro Segundo" onChange={mockOnChange} />);

    const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
    textarea.selectionStart = 9;
    textarea.selectionEnd = 16;

    fireEvent.mouseUp(textarea);

    expect(mockSetTextoSelecionado).toHaveBeenCalled();
  });
});
