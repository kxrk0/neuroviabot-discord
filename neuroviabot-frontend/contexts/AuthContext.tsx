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
              setTimeout(() => {
                try {
                  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                  
                  // Create multiple oscillators for a richer sound
                  const playTone = (frequency: number, startTime: number, duration: number) => {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    oscillator.type = 'sine';
                    oscillator.frequency.setValueAtTime(frequency, startTime);
                    
                    gainNode.gain.setValueAtTime(0, startTime);
                    gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.01);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
                    
                    oscillator.start(startTime);
                    oscillator.stop(startTime + duration);
                  };
                  
                  const now = audioContext.currentTime;
                  // Play ascending C major chord
                  playTone(523.25, now, 0.3); // C5
                  playTone(659.25, now + 0.15, 0.3); // E5
                  playTone(783.99, now + 0.3, 0.4); // G5
                  
                } catch (err) {
                  console.log('Audio play failed:', err);
                }
              }, 800); // Longer delay to ensure page is fully loaded
              
              // Hide notification after 5 seconds
              setTimeout(() => setShowDevNotification(false), 5000);
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
                scale: 0.8,
                y: -100,
                transition: { duration: 0.3 } 
              }}
              className="fixed top-8 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-2xl px-4"
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
                <div className="relative bg-gradient-to-br from-gray-900 via-purple-900/50 to-blue-900/50 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-8 shadow-2xl overflow-hidden">
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
                  
                  <div className="relative flex items-center gap-6">
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
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl blur-xl opacity-75" />
                        <div className="relative w-20 h-20 bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
                          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
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
                        className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-blue-200 mb-2"
                      >
                        Hoş Geldin Developer! 🚀
                      </motion.h3>
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-purple-200 text-lg font-medium mb-3"
                      >
                        Başarılı giriş - Tüm sistemler hazır!
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex gap-2"
                      >
                        <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/50 flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          <span className="text-green-300 text-sm font-semibold">Online</span>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center gap-2">
                          <span className="text-purple-300 text-sm font-semibold">👨‍💻 Developer Mode</span>
                        </div>
                      </motion.div>
                    </div>
                    
                    {/* Emoji */}
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-6xl flex-shrink-0"
                    >
                      👨‍💻
                    </motion.div>
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

