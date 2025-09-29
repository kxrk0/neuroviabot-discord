'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { redirect, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import MinimalCard from '@/components/ui/MinimalCard';
import Loading from '@/components/ui/Loading';
import Badge from '@/components/ui/Badge';
import Switch from '@/components/ui/Switch';
import Button from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import {
  ServerIcon,
  UsersIcon,
  MusicalNoteIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

export default function ServerDetailPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const serverId = params.id as string;
  const { showToast } = useToast();
  
  const [server, setServer] = useState<any>(null);
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login');
    }

    if (status === 'authenticated') {
      fetchServerDetails();
    }
  }, [status, serverId]);

  const fetchServerDetails = async () => {
    try {
      // Mock data for now
      const mockServer = {
        id: serverId,
        name: 'NeuroVia Community',
        icon: null,
        memberCount: 1234,
        onlineCount: 567,
        botPresent: true,
      };

      const mockSettings = {
        musicEnabled: true,
        moderationEnabled: true,
        economyEnabled: true,
        levelingEnabled: true,
        welcomeEnabled: false,
        prefix: '!',
      };

      setServer(mockServer);
      setSettings(mockSettings);
    } catch (error) {
      console.error('Failed to fetch server details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: Save to API
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast('Settings saved successfully!', 'success');
    } catch (error) {
      showToast('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <Loading size="lg" text="Loading server details..." />
      </div>
    );
  }

  if (!server) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-4">Server Not Found</h2>
        <Link href="/dashboard/servers">
          <Button variant="primary">Back to Servers</Button>
        </Link>
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
        <Link
          href="/dashboard/servers"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Servers
        </Link>

        <div className="flex items-center gap-4 mb-2">
          <div className="w-16 h-16 rounded-2xl bg-discord/10 flex items-center justify-center">
            <ServerIcon className="w-8 h-8 text-discord" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white">{server.name}</h1>
            <div className="flex items-center gap-4 text-gray-400 mt-1">
              <span className="flex items-center gap-1">
                <UsersIcon className="w-4 h-4" />
                {server.memberCount.toLocaleString()} members
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                {server.onlineCount.toLocaleString()} online
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<MusicalNoteIcon className="w-5 h-5" />} label="Music" value="Active" />
        <StatCard icon={<ShieldCheckIcon className="w-5 h-5" />} label="Moderation" value="12 cases" />
        <StatCard icon={<CurrencyDollarIcon className="w-5 h-5" />} label="Economy" value="$45.2K" />
        <StatCard icon={<ChartBarIcon className="w-5 h-5" />} label="Leveling" value="234 users" />
      </div>

      {/* Settings */}
      <MinimalCard className="p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Server Settings</h2>

        <div className="space-y-6">
          <SettingRow
            label="Music System"
            description="Enable music playback from YouTube and Spotify"
            checked={settings.musicEnabled}
            onChange={(e: any) => handleSettingChange('musicEnabled', e.target.checked)}
          />

          <SettingRow
            label="Moderation"
            description="Auto-moderation and warning system"
            checked={settings.moderationEnabled}
            onChange={(e: any) => handleSettingChange('moderationEnabled', e.target.checked)}
          />

          <SettingRow
            label="Economy"
            description="Virtual currency and casino games"
            checked={settings.economyEnabled}
            onChange={(e: any) => handleSettingChange('economyEnabled', e.target.checked)}
          />

          <SettingRow
            label="Leveling"
            description="XP system with role rewards"
            checked={settings.levelingEnabled}
            onChange={(e: any) => handleSettingChange('levelingEnabled', e.target.checked)}
          />

          <SettingRow
            label="Welcome Messages"
            description="Greet new members automatically"
            checked={settings.welcomeEnabled}
            onChange={(e: any) => handleSettingChange('welcomeEnabled', e.target.checked)}
          />

          <div className="pt-6 border-t border-white/10">
            <Button
              variant="primary"
              onClick={handleSave}
              isLoading={saving}
              className="px-8"
            >
              Save Settings
            </Button>
          </div>
        </div>
      </MinimalCard>
    </div>
  );
}

function StatCard({ icon, label, value }: any) {
  return (
    <MinimalCard hover={false} className="p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-discord/10 text-discord">
          {icon}
        </div>
      </div>
      <div className="text-lg font-bold text-white">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </MinimalCard>
  );
}

function SettingRow({ label, description, checked, onChange }: any) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
      <div className="flex-1">
        <h3 className="text-white font-semibold mb-1">{label}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <Switch checked={checked} onChange={onChange} />
    </div>
  );
}
