import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Clarity Before Automation Kit | AIHackers',
  description: 'Get clarity on what, whether, and how to automate — before you invest.',
  openGraph: {
    title: 'Clarity Before Automation Kit',
    description: 'Stop automating chaos. Get clarity first.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}
