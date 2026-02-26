'use client';

import React, { useEffect, useRef, useState } from 'react';
import { type AbaData, useAppStore } from '@/lib/store';
import { CheckCircle2, ChevronLeft, ChevronRight, Download, Plus, Save, X, Clipboard, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { markdownToDocx } from '@/lib/markdown-to-docx';

export const TabsBar: React.FC = () => {
  const { abas, abaAtiva, setAbaAtiva, adicionarAba, removerAba, atualizarAba, salvarNoStorage } =
    useAppStore();
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [novoNome, setNovoNome] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [abaExportando, setAbaExportando] = useState<string | null>(null);
  const [menuExportarId, setMenuExportarId] = useState<string | null>(null);
  const [abaCopiadaId, setAbaCopiadaId] = useState<string | null>(null);

  const handleAdicionarAba = () => {
    adicionarAba();
  };

  const handleSalvarAba = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    salvarNoStorage(id);
  };

  const handleExportarAba = async (e: React.MouseEvent, aba: AbaData) => {
    e.stopPropagation();
    setMenuExportarId(null);
    setAbaExportando(aba.id);
    try {
      await markdownToDocx(aba.conteudo, aba.nome);
    } catch (_error) {
      // Erro tratado silenciosamente
    } finally {
      setAbaExportando(null);
    }
  };

  const handleCopiarAba = async (e: React.MouseEvent, aba: AbaData) => {
    e.stopPropagation();
    setMenuExportarId(null);
    try {
      await navigator.clipboard.writeText(aba.conteudo);
      setAbaCopiadaId(aba.id);
      setTimeout(() => setAbaCopiadaId(null), 2000);
    } catch (_error) {
      // Erro tratado silenciosamente
    }
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

  useEffect(() => {
    const handleFecharMenu = () => setMenuExportarId(null);
    window.addEventListener('click', handleFecharMenu);
    return () => window.removeEventListener('click', handleFecharMenu);
  }, []);

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
    <div className="flex items-center gap-0 px-1 py-1 bg-neutral-50 border-b border-neutral-200">
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
        className="flex-1 flex items-center gap-1 px-2 overflow-x-auto overflow-y-visible scroll-smooth"
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
            className={`flex items-center gap-2 px-2 py-1 rounded-lg font-bold cursor-pointer whitespace-nowrap transition-all flex-shrink-0 ${
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
                    <CheckCircle2 size={13} className="text-green-600" />
                  </motion.div>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => handleSalvarAba(e, aba.id)}
                  className="flex items-center justify-center text-neutral-400 hover:text-blue-600 p-1 rounded hover:bg-blue-100 transition-colors"
                  title="Salvar aba"
                >
                  <Save size={13} />
                </motion.button>
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuExportarId(menuExportarId === aba.id ? null : aba.id);
                    }}
                    className={`flex items-center gap-0.5 text-neutral-400 hover:text-purple-600 p-1 rounded hover:bg-purple-100 transition-colors ${
                      menuExportarId === aba.id ? 'bg-purple-100 text-purple-600' : ''
                    }`}
                    title="Exportar aba"
                  >
                    {abaExportando === aba.id ? (
                      <div className="animate-spin">
                        <Download size={13} />
                      </div>
                    ) : (
                      <>
                        <Download size={13} />
                        <ChevronDown size={10} />
                      </>
                    )}
                  </motion.button>
                  <AnimatePresence>
                    {menuExportarId === aba.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute right-0 mt-1 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={(e) => handleExportarAba(e, aba)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-100 transition-colors text-left font-medium"
                        >
                          <Download size={12} className="text-purple-500" />
                          Baixar Documento (.docx)
                        </button>
                        <button
                          onClick={(e) => handleCopiarAba(e, aba)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-100 transition-colors text-left font-medium border-t border-neutral-100"
                        >
                          {abaCopiadaId === aba.id ? (
                            <CheckCircle2 size={12} className="text-green-500" />
                          ) : (
                            <Clipboard size={12} className="text-purple-500" />
                          )}
                          Copiar para Área de Transferência
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
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
