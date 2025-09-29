'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Loading from '@/components/ui/Loading';
import Badge from '@/components/ui/Badge';
import { formatNumber } from '@/lib/utils';
import api from '@/lib/api';
import {
  ServerIcon,
  CommandLineIcon,
  UsersIcon,
  ClockIcon,
  SparklesIcon,
  ChartBarIcon,
  BoltIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login');
    }

    if (status === 'authenticated') {
      fetchStats();
    }
  }, [status]);

  const fetchStats = async () => {
    try {
      const data = await api.getBotStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      // Use default stats if API fails
      setStats({ guilds: 66, users: 59032, commands: 43, uptime: 86400000 });
    } finally {
      setLoading(false);
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <Loading size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  const user = session?.user as any;

  return (
    <div className="space-y-8 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-discord/10 rounded-full blur-[150px] animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-discord to-purple-600 rounded-2xl flex items-center justify-center shadow-lg animate-glow">
              <span className="text-white font-bold text-2xl">👋</span>
            </div>
          </motion.div>
          <div>
            <h1 className="text-4xl font-black text-white">
              Welcome back, <span className="bg-gradient-to-r from-discord to-purple-400 bg-clip-text text-transparent">{user?.username}</span>!
            </h1>
            <p className="text-gray-400 text-lg mt-1">
              Here's what's happening with your bot today
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Servers"
          value={stats?.guilds || 0}
          icon={<ServerIcon className="w-6 h-6" />}
          gradient="from-blue-500 to-cyan-500"
          delay={0}
        />
        <StatCard
          title="Total Users"
          value={stats?.users || 0}
          icon={<UsersIcon className="w-6 h-6" />}
          gradient="from-green-500 to-emerald-500"
          delay={0.1}
        />
        <StatCard
          title="Commands"
          value={stats?.commands || 0}
          icon={<CommandLineIcon className="w-6 h-6" />}
          gradient="from-purple-500 to-pink-500"
          delay={0.2}
        />
        <StatCard
          title="Uptime"
          value={formatUptime(stats?.uptime || 0)}
          icon={<ClockIcon className="w-6 h-6" />}
          gradient="from-orange-500 to-red-500"
          delay={0.3}
        />
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card hover className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-discord/5 rounded-full blur-3xl"></div>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BoltIcon className="w-6 h-6 text-discord" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest events from your servers
                </CardDescription>
              </div>
              <Badge variant="info">Live</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <ActivityItem
                type="command"
                message="User123 used /play in Server ABC"
                time="2 minutes ago"
                delay={0}
              />
              <ActivityItem
                type="server"
                message="Bot added to Server XYZ"
                time="15 minutes ago"
                delay={0.1}
              />
              <ActivityItem
                type="member"
                message="5 new members joined across 3 servers"
                time="1 hour ago"
                delay={0.2}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card hover className="relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl"></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SparklesIcon className="w-6 h-6 text-purple-400" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <QuickActionButton
                label="Manage Servers"
                href="/dashboard/servers"
                icon={<ServerIcon className="w-8 h-8" />}
                gradient="from-blue-500 to-cyan-500"
                delay={0}
              />
              <QuickActionButton
                label="Analytics"
                href="/dashboard/analytics"
                icon={<ChartBarIcon className="w-8 h-8" />}
                gradient="from-green-500 to-emerald-500"
                delay={0.1}
              />
              <QuickActionButton
                label="Real-Time"
                href="/dashboard/realtime"
                icon={<BoltIcon className="w-8 h-8" />}
                gradient="from-purple-500 to-pink-500"
                delay={0.2}
              />
              <QuickActionButton
                label="Settings"
                href="/dashboard/settings"
                icon={<Cog6ToothIcon className="w-8 h-8" />}
                gradient="from-orange-500 to-red-500"
                delay={0.3}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// Helper Components
function StatCard({ title, value, icon, gradient, delay }: any) {
  const getEmoji = () => {
    if (title === 'Servers') return '🖥️';
    if (title === 'Total Users') return '👥';
    if (title === 'Commands') return '⚡';
    if (title === 'Uptime') return '⏱️';
    return '📊';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="relative group"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-all duration-500`}></div>
      <Card className="relative h-full transition-all duration-300 group-hover:border-gray-600">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 bg-gradient-to-br ${gradient} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
              {icon}
            </div>
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="text-3xl"
            >
              {getEmoji()}
            </motion.div>
          </div>
          <p className="text-gray-400 text-sm font-medium mb-2">{title}</p>
          <p className="text-4xl font-black text-white">
            {typeof value === 'number' ? formatNumber(value) : value}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}

function ActivityItem({ type, message, time, delay }: any) {
  const badges: Record<string, any> = {
    command: { variant: 'info', label: 'Command', emoji: '⚡' },
    server: { variant: 'success', label: 'Server', emoji: '🖥️' },
    member: { variant: 'warning', label: 'Member', emoji: '👤' },
  };

  const badge = badges[type] || badges.command;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02, x: 5 }}
      className="flex items-start gap-4 p-4 rounded-xl bg-gray-900/30 hover:bg-gray-900/50 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300 group"
    >
      <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
        {badge.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant={badge.variant} size="sm">
            {badge.label}
          </Badge>
          <span className="text-xs text-gray-500">{time}</span>
        </div>
        <p className="text-white text-sm font-medium">{message}</p>
      </div>
    </motion.div>
  );
}

function QuickActionButton({ label, href, icon, gradient, delay }: any) {
  return (
    <motion.a
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      whileHover={{ scale: 1.05, y: -5 }}
      href={href}
      className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-gray-900/30 hover:bg-gray-900/50 border border-gray-800/50 hover:border-gray-700 transition-all duration-300"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
      <div className={`relative mb-3 p-3 bg-gradient-to-br ${gradient} rounded-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
        {icon}
      </div>
      <span className="relative text-sm font-medium text-gray-400 group-hover:text-white transition-colors duration-300 text-center">
        {label}
      </span>
    </motion.a>
  );
}

function formatUptime(ms: number): string {
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h`;
  return '< 1h';
}