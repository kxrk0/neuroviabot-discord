'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchBotStats } from '@/lib/api';
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
  const [stats, setStats] = useState({ guilds: 0, users: 0, commands: 43 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchBotStats()
      .then(data => setStats(data))
      .catch(() => setStats({ guilds: 66, users: 59032, commands: 43 }));
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#313338]">
      {/* Header - Discord Style */}
      <header className="bg-[#1E1F22] border-b border-[#26272B]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-[#5865F2] flex items-center justify-center transition-all group-hover:rounded-xl">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </div>
              <span className="text-white font-bold text-xl">NeuroViaBot</span>
            </Link>

            {/* Nav Links */}
            <nav className="flex items-center gap-6">
              <Link 
                href="/dashboard" 
                className="px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-md font-medium transition-colors text-sm"
              >
                Open Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - Discord Style */}
      <section className="relative px-6 py-20 overflow-hidden">
        {/* Subtle Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#5865F2]/5 to-transparent pointer-events-none" />
        
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#5865F2]/10 rounded-full mb-8 border border-[#5865F2]/20"
            >
              <div className="w-2 h-2 rounded-full bg-[#5865F2] animate-pulse" />
              <span className="text-[#949BA4] text-sm font-medium">POWERING {stats.guilds}+ DISCORD SERVERS</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight"
            >
              Your all-in-one
              <br />
              Discord bot
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-[#B5BAC1] mb-10 leading-relaxed max-w-2xl mx-auto"
            >
              Add music, moderation, economy, leveling and more to your Discord server with just one bot.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/dashboard"
                className="group px-8 py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-md font-semibold transition-all flex items-center justify-center gap-2"
              >
                Add to Discord
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#features"
                className="px-8 py-4 bg-[#2B2D31] hover:bg-[#35373C] text-white rounded-md font-semibold transition-all"
              >
                View Features
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  {stats.guilds > 1000 ? `${(stats.guilds / 1000).toFixed(1)}K` : stats.guilds}+
                </div>
                <div className="text-sm text-[#949BA4] font-medium uppercase tracking-wide">Servers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  {stats.users > 1000 ? `${(stats.users / 1000).toFixed(1)}K` : stats.users}+
                </div>
                <div className="text-sm text-[#949BA4] font-medium uppercase tracking-wide">Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">{stats.commands}+</div>
                <div className="text-sm text-[#949BA4] font-medium uppercase tracking-wide">Commands</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section - Discord Style */}
      <section id="features" className="py-20 px-6 bg-[#2B2D31]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Everything you need
            </h2>
            <p className="text-xl text-[#B5BAC1] max-w-2xl mx-auto">
              Powerful features to engage, moderate, and grow your community
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<MusicalNoteIcon className="w-6 h-6" />}
              title="Music Player"
              description="Play high-quality music from YouTube and Spotify with advanced queue management"
            />
            <FeatureCard
              icon={<ShieldCheckIcon className="w-6 h-6" />}
              title="Moderation"
              description="Keep your server safe with auto-moderation and comprehensive admin tools"
            />
            <FeatureCard
              icon={<CurrencyDollarIcon className="w-6 h-6" />}
              title="Economy System"
              description="Engage members with virtual currency, shops, and custom rewards"
            />
            <FeatureCard
              icon={<ChartBarIcon className="w-6 h-6" />}
              title="Leveling System"
              description="Reward active members with XP, levels, and automatic role rewards"
            />
            <FeatureCard
              icon={<TicketIcon className="w-6 h-6" />}
              title="Support Tickets"
              description="Professional ticket system with categories and automatic logging"
            />
            <FeatureCard
              icon={<GiftIcon className="w-6 h-6" />}
              title="Giveaways"
              description="Create and manage giveaways with automatic winner selection"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Ready to level up your server?
          </h2>
          <p className="text-xl text-[#B5BAC1] mb-8">
            Join thousands of servers already using NeuroViaBot
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-10 py-5 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-md font-bold text-lg transition-all"
          >
            Add to Discord
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer - Discord Style */}
      <footer className="py-12 px-6 border-t border-[#26272B] bg-[#1E1F22]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#5865F2] flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </div>
              <span className="text-white font-bold text-lg">NeuroViaBot</span>
            </div>

            {/* Links */}
            <div className="flex gap-8">
              <Link href="#features" className="text-[#949BA4] hover:text-white transition-colors text-sm">
                Features
              </Link>
              <Link href="/dashboard" className="text-[#949BA4] hover:text-white transition-colors text-sm">
                Dashboard
              </Link>
              <a
                href="https://github.com/kxrk0/neuroviabot-discord"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#949BA4] hover:text-white transition-colors text-sm"
              >
                GitHub
              </a>
            </div>

            {/* Copyright */}
            <p className="text-[#949BA4] text-sm">
              © 2025 NeuroViaBot
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <div className="h-full bg-[#313338] hover:bg-[#383A40] rounded-lg p-6 transition-all border border-[#26272B] hover:border-[#5865F2]/30">
        <div className="inline-flex p-3 rounded-lg bg-[#5865F2]/10 text-[#5865F2] mb-4 group-hover:bg-[#5865F2]/20 transition-colors">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-[#B5BAC1] leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}