import type { Metadata } from 'next';
import { SessionProvider } from '@/components/auth';
import './globals.css';

export const metadata: Metadata = {
  title: 'ELVAIT Clarity Engine | Project Preparation Before Commitment',
  description: 'Evaluate project readiness before you commit budget, people, or delivery time. Demo cases show GO / FIX FIRST / NO-GO results.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'ELVAIT Clarity Engine',
    description: 'Project preparation and readiness clarity before budget, people, or delivery time are committed.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-brand-grey-light text-black">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
