import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-elvait-black text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-elvait-grey/20">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <Image src="/logo-full.jpg" alt="ELVAIT" width={120} height={32} className="h-8 w-auto" />
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
      <footer className="border-t border-elvait-grey/20 py-4">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-elvait-grey">
          © {new Date().getFullYear()} ELVAIT. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
