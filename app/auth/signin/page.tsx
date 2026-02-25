'use client';

import React, { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FileText, Zap } from 'lucide-react';

export default function SignIn() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-20 -right-40 w-80 h-80 bg-neutral-700 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-neutral-700 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <FileText className="w-8 h-8 text-neutral-900" />
          </motion.div>
          
          <h1 className="text-4xl font-bold text-white mb-2">Markdown Studio</h1>
          <p className="text-neutral-400 flex items-center justify-center gap-2">
            <Zap size={16} className="text-yellow-400" />
            Converta markdown para Word
          </p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="bg-neutral-800 rounded-2xl p-8 border border-neutral-700 shadow-2xl"
        >
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo</h2>
            <p className="text-neutral-400 text-sm">
              Faça login com sua conta Google para começar
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-neutral-900 font-semibold rounded-xl hover:bg-neutral-50 transition-colors shadow-lg hover:shadow-xl mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Entrar com Google
          </motion.button>

          <div className="text-xs text-neutral-400 text-center">
            Ao fazer login, você concorda com nossos{' '}
            <a href="#" className="text-white hover:underline">
              Termos de Serviço
            </a>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 grid grid-cols-3 gap-4 text-center"
        >
          <div>
            <div className="text-2xl font-bold text-white mb-1">100%</div>
            <p className="text-xs text-neutral-400">Privado</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-white mb-1">⚡</div>
            <p className="text-xs text-neutral-400">Rápido</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-white mb-1">✓</div>
            <p className="text-xs text-neutral-400">Grátis</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
