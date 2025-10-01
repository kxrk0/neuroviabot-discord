'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ServerIcon,
  PlusCircleIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  ChartBarIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

interface Guild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  memberCount?: number;
  botPresent: boolean;
}

export default function DashboardPage() {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const API_URL = (process.env as any).NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
      const response = await fetch(`${API_URL}/api/auth/user`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        window.location.href = '/';
        return;
      }

      const userData = await response.json();
      setUser(userData);
      
      // Fetch user's guilds
      await fetchGuilds(userData.accessToken);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

  const fetchGuilds = async (accessToken: string) => {
    try {
      // Fetch user's Discord guilds
      const guildsResponse = await fetch('https://discord.com/api/users/@me/guilds', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!guildsResponse.ok) throw new Error('Failed to fetch guilds');

      const allGuilds = await guildsResponse.json();
      
      // Filter guilds where user has MANAGE_GUILD permission (0x00000020)
      const manageableGuilds = allGuilds.filter((guild: any) => 
        (parseInt(guild.permissions) & 0x00000020) === 0x00000020
      );

      // Check which guilds have the bot
      const API_URL = (process.env as any).NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
      const botResponse = await fetch(`${API_URL}/api/bot/stats`, {
        credentials: 'include',
      });
      
      let botGuildIds: string[] = [];
      if (botResponse.ok) {
        const botData = await botResponse.json();
        // This will be implemented in backend
        botGuildIds = botData.guildIds || [];
      }

      const guildsWithBotStatus = manageableGuilds.map((guild: any) => ({
        id: guild.id,
        name: guild.name,
        icon: guild.icon,
        owner: guild.owner,
        permissions: guild.permissions,
        memberCount: 0,
        botPresent: botGuildIds.includes(guild.id),
      }));

      setGuilds(guildsWithBotStatus);
    } catch (error) {
      console.error('Failed to fetch guilds:', error);
    }
  };

  const getGuildIconUrl = (guild: Guild) => {
    if (!guild.icon) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(guild.name)}&background=5865F2&color=fff&size=128`;
    }
    return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`;
  };

  const inviteBot = (guildId: string) => {
    const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=773539215098249246&permissions=8&scope=bot%20applications.commands&guild_id=${guildId}&disable_guild_select=true`;
    window.open(inviteUrl, '_blank');
    
    // Refresh guild list after 3 seconds
    setTimeout(() => {
      if (user) {
        fetchGuilds(user.accessToken);
      }
    }, 3000);
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
          <p className="text-xl text-gray-300">Yükleniyor...</p>
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
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/5 backdrop-blur-xl bg-[#1A1B23]/50">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <Link href="/" className="inline-flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                  </div>
                  <span className="text-white font-bold text-xl">NeuroViaBot</span>
                </Link>
                <h1 className="text-3xl font-black text-white">
                  Hoş geldin, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{user?.username}</span>!
                </h1>
                <p className="text-gray-400 mt-1">Sunucularını yönet ve özelleştir</p>
              </div>

              <div className="flex items-center gap-4">
                {user && (
                  <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                    <img
                      src={user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64` : '/default-avatar.png'}
                      alt={user.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="text-white font-semibold">{user.username}</div>
                      <div className="text-xs text-gray-400">#{user.discriminator}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatsCard
              icon={<ServerIcon className="w-8 h-8" />}
              label="Toplam Sunucu"
              value={guilds.length}
              gradient="from-blue-500 to-cyan-500"
            />
            <StatsCard
              icon={<ChartBarIcon className="w-8 h-8" />}
              label="Bot Ekli Sunucu"
              value={guilds.filter(g => g.botPresent).length}
              gradient="from-purple-500 to-pink-500"
            />
            <StatsCard
              icon={<UserGroupIcon className="w-8 h-8" />}
              label="Yönetilebilir"
              value={guilds.length}
              gradient="from-pink-500 to-rose-500"
            />
          </div>

          {/* Guilds Grid */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Sunucularınız</h2>
            {guilds.length === 0 ? (
              <div className="text-center py-20">
                <ServerIcon className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                <p className="text-xl text-gray-400">Yönetici yetkisine sahip olduğunuz sunucu bulunamadı.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guilds.map((guild, index) => (
                  <GuildCard
                    key={guild.id}
                    guild={guild}
                    getIconUrl={getGuildIconUrl}
                    inviteBot={inviteBot}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// Stats Card Component
interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  gradient: string;
}

function StatsCard({ icon, label, value, gradient }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -2 }}
      className="relative group"
    >
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-300`}></div>
      <div className="relative p-6 bg-[#1A1B23] border border-white/10 rounded-2xl backdrop-blur-xl">
        <div className={`inline-flex items-center justify-center w-12 h-12 mb-3 rounded-xl bg-gradient-to-br ${gradient} text-white`}>
          {icon}
        </div>
        <div className="text-3xl font-black text-white mb-1">{value}</div>
        <div className="text-gray-400 text-sm">{label}</div>
      </div>
    </motion.div>
  );
}

// Guild Card Component
interface GuildCardProps {
  guild: Guild;
  getIconUrl: (guild: Guild) => string;
  inviteBot: (guildId: string) => void;
  index: number;
}

function GuildCard({ guild, getIconUrl, inviteBot, index }: GuildCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.03, y: -5 }}
      className="relative group"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-300"></div>
      <div className="relative p-6 bg-[#1A1B23] border border-white/10 rounded-2xl backdrop-blur-xl h-full flex flex-col">
        <div className="flex items-start gap-4 mb-4">
          <img
            src={getIconUrl(guild)}
            alt={guild.name}
            className="w-16 h-16 rounded-xl"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white truncate mb-1">{guild.name}</h3>
            {guild.botPresent ? (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-semibold">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Bot Aktif
              </div>
            ) : (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-500/20 text-gray-400 rounded-lg text-xs font-semibold">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                Bot Yok
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto">
          {guild.botPresent ? (
            <Link
              href={`/dashboard/${guild.id}`}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all duration-300 group/btn"
            >
              <Cog6ToothIcon className="w-5 h-5" />
              Yönet
              <ArrowRightIcon className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <button
              onClick={() => inviteBot(guild.id)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 text-white font-bold rounded-xl transition-all duration-300 group/btn"
            >
              <PlusCircleIcon className="w-5 h-5" />
              Botu Ekle
              <ArrowRightIcon className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
