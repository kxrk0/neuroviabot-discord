'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ShoppingBagIcon,
  TrophyIcon,
  ClockIcon,
  ChartBarIcon,
  SparklesIcon,
  BanknotesIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  from: string;
  to: string;
  timestamp: string;
  metadata?: any;
}

export default function NeuroCoinDashboard() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  
  const [balance, setBalance] = useState({ wallet: 0, bank: 0, total: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({
    dailyEarnings: 0,
    weeklyEarnings: 0,
    totalEarned: 0,
    totalSpent: 0,
    tradeCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Mock data for now - will be replaced with real API calls
      setBalance({
        wallet: 15420,
        bank: 48750,
        total: 64170
      });
      
      setTransactions([
        {
          id: '1',
          type: 'daily',
          amount: 850,
          from: 'system',
          to: user?.id || '',
          timestamp: new Date().toISOString()
        },
        {
          id: '2',
          type: 'work',
          amount: 420,
          from: 'system',
          to: user?.id || '',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        }
      ]);
      
      setStats({
        dailyEarnings: 2340,
        weeklyEarnings: 18920,
        totalEarned: 125600,
        totalSpent: 61430,
        tradeCount: 23
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    );
  }

  const change24h = ((stats.dailyEarnings - stats.totalSpent / 7) / balance.total) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                  <span className="text-2xl">🪙</span>
                </div>
                NeuroCoin Dashboard
              </h1>
              <p className="text-gray-400">The Neural Currency of Discord</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/marketplace"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <ShoppingBagIcon className="w-5 h-5" />
                Pazar Yeri
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Balance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 text-white"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-purple-200 mb-2">Toplam Bakiye</p>
                <h2 className="text-5xl font-black mb-2">{balance.total.toLocaleString()} NRC</h2>
                <div className="flex items-center gap-2">
                  {change24h >= 0 ? (
                    <ArrowTrendingUpIcon className="w-5 h-5 text-green-300" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-5 h-5 text-red-300" />
                  )}
                  <span className={`text-lg font-semibold ${change24h >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}%
                  </span>
                  <span className="text-purple-200">24 saat</span>
                </div>
              </div>
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <CurrencyDollarIcon className="w-8 h-8" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-purple-200 text-sm mb-1">💵 Cüzdan</p>
                <p className="text-2xl font-bold">{balance.wallet.toLocaleString()} NRC</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-purple-200 text-sm mb-1">🏦 Banka</p>
                <p className="text-2xl font-bold">{balance.bank.toLocaleString()} NRC</p>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">Hızlı İşlemler</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                <BanknotesIcon className="w-5 h-5" />
                Yatır
              </button>
              <button className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                <BanknotesIcon className="w-5 h-5" />
                Çek
              </button>
              <button className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                <ArrowPathIcon className="w-5 h-5" />
                Transfer
              </button>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<ChartBarIcon className="w-6 h-6" />}
            label="Günlük Kazanç"
            value={`${stats.dailyEarnings.toLocaleString()} NRC`}
            color="from-green-500 to-emerald-500"
            delay={0.3}
          />
          <StatCard
            icon={<ArrowTrendingUpIcon className="w-6 h-6" />}
            label="Haftalık Kazanç"
            value={`${stats.weeklyEarnings.toLocaleString()} NRC`}
            color="from-blue-500 to-cyan-500"
            delay={0.4}
          />
          <StatCard
            icon={<TrophyIcon className="w-6 h-6" />}
            label="Toplam Kazanılan"
            value={`${stats.totalEarned.toLocaleString()} NRC`}
            color="from-yellow-500 to-amber-500"
            delay={0.5}
          />
          <StatCard
            icon={<ShoppingBagIcon className="w-6 h-6" />}
            label="Ticaret Sayısı"
            value={stats.tradeCount.toString()}
            color="from-purple-500 to-pink-500"
            delay={0.6}
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transaction History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <ClockIcon className="w-6 h-6 text-purple-400" />
                Son İşlemler
              </h3>
              <button className="text-purple-400 hover:text-purple-300 text-sm font-semibold">
                Tümünü Gör
              </button>
            </div>

            <div className="space-y-3">
              {transactions.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Henüz işlem yok</p>
              ) : (
                transactions.map((tx) => (
                  <TransactionItem key={tx.id} transaction={tx} />
                ))
              )}
            </div>
          </motion.div>

          {/* Earnings Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <SparklesIcon className="w-6 h-6 text-purple-400" />
              Kazanç Dağılımı
            </h3>

            <div className="space-y-4">
              <EarningBar label="Aktivite Ödülleri" amount={8420} percentage={45} color="bg-green-500" />
              <EarningBar label="Görevler" amount={5230} percentage={28} color="bg-blue-500" />
              <EarningBar label="Oyunlar" amount={3150} percentage={17} color="bg-yellow-500" />
              <EarningBar label="Ticaret" amount={1870} percentage={10} color="bg-purple-500" />
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Toplam Kazanç</span>
                <span className="text-white font-bold text-lg">{stats.weeklyEarnings.toLocaleString()} NRC</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </motion.div>
  );
}

function TransactionItem({ transaction }: { transaction: Transaction }) {
  const typeIcons: Record<string, string> = {
    daily: '🎁',
    work: '💼',
    transfer: '💸',
    activity: '⚡',
    quest: '🗺️',
    achievement: '🏆',
    marketplace_purchase: '🛒',
    marketplace_sale: '💰'
  };

  const typeNames: Record<string, string> = {
    daily: 'Günlük Ödül',
    work: 'Çalışma',
    transfer: 'Transfer',
    activity: 'Aktivite',
    quest: 'Görev',
    achievement: 'Başarı',
    marketplace_purchase: 'Satın Alma',
    marketplace_sale: 'Satış'
  };

  const isIncoming = transaction.to !== 'system';
  const date = new Date(transaction.timestamp);

  return (
    <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-xl">
          {typeIcons[transaction.type] || '📝'}
        </div>
        <div>
          <p className="text-white font-semibold">{typeNames[transaction.type] || transaction.type}</p>
          <p className="text-gray-400 text-sm">
            {date.toLocaleDateString('tr-TR')} {date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
      <div className={`text-lg font-bold ${isIncoming ? 'text-green-400' : 'text-red-400'}`}>
        {isIncoming ? '+' : '-'}{transaction.amount.toLocaleString()} NRC
      </div>
    </div>
  );
}

function EarningBar({ label, amount, percentage, color }: any) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-300 text-sm">{label}</span>
        <span className="text-white font-semibold">{amount.toLocaleString()} NRC</span>
      </div>
      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}

