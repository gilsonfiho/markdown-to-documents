'use client';

import React, { useRef, useState } from 'react';
import { CheckCircle2, Clipboard, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [colado, setColado] = useState(false);
  const [dropdownAberto, setDropdownAberto] = useState(false);

  const handleColar = async () => {
    try {
      const texto = await navigator.clipboard.readText();
      if (textareaRef.current) {
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const novoValor = value.substring(0, start) + texto + value.substring(end);
        onChange(novoValor);

        setColado(true);
        setDropdownAberto(false);
        setTimeout(() => setColado(false), 2000);

        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
              start + texto.length;
            textareaRef.current.focus();
          }
        }, 0);
      }
    } catch (error) {
      console.error('Erro ao colar:', error);
    }
  };

  const handleLimparEColar = async () => {
    try {
      const texto = await navigator.clipboard.readText();
      onChange(texto);

      setColado(true);
      setDropdownAberto(false);
      setTimeout(() => setColado(false), 2000);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = texto.length;
          textareaRef.current.focus();
        }
      }, 0);
    } catch (error) {
      console.error('Erro ao colar:', error);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
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
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        className="flex-1 p-6 font-mono text-sm text-neutral-900 bg-white resize-none focus:outline-none border-r border-neutral-200"
        placeholder="Coloque seu markdown aqui..."
        spellCheck="false"
      />
      <div className="absolute top-4 right-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setDropdownAberto(!dropdownAberto)}
          className="flex items-center gap-1 px-3 py-2 text-neutral-400 hover:text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
          title="Colar opções"
        >
          {colado ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CheckCircle2 size={18} className="text-green-600" />
            </motion.div>
          ) : (
            <>
              <Clipboard size={18} />
              <ChevronDown size={14} />
            </>
          )}
        </motion.button>

        {dropdownAberto && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 min-w-[180px]"
          >
            <motion.button
              whileHover={{ backgroundColor: '#f3f4f6' }}
              onClick={handleColar}
              className="w-full px-4 py-2 text-sm text-neutral-700 text-left rounded-t-lg transition-colors hover:bg-neutral-100 flex items-center gap-2"
            >
              <Clipboard size={14} />
              <span>Colar</span>
            </motion.button>
            <div className="border-t border-neutral-200" />
            <motion.button
              whileHover={{ backgroundColor: '#f3f4f6' }}
              onClick={handleLimparEColar}
              className="w-full px-4 py-2 text-sm text-neutral-700 text-left rounded-b-lg transition-colors hover:bg-neutral-100 flex items-center gap-2"
            >
              <Clipboard size={14} />
              <span>Limpar e colar</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
