'use client';

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import ShimmerButton from '@/components/ui/ShimmerButton';
import MinimalCard from '@/components/ui/MinimalCard';

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');
  const [isLoading, setIsLoading] = useState(false);

  const handleDiscordLogin = () => {
    setIsLoading(true);
    // Redirect to backend Discord OAuth
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    window.location.href = `${apiUrl}/api/auth/discord`;
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-6">
      {/* Minimal Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(88,101,242,0.15),transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative max-w-md w-full"
      >
        <MinimalCard className="text-center p-12">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="mb-8 inline-block"
          >
            <div className="w-20 h-20 rounded-2xl bg-discord flex items-center justify-center">
              <span className="text-white font-black text-4xl">N</span>
            </div>
          </motion.div>

          {/* Title */}
          <h1 className="text-3xl font-black text-white mb-3">Welcome Back</h1>
          <p className="text-gray-400 mb-8">Sign in with Discord to continue</p>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
            >
              <p className="text-red-400 text-sm">
                {error === 'OAuthCallback'
                  ? 'Authentication failed. Please try again.'
                  : 'An error occurred. Please try again.'}
              </p>
            </motion.div>
          )}

          {/* Login Button */}
          <ShimmerButton
            onClick={handleDiscordLogin}
            className="w-full py-4 mb-8"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Connecting...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" viewBox="0 0 127.14 96.36" fill="currentColor">
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                </svg>
                Continue with Discord
              </>
            )}
          </ShimmerButton>

          <p className="text-gray-500 text-xs">
            By signing in, you agree to our{' '}
            <a href="/terms" className="text-discord hover:underline">Terms</a>
            {' '}and{' '}
            <a href="/privacy" className="text-discord hover:underline">Privacy</a>
          </p>
        </MinimalCard>

        <div className="text-center mt-6">
          <a href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
            ← Back to Home
          </a>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}