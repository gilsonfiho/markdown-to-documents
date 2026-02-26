'use client';

import React, { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useAppStore } from '@/lib/store';
import { markdownToDocx } from '@/lib/markdown-to-docx';
import { obterVersaoFormatada } from '@/lib/versao';
import { Download, LogOut, LogIn, Save, CheckCircle2, Package } from 'lucide-react';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  const { data: session } = useSession();
  const { abas, abaAtiva, salvarNoStorage, salvarTodasAsAbas } = useAppStore();
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingAll, setIsExportingAll] = useState(false);

  const abaAtual = abas.find((aba) => aba.id === abaAtiva);

  const handleExportarAbas = async () => {
    setIsExporting(true);
    try {
      await markdownToDocx(abaAtual?.conteudo || '', abaAtual?.nome || 'documento');
    } catch (error) {
      console.error('Erro ao exportar:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportarTodas = async () => {
    setIsExportingAll(true);
    try {
      for (const aba of abas) {
        await markdownToDocx(aba.conteudo, aba.nome);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error('Erro ao exportar todas:', error);
    } finally {
      setIsExportingAll(false);
    }
  };

  const handleSalvar = () => {
    salvarNoStorage(abaAtiva);
  };

  const handleSalvarTodas = () => {
    salvarTodasAsAbas();
  };

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="flex items-center justify-between px-8 py-4">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-neutral-900 to-neutral-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-900">Markdown Studio</h1>
            <div className="flex items-center gap-2">
              <p className="text-xs text-neutral-500">Converta markdown para Word</p>
              <span className="text-xs font-semibold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">
                {obterVersaoFormatada()}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="flex items-center gap-4">
          {session?.user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-right"
            >
              <p className="text-sm font-medium text-neutral-900">{session.user.name}</p>
              <p className="text-xs text-neutral-500">{session.user.email}</p>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSalvar}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors"
            title="Salvar a aba atual"
          >
            {abaAtual?.salvoAoMemento ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <CheckCircle2 size={18} />
                </motion.div>
                <span>Salvo {abaAtual.salvoAoMemento}</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Salvar</span>
              </>
            )}
          </motion.button>

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

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportarAbas}
            disabled={isExporting || !session}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors"
            title="Exportar aba atual para DOCX"
          >
            {isExporting ? (
              <>
                <div className="animate-spin">
                  <Download size={18} />
                </div>
                <span>Exportando...</span>
              </>
            ) : (
              <>
                <Download size={18} />
                <span>Exportar</span>
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportarTodas}
            disabled={isExportingAll || !session || abas.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors"
            title="Exportar todas as abas para DOCX"
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
              </>
            )}
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
