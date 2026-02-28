'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-lg border border-[#333] bg-[#111] px-3 py-2 text-sm placeholder:text-brand-grey focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 border-[#333] bg-[#111]',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
