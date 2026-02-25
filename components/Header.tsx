'use client';

import React, { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useAppStore } from '@/lib/store';
import { markdownToDocx } from '@/lib/markdown-to-docx';
import { FileDown, LogOut, LogIn, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  const { data: session } = useSession();
  const { markdown, fileName } = useAppStore();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await markdownToDocx(markdown, fileName || 'documento');
    } catch (error) {
      console.error('Erro ao exportar:', error);
    } finally {
      setIsExporting(false);
    }
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
            <p className="text-xs text-neutral-500">Converta markdown para Word</p>
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
            onClick={handleExport}
            disabled={isExporting || !session}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors"
          >
            {isExporting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Exportando...</span>
              </>
            ) : (
              <>
                <FileDown size={18} />
                <span>Exportar DOCX</span>
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
