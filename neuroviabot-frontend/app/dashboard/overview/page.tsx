'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ServerIcon,
  PlusIcon,
  Cog6ToothIcon,
  UsersIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

interface Guild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  botPresent?: boolean;
  memberCount?: number;
}

export default function OverviewPage() {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUserAndGuilds();
  }, []);

  const fetchUserAndGuilds = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
      
      // Fetch user info
      const userResponse = await fetch(`${API_URL}/api/auth/user`, {
        credentials: 'include',
      });
      
      if (!userResponse.ok) {
        router.push('/');
        return;
      }
      
      const userData = await userResponse.json();
      setUser(userData);

      // Fetch user guilds
      const guildsResponse = await fetch(`${API_URL}/api/guilds/user`, {
        credentials: 'include',
      });
      
      if (guildsResponse.ok) {
        const guildsData = await guildsResponse.json();
        setGuilds(guildsData);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const getGuildIcon = (guild: Guild) => {
    if (guild.icon) {
      return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`;
    }
    return null;
  };

  const handleManageServer = (guildId: string) => {
    router.push(`/dashboard/servers/${guildId}`);
  };

  const handleAddBot = (guildId: string) => {
    const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=773539215098249246&permissions=8&scope=bot%20applications.commands&guild_id=${guildId}`;
    window.open(inviteUrl, '_blank');
    
    // Redirect after a short delay
    setTimeout(() => {
      router.push(`/dashboard/servers/${guildId}`);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0F0F14] via-[#1A1B23] to-[#0F0F14] relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-lg">Sunucular yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0F14] via-[#1A1B23] to-[#0F0F14] relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        {/* Gradient Orbs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(88, 101, 242, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(88, 101, 242, 0.03) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            {user && (
              <img
                src={user.avatar 
                  ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
                  : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator || '0') % 5}.png`
                }
                alt={user.username}
                className="w-20 h-20 rounded-full border-4 border-purple-500/50 shadow-xl"
              />
            )}
            <div>
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                Hoş Geldin, {user?.username || 'Kullanıcı'}!
              </h1>
              <p className="text-gray-400 text-lg mt-2">
                Sunucularını yönetmek için bir tane seç
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500">
                <ServerIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Toplam Sunucu</p>
                <p className="text-3xl font-black text-white">{guilds.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                <ShieldCheckIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Bot Aktif</p>
                <p className="text-3xl font-black text-white">
                  {guilds.filter(g => g.botPresent).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Yönetici</p>
                <p className="text-3xl font-black text-white">
                  {guilds.filter(g => g.owner || (BigInt(g.permissions) & BigInt(0x8)) === BigInt(0x8)).length}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Server Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
            <ServerIcon className="w-7 h-7 text-purple-500" />
            Sunucularım
          </h2>

          {guilds.length === 0 ? (
            <div className="text-center py-20">
              <ServerIcon className="w-20 h-20 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Henüz bir sunucun yok</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guilds.map((guild, index) => (
                <motion.div
                  key={guild.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group relative"
                >
                  {/* Gradient border effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-300"></div>
                  
                  {/* Card content */}
                  <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full flex flex-col">
                    {/* Server Icon & Info */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative">
                        {getGuildIcon(guild) ? (
                          <img
                            src={getGuildIcon(guild)!}
                            alt={guild.name}
                            className="w-16 h-16 rounded-2xl"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                            <span className="text-white text-2xl font-black">
                              {guild.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        {guild.owner && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-gray-900">
                            <ShieldCheckIcon className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold text-lg truncate mb-1">
                          {guild.name}
                        </h3>
                        {guild.memberCount && (
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <UsersIcon className="w-4 h-4" />
                            <span>{guild.memberCount.toLocaleString()} üye</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-4">
                      {guild.botPresent ? (
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                          <span className="text-green-400 text-sm font-medium">Bot Aktif</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-500/20 border border-gray-500/30">
                          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                          <span className="text-gray-400 text-sm font-medium">Bot Yok</span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="mt-auto">
                      {guild.botPresent ? (
                        <button
                          onClick={() => handleManageServer(guild.id)}
                          className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold hover:from-purple-600 hover:to-blue-600 transition-all flex items-center justify-center gap-2 group/btn"
                        >
                          <Cog6ToothIcon className="w-5 h-5 group-hover/btn:rotate-90 transition-transform duration-300" />
                          Yönet
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAddBot(guild.id)}
                          className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-2 group/btn"
                        >
                          <PlusIcon className="w-5 h-5 group-hover/btn:rotate-90 transition-transform duration-300" />
                          Botu Ekle
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

