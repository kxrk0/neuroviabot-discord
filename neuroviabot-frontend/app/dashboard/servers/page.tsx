'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import MinimalCard from '@/components/ui/MinimalCard';
import Loading from '@/components/ui/Loading';
import Badge from '@/components/ui/Badge';
import { getDiscordGuildIconUrl } from '@/lib/utils';
import {
  ServerIcon,
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

export default function ServersPage() {
  const { data: session, status } = useSession();
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login');
    }

    if (status === 'authenticated') {
      fetchServers();
    }
  }, [status]);

  const fetchServers = async () => {
    try {
      // Mock data for now (will connect to API later)
      const mockServers = [
        {
          id: '1',
          name: 'NeuroVia Community',
          icon: null,
          memberCount: 1234,
          botPresent: true,
          permissions: ['ADMINISTRATOR'],
        },
        {
          id: '2',
          name: 'Gaming Hub',
          icon: null,
          memberCount: 567,
          botPresent: true,
          permissions: ['MANAGE_GUILD'],
        },
        {
          id: '3',
          name: 'Developer Space',
          icon: null,
          memberCount: 89,
          botPresent: false,
          permissions: ['ADMINISTRATOR'],
        },
      ];
      
      setServers(mockServers);
    } catch (error) {
      console.error('Failed to fetch servers:', error);
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
                {servers.reduce((acc, s) => acc + s.memberCount, 0).toLocaleString()}
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Link href={`/dashboard/servers/${server.id}`}>
        <MinimalCard className="p-6 cursor-pointer group">
          <div className="flex items-start gap-4 mb-4">
            {/* Server Icon */}
            <div className="w-14 h-14 rounded-xl bg-discord/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
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
            </div>

            {/* Server Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white mb-1 truncate group-hover:text-discord transition-colors">
                {server.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <UsersIcon className="w-4 h-4" />
                <span>{server.memberCount.toLocaleString()} members</span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <Badge variant={server.botPresent ? 'success' : 'default'} size="sm">
              {server.botPresent ? (
                <>
                  <CheckCircleIcon className="w-4 h-4" />
                  Active
                </>
              ) : (
                <>
                  <XCircleIcon className="w-4 h-4" />
                  Inactive
                </>
              )}
            </Badge>

            <div className="text-discord opacity-0 group-hover:opacity-100 transition-opacity">
              <Cog6ToothIcon className="w-5 h-5" />
            </div>
          </div>
        </MinimalCard>
      </Link>
    </motion.div>
  );
}
