'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-lg border border-[#333] bg-[#111] px-3 py-2 text-sm placeholder:text-brand-grey focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 border-[#333] bg-[#111]',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
