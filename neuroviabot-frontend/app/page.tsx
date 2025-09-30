'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { fetchBotStats } from '@/lib/api';
import UserDropdown from '@/components/auth/UserDropdown';
import {
  MusicalNoteIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  TicketIcon,
  GiftIcon,
  BoltIcon,
  SparklesIcon,
  ServerIcon,
  UsersIcon,
  CommandLineIcon,
} from '@heroicons/react/24/outline';

export default function Home() {
  const [stats, setStats] = useState({ guilds: 0, users: 0, commands: 43 });
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

  useEffect(() => {
    setMounted(true);
    fetchBotStats()
      .then(data => setStats(data))
      .catch(() => setStats({ guilds: 66, users: 59032, commands: 43 }));
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Fixed Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{
            y: [0, 100, 0],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{
            y: [0, -100, 0],
            x: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 backdrop-blur-2xl bg-slate-900/50 border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-purple-500/50"
              >
                <span className="text-white font-black text-xl">N</span>
              </motion.div>
              <div>
                <div className="text-white font-bold text-lg tracking-tight">
                  NeuroVia<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Bot</span>
                </div>
                <div className="text-xs text-gray-500">Advanced Discord Bot</div>
              </div>
            </Link>
            
            <div className="flex items-center gap-6">
              <Link
                href="#features"
                className="text-gray-400 hover:text-white transition-colors text-sm font-medium hidden md:block"
              >
                Features
              </Link>
              <Link
                href="#stats"
                className="text-gray-400 hover:text-white transition-colors text-sm font-medium hidden md:block"
              >
                Stats
              </Link>
              <Link
                href="/dashboard"
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
              >
                Dashboard
              </Link>
              <UserDropdown />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        <motion.div
          style={{ opacity, scale }}
          className="relative max-w-5xl mx-auto text-center z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-8"
            >
              <SparklesIcon className="w-5 h-5 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">Now with Real-time Dashboard</span>
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight"
          >
            Next-Gen<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
              Discord Bot
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Powerful moderation, immersive music, virtual economy, and real-time dashboard control
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-2 text-white font-semibold text-lg">
                  <BoltIcon className="w-6 h-6" />
                  Get Started
                  <motion.svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </motion.svg>
                </div>
              </motion.button>
            </Link>
            
            <a href="https://github.com/kxrk0/neuroviabot-discord" target="_blank" rel="noopener noreferrer">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all rounded-2xl text-white font-semibold text-lg"
              >
                View on GitHub
              </motion.button>
            </a>
          </motion.div>

          {/* Floating Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="grid grid-cols-3 gap-4 mt-20 max-w-2xl mx-auto"
          >
            <StatCard icon={<ServerIcon className="w-6 h-6" />} value={stats.guilds} label="Servers" />
            <StatCard icon={<UsersIcon className="w-6 h-6" />} value={stats.users} label="Users" />
            <StatCard icon={<CommandLineIcon className="w-6 h-6" />} value={stats.commands} label="Commands" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Powerful features designed for modern Discord communities
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<MusicalNoteIcon className="w-7 h-7" />}
              title="Premium Music"
              description="High-quality music from YouTube & Spotify with advanced queue management"
              gradient="from-pink-500 to-rose-500"
              delay={0}
            />
            <FeatureCard
              icon={<ShieldCheckIcon className="w-7 h-7" />}
              title="Smart Moderation"
              description="AI-powered auto-moderation with customizable rules and warnings"
              gradient="from-blue-500 to-cyan-500"
              delay={0.1}
            />
            <FeatureCard
              icon={<CurrencyDollarIcon className="w-7 h-7" />}
              title="Virtual Economy"
              description="Engaging economy system with casino games and custom shop"
              gradient="from-amber-500 to-orange-500"
              delay={0.2}
            />
            <FeatureCard
              icon={<ChartBarIcon className="w-7 h-7" />}
              title="Leveling System"
              description="Track user activity with XP, levels, and role rewards"
              gradient="from-green-500 to-emerald-500"
              delay={0.3}
            />
            <FeatureCard
              icon={<TicketIcon className="w-7 h-7" />}
              title="Support Tickets"
              description="Professional ticket system for community support"
              gradient="from-purple-500 to-violet-500"
              delay={0.4}
            />
            <FeatureCard
              icon={<GiftIcon className="w-7 h-7" />}
              title="Giveaways"
              description="Create and manage exciting giveaways with auto-selection"
              gradient="from-pink-500 to-purple-500"
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-3xl blur-3xl opacity-20" />
            <div className="relative bg-gradient-to-br from-slate-900/90 to-purple-900/50 backdrop-blur-2xl border border-white/10 rounded-3xl p-12">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Join thousands of communities using NeuroViaBot
              </p>
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl text-white font-bold text-xl shadow-2xl shadow-purple-500/50"
                >
                  Launch Dashboard
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-500">
            © 2025 NeuroViaBot. Made with ❤️ by the NeuroVia Team
          </p>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ icon, value, label }: any) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition duration-300" />
      <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="text-purple-400 mb-2">{icon}</div>
        <div className="text-3xl font-black text-white mb-1">
          {value > 1000 ? `${(value / 1000).toFixed(1)}K` : value}+
        </div>
        <div className="text-sm text-gray-400 font-medium">{label}</div>
      </div>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description, gradient, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -10 }}
      className="relative group"
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition duration-500`} />
      <div className="relative h-full bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition duration-500">
        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${gradient} text-white mb-6 shadow-lg`}>
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}