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

function gerarHtmlDocumento(markdown: string): string {
  const parsed = parseMarkdown(markdown);
  let html = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>';

  parsed.forEach((item) => {
    if (item.type === 'heading') {
      const level = item.level || 1;
      html += `<h${level}>${escapeHtml(item.content)}</h${level}>`;
    } else if (item.type === 'paragraph') {
      html += `<p>${formatarHtml(item.content)}</p>`;
    } else if (item.type === 'list') {
      const tag = item.ordered ? 'ol' : 'ul';
      html += `<${tag}>`;
      item.items?.forEach((itemText) => {
        html += `<li>${formatarHtml(itemText)}</li>`;
      });
      html += `</${tag}>`;
    } else if (item.type === 'code') {
      html += `<pre><code>${escapeHtml(item.content)}</code></pre>`;
    } else if (item.type === 'table' && item.linhas) {
      html +=
        '<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">';
      item.linhas.forEach((linhaData) => {
        html += '<tr>';
        linhaData.forEach((celula) => {
          html += `<td>${formatarHtml(celula)}</td>`;
        });
        html += '</tr>';
      });
      html += '</table>';
    } else if (item.type === 'mermaid') {
      html += `<pre><code>${escapeHtml(item.content)}</code></pre>`;
    } else if (item.type === 'hr') {
      html += '<hr>';
    }
  });

  html += '</body></html>';
  return html;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatarHtml(text: string): string {
  let html = text;
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
  html = html.replace(/_([^_]*?)_/g, '<em>$1</em>');
  html = html.replace(/`([^`]*?)`/g, '<code>$1</code>');
  return html;
}

export async function copiarParaAreaTransferencia(markdown: string): Promise<void> {
  try {
    const html = gerarHtmlDocumento(markdown);
    const blob = new Blob([html], { type: 'text/html' });
    const item = new ClipboardItem({ 'text/html': blob });
    await navigator.clipboard.write([item]);
  } catch {
    const html = gerarHtmlDocumento(markdown);
    await navigator.clipboard.writeText(html);
  }
}

export async function gerarBlobDocx(markdown: string): Promise<Blob> {
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
    } else if (item.type === 'list') {
      item.items?.forEach((itemText) => {
        const prefix = item.ordered ? '1.' : '•';
        sections.push(
          new Paragraph({
            text: `${prefix} ${itemText}`,
            spacing: { line: 240, after: 100 },
            indent: { left: 400 },
          }),
        );
      });
    } else if (item.type === 'code') {
      const linhasCode = item.content.split('\n');
      linhasCode.forEach((linha) => {
        sections.push(
          new Paragraph({
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
            border: {
              top:
                linha === linhasCode[0]
                  ? { color: 'CCCCCC', space: 1, style: BorderStyle.SINGLE, size: 6 }
                  : undefined,
              bottom:
                linha === linhasCode[linhasCode.length - 1]
                  ? { color: 'CCCCCC', space: 1, style: BorderStyle.SINGLE, size: 6 }
                  : undefined,
              left: { color: 'CCCCCC', space: 1, style: BorderStyle.SINGLE, size: 6 },
              right: { color: 'CCCCCC', space: 1, style: BorderStyle.SINGLE, size: 6 },
            },
            shading: { fill: 'F5F5F5' },
          }),
        );
      });
    } else if (item.type === 'table' && item.linhas) {
      const rows = item.linhas.map((linhaData) => {
        return new TableRow({
          children: linhaData.map(
            (celula) =>
              new TableCell({
                children: [
                  new Paragraph({
                    children: formatText(celula),
                  }),
                ],
                shading: { fill: 'F0F0F0' },
                borders: {
                  top: { color: 'CCCCCC', space: 1, style: BorderStyle.SINGLE, size: 6 },
                  bottom: { color: 'CCCCCC', space: 1, style: BorderStyle.SINGLE, size: 6 },
                  left: { color: 'CCCCCC', space: 1, style: BorderStyle.SINGLE, size: 6 },
                  right: { color: 'CCCCCC', space: 1, style: BorderStyle.SINGLE, size: 6 },
                },
              }),
          ),
        });
      });
      sections.push(new Table({ rows }));
    } else if (item.type === 'mermaid') {
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
  return blob;
}

export async function markdownToDocx(markdown: string, fileName: string = 'documento') {
  const blob = await gerarBlobDocx(markdown);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
