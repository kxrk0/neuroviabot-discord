'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
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
    } finally {
      setLoading(false);
    }
  };
  
  if (loading || status === 'loading') {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <Loading size="lg" text="Loading dashboard..." />
      </div>
    );
  }
  
  const user = session?.user as any;
  
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.username}! 👋
        </h1>
        <p className="text-gray-400">
          Here's what's happening with your bot today
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Servers"
          value={stats?.guilds || 0}
          icon={<ServerIcon className="w-6 h-6" />}
          variant="success"
        />
        <StatCard
          title="Total Users"
          value={stats?.users || 0}
          icon={<UsersIcon className="w-6 h-6" />}
          variant="info"
        />
        <StatCard
          title="Commands"
          value={stats?.commands || 0}
          icon={<CommandLineIcon className="w-6 h-6" />}
          variant="warning"
        />
        <StatCard
          title="Uptime"
          value={formatUptime(stats?.uptime || 0)}
          icon={<ClockIcon className="w-6 h-6" />}
          variant="default"
        />
      </div>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest events from your servers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <ActivityItem
              type="command"
              message="User123 used /play in Server ABC"
              time="2 minutes ago"
            />
            <ActivityItem
              type="server"
              message="Bot added to Server XYZ"
              time="15 minutes ago"
            />
            <ActivityItem
              type="member"
              message="5 new members joined across 3 servers"
              time="1 hour ago"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionButton
              label="Manage Servers"
              href="/dashboard/servers"
              icon="🖥️"
            />
            <QuickActionButton
              label="View Analytics"
              href="/dashboard/analytics"
              icon="📊"
            />
            <QuickActionButton
              label="Real-Time"
              href="/dashboard/realtime"
              icon="⚡"
            />
            <QuickActionButton
              label="Settings"
              href="/dashboard/settings"
              icon="⚙️"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper Components
function StatCard({ title, value, icon, variant }: any) {
  return (
    <Card hover padding="md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-3xl font-bold text-white mt-1">
            {typeof value === 'number' ? formatNumber(value) : value}
          </p>
        </div>
        <div className={`p-3 rounded-lg bg-${variant === 'success' ? 'green' : variant === 'info' ? 'blue' : variant === 'warning' ? 'yellow' : 'gray'}-600/20 text-${variant === 'success' ? 'green' : variant === 'info' ? 'blue' : variant === 'warning' ? 'yellow' : 'gray'}-400`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

function ActivityItem({ type, message, time }: any) {
  const badges: Record<string, any> = {
    command: { variant: 'info', label: 'Command' },
    server: { variant: 'success', label: 'Server' },
    member: { variant: 'warning', label: 'Member' },
  };
  
  const badge = badges[type] || badges.command;
  
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-900/50 hover:bg-gray-900 transition">
      <Badge variant={badge.variant} size="sm">
        {badge.label}
      </Badge>
      <div className="flex-1">
        <p className="text-white text-sm">{message}</p>
        <p className="text-gray-500 text-xs mt-0.5">{time}</p>
      </div>
    </div>
  );
}

function QuickActionButton({ label, href, icon }: any) {
  return (
    <a
      href={href}
      className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-900/50 hover:bg-gray-900 hover:border-discord border border-gray-800 transition group"
    >
      <span className="text-3xl mb-2">{icon}</span>
      <span className="text-sm text-gray-400 group-hover:text-white transition">
        {label}
      </span>
    </a>
  );
}

function formatUptime(ms: number): string {
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h`;
  return '< 1h';
}
