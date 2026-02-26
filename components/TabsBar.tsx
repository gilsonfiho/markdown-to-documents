'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAppStore, type AbaData } from '@/lib/store';
import { Plus, X, ChevronLeft, ChevronRight, Save, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const TabsBar: React.FC = () => {
  const { abas, abaAtiva, setAbaAtiva, adicionarAba, removerAba, atualizarAba, salvarNoStorage } =
    useAppStore();
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [novoNome, setNovoNome] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const handleAdicionarAba = () => {
    adicionarAba();
  };

  const handleSalvarAba = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    salvarNoStorage(id);
  };

  const handleRemoverAba = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (abas.length > 1) {
      removerAba(id);
    }
  };

  const handleRenomear = (aba: AbaData) => {
    setEditandoId(aba.id);
    setNovoNome(aba.nome);
  };

  const finalizarRenomeacao = () => {
    if (editandoId && novoNome.trim()) {
      atualizarAba(editandoId, abas.find((a) => a.id === editandoId)?.conteudo || '', novoNome);
    }
    setEditandoId(null);
    setNovoNome('');
  };

  const verificarScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    verificarScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', verificarScroll);
      window.addEventListener('resize', verificarScroll);
      return () => {
        container.removeEventListener('scroll', verificarScroll);
        window.removeEventListener('resize', verificarScroll);
      };
    }
  }, [abas]);

  const rolarEsquerda = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const rolarDireita = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex items-center gap-0 px-2 py-3 bg-neutral-50 border-b border-neutral-200">
      {/* Botão scroll esquerda */}
      {canScrollLeft && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={rolarEsquerda}
          className="flex items-center justify-center p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200 rounded-lg transition-colors flex-shrink-0"
          title="Rolar para esquerda"
        >
          <ChevronLeft size={18} />
        </motion.button>
      )}

      {/* Container com scroll horizontal */}
      <div
        ref={scrollContainerRef}
        className="flex-1 flex items-center gap-1 px-2 overflow-x-auto overflow-y-hidden scroll-smooth"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#d1d5db #f3f4f6',
        }}
      >
        {abas.map((aba) => (
          <motion.div
            key={aba.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer whitespace-nowrap transition-all flex-shrink-0 ${
              abaAtiva === aba.id
                ? 'bg-white border border-neutral-300 shadow-sm'
                : 'hover:bg-neutral-100 border border-transparent'
            }`}
            onClick={() => setAbaAtiva(aba.id)}
          >
            {editandoId === aba.id ? (
              <input
                autoFocus
                type="text"
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
                onBlur={finalizarRenomeacao}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') finalizarRenomeacao();
                  if (e.key === 'Escape') {
                    setEditandoId(null);
                    setNovoNome('');
                  }
                }}
                className="px-2 py-1 text-sm bg-white border border-blue-500 rounded focus:outline-none max-w-[150px]"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <>
                <span
                  className="text-sm font-medium text-neutral-700 max-w-[150px] truncate"
                  onDoubleClick={() => handleRenomear(aba)}
                  title={aba.nome}
                >
                  {aba.nome}
                </span>
                {aba.salvoAoMemento && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CheckCircle2 size={16} className="text-green-600" />
                  </motion.div>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => handleSalvarAba(e, aba.id)}
                  className="flex items-center justify-center text-neutral-400 hover:text-blue-600 p-1 rounded hover:bg-blue-100 transition-colors"
                  title="Salvar aba"
                >
                  <Save size={14} />
                </motion.button>
              </>
            )}

            {abas.length > 1 && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleRemoverAba(e, aba.id)}
                className="flex items-center justify-center text-neutral-400 hover:text-neutral-600 p-1 rounded hover:bg-neutral-200"
                title="Fechar aba"
              >
                <X size={16} />
              </motion.button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Botão scroll direita */}
      {canScrollRight && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={rolarDireita}
          className="flex items-center justify-center p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200 rounded-lg transition-colors flex-shrink-0"
          title="Rolar para direita"
        >
          <ChevronRight size={18} />
        </motion.button>
      )}

      {/* Botão adicionar nova aba */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleAdicionarAba}
        className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors border border-neutral-200 hover:border-neutral-300 flex-shrink-0"
        title="Adicionar nova aba"
      >
        <Plus size={16} />
        <span className="text-sm font-medium">Nova</span>
      </motion.button>
    </div>
  );
};
