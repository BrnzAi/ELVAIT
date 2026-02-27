'use client';

import { useEffect, useRef } from 'react';
import { X, Unlock, FileDown, Check } from 'lucide-react';
import Link from 'next/link';

type UnlockType = 'tier1' | 'tier2';

interface UnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: UnlockType;
  featureName?: string;
  returnTo?: string;
}

export function UnlockModal({
  isOpen,
  onClose,
  type,
  featureName = 'Full Results',
  returnTo,
}: UnlockModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnUrl = returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : '';

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="unlock-modal-title"
    >
      <div 
        ref={dialogRef}
        className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-900 border border-gray-700 p-6 shadow-xl animate-in zoom-in-95 duration-200"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {type === 'tier1' ? (
          // Tier 1 unlock - Free registration
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-elvait-green/10 flex items-center justify-center">
                <Unlock className="w-6 h-6 text-elvait-green" />
              </div>
              <h2 id="unlock-modal-title" className="text-xl font-semibold text-white">
                Unlock {featureName}
              </h2>
            </div>

            <p className="text-gray-300 mb-6">
              See how each stakeholder group scored and where they disagree.
            </p>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>Free with account</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>Takes 30 seconds to register</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>Results saved automatically</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href={`/signup${returnUrl}`}
                className="block w-full py-3 px-4 bg-elvait-red hover:bg-elvait-red-dark text-white font-medium rounded-lg text-center transition-colors"
              >
                Create free account
              </Link>
              <Link
                href={`/signin${returnUrl}`}
                className="block w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg text-center transition-colors"
              >
                Already have account? Sign in
              </Link>
            </div>
          </>
        ) : (
          // Tier 2+ unlock - Paid feature
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-elvait-grey/20 flex items-center justify-center">
                <FileDown className="w-6 h-6 text-purple-400" />
              </div>
              <h2 id="unlock-modal-title" className="text-xl font-semibold text-white">
                {featureName}
              </h2>
            </div>

            <p className="text-gray-300 mb-6">
              Available on Try Out and above plans.
            </p>

            <div className="bg-gray-800 rounded-lg p-4 mb-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Try Out</span>
                <span className="text-white font-medium">€199 for 3 months</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Core</span>
                <span className="text-white font-medium">€1,900/year</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Advanced</span>
                <span className="text-white font-medium">€3,500/year</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/pricing"
                className="block w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg text-center transition-colors"
              >
                See all plans
              </Link>
              <Link
                href="/contact"
                className="block w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg text-center transition-colors"
              >
                Contact us to get started
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default UnlockModal;
