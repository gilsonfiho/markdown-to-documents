'use client';

import React, { useRef, useState } from 'react';
import { CheckCircle2, Clipboard } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [colado, setColado] = useState(false);
  const { setTextoSelecionado } = useAppStore();

  const handleColar = async () => {
    try {
      const texto = await navigator.clipboard.readText();
      if (textareaRef.current) {
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const novoValor = value.substring(0, start) + texto + value.substring(end);
        onChange(novoValor);

        setColado(true);
        setTimeout(() => setColado(false), 2000);

        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + texto.length;
            textareaRef.current.focus();
          }
        }, 0);
      }
    } catch (erro) {
      console.error('Erro ao colar:', erro);
    }
  };

  const handleLimparEColar = async () => {
    try {
      const texto = await navigator.clipboard.readText();
      onChange(texto);

      setColado(true);
      setTimeout(() => setColado(false), 2000);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = texto.length;
          textareaRef.current.focus();
        }
      }, 0);
    } catch (erro) {
      console.error('Erro ao colar:', erro);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    atualizarSelecionado();
  };

  const atualizarSelecionado = () => {
    if (textareaRef.current) {
      const inicio = textareaRef.current.selectionStart;
      const fim = textareaRef.current.selectionEnd;
      const selecionado = value.substring(inicio, fim);
      setTextoSelecionado(selecionado);
    }
  };

  const handleMouseUp = () => {
    atualizarSelecionado();
  };

  const handleKeyUp = () => {
    atualizarSelecionado();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newValue = value.substring(0, start) + '\t' + value.substring(end);
        onChange(newValue);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1;
        }, 0);
      }
    }
  };

  return (
    <div className="relative h-full flex flex-col">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onMouseUp={handleMouseUp}
        onKeyUp={handleKeyUp}
        className="flex-1 p-6 font-mono text-sm text-neutral-900 resize-none focus-visible:ring-0 border-r border-neutral-200 rounded-none"
        placeholder="Coloque seu markdown aqui..."
        spellCheck="false"
      />
      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" className="h-9 w-9 p-0 text-neutral-400 hover:text-purple-600" title="Colar opções">
              {colado ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.2 }}>
                  <CheckCircle2 size={18} className="text-green-600" />
                </motion.div>
              ) : (
                <Clipboard size={18} />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            <DropdownMenuItem onClick={handleColar} className="flex gap-3 cursor-pointer">
              <Clipboard size={14} />
              <span>Colar</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLimparEColar} className="flex gap-3 cursor-pointer">
              <Clipboard size={14} />
              <span>Limpar e colar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
