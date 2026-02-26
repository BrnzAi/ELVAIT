'use client';

import { useEffect } from 'react';

export default function DemoSurveyLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const stored = localStorage.getItem('survey-theme');
    if (stored === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return () => {
      document.documentElement.classList.add('dark');
    };
  }, []);

  return <>{children}</>;
}
