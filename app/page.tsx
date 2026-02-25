'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { MarkdownPreview } from '@/components/MarkdownPreview';
import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { markdown, setMarkdown, carregarDoStorage } = useAppStore();

  useEffect(() => {
    carregarDoStorage();
  }, [carregarDoStorage]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-3 border-neutral-900 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-white overflow-hidden">
      <Header />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-1 overflow-hidden gap-px"
      >
        {/* Editor Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex-1 flex flex-col overflow-hidden bg-white border-r border-neutral-200"
        >
          <div className="px-6 py-3 border-b border-neutral-200 bg-neutral-50">
            <h2 className="text-sm font-semibold text-neutral-900">Editor</h2>
          </div>
          <div className="flex-1 overflow-auto">
            <MarkdownEditor value={markdown} onChange={setMarkdown} />
          </div>
        </motion.div>

        {/* Preview Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex-1 flex flex-col overflow-hidden bg-neutral-50"
        >
          <div className="px-6 py-3 border-b border-neutral-200 bg-white">
            <h2 className="text-sm font-semibold text-neutral-900">Preview</h2>
          </div>
          <div className="flex-1 overflow-auto p-8">
            <MarkdownPreview content={markdown} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
