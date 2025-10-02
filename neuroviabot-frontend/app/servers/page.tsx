'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ServerIcon,
  PlusIcon,
  Cog6ToothIcon,
  UsersIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
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
    router.push(`/manage/${guildId}`);
  };

  const handleAddBot = (guildId: string) => {
    // Bot invite URL - with integration_type=0 to avoid code grant requirement
    const inviteUrl = `https://discord.com/oauth2/authorize?client_id=773539215098249246&permissions=8&integration_type=0&scope=bot+applications.commands&guild_id=${guildId}&disable_guild_select=true`;
    
    // Open invite in new tab
    const popup = window.open(inviteUrl, '_blank');
    
    // Optional: Poll for bot being added (check every 3 seconds)
    const checkInterval = setInterval(async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
        const response = await fetch(`${API_URL}/api/guilds/user`, {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          const updatedGuild = data.find((g: any) => g.id === guildId);
          
          // If bot is now present, redirect
          if (updatedGuild?.botPresent) {
            clearInterval(checkInterval);
            router.push(`/manage/${guildId}`);
          }
        }
      } catch (error) {
        console.error('Error checking bot status:', error);
      }
    }, 3000);
    
    // Stop checking after 30 seconds
    setTimeout(() => {
      clearInterval(checkInterval);
    }, 30000);
  };

  const handleLogout = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
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
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(88, 101, 242, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(88, 101, 242, 0.03) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 border-b border-white/10 backdrop-blur-xl bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </div>
              <span className="text-2xl font-black text-white">NeuroViaBot</span>
            </Link>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
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
                    <span className="text-white font-semibold">{user.username}</span>
                  </>
                )}
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-gray-900 border border-white/10 shadow-2xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-white/10">
                      <p className="text-white font-semibold">{user?.username}</p>
                      {user?.discriminator && user.discriminator !== '0' && (
                        <p className="text-gray-400 text-sm">#{user.discriminator}</p>
                      )}
                    </div>
                    <div className="p-2">
                      <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="text-sm font-medium">Ana Sayfa</span>
                      </Link>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">Çıkış Yap</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Server Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
              <h1 className="text-5xl font-black text-white">
                Sunucu{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-[length:200%_auto] animate-gradient-x">
                  Yönetimi
                </span>
              </h1>
            </div>
            <p className="text-gray-400 text-lg ml-16">
              {loading ? 'Sunucular yükleniyor...' : `${guilds.length} sunucu bulundu`}
            </p>
          </motion.div>

          {loading ? (
            // Skeleton loading
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                >
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-gray-800 animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-gray-800 rounded-lg mb-2 animate-pulse"></div>
                        <div className="h-4 w-24 bg-gray-800 rounded animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex gap-4 mb-4">
                      <div className="h-4 w-20 bg-gray-800 rounded animate-pulse"></div>
                      <div className="h-4 w-20 bg-gray-800 rounded animate-pulse"></div>
                    </div>
                    <div className="h-12 bg-gray-800 rounded-xl animate-pulse"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : guilds.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-purple-500/10 mb-6">
                <ServerIcon className="w-12 h-12 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Sunucu Bulunamadı</h2>
              <p className="text-gray-400 text-lg mb-6">Yönetici olduğun sunucu bulunamadı.</p>
              <p className="text-gray-500 text-sm max-w-md mx-auto">Discord'da bir sunucuya yönetici izni aldığında burada görünecektir.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guilds.map((guild, index) => (
                <motion.div
                  key={guild.id}
                  initial={{ opacity: 0, y: 30, rotateX: -15 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.08,
                    type: "spring",
                    stiffness: 120
                  }}
                  whileHover={{ 
                    scale: 1.03, 
                    y: -8,
                    rotateY: 2,
                    transition: { type: "spring", stiffness: 400, damping: 17 }
                  }}
                  className="group relative perspective-1000"
                >
                  {/* Animated gradient border */}
                  <motion.div 
                    className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-100 blur-md transition-all duration-500"
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{ backgroundSize: '200% 200%' }}
                  />
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-blue-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:via-blue-500/5 group-hover:to-pink-500/5 rounded-2xl blur-2xl transition-all duration-500"></div>
                  
                  {/* Card content */}
                  <div className="relative bg-gradient-to-br from-gray-900/95 to-gray-900/80 backdrop-blur-2xl border-2 border-white/10 group-hover:border-purple-500/30 rounded-2xl p-6 h-full flex flex-col shadow-xl group-hover:shadow-2xl group-hover:shadow-purple-500/20 transition-all duration-500">
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

