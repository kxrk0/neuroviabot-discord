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
  ChevronDownIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

export default function Home() {
  const [stats, setStats] = useState({ guilds: 0, users: 0, commands: 43 });
  const [mounted, setMounted] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchBotStats()
      .then(data => setStats(data))
      .catch(() => setStats({ guilds: 66, users: 59032, commands: 43 }));
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full relative overflow-hidden bg-[#23272A]">
      {/* Top Promotional Banner - MEE6 Style */}
      <div
        className="w-full relative overflow-hidden cursor-pointer flex items-center justify-center h-[54px] bg-gradient-to-r from-[#5865F2] to-[#7289DA]"
        style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="flex flex-row text-center gap-4 relative text-base items-center text-white">
          <div>
            <svg className="w-[16px] h-[26px]" fill="currentColor" viewBox="0 0 32 32">
              <path d="M8 4L4 8v16l4 4h16l4-4V8l-4-4H8z" />
            </svg>
          </div>
          <div className="font-normal text-base flex flex-row gap-1">
            <div className="font-bold">Join thousands of servers</div>
            <div>—</div>
            <div>
              <span className="font-bold">
                Get started with <span className="px-1 rounded font-bold text-white py-1 bg-[#ED4245]">NeuroViaBot</span> today
              </span>
            </div>
          </div>
          <div className="bg-white/10 hover:bg-white/20 text-white font-bold uppercase px-3 py-1 rounded-lg text-sm transition-all">
            Add Now
          </div>
          <div>
            <svg className="w-[16px] h-[26px]" fill="currentColor" viewBox="0 0 32 32">
              <path d="M24 4l4 4v16l-4 4H8l-4-4V8l4-4h16z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Header - MEE6 Exact Style */}
      <header className="!bg-[#151621] sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-4">
              <div className="flex items-center justify-center">
                {/* Discord-style Bot Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="none"
                  viewBox="0 0 40 40"
                >
                  <path fill="#60D1F6" d="M20 40c11.046 0 20-8.954 20-20S31.046 0 20 0 0 8.954 0 20s8.954 20 20 20z" />
                  <path
                    fill="#17181E"
                    fillRule="evenodd"
                    d="M13.636 25.394c1.85-.538 4.03-.848 6.365-.848 2.333 0 4.512.31 6.363.847-.472 3.123-3.141 5.516-6.364 5.516s-5.893-2.393-6.364-5.515z"
                    clipRule="evenodd"
                  />
                  <path
                    fill="#17181E"
                    d="M13.182 18.182a2.273 2.273 0 100-4.546 2.273 2.273 0 000 4.546zM26.818 18.182a2.273 2.273 0 100-4.546 2.273 2.273 0 000 4.546z"
                  />
                </svg>
                <svg width="84" height="21" className="ltr:ml-4 rtl:mr-4" viewBox="0 0 84 21" fill="none">
                  <text x="0" y="18" fill="#FFFFFF" fontSize="20" fontWeight="bold" fontFamily="system-ui">
                    NeuroViaBot
                  </text>
                </svg>
              </div>
            </Link>

            {/* Navigation */}
            <div className="flex items-center justify-end gap-5">
              {/* Language Selector */}
              <div className="relative">
                <div
                  className="flex items-center gap-2 cursor-pointer group"
                  onClick={() => setShowLangDropdown(!showLangDropdown)}
                  onMouseEnter={() => setShowLangDropdown(true)}
                  onMouseLeave={() => setShowLangDropdown(false)}
                >
                  <GlobeAltIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-200 transition-all duration-200" />
                  <span className="uppercase font-semibold text-gray-400 group-hover:text-gray-200 transition-all duration-200">
                    EN
                  </span>
                  <ChevronDownIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-200 transition-all duration-200" />
                </div>

                {/* Language Dropdown */}
                <div
                  className={`max-h-[400px] min-w-[170px] max-w-[200px] absolute left-0 z-10 w-full rounded-lg bg-[#1E1F2E] max-h-[320px] overflow-y-auto overflow-x-hidden transition-all duration-200 shadow-lg p-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 ${
                    showLangDropdown ? 'opacity-100 pointer-events-auto translate-y-2' : 'opacity-0 pointer-events-none translate-y-0'
                  }`}
                  onMouseEnter={() => setShowLangDropdown(true)}
                  onMouseLeave={() => setShowLangDropdown(false)}
                >
                  <div className="grid grid-cols-1 gap-1.5">
                    {[
                      { code: 'EN', name: 'English', flag: '🇺🇸' },
                      { code: 'TR', name: 'Türkçe', flag: '🇹🇷' },
                      { code: 'FR', name: 'Français', flag: '🇫🇷' },
                      { code: 'DE', name: 'Deutsch', flag: '🇩🇪' },
                      { code: 'ES', name: 'Español', flag: '🇪🇸' },
                    ].map((lang) => (
                      <div
                        key={lang.code}
                        className="flex items-center justify-start gap-3 hover:bg-[#2C2F33] transition-all duration-200 cursor-pointer rounded p-2 text-gray-300 hover:text-gray-100"
                      >
                        <span className="text-2xl">{lang.flag}</span>
                        <p className="text-sm font-medium">{lang.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dashboard Button */}
              <Link
                href="/dashboard"
                className="px-6 py-2.5 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg font-semibold transition-all text-sm"
              >
                Dashboard
              </Link>

              {/* User Dropdown */}
              <UserDropdown />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - MEE6 Style */}
      <section className="relative pt-20 pb-20 px-6 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#5865F2] rounded-full opacity-10 blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#5865F2] rounded-full opacity-10 blur-3xl animate-pulse" />
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
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#5865F2]/10 rounded-full mb-6 border border-[#5865F2]/20"
              >
                <SparklesIcon className="w-5 h-5 text-[#5865F2]" />
                <span className="text-[#5865F2] text-sm font-semibold">The most powerful Discord bot</span>
              </motion.div>

              <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
                Level up your
                <br />
                <span className="bg-gradient-to-r from-[#5865F2] to-[#7289DA] bg-clip-text text-transparent">
                  Discord server
                </span>
              </h1>

              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                Engage your community with powerful moderation, music, economy, and leveling features. Everything you need in one bot.
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
                    className="px-8 py-4 bg-[#2C2F33] hover:bg-[#36393F] text-white rounded-xl font-bold text-lg transition-all border border-white/5"
                  >
                    Learn More
                  </motion.button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="text-3xl font-black bg-gradient-to-r from-[#5865F2] to-[#7289DA] bg-clip-text text-transparent mb-1">
                    {stats.guilds > 1000 ? `${(stats.guilds / 1000).toFixed(1)}K` : stats.guilds}+
                  </div>
                  <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Servers</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-3xl font-black bg-gradient-to-r from-[#5865F2] to-[#7289DA] bg-clip-text text-transparent mb-1">
                    {stats.users > 1000 ? `${(stats.users / 1000).toFixed(1)}K` : stats.users}+
                  </div>
                  <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Users</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="text-3xl font-black bg-gradient-to-r from-[#5865F2] to-[#7289DA] bg-clip-text text-transparent mb-1">
                    {stats.commands}+
                  </div>
                  <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Commands</div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Visual - Discord Bot Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 1, 0],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-br from-[#5865F2] to-[#7289DA] rounded-3xl opacity-20 blur-3xl"
                />
                <div className="relative bg-[#2C2F33] rounded-3xl p-8 border border-white/5 backdrop-blur-sm">
                  <div className="space-y-4">
                    {[
                      { icon: MusicalNoteIcon, color: 'bg-pink-500' },
                      { icon: ShieldCheckIcon, color: 'bg-blue-500' },
                      { icon: CurrencyDollarIcon, color: 'bg-yellow-500' },
                      { icon: ChartBarIcon, color: 'bg-green-500' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-4 p-4 bg-[#36393F] rounded-xl hover:bg-[#40444B] transition-all cursor-pointer"
                      >
                        <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center`}>
                          <item.icon className="w-6 h-6 text-white" />
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

      {/* Used by Section - MEE6 Style */}
      <section className="py-16 px-6 bg-[#1E1F2E]">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white mb-12"
          >
            Trusted by <span className="text-[#5865F2]">thousands</span> of communities
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-50">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-32 h-16 bg-gray-700 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - MEE6 Style */}
      <section id="features" className="py-20 px-6">
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
              description="High-quality music from YouTube and Spotify with advanced queue controls and filters"
              color="from-pink-500 to-rose-500"
              delay={0.1}
            />
            <FeatureCard
              icon={<ShieldCheckIcon className="w-8 h-8" />}
              title="Moderation"
              description="Keep your server safe with auto-moderation, logging, and advanced admin tools"
              color="from-blue-500 to-cyan-500"
              delay={0.2}
            />
            <FeatureCard
              icon={<CurrencyDollarIcon className="w-8 h-8" />}
              title="Economy"
              description="Engage members with virtual currency, shops, and custom rewards system"
              color="from-yellow-500 to-orange-500"
              delay={0.3}
            />
            <FeatureCard
              icon={<ChartBarIcon className="w-8 h-8" />}
              title="Leveling"
              description="Reward active members with XP, levels, and automatic role rewards"
              color="from-green-500 to-emerald-500"
              delay={0.4}
            />
            <FeatureCard
              icon={<TicketIcon className="w-8 h-8" />}
              title="Ticket System"
              description="Professional support ticket system with categories and automatic logging"
              color="from-purple-500 to-violet-500"
              delay={0.5}
            />
            <FeatureCard
              icon={<GiftIcon className="w-8 h-8" />}
              title="Giveaways"
              description="Create and manage giveaways with automatic winner selection and notifications"
              color="from-red-500 to-pink-500"
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Premium/CTA Section */}
      <section id="premium" className="py-20 px-6 bg-[#1E1F2E]">
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
                Add to Discord Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer - MEE6 Style */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#5865F2] flex items-center justify-center">
                <span className="text-white font-black text-lg">N</span>
              </div>
              <span className="text-white font-bold text-lg">NeuroViaBot</span>
            </div>
            <div className="flex gap-8">
              <Link href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">
                Features
              </Link>
              <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">
                Dashboard
              </Link>
              <Link href="/login" className="text-gray-400 hover:text-white transition-colors text-sm">
                Login
              </Link>
              <a
                href="https://github.com/kxrk0/neuroviabot-discord"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                GitHub
              </a>
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              Copyright © 2018 - 2025 NeuroViaBot. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group"
    >
      <div className="h-full bg-[#2C2F33] rounded-2xl p-8 border border-white/5 hover:border-[#5865F2]/30 transition-all hover:shadow-xl hover:shadow-[#5865F2]/10">
        <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${color} text-white mb-6 shadow-lg`}>
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#5865F2] transition-colors">
          {title}
        </h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}