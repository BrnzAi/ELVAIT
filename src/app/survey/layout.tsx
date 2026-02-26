'use client';

import { useEffect } from 'react';

export default function SurveyLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Default survey pages to light theme unless user chose dark
    const stored = localStorage.getItem('survey-theme');
    if (stored === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Restore dark class on unmount (for rest of app)
    return () => {
      document.documentElement.classList.add('dark');
    };
  }, []);

  return <>{children}</>;
}
