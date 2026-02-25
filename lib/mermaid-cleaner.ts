/**
 * Utilitário para limpar diagramas Mermaid
 * Remove tags <br/>, <br>, </br> que não são suportadas pelo Mermaid
 */

/**
 * Detecta e remove tags <br/>, <br>, </br> de um diagrama Mermaid
 * @param conteudoMermaid - String contendo o diagrama Mermaid
 * @returns String com as tags removidas e quebras naturais adicionadas
 */
export function limparDiagramaMermaid(conteudoMermaid: string): string {
  if (!conteudoMermaid) return conteudoMermaid;

  let conteudoLimpo = conteudoMermaid;

  // Remove <br/> (mais comum)
  conteudoLimpo = conteudoLimpo.replace(/<br\s*\/>/gi, '\n    ');

  // Remove <br> (sem barra de fechamento)
  conteudoLimpo = conteudoLimpo.replace(/<br>/gi, '\n    ');

  // Remove </br> (fechamento só)
  conteudoLimpo = conteudoLimpo.replace(/<\/br>/gi, '\n    ');

  return conteudoLimpo;
}

/**
 * Detecta se um diagrama Mermaid contém tags <br/> inválidas
 * @param conteudoMermaid - String contendo o diagrama Mermaid
 * @returns Array com as tags encontradas ou vazio se nenhuma
 */
export function detectarTagsBrInvalidas(conteudoMermaid: string): string[] {
  if (!conteudoMermaid) return [];

  const regexBrTags = /<br\s*\/?>/gi;
  const matches = conteudoMermaid.match(regexBrTags);

  return matches || [];
}

/**
 * Valida um diagrama Mermaid
 * @param conteudoMermaid - String contendo o diagrama Mermaid
 * @returns Objeto com informações de validação
 */
export function validarDiagramaMermaid(conteudoMermaid: string): {
  valido: boolean;
  erro: string | null;
  tagsBrEncontradas: string[];
} {
  const tagsBrEncontradas = detectarTagsBrInvalidas(conteudoMermaid);

  if (tagsBrEncontradas.length > 0) {
    return {
      valido: false,
      erro: `Diagrama contém ${tagsBrEncontradas.length} tag(s) <br/> inválida(s). Mermaid não suporta HTML em labels.`,
      tagsBrEncontradas,
    };
  }

  return {
    valido: true,
    erro: null,
    tagsBrEncontradas: [],
  };
}

/**
 * Processa um conteúdo markdown e limpa todos os diagramas Mermaid nele
 * @param conteudoMarkdown - String contendo markdown com diagramas Mermaid
 * @returns String com diagramas Mermaid limpos
 */
export function limparMermaidEmMarkdown(conteudoMarkdown: string): string {
  if (!conteudoMarkdown) return conteudoMarkdown;

  // Encontra todos os blocos ```mermaid ... ```
  const regexMermaid = /```mermaid\n([\s\S]*?)```/g;

  return conteudoMarkdown.replace(regexMermaid, (_match, conteudoDiagrama) => {
    const diagramaLimpo = limparDiagramaMermaid(conteudoDiagrama);
    return `\`\`\`mermaid\n${diagramaLimpo}\`\`\``;
  });
}
