'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';

export function UserMenu() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    // Use click instead of mousedown to allow menu items to handle their clicks first
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (status === 'loading') {
    return (
      <div className="w-8 h-8 rounded-full bg-brand-grey-light animate-pulse" />
    );
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/signin"
          className="px-3 py-1.5 text-sm text-white/80 hover:text-white transition-colors"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="px-3 py-1.5 text-sm bg-brand-green hover:bg-brand-green text-white rounded-lg transition-colors"
        >
          Sign up
        </Link>
      </div>
    );
  }

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
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
      >
        <div className="w-6 h-6 rounded-full bg-brand-green flex items-center justify-center text-xs font-medium">
          {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase() || 'U'}
        </div>
        <span className="text-sm text-white/80 max-w-[120px] truncate">
          {session.user.name || session.user.email}
        </span>
        <ChevronDown className={`w-4 h-4 text-brand-grey transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-brand-grey-medium rounded-lg shadow-xl z-50">
          <div className="p-3 border-b border-brand-grey-medium">
            <p className="text-sm font-medium text-black truncate">
              {session.user.name || 'User'}
            </p>
            <p className="text-xs text-brand-grey truncate">
              {session.user.email}
            </p>
          </div>
          
          <div className="p-1">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsOpen(false);
                router.push('/dashboard');
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-black hover:bg-brand-grey-light rounded-md transition-colors text-left"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-black hover:bg-brand-grey-light rounded-md transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
