import { gerarBlobDocx } from '@/lib/markdown-to-docx';

interface RespostaSalvoDrive {
  sucesso: boolean;
  mensagem: string;
  nomeArquivo?: string;
  idArquivo?: string;
  urlArquivo?: string;
  erro?: string;
}

export async function salvarNoGoogleDrive(conteudo: string, nomeArquivo: string): Promise<RespostaSalvoDrive> {
  try {
    // Converter markdown para DOCX (Blob)
    const arquivoDocx = await gerarBlobDocx(conteudo);

    // Converter Blob para Buffer
    const arrayBuffer = await arquivoDocx.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Fazer requisição para o endpoint de API
    const resposta = await fetch('/api/salvar-no-drive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conteudo: buffer.toString('base64'),
        nomeArquivo: nomeArquivo.endsWith('.docx') ? nomeArquivo : `${nomeArquivo}.docx`,
      }),
    });

    if (!resposta.ok) {
      const erro = await resposta.json();
      return {
        sucesso: false,
        mensagem: erro.erro || 'Erro ao salvar no Google Drive',
        erro: erro.detalhes,
      };
    }

    const dados = await resposta.json();
    return {
      sucesso: true,
      mensagem: dados.mensagem,
      nomeArquivo: dados.nomeArquivo,
      idArquivo: dados.idArquivo,
      urlArquivo: dados.urlArquivo,
    };
  } catch (erro) {
    console.error('Erro ao salvar no Google Drive:', erro);
    return {
      sucesso: false,
      mensagem: 'Erro ao salvar no Google Drive',
      erro: String(erro),
    };
  }
}

export async function salvarTodasNoGoogleDrive(abas: Array<{ id: string; nome: string; conteudo: string }>): Promise<{ sucesso: number; falhas: number; erros: string[] }> {
  const erros: string[] = [];
  let sucessos = 0;
  let falhas = 0;

  for (const aba of abas) {
    const resultado = await salvarNoGoogleDrive(aba.conteudo, aba.nome);
    if (resultado.sucesso) {
      sucessos++;
    } else {
      falhas++;
      erros.push(`${aba.nome}: ${resultado.erro || resultado.mensagem}`);
    }
    // Aguardar 500ms entre requisições para evitar sobrecarga
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return { sucesso: sucessos, falhas, erros };
}
