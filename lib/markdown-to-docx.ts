import { Document, Packer, Paragraph, TextRun, HeadingLevel, UnorderedList, OrderedList, ListItem, Table, TableCell, TableRow, BorderStyle, convertInchesToTwip } from 'docx';

interface ParsedMarkdown {
  type: 'heading' | 'paragraph' | 'list' | 'code' | 'table' | 'hr';
  level?: number;
  content: string;
  items?: string[];
  ordered?: boolean;
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
      const language = line.replace(/```/, '').trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      result.push({ type: 'code', content: codeLines.join('\n') });
      i++;
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
      
      while (i < lines.length && (/^\s*[-*+]\s/.test(lines[i]) || /^\s*\d+\.\s/.test(lines[i]) || lines[i].startsWith('  '))) {
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
      runs.push(new TextRun({ 
        text: content, 
        font: 'Courier New',
        color: '666666'
      }));
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    runs.push(new TextRun(text.substring(lastIndex)));
  }

  return runs.length > 0 ? runs : [new TextRun(text)];
}

function getHeadingLevel(level: number): HeadingLevel {
  const levels: { [key: number]: HeadingLevel } = {
    1: HeadingLevel.HEADING_1,
    2: HeadingLevel.HEADING_2,
    3: HeadingLevel.HEADING_3,
    4: HeadingLevel.HEADING_4,
    5: HeadingLevel.HEADING_5,
    6: HeadingLevel.HEADING_6,
  };
  return levels[level] || HeadingLevel.HEADING_1;
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
        })
      );
    } else if (item.type === 'paragraph') {
      sections.push(
        new Paragraph({
          children: formatText(item.content),
          spacing: { line: 360, after: 200 },
        })
      );
    } else if (item.type === 'code') {
      const lines = item.content.split('\n');
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: item.content,
              font: 'Courier New',
              size: 18,
              color: '333333',
            }),
          ],
          style: 'Normal',
          spacing: { before: 100, after: 200, line: 360 },
          border: {
            top: { color: 'CCCCCC', space: 1, style: BorderStyle.SINGLE, size: 6 },
            bottom: { color: 'CCCCCC', space: 1, style: BorderStyle.SINGLE, size: 6 },
            left: { color: 'CCCCCC', space: 1, style: BorderStyle.SINGLE, size: 6 },
            right: { color: 'CCCCCC', space: 1, style: BorderStyle.SINGLE, size: 6 },
          },
          shading: { fill: 'F5F5F5' },
        })
      );
    } else if (item.type === 'list' && item.items) {
      const listItems = item.items.map(
        (listItem) =>
          new ListItem({
            children: [
              new Paragraph({
                text: listItem,
                spacing: { after: 100 },
              }),
            ],
            level: 0,
          })
      );

      if (item.ordered) {
        sections.push(
          new Paragraph({
            children: listItems as any,
          })
        );
      } else {
        sections.push(
          new Paragraph({
            children: listItems as any,
          })
        );
      }
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
        })
      );
    }
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: sections as any,
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
