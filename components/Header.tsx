'use client';

import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useAppStore } from '@/lib/store';
import { markdownToDocx, copiarParaAreaTransferencia, baixarHtmlDocumento, exportarParaPdf } from '@/lib/markdown-to-docx';
import { salvarNoGoogleDrive, salvarTodasNoGoogleDrive } from '@/lib/google-drive';
import { obterVersaoFormatada } from '@/lib/versao';
import { LogOut, LogIn, Save, Package, X, Clipboard, CheckCircle2, FileText, FileJson, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export const Header: React.FC = () => {
  const { data: session } = useSession();
  const { abas, salvarTodasAsAbas, fecharTodasAsAbas } = useAppStore();
  const [isExportingAll, setIsExportingAll] = useState(false);
  const [isSavingToDrive, setIsSavingToDrive] = useState(false);
  const [tudoCopiado, setTudoCopiado] = useState(false);

  const handleExportarTodas = async () => {
    setIsExportingAll(true);
    try {
      for (const aba of abas) {
        await markdownToDocx(aba.conteudo, aba.nome);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      toast.success('Todos os documentos foram exportados com sucesso!');
    } catch (erro) {
      toast.error('Erro ao exportar. Verifique o console.');
      console.error('Erro ao exportar todas:', erro);
    } finally {
      setIsExportingAll(false);
    }
  };

  const handleSalvarNoGoogleDrive = async (abaUnica?: string) => {
    if (!session) {
      toast.error('Você precisa estar logado para salvar no Google Drive');
      return;
    }

    setIsSavingToDrive(true);
    try {
      if (abaUnica) {
        // Salvar uma aba específica
        const aba = abas.find((a) => a.id === abaUnica);
        if (!aba) {
          toast.error('Aba não encontrada');
          return;
        }

        const resultado = await salvarNoGoogleDrive(aba.conteudo, aba.nome);
        if (resultado.sucesso) {
          toast.success(`"${resultado.nomeArquivo}" salvo no Google Drive com sucesso!`);
        } else {
          toast.error(resultado.erro || resultado.mensagem);
        }
      } else {
        // Salvar todas as abas
        const resultado = await salvarTodasNoGoogleDrive(abas);
        if (resultado.sucesso > 0) {
          toast.success(`${resultado.sucesso} documento(s) salvo(s) no Google Drive com sucesso!`);
        }
        if (resultado.falhas > 0) {
          toast.error(`${resultado.falhas} documento(s) falharam ao salvar`);
        }
      }
    } catch (erro) {
      toast.error('Erro ao salvar no Google Drive');
      console.error('Erro:', erro);
    } finally {
      setIsSavingToDrive(false);
    }
  };

  // ...existing code...

  const handleCopiarTodas = async () => {
    try {
      const conteudos = abas.map((aba) => aba.conteudo).join('\n\n---\n\n');
      await copiarParaAreaTransferencia(conteudos);
      toast.success('Todos os documentos copiados para a área de transferência!');
      setTudoCopiado(true);
      setTimeout(() => setTudoCopiado(false), 2000);
    } catch {
      toast.error('Erro ao copiar. Tente novamente.');
      setTudoCopiado(false);
    }
  };

  const handleBaixarHtmlTodas = async () => {
    try {
      const conteudos = abas.map((aba) => aba.conteudo).join('\n\n---\n\n');
      await baixarHtmlDocumento(conteudos, 'documentos-completo');
      toast.success('Arquivo HTML baixado com sucesso!');
    } catch {
      toast.error('Erro ao baixar HTML.');
    }
  };

  const handleExportarPdfTodas = async () => {
    try {
      const conteudos = abas.map((aba) => aba.conteudo).join('\n\n---\n\n');
      await exportarParaPdf(conteudos, 'documentos-completo');
      toast.success('Arquivo PDF exportado com sucesso!');
    } catch {
      toast.error('Erro ao exportar PDF.');
    }
  };

  const handleSalvarTodas = () => {
    salvarTodasAsAbas();
    toast.success('Todos os documentos foram salvos!');
  };

  const handleFecharTodas = () => {
    fecharTodasAsAbas();
    toast.success('Área de trabalho limpa!');
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
          <Button onClick={handleSalvarTodas} className="bg-green-600 hover:bg-green-700 text-white gap-2" title="Salvar todas as abas">
            <Save size={18} />
            <span>Salvar tudo</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button disabled={isExportingAll || !session || abas.length === 0} className="bg-purple-600 hover:bg-purple-700 text-white gap-2" title="Opções de exportação para todas as abas">
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
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuItem onClick={handleExportarTodas} className="flex gap-3 cursor-pointer">
                <Package size={18} className="text-purple-600" />
                <span>Baixar Todas (.docx)</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleSalvarNoGoogleDrive()} disabled={isSavingToDrive} className="flex gap-3 cursor-pointer">
                {isSavingToDrive ? (
                  <>
                    <div className="animate-spin">
                      <Cloud size={18} />
                    </div>
                    <span>Salvando no Drive...</span>
                  </>
                ) : (
                  <>
                    <Cloud size={18} className="text-blue-600" />
                    <span>Salvar Todas no Google Drive</span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleCopiarTodas} className="flex gap-3 cursor-pointer">
                {tudoCopiado ? (
                  <>
                    <CheckCircle2 size={18} className="text-green-600" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Clipboard size={18} className="text-purple-600" />
                    <span>Copiar Todas para Área de Transf.</span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleBaixarHtmlTodas} className="flex gap-3 cursor-pointer">
                <FileText size={18} className="text-purple-600" />
                <span>Baixar Todas como HTML</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleExportarPdfTodas} className="flex gap-3 cursor-pointer">
                <FileJson size={18} className="text-purple-600" />
                <span>Exportar Todas como PDF</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={handleFecharTodas} className="bg-red-600 hover:bg-red-700 text-white gap-2" title="Fechar todas as abas">
            <X size={18} />
            <span>Fechar tudo</span>
          </Button>

          <Button onClick={() => (session ? signOut() : signIn('google'))} variant="outline" className="gap-2">
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
          </Button>
        </div>
      </div>
    </header>
  );
};
