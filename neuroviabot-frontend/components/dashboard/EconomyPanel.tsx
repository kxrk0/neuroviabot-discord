'use client';

import { useState, useEffect } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import axios from 'axios';

interface EconomyStats {
  totalCirculation: number;
  richestUsers: Array<{
    userId: string;
    username: string;
    balance: number;
  }>;
  topTraders: Array<{
    userId: string;
    username: string;
    tradeCount: number;
  }>;
  treasury: {
    balance: number;
    totalEarned: number;
    transactions: Array<{
      type: string;
      amount: number;
      timestamp: string;
    }>;
  };
  transactionVolume: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

interface EconomyConfig {
  messageReward: number;
  voiceReward: number;
  reactionReward: number;
  dailyCap: number;
  weeklyCap: number;
  marketplaceTax: number;
  questRewardsEnabled: boolean;
}

interface EconomyPanelProps {
  guildId: string;
}

export default function EconomyPanel({ guildId }: EconomyPanelProps) {
  const { socket } = useSocket();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<EconomyStats | null>(null);
  const [config, setConfig] = useState<EconomyConfig | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchEconomyData();
    
    // Socket listeners for real-time updates
    if (socket) {
      socket.on('economy_update', handleEconomyUpdate);
      socket.on('treasury_update', handleTreasuryUpdate);
    }

    return () => {
      if (socket) {
        socket.off('economy_update', handleEconomyUpdate);
        socket.off('treasury_update', handleTreasuryUpdate);
      }
    };
  }, [guildId, socket]);

  const fetchEconomyData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsRes = await axios.get(`/api/bot/economy/stats/${guildId}`);
      setStats(statsRes.data);

      // Fetch config
      const configRes = await axios.get(`/api/bot/economy/config/${guildId}`);
      setConfig(configRes.data);
    } catch (error) {
      console.error('Failed to fetch economy data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEconomyUpdate = (data: any) => {
    if (data.guildId === guildId) {
      fetchEconomyData();
    }
  };

  const handleTreasuryUpdate = (data: any) => {
    if (data.guildId === guildId && stats) {
      setStats({
        ...stats,
        treasury: data.treasury
      });
    }
  };

  const handleConfigUpdate = async () => {
    if (!config) return;

    try {
      await axios.post(`/api/bot/economy/config/${guildId}`, { config });
      
      // Emit socket event
      if (socket) {
        socket.emit('update_economy_config', {
          guildId,
          config
        });
      }

      setEditMode(false);
    } catch (error) {
      console.error('Failed to update config:', error);
      alert('Ayarlar güncellenirken hata oluştu!');
    }
  };

  const handleTreasuryWithdraw = async (amount: number, reason: string) => {
    try {
      await axios.post(`/api/bot/marketplace/treasury/${guildId}/withdraw`, {
        amount,
        userId: 'admin', // Should be actual admin user ID
        reason
      });

      fetchEconomyData();
    } catch (error) {
      console.error('Failed to withdraw from treasury:', error);
      alert('Treasury\'den çekim başarısız!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (!stats || !config) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <p className="text-gray-400">Ekonomi verileri yüklenemedi.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="💰"
          title="Toplam Dolaşım"
          value={`${stats.totalCirculation.toLocaleString()} NRC`}
          color="violet"
        />
        <StatCard
          icon="🏦"
          title="Treasury Bakiyesi"
          value={`${stats.treasury.balance.toLocaleString()} NRC`}
          color="blue"
        />
        <StatCard
          icon="📊"
          title="Günlük İşlem"
          value={`${stats.transactionVolume.daily.toLocaleString()} NRC`}
          color="green"
        />
        <StatCard
          icon="💸"
          title="Aylık İşlem"
          value={`${stats.transactionVolume.monthly.toLocaleString()} NRC`}
          color="amber"
        />
      </div>

      {/* Configuration */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">⚙️ Ekonomi Ayarları</h3>
          <button
            onClick={() => setEditMode(!editMode)}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-white transition-colors"
          >
            {editMode ? 'İptal' : 'Düzenle'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ConfigInput
            label="💬 Mesaj Ödülü"
            value={config.messageReward}
            onChange={(v) => setConfig({ ...config, messageReward: v })}
            disabled={!editMode}
            suffix="NRC"
          />
          <ConfigInput
            label="🎤 Voice Ödülü (dk)"
            value={config.voiceReward}
            onChange={(v) => setConfig({ ...config, voiceReward: v })}
            disabled={!editMode}
            suffix="NRC"
          />
          <ConfigInput
            label="⚡ Reaction Ödülü"
            value={config.reactionReward}
            onChange={(v) => setConfig({ ...config, reactionReward: v })}
            disabled={!editMode}
            suffix="NRC"
          />
          <ConfigInput
            label="📅 Günlük Limit"
            value={config.dailyCap}
            onChange={(v) => setConfig({ ...config, dailyCap: v })}
            disabled={!editMode}
            suffix="NRC"
          />
          <ConfigInput
            label="📆 Haftalık Limit"
            value={config.weeklyCap}
            onChange={(v) => setConfig({ ...config, weeklyCap: v })}
            disabled={!editMode}
            suffix="NRC"
          />
          <ConfigInput
            label="🏪 Marketplace Vergisi"
            value={config.marketplaceTax}
            onChange={(v) => setConfig({ ...config, marketplaceTax: v })}
            disabled={!editMode}
            suffix="%"
            max={10}
          />
        </div>

        {editMode && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleConfigUpdate}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition-colors"
            >
              💾 Kaydet
            </button>
          </div>
        )}
      </div>

      {/* Richest Users */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">🏆 En Zengin Kullanıcılar</h3>
        <div className="space-y-3">
          {stats.richestUsers.slice(0, 10).map((user, index) => (
            <div key={user.userId} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}</span>
                <span className="text-white font-medium">{user.username}</span>
              </div>
              <span className="text-violet-400 font-bold">{user.balance.toLocaleString()} NRC</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Traders */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">💱 En Aktif Trader'lar</h3>
        <div className="space-y-3">
          {stats.topTraders.slice(0, 10).map((trader, index) => (
            <div key={trader.userId} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-xl">📊</span>
                <span className="text-white font-medium">{trader.username}</span>
              </div>
              <span className="text-blue-400 font-bold">{trader.tradeCount} işlem</span>
            </div>
          ))}
        </div>
      </div>

      {/* Treasury Management */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">🏦 Treasury Yönetimi</h3>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Bakiye</span>
            <span className="text-2xl font-bold text-violet-400">
              {stats.treasury.balance.toLocaleString()} NRC
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Toplam Kazanılan</span>
            <span className="text-lg text-green-400">
              {stats.treasury.totalEarned.toLocaleString()} NRC
            </span>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <h4 className="text-sm font-semibold text-gray-400">Son İşlemler</h4>
          {stats.treasury.transactions.slice(0, 5).map((tx, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded">
              <div className="flex items-center gap-2">
                <span>{tx.type === 'deposit' ? '📥' : tx.type === 'withdrawal' ? '📤' : '💰'}</span>
                <span className="text-sm text-gray-300">
                  {tx.type === 'deposit' ? 'Yatırma' : tx.type === 'withdrawal' ? 'Çekim' : 'Vergi'}
                </span>
              </div>
              <span className={`text-sm font-semibold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} NRC
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            const amount = prompt('Çekilecek miktar (NRC):');
            const reason = prompt('Sebep:');
            if (amount && reason) {
              handleTreasuryWithdraw(parseInt(amount), reason);
            }
          }}
          className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg text-white font-semibold transition-colors"
        >
          💸 Treasury\'den Çek
        </button>
      </div>
    </div>
  );
}

// Helper Components
function StatCard({ icon, title, value, color }: { icon: string; title: string; value: string; color: string }) {
  const colorClasses = {
    violet: 'from-violet-500 to-purple-600',
    blue: 'from-blue-500 to-cyan-600',
    green: 'from-green-500 to-emerald-600',
    amber: 'from-amber-500 to-orange-600'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} rounded-lg p-6 text-white`}>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">{icon}</span>
        <span className="text-sm opacity-90">{title}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

function ConfigInput({ 
  label, 
  value, 
  onChange, 
  disabled, 
  suffix,
  max 
}: { 
  label: string; 
  value: number; 
  onChange: (v: number) => void; 
  disabled: boolean; 
  suffix?: string;
  max?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          min={0}
          max={max}
          className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        />
        {suffix && <span className="text-gray-400 text-sm">{suffix}</span>}
      </div>
    </div>
  );
}

