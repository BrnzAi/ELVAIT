'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided');
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Verification failed');
        }

        setStatus('success');
        setMessage(data.message);
      } catch (err) {
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'Verification failed');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 text-center">
      {status === 'loading' && (
        <>
          <div className="w-16 h-16 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Verifying your email...</h1>
          <p className="text-gray-400">Please wait while we verify your email address.</p>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Email Verified!</h1>
          <p className="text-gray-400 mb-6">{message}</p>
          <Link href="/signin">
            <Button className="w-full">
              Continue to Sign In
            </Button>
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Verification Failed</h1>
          <p className="text-gray-400 mb-6">{message}</p>
          <div className="space-y-3">
            <Link href="/signup">
              <Button variant="outline" className="w-full">
                Sign Up Again
              </Button>
            </Link>
            <Link href="/signin">
              <Button variant="ghost" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 text-center">
        <div className="w-16 h-16 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
