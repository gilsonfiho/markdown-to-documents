import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]';
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ erro: 'Não autenticado' }, { status: 401 });
    }

    const accessToken = (session.user as any).accessToken;
    if (!accessToken) {
      return NextResponse.json({ erro: 'Token de acesso não disponível' }, { status: 401 });
    }

    const { conteudo, nomeArquivo } = await req.json();

    if (!conteudo || !nomeArquivo) {
      return NextResponse.json({ erro: 'Conteúdo e nome do arquivo são obrigatórios' }, { status: 400 });
    }

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const drive = google.drive({ version: 'v3', auth });

    const nomeComExtensao = nomeArquivo.endsWith('.docx') ? nomeArquivo : `${nomeArquivo}.docx`;

    // Converter base64 para Buffer
    const buffer = Buffer.from(conteudo, 'base64');

    // Criar stream do buffer
    const stream = Readable.from([buffer]);

    const resposta = await drive.files.create({
      requestBody: {
        name: nomeComExtensao,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        description: 'Documento criado pelo Markdown Studio',
      },
      media: {
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        body: stream,
      },
    });

    return NextResponse.json({
      sucesso: true,
      mensagem: 'Documento salvo no Google Drive com sucesso!',
      nomeArquivo: resposta.data.name,
      idArquivo: resposta.data.id,
      urlArquivo: `https://drive.google.com/file/d/${resposta.data.id}/view`,
    });
  } catch (erro) {
    console.error('Erro ao salvar no Google Drive:', erro);
    return NextResponse.json({ erro: 'Erro ao salvar no Google Drive', detalhes: String(erro) }, { status: 500 });
  }
}
