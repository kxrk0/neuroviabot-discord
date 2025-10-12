'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useUser } from '@/hooks/useUser';
import { useSocket } from '@/hooks/useSocket';

interface NeuroCoinBalance {
  total: number;
  available: number;
  locked: number;
  lastUpdated: string;
}

interface NeuroCoinContextType {
  balance: NeuroCoinBalance | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const NeuroCoinContext = createContext<NeuroCoinContextType | undefined>(undefined);

export function NeuroCoinProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const socket = useSocket();
  const [balance, setBalance] = useState<NeuroCoinBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!user?.id) {
      setBalance(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
      const response = await fetch(`${API_URL}/api/neurocoin/balance/${user.id}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch balance');
      }

      const data = await response.json();
      setBalance({
        total: data.total || 0,
        available: data.available || 0,
        locked: data.locked || 0,
        lastUpdated: data.lastUpdated || new Date().toISOString(),
      });
    } catch (err) {
      console.error('Error fetching NeuroCoin balance:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch balance');
      // Set default balance on error
      setBalance({
        total: 0,
        available: 0,
        locked: 0,
        lastUpdated: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Fetch balance on mount and when user changes
  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Listen for real-time balance updates via Socket.IO
  useEffect(() => {
    if (!socket || !user?.id) return;

    const handleBalanceUpdate = (data: any) => {
      if (data.userId === user.id) {
        setBalance({
          total: data.total || 0,
          available: data.available || 0,
          locked: data.locked || 0,
          lastUpdated: data.timestamp || new Date().toISOString(),
        });
      }
    };

    socket.on('neurocoin_update', handleBalanceUpdate);

    return () => {
      socket.off('neurocoin_update', handleBalanceUpdate);
    };
  }, [socket, user?.id]);

  const refresh = useCallback(async () => {
    await fetchBalance();
  }, [fetchBalance]);

  return (
    <NeuroCoinContext.Provider value={{ balance, loading, error, refresh }}>
      {children}
    </NeuroCoinContext.Provider>
  );
}

export function useNeuroCoin() {
  const context = useContext(NeuroCoinContext);
  if (context === undefined) {
    throw new Error('useNeuroCoin must be used within a NeuroCoinProvider');
  }
  return context;
}

