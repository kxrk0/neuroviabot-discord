'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchBotStats } from '@/lib/api';
import UserDropdown from '@/components/auth/UserDropdown';
import {
  MusicalNoteIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  TicketIcon,
  GiftIcon,
  SparklesIcon,
  BoltIcon,
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
    <div className="min-h-screen bg-[#23272A]">
      {/* Navbar - Discord Styled */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#2C2F33]/95 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-12 h-12 rounded-2xl bg-[#5865F2] flex items-center justify-center"
              >
                <span className="text-white font-black text-xl">N</span>
              </motion.div>
              <span className="text-white font-bold text-xl hidden sm:block">NeuroViaBot</span>
            </Link>

            {/* Nav Links */}
            <div className="flex items-center gap-8">
              <Link href="#features" className="text-gray-400 hover:text-white transition-colors text-sm font-medium hidden md:block">
                Features
              </Link>
              <Link href="#premium" className="text-gray-400 hover:text-white transition-colors text-sm font-medium hidden md:block">
                Premium
              </Link>
              <Link
                href="/dashboard"
                className="px-6 py-2.5 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg font-semibold transition-all"
              >
                Dashboard
              </Link>
              <UserDropdown />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - MEE6 Style */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#5865F2] rounded-full opacity-10 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#5865F2] rounded-full opacity-10 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#5865F2]/10 rounded-full mb-6"
              >
                <SparklesIcon className="w-5 h-5 text-[#5865F2]" />
                <span className="text-[#5865F2] text-sm font-semibold">The most powerful Discord bot</span>
              </motion.div>

              <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
                Level up your
                <br />
                <span className="text-[#5865F2]">Discord server</span>
              </h1>

              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                Engage your community with powerful moderation, music, economy, and leveling features.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-[#5865F2]/50 transition-all"
                  >
                    Add to Discord
                    <ArrowRightIcon className="w-5 h-5" />
                  </motion.button>
                </Link>
                <Link href="#features">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-[#2C2F33] hover:bg-[#36393F] text-white rounded-xl font-bold text-lg transition-all"
                  >
                    Learn More
                  </motion.button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12">
                <div>
                  <div className="text-3xl font-black text-white mb-1">
                    {stats.guilds > 1000 ? `${(stats.guilds / 1000).toFixed(1)}K` : stats.guilds}+
                  </div>
                  <div className="text-sm text-gray-500 font-medium">Servers</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-white mb-1">
                    {stats.users > 1000 ? `${(stats.users / 1000).toFixed(1)}K` : stats.users}+
                  </div>
                  <div className="text-sm text-gray-500 font-medium">Users</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-white mb-1">{stats.commands}+</div>
                  <div className="text-sm text-gray-500 font-medium">Commands</div>
                </div>
              </div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-br from-[#5865F2] to-[#7289DA] rounded-3xl opacity-20 blur-2xl"
                />
                <div className="relative bg-[#2C2F33] rounded-3xl p-8 border border-white/5">
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className="flex items-center gap-4 p-4 bg-[#36393F] rounded-xl"
                      >
                        <div className="w-12 h-12 rounded-full bg-[#5865F2] flex items-center justify-center">
                          <BoltIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="h-3 bg-gray-700 rounded w-3/4 mb-2" />
                          <div className="h-2 bg-gray-800 rounded w-1/2" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section - MEE6 Style */}
      <section id="features" className="py-20 px-6 bg-[#2C2F33]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Powerful features for your server
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to engage, moderate, and grow your Discord community
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<MusicalNoteIcon className="w-8 h-8" />}
              title="Music Player"
              description="High-quality music from YouTube and Spotify with advanced controls"
              color="bg-pink-500"
            />
            <FeatureCard
              icon={<ShieldCheckIcon className="w-8 h-8" />}
              title="Moderation"
              description="Keep your server safe with auto-moderation and advanced tools"
              color="bg-blue-500"
            />
            <FeatureCard
              icon={<CurrencyDollarIcon className="w-8 h-8" />}
              title="Economy"
              description="Engage members with virtual currency and custom rewards"
              color="bg-yellow-500"
            />
            <FeatureCard
              icon={<ChartBarIcon className="w-8 h-8" />}
              title="Leveling"
              description="Reward active members with XP, levels, and role rewards"
              color="bg-green-500"
            />
            <FeatureCard
              icon={<TicketIcon className="w-8 h-8" />}
              title="Ticket System"
              description="Professional support ticket system for your community"
              color="bg-purple-500"
            />
            <FeatureCard
              icon={<GiftIcon className="w-8 h-8" />}
              title="Giveaways"
              description="Create and manage giveaways with automatic winner selection"
              color="bg-red-500"
            />
          </div>
        </div>
      </section>

      {/* Premium Section */}
      <section id="premium" className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
              Ready to get started?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands of servers using NeuroViaBot to engage their communities
            </p>
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-5 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-bold text-xl shadow-2xl shadow-[#5865F2]/50 transition-all"
              >
                Add to Discord
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#5865F2] flex items-center justify-center">
                <span className="text-white font-black">N</span>
              </div>
              <span className="text-white font-bold text-lg">NeuroViaBot</span>
            </div>
            <div className="flex gap-8">
              <Link href="#features" className="text-gray-400 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                Dashboard
              </Link>
              <a href="https://github.com/kxrk0/neuroviabot-discord" className="text-gray-400 hover:text-white transition-colors">
                GitHub
              </a>
            </div>
            <p className="text-gray-500 text-sm">
              © 2025 NeuroViaBot. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <div className="h-full bg-[#23272A] rounded-2xl p-8 border border-white/5 hover:border-[#5865F2]/30 transition-all">
        <div className={`inline-flex p-4 rounded-xl ${color} text-white mb-6`}>
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}