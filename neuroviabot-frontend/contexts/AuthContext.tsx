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
            // Mark that dev notification should be shown
            if (typeof window !== 'undefined') {
              localStorage.setItem('neurovia_show_dev_notification', 'true');
            }
          }
          
          // Check if we should show dev notification (after redirect)
          if (typeof window !== 'undefined') {
            const shouldShow = localStorage.getItem('neurovia_show_dev_notification');
            if (shouldShow === 'true' && DEVELOPER_IDS.includes(userData.id)) {
              localStorage.removeItem('neurovia_show_dev_notification');
              setShowDevNotification(true);
              
              // Play success notification sound using Web Audio API
              // Use user interaction to unlock AudioContext
              const playNotificationSound = () => {
                try {
                  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                  
                  // Resume audio context (required for autoplay policy)
                  audioContext.resume().then(() => {
                    // Create multiple oscillators for a richer sound
                    const playTone = (frequency: number, startTime: number, duration: number) => {
                      const oscillator = audioContext.createOscillator();
                      const gainNode = audioContext.createGain();
                      
                      oscillator.connect(gainNode);
                      gainNode.connect(audioContext.destination);
                      
                      oscillator.type = 'sine';
                      oscillator.frequency.setValueAtTime(frequency, startTime);
                      
                      gainNode.gain.setValueAtTime(0, startTime);
                      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.01);
                      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
                      
                      oscillator.start(startTime);
                      oscillator.stop(startTime + duration);
                    };
                    
                    const now = audioContext.currentTime;
                    // Play ascending C major chord
                    playTone(523.25, now, 0.3); // C5
                    playTone(659.25, now + 0.15, 0.3); // E5
                    playTone(783.99, now + 0.3, 0.4); // G5
                  });
                } catch (err) {
                  console.log('Audio play failed:', err);
                }
              };
              
              // Try to play immediately
              setTimeout(playNotificationSound, 1000);
              
              // Also play on any user interaction
              const playOnInteraction = () => {
                playNotificationSound();
                document.removeEventListener('click', playOnInteraction);
                document.removeEventListener('keydown', playOnInteraction);
              };
              document.addEventListener('click', playOnInteraction, { once: true });
              document.addEventListener('keydown', playOnInteraction, { once: true });
              
              // Hide notification after 3 seconds
              setTimeout(() => setShowDevNotification(false), 3000);
            }
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
      
      {/* Developer Login Notification - Hero Style */}
      <AnimatePresence>
        {showDevNotification && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
            />
            
            {/* Notification Card */}
            <motion.div
              initial={{ opacity: 0, y: -100, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.95,
                y: -20,
                transition: { 
                  duration: 0.6,
                  ease: "easeInOut"
                } 
              }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-md px-4"
            >
              <div className="relative">
                {/* Animated Glow */}
                <motion.div
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-3xl blur-2xl"
                />
                
                {/* Card Content */}
                <div className="relative bg-gradient-to-br from-gray-900/95 via-purple-900/90 to-blue-900/90 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                      backgroundSize: '20px 20px'
                    }} />
                  </div>
                  
                  {/* Animated Gradient Orbs */}
                  <motion.div
                    animate={{
                      x: [0, 100, 0],
                      y: [0, -50, 0]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 right-0 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl"
                  />
                  <motion.div
                    animate={{
                      x: [0, -100, 0],
                      y: [0, 50, 0]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl"
                  />
                  
                  <div className="relative flex items-center gap-4">
                    {/* Icon */}
                    <motion.div
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
                        scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                      }}
                      className="flex-shrink-0"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl blur-lg opacity-60" />
                        <div className="relative w-14 h-14 bg-gradient-to-br from-purple-500 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-xl">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Text Content */}
                    <div className="flex-1">
                      <motion.h3 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl font-bold text-white mb-1"
                      >
                        Developer Mode Active 🚀
                      </motion.h3>
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-gray-300 text-sm font-medium mb-2"
                      >
                        Hoş geldin! Tüm sistemler hazır.
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex gap-2"
                      >
                        <div className="px-2.5 py-1 rounded-full bg-green-500/20 border border-green-500/30 flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                          <span className="text-green-300 text-xs font-semibold">System Online</span>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
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

