'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useAppStore } from '@/lib/store';
import { markdownToDocx, copiarParaAreaTransferencia, baixarHtmlDocumento, exportarParaPdf } from '@/lib/markdown-to-docx';
import { obterVersaoFormatada } from '@/lib/versao';
import { LogOut, LogIn, Save, Package, X, Clipboard, ChevronDown, CheckCircle2, FileText, FileJson } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const { data: session } = useSession();
  const { abas, salvarTodasAsAbas, fecharTodasAsAbas } = useAppStore();
  const [isExportingAll, setIsExportingAll] = useState(false);
  const [menuExportarAberto, setMenuExportarAberto] = useState(false);
  const [tudoCopiado, setTudoCopiado] = useState(false);

  const handleExportarTodas = async () => {
    setMenuExportarAberto(false);
    setIsExportingAll(true);
    try {
      for (const aba of abas) {
        await markdownToDocx(aba.conteudo, aba.nome);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch (_error) {
      console.error('Erro ao exportar todas:', _error);
    } finally {
      setIsExportingAll(false);
    }
  };

  const handleCopiarTodas = async () => {
    setMenuExportarAberto(false);
    try {
      const conteudos = abas.map((aba) => aba.conteudo).join('\n\n---\n\n');
      await copiarParaAreaTransferencia(conteudos);
      setTudoCopiado(true);
      setTimeout(() => setTudoCopiado(false), 2000);
    } catch {
      setTudoCopiado(false);
    }
  };

  const handleBaixarHtmlTodas = async () => {
    setMenuExportarAberto(false);
    try {
      const conteudos = abas.map((aba) => aba.conteudo).join('\n\n---\n\n');
      await baixarHtmlDocumento(conteudos, 'documentos-completo');
    } catch {
      // Erro silenciado
    }
  };

  const handleExportarPdfTodas = async () => {
    setMenuExportarAberto(false);
    try {
      const conteudos = abas.map((aba) => aba.conteudo).join('\n\n---\n\n');
      await exportarParaPdf(conteudos, 'documentos-completo');
    } catch {
      // Erro silenciado
    }
  };

  useEffect(() => {
    const handleFecharMenu = () => setMenuExportarAberto(false);
    window.addEventListener('click', handleFecharMenu);
    return () => window.removeEventListener('click', handleFecharMenu);
  }, []);

  const handleSalvarTodas = () => {
    salvarTodasAsAbas();
  };

  const handleFecharTodas = () => {
    fecharTodasAsAbas();
  };

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="flex items-center justify-between px-8 py-4">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-neutral-900 to-neutral-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-900">Markdown Studio</h1>
            <div className="flex items-center gap-2">
              <p className="text-xs text-neutral-500">Converta markdown para Word</p>
              <span className="text-xs font-semibold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">{obterVersaoFormatada()}</span>
            </div>
          </div>
        </motion.div>

        <div className="flex items-center gap-4">
          {session?.user && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-right">
              <p className="text-sm font-medium text-neutral-900">{session.user.name}</p>
              <p className="text-xs text-neutral-500">{session.user.email}</p>
            </motion.div>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSalvarTodas}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors"
            title="Salvar todas as abas"
          >
            <Save size={18} />
            <span>Salvar tudo</span>
          </motion.button>

          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                setMenuExportarAberto(!menuExportarAberto);
              }}
              disabled={isExportingAll || !session || abas.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors"
              title="Opções de exportação para todas as abas"
            >
              {isExportingAll ? (
                <>
                  <div className="animate-spin">
                    <Package size={18} />
                  </div>
                  <span>Exportando...</span>
                </>
              ) : (
                <>
                  <Package size={18} />
                  <span>Exportar tudo</span>
                  <ChevronDown size={14} />
                </>
              )}
            </motion.button>

            <AnimatePresence>
              {menuExportarAberto && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-72 bg-white border border-neutral-200 rounded-lg shadow-xl z-50 overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button onClick={handleExportarTodas} className="w-full flex items-center gap-3 px-4 py-3 text-xs text-neutral-700 hover:bg-neutral-50 transition-colors text-left font-medium whitespace-nowrap">
                    <Package size={18} className="text-purple-600" />
                    Baixar Todas (.docx)
                  </button>
                  <button onClick={handleCopiarTodas} className="w-full flex items-center gap-3 px-4 py-3 text-xs text-neutral-700 hover:bg-neutral-50 transition-colors text-left font-medium border-t border-neutral-100 whitespace-nowrap">
                    {tudoCopiado ? (
                      <>
                        <CheckCircle2 size={18} className="text-green-600" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Clipboard size={18} className="text-purple-600" />
                        Copiar Todas para Área de Transf.
                      </>
                    )}
                  </button>
                  <button onClick={handleBaixarHtmlTodas} className="w-full flex items-center gap-3 px-4 py-3 text-xs text-neutral-700 hover:bg-neutral-50 transition-colors text-left font-medium border-t border-neutral-100 whitespace-nowrap">
                    <FileText size={18} className="text-purple-600" />
                    Baixar Todas como HTML
                  </button>
                  <button onClick={handleExportarPdfTodas} className="w-full flex items-center gap-3 px-4 py-3 text-xs text-neutral-700 hover:bg-neutral-50 transition-colors text-left font-medium border-t border-neutral-100 whitespace-nowrap">
                    <FileJson size={18} className="text-purple-600" />
                    Exportar Todas como PDF
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFecharTodas}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors"
            title="Fechar todas as abas"
          >
            <X size={18} />
            <span>Fechar tudo</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => (session ? signOut() : signIn('google'))}
            className="flex items-center gap-2 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            {session ? (
              <>
                <LogOut size={18} />
                <span>Sair</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>Google</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
};
