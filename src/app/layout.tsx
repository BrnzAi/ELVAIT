import type { Metadata } from 'next';
import { SessionProvider } from '@/components/auth';
import './globals.css';

export const metadata: Metadata = {
  title: 'Clarity Before Automation Kit | ELVAIT',
  description: 'Get clarity on what, whether, and how to automate — before you invest.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/icon.svg',
  },
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-white dark:bg-elvait-black text-gray-900 dark:text-gray-100">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
