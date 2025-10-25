'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  nrcBalance: number;
  nrcRank: number;
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
          setUser(userData);
          // Cache user data in localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('neurovia_user', JSON.stringify(userData));
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

