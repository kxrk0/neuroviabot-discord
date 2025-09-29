'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MusicalNoteIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  TicketIcon,
  GiftIcon,
  SparklesIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

export default function Home() {
  const [stats, setStats] = useState({ guilds: 66, users: 59032, commands: 43 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fetch bot stats
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bot/stats`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Failed to fetch stats:', err));
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-discord/20 rounded-full blur-[100px] animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] animate-pulse-slow"></div>
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative border-b border-gray-800/50 bg-gray-900/30 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 bg-gradient-to-br from-discord to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-discord/50"
              >
                <span className="text-white font-bold text-xl">N</span>
              </motion.div>
              <span className="text-white font-bold text-2xl bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                NeuroViaBot
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <Link
                href="/dashboard"
                className="hidden sm:block text-gray-300 hover:text-white transition-colors duration-300 font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/docs"
                className="hidden sm:block text-gray-300 hover:text-white transition-colors duration-300 font-medium"
              >
                Documentation
              </Link>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/dashboard"
                className="px-6 py-2.5 bg-gradient-to-r from-discord to-purple-600 hover:from-discord-dark hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg shadow-discord/30 transition-all duration-300"
              >
                Get Started
              </motion.a>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-discord/10 border border-discord/30 rounded-full mb-8"
          >
            <SparklesIcon className="w-5 h-5 text-discord" />
            <span className="text-discord font-medium">Advanced Discord Bot Platform</span>
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-black text-white mb-8 leading-tight"
          >
            <span className="bg-gradient-to-r from-white via-discord-light to-purple-400 bg-clip-text text-transparent animate-glow">
              NeuroViaBot
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl md:text-3xl text-gray-300 mb-6 font-light"
          >
            The Ultimate Multi-Purpose Discord Bot
          </motion.p>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Music 🎵 • Economy 💰 • Moderation 🛡️ • Leveling 📊 • Tickets 🎫 • Giveaways 🎉
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <motion.a
              whileHover={{ scale: 1.05, boxShadow: '0 20px 60px rgba(88, 101, 242, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              href="/dashboard"
              className="group px-10 py-5 bg-gradient-to-r from-discord to-purple-600 hover:from-discord-dark hover:to-purple-700 text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl shadow-discord/40 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <RocketLaunchIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                Launch Dashboard
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://github.com/kxrk0/neuroviabot-discord"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 bg-gray-800/50 hover:bg-gray-800 border-2 border-gray-700 hover:border-gray-600 text-white rounded-2xl font-bold text-lg transition-all duration-300 backdrop-blur-sm"
            >
              View on GitHub
            </motion.a>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24"
        >
          <StatCard
            value={stats.guilds}
            label="Active Servers"
            icon="🖥️"
            delay={0}
          />
          <StatCard
            value={stats.users}
            label="Happy Users"
            icon="👥"
            delay={0.1}
          />
          <StatCard
            value={stats.commands}
            label="Commands"
            icon="⚡"
            delay={0.2}
          />
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-black text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-400">
            Everything you need in one amazing bot
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<MusicalNoteIcon className="w-8 h-8" />}
            title="Music System"
            description="YouTube & Spotify support with advanced queue management and filters"
            color="from-purple-500 to-pink-500"
            delay={0}
          />
          <FeatureCard
            icon={<CurrencyDollarIcon className="w-8 h-8" />}
            title="Economy"
            description="Virtual currency, daily rewards, and exciting casino games"
            color="from-green-500 to-emerald-500"
            delay={0.1}
          />
          <FeatureCard
            icon={<ShieldCheckIcon className="w-8 h-8" />}
            title="Moderation"
            description="Auto-moderation, warnings, and comprehensive ban management"
            color="from-red-500 to-orange-500"
            delay={0.2}
          />
          <FeatureCard
            icon={<ChartBarIcon className="w-8 h-8" />}
            title="Leveling System"
            description="XP tracking with customizable role rewards and leaderboards"
            color="from-blue-500 to-cyan-500"
            delay={0.3}
          />
          <FeatureCard
            icon={<TicketIcon className="w-8 h-8" />}
            title="Ticket System"
            description="Professional support ticket system with custom categories"
            color="from-yellow-500 to-amber-500"
            delay={0.4}
          />
          <FeatureCard
            icon={<GiftIcon className="w-8 h-8" />}
            title="Giveaways"
            description="Time-based giveaways with automatic winner selection"
            color="from-indigo-500 to-purple-500"
            delay={0.5}
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-r from-discord/20 to-purple-600/20 backdrop-blur-xl border border-discord/30 rounded-3xl p-12 md:p-16 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-discord/10 to-purple-600/10 animate-shimmer"></div>
          <h2 className="relative text-4xl md:text-5xl font-black text-white mb-6">
            Ready to Transform Your Server?
          </h2>
          <p className="relative text-xl text-gray-300 mb-8">
            Join thousands of servers using NeuroViaBot today
          </p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/dashboard"
            className="relative inline-block px-12 py-5 bg-gradient-to-r from-discord to-purple-600 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-discord/50 transition-all duration-300"
          >
            Get Started Now
          </motion.a>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-gray-800/50 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p className="text-lg">© 2025 NeuroViaBot. All rights reserved.</p>
          <p className="mt-2">Made with ❤️ by the NeuroVia Team</p>
        </div>
      </footer>
    </div>
  );
}

// Helper Components
function StatCard({ value, label, icon, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-discord/20 to-purple-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
      <div className="relative bg-gray-900/50 backdrop-blur-xl border border-gray-800 hover:border-discord/50 rounded-2xl p-8 text-center transition-all duration-300">
        <div className="text-6xl mb-4 animate-float">{icon}</div>
        <div className="text-5xl font-black bg-gradient-to-r from-discord to-purple-400 bg-clip-text text-transparent mb-2">
          {typeof value === 'number' && value > 1000 ? `${(value / 1000).toFixed(1)}K` : value}+
        </div>
        <div className="text-gray-400 font-medium">{label}</div>
      </div>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description, color, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, y: -10 }}
      className="group relative"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-20 rounded-3xl blur-xl transition-all duration-500`}></div>
      <div className="relative bg-gray-900/50 backdrop-blur-xl border border-gray-800 group-hover:border-gray-700 rounded-3xl p-8 transition-all duration-500 h-full">
        <div className={`inline-flex p-4 bg-gradient-to-br ${color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-500`}>
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-discord transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}