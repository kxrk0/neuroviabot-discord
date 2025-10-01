'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  MusicalNoteIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  HandRaisedIcon,
  Cog6ToothIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

// Setting Categories
const categories = [
  { id: 'music', name: 'Müzik', icon: MusicalNoteIcon, color: 'purple' },
  { id: 'moderation', name: 'Moderasyon', icon: ShieldCheckIcon, color: 'blue' },
  { id: 'economy', name: 'Ekonomi', icon: CurrencyDollarIcon, color: 'green' },
  { id: 'leveling', name: 'Seviye Sistemi', icon: ChartBarIcon, color: 'pink' },
  { id: 'welcome', name: 'Karşılama', icon: HandRaisedIcon, color: 'cyan' },
  { id: 'general', name: 'Genel Ayarlar', icon: Cog6ToothIcon, color: 'gray' },
];

interface GuildSettings {
  music: any;
  moderation: any;
  economy: any;
  leveling: any;
  welcome: any;
  general: any;
}

export default function ServerSettingsPage() {
  const params = useParams();
  const serverId = params?.serverId as string;
  
  const [activeCategory, setActiveCategory] = useState('music');
  const [guild, setGuild] = useState<any>(null);
  const [settings, setSettings] = useState<GuildSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (serverId) {
      fetchGuildData();
      fetchGuildSettings();
    }
  }, [serverId]);

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

  const updateSettings = async (category: string, updates: any) => {
    try {
      setSaving(true);
      setSaveStatus('idle');
      
      const API_URL = (process.env as any).NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
      const response = await fetch(`${API_URL}/api/guilds/${serverId}/settings/${category}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });
      
      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({
          ...prev!,
          [category]: data[category],
        }));
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F0F14] via-[#1A1B23] to-[#0F0F14] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-xl text-gray-300">Ayarlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0F14] via-[#1A1B23] to-[#0F0F14]">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/5 backdrop-blur-xl bg-[#1A1B23]/50">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
              <ArrowLeftIcon className="w-5 h-5" />
              Geri Dön
            </Link>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {guild?.icon && (
                  <img
                    src={`https://cdn.discordapp.com/icons/${serverId}/${guild.icon}.png?size=128`}
                    alt={guild?.name}
                    className="w-16 h-16 rounded-xl"
                  />
                )}
                <div>
                  <h1 className="text-3xl font-black text-white">{guild?.name || 'Sunucu'}</h1>
                  <p className="text-gray-400">Sunucu Ayarları</p>
                </div>
              </div>

              {/* Save Status */}
              <AnimatePresence>
                {saveStatus !== 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                      saveStatus === 'success'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {saveStatus === 'success' ? (
                      <>
                        <CheckCircleIcon className="w-5 h-5" />
                        <span className="font-semibold">Kaydedildi!</span>
                      </>
                    ) : (
                      <>
                        <XCircleIcon className="w-5 h-5" />
                        <span className="font-semibold">Hata!</span>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Categories */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="sticky top-8 space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isActive = activeCategory === category.id;
                  
                  return (
                    <motion.button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30'
                          : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-semibold">{category.name}</span>
                    </motion.button>
                  );
                })}
              </div>
            </aside>

            {/* Settings Panel */}
            <main className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeCategory === 'music' && (
                    <MusicSettings settings={settings?.music} updateSettings={updateSettings} />
                  )}
                  {activeCategory === 'moderation' && (
                    <ModerationSettings settings={settings?.moderation} updateSettings={updateSettings} />
                  )}
                  {activeCategory === 'economy' && (
                    <EconomySettings settings={settings?.economy} updateSettings={updateSettings} />
                  )}
                  {activeCategory === 'leveling' && (
                    <LevelingSettings settings={settings?.leveling} updateSettings={updateSettings} />
                  )}
                  {activeCategory === 'welcome' && (
                    <WelcomeSettings settings={settings?.welcome} updateSettings={updateSettings} />
                  )}
                  {activeCategory === 'general' && (
                    <GeneralSettings settings={settings?.general} updateSettings={updateSettings} />
                  )}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

// Music Settings Component
interface SettingsComponentProps {
  settings: any;
  updateSettings: (category: string, updates: any) => void;
}

function MusicSettings({ settings, updateSettings }: SettingsComponentProps) {
  const [localSettings, setLocalSettings] = useState(settings || {
    enabled: true,
    defaultVolume: 50,
    maxQueueSize: 100,
    djRoleId: null,
    allowFilters: true,
  });

  useEffect(() => {
    if (settings) setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    updateSettings('music', localSettings);
  };

  return (
    <SettingsPanel
      title="Müzik Ayarları"
      description="Müzik botunun davranışını ve özelliklerini yapılandırın"
    >
      <SettingToggle
        label="Müzik Sistemi"
        description="Sunucuda müzik komutlarını aktif et"
        value={localSettings.enabled}
        onChange={(value) => setLocalSettings({ ...localSettings, enabled: value })}
      />
      
      <SettingSlider
        label="Varsayılan Ses Seviyesi"
        description="Müzik başlatıldığında kullanılacak ses seviyesi"
        value={localSettings.defaultVolume}
        onChange={(value) => setLocalSettings({ ...localSettings, defaultVolume: value })}
        min={0}
        max={100}
        unit="%"
      />
      
      <SettingInput
        label="Maksimum Sıra Boyutu"
        description="Müzik kuyruğuna eklenebilecek maksimum şarkı sayısı"
        value={localSettings.maxQueueSize}
        onChange={(value) => setLocalSettings({ ...localSettings, maxQueueSize: parseInt(value) || 0 })}
        type="number"
      />
      
      <SettingToggle
        label="Ses Filtreleri"
        description="Kullanıcıların ses filtrelerini (bassboost, nightcore vb.) kullanmasına izin ver"
        value={localSettings.allowFilters}
        onChange={(value) => setLocalSettings({ ...localSettings, allowFilters: value })}
      />
      
      <button
        onClick={handleSave}
        className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all duration-300"
      >
        Değişiklikleri Kaydet
      </button>
    </SettingsPanel>
  );
}

// Moderation Settings Component
function ModerationSettings({ settings, updateSettings }: SettingsComponentProps) {
  const [localSettings, setLocalSettings] = useState(settings || {
    enabled: true,
    autoMod: true,
    spamProtection: true,
    logChannelId: null,
    muteRoleId: null,
  });

  useEffect(() => {
    if (settings) setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    updateSettings('moderation', localSettings);
  };

  return (
    <SettingsPanel
      title="Moderasyon Ayarları"
      description="Sunucu güvenliği ve moderasyon araçlarını yapılandırın"
    >
      <SettingToggle
        label="Moderasyon Sistemi"
        description="Sunucuda moderasyon komutlarını aktif et"
        value={localSettings.enabled}
        onChange={(value) => setLocalSettings({ ...localSettings, enabled: value })}
      />
      
      <SettingToggle
        label="Otomatik Moderasyon"
        description="AI destekli otomatik moderasyon sistemini aktif et"
        value={localSettings.autoMod}
        onChange={(value) => setLocalSettings({ ...localSettings, autoMod: value })}
      />
      
      <SettingToggle
        label="Spam Koruması"
        description="Mesaj spamını otomatik algıla ve engelle"
        value={localSettings.spamProtection}
        onChange={(value) => setLocalSettings({ ...localSettings, spamProtection: value })}
      />
      
      <button
        onClick={handleSave}
        className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all duration-300"
      >
        Değişiklikleri Kaydet
      </button>
    </SettingsPanel>
  );
}

// Economy Settings Component
function EconomySettings({ settings, updateSettings }: SettingsComponentProps) {
  const [localSettings, setLocalSettings] = useState(settings || {
    enabled: true,
    startingBalance: 1000,
    dailyReward: 100,
    workReward: 50,
  });

  useEffect(() => {
    if (settings) setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    updateSettings('economy', localSettings);
  };

  return (
    <SettingsPanel
      title="Ekonomi Ayarları"
      description="Sanal para sistemi ve ödül oranlarını yapılandırın"
    >
      <SettingToggle
        label="Ekonomi Sistemi"
        description="Sunucuda ekonomi komutlarını aktif et"
        value={localSettings.enabled}
        onChange={(value) => setLocalSettings({ ...localSettings, enabled: value })}
      />
      
      <SettingInput
        label="Başlangıç Parası"
        description="Yeni üyelerin başlangıçta sahip olacağı para miktarı"
        value={localSettings.startingBalance}
        onChange={(value) => setLocalSettings({ ...localSettings, startingBalance: parseInt(value) || 0 })}
        type="number"
      />
      
      <SettingInput
        label="Günlük Ödül"
        description="Günlük komut ile kazanılacak para miktarı"
        value={localSettings.dailyReward}
        onChange={(value) => setLocalSettings({ ...localSettings, dailyReward: parseInt(value) || 0 })}
        type="number"
      />
      
      <SettingInput
        label="Çalışma Ödülü"
        description="Work komutu ile kazanılacak para miktarı"
        value={localSettings.workReward}
        onChange={(value) => setLocalSettings({ ...localSettings, workReward: parseInt(value) || 0 })}
        type="number"
      />
      
      <button
        onClick={handleSave}
        className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all duration-300"
      >
        Değişiklikleri Kaydet
      </button>
    </SettingsPanel>
  );
}

// Leveling Settings Component
function LevelingSettings({ settings, updateSettings }: SettingsComponentProps) {
  const [localSettings, setLocalSettings] = useState(settings || {
    enabled: true,
    xpPerMessage: 15,
    xpCooldown: 60,
    levelUpMessage: true,
  });

  useEffect(() => {
    if (settings) setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    updateSettings('leveling', localSettings);
  };

  return (
    <SettingsPanel
      title="Seviye Sistemi Ayarları"
      description="XP kazanımı ve seviye atlama sistemini yapılandırın"
    >
      <SettingToggle
        label="Seviye Sistemi"
        description="Sunucuda seviye sistemini aktif et"
        value={localSettings.enabled}
        onChange={(value) => setLocalSettings({ ...localSettings, enabled: value })}
      />
      
      <SettingInput
        label="Mesaj Başına XP"
        description="Her mesaj için kazanılacak XP miktarı"
        value={localSettings.xpPerMessage}
        onChange={(value) => setLocalSettings({ ...localSettings, xpPerMessage: parseInt(value) || 0 })}
        type="number"
      />
      
      <SettingInput
        label="XP Cooldown (Saniye)"
        description="Kullanıcıların XP kazanması için bekleme süresi"
        value={localSettings.xpCooldown}
        onChange={(value) => setLocalSettings({ ...localSettings, xpCooldown: parseInt(value) || 0 })}
        type="number"
      />
      
      <SettingToggle
        label="Seviye Atlama Mesajı"
        description="Kullanıcı seviye atladığında otomatik mesaj gönder"
        value={localSettings.levelUpMessage}
        onChange={(value) => setLocalSettings({ ...localSettings, levelUpMessage: value })}
      />
      
      <button
        onClick={handleSave}
        className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all duration-300"
      >
        Değişiklikleri Kaydet
      </button>
    </SettingsPanel>
  );
}

// Welcome Settings Component
function WelcomeSettings({ settings, updateSettings }: SettingsComponentProps) {
  const [localSettings, setLocalSettings] = useState(settings || {
    enabled: true,
    channelId: null,
    message: 'Hoş geldin {user}! Sunucumuza katıldığın için teşekkürler! 🎉',
  });

  useEffect(() => {
    if (settings) setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    updateSettings('welcome', localSettings);
  };

  return (
    <SettingsPanel
      title="Karşılama Sistemi Ayarları"
      description="Yeni üyeleri karşılama mesajlarını yapılandırın"
    >
      <SettingToggle
        label="Karşılama Sistemi"
        description="Yeni üyelere otomatik karşılama mesajı gönder"
        value={localSettings.enabled}
        onChange={(value) => setLocalSettings({ ...localSettings, enabled: value })}
      />
      
      <SettingTextarea
        label="Karşılama Mesajı"
        description="{user} = Kullanıcı adı, {server} = Sunucu adı"
        value={localSettings.message}
        onChange={(value) => setLocalSettings({ ...localSettings, message: value })}
        rows={4}
      />
      
      <button
        onClick={handleSave}
        className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all duration-300"
      >
        Değişiklikleri Kaydet
      </button>
    </SettingsPanel>
  );
}

// General Settings Component
function GeneralSettings({ settings, updateSettings }: SettingsComponentProps) {
  const [localSettings, setLocalSettings] = useState(settings || {
    prefix: '!',
    language: 'tr',
  });

  useEffect(() => {
    if (settings) setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    updateSettings('general', localSettings);
  };

  return (
    <SettingsPanel
      title="Genel Ayarlar"
      description="Bot'un genel davranışını yapılandırın"
    >
      <SettingInput
        label="Komut Öneki"
        description="Bot komutları için kullanılacak önek (örn: !, ?, .)"
        value={localSettings.prefix}
        onChange={(value) => setLocalSettings({ ...localSettings, prefix: value })}
        type="text"
      />
      
      <button
        onClick={handleSave}
        className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all duration-300"
      >
        Değişiklikleri Kaydet
      </button>
    </SettingsPanel>
  );
}

// Reusable Components
interface SettingsPanelProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingsPanel({ title, description, children }: SettingsPanelProps) {
  return (
    <div className="bg-[#1A1B23] border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-white mb-2">{title}</h2>
        <p className="text-gray-400">{description}</p>
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

interface SettingToggleProps {
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

function SettingToggle({ label, description, value, onChange }: SettingToggleProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
      <div className="flex-1">
        <div className="text-white font-semibold mb-1">{label}</div>
        <div className="text-sm text-gray-400">{description}</div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
          value ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gray-600'
        }`}
      >
        <motion.div
          animate={{ x: value ? 24 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
        />
      </button>
    </div>
  );
}

interface SettingInputProps {
  label: string;
  description: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
}

function SettingInput({ label, description, value, onChange, type = 'text' }: SettingInputProps) {
  return (
    <div className="p-4 bg-white/5 rounded-xl">
      <div className="text-white font-semibold mb-1">{label}</div>
      <div className="text-sm text-gray-400 mb-3">{description}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-[#0F0F14] border border-white/10 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
      />
    </div>
  );
}

interface SettingTextareaProps {
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

function SettingTextarea({ label, description, value, onChange, rows = 3 }: SettingTextareaProps) {
  return (
    <div className="p-4 bg-white/5 rounded-xl">
      <div className="text-white font-semibold mb-1">{label}</div>
      <div className="text-sm text-gray-400 mb-3">{description}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-4 py-3 bg-[#0F0F14] border border-white/10 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors resize-none"
      />
    </div>
  );
}

interface SettingSliderProps {
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  unit?: string;
}

function SettingSlider({ label, description, value, onChange, min = 0, max = 100, unit = '' }: SettingSliderProps) {
  return (
    <div className="p-4 bg-white/5 rounded-xl">
      <div className="flex items-center justify-between mb-1">
        <div className="text-white font-semibold">{label}</div>
        <div className="text-purple-400 font-bold">{value}{unit}</div>
      </div>
      <div className="text-sm text-gray-400 mb-3">{description}</div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        style={{
          background: `linear-gradient(to right, rgb(147, 51, 234) 0%, rgb(59, 130, 246) ${value}%, rgb(55, 65, 81) ${value}%, rgb(55, 65, 81) 100%)`
        }}
      />
    </div>
  );
}

