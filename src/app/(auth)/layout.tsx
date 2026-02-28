import Link from 'next/link';
import { ElvaitLogo } from '@/components/survey/ElvaitLogo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-[#333]">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link href="/" className="w-fit">
            <ElvaitLogo className="h-8" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#333] py-4">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-brand-grey">
          © {new Date().getFullYear()} ELVAIT. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
