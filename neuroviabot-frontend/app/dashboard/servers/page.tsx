'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import MinimalCard from '@/components/ui/MinimalCard';
import Loading from '@/components/ui/Loading';
import Badge from '@/components/ui/Badge';
import { getDiscordGuildIconUrl } from '@/lib/utils';
import { fetchUserGuilds, checkBotInGuilds, getBotInviteUrl } from '@/lib/api';
import { useUser } from '@/hooks/useUser';
import {
  ServerIcon,
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
  Cog6ToothIcon,
  PlusIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

interface ServerData {
  id: string;
  name: string;
  icon: string | null;
  memberCount?: number;
  botPresent: boolean;
  permissions: string;
}

export default function ServersPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const [servers, setServers] = useState<ServerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/');
      return;
    }

    if (user) {
      fetchServers();
    }
  }, [user, userLoading, router]);

  const fetchServers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.accessToken) {
        throw new Error('No access token available');
      }
      
      const accessToken = user.accessToken;

      // Fetch user's Discord guilds
      const guilds = await fetchUserGuilds(accessToken);
      
      // Check bot presence in each guild
      const guildIds = guilds.map(g => g.id);
      const botStatus = await checkBotInGuilds(guildIds);
      
      // Combine data
      const serversWithBot = guilds.map(guild => ({
        id: guild.id,
        name: guild.name,
        icon: guild.icon,
        memberCount: 0, // Will be fetched from bot if present
        botPresent: botStatus[guild.id] || false,
        permissions: guild.permissions,
      }));
      
      setServers(serversWithBot);
    } catch (error: any) {
      console.error('Failed to fetch servers:', error);
      setError(error.message || 'Failed to load servers');
      
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        setServers([
          {
            id: '1',
            name: 'NeuroVia Community',
            icon: null,
            memberCount: 1234,
            botPresent: true,
            permissions: '8',
          },
          {
            id: '2',
            name: 'Gaming Hub',
            icon: null,
            memberCount: 567,
            botPresent: true,
            permissions: '32',
          },
          {
            id: '3',
            name: 'Developer Space',
            icon: null,
            memberCount: 89,
            botPresent: false,
            permissions: '8',
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <Loading size="lg" text="Loading your servers..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-black text-white mb-2">Your Servers</h1>
        <p className="text-gray-400">Manage your Discord servers with NeuroViaBot</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MinimalCard hover={false} className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-discord/10">
              <ServerIcon className="w-6 h-6 text-discord" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{servers.length}</div>
              <div className="text-sm text-gray-400">Total Servers</div>
            </div>
          </div>
        </MinimalCard>

        <MinimalCard hover={false} className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-500/10">
              <CheckCircleIcon className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">
                {servers.filter(s => s.botPresent).length}
              </div>
              <div className="text-sm text-gray-400">Bot Active</div>
            </div>
          </div>
        </MinimalCard>

        <MinimalCard hover={false} className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/10">
              <UsersIcon className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">
                {servers.reduce((acc, s) => acc + (s.memberCount || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Total Members</div>
            </div>
          </div>
        </MinimalCard>
      </div>

      {/* Server Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servers.map((server, index) => (
          <ServerCard key={server.id} server={server} delay={index * 0.1} />
        ))}
      </div>

      {/* Empty State */}
      {servers.length === 0 && (
        <MinimalCard className="p-12 text-center">
          <ServerIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Servers Found</h3>
          <p className="text-gray-400 mb-6">
            You don't have any servers yet. Create or join a server to get started!
          </p>
          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-discord hover:bg-discord-dark text-white rounded-xl font-semibold transition-colors"
          >
            Go to Discord
          </a>
        </MinimalCard>
      )}
    </div>
  );
}

function ServerCard({ server, delay }: any) {
  const iconUrl = getDiscordGuildIconUrl(server.id, server.icon);
  const [isInviting, setIsInviting] = useState(false);

  const handleInviteBot = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsInviting(true);
    try {
      const inviteUrl = await getBotInviteUrl(server.id);
      window.open(inviteUrl, '_blank', 'width=500,height=700');
      
      // Refresh server list after a delay
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error('Failed to get invite URL:', error);
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <MinimalCard className="p-6 group relative overflow-hidden">
        {/* Hover Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-discord/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative">
          <div className="flex items-start gap-4 mb-4">
            {/* Server Icon */}
            <motion.div 
              className="w-14 h-14 rounded-xl bg-discord/10 flex items-center justify-center shrink-0"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {server.icon ? (
                <Image
                  src={iconUrl}
                  alt={server.name}
                  width={56}
                  height={56}
                  className="rounded-xl"
                />
              ) : (
                <ServerIcon className="w-7 h-7 text-discord" />
              )}
            </motion.div>

            {/* Server Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white mb-1 truncate group-hover:text-discord transition-colors">
                {server.name}
              </h3>
              {server.memberCount > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <UsersIcon className="w-4 h-4" />
                  <span>{server.memberCount.toLocaleString()} members</span>
                </div>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2 mb-4">
            <Badge variant={server.botPresent ? 'success' : 'default'} size="sm">
              {server.botPresent ? (
                <>
                  <CheckCircleIcon className="w-4 h-4" />
                  Bot Active
                </>
              ) : (
                <>
                  <XCircleIcon className="w-4 h-4" />
                  Bot Not Added
                </>
              )}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {server.botPresent ? (
              <Link href={`/dashboard/servers/${server.id}`} className="flex-1">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-2 bg-discord hover:bg-discord-dark text-white rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Cog6ToothIcon className="w-4 h-4" />
                  Manage Server
                  <ArrowRightIcon className="w-4 h-4" />
                </motion.button>
              </Link>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleInviteBot}
                disabled={isInviting}
                className="w-full px-4 py-2 bg-gradient-to-r from-discord to-purple-600 hover:from-discord-dark hover:to-purple-700 text-white rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isInviting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Adding...
                  </>
                ) : (
                  <>
                    <PlusIcon className="w-4 h-4" />
                    Add Bot to Server
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </MinimalCard>
    </motion.div>
  );
}
