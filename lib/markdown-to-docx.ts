import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableCell,
  TableRow,
  BorderStyle,
} from 'docx';

interface ParsedMarkdown {
  type: 'heading' | 'paragraph' | 'list' | 'code' | 'table' | 'hr' | 'mermaid';
  level?: number;
  content: string;
  items?: string[];
  ordered?: boolean;
  linhas?: string[][];
}

function detectarBlocoArvore(
  linhas: string[],
  indiceInicial: number,
): { linhas: string[]; quantidade: number } | null {
  const padraoArvore = /[├─└│┌┐┘┤┬┴┼]/;

  if (!padraoArvore.test(linhas[indiceInicial])) {
    return null;
  }

  const bloco = [];
  let i = indiceInicial;

  while (i < linhas.length) {
    const linha = linhas[i];
    if (linha.trim() === '') {
      if (bloco.length > 0) break;
      i++;
      continue;
    }

    if (padraoArvore.test(linha) || (bloco.length > 0 && /^\s/.test(linha))) {
      bloco.push(linha);
      i++;
    } else {
      break;
    }
  }

  return bloco.length > 0 ? { linhas: bloco, quantidade: i - indiceInicial } : null;
}

function validarSeparadorTabela(linha: string): boolean {
  const conteudoLimpo = linha.trim();
  const celulas = conteudoLimpo.split('|').filter((c) => c.trim());

  if (celulas.length === 0) return false;

  return celulas.every((celula) => /^[\s:-]+$/.test(celula));
}

function extrairLinhasTabela(linhas: string[], indiceInicial: number): string[][] | null {
  if (indiceInicial + 1 >= linhas.length) return null;

  const linhaUm = linhas[indiceInicial].trim();
  const linhaAligment = linhas[indiceInicial + 1].trim();

  if (!linhaUm.includes('|') || !validarSeparadorTabela(linhaAligment)) {
    return null;
  }

  const tabelaLinhas: string[][] = [];

  tabelaLinhas.push(
    linhaUm
      .split('|')
      .map((c) => c.trim())
      .filter((c) => c),
  );

  let i = indiceInicial + 2;
  while (i < linhas.length && linhas[i].includes('|')) {
    const linha = linhas[i].trim();
    tabelaLinhas.push(
      linha
        .split('|')
        .map((c) => c.trim())
        .filter((c) => c),
    );
    i++;
  }

  return tabelaLinhas.length > 1 ? tabelaLinhas : null;
}

function parseMarkdown(markdown: string): ParsedMarkdown[] {
  const lines = markdown.split('\n');
  const result: ParsedMarkdown[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Headings
    if (line.startsWith('#')) {
      const level = line.match(/^#+/)?.[0].length || 1;
      const content = line.replace(/^#+\s*/, '');
      result.push({ type: 'heading', level: Math.min(level, 6), content });
      i++;
    }
    // Code blocks
    else if (line.startsWith('```')) {
      const linguagem = line.replace(/```/, '').trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      const conteudoCodigo = codeLines.join('\n');

      // Verificar se é um bloco Mermaid
      if (linguagem === 'mermaid') {
        result.push({ type: 'mermaid', content: conteudoCodigo });
      } else {
        result.push({ type: 'code', content: conteudoCodigo });
      }
      i++;
    }
    // Tables
    else if ((tabelaLinhas = extrairLinhasTabela(lines, i))) {
      result.push({ type: 'table', content: '', linhas: tabelaLinhas });
      i += tabelaLinhas.length + 1;
    }
    // Estruturas de árvore e diagramas ASCII
    else if ((blocoArvore = detectarBlocoArvore(lines, i))) {
      result.push({ type: 'code', content: blocoArvore.linhas.join('\n') });
      i += blocoArvore.quantidade;
    }
    // Horizontal rule
    else if (/^(---|\*\*\*|___)/.test(line.trim())) {
      result.push({ type: 'hr', content: '' });
      i++;
    }
    // Lists
    else if (/^\s*[-*+]\s/.test(line) || /^\s*\d+\.\s/.test(line)) {
      const listItems = [];
      const ordered = /^\s*\d+\./.test(line);

      while (
        i < lines.length &&
        (/^\s*[-*+]\s/.test(lines[i]) || /^\s*\d+\.\s/.test(lines[i]) || lines[i].startsWith('  '))
      ) {
        if (/^\s*[-*+]\s/.test(lines[i]) || /^\s*\d+\.\s/.test(lines[i])) {
          const item = lines[i].replace(/^\s*[-*+]\s/, '').replace(/^\s*\d+\.\s/, '');
          listItems.push(item);
        }
        i++;
      }

      result.push({ type: 'list', content: '', items: listItems, ordered });
    }
    // Empty lines - skip
    else if (line.trim() === '') {
      i++;
    }
    // Paragraphs
    else {
      result.push({ type: 'paragraph', content: line });
      i++;
    }
  }

  return result;
}

let blocoArvore: { linhas: string[]; quantidade: number } | null;
let tabelaLinhas: string[][] | null;

function formatText(text: string): TextRun[] {
  const runs: TextRun[] = [];
  const regex = /(\*\*|__|_|`)(.*?)\1/g;
  let lastIndex = 0;

  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      runs.push(new TextRun(text.substring(lastIndex, match.index)));
    }

    const delimiter = match[1];
    const content = match[2];

    if (delimiter === '**' || delimiter === '__') {
      runs.push(new TextRun({ text: content, bold: true }));
    } else if (delimiter === '_') {
      runs.push(new TextRun({ text: content, italics: true }));
    } else if (delimiter === '`') {
      runs.push(
        new TextRun({
          text: content,
          font: 'Courier New',
          color: '666666',
        }),
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    runs.push(new TextRun(text.substring(lastIndex)));
  }

  return runs.length > 0 ? runs : [new TextRun(text)];
}

function getHeadingLevel(level: number): any {
  const levels: { [key: number]: any } = {
    1: HeadingLevel.HEADING_1,
    2: HeadingLevel.HEADING_2,
    3: HeadingLevel.HEADING_3,
    4: HeadingLevel.HEADING_4,
    5: HeadingLevel.HEADING_5,
    6: HeadingLevel.HEADING_6,
  };
  return levels[level] || HeadingLevel.HEADING_1;
}

function criarTabela(linhas: string[][]): Table {
  if (linhas.length === 0) {
    return new Table({ rows: [] });
  }

  const linhasTabela = linhas.map((celulasDaLinha, indiceLinhaAtual) => {
    const celulasCriadas = celulasDaLinha.map((conteudoCelula) => {
      const ehCabecalho = indiceLinhaAtual === 0;
      return new TableCell({
        children: [
          new Paragraph({
            children: formatText(conteudoCelula),
            spacing: { line: 240 },
          }),
        ],
        shading: {
          fill: ehCabecalho ? 'D3D3D3' : 'FFFFFF',
        },
      });
    });

    return new TableRow({
      children: celulasCriadas,
    });
  });

  return new Table({
    rows: linhasTabela,
    width: { size: 100, type: 'pct' },
  });
}

export async function markdownToDocx(markdown: string, fileName: string = 'documento') {
  const parsed = parseMarkdown(markdown);
  const sections: (Paragraph | Table)[] = [];

  parsed.forEach((item) => {
    if (item.type === 'heading') {
      sections.push(
        new Paragraph({
          text: item.content,
          heading: getHeadingLevel(item.level || 1),
          spacing: { before: 200, after: 100 },
        }),
      );
    } else if (item.type === 'paragraph') {
      sections.push(
        new Paragraph({
          children: formatText(item.content),
          spacing: { line: 360, after: 200 },
        }),
      );
    } else if (item.type === 'code') {
      const linhasCodeigo = item.content.split('\n');
      const paragrafosCodeigo = linhasCodeigo.map((linha) => {
        return new Paragraph({
          children: [
            new TextRun({
              text: linha || ' ',
              font: 'Courier New',
              size: 18,
              color: '333333',
            }),
          ],
          style: 'Normal',
          spacing: { line: 240 },
          border:
            linha === linhasCodeigo[0]
              ? {
                  top: { color: 'CCCCCC', space: 1, style: BorderStyle.SINGLE, size: 6 },
                  bottom: { color: 'CCCCCC', space: 1, style: BorderStyle.SINGLE, size: 6 },
                  left: { color: 'CCCCCC', space: 1, style: BorderStyle.SINGLE, size: 6 },
                  right: { color: 'CCCCCC', space: 1, style: BorderStyle.SINGLE, size: 6 },
                }
              : linha === linhasCodeigo[linhasCodeigo.length - 1]
                ? {
                    bottom: { color: 'CCCCCC', space: 1, style: BorderStyle.SINGLE, size: 6 },
                    left: { color: 'CCCCCC', space: 1, style: BorderStyle.SINGLE, size: 6 },
                    right: { color: 'CCCCCC', space: 1, style: BorderStyle.SINGLE, size: 6 },
                  }
                : {
                    left: { color: 'CCCCCC', space: 1, style: BorderStyle.SINGLE, size: 6 },
                    right: { color: 'CCCCCC', space: 1, style: BorderStyle.SINGLE, size: 6 },
                  },
          shading: { fill: 'F5F5F5' },
        });
      });
      paragrafosCodeigo.forEach((p) => sections.push(p));
    } else if (item.type === 'list' && item.items) {
      // Renderizar listas usando parágrafos com marcadores manuais para evitar dependências de símbolos não exportados pela versão instalada de 'docx'.
      const listaParagrafos = item.items.map((textoItem, indice) => {
        const marcador = item.ordered ? `${indice + 1}. ` : '• ';
        const runs = formatText(textoItem);
        // Adicionar o marcador como primeiro TextRun
        const children: TextRun[] = [new TextRun({ text: marcador })].concat(runs as TextRun[]);
        return new Paragraph({ children, spacing: { after: 100 } });
      });

      listaParagrafos.forEach((p) => sections.push(p));
    } else if (item.type === 'table' && item.linhas) {
      const tabela = criarTabela(item.linhas);
      sections.push(tabela);
    } else if (item.type === 'mermaid') {
      // Renderizar diagrama Mermaid como bloco de código (representação textual)
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: '[Diagrama Mermaid]',
              font: 'Courier New',
              bold: true,
              size: 20,
              color: '0066CC',
            }),
          ],
          spacing: { before: 200, after: 100 },
        }),
      );

      const linhasMermaid = item.content.split('\n');
      const paragrafosMermaid = linhasMermaid.map((linha) => {
        return new Paragraph({
          children: [
            new TextRun({
              text: linha || ' ',
              font: 'Courier New',
              size: 18,
              color: '333333',
            }),
          ],
          style: 'Normal',
          spacing: { line: 240 },
          border:
            linha === linhasMermaid[0]
              ? {
                  top: { color: 'CCCCCC', space: 1, style: BorderStyle.SINGLE, size: 6 },
                  bottom: { color: 'CCCCCC', space: 1, style: BorderStyle.SINGLE, size: 6 },
                  left: { color: 'CCCCCC', space: 1, style: BorderStyle.SINGLE, size: 6 },
                  right: { color: 'CCCCCC', space: 1, style: BorderStyle.SINGLE, size: 6 },
                }
              : linha === linhasMermaid[linhasMermaid.length - 1]
                ? {
                    bottom: { color: 'CCCCCC', space: 1, style: BorderStyle.SINGLE, size: 6 },
                    left: { color: 'CCCCCC', space: 1, style: BorderStyle.SINGLE, size: 6 },
                    right: { color: 'CCCCCC', space: 1, style: BorderStyle.SINGLE, size: 6 },
                  }
                : {
                    left: { color: 'CCCCCC', space: 1, style: BorderStyle.SINGLE, size: 6 },
                    right: { color: 'CCCCCC', space: 1, style: BorderStyle.SINGLE, size: 6 },
                  },
          shading: { fill: 'F0F8FF' },
        });
      });
      paragrafosMermaid.forEach((p) => sections.push(p));
    } else if (item.type === 'hr') {
      sections.push(
        new Paragraph({
          border: {
            bottom: {
              color: '000000',
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
          spacing: { before: 200, after: 200 },
        }),
      );
    }
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: sections as unknown as Paragraph[],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
