'use client';

import { useSearchParams } from 'next/navigation';
import { useState, Suspense, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';
import ShimmerButton from '@/components/ui/ShimmerButton';
import MinimalCard from '@/components/ui/MinimalCard';
import { 
  ShieldCheckIcon, 
  SparklesIcon, 
  LockClosedIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');
  const [isLoading, setIsLoading] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    // Create floating particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setParticles(newParticles);
  }, []);

  const handleDiscordLogin = async () => {
    setIsLoading(true);
    // Use NextAuth for Discord OAuth
    await signIn('discord', { callbackUrl: '/dashboard/servers' });
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-6">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(88,101,242,0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Floating Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-discord/30 rounded-full"
            initial={{ x: `${particle.x}%`, y: `${particle.y}%`, opacity: 0 }}
            animate={{
              x: [`${particle.x}%`, `${particle.x + 10}%`, `${particle.x}%`],
              y: [`${particle.y}%`, `${particle.y - 20}%`, `${particle.y}%`],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-discord/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-md w-full"
      >
        <MinimalCard className="text-center p-12">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              duration: 0.8,
              delay: 0.2 
            }}
            className="mb-8 inline-block relative"
          >
            <motion.div
              className="absolute inset-0 bg-discord blur-2xl opacity-50"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-discord to-purple-600 flex items-center justify-center shadow-lg shadow-discord/50">
              <span className="text-white font-black text-4xl">N</span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-black text-white mb-3"
          >
            Welcome Back
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400 mb-8"
          >
            Sign in with Discord to manage your servers
          </motion.p>

          {/* Features List */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-8 space-y-3"
          >
            {[
              { icon: <ShieldCheckIcon className="w-5 h-5" />, text: 'Secure OAuth2 Authentication' },
              { icon: <SparklesIcon className="w-5 h-5" />, text: 'Real-time Dashboard' },
              { icon: <CheckCircleIcon className="w-5 h-5" />, text: 'Instant Server Management' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center gap-3 text-left text-sm text-gray-300"
              >
                <div className="p-2 rounded-lg bg-discord/10 text-discord">
                  {feature.icon}
                </div>
                <span>{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
              >
                <p className="text-red-400 text-sm font-medium">
                  {error === 'OAuthCallback'
                    ? '❌ Authentication failed. Please try again.'
                    : '❌ An error occurred. Please try again.'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <ShimmerButton
              onClick={handleDiscordLogin}
              disabled={isLoading}
              className="w-full py-4 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <motion.svg 
                      className="h-5 w-5" 
                      fill="none" 
                      viewBox="0 0 24 24"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </motion.svg>
                    <span>Connecting to Discord...</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 127.14 96.36" fill="currentColor">
                      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                    </svg>
                    <span>Continue with Discord</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </ShimmerButton>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-gray-500 text-xs"
          >
            <LockClosedIcon className="w-3 h-3 inline-block mr-1" />
            Secure authentication powered by Discord OAuth2
          </motion.p>
        </MinimalCard>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center mt-6"
        >
          <a href="/" className="text-gray-400 hover:text-white transition-colors text-sm inline-flex items-center gap-2 group">
            <motion.span
              className="inline-block"
              whileHover={{ x: -5 }}
            >
              ←
            </motion.span>
            <span className="group-hover:underline">Back to Home</span>
          </a>
        </motion.div>
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