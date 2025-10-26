'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  premiumTier: 'free' | 'premium' | 'vip';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('neurovia_user');
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {
          localStorage.removeItem('neurovia_user');
        }
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showDevNotification, setShowDevNotification] = useState(false);
  
  // Developer IDs
  const DEVELOPER_IDS = ['315875588906680330', '413081778031427584']; // swxff & schizoid

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      
      // Add timeout to fetch
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const res = await fetch(`${API_URL}/api/auth/user`, {
        credentials: 'include',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (res.ok) {
        const userData = await res.json();
        if (userData && userData.id) {
          const wasNotLoggedIn = !user;
          setUser(userData);
          // Cache user data in localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('neurovia_user', JSON.stringify(userData));
          }
          
          // Check if developer and show notification
          if (wasNotLoggedIn && DEVELOPER_IDS.includes(userData.id)) {
            setShowDevNotification(true);
            // Play success notification sound using Web Audio API
            try {
              const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
              const oscillator = audioContext.createOscillator();
              const gainNode = audioContext.createGain();
              
              oscillator.connect(gainNode);
              gainNode.connect(audioContext.destination);
              
              // Play a pleasant notification sound (C major chord)
              oscillator.type = 'sine';
              oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
              oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
              oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
              
              gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
              gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
              
              oscillator.start(audioContext.currentTime);
              oscillator.stop(audioContext.currentTime + 0.5);
            } catch (err) {
              console.log('Audio play failed:', err);
            }
            // Hide notification after 5 seconds
            setTimeout(() => setShowDevNotification(false), 5000);
          }
        } else {
          setUser(null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('neurovia_user');
          }
        }
      } else {
        setUser(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('neurovia_user');
        }
      }
    } catch (error) {
      // Silently fail - user is just not authenticated
      if (error instanceof Error && error.name !== 'AbortError') {
        console.warn('Auth check failed, continuing without authentication');
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  const login = () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    window.location.href = `${API_URL}/api/auth/discord`;
  };

  const logout = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    setUser(null);
    // Clear cached user data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('neurovia_user');
    }
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      refreshUser
    }}>
      {children}
      
      {/* Developer Login Notification */}
      <AnimatePresence>
        {showDevNotification && (
          <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="fixed top-8 right-8 z-[9999] pointer-events-none"
          >
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 20px rgba(168, 85, 247, 0.5)',
                  '0 0 40px rgba(168, 85, 247, 0.8)',
                  '0 0 20px rgba(168, 85, 247, 0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-gradient-to-br from-purple-600 via-purple-700 to-blue-700 backdrop-blur-xl border-2 border-purple-400 rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center"
                >
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </motion.div>
                <div>
                  <h3 className="text-white font-black text-xl mb-1">Hoş Geldin Developer! 🚀</h3>
                  <p className="text-purple-200 text-sm font-medium">Başarılı giriş - Tüm sistemler hazır!</p>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-4xl"
                >
                  👨‍💻
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

