'use client';

import React, { useEffect, useRef, useState } from 'react';
import { type AbaData, useAppStore } from '@/lib/store';
import { CheckCircle2, ChevronLeft, ChevronRight, Clipboard, Download, FileJson, FileText, Plus, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { baixarHtmlDocumento, copiarParaAreaTransferencia, exportarParaPdf, markdownToDocx } from '@/lib/markdown-to-docx';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export const TabsBar: React.FC = () => {
  const { abas, abaAtiva, setAbaAtiva, adicionarAba, removerAba, atualizarAba, salvarNoStorage, textoSelecionado } = useAppStore();
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [novoNome, setNovoNome] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [abaExportando, setAbaExportando] = useState<string | null>(null);
  const [abaCopiadaId, setAbaCopiadaId] = useState<string | null>(null);

  const handleAdicionarAba = () => {
    adicionarAba();
  };

  const handleSalvarAba = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    salvarNoStorage(id);
    toast.success('Aba salva com sucesso!');
  };

  const handleExportarAba = async (e: React.MouseEvent, aba: AbaData) => {
    e.stopPropagation();
    setAbaExportando(aba.id);
    try {
      const conteudo = textoSelecionado || aba.conteudo;
      await markdownToDocx(conteudo, aba.nome);
      toast.success(`Documento "${aba.nome}" exportado com sucesso!`);
    } catch (erro) {
      toast.error('Erro ao exportar. Verifique o console.');
      console.error('Erro ao exportar aba:', erro);
    } finally {
      setAbaExportando(null);
    }
  };

  const handleCopiarAba = async (e: React.MouseEvent, aba: AbaData) => {
    e.stopPropagation();
    try {
      const conteudo = textoSelecionado || aba.conteudo;
      await copiarParaAreaTransferencia(conteudo);
      setAbaCopiadaId(aba.id);
      toast.success('Conteúdo copiado para a área de transferência!');
      setTimeout(() => setAbaCopiadaId(null), 2000);
    } catch (erro) {
      toast.error('Erro ao copiar.');
      console.error('Erro ao copiar aba:', erro);
      setAbaCopiadaId(null);
    }
  };

  const handleBaixarHtml = async (e: React.MouseEvent, aba: AbaData) => {
    e.stopPropagation();
    try {
      const conteudo = textoSelecionado || aba.conteudo;
      await baixarHtmlDocumento(conteudo, aba.nome);
      toast.success(`HTML "${aba.nome}" baixado com sucesso!`);
    } catch (erro) {
      toast.error('Erro ao baixar HTML.');
      console.error('Erro ao baixar HTML:', erro);
    }
  };

  const handleExportarPdf = async (e: React.MouseEvent, aba: AbaData) => {
    e.stopPropagation();
    try {
      const conteudo = textoSelecionado || aba.conteudo;
      await exportarParaPdf(conteudo, aba.nome);
      toast.success(`PDF "${aba.nome}" exportado com sucesso!`);
    } catch (erro) {
      toast.error('Erro ao exportar PDF.');
      console.error('Erro ao exportar PDF:', erro);
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
    <>
      <div className="flex items-center gap-0 px-1 py-1 bg-neutral-50 border-b border-neutral-200">
        {/* Botão scroll esquerda */}
        {canScrollLeft && (
          <Button size="sm" variant="ghost" onClick={rolarEsquerda} className="h-9 w-9 p-0 text-neutral-500 hover:text-neutral-700" title="Rolar para esquerda">
            <ChevronLeft size={18} />
          </Button>
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
              className={`flex items-center gap-2 px-2 py-1 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap transition-all flex-shrink-0 ${
                abaAtiva === aba.id ? 'bg-white border border-neutral-300 shadow-sm' : 'hover:bg-neutral-100 border border-transparent'
              }`}
              onClick={() => setAbaAtiva(aba.id)}
            >
              {editandoId === aba.id ? (
                <Input
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
                  className="h-6 px-2 text-sm max-w-[150px]"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <>
                  <span className="text-sm font-medium text-neutral-700 max-w-[150px] truncate" onDoubleClick={() => handleRenomear(aba)} title={aba.nome}>
                    {aba.nome}
                  </span>
                  {aba.salvoAoMemento && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.2 }}>
                      <CheckCircle2 size={13} className="text-green-600" />
                    </motion.div>
                  )}
                  <Button size="sm" variant="ghost" onClick={(e) => handleSalvarAba(e, aba.id)} className="h-6 w-6 p-0 text-neutral-400 hover:text-blue-600" title="Salvar aba">
                    <Save size={13} />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost" onClick={(e) => e.stopPropagation()} disabled={abaExportando === aba.id} className="h-6 w-6 p-0 text-neutral-400 hover:text-purple-600" title="Exportar aba">
                        {abaExportando === aba.id ? (
                          <div className="animate-spin">
                            <Download size={13} />
                          </div>
                        ) : (
                          <Download size={13} />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64">
                      <DropdownMenuItem onClick={(e) => handleExportarAba(e as any, aba)} className="flex gap-2 cursor-pointer">
                        <Download size={12} className="text-purple-500 flex-shrink-0" />
                        <span>Exportar Documento (.docx)</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={(e) => handleCopiarAba(e as any, aba)} className="flex gap-2 cursor-pointer">
                        {abaCopiadaId === aba.id ? (
                          <>
                            <CheckCircle2 size={12} className="text-green-500 flex-shrink-0" />
                            <span>Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Clipboard size={12} className="text-purple-500 flex-shrink-0" />
                            <span>Copiar para Área de Transf.</span>
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={(e) => handleBaixarHtml(e as any, aba)} className="flex gap-2 cursor-pointer">
                        <FileText size={12} className="text-purple-500 flex-shrink-0" />
                        <span>Baixar como HTML</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={(e) => handleExportarPdf(e as any, aba)} className="flex gap-2 cursor-pointer">
                        <FileJson size={12} className="text-purple-500 flex-shrink-0" />
                        <span>Exportar como PDF</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}

              {abas.length > 1 && (
                <Button size="sm" variant="ghost" onClick={(e) => handleRemoverAba(e, aba.id)} className="h-6 w-6 p-0 text-neutral-400 hover:text-neutral-600" title="Fechar aba">
                  <X size={16} />
                </Button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Botão scroll direita */}
        {canScrollRight && (
          <Button size="sm" variant="ghost" onClick={rolarDireita} className="h-9 w-9 p-0 text-neutral-500 hover:text-neutral-700" title="Rolar para direita">
            <ChevronRight size={18} />
          </Button>
        )}

        {/* Botão adicionar nova aba */}
        <Button size="sm" variant="outline" onClick={handleAdicionarAba} className="flex items-center gap-1 flex-shrink-0" title="Adicionar nova aba">
          <Plus size={16} />
          <span className="text-sm font-medium">Nova</span>
        </Button>
      </div>
    </>
  );
};
