'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cog6ToothIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  LanguageIcon,
  CommandLineIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

interface FeatureManagerProps {
  guildId: string;
  userId: string;
}

interface Feature {
  name: string;
  enabled: boolean;
  description: string;
}

const featureDescriptions = {
  tickets: 'Ticket sistemi - Kullanıcılar destek talebi oluşturabilir',
  economy: 'Ekonomi sistemi - Para, mağaza ve ekonomi komutları',
  moderation: 'Moderasyon sistemi - Ban, kick, mute gibi moderasyon komutları',
  leveling: 'Seviye sistemi - XP kazanma ve seviye ödülleri',
  giveaways: 'Çekiliş sistemi - Çekiliş oluşturma ve yönetimi',
  music: 'Müzik sistemi - YouTube ve Spotify müzik çalma',
  games: 'Oyun sistemi - Kumar ve ekonomi oyunları',
  security: 'Güvenlik sistemi - Anti-raid ve koruma özellikleri'
};

const featureNames = {
  tickets: '🎫 Ticket Sistemi',
  economy: '💰 Ekonomi Sistemi',
  moderation: '🛡️ Moderasyon Sistemi',
  leveling: '📊 Seviye Sistemi',
  giveaways: '🎁 Çekiliş Sistemi',
  music: '🎵 Müzik Sistemi',
  games: '🎮 Oyun Sistemi',
  security: '🔒 Güvenlik Sistemi'
};

const languages = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' }
];

export default function FeatureManager({ guildId, userId }: FeatureManagerProps) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Array<{id: string, message: string, type: 'success' | 'error'}>>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('tr');
  const [prefix, setPrefix] = useState('!');
  const [activeTab, setActiveTab] = useState<'features' | 'language' | 'prefix'>('features');

  useEffect(() => {
    fetchFeatures();
  }, [guildId]);

  const fetchFeatures = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
      const response = await fetch(`${API_URL}/api/bot-commands/status/${guildId}`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        const featureList = Object.entries(data.data.features).map(([name, enabled]) => ({
          name,
          enabled: enabled as boolean,
          description: featureDescriptions[name as keyof typeof featureDescriptions] || 'Açıklama yok'
        }));
        setFeatures(featureList);
      }
    } catch (error) {
      console.error('Failed to fetch features:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeature = async (featureName: string, currentEnabled: boolean) => {
    setToggling(featureName);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
      const response = await fetch(`${API_URL}/api/bot-commands/execute/özellikler`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          guildId,
          userId,
          subcommand: currentEnabled ? 'kapat' : 'aç',
          params: {
            özellik: featureName
          }
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Feature toggled:', data);
        
        // Success notification
        setNotifications(prev => [...prev, {
          id: Date.now().toString(),
          message: `✅ ${featureNames[featureName as keyof typeof featureNames]} ${currentEnabled ? 'devre dışı bırakıldı' : 'aktifleştirildi'}`,
          type: 'success'
        }]);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
          setNotifications(prev => prev.slice(1));
        }, 5000);
        
        // Refresh features
        await fetchFeatures();
      } else {
        const error = await response.json();
        console.error('Feature toggle error:', error);
        
        // Error notification
        setNotifications(prev => [...prev, {
          id: Date.now().toString(),
          message: `❌ ${featureNames[featureName as keyof typeof featureNames]} değiştirilemedi: ${error.error}`,
          type: 'error'
        }]);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
          setNotifications(prev => prev.slice(1));
        }, 5000);
      }
    } catch (error) {
      console.error('Feature toggle error:', error);
      
      // Error notification
      setNotifications(prev => [...prev, {
        id: Date.now().toString(),
        message: `❌ ${featureNames[featureName as keyof typeof featureNames]} değiştirilemedi`,
        type: 'error'
      }]);
      
      // Remove notification after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.slice(1));
      }, 5000);
    } finally {
      setToggling(null);
    }
  };

  const toggleAllFeatures = async (enable: boolean) => {
    setToggling('all');
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
      const response = await fetch(`${API_URL}/api/bot-commands/execute/özellikler`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          guildId,
          userId,
          subcommand: enable ? 'tümünü-aç' : 'tümünü-kapat',
          params: {}
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('All features toggled:', data);
        
        // Success notification
        setNotifications(prev => [...prev, {
          id: Date.now().toString(),
          message: `✅ Tüm özellikler ${enable ? 'aktifleştirildi' : 'devre dışı bırakıldı'}`,
          type: 'success'
        }]);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
          setNotifications(prev => prev.slice(1));
        }, 5000);
        
        // Refresh features
        await fetchFeatures();
      } else {
        const error = await response.json();
        console.error('All features toggle error:', error);
        
        // Error notification
        setNotifications(prev => [...prev, {
          id: Date.now().toString(),
          message: `❌ Tüm özellikler değiştirilemedi: ${error.error}`,
          type: 'error'
        }]);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
          setNotifications(prev => prev.slice(1));
        }, 5000);
      }
    } catch (error) {
      console.error('All features toggle error:', error);
      
      // Error notification
      setNotifications(prev => [...prev, {
        id: Date.now().toString(),
        message: `❌ Tüm özellikler değiştirilemedi`,
        type: 'error'
      }]);
      
      // Remove notification after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.slice(1));
      }, 5000);
    } finally {
      setToggling(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-400">Özellikler yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`p-4 rounded-lg border ${
              notification.type === 'success'
                ? 'bg-green-900/20 border-green-500/30 text-green-300'
                : 'bg-red-900/20 border-red-500/30 text-red-300'
            }`}
          >
            {notification.message}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Özellik Yönetimi</h2>
          <p className="text-gray-400 mt-1">Bot özelliklerini, dil ve komut ayarlarını yönetin</p>
        </div>
        
        {/* Bulk Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => toggleAllFeatures(true)}
            disabled={toggling === 'all'}
            className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {toggling === 'all' ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <CheckCircleIcon className="w-4 h-4" />
            )}
            Tümünü Aç
          </button>
          
          <button
            onClick={() => toggleAllFeatures(false)}
            disabled={toggling === 'all'}
            className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {toggling === 'all' ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <XCircleIcon className="w-4 h-4" />
            )}
            Tümünü Kapat
          </button>
          
          <button
            onClick={fetchFeatures}
            className="px-4 py-2 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-700 transition-all flex items-center gap-2"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Yenile
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-gray-800/50 rounded-lg">
        <button
          onClick={() => setActiveTab('features')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
            activeTab === 'features'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Cog6ToothIcon className="w-4 h-4" />
          Özellikler
        </button>
        <button
          onClick={() => setActiveTab('language')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
            activeTab === 'language'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <LanguageIcon className="w-4 h-4" />
          Dil Ayarları
        </button>
        <button
          onClick={() => setActiveTab('prefix')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
            activeTab === 'prefix'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <CommandLineIcon className="w-4 h-4" />
          Komut Öneki
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'features' && (
        <div className="space-y-4">
        {features.map((feature) => {
          const isToggling = toggling === feature.name;
          
          return (
            <motion.div
              key={feature.name}
              layout
              className="bg-[#2c2f38] rounded-xl border border-white/10 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${feature.enabled ? 'bg-green-600' : 'bg-gray-600'}`}>
                      <Cog6ToothIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">
                        {featureNames[feature.name as keyof typeof featureNames] || feature.name}
                      </h3>
                      <p className="text-gray-400 text-sm">{feature.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className={`w-2 h-2 rounded-full ${feature.enabled ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                        <span className={`text-xs font-semibold ${feature.enabled ? 'text-green-400' : 'text-gray-400'}`}>
                          {feature.enabled ? 'Aktif' : 'Devre Dışı'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleFeature(feature.name, feature.enabled)}
                    disabled={isToggling}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
                      feature.enabled
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isToggling ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : feature.enabled ? (
                      <>
                        <XCircleIcon className="w-4 h-4" />
                        Devre Dışı Bırak
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="w-4 h-4" />
                        Aktifleştir
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
        </div>
      )}

      {/* Language Settings Tab */}
      {activeTab === 'language' && (
        <div className="space-y-6">
          <div className="bg-[#2c2f38] rounded-xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500">
                <LanguageIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Dil Ayarları</h3>
                <p className="text-gray-400 text-sm">Bot mesajları için dil seçin</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`p-4 rounded-lg border transition-all ${
                    selectedLanguage === lang.code
                      ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                      : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500 hover:bg-gray-600/50'
                  }`}
                >
                  <div className="text-2xl mb-2">{lang.flag}</div>
                  <div className="font-semibold">{lang.name}</div>
                  <div className="text-xs text-gray-400">{lang.code.toUpperCase()}</div>
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Özel Mesajlar</h4>
              <p className="text-gray-400 text-sm mb-4">
                Bot mesajlarını özelleştirmek için özel çeviriler ekleyebilirsiniz.
              </p>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all">
                Özel Mesajları Düzenle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prefix Settings Tab */}
      {activeTab === 'prefix' && (
        <div className="space-y-6">
          <div className="bg-[#2c2f38] rounded-xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                <CommandLineIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Komut Öneki</h3>
                <p className="text-gray-400 text-sm">Bot komutları için önek belirleyin</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white font-semibold mb-2">Mevcut Önek</label>
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 bg-gray-700 rounded-lg font-mono text-lg">
                    {prefix}
                  </div>
                  <span className="text-gray-400 text-sm">Komutlar: {prefix}help, {prefix}ping</span>
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Yeni Önek</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    placeholder="Örnek: !, ?, /"
                    maxLength={5}
                  />
                  <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all">
                    Kaydet
                  </button>
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                <h4 className="text-white font-semibold mb-2">Önek Önerileri</h4>
                <div className="flex gap-2 flex-wrap">
                  {['!', '?', '/', '>', '$', '&'].map((suggestedPrefix) => (
                    <button
                      key={suggestedPrefix}
                      onClick={() => setPrefix(suggestedPrefix)}
                      className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white font-mono transition-all"
                    >
                      {suggestedPrefix}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
