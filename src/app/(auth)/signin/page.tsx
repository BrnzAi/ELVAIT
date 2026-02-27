'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Mail, Lock, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const callbackUrl = returnTo || searchParams.get('callbackUrl') || '/dashboard';
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === 'EMAIL_NOT_VERIFIED') {
          setError('Please verify your email before signing in. Check your inbox for the verification link.');
        } else {
          setError('Invalid email or password');
        }
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
      {/* Show benefit banner when coming from results */}
      {returnTo?.includes('/results') && (
        <div className="mb-6 p-4 bg-elvait-green/50/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-elvait-green flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-elvait-green font-medium">Sign in to see your full results</p>
              <p className="text-elvait-green/70 text-sm mt-1">
                Your assessment is waiting with all the details unlocked.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
        <p className="text-gray-400">
          Sign in to access your assessments
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-elvait-green focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <Link 
              href="/forgot-password" 
              className="text-sm text-elvait-green hover:text-elvait-green"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-elvait-green focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Signing in...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              {returnTo?.includes('/results') ? 'Sign in & see full results' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-400">
        Don't have an account?{' '}
        <Link 
          href={returnTo ? `/signup?returnTo=${encodeURIComponent(returnTo)}` : '/signup'} 
          className="text-elvait-green hover:text-elvait-green"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 animate-pulse">
        <div className="h-8 bg-gray-800 rounded w-1/2 mx-auto mb-4" />
        <div className="h-4 bg-gray-800 rounded w-3/4 mx-auto" />
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}
