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
  MusicalNoteIcon,
  CurrencyDollarIcon,
  TicketIcon,
  GiftIcon,
  CommandLineIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

// Comprehensive Feature Categories
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
        settings: [
          { id: 'enabled', name: 'Aktif', type: 'toggle', default: false },
          { id: 'channelId', name: 'Kanal', type: 'channel', default: null },
          { id: 'message', name: 'Mesaj', type: 'text', default: 'Hoş geldin {user}!' },
          { id: 'embed', name: 'Embed Kullan', type: 'toggle', default: true },
          { id: 'dmMessage', name: 'DM Mesajı', type: 'text', default: null },
        ]
      },
      {
        id: 'leaveMessage',
        name: 'Ayrılma Mesajı',
        description: 'Ayrılan üyeler için mesaj gönderin',
        settings: [
          { id: 'enabled', name: 'Aktif', type: 'toggle', default: false },
          { id: 'channelId', name: 'Kanal', type: 'channel', default: null },
          { id: 'message', name: 'Mesaj', type: 'text', default: '{user} sunucudan ayrıldı.' },
        ]
      },
      {
        id: 'autoRole',
        name: 'Otomatik Rol',
        description: 'Yeni üyelere otomatik rol verin',
        settings: [
          { id: 'enabled', name: 'Aktif', type: 'toggle', default: false },
          { id: 'roleId', name: 'Rol', type: 'role', default: null },
          { id: 'delay', name: 'Gecikme (saniye)', type: 'number', default: 0 },
        ]
      },
    ]
  },
  {
    id: 'moderation',
    name: 'Moderasyon',
    description: 'Sunucu moderasyonu ve güvenlik ayarları',
    icon: ShieldCheckIcon,
    color: 'from-red-500 to-pink-500',
    premium: false,
    features: [
      {
        id: 'autoMod',
        name: 'Otomatik Moderasyon',
        description: 'Spam ve uygunsuz içerik koruması',
        settings: [
          { id: 'enabled', name: 'Aktif', type: 'toggle', default: true },
          { id: 'spamProtection', name: 'Spam Koruması', type: 'toggle', default: true },
          { id: 'antiInvite', name: 'Davet Linki Engelleme', type: 'toggle', default: false },
          { id: 'antiLink', name: 'Link Engelleme', type: 'toggle', default: false },
          { id: 'bannedWords', name: 'Yasaklı Kelimeler', type: 'text', default: '' },
          { id: 'maxWarnings', name: 'Maksimum Uyarı', type: 'number', default: 3 },
        ]
      },
      {
        id: 'logging',
        name: 'Log Sistemi',
        description: 'Moderasyon olaylarını kaydetme',
        settings: [
          { id: 'enabled', name: 'Aktif', type: 'toggle', default: false },
          { id: 'logChannelId', name: 'Log Kanalı', type: 'channel', default: null },
          { id: 'logBans', name: 'Ban Logları', type: 'toggle', default: true },
          { id: 'logKicks', name: 'Kick Logları', type: 'toggle', default: true },
          { id: 'logWarnings', name: 'Uyarı Logları', type: 'toggle', default: true },
        ]
      },
      {
        id: 'muteSystem',
        name: 'Susturma Sistemi',
        description: 'Üyeleri susturma ve cezalandırma',
        settings: [
          { id: 'enabled', name: 'Aktif', type: 'toggle', default: false },
          { id: 'muteRoleId', name: 'Susturma Rolü', type: 'role', default: null },
          { id: 'autoUnmute', name: 'Otomatik Susturma Kaldırma', type: 'toggle', default: true },
        ]
      },
    ]
  },
  {
    id: 'music',
    name: 'Müzik',
    description: 'Müzik botu ve ses ayarları',
    icon: MusicalNoteIcon,
    color: 'from-purple-500 to-indigo-500',
    premium: false,
    features: [
      {
        id: 'musicSettings',
        name: 'Müzik Ayarları',
        description: 'Müzik botu genel ayarları',
        settings: [
          { id: 'enabled', name: 'Aktif', type: 'toggle', default: true },
          { id: 'defaultVolume', name: 'Varsayılan Ses', type: 'range', default: 50, min: 0, max: 100 },
          { id: 'maxQueueSize', name: 'Maksimum Kuyruk', type: 'number', default: 100 },
          { id: 'djRoleId', name: 'DJ Rolü', type: 'role', default: null },
          { id: 'allowFilters', name: 'Filtre İzinleri', type: 'toggle', default: true },
          { id: 'twentyFourSeven', name: '7/24 Müzik', type: 'toggle', default: false },
        ]
      },
      {
        id: 'playlistSettings',
        name: 'Çalma Listesi',
        description: 'Çalma listesi ve otomatik çalma',
        settings: [
          { id: 'autoPlay', name: 'Otomatik Çalma', type: 'toggle', default: false },
          { id: 'repeatMode', name: 'Tekrar Modu', type: 'select', default: 'none', options: ['none', 'song', 'queue'] },
          { id: 'shuffleMode', name: 'Karışık Çalma', type: 'toggle', default: false },
        ]
      },
    ]
  },
  {
    id: 'economy',
    name: 'Ekonomi',
    description: 'Sanal ekonomi ve para sistemi',
    icon: CurrencyDollarIcon,
    color: 'from-green-500 to-emerald-500',
    premium: false,
    features: [
      {
        id: 'economySettings',
        name: 'Ekonomi Ayarları',
        description: 'Para sistemi genel ayarları',
        settings: [
          { id: 'enabled', name: 'Aktif', type: 'toggle', default: true },
          { id: 'startingBalance', name: 'Başlangıç Bakiyesi', type: 'number', default: 1000 },
          { id: 'dailyReward', name: 'Günlük Ödül', type: 'number', default: 100 },
          { id: 'workReward', name: 'Çalışma Ödülü', type: 'number', default: 50 },
          { id: 'robEnabled', name: 'Soygun Sistemi', type: 'toggle', default: true },
          { id: 'gamblingEnabled', name: 'Kumar Sistemi', type: 'toggle', default: true },
        ]
      },
      {
        id: 'shopSystem',
        name: 'Mağaza Sistemi',
        description: 'Sanal mağaza ve alışveriş',
        settings: [
          { id: 'enabled', name: 'Aktif', type: 'toggle', default: false },
          { id: 'shopChannelId', name: 'Mağaza Kanalı', type: 'channel', default: null },
          { id: 'maxItems', name: 'Maksimum Ürün', type: 'number', default: 20 },
        ]
      },
    ]
  },
  {
    id: 'leveling',
    name: 'Seviye Sistemi',
    description: 'XP ve seviye sistemi',
    icon: ChartBarIcon,
    color: 'from-yellow-500 to-orange-500',
    premium: false,
    features: [
      {
        id: 'levelingSettings',
        name: 'Seviye Ayarları',
        description: 'XP ve seviye sistemi ayarları',
        settings: [
          { id: 'enabled', name: 'Aktif', type: 'toggle', default: true },
          { id: 'xpPerMessage', name: 'Mesaj Başına XP', type: 'number', default: 15 },
          { id: 'xpCooldown', name: 'XP Bekleme Süresi', type: 'number', default: 60 },
          { id: 'levelUpMessage', name: 'Seviye Atlama Mesajı', type: 'toggle', default: true },
          { id: 'levelUpChannelId', name: 'Seviye Kanalı', type: 'channel', default: null },
          { id: 'roleRewards', name: 'Rol Ödülleri', type: 'toggle', default: false },
        ]
      },
      {
        id: 'roleRewards',
        name: 'Rol Ödülleri',
        description: 'Belirli seviyelerde rol verme',
        settings: [
          { id: 'enabled', name: 'Aktif', type: 'toggle', default: false },
          { id: 'rewards', name: 'Ödül Listesi', type: 'text', default: '{}' },
        ]
      },
    ]
  },
  {
    id: 'automation',
    name: 'Otomasyon',
    description: 'Otomatik görevler ve sistemler',
    icon: BoltIcon,
    color: 'from-cyan-500 to-blue-500',
    premium: true,
    features: [
      {
        id: 'autoModeration',
        name: 'Otomatik Moderasyon',
        description: 'Gelişmiş otomatik moderasyon',
        settings: [
          { id: 'enabled', name: 'Aktif', type: 'toggle', default: false },
          { id: 'autoDelete', name: 'Otomatik Silme', type: 'toggle', default: false },
          { id: 'autoWarn', name: 'Otomatik Uyarı', type: 'toggle', default: false },
          { id: 'autoMute', name: 'Otomatik Susturma', type: 'toggle', default: false },
        ]
      },
      {
        id: 'scheduledTasks',
        name: 'Zamanlanmış Görevler',
        description: 'Belirli zamanlarda çalışan görevler',
        settings: [
          { id: 'enabled', name: 'Aktif', type: 'toggle', default: false },
          { id: 'tasks', name: 'Görev Listesi', type: 'text', default: '[]' },
        ]
      },
    ]
  },
  {
    id: 'tickets',
    name: 'Destek Sistemi',
    description: 'Ticket ve destek sistemi',
    icon: TicketIcon,
    color: 'from-indigo-500 to-purple-500',
    premium: false,
    features: [
      {
        id: 'ticketSystem',
        name: 'Ticket Sistemi',
        description: 'Destek ticket sistemi',
        settings: [
          { id: 'enabled', name: 'Aktif', type: 'toggle', default: false },
          { id: 'categoryId', name: 'Kategori', type: 'category', default: null },
          { id: 'supportRoleId', name: 'Destek Rolü', type: 'role', default: null },
          { id: 'maxTickets', name: 'Maksimum Ticket', type: 'number', default: 3 },
          { id: 'autoClose', name: 'Otomatik Kapatma', type: 'toggle', default: false },
          { id: 'closeTime', name: 'Kapatma Süresi (saat)', type: 'number', default: 24 },
        ]
      },
    ]
  },
  {
    id: 'giveaways',
    name: 'Çekiliş Sistemi',
    description: 'Çekiliş ve ödül sistemi',
    icon: GiftIcon,
    color: 'from-pink-500 to-rose-500',
    premium: true,
    features: [
      {
        id: 'giveawaySystem',
        name: 'Çekiliş Sistemi',
        description: 'Çekiliş ve ödül dağıtımı',
        settings: [
          { id: 'enabled', name: 'Aktif', type: 'toggle', default: false },
          { id: 'channelId', name: 'Çekiliş Kanalı', type: 'channel', default: null },
          { id: 'roleId', name: 'Gerekli Rol', type: 'role', default: null },
          { id: 'maxGiveaways', name: 'Maksimum Çekiliş', type: 'number', default: 5 },
        ]
      },
    ]
  },
  {
    id: 'custom',
    name: 'Özel Komutlar',
    description: 'Özel komutlar ve yanıtlar',
    icon: CommandLineIcon,
    color: 'from-gray-500 to-slate-500',
    premium: false,
    features: [
      {
        id: 'customCommands',
        name: 'Özel Komutlar',
        description: 'Özel komutlar oluşturma',
        settings: [
          { id: 'enabled', name: 'Aktif', type: 'toggle', default: false },
          { id: 'maxCommands', name: 'Maksimum Komut', type: 'number', default: 10 },
          { id: 'allowEmbeds', name: 'Embed İzinleri', type: 'toggle', default: true },
        ]
      },
    ]
  },
  {
    id: 'general',
    name: 'Genel Ayarlar',
    description: 'Bot genel ayarları ve konfigürasyon',
    icon: Cog6ToothIcon,
    color: 'from-slate-500 to-gray-500',
    premium: false,
    features: [
      {
        id: 'botSettings',
        name: 'Bot Ayarları',
        description: 'Bot genel ayarları',
        settings: [
          { id: 'prefix', name: 'Prefix', type: 'text', default: '!' },
          { id: 'language', name: 'Dil', type: 'select', default: 'tr', options: ['tr', 'en'] },
          { id: 'timezone', name: 'Saat Dilimi', type: 'select', default: 'Europe/Istanbul', options: ['Europe/Istanbul', 'UTC'] },
          { id: 'logLevel', name: 'Log Seviyesi', type: 'select', default: 'info', options: ['error', 'warn', 'info', 'debug'] },
        ]
      },
      {
        id: 'permissions',
        name: 'İzinler',
        description: 'Bot izinleri ve yetkileri',
        settings: [
          { id: 'adminRoleId', name: 'Admin Rolü', type: 'role', default: null },
          { id: 'modRoleId', name: 'Moderator Rolü', type: 'role', default: null },
          { id: 'djRoleId', name: 'DJ Rolü', type: 'role', default: null },
        ]
      },
    ]
  },
];

export default function ServerDashboard() {
  const router = useRouter();
  const [selectedGuild, setSelectedGuild] = useState<any>(null);
  const [guilds, setGuilds] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('welcome');
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUserAndGuilds();
  }, []);

  const fetchUserAndGuilds = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
      
      // Fetch user
      const userResponse = await fetch(`${API_URL}/api/auth/user`, {
        credentials: 'include',
      });
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
      } else {
        router.push('/');
        return;
      }

      // Fetch guilds
      const guildsResponse = await fetch(`${API_URL}/api/guilds/user`, {
        credentials: 'include',
      });
      
      if (guildsResponse.ok) {
        const guildsData = await guildsResponse.json();
        const botGuilds = guildsData.filter((g: any) => g.botPresent);
        setGuilds(botGuilds);
        
        if (botGuilds.length > 0) {
          setSelectedGuild(botGuilds[0]);
          await fetchGuildSettings(botGuilds[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGuildSettings = async (guildId: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
      const response = await fetch(`${API_URL}/api/guilds/${guildId}/settings`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const settingsData = await response.json();
        setSettings(settingsData);
      }
    } catch (error) {
      console.error('Failed to fetch guild settings:', error);
    }
  };

  const handleGuildChange = async (guildId: string) => {
    const guild = guilds.find(g => g.id === guildId);
    if (guild) {
      setSelectedGuild(guild);
      await fetchGuildSettings(guildId);
    }
  };

  const updateSetting = async (category: string, feature: string, setting: string, value: any) => {
    if (!selectedGuild) return;

    setSaving(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
      const response = await fetch(`${API_URL}/api/guilds/${selectedGuild.id}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          category,
          feature,
          setting,
          value,
        }),
      });

      if (response.ok) {
        // Update local state
        setSettings((prev: any) => ({
          ...prev,
          [category]: {
            ...prev[category],
            [feature]: {
              ...prev[category]?.[feature],
              [setting]: value,
            },
          },
        }));
      }
    } catch (error) {
      console.error('Failed to update setting:', error);
    } finally {
      setSaving(false);
    }
  };

  const getSettingValue = (category: string, feature: string, setting: string, defaultValue: any) => {
    return settings[category]?.[feature]?.[setting] ?? defaultValue;
  };

  const renderSettingInput = (category: string, feature: string, setting: any) => {
    const value = getSettingValue(category, feature, setting.id, setting.default);

    switch (setting.type) {
      case 'toggle':
        return (
          <motion.button
            onClick={() => updateSetting(category, feature, setting.id, !value)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              value ? 'bg-purple-500' : 'bg-gray-600'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute top-1 w-4 h-4 bg-white rounded-full"
              animate={{ x: value ? 24 : 4 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </motion.button>
        );

      case 'range':
        return (
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={setting.min || 0}
              max={setting.max || 100}
              value={value}
              onChange={(e) => updateSetting(category, feature, setting.id, parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <span className="text-sm text-gray-300 w-8">{value}</span>
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => updateSetting(category, feature, setting.id, parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
          />
        );

      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => updateSetting(category, feature, setting.id, e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => updateSetting(category, feature, setting.id, e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            {setting.options?.map((option: string) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => updateSetting(category, feature, setting.id, e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0F0F14] via-[#1A1B23] to-[#0F0F14] relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-lg">Ayarlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (guilds.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F0F14] via-[#1A1B23] to-[#0F0F14] relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center p-8 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-white/10 max-w-md mx-auto"
          >
            <ServerIcon className="w-20 h-20 mx-auto mb-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white mb-4">Bot Ekli Sunucu Bulunamadı</h2>
            <p className="text-gray-400 mb-6">
              Ayarları yönetmek için önce botu bir sunucuya eklemeniz gerekiyor.
            </p>
            <Link
              href="/servers"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold hover:from-purple-600 hover:to-blue-600 transition-all"
            >
              <PlusIcon className="w-5 h-5" />
              Botu Ekle
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0F14] via-[#1A1B23] to-[#0F0F14] relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
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
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/servers"
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
          >
            Sunucularım
          </Link>
          
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
                      href="/dashboard"
                      className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-md transition-colors text-sm"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="relative z-10 pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black text-white mb-2">
                  Sunucu{' '}
                  <motion.span 
                    className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
                    animate={{
                      backgroundPosition: ['0%', '100%', '0%']
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{
                      backgroundSize: '200% 100%'
                    }}
                  >
                    Ayarları
                  </motion.span>
                </h1>
                <p className="text-gray-400">Bot ayarlarını yönetin ve özelleştirin</p>
              </div>

              {/* Server Selector */}
              <div className="relative">
                <select
                  value={selectedGuild?.id || ''}
                  onChange={(e) => handleGuildChange(e.target.value)}
                  className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  {guilds.map((guild) => (
                    <option key={guild.id} value={guild.id}>
                      {guild.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-24">
                <h3 className="text-lg font-bold text-white mb-4">Kategoriler</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        activeCategory === category.id
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <category.icon className="w-5 h-5" />
                      <span className="font-medium">{category.name}</span>
                      {category.premium && (
                        <SparklesIcon className="w-4 h-4 ml-auto text-yellow-400" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-3"
            >
              <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <AnimatePresence mode="wait">
                  {categories.map((category) => (
                    activeCategory === category.id && (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center gap-3 mb-6">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color}`}>
                            <category.icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-white">{category.name}</h2>
                            <p className="text-gray-400 text-sm">{category.description}</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {category.features.map((feature) => (
                            <motion.div
                              key={feature.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              className="bg-gray-800/50 border border-white/5 rounded-xl p-4"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h3 className="font-semibold text-white">{feature.name}</h3>
                                  <p className="text-gray-400 text-sm">{feature.description}</p>
                                </div>
                                <motion.button
                                  onClick={() => setExpandedFeature(
                                    expandedFeature === feature.id ? null : feature.id
                                  )}
                                  className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <ChevronDownIcon 
                                    className={`w-5 h-5 text-gray-400 transition-transform ${
                                      expandedFeature === feature.id ? 'rotate-180' : ''
                                    }`} 
                                  />
                                </motion.button>
                              </div>

                              <AnimatePresence>
                                {expandedFeature === feature.id && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-3 pt-3 border-t border-white/5"
                                  >
                                    {feature.settings.map((setting) => (
                                      <div key={setting.id} className="flex items-center justify-between">
                                        <div className="flex-1">
                                          <label className="text-sm font-medium text-gray-300">
                                            {setting.name}
                                          </label>
                                        </div>
                                        <div className="w-48">
                                          {renderSettingInput(category.id, feature.id, setting)}
                                        </div>
                                      </div>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}