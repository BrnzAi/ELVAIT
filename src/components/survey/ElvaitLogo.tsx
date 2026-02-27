'use client';

export function ElvaitLogo({ className = '' }: { className?: string }) {
  return (
    <span className={`font-medium tracking-widest text-sm ${className}`}>
      <span className="text-elvait-grey-dark dark:text-elvait-green">ELV</span>
      <span className="text-elvait-red">A</span>
      <span className="text-elvait-grey-dark dark:text-elvait-green">IT</span>
    </span>
  );
}
