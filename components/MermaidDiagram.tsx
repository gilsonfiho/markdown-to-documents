'use client';

import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  content: string;
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ content }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const renderDiagram = async () => {
      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
        });

        const element = document.createElement('div');
        element.className = 'mermaid';
        element.textContent = content;

        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          containerRef.current.appendChild(element);
        }

        await mermaid.run();
      } catch (erro) {
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          const errorElement = document.createElement('div');
          errorElement.className = 'p-4 bg-red-50 border border-red-300 rounded-lg';

          const errorTitle = document.createElement('p');
          errorTitle.className = 'text-red-800 font-semibold mb-2';
          errorTitle.textContent = '⚠️ Erro ao renderizar diagrama Mermaid';
          errorElement.appendChild(errorTitle);

          const errorMessage = document.createElement('p');
          errorMessage.className = 'text-red-700 text-sm mb-2';
          const detailedMessage = erro instanceof Error ? erro.message : 'Erro desconhecido';
          errorMessage.textContent = `Motivo: ${detailedMessage}`;
          errorElement.appendChild(errorMessage);

          const suggestions = document.createElement('p');
          suggestions.className = 'text-red-600 text-xs';
          suggestions.textContent = '💡 Dicas: Verifique se usa <br/> nas labels (não suportado). Use quebras de linha naturais em vez disso.';
          errorElement.appendChild(suggestions);

          containerRef.current.appendChild(errorElement);
        }
      }
    };

    renderDiagram();
  }, [content]);

  return <div ref={containerRef} className="flex justify-center items-center my-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200 overflow-x-auto min-h-[200px]" />;
};
