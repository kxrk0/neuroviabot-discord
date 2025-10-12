'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useNeuroCoin } from '@/contexts/NeuroCoinContext';
import { ShoppingBagIcon, ChartBarIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function NeuroCoinBadge() {
  const { balance, loading, refresh } = useNeuroCoin();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [animatedBalance, setAnimatedBalance] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Animate balance changes
  useEffect(() => {
    if (balance && balance.total !== animatedBalance) {
      const duration = 1000;
      const steps = 30;
      const increment = (balance.total - animatedBalance) / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setAnimatedBalance(balance.total);
          clearInterval(timer);
        } else {
          setAnimatedBalance(prev => prev + increment);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [balance?.total]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const formatBalance = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.floor(value));
  };

  if (loading && !balance) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50 animate-pulse">
        <div className="w-5 h-5 bg-gray-700 rounded-full" />
        <div className="w-16 h-4 bg-gray-700 rounded" />
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 border border-purple-500/30 transition-all duration-200 group"
        aria-label="NeuroCoin Balance"
      >
        <motion.div
          animate={{ rotate: loading ? 360 : 0 }}
          transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: 'linear' }}
          className="text-2xl"
        >
          🪙
        </motion.div>
        <span className="text-sm font-bold text-white hidden sm:block">
          {formatBalance(animatedBalance)} <span className="text-purple-400">NRC</span>
        </span>
      </button>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-72 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-bold text-lg">NeuroCoin Balance</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    refresh();
                  }}
                  className="p-1 hover:bg-white/20 rounded transition"
                  aria-label="Refresh balance"
                >
                  <ArrowPathIcon className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="text-3xl font-black text-white">
                {formatBalance(balance?.total || 0)} <span className="text-purple-200">NRC</span>
              </div>
            </div>

            {/* Balance Breakdown */}
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Available</span>
                <span className="text-green-400 font-semibold">
                  {formatBalance(balance?.available || 0)} NRC
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Locked</span>
                <span className="text-yellow-400 font-semibold">
                  {formatBalance(balance?.locked || 0)} NRC
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="border-t border-gray-700 p-3 space-y-2">
              <Link
                href="/neurocoin"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg transition group"
              >
                <ChartBarIcon className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
                <div>
                  <div className="text-white text-sm font-medium">NeuroCoin Dashboard</div>
                  <div className="text-gray-500 text-xs">View stats & history</div>
                </div>
              </Link>
              <Link
                href="/marketplace"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg transition group"
              >
                <ShoppingBagIcon className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                <div>
                  <div className="text-white text-sm font-medium">Marketplace</div>
                  <div className="text-gray-500 text-xs">Buy & sell items</div>
                </div>
              </Link>
            </div>

            {/* Last Updated */}
            {balance?.lastUpdated && (
              <div className="px-4 py-2 bg-gray-800/50 text-center">
                <span className="text-xs text-gray-500">
                  Updated {new Date(balance.lastUpdated).toLocaleTimeString()}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

