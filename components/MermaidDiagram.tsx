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
        mermaid.initialize({ startOnLoad: false, theme: 'default' });

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
          const errorElement = document.createElement('p');
          errorElement.className = 'text-red-600 text-sm';
          errorElement.textContent = `Erro ao renderizar diagrama Mermaid: ${erro instanceof Error ? erro.message : 'Erro desconhecido'}`;
          containerRef.current.appendChild(errorElement);
        }
      }
    };

    renderDiagram();
  }, [content]);

  return (
    <div
      ref={containerRef}
      className="flex justify-center items-center my-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200 overflow-x-auto"
    />
  );
};
