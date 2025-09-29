'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, ShieldCheckIcon, BoltIcon } from '@heroicons/react/24/outline';

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');
  const [isLoading, setIsLoading] = useState(false);

  const handleDiscordLogin = async () => {
    setIsLoading(true);
    try {
      await signIn('discord', { callbackUrl: '/dashboard' });
    } catch (err) {
      console.error('Login failed:', err);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-discord/20 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[150px] animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[200px] animate-pulse-slow"></div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-md w-full"
      >
        {/* Card */}
        <div className="relative bg-gray-900/50 backdrop-blur-2xl border border-gray-800/50 rounded-3xl p-10 shadow-2xl">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-discord to-purple-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
          
          <div className="relative">
            {/* Logo with Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-discord to-purple-600 rounded-3xl blur-xl animate-pulse-slow"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-discord to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                  <span className="text-white font-black text-5xl">N</span>
                </div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-black text-white mb-3">
                Welcome Back
              </h1>
              <p className="text-gray-400 text-lg">
                Sign in with Discord to continue
              </p>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 p-4 bg-red-950/50 border border-red-500/50 rounded-2xl backdrop-blur-sm"
              >
                <p className="text-red-400 text-sm text-center font-medium">
                  {error === 'OAuthCallback'
                    ? 'Authentication failed. Please try again.'
                    : 'An error occurred. Please try again.'}
                </p>
              </motion.div>
            )}

            {/* Login Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDiscordLogin}
                disabled={isLoading}
                className="w-full group relative px-8 py-5 bg-gradient-to-r from-discord to-purple-600 hover:from-discord-dark hover:to-purple-700 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-discord/40 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-7 h-7" viewBox="0 0 127.14 96.36" fill="currentColor">
                        <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                      </svg>
                      <span>Continue with Discord</span>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </motion.button>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-10 space-y-4"
            >
              <FeatureBadge
                icon={<ShieldCheckIcon className="w-5 h-5" />}
                text="Secure & Private"
              />
              <FeatureBadge
                icon={<BoltIcon className="w-5 h-5" />}
                text="Instant Access"
              />
              <FeatureBadge
                icon={<SparklesIcon className="w-5 h-5" />}
                text="No Email Required"
              />
            </motion.div>

            {/* Footer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-gray-500 text-sm mt-8 text-center leading-relaxed"
            >
              By signing in, you agree to our{' '}
              <a href="/terms" className="text-discord hover:text-discord-light transition-colors">
                Terms of Service
              </a>
              {' '}and{' '}
              <a href="/privacy" className="text-discord hover:text-discord-light transition-colors">
                Privacy Policy
              </a>
            </motion.p>
          </div>
        </div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-6"
        >
          <a
            href="/"
            className="text-gray-400 hover:text-white transition-colors duration-300 font-medium"
          >
            ← Back to Home
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}

function FeatureBadge({ icon, text }: any) {
  return (
    <div className="flex items-center gap-3 text-gray-400 group">
      <div className="p-2 bg-gray-800/50 rounded-lg group-hover:bg-discord/20 group-hover:text-discord transition-all duration-300">
        {icon}
      </div>
      <span className="group-hover:text-gray-300 transition-colors duration-300">{text}</span>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center">
          <div className="text-white text-lg">Loading...</div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}