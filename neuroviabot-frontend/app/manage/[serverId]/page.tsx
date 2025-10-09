'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  HandRaisedIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  BoltIcon,
  Cog6ToothIcon,
  ArrowLeftIcon,
  BellIcon,
  SparklesIcon,
  CheckCircleIcon,
  XMarkIcon,
  ChevronDownIcon,
  HashtagIcon,
  CommandLineIcon,
} from '@heroicons/react/24/outline';
import BotCommands from '../../../components/dashboard/BotCommands';
import FeatureManager from '../../../components/dashboard/FeatureManager';
import WelcomeSettings from '../../../components/dashboard/WelcomeSettings';
import ModerationSettings from '../../../components/dashboard/ModerationSettings';
import LevelingSettings from '../../../components/dashboard/LevelingSettings';
import EconomySettings from '../../../components/dashboard/EconomySettings';

// Feature Categories (MEE6 style)
const categories = [
  {
    id: 'welcome',
    name: 'Hoşgeldin & Hoşçakal',
    description: 'Yeni üyeleri karşılayın ve ayrılan üyelere veda edin',
    icon: HandRaisedIcon,
    color: 'from-blue-500 to-cyan-500',
    premium: false,
    features: [
      {
        id: 'welcomeMessage',
        name: 'Karşılama Mesajı',
        description: 'Yeni üyelere özel karşılama mesajı gönderin',
        settings: ['channelId', 'message', 'embed']
      },
      {
        id: 'leaveMessage',
        name: 'Ayrılma Mesajı',
        description: 'Ayrılan üyeler için mesaj gönderin',
        settings: ['channelId', 'message']
      },
    ]
  },
  {
    id: 'roles',
    name: 'Tepki Rolleri',
    description: 'Üyelerin tepki vererek rol almasını sağlayın',
    icon: UserGroupIcon,
    color: 'from-purple-500 to-pink-500',
    premium: true,
    features: [
      {
        id: 'reactionRoles',
        name: 'Tepki Rolleri',
        description: 'Mesajlara tepki vererek rol kazanma sistemi',
        settings: ['messageId', 'roles']
      },
    ]
  },
  {
    id: 'moderation',
    name: 'Moderasyon',
    description: 'Sunucunuzu otomatik olarak koruyun',
    icon: ShieldCheckIcon,
    color: 'from-red-500 to-orange-500',
    premium: false,
    features: [
      {
        id: 'autoMod',
        name: 'Otomatik Moderasyon',
        description: 'Spam, küfür ve zararlı içerikleri engelleyin',
        settings: ['enabled', 'spamProtection', 'badWords', 'logChannel']
      },
      {
        id: 'warnings',
        name: 'Uyarı Sistemi',
        description: 'Üyelere uyarı verin ve otomatik ceza uygulayın',
        settings: ['enabled', 'maxWarnings', 'punishments']
      },
    ]
  },
  {
    id: 'leveling',
    name: 'Seviye Sistemi',
    description: 'Aktif üyeleri ödüllendirin',
    icon: ChartBarIcon,
    color: 'from-green-500 to-emerald-500',
    premium: false,
    features: [
      {
        id: 'xpSystem',
        name: 'XP Sistemi',
        description: 'Mesaj başına XP kazanma sistemi',
        settings: ['enabled', 'xpPerMessage', 'cooldown', 'announceChannel']
      },
      {
        id: 'roleRewards',
        name: 'Seviye Ödülleri',
        description: 'Belirli seviyelerde otomatik rol verin',
        settings: ['rewards']
      },
    ]
  },
  {
    id: 'automation',
    name: 'Otomasyon',
    description: 'Sunucu yönetimini otomatikleştirin',
    icon: BoltIcon,
    color: 'from-yellow-500 to-amber-500',
    premium: true,
    features: [
      {
        id: 'autoRole',
        name: 'Otomatik Rol',
        description: 'Yeni üyelere otomatik rol verin',
        settings: ['enabled', 'roleId']
      },
      {
        id: 'scheduled',
        name: 'Zamanlanmış Mesajlar',
        description: 'Belirli zamanlarda mesaj gönderin',
        settings: ['messages']
      },
    ]
  },
  {
    id: 'backup',
    name: 'Yedekleme',
    description: 'Sunucu yedekleme ve geri yükleme sistemi',
    icon: ShieldCheckIcon,
    color: 'from-blue-500 to-indigo-500',
    premium: true,
    features: [
      {
        id: 'backupSystem',
        name: 'Yedekleme Sistemi',
        description: 'Sunucu ayarlarını yedekle ve geri yükle',
        settings: ['create', 'restore', 'list', 'delete', 'schedule']
      },
    ]
  },
  {
    id: 'security',
    name: 'Güvenlik',
    description: 'Sunucu güvenlik ve doğrulama sistemi',
    icon: ShieldCheckIcon,
    color: 'from-red-500 to-orange-500',
    premium: false,
    features: [
      {
        id: 'guardSystem',
        name: 'Guard Sistemi',
        description: 'Anti-raid ve güvenlik koruması',
        settings: ['enabled', 'raidProtection', 'spamProtection', 'logChannel']
      },
      {
        id: 'verificationSystem',
        name: 'Doğrulama Sistemi',
        description: 'Yeni üye doğrulama ve onay sistemi',
        settings: ['enabled', 'method', 'role', 'timeout']
      },
    ]
  },
  {
    id: 'analytics',
    name: 'Analitik',
    description: 'Sunucu istatistikleri ve analitik raporlar',
    icon: ChartBarIcon,
    color: 'from-indigo-500 to-purple-500',
    premium: false,
    features: [
      {
        id: 'statistics',
        name: 'İstatistikler',
        description: 'Detaylı sunucu ve bot istatistikleri',
        settings: ['bot', 'server', 'activity', 'leaderboard']
      },
      {
        id: 'analytics',
        name: 'Analitik Raporlar',
        description: 'Komut kullanımı ve performans analizi',
        settings: ['commands', 'errors', 'performance', 'users']
      },
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Premium özellikler ve abonelik yönetimi',
    icon: SparklesIcon,
    color: 'from-yellow-500 to-amber-500',
    premium: true,
    features: [
      {
        id: 'premiumFeatures',
        name: 'Premium Özellikler',
        description: 'Premium kullanıcılar için özel özellikler',
        settings: ['status', 'features', 'benefits', 'upgrade']
      },
    ]
  },
  {
    id: 'features',
    name: 'Özellik Yönetimi',
    description: 'Bot özelliklerini açın/kapatın ve dil ayarlarını yapın',
    icon: Cog6ToothIcon,
    color: 'from-emerald-500 to-teal-500',
    premium: false,
    features: [
      {
        id: 'featureToggle',
        name: 'Özellik Kontrolü',
        description: 'Bot özelliklerini tek tıkla yönetin',
        settings: ['tickets', 'economy', 'moderation', 'leveling', 'giveaways', 'music', 'games', 'security']
      },
      {
        id: 'languageSettings',
        name: 'Dil Ayarları',
        description: 'Bot mesajları için dil seçin ve özelleştirin',
        settings: ['language', 'customMessages', 'translations']
      },
      {
        id: 'prefixSettings',
        name: 'Komut Öneki',
        description: 'Bot komutları için önek belirleyin',
        settings: ['prefix', 'customPrefix']
      },
    ]
  },
];

export default function ServerDashboard() {
  const params = useParams();
  const router = useRouter();
  const serverId = params?.serverId as string;
  
  const [activeCategory, setActiveCategory] = useState('welcome');
  const [guild, setGuild] = useState<any>(null);
  const [guilds, setGuilds] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [guildMenuOpen, setGuildMenuOpen] = useState(false);
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);
  const [notifications] = useState(3); // Mock notifications

  useEffect(() => {
    fetchUser();
    fetchUserGuilds();
    if (serverId) {
      fetchGuildData();
      fetchGuildSettings();
    }
  }, [serverId]);

  // ESC tuşu ile dropdown kapatma
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && guildMenuOpen) {
        setGuildMenuOpen(false);
      }
    };

    if (guildMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [guildMenuOpen]);

  const fetchUser = async () => {
    try {
      const API_URL = (process.env as any).NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
      const response = await fetch(`${API_URL}/api/auth/user`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const fetchUserGuilds = async () => {
    try {
      const API_URL = (process.env as any).NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
      const response = await fetch(`${API_URL}/api/guilds/user`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        const withBot = data.filter((g: any) => g.botPresent);
        setGuilds(withBot);
      }
    } catch (error) {
      console.error('Failed to fetch guilds:', error);
    }
  };

  const fetchGuildData = async () => {
    try {
      const API_URL = (process.env as any).NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
      const response = await fetch(`${API_URL}/api/guilds/${serverId}`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setGuild(data);
      }
    } catch (error) {
      console.error('Failed to fetch guild:', error);
    }
  };

  const fetchGuildSettings = async () => {
    try {
      setLoading(true);
      const API_URL = (process.env as any).NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
      const response = await fetch(`${API_URL}/api/guilds/${serverId}/settings`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeature = async (category: string, featureId: string, currentValue: boolean) => {
    try {
      const API_URL = (process.env as any).NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
      
      // Map frontend categories to backend categories
      const categoryMap: any = {
        'welcome': 'welcome',
        'roles': 'autorole',
        'moderation': 'moderation',
        'leveling': 'leveling',
        'automation': 'autorole',
        'general': 'general'
      };
      
      const backendCategory = categoryMap[category] || category;
      
      const response = await fetch(`${API_URL}/api/guilds/${serverId}/settings/${backendCategory}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          [featureId]: !currentValue
        }),
      });
      
      if (response.ok) {
        // Refresh settings to get latest from server
        await fetchGuildSettings();
      }
    } catch (error) {
      console.error('Failed to toggle feature:', error);
    }
  };
  
  const updateSetting = async (category: string, key: string, value: any) => {
    try {
      const API_URL = (process.env as any).NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
      
      const categoryMap: any = {
        'welcome': 'welcome',
        'roles': 'autorole',
        'moderation': 'moderation',
        'leveling': 'leveling',
        'automation': 'autorole',
        'general': 'general'
      };
      
      const backendCategory = categoryMap[category] || category;
      
      const response = await fetch(`${API_URL}/api/guilds/${serverId}/settings/${backendCategory}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          [key]: value
        }),
      });
      
      if (response.ok) {
        await fetchGuildSettings();
      }
    } catch (error) {
      console.error('Failed to update setting:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F0F14] via-[#1A1B23] to-[#0F0F14] relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 z-0">
          <motion.div 
            className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -50, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>

        {/* Loading Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-white/10"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full"
            />
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2">Ayarlar Yükleniyor</h3>
              <p className="text-gray-400">Sunucu ayarları getiriliyor...</p>
            </div>
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-purple-500 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentCategory = categories.find(c => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0F14] via-[#1A1B23] to-[#0F0F14] relative">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <motion.div 
          className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="fixed top-0 left-0 right-0 h-16 bg-gray-900/80 backdrop-blur-xl border-b border-white/10 z-50 flex items-center justify-between px-6 shadow-xl"
      >
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </div>
          <span className="text-xl font-black text-white">NeuroViaBot</span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
            <BellIcon className="w-6 h-6 text-gray-300" />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              {user && (
                <>
                  <img
                    src={user.avatar 
                      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
                      : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator || '0') % 5}.png`
                    }
                    alt={user.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-white font-semibold text-sm">{user.username}</span>
                </>
              )}
            </button>

            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 rounded-lg bg-[#2c2f38] border border-white/10 shadow-xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-white/10">
                    <p className="text-white font-semibold text-sm">{user?.username}</p>
                    {user?.discriminator && user.discriminator !== '0' && (
                      <p className="text-gray-400 text-xs">#{user.discriminator}</p>
                    )}
                  </div>
                  <div className="p-2">
                    <Link
                      href="/"
                      className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-md transition-colors text-sm"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Ana Sayfa
                    </Link>
                    <Link
                      href="/servers"
                      className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-md transition-colors text-sm"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Sunucularım
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      <div className="flex pt-16 relative z-10">
        {/* Sidebar with smooth animations */}
        <motion.aside 
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="fixed left-0 top-16 bottom-0 w-72 bg-gray-900/80 backdrop-blur-xl border-r border-white/10 shadow-2xl z-40 flex flex-col"
        >
          {/* Server Info with gradient */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 border-b border-white/10 bg-gradient-to-br from-purple-500/10 to-blue-500/10"
          >
            <div className="relative">
              <div className="flex items-center gap-4">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl blur-md opacity-50"></div>
                  <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center border-2 border-white/20 overflow-hidden">
                    {guild?.icon ? (
                      <img
                        src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`}
                        alt={guild.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-2xl font-black">
                        {guild?.name?.charAt(0) || 'S'}
                      </span>
                    )}
                  </div>
                </motion.div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-sm leading-tight break-words">{guild?.name || 'Server'}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <p className="text-gray-400 text-xs">{guild?.memberCount || 0} üye</p>
                  </div>
                </div>
                
                {/* Server Switcher Button */}
                {guilds.length > 1 && (
                  <motion.div 
                    className="relative flex items-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                  >
                    <button
                      onClick={() => setGuildMenuOpen(!guildMenuOpen)}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition-all duration-150 flex items-center justify-center"
                      title="Sunucu değiştir"
                    >
                      <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                    </button>

                    <AnimatePresence>
                      {guildMenuOpen && (
                        <>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="fixed inset-0 z-[55]"
                            onClick={() => setGuildMenuOpen(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.98 }}
                            transition={{ 
                              duration: 0.1, 
                              ease: "easeOut"
                            }}
                            className="absolute left-0 mt-2 w-72 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-[60]"
                          >
                            <div className="p-3 border-b border-gray-700">
                              <h3 className="text-white font-semibold text-sm">Sunucularınız</h3>
                              <p className="text-gray-400 text-xs">Yönetmek için bir sunucu seçin</p>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                              {guilds.map((guildItem, index) => (
                                <motion.div
                                  key={guildItem.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                >
                                  <Link
                                    href={`/manage/${guildItem.id}`}
                                    className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-all duration-200 hover:scale-[1.02] ${
                                      guildItem.id === guild.id ? 'bg-gray-700/50' : ''
                                    }`}
                                    onClick={() => setGuildMenuOpen(false)}
                                  >
                                  {guildItem.icon ? (
                                    <img
                                      src={`https://cdn.discordapp.com/icons/${guildItem.id}/${guildItem.icon}.png?size=32`}
                                      alt={guildItem.name}
                                      className="w-10 h-10 rounded-full"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm font-bold text-white">
                                      {guildItem.name.charAt(0)}
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <div className="text-white font-medium text-sm break-words leading-tight">{guildItem.name}</div>
                                    <div className="text-gray-400 text-xs">{guildItem.memberCount || 'N/A'} üye</div>
                                  </div>
                                  {guildItem.id === guild.id && (
                                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                  )}
                                  </Link>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            {/* Categories with stagger animation */}
            <div className="p-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-3">Kategoriler</p>
            {categories.map((category, index) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              return (
                <motion.button
                  key={category.id}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-2 relative group ${
                    isActive
                      ? 'bg-gradient-to-r ' + category.color + ' text-white shadow-lg shadow-purple-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {/* Indicator line */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-semibold text-sm flex-1 text-left">{category.name}</span>
                  {category.premium && (
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <SparklesIcon className="w-4 h-4 text-yellow-400" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
            </div>
          </div>

          {/* Back Button */}
          <div className="p-4 border-t border-white/10">
            <Link
              href="/servers"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span className="font-semibold text-sm">Sunuculara Dön</span>
            </Link>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Category Header */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-3">
                  {currentCategory && (
                    <>
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${currentCategory.color}`}>
                        <currentCategory.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-black text-white flex items-center gap-3">
                          {currentCategory.name}
                          {currentCategory.premium && (
                            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-xs font-bold text-white flex items-center gap-1">
                              <SparklesIcon className="w-4 h-4" />
                              PREMIUM
                            </span>
                          )}
                        </h1>
                        <p className="text-gray-400 mt-1">{currentCategory.description}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
                {/* Bot Commands Component */}
                {activeCategory === 'commands' && (
                  <BotCommands 
                    guildId={serverId} 
                    userId={user?.id || 'unknown'} 
                  />
                )}
                
                
                
                {/* Feature Manager Component */}
                {activeCategory === 'features' && (
                  <FeatureManager 
                    guildId={serverId} 
                    userId={user?.id || 'unknown'} 
                  />
                )}

                {/* Welcome Settings Component */}
                {activeCategory === 'welcome' && (
                  <WelcomeSettings 
                    guildId={serverId} 
                    userId={user?.id || 'unknown'} 
                  />
                )}

                {/* Moderation Settings Component */}
                {activeCategory === 'moderation' && (
                  <ModerationSettings 
                    guildId={serverId} 
                    userId={user?.id || 'unknown'} 
                  />
                )}

                {/* Leveling Settings Component */}
                {activeCategory === 'leveling' && (
                  <LevelingSettings 
                    guildId={serverId} 
                    userId={user?.id || 'unknown'} 
                  />
                )}

                {/* Economy Settings Component */}
                {activeCategory === 'economy' && (
                  <EconomySettings 
                    guildId={serverId} 
                    userId={user?.id || 'unknown'} 
                  />
                )}
                
                {/* Other Features */}
                {activeCategory !== 'commands' && activeCategory !== 'features' && activeCategory !== 'welcome' && activeCategory !== 'moderation' && activeCategory !== 'leveling' && activeCategory !== 'economy' && activeCategory !== 'music' && activeCategory !== 'games' && activeCategory !== 'backup' && activeCategory !== 'security' && activeCategory !== 'analytics' && activeCategory !== 'custom' && activeCategory !== 'premium' && currentCategory?.features.map((feature) => {
                  // Map categories to backend format
                  const categoryMap: any = {
                    'welcome': 'welcome',
                    'roles': 'autorole',
                    'moderation': 'moderation',
                    'leveling': 'leveling',
                    'automation': 'autorole',
                    'general': 'general'
                  };
                  
                  const backendCategory = categoryMap[activeCategory] || activeCategory;
                  const isEnabled = settings[backendCategory]?.enabled !== false && settings[backendCategory]?.[feature.id] !== false;
                  const isExpanded = expandedFeature === feature.id;

                  return (
                    <motion.div
                      key={feature.id}
                      layout
                      className="bg-[#2c2f38] rounded-xl border border-white/10 overflow-hidden"
                    >
                      {/* Feature Header */}
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-white font-bold text-lg mb-1">{feature.name}</h3>
                            <p className="text-gray-400 text-sm">{feature.description}</p>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            {/* Expand Button */}
                            {isEnabled && (
                              <button
                                onClick={() => setExpandedFeature(isExpanded ? null : feature.id)}
                                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                              >
                                <ChevronDownIcon
                                  className={`w-5 h-5 text-gray-400 transition-transform ${
                                    isExpanded ? 'rotate-180' : ''
                                  }`}
                                />
                              </button>
                            )}

                            {/* Toggle */}
                            <button
                              onClick={() => toggleFeature(activeCategory, feature.id, isEnabled)}
                              className={`relative w-14 h-7 rounded-full transition-all ${
                                isEnabled
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                  : 'bg-gray-600'
                              }`}
                            >
                              <span
                                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                                  isEnabled ? 'translate-x-7' : ''
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Settings Panel */}
                      <AnimatePresence>
                        {isExpanded && isEnabled && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-white/10 bg-[#23272f]"
                          >
                            <div className="p-6 space-y-4">
                              {feature.settings.map((setting) => (
                                <div key={setting} className="space-y-2">
                                  <label className="text-gray-300 font-semibold text-sm capitalize flex items-center gap-2">
                                    {setting === 'channelId' && <HashtagIcon className="w-4 h-4" />}
                                    {setting.replace(/([A-Z])/g, ' $1').trim()}
                                  </label>
                                  {setting.includes('message') || setting.includes('Message') ? (
                                    <textarea
                                      className="w-full px-4 py-3 bg-[#2c2f38] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none"
                                      rows={3}
                                      placeholder={`${setting} giriniz...`}
                                    />
                                  ) : setting === 'channelId' ? (
                                    <select className="w-full px-4 py-3 bg-[#2c2f38] border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none">
                                      <option value="">Kanal seçiniz...</option>
                                    </select>
                                  ) : (
                                    <input
                                      type="text"
                                      className="w-full px-4 py-3 bg-[#2c2f38] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                                      placeholder={`${setting} giriniz...`}
                                    />
                                  )}
                                </div>
                              ))}
                              
                              <button className="mt-4 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2">
                                <CheckCircleIcon className="w-5 h-5" />
                                Kaydet
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

