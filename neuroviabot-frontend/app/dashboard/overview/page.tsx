'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  UsersIcon, 
  ServerIcon, 
  CommandLineIcon,
  ClockIcon,
  SignalIcon,
  CpuChipIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

interface BotStats {
  guilds: number;
  users: number;
  commands: number;
  uptime: number;
  ping: number;
  memoryUsage: number;
}

export default function OverviewPage() {
  const [stats, setStats] = useState<BotStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBotStats();
    const interval = setInterval(fetchBotStats, 5000); // Her 5 saniyede bir güncelle
    return () => clearInterval(interval);
  }, []);

  const fetchBotStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/bot/stats', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Bot stats fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatUptime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}g ${hours}s`;
    if (hours > 0) return `${hours}s ${minutes}d`;
    return `${minutes}d`;
  };

  const statCards = [
    {
      title: 'Toplam Sunucu',
      value: stats?.guilds || 0,
      icon: ServerIcon,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/10',
    },
    {
      title: 'Toplam Kullanıcı',
      value: stats?.users || 0,
      icon: UsersIcon,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/10 to-pink-500/10',
    },
    {
      title: 'Toplam Komut',
      value: stats?.commands || 0,
      icon: CommandLineIcon,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/10 to-emerald-500/10',
    },
    {
      title: 'Çalışma Süresi',
      value: stats ? formatUptime(stats.uptime) : '0d',
      icon: ClockIcon,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-500/10 to-red-500/10',
      isText: true,
    },
    {
      title: 'Bot Gecikmesi',
      value: stats ? `${stats.ping}ms` : '0ms',
      icon: SignalIcon,
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-500/10 to-orange-500/10',
      isText: true,
    },
    {
      title: 'Bellek Kullanımı',
      value: stats ? `${Math.round(stats.memoryUsage)}MB` : '0MB',
      icon: CpuChipIcon,
      gradient: 'from-indigo-500 to-purple-500',
      bgGradient: 'from-indigo-500/10 to-purple-500/10',
      isText: true,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0C10]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-lg">İstatistikler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0C10] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <ChartBarIcon className="w-10 h-10 text-purple-500" />
            <h1 className="text-4xl font-black text-white">Bot İstatistikleri</h1>
          </div>
          <p className="text-gray-400 text-lg">
            NeuroViaBot'un gerçek zamanlı performans verileri
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group relative"
            >
              {/* Gradient border effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${card.gradient} rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-300`}></div>
              
              {/* Card content */}
              <div className={`relative bg-gradient-to-br ${card.bgGradient} backdrop-blur-xl border border-white/10 rounded-2xl p-6`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient}`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <ArrowTrendingUpIcon className="w-5 h-5 text-green-400" />
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm mb-1">{card.title}</p>
                  <p className="text-3xl font-black text-white">
                    {card.isText ? card.value : card.value.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
            <SignalIcon className="w-7 h-7 text-purple-500" />
            Bot Durumu
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <span className="text-gray-400">Durum</span>
                <span className="flex items-center gap-2 text-green-400 font-bold">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Çevrimiçi
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <span className="text-gray-400">Discord API</span>
                <span className="text-green-400 font-bold">Bağlı</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <span className="text-gray-400">Veritabanı</span>
                <span className="text-green-400 font-bold">Aktif</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <span className="text-gray-400">WebSocket</span>
                <span className="text-green-400 font-bold">Bağlı</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

