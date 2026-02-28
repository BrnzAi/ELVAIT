'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthPromptProps {
  caseId?: string;
  title?: string;
  description?: string;
}

export function AuthPrompt({ 
  caseId,
  title = 'Save your results',
  description = 'Create an account to save your assessment results and access them anytime.'
}: AuthPromptProps) {
  const { data: session } = useSession();

  // Don't show if user is already logged in
  if (session?.user) {
    return null;
  }

  const callbackUrl = caseId 
    ? `/cases/${caseId}/results?claim=true`
    : '/dashboard';

  return (
    <div className="bg-brand-green/10 border border-brand-green/30 rounded-xl p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-brand-green/20 flex items-center justify-center flex-shrink-0">
          <Shield className="w-6 h-6 text-brand-green" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
          <p className="text-gray-400 text-sm mb-4">{description}</p>
          <div className="flex flex-wrap gap-3">
            <Link href={`/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
              <Button size="sm">
                Create Account
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href={`/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
