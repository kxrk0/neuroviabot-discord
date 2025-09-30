'use client';

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');
  const [isLoading, setIsLoading] = useState(false);

  const handleDiscordLogin = () => {
    setIsLoading(true);
    // Backend OAuth kullanıyoruz - Passport.js
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/discord`;
  };

  return (
    <div className="min-h-screen bg-[#23272A] relative overflow-hidden flex items-center justify-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Discord Blue Gradient Orbs */}
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 bg-[#5865F2] rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#7289DA] rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#5865F2] rounded-full mix-blend-multiply filter blur-3xl opacity-15"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center justify-center mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#5865F2] to-[#7289DA] rounded-3xl blur-2xl opacity-50"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <div className="relative w-24 h-24 bg-gradient-to-br from-[#5865F2] to-[#7289DA] rounded-3xl flex items-center justify-center shadow-2xl shadow-[#5865F2]/50">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </div>
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl font-black text-white mb-3 tracking-tight"
          >
            NeuroVia<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5865F2] to-[#7289DA]">Bot</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-gray-400 text-lg"
          >
            Welcome back to the future
          </motion.p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#5865F2] to-[#7289DA] rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition duration-500" />
            
            {/* Card */}
            <div className="relative bg-[#2C2F33]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl"
                >
                  <p className="text-red-400 text-sm font-medium text-center">
                    ⚠️ Authentication failed. Please try again.
                  </p>
                </motion.div>
              )}

              {/* Login Button */}
              <motion.button
                onClick={handleDiscordLogin}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full group/btn overflow-hidden rounded-2xl transition-all duration-300"
              >
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#5865F2] to-[#7289DA]" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#4752C4] to-[#5865F2] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="relative px-8 py-4 flex items-center justify-center gap-3">
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                      />
                      <span className="text-white font-semibold text-lg">Connecting...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                      </svg>
                      <span className="text-white font-semibold text-lg">Continue with Discord</span>
                      <motion.svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </motion.svg>
                    </>
                  )}
                </div>
              </motion.button>

              {/* Security Badge */}
              <div className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Secured by Discord OAuth2</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-8 text-center"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <motion.svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              whileHover={{ x: -5 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </motion.svg>
            <span className="font-medium">Back to home</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#23272A] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}