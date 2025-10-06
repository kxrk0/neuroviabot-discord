'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Cog6ToothIcon,
  ChevronDownIcon,
  ServerIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  // Category Icons
  HandRaisedIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  MusicalNoteIcon,
  CurrencyDollarIcon,
  TicketIcon,
  SparklesIcon,
  BellIcon,
  WrenchScrewdriverIcon,
  HashtagIcon,
  LockClosedIcon,
  GiftIcon,
} from '@heroicons/react/24/outline';

// Bot Feature Categories
const categories = [
  {
    id: 'welcome',
    name: 'Karşılama & Hoşçakal',
    icon: HandRaisedIcon,
    color: 'from-blue-500 to-cyan-500',
    settings: [
      { id: 'welcomeEnabled', label: 'Karşılama Mesajı', type: 'toggle', description: 'Yeni üyelere karşılama mesajı gönder' },
      { id: 'welcomeChannel', label: 'Karşılama Kanalı', type: 'channel', description: 'Karşılama mesajının gönderileceği kanal' },
      { id: 'welcomeMessage', label: 'Karşılama Mesajı', type: 'textarea', description: '{user} = kullanıcı adı, {server} = sunucu adı' },
      { id: 'welcomeEmbed', label: 'Embed Kullan', type: 'toggle', description: 'Mesajı embed olarak gönder' },
      { id: 'welcomeImage', label: 'Hoşgeldin Görseli', type: 'text', description: 'Görsel URL\'si (opsiyonel)' },
      { id: 'leaveEnabled', label: 'Ayrılma Mesajı', type: 'toggle', description: 'Ayrılan üyeler için mesaj gönder' },
      { id: 'leaveChannel', label: 'Ayrılma Kanalı', type: 'channel', description: 'Ayrılma mesajının gönderileceği kanal' },
      { id: 'leaveMessage', label: 'Ayrılma Mesajı', type: 'textarea', description: '{user} = kullanıcı adı' },
      { id: 'autoRole', label: 'Otomatik Rol', type: 'role', description: 'Yeni üyelere otomatik verilecek rol' },
    ]
  },
  {
    id: 'moderation',
    name: 'Moderasyon',
    icon: ShieldCheckIcon,
    color: 'from-red-500 to-orange-500',
    settings: [
      { id: 'autoModEnabled', label: 'Otomatik Moderasyon', type: 'toggle', description: 'Zararlı içerikleri otomatik engelle' },
      { id: 'antiSpam', label: 'Spam Koruması', type: 'toggle', description: 'Spam mesajları engelle' },
      { id: 'antiLink', label: 'Link Koruması', type: 'toggle', description: 'İzinsiz linkleri engelle' },
      { id: 'antiInvite', label: 'Davet Koruması', type: 'toggle', description: 'Discord davet linklerini engelle' },
      { id: 'badWords', label: 'Kötü Kelimeler', type: 'textarea', description: 'Engellenecek kelimeler (virgülle ayırın)' },
      { id: 'modLogChannel', label: 'Mod Log Kanalı', type: 'channel', description: 'Moderasyon işlemlerinin loglanacağı kanal' },
      { id: 'warningSystem', label: 'Uyarı Sistemi', type: 'toggle', description: 'Üyelere uyarı verme sistemi' },
      { id: 'maxWarnings', label: 'Maksimum Uyarı', type: 'number', description: 'Ceza öncesi maksimum uyarı sayısı' },
      { id: 'warningPunishment', label: 'Uyarı Cezası', type: 'select', options: ['Sustur', 'At', 'Yasakla'], description: 'Max uyarıda uygulanacak ceza' },
    ]
  },
  {
    id: 'leveling',
    name: 'Seviye Sistemi',
    icon: ChartBarIcon,
    color: 'from-green-500 to-emerald-500',
    settings: [
      { id: 'levelingEnabled', label: 'Seviye Sistemi', type: 'toggle', description: 'Aktif üyeleri ödüllendirin' },
      { id: 'xpPerMessage', label: 'Mesaj Başı XP', type: 'number', description: 'Her mesajda kazanılan XP' },
      { id: 'xpCooldown', label: 'XP Bekleme Süresi', type: 'number', description: 'XP kazanmak için bekleme süresi (saniye)' },
      { id: 'levelUpMessage', label: 'Seviye Atlama Mesajı', type: 'textarea', description: '{user} = kullanıcı, {level} = seviye' },
      { id: 'levelUpChannel', label: 'Seviye Kanalı', type: 'channel', description: 'Seviye mesajlarının gönderileceği kanal' },
      { id: 'noXpChannels', label: 'XP Yok Kanallar', type: 'text', description: 'XP kazanılamayacak kanallar (ID\'ler virgülle ayırın)' },
      { id: 'noXpRoles', label: 'XP Yok Roller', type: 'text', description: 'XP kazanamayacak roller (ID\'ler virgülle ayırın)' },
      { id: 'stackRoles', label: 'Rolleri Biriktir', type: 'toggle', description: 'Seviye rolleri biriksin mi?' },
    ]
  },
  {
    id: 'music',
    name: 'Müzik',
    icon: MusicalNoteIcon,
    color: 'from-purple-500 to-pink-500',
    settings: [
      { id: 'musicEnabled', label: 'Müzik Sistemi', type: 'toggle', description: 'Müzik komutlarını aktifleştir' },
      { id: 'djRole', label: 'DJ Rolü', type: 'role', description: 'Müzik kontrolü için özel rol' },
      { id: 'maxQueueSize', label: 'Maksimum Kuyruk', type: 'number', description: 'Müzik kuyruğunda maksimum şarkı sayısı' },
      { id: 'defaultVolume', label: 'Varsayılan Ses', type: 'number', description: 'Başlangıç ses seviyesi (0-100)' },
      { id: 'autoLeave', label: 'Otomatik Ayrıl', type: 'toggle', description: 'Boş kaldığında kanaldan ayrıl' },
      { id: 'autoLeaveTime', label: 'Ayrılma Süresi', type: 'number', description: 'Otomatik ayrılma süresi (saniye)' },
      { id: 'allowFilters', label: 'Filtre İzni', type: 'toggle', description: 'Ses filtreleri kullanımına izin ver' },
      { id: 'allowPlaylists', label: 'Playlist İzni', type: 'toggle', description: 'Playlist çalmaya izin ver' },
    ]
  },
  {
    id: 'economy',
    name: 'Ekonomi',
    icon: CurrencyDollarIcon,
    color: 'from-yellow-500 to-amber-500',
    settings: [
      { id: 'economyEnabled', label: 'Ekonomi Sistemi', type: 'toggle', description: 'Sunucu ekonomisi sistemini aktifleştir' },
      { id: 'currencyName', label: 'Para Birimi Adı', type: 'text', description: 'Örn: Coin, Altın, vb.' },
      { id: 'currencySymbol', label: 'Para Sembolü', type: 'text', description: 'Örn: 💰, 🪙, ⭐' },
      { id: 'dailyAmount', label: 'Günlük Ödül', type: 'number', description: 'Günlük komuttan kazanılan miktar' },
      { id: 'workAmount', label: 'Çalışma Ödülü', type: 'number', description: 'Work komutundan kazanılan miktar' },
      { id: 'startBalance', label: 'Başlangıç Parası', type: 'number', description: 'Yeni üyelerin başlangıç parası' },
      { id: 'shopEnabled', label: 'Mağaza Sistemi', type: 'toggle', description: 'Rol ve öğe satın alma sistemi' },
      { id: 'gamblingEnabled', label: 'Kumar Oyunları', type: 'toggle', description: 'Slot, blackjack gibi oyunlar' },
    ]
  },
  {
    id: 'tickets',
    name: 'Destek Sistemi',
    icon: TicketIcon,
    color: 'from-indigo-500 to-blue-500',
    settings: [
      { id: 'ticketEnabled', label: 'Ticket Sistemi', type: 'toggle', description: 'Destek ticket sistemi' },
      { id: 'ticketCategory', label: 'Ticket Kategorisi', type: 'text', description: 'Ticket kanallarının oluşturulacağı kategori ID' },
      { id: 'ticketMessage', label: 'Ticket Mesajı', type: 'textarea', description: 'Ticket açılma mesajı' },
      { id: 'supportRole', label: 'Destek Rolü', type: 'role', description: 'Ticket\'lara erişebilecek rol' },
      { id: 'ticketLogChannel', label: 'Ticket Log Kanalı', type: 'channel', description: 'Ticket işlemlerinin loglanacağı kanal' },
      { id: 'maxTickets', label: 'Maksimum Ticket', type: 'number', description: 'Kullanıcı başına maksimum açık ticket' },
      { id: 'autoClose', label: 'Otomatik Kapat', type: 'toggle', description: 'İnaktif ticket\'ları otomatik kapat' },
      { id: 'autoCloseTime', label: 'Kapanma Süresi', type: 'number', description: 'İnaktiflik süresi (saat)' },
    ]
  },
  {
    id: 'autorole',
    name: 'Otomatik Rol',
    icon: UserGroupIcon,
    color: 'from-teal-500 to-cyan-500',
    settings: [
      { id: 'autoRoleEnabled', label: 'Otomatik Rol', type: 'toggle', description: 'Yeni üyelere otomatik rol ver' },
      { id: 'autoRoleIds', label: 'Roller', type: 'text', description: 'Verilecek rol ID\'leri (virgülle ayırın)' },
      { id: 'autoRoleDelay', label: 'Gecikme', type: 'number', description: 'Rol verme gecikmesi (saniye)' },
      { id: 'botAutoRole', label: 'Bot Rolü', type: 'role', description: 'Botlara verilecek özel rol' },
      { id: 'reactionRoleEnabled', label: 'Tepki Rolleri', type: 'toggle', description: 'Tepki vererek rol alma sistemi' },
    ]
  },
  {
    id: 'logging',
    name: 'Loglama',
    icon: BellIcon,
    color: 'from-slate-500 to-gray-500',
    settings: [
      { id: 'loggingEnabled', label: 'Log Sistemi', type: 'toggle', description: 'Sunucu olaylarını logla' },
      { id: 'messageLogChannel', label: 'Mesaj Logları', type: 'channel', description: 'Silinen/düzenlenen mesajlar' },
      { id: 'memberLogChannel', label: 'Üye Logları', type: 'channel', description: 'Üye giriş/çıkış logları' },
      { id: 'roleLogChannel', label: 'Rol Logları', type: 'channel', description: 'Rol değişiklik logları' },
      { id: 'channelLogChannel', label: 'Kanal Logları', type: 'channel', description: 'Kanal değişiklik logları' },
      { id: 'serverLogChannel', label: 'Sunucu Logları', type: 'channel', description: 'Sunucu ayar değişiklik logları' },
      { id: 'voiceLogChannel', label: 'Ses Logları', type: 'channel', description: 'Ses kanalı hareketleri' },
    ]
  },
  {
    id: 'giveaway',
    name: 'Çekiliş',
    icon: GiftIcon,
    color: 'from-rose-500 to-pink-500',
    settings: [
      { id: 'giveawayEnabled', label: 'Çekiliş Sistemi', type: 'toggle', description: 'Çekiliş komutlarını aktifleştir' },
      { id: 'giveawayRole', label: 'Çekiliş Yöneticisi', type: 'role', description: 'Çekiliş başlatabilecek rol' },
      { id: 'giveawayPingRole', label: 'Bildirim Rolü', type: 'role', description: 'Yeni çekilişlerde etiketlenecek rol' },
      { id: 'giveawayEmoji', label: 'Çekiliş Emojisi', type: 'text', description: 'Çekiliş tepkisi için emoji (🎉)' },
    ]
  },
  {
    id: 'advanced',
    name: 'Gelişmiş Ayarlar',
    icon: WrenchScrewdriverIcon,
    color: 'from-orange-500 to-red-500',
    settings: [
      { id: 'prefix', label: 'Komut Öneki', type: 'text', description: 'Botun komut öneki (varsayılan: /)' },
      { id: 'language', label: 'Dil', type: 'select', options: ['Türkçe', 'English'], description: 'Bot dili' },
      { id: 'timezone', label: 'Saat Dilimi', type: 'text', description: 'Örn: Europe/Istanbul' },
      { id: 'embedColor', label: 'Embed Rengi', type: 'color', description: 'Bot mesajlarının rengi (HEX)' },
      { id: 'commandCooldown', label: 'Komut Bekleme', type: 'number', description: 'Komutlar arası bekleme süresi (saniye)' },
      { id: 'adminRole', label: 'Yönetici Rolü', type: 'role', description: 'Tüm komutlara erişebilecek rol' },
      { id: 'modRole', label: 'Moderatör Rolü', type: 'role', description: 'Moderasyon komutlarına erişebilecek rol' },
    ]
  },
];

export default function ManagePage() {
  const router = useRouter();
  const [guilds, setGuilds] = useState<any[]>([]);
  const [selectedGuild, setSelectedGuild] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState('welcome');
  const [searchQuery, setSearchQuery] = useState('');
  const [settings, setSettings] = useState<any>({});
  const [channels, setChannels] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [guildDropdownOpen, setGuildDropdownOpen] = useState(false);

  useEffect(() => {
    fetchUserGuilds();
  }, []);

  // Read guild ID from localStorage (universal approach)
  useEffect(() => {
    if (typeof window !== 'undefined' && guilds.length > 0) {
      const savedGuildId = localStorage.getItem('selectedGuildId');
      
      if (savedGuildId) {
        const guild = guilds.find((g: any) => g.id === savedGuildId);
        if (guild) {
          setSelectedGuild(guild);
          console.log(`[Manage] Auto-selected guild from localStorage: ${guild.name} (${guild.id})`);
        } else {
          // Saved guild not found, select first available
          setSelectedGuild(guilds[0]);
        }
      } else if (guilds.length > 0) {
        // No saved guild, select first one
        setSelectedGuild(guilds[0]);
      }
    }
  }, [guilds]);

  useEffect(() => {
    if (selectedGuild) {
      // Save to localStorage whenever guild changes
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedGuildId', selectedGuild.id);
      }
      fetchGuildData(selectedGuild.id);
    }
  }, [selectedGuild]);

  const fetchUserGuilds = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
      const response = await fetch(`${API_URL}/api/guilds/user`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        const withBot = data.filter((g: any) => g.botPresent);
        setGuilds(withBot);
        if (withBot.length > 0) {
          setSelectedGuild(withBot[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch guilds:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGuildData = async (guildId: string) => {
    setLoadingData(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
      
      console.log(`[Manage] Fetching data for guild: ${guildId}`);
      
      // Fetch guild settings
      const settingsResponse = await fetch(`${API_URL}/api/guilds/${guildId}/settings`, {
        credentials: 'include',
      });
      
      if (settingsResponse.ok) {
        const data = await settingsResponse.json();
        setSettings(data || {});
        console.log(`[Manage] Loaded settings for guild ${guildId}:`, Object.keys(data || {}).length, 'settings');
      } else {
        console.warn('[Manage] Failed to fetch settings, using defaults');
        setSettings({});
      }
      
      // Fetch real channels from Discord
      const channelsResponse = await fetch(`${API_URL}/api/guilds/${guildId}/channels`, {
        credentials: 'include',
      });
      
      if (channelsResponse.ok) {
        const channelsData = await channelsResponse.json();
        setChannels(channelsData.map((ch: any) => ({
          id: ch.id,
          name: ch.name,
          type: ch.type,
        })));
        console.log(`[Manage] Loaded ${channelsData.length} channels for guild ${guildId}`);
      } else {
        console.error('[Manage] Failed to fetch channels');
        setChannels([]);
      }
      
      // Fetch real roles from Discord
      const rolesResponse = await fetch(`${API_URL}/api/guilds/${guildId}/roles`, {
        credentials: 'include',
      });
      
      if (rolesResponse.ok) {
        const rolesData = await rolesResponse.json();
        setRoles(rolesData.map((role: any) => ({
          id: role.id,
          name: role.name,
          color: role.color === 0 ? '#99AAB5' : `#${role.color.toString(16).padStart(6, '0')}`,
          position: role.position,
        })));
        console.log(`[Manage] Loaded ${rolesData.length} roles for guild ${guildId}`);
      } else {
        console.error('[Manage] Failed to fetch roles');
        setRoles([]);
      }
    } catch (error) {
      console.error('Failed to fetch guild data:', error);
      setChannels([]);
      setRoles([]);
      setSettings({});
    } finally {
      setLoadingData(false);
    }
  };

  const handleSettingChange = (settingId: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      [settingId]: value,
    }));
    setSaveStatus('idle');
  };

  const handleSaveSettings = async () => {
    if (!selectedGuild) {
      console.error('[Manage] No guild selected');
      return;
    }
    
    setSaving(true);
    setSaveStatus('idle');
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
      
      console.log(`[Manage] Saving settings for guild ${selectedGuild.id}:`, settings);
      
      const response = await fetch(`${API_URL}/api/guilds/${selectedGuild.id}/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(settings),
      });
      
      if (response.ok) {
        const savedSettings = await response.json();
        console.log(`[Manage] Settings saved successfully for guild ${selectedGuild.id}`);
        setSettings(savedSettings);
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('[Manage] Failed to save settings:', errorData);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setSaving(false);
    }
  };

  const renderSettingInput = (setting: any) => {
    const value = settings[setting.id];
    
    switch (setting.type) {
      case 'toggle':
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => handleSettingChange(setting.id, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-blue-500"></div>
          </label>
        );
      
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            placeholder={setting.description}
          />
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={value || 0}
            onChange={(e) => handleSettingChange(setting.id, parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            placeholder={setting.description}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
            placeholder={setting.description}
          />
        );
      
      case 'channel':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
          >
            <option value="">Kanal Seçin</option>
            {channels.map(channel => (
              <option key={channel.id} value={channel.id}>#{channel.name}</option>
            ))}
          </select>
        );
      
      case 'role':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
          >
            <option value="">Rol Seçin</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>@{role.name}</option>
            ))}
          </select>
        );
      
      case 'select':
        return (
          <select
            value={value || setting.options?.[0] || ''}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
          >
            {setting.options?.map((option: string) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'color':
        return (
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={value || '#5865F2'}
              onChange={(e) => handleSettingChange(setting.id, e.target.value)}
              className="w-12 h-10 rounded cursor-pointer border border-gray-700"
            />
            <input
              type="text"
              value={value || '#5865F2'}
              onChange={(e) => handleSettingChange(setting.id, e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              placeholder="#5865F2"
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  const filteredCategories = categories.filter(cat =>
    searchQuery === '' || 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.settings.some(s => s.label.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeSettings = categories.find(c => c.id === activeCategory)?.settings || [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0F0F14] via-[#1A1B23] to-[#0F0F14]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (guilds.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0F0F14] via-[#1A1B23] to-[#0F0F14]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-white/10 max-w-md"
        >
          <ServerIcon className="w-20 h-20 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Bot Ekli Sunucu Yok</h2>
          <p className="text-gray-400 mb-6">
            Ayarları yönetmek için önce botu bir sunucuya eklemeniz gerekiyor.
          </p>
          <Link
            href="/servers"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold hover:from-purple-600 hover:to-blue-600 transition-all"
          >
            Sunuculara Dön
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0F14] via-[#1A1B23] to-[#0F0F14]">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo & Back */}
          <div className="flex items-center gap-4">
            <Link href="/servers" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div className="flex items-center gap-2">
              <Cog6ToothIcon className="w-6 h-6 text-purple-400" />
              <h1 className="text-xl font-bold text-white">Sunucu Ayarları</h1>
            </div>
          </div>

          {/* Guild Selector */}
          <div className="relative">
            <button
              onClick={() => setGuildDropdownOpen(!guildDropdownOpen)}
              className="flex items-center gap-3 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-purple-500 transition-all"
            >
              {selectedGuild && (
                <>
                  {selectedGuild.icon ? (
                    <img
                      src={`https://cdn.discordapp.com/icons/${selectedGuild.id}/${selectedGuild.icon}.png?size=32`}
                      alt={selectedGuild.name}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                      {selectedGuild.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-white font-medium max-w-[150px] truncate">{selectedGuild.name}</span>
                  <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                </>
              )}
            </button>

            <AnimatePresence>
              {guildDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden"
                >
                  {guilds.map(guild => (
                    <button
                      key={guild.id}
                      onClick={() => {
                        setSelectedGuild(guild);
                        setGuildDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors"
                    >
                      {guild.icon ? (
                        <img
                          src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=32`}
                          alt={guild.name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm font-bold text-white">
                          {guild.name.charAt(0)}
                        </div>
                      )}
                      <span className="text-white font-medium truncate">{guild.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${
              saveStatus === 'success'
                ? 'bg-green-500 text-white'
                : saveStatus === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white'
            }`}
          >
            {saving ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Kaydediliyor...</>
            ) : saveStatus === 'success' ? (
              <><CheckIcon className="w-5 h-5" /> Kaydedildi</>
            ) : saveStatus === 'error' ? (
              <><XMarkIcon className="w-5 h-5" /> Hata</>
            ) : (
              <>Kaydet</>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ayar ara..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex pt-32">
        {/* Sidebar - Categories */}
        <div className="w-64 fixed left-0 top-32 bottom-0 overflow-y-auto border-r border-white/10 bg-gray-900/50 backdrop-blur-xl px-3 py-4">
          <div className="space-y-1">
            {filteredCategories.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r ' + category.color + ' text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm truncate">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings Panel */}
        <div className="ml-64 flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {loadingData ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Sunucu verileri yükleniyor...</p>
                </div>
              </div>
            ) : (
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Category Header */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {categories.find(c => c.id === activeCategory)?.name}
                  </h2>
                  <p className="text-gray-400">
                    {categories.find(c => c.id === activeCategory)?.settings.length} ayar mevcut
                    {channels.length > 0 && ` • ${channels.length} kanal`}
                    {roles.length > 0 && ` • ${roles.length} rol`}
                  </p>
                </div>

                {/* Settings Grid */}
                <div className="space-y-4">
                  {activeSettings.map(setting => (
                  <motion.div
                    key={setting.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 hover:border-purple-500/30 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-1">{setting.label}</h3>
                        <p className="text-gray-400 text-sm">{setting.description}</p>
                      </div>
                      <div className="w-64 flex-shrink-0">
                        {renderSettingInput(setting)}
                      </div>
                    </div>
                  </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}