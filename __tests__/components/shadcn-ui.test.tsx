import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

describe('Componentes shadcn/ui', () => {
  describe('Button', () => {
    it('deve renderizar botão com texto', () => {
      render(<Button>Clique aqui</Button>);
      expect(screen.getByText('Clique aqui')).toBeInTheDocument();
    });

    it('deve ser desabilitado corretamente', () => {
      render(<Button disabled>Desabilitado</Button>);
      const button = screen.getByText('Desabilitado') as HTMLButtonElement;
      expect(button.disabled).toBe(true);
    });
  });

  describe('Input', () => {
    it('deve renderizar input sem erro', () => {
      render(<Input />);
      const input = document.querySelector('input');
      expect(input).toBeInTheDocument();
    });

    it('deve aceitar placeholder', () => {
      render(<Input placeholder="Digite aqui..." />);
      const input = screen.getByPlaceholderText('Digite aqui...') as HTMLInputElement;
      expect(input).toBeInTheDocument();
    });

    it('deve ser desabilitado corretamente', () => {
      const { container } = render(<Input disabled />);
      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.disabled).toBe(true);
    });
  });

  describe('Textarea', () => {
    it('deve renderizar textarea sem erro', () => {
      render(<Textarea />);
      const textarea = document.querySelector('textarea');
      expect(textarea).toBeInTheDocument();
    });

    it('deve aceitar placeholder', () => {
      render(<Textarea placeholder="Digite seu texto..." />);
      const textarea = screen.getByPlaceholderText('Digite seu texto...') as HTMLTextAreaElement;
      expect(textarea).toBeInTheDocument();
    });

    it('deve ser desabilitado corretamente', () => {
      const { container } = render(<Textarea disabled />);
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
      expect(textarea.disabled).toBe(true);
    });
  });

  describe('Badge', () => {
    it('deve renderizar badge com texto', () => {
      render(<Badge>Ativo</Badge>);
      expect(screen.getByText('Ativo')).toBeInTheDocument();
    });
  });
});
