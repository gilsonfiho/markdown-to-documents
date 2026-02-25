'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownPreviewProps {
  content: string;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
  return (
    <div className="markdown-preview prose prose-sm max-w-none">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-3xl font-bold text-neutral-900 mt-8 mb-4 border-b-2 border-neutral-200 pb-2" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl font-bold text-neutral-800 mt-6 mb-3" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xl font-semibold text-neutral-700 mt-4 mb-2" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="text-neutral-600 leading-relaxed mb-4" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-neutral-900" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic text-neutral-700" {...props} />
          ),
          code: ({ node, inline, ...props }) => 
            inline ? (
              <code className="bg-neutral-100 text-neutral-900 px-2 py-1 rounded font-mono text-sm border border-neutral-200" {...props} />
            ) : (
              <code className="bg-neutral-900 text-neutral-50 px-4 py-3 rounded-lg font-mono text-sm block my-4 overflow-x-auto" {...props} />
            ),
          pre: ({ node, ...props }) => (
            <pre className="bg-neutral-900 text-neutral-50 p-4 rounded-lg overflow-x-auto my-4 border border-neutral-700" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside space-y-2 mb-4 text-neutral-600" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside space-y-2 mb-4 text-neutral-600" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-neutral-600" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-neutral-300 pl-4 italic text-neutral-600 my-4" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a className="text-blue-600 hover:text-blue-700 underline hover:underline-offset-2" {...props} />
          ),
          hr: ({ node, ...props }) => (
            <hr className="border-t border-neutral-200 my-6" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
