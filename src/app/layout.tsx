import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Atelier — The AI Workbench',
  description: 'The local-first AI workbench with interactive live artifacts and multi-model freedom.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-accent/20 selection:text-accent">
        {children}
      </body>
    </html>
  );
}
