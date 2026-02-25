import type { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Markdown Studio',
  description: 'Converta markdown para Word DOCX com autenticação Google',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="75" font-size="75" font-weight="bold" fill="black">M</text></svg>',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className="bg-white text-neutral-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
