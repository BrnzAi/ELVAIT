'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Mail, Lock, User, ArrowRight, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

function SignUpForm() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      // Email verification is required before sign-in
      // Show success message prompting user to check their email
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Check your email</h1>
        <p className="text-gray-400 mb-6">
          We've sent a verification link to <strong className="text-white">{formData.email}</strong>.
          Click the link in the email to verify your account.
        </p>
        <Link href="/signin">
          <Button className="w-full">
            Continue to Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
      {/* Show benefit banner when coming from results */}
      {returnTo?.includes('/results') && (
        <div className="mb-6 p-4 bg-brand-green/10 border border-brand-green/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-brand-green font-medium">Unlock your full results</p>
              <p className="text-brand-green/70 text-sm mt-1">
                Create a free account to see role breakdowns, all flags, and save your assessment.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Create your account</h1>
        <p className="text-gray-400">
          {returnTo?.includes('/results') 
            ? 'Free account • Takes 30 seconds'
            : 'Save your assessments and track your clarity journey'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Name (optional)
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-[#333] rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
              placeholder="Your name"
            />
          </div>
        </div>

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
              className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-[#333] rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-[#333] rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Min 8 characters with uppercase, lowercase, and number
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-[#333] rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
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
              Creating account...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              {returnTo?.includes('/results') ? 'Create account & see full results' : 'Create Account'}
              <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          By registering you agree to our{' '}
          <Link href="/terms" className="text-gray-400 hover:text-white">Terms</Link>
          {' · '}
          <Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
        </p>
      </form>

      <div className="mt-6 text-center text-sm text-gray-400">
        Already have an account?{' '}
        <Link 
          href={returnTo ? `/signin?returnTo=${encodeURIComponent(returnTo)}` : '/signin'} 
          className="text-brand-green hover:text-brand-green"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 animate-pulse">
        <div className="h-8 bg-[#111] rounded w-1/2 mx-auto mb-4" />
        <div className="h-4 bg-[#111] rounded w-3/4 mx-auto" />
      </div>
    }>
      <SignUpForm />
    </Suspense>
  );
}
