'use client';

interface ElvaitLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ElvaitLogo({ size = 'md', className = '' }: ElvaitLogoProps) {
  const sizeClasses = {
    sm: 'text-sm tracking-widest',
    md: 'text-lg tracking-widest',
    lg: 'text-2xl tracking-[0.2em]',
  };

  return (
    <span className={`font-medium ${sizeClasses[size]} ${className}`}>
      <span className="text-elvait-grey-dark dark:text-elvait-green">ELV</span>
      <span className="text-elvait-red">A</span>
      <span className="text-elvait-grey-dark dark:text-elvait-green">IT</span>
    </span>
  );
}
