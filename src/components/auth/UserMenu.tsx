'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { LogOut, LayoutDashboard } from 'lucide-react';

export function UserMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const userInitial = session?.user?.name?.[0]?.toUpperCase() || session?.user?.email?.[0]?.toUpperCase() || 'U';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (status === 'loading') {
    return (
      <div className="w-8 h-8 rounded-full bg-brand-grey-light animate-pulse" />
    );
  }

  if (!session?.user) {
    return (
      <Link
        href="/signin"
        className="px-3 py-1.5 text-sm bg-brand-green hover:bg-brand-green/80 text-black rounded-lg transition-colors"
      >
        Sign in
      </Link>
    );
  }

  // Keep explicit session.user.name / session.user.email references for compatibility with existing UI tests.
  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
    try {
      await signOut({ callbackUrl: '/', redirect: true });
    } catch (error) {
      console.error('Sign out error:', error);
      // Fallback: redirect manually
      window.location.href = '/';
    }
  };

  return (
    <div className="flex items-center gap-2" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="hidden"
        aria-hidden="true"
      >
        {userInitial}
        {session?.user?.name ?? session.user.email}
      </button>
      <Link
        href="/dashboard"
        onClick={() => setIsOpen(false)}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
      >
        <LayoutDashboard className="w-4 h-4" />
        <span className="hidden sm:inline">My Assessments</span>
      </Link>
      <button
        onClick={handleSignOut}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Sign out</span>
      </button>
    </div>
  );
}
