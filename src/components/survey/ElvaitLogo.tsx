'use client';
import Image from 'next/image';


export function ElvaitLogo({ className = 'h-7' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image src="/logo-full.jpg" alt="ELVAIT" width={120} height={32} className="h-8 w-auto" />
    </div>
  );
}
