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
        mermaid.initialize({ startOnLoad: true, theme: 'default' });
        mermaid.contentLoaded();

        const element = document.createElement('div');
        element.className = 'mermaid';
        element.textContent = content;

        containerRef.current?.appendChild(element);

        await mermaid.run();
      } catch {
        if (containerRef.current) {
          containerRef.current.innerHTML = `<p className="text-red-600 text-sm">Erro ao renderizar diagrama Mermaid</p>`;
        }
      }
    };

    containerRef.current.innerHTML = '';
    renderDiagram();
  }, [content]);

  return (
    <div
      ref={containerRef}
      className="flex justify-center items-center my-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200 overflow-x-auto"
    />
  );
};
