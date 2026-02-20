'use client';

import { ReactNode } from 'react';
import { Lock } from 'lucide-react';

interface LockedOverlayProps {
  children: ReactNode;
  isLocked: boolean;
  label?: string;
  onClick?: () => void;
  blurIntensity?: 'light' | 'medium' | 'heavy';
}

export function LockedOverlay({
  children,
  isLocked,
  label = 'Register free to unlock',
  onClick,
  blurIntensity = 'medium',
}: LockedOverlayProps) {
  if (!isLocked) {
    return <>{children}</>;
  }

  const blurValues = {
    light: 'blur-[2px]',
    medium: 'blur-[4px]',
    heavy: 'blur-[8px]',
  };

  return (
    <div className="relative">
      {/* Blurred content */}
      <div 
        className={`${blurValues[blurIntensity]} pointer-events-none select-none`}
        aria-hidden="true"
      >
        {children}
      </div>
      
      {/* Lock overlay */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/30 backdrop-blur-[1px] cursor-pointer transition-all hover:bg-gray-900/40 rounded-lg"
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClick?.();
          }
        }}
        aria-label={label}
      >
        <div className="flex flex-col items-center gap-2 p-4 text-center">
          <div className="w-10 h-10 rounded-full bg-gray-800/80 flex items-center justify-center">
            <Lock className="w-5 h-5 text-gray-300" />
          </div>
          <span className="text-sm font-medium text-gray-200">{label}</span>
        </div>
      </div>
    </div>
  );
}

export default LockedOverlay;
