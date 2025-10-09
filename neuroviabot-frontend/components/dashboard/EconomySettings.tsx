'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CurrencyDollarIcon,
  BanknotesIcon,
  ShoppingBagIcon,
  Cog6ToothIcon,
  GiftIcon,
} from '@heroicons/react/24/outline';

interface EconomySettingsProps {
  guildId: string;
  userId: string;
}

interface EconomyConfig {
  enabled: boolean;
  currencyName: string;
  currencySymbol: string;
  dailyAmount: number;
  dailyCooldown: number;
  workAmount: number;
  workCooldown: number;
  shopEnabled: boolean;
  shopItems: Array<{
    id: string;
    name: string;
    price: number;
    description: string;
    roleId?: string;
    roleName?: string;
  }>;
}

const defaultConfig: EconomyConfig = {
  enabled: false,
  currencyName: 'Coin',
  currencySymbol: '🪙',
  dailyAmount: 100,
  dailyCooldown: 86400,
  workAmount: 50,
  workCooldown: 3600,
  shopEnabled: false,
  shopItems: [],
};

export default function EconomySettings({ guildId, userId }: EconomySettingsProps) {
  const [config, setConfig] = useState<EconomyConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<Array<{id: string, message: string, type: 'success' | 'error'}>>([]);

  useEffect(() => {
    fetchSettings();
    fetchRoles();
  }, [guildId]);

  const fetchSettings = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
      const response = await fetch(`${API_URL}/api/guilds/${guildId}/settings/economy`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setConfig(data.settings || defaultConfig);
      }
    } catch (error) {
      console.error('Error fetching economy settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
      const response = await fetch(`${API_URL}/api/guilds/${guildId}/roles`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setRoles(data.roles || []);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
      const response = await fetch(`${API_URL}/api/guilds/${guildId}/settings/economy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(config),
      });

      if (response.ok) {
        showNotification('✅ Ekonomi sistemi ayarları başarıyla kaydedildi!', 'success');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving economy settings:', error);
      showNotification('❌ Ayarlar kaydedilemedi', 'error');
    } finally {
      setSaving(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const updateConfig = (key: keyof EconomyConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const addShopItem = () => {
    const newItem = {
      id: Date.now().toString(),
      name: 'Yeni Ürün',
      price: 100,
      description: 'Ürün açıklaması',
      roleId: '',
      roleName: '',
    };
    setConfig(prev => ({
      ...prev,
      shopItems: [...prev.shopItems, newItem]
    }));
  };

  const removeShopItem = (index: number) => {
    setConfig(prev => ({
      ...prev,
      shopItems: prev.shopItems.filter((_, i) => i !== index)
    }));
  };

  const updateShopItem = (index: number, key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      shopItems: prev.shopItems.map((item, i) => 
        i === index ? { ...item, [key]: value } : item
      )
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-400">Ayarlar yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500">
          <CurrencyDollarIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Ekonomi Sistemi</h2>
          <p className="text-gray-400 text-sm">Sunucunuzda sanal ekonomi oluşturun ve üyeleri ödüllendirin</p>
        </div>
      </div>

      {/* Basic Settings */}
      <div className="bg-gray-800/50 border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-500">
            <Cog6ToothIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Temel Ayarlar</h3>
            <p className="text-gray-400 text-sm">Ekonomi sistemi genel ayarları</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Enable Economy */}
          <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
            <div>
              <h4 className="text-white font-semibold">Ekonomi Sistemini Etkinleştir</h4>
              <p className="text-gray-400 text-sm">Üyeler para kazanabilsin ve harcayabilsin</p>
            </div>
            <button
              onClick={() => updateConfig('enabled', !config.enabled)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                config.enabled
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              }`}
            >
              {config.enabled ? 'Aktif' : 'Devre Dışı'}
            </button>
          </div>

          {/* Currency Name */}
          {config.enabled && (
            <div>
              <label className="block text-white font-semibold mb-2">Para Birimi Adı</label>
              <input
                type="text"
                value={config.currencyName}
                onChange={(e) => updateConfig('currencyName', e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                placeholder="Coin"
              />
              <p className="text-gray-400 text-xs mt-1">Para biriminin adı (örn: Coin, Altın)</p>
            </div>
          )}

          {/* Currency Symbol */}
          {config.enabled && (
            <div>
              <label className="block text-white font-semibold mb-2">Para Birimi Sembolü</label>
              <input
                type="text"
                value={config.currencySymbol}
                onChange={(e) => updateConfig('currencySymbol', e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                placeholder="🪙"
                maxLength={2}
              />
              <p className="text-gray-400 text-xs mt-1">Para biriminin sembolü (emoji veya karakter)</p>
            </div>
          )}
        </div>
      </div>

      {/* Daily System */}
      {config.enabled && (
        <div className="bg-gray-800/50 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
              <BanknotesIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Günlük Ödül Sistemi</h3>
              <p className="text-gray-400 text-sm">Üyeler günlük para kazanabilsin</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-semibold mb-2">Günlük Ödül Miktarı</label>
                <input
                  type="number"
                  value={config.dailyAmount}
                  onChange={(e) => updateConfig('dailyAmount', parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
                  min="1"
                  max="10000"
                />
                <p className="text-gray-400 text-xs mt-1">Günlük ödül miktarı</p>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Bekleme Süresi (saniye)</label>
                <input
                  type="number"
                  value={config.dailyCooldown}
                  onChange={(e) => updateConfig('dailyCooldown', parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
                  min="3600"
                  max="86400"
                />
                <p className="text-gray-400 text-xs mt-1">Ödül alma arasındaki süre</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Work System */}
      {config.enabled && (
        <div className="bg-gray-800/50 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
              <BanknotesIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Çalışma Sistemi</h3>
              <p className="text-gray-400 text-sm">Üyeler çalışarak para kazanabilsin</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-semibold mb-2">Çalışma Ödülü</label>
                <input
                  type="number"
                  value={config.workAmount}
                  onChange={(e) => updateConfig('workAmount', parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  min="1"
                  max="1000"
                />
                <p className="text-gray-400 text-xs mt-1">Çalışma başına kazanılan para</p>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Çalışma Bekleme Süresi (saniye)</label>
                <input
                  type="number"
                  value={config.workCooldown}
                  onChange={(e) => updateConfig('workCooldown', parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  min="300"
                  max="7200"
                />
                <p className="text-gray-400 text-xs mt-1">Çalışma arasındaki süre</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shop System */}
      {config.enabled && (
        <div className="bg-gray-800/50 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                <ShoppingBagIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Mağaza Sistemi</h3>
                <p className="text-gray-400 text-sm">Üyeler para ile ürün satın alabilsin</p>
              </div>
            </div>
            <button
              onClick={() => updateConfig('shopEnabled', !config.shopEnabled)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                config.shopEnabled
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              }`}
            >
              {config.shopEnabled ? 'Aktif' : 'Devre Dışı'}
            </button>
          </div>

          {config.shopEnabled && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  onClick={addShopItem}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center gap-2"
                >
                  <GiftIcon className="w-4 h-4" />
                  Ürün Ekle
                </button>
              </div>

              <div className="space-y-4">
                {config.shopItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gray-700/50 rounded-lg border border-gray-600"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-semibold">Ürün #{index + 1}</h4>
                      <button
                        onClick={() => removeShopItem(index)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-all"
                      >
                        Kaldır
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white font-semibold mb-2">Ürün Adı</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateShopItem(index, 'name', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white font-semibold mb-2">Fiyat</label>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => updateShopItem(index, 'price', parseInt(e.target.value))}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                          min="1"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-white font-semibold mb-2">Açıklama</label>
                      <textarea
                        value={item.description}
                        onChange={(e) => updateShopItem(index, 'description', e.target.value)}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                        rows={2}
                      />
                    </div>

                    <div className="mt-4">
                      <label className="block text-white font-semibold mb-2">Verilecek Rol (Opsiyonel)</label>
                      <select
                        value={item.roleId || ''}
                        onChange={(e) => {
                          const selectedRole = roles.find(r => r.id === e.target.value);
                          updateShopItem(index, 'roleId', e.target.value);
                          updateShopItem(index, 'roleName', selectedRole?.name || '');
                        }}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                      >
                        <option value="">Rol seçin...</option>
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                ))}
                
                {config.shopItems.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <ShoppingBagIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Henüz mağaza ürünü eklenmemiş</p>
                    <p className="text-sm">Yukarıdaki "Ürün Ekle" butonuna tıklayarak başlayın</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Kaydediliyor...
            </>
          ) : (
            <>
              <Cog6ToothIcon className="w-4 h-4" />
              Ayarları Kaydet
            </>
          )}
        </button>
      </div>

      {/* Notifications */}
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
    </div>
  );
}