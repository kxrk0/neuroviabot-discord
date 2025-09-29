'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useState } from 'react';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center" padding="lg">
        {/* Logo/Icon */}
        <div className="w-20 h-20 bg-discord rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-4xl">N</span>
        </div>
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome to NeuroViaBot
        </h1>
        <p className="text-gray-400 mb-8">
          Sign in with Discord to access your dashboard
        </p>
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-950/50 border border-red-500 rounded-lg">
            <p className="text-red-400 text-sm">
              {error === 'OAuthCallback'
                ? 'Authentication failed. Please try again.'
                : 'An error occurred. Please try again.'}
            </p>
          </div>
        )}
        
        {/* Login Button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          onClick={handleDiscordLogin}
          leftIcon={
            <svg className="w-6 h-6" viewBox="0 0 127.14 96.36" fill="currentColor">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
            </svg>
          }
        >
          Continue with Discord
        </Button>
        
        {/* Footer */}
        <p className="text-gray-500 text-sm mt-8">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </Card>
    </div>
  );
}
