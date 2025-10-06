'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  ServerIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

// Feature Categories (Universal Settings)
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
    id: 'general',
    name: 'Genel Ayarlar',
    description: 'Bot yapılandırması',
    icon: Cog6ToothIcon,
    color: 'from-gray-500 to-slate-500',
    premium: false,
    features: [
      {
        id: 'prefix',
        name: 'Komut Öneki',
        description: 'Bot komutları için önek belirleyin',
        settings: ['prefix']
      },
      {
        id: 'language',
        name: 'Dil',
        description: 'Bot dilini seçin',
        settings: ['language']
      },
    ]
  },
];

export default function UniversalManagePage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('welcome');
  const [guilds, setGuilds] = useState<any[]>([]);
  const [selectedGuild, setSelectedGuild] = useState<any>(null);
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);
  const [notifications] = useState(3); // Mock notifications
  const [guildSelectorOpen, setGuildSelectorOpen] = useState(false);

  useEffect(() => {
    fetchUser();
    fetchUserGuilds();
  }, []);

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
      setLoading(true);
      const API_URL = (process.env as any).NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
      const response = await fetch(`${API_URL}/api/guilds/user`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        const botPresentGuilds = data.filter((guild: any) => guild.botPresent);
        setGuilds(botPresentGuilds);
        
        // Auto-select first guild if available
        if (botPresentGuilds.length > 0) {
          setSelectedGuild(botPresentGuilds[0]);
          fetchGuildSettings(botPresentGuilds[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch guilds:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGuildSettings = async (guildId: string) => {
    try {
      const API_URL = (process.env as any).NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
      const response = await fetch(`${API_URL}/api/guilds/${guildId}/settings`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const toggleFeature = async (category: string, featureId: string, currentValue: boolean) => {
    if (!selectedGuild) return;
    
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
      
      const response = await fetch(`${API_URL}/api/guilds/${selectedGuild.id}/settings/${backendCategory}`, {
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
        await fetchGuildSettings(selectedGuild.id);
      }
    } catch (error) {
      console.error('Failed to toggle feature:', error);
    }
  };
  
  const updateSetting = async (category: string, key: string, value: any) => {
    if (!selectedGuild) return;
    
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
      
      const response = await fetch(`${API_URL}/api/guilds/${selectedGuild.id}/settings/${backendCategory}`, {
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
        await fetchGuildSettings(selectedGuild.id);
      }
    } catch (error) {
      console.error('Failed to update setting:', error);
    }
  };

  const handleGuildSelect = (guild: any) => {
    setSelectedGuild(guild);
    setGuildSelectorOpen(false);
    fetchGuildSettings(guild.id);
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

  if (guilds.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F0F14] via-[#1A1B23] to-[#0F0F14] relative overflow-hidden">
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

        {/* No Guilds Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center p-8 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-white/10 max-w-md mx-auto"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center"
            >
              <ServerIcon className="w-10 h-10 text-white" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Bot Ekli Sunucu Bulunamadı</h2>
            <p className="text-gray-400 mb-6">
              Ayarları yönetmek için önce botu bir sunucuya eklemeniz gerekiyor.
            </p>
            
            <Link
              href="/servers"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold hover:from-purple-600 hover:to-blue-600 transition-all"
            >
              <PlusIcon className="w-5 h-5" />
              Sunucuları Görüntüle
            </Link>
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
          <motion.div 
            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform"
            whileHover={{ rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </motion.div>
          <span className="text-xl font-black text-white">NeuroViaBot</span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <motion.button 
            className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BellIcon className="w-6 h-6 text-gray-300" />
            {notifications > 0 && (
              <motion.span 
                className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {notifications}
              </motion.span>
            )}
          </motion.button>

          {/* User Menu */}
          <div className="relative">
            <motion.button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
            </motion.button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 rounded-lg bg-[#2c2f38] border border-white/10 shadow-xl z-50 overflow-hidden"
                >
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.nav>

      <div className="flex pt-16 relative z-10">
        {/* Sidebar with smooth animations */}
        <motion.aside 
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="fixed left-0 top-16 bottom-0 w-72 bg-gray-900/80 backdrop-blur-xl border-r border-white/10 overflow-y-auto shadow-2xl"
        >
          {/* Guild Selector */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 border-b border-white/10 bg-gradient-to-br from-purple-500/10 to-blue-500/10"
          >
            <div className="relative">
              <motion.button
                onClick={() => setGuildSelectorOpen(!guildSelectorOpen)}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl blur-md opacity-50"></div>
                  <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center border-2 border-white/20">
                    <span className="text-white text-lg font-black">
                      {selectedGuild?.name?.charAt(0) || 'S'}
                    </span>
                  </div>
                </motion.div>
                <div className="flex-1 min-w-0 text-left">
                  <h3 className="text-white font-bold text-sm truncate">{selectedGuild?.name || 'Sunucu Seçin'}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <p className="text-gray-400 text-xs">{selectedGuild?.memberCount || 0} üye</p>
                  </div>
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${guildSelectorOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {guildSelectorOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-[#2c2f38] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden"
                  >
                    {guilds.map((guild) => (
                      <motion.button
                        key={guild.id}
                        onClick={() => handleGuildSelect(guild)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-left"
                        whileHover={{ x: 4 }}
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {guild.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm truncate">{guild.name}</p>
                          <p className="text-gray-400 text-xs">{guild.memberCount || 0} üye</p>
                        </div>
                        {selectedGuild?.id === guild.id && (
                          <CheckCircleIcon className="w-4 h-4 text-green-400" />
                        )}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

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

          {/* Back Button */}
          <div className="p-4 border-t border-white/10 mt-auto">
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
                      <motion.div 
                        className={`p-4 rounded-2xl bg-gradient-to-br ${currentCategory.color}`}
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <currentCategory.icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <div>
                        <h1 className="text-3xl font-black text-white flex items-center gap-3">
                          {currentCategory.name}
                          {currentCategory.premium && (
                            <motion.span 
                              className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-xs font-bold text-white flex items-center gap-1"
                              animate={{ 
                                scale: [1, 1.05, 1],
                                boxShadow: ['0 0 0 0 rgba(251, 191, 36, 0)', '0 0 20px 5px rgba(251, 191, 36, 0.3)', '0 0 0 0 rgba(251, 191, 36, 0)']
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <SparklesIcon className="w-4 h-4" />
                              PREMIUM
                            </motion.span>
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
                {currentCategory?.features.map((feature, index) => {
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
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      layout
                      className="bg-gradient-to-br from-gray-900/95 to-gray-900/80 backdrop-blur-2xl border-2 border-white/10 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500"
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
                              <motion.button
                                onClick={() => setExpandedFeature(isExpanded ? null : feature.id)}
                                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <ChevronDownIcon
                                  className={`w-5 h-5 text-gray-400 transition-transform ${
                                    isExpanded ? 'rotate-180' : ''
                                  }`}
                                />
                              </motion.button>
                            )}

                            {/* Toggle */}
                            <motion.button
                              onClick={() => toggleFeature(activeCategory, feature.id, isEnabled)}
                              className={`relative w-14 h-7 rounded-full transition-all ${
                                isEnabled
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                  : 'bg-gray-600'
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <motion.span
                                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                                  isEnabled ? 'translate-x-7' : ''
                                }`}
                                animate={{ x: isEnabled ? 28 : 4 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                              />
                            </motion.button>
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
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="border-t border-white/10 bg-gradient-to-br from-gray-800/50 to-gray-900/50"
                          >
                            <div className="p-6 space-y-4">
                              {feature.settings.map((setting, settingIndex) => (
                                <motion.div 
                                  key={setting} 
                                  className="space-y-2"
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: settingIndex * 0.1 }}
                                >
                                  <label className="text-gray-300 font-semibold text-sm capitalize flex items-center gap-2">
                                    {setting === 'channelId' && <HashtagIcon className="w-4 h-4" />}
                                    {setting.replace(/([A-Z])/g, ' $1').trim()}
                                  </label>
                                  {setting.includes('message') || setting.includes('Message') ? (
                                    <motion.textarea
                                      className="w-full px-4 py-3 bg-[#2c2f38] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none transition-all"
                                      rows={3}
                                      placeholder={`${setting} giriniz...`}
                                      whileFocus={{ scale: 1.02 }}
                                    />
                                  ) : setting === 'channelId' ? (
                                    <motion.select 
                                      className="w-full px-4 py-3 bg-[#2c2f38] border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-all"
                                      whileFocus={{ scale: 1.02 }}
                                    >
                                      <option value="">Kanal seçiniz...</option>
                                    </motion.select>
                                  ) : (
                                    <motion.input
                                      type="text"
                                      className="w-full px-4 py-3 bg-[#2c2f38] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all"
                                      placeholder={`${setting} giriniz...`}
                                      whileFocus={{ scale: 1.02 }}
                                    />
                                  )}
                                </motion.div>
                              ))}
                              
                              <motion.button 
                                className="mt-4 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <CheckCircleIcon className="w-5 h-5" />
                                Kaydet
                              </motion.button>
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
