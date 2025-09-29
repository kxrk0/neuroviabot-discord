'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ShimmerButton from '@/components/ui/ShimmerButton';
import MinimalCard from '@/components/ui/MinimalCard';
import {
  MusicalNoteIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  TicketIcon,
  GiftIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

export default function Home() {
  const [stats, setStats] = useState({ guilds: 66, users: 59032, commands: 43 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fetch bot stats (skip if API URL not configured)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl && apiUrl !== 'undefined') {
      fetch(`${apiUrl}/api/bot/stats`)
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(err => console.error('Failed to fetch stats:', err));
    }
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Minimal Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(88,101,242,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative border-b border-white/5 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-discord flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="text-white font-semibold text-lg">NeuroViaBot</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">
                Dashboard
              </Link>
              <ShimmerButton href="/dashboard" className="text-sm">
                Get Started
              </ShimmerButton>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-6 py-32">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-7xl md:text-8xl font-black text-white mb-6 leading-tight">
              Your Discord Bot
              <br />
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-discord via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Reimagined
                </span>
                <motion.div
                  className="absolute -inset-2 bg-gradient-to-r from-discord/20 via-purple-500/20 to-pink-500/20 blur-2xl"
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Music • Economy • Moderation • Leveling • And More
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <ShimmerButton href="/dashboard" className="px-8 py-4 text-base">
                Launch Dashboard
                <ArrowRightIcon className="w-5 h-5" />
              </ShimmerButton>
              
              <ShimmerButton 
                href="https://github.com/kxrk0/neuroviabot-discord" 
                variant="secondary"
                className="px-8 py-4 text-base"
              >
                View on GitHub
              </ShimmerButton>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-8 mt-24"
          >
            <StatCard value={stats.guilds} label="Servers" />
            <StatCard value={stats.users} label="Users" />
            <StatCard value={stats.commands} label="Commands" />
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-black text-white mb-4">Everything You Need</h2>
          <p className="text-gray-400">Powerful features in a minimal package</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<MusicalNoteIcon className="w-6 h-6" />}
            title="Music"
            description="YouTube & Spotify with queue management"
          />
          <FeatureCard
            icon={<CurrencyDollarIcon className="w-6 h-6" />}
            title="Economy"
            description="Virtual currency and casino games"
          />
          <FeatureCard
            icon={<ShieldCheckIcon className="w-6 h-6" />}
            title="Moderation"
            description="Auto-mod and ban management"
          />
          <FeatureCard
            icon={<ChartBarIcon className="w-6 h-6" />}
            title="Leveling"
            description="XP tracking with role rewards"
          />
          <FeatureCard
            icon={<TicketIcon className="w-6 h-6" />}
            title="Tickets"
            description="Support ticket system"
          />
          <FeatureCard
            icon={<GiftIcon className="w-6 h-6" />}
            title="Giveaways"
            description="Timed giveaways with winners"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-white/5 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-500">© 2025 NeuroViaBot. Made with ❤️</p>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ value, label }: any) {
  return (
    <MinimalCard hover={false} className="text-center">
      <div className="text-4xl font-black text-white mb-2">
        {typeof value === 'number' && value > 1000 
          ? `${(value / 1000).toFixed(1)}K` 
          : value}+
      </div>
      <div className="text-sm text-gray-400 font-medium">{label}</div>
    </MinimalCard>
  );
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <MinimalCard gradient>
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-discord/10 text-discord shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
    </MinimalCard>
  );
}