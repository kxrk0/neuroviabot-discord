'use client';

import React from 'react';
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
  SparklesIcon,
  BoltIcon,
  RocketLaunchIcon,
  CommandLineIcon,
  UserGroupIcon,
  ServerIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

export default function Home() {
  const [stats, setStats] = useState({ guilds: 66, users: 59032, commands: 43 });
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchBotStats()
      .then(data => setStats(data))
      .catch(() => setStats({ guilds: 66, users: 59032, commands: 43 }));
  }, []);

  const t = {
    tr: {
      title: 'Discord için en iyi hepsi bir arada bot',
      description: 'NeuroViaBot, dünya çapında binlerce Discord sunucusunun topluluklarını yönetmek, eğlendirmek ve büyütmek için güvendiği kullanımı kolay, eksiksiz bir Discord botudur.',
      addToDiscord: "Discord'a Ekle",
      seeFeatures: 'Özellikleri gör',
      features: 'Özellikler',
      resources: 'Kaynaklar',
      premium: 'Premium',
      login: 'Giriş Yap',
      whatCanYouDo: 'Neler Yapabilirsin?',
      whatCanYouDoDesc: 'Sunucunu yönetmek ve eğlenceli hale getirmek için her şey burada',
    },
    en: {
      title: 'The best all-in-one bot for Discord',
      description: 'NeuroViaBot is the easy-to-use, complete Discord bot that thousands of Discord servers worldwide trust to manage, entertain, and grow their communities.',
      addToDiscord: 'Add to Discord',
      seeFeatures: 'See Features',
      features: 'Features',
      resources: 'Resources',
      premium: 'Premium',
      login: 'Login',
      whatCanYouDo: 'What Can You Do?',
      whatCanYouDoDesc: 'Everything you need to manage and make your server fun',
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0F14] via-[#1A1B23] to-[#0F0F14] relative overflow-hidden">
      {/* Animated Background - Fixed */}
      <div className="fixed inset-0 z-0">
        {/* Gradient Orbs with stagger animation */}
        <motion.div 
          className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            scale: [1, 1.4, 1],
            x: [0, 30, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
        
        {/* Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(88, 101, 242, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(88, 101, 242, 0.02) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black 40%, transparent 100%)'
        }}></div>
      </div>

      {/* Enhanced Modern Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#13151f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1240px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div 
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg"
              >
                <motion.svg 
                  className="w-6 h-6 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </motion.svg>
              </motion.div>
              <motion.span 
                className="text-xl font-black"
                initial={{ backgroundPosition: "0% 50%" }}
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                style={{
                  background: "linear-gradient(90deg, #fff 0%, #a855f7 25%, #3b82f6 50%, #a855f7 75%, #fff 100%)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
                Neurovia
              </motion.span>
            </Link>

            {/* Center Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Features Dropdown - Ultra Modern */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setFeaturesOpen(!featuresOpen);
                    setResourcesOpen(false);
                    setLanguageOpen(false);
                  }}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                  {t[language].features}
                  <ChevronDownIcon className={`w-4 h-4 transition-transform ${featuresOpen ? 'rotate-180' : ''}`} />
                </button>
                {featuresOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setFeaturesOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-[750px] bg-[#13151f]/98 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl z-50 overflow-hidden"
                    >
                      {/* Animated Gradient Border */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
                      
                      <div className="relative p-5">
                        <div className="grid grid-cols-2 gap-3">
                          {/* Left Column */}
                          <div className="space-y-2">
                            <motion.a 
                              href="#features" 
                              onClick={() => setFeaturesOpen(false)} 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.05 }}
                              whileHover={{ x: 4, scale: 1.02 }}
                              className="relative group flex items-start gap-4 px-4 py-4 text-gray-300 hover:text-white bg-white/0 hover:bg-gradient-to-br hover:from-purple-500/10 hover:to-blue-500/10 rounded-2xl transition-all duration-300 border border-transparent hover:border-purple-500/30 overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 transition-all duration-500" />
                              <motion.div 
                                whileHover={{ rotate: 5, scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-purple-500/50"
                              >
                                <ShieldCheckIcon className="w-6 h-6 text-purple-400" />
                              </motion.div>
                              <div className="relative flex-1">
                                <div className="font-bold text-base mb-1.5 flex items-center gap-2">
                                  Moderasyon & Sunucu
                                  <span className="text-[9px] px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full font-semibold">Popüler</span>
                                </div>
                                <div className="text-xs text-gray-400 leading-relaxed">Karşılama, Özel Komutlar, Tepki Rol, Auto-Mod...</div>
                              </div>
                            </motion.a>

                            <motion.a 
                              href="#features" 
                              onClick={() => setFeaturesOpen(false)} 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 }}
                              whileHover={{ x: 4, scale: 1.02 }}
                              className="relative group flex items-start gap-4 px-4 py-4 text-gray-300 hover:text-white bg-white/0 hover:bg-gradient-to-br hover:from-blue-500/10 hover:to-cyan-500/10 rounded-2xl transition-all duration-300 border border-transparent hover:border-blue-500/30 overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 transition-all duration-500" />
                              <motion.div 
                                whileHover={{ rotate: -5, scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-blue-500/50"
                              >
                                <CommandLineIcon className="w-6 h-6 text-blue-400" />
                              </motion.div>
                              <div className="relative flex-1">
                                <div className="font-bold text-base mb-1.5">Araçlar & Utilities</div>
                                <div className="text-xs text-gray-400 leading-relaxed">Embed Builder, Arama, Timer, Stats, Logs...</div>
                              </div>
                            </motion.a>

                            <motion.a 
                              href="#features" 
                              onClick={() => setFeaturesOpen(false)} 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.15 }}
                              whileHover={{ x: 4, scale: 1.02 }}
                              className="relative group flex items-start gap-4 px-4 py-4 text-gray-300 hover:text-white bg-white/0 hover:bg-gradient-to-br hover:from-pink-500/10 hover:to-rose-500/10 rounded-2xl transition-all duration-300 border border-transparent hover:border-pink-500/30 overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-rose-500/0 group-hover:from-pink-500/5 group-hover:to-rose-500/5 transition-all duration-500" />
                              <motion.div 
                                whileHover={{ rotate: 5, scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-pink-500/50"
                              >
                                <BoltIcon className="w-6 h-6 text-pink-400" />
                              </motion.div>
                              <div className="relative flex-1">
                                <div className="font-bold text-base mb-1.5">Sosyal Medya</div>
                                <div className="text-xs text-gray-400 leading-relaxed">Twitch, YouTube, X, RSS Notifications...</div>
                              </div>
                            </motion.a>
                          </div>

                          {/* Right Column */}
                          <div className="space-y-2">
                            <motion.a 
                              href="#features" 
                              onClick={() => setFeaturesOpen(false)} 
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.05 }}
                              whileHover={{ x: -4, scale: 1.02 }}
                              className="relative group flex items-start gap-4 px-4 py-4 text-gray-300 hover:text-white bg-white/0 hover:bg-gradient-to-br hover:from-green-500/10 hover:to-emerald-500/10 rounded-2xl transition-all duration-300 border border-transparent hover:border-green-500/30 overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-500/0 group-hover:from-green-500/5 group-hover:to-emerald-500/5 transition-all duration-500" />
                              <motion.div 
                                whileHover={{ rotate: -5, scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-green-500/50"
                              >
                                <MusicalNoteIcon className="w-6 h-6 text-green-400" />
                              </motion.div>
                              <div className="relative flex-1">
                                <div className="font-bold text-base mb-1.5 flex items-center gap-2">
                                  Katılım & Eğlence
                                  <span className="text-[9px] px-2 py-0.5 bg-green-500/20 text-green-300 rounded-full font-semibold">Yeni</span>
                                </div>
                                <div className="text-xs text-gray-400 leading-relaxed">Seviye, Giveaway, Games, Müzik...</div>
                              </div>
                            </motion.a>

                            <motion.a 
                              href="#features" 
                              onClick={() => setFeaturesOpen(false)} 
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 }}
                              whileHover={{ x: -4, scale: 1.02 }}
                              className="relative group flex items-start gap-4 px-4 py-4 text-gray-300 hover:text-white bg-white/0 hover:bg-gradient-to-br hover:from-cyan-500/10 hover:to-teal-500/10 rounded-2xl transition-all duration-300 border border-transparent hover:border-cyan-500/30 overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-teal-500/0 group-hover:from-cyan-500/5 group-hover:to-teal-500/5 transition-all duration-500" />
                              <motion.div 
                                whileHover={{ rotate: 5, scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-cyan-500/50"
                              >
                                <SparklesIcon className="w-6 h-6 text-cyan-400" />
                              </motion.div>
                              <div className="relative flex-1">
                                <div className="font-bold text-base mb-1.5">Bot Kişiselleştirme</div>
                                <div className="text-xs text-gray-400 leading-relaxed">Avatar, İsim, AI Kişilik, Custom Branding...</div>
                              </div>
                            </motion.a>

                            <motion.a 
                              href="#premium" 
                              onClick={() => setFeaturesOpen(false)} 
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.15 }}
                              whileHover={{ x: -4, scale: 1.02 }}
                              className="relative group flex items-start gap-4 px-4 py-4 text-gray-300 hover:text-white bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-2xl transition-all duration-300 border border-yellow-500/30 hover:border-yellow-500/50 overflow-hidden shadow-lg hover:shadow-yellow-500/25"
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-amber-500/5 group-hover:from-yellow-500/10 group-hover:to-amber-500/10 transition-all duration-500" />
                              <motion.div 
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                                className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/30 to-amber-500/30 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-yellow-500/50"
                              >
                                <span className="text-2xl">👑</span>
                              </motion.div>
                              <div className="relative flex-1">
                                <div className="font-bold text-base mb-1.5 text-yellow-300">Premium Abonelik</div>
                                <div className="text-xs text-yellow-200/70 leading-relaxed">Tüm özelliklere sınırsız erişim</div>
                              </div>
                            </motion.a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>

              {/* Resources Dropdown - Ultra Modern */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setResourcesOpen(!resourcesOpen);
                    setFeaturesOpen(false);
                    setLanguageOpen(false);
                  }}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                  {t[language].resources}
                  <ChevronDownIcon className={`w-4 h-4 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`} />
                </button>
                {resourcesOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setResourcesOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-[750px] bg-[#13151f]/98 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl z-50 overflow-hidden"
                    >
                      {/* Animated Gradient Border */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-teal-500/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
                      
                      <div className="relative p-5">
                        <div className="grid grid-cols-2 gap-3">
                          {/* Left Column - Destek */}
                          <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-4">🛟 Destek</h3>
                            <div className="space-y-2">
                              <motion.a 
                                href="#" 
                                onClick={() => setResourcesOpen(false)} 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05 }}
                                whileHover={{ x: 4, scale: 1.02 }}
                                className="relative group flex items-start gap-4 px-4 py-4 text-gray-300 hover:text-white bg-white/0 hover:bg-gradient-to-br hover:from-purple-500/10 hover:to-blue-500/10 rounded-2xl transition-all duration-300 border border-transparent hover:border-purple-500/30 overflow-hidden"
                              >
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 transition-all duration-500" />
                                <motion.div 
                                  whileHover={{ rotate: -10, scale: 1.1 }}
                                  transition={{ type: "spring", stiffness: 300 }}
                                  className="relative text-3xl"
                                >
                                  📚
                                </motion.div>
                                <div className="relative flex-1">
                                  <div className="font-bold text-base mb-1.5 flex items-center gap-2">
                                    Öğretici & Rehberler
                                    <span className="text-[9px] px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full font-semibold">Güncellendi</span>
                                  </div>
                                  <div className="text-xs text-gray-400 leading-relaxed">Başlangıç, komutlar ve ileri seviye kullanım...</div>
                                </div>
                              </motion.a>

                              <motion.a 
                                href="#" 
                                onClick={() => setResourcesOpen(false)} 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                whileHover={{ x: 4, scale: 1.02 }}
                                className="relative group flex items-start gap-4 px-4 py-4 text-gray-300 hover:text-white bg-white/0 hover:bg-gradient-to-br hover:from-blue-500/10 hover:to-cyan-500/10 rounded-2xl transition-all duration-300 border border-transparent hover:border-blue-500/30 overflow-hidden"
                              >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 transition-all duration-500" />
                                <motion.div 
                                  whileHover={{ scale: 1.15 }}
                                  transition={{ type: "spring", stiffness: 300 }}
                                  className="relative text-3xl"
                                >
                                  📖
                                </motion.div>
                                <div className="relative flex-1">
                                  <div className="font-bold text-base mb-1.5">Dokümantasyon</div>
                                  <div className="text-xs text-gray-400 leading-relaxed">API referansı, örnekler, bilgi bankası...</div>
                                </div>
                              </motion.a>

                              <motion.a 
                                href="https://discord.gg/neurovia" 
                                onClick={() => setResourcesOpen(false)} 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.15 }}
                                whileHover={{ x: 4, scale: 1.02 }}
                                className="relative group flex items-start gap-4 px-4 py-4 text-gray-300 hover:text-white bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl transition-all duration-300 border border-indigo-500/30 hover:border-indigo-500/50 overflow-hidden shadow-lg hover:shadow-indigo-500/25"
                              >
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-500" />
                                <motion.div 
                                  whileHover={{ scale: 1.1 }}
                                  transition={{ type: "spring", stiffness: 300 }}
                                  className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-indigo-500/50"
                                >
                                  <ServerIcon className="w-6 h-6 text-indigo-300" />
                                </motion.div>
                                <div className="relative flex-1">
                                  <div className="font-bold text-base mb-1.5 text-indigo-300">Discord Sunucusu</div>
                                  <div className="text-xs text-indigo-200/70 leading-relaxed">Canlı destek ve topluluk</div>
                                </div>
                              </motion.a>
                            </div>
                          </div>

                          {/* Right Column - Şirket */}
                          <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-4">🏢 Şirket</h3>
                            <div className="space-y-2">
                              <motion.a 
                                href="/servers" 
                                onClick={() => setResourcesOpen(false)} 
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05 }}
                                whileHover={{ x: -4, scale: 1.02 }}
                                className="relative group flex items-start gap-4 px-4 py-4 text-gray-300 hover:text-white bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl transition-all duration-300 border border-green-500/30 hover:border-green-500/50 overflow-hidden shadow-lg hover:shadow-green-500/25"
                              >
                                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 group-hover:from-green-500/10 group-hover:to-emerald-500/10 transition-all duration-500" />
                                <motion.div 
                                  whileHover={{ scale: 1.1, rotate: 5 }}
                                  transition={{ type: "spring", stiffness: 300 }}
                                  className="relative text-3xl"
                                >
                                  💼
                                </motion.div>
                                <div className="relative flex-1">
                                  <div className="font-bold text-base mb-1.5 flex items-center gap-2 text-green-300">
                                    Kariyer
                                    <span className="text-[9px] px-2 py-0.5 bg-green-500/30 text-green-200 rounded-full font-semibold animate-pulse">İşe alıyoruz!</span>
                                  </div>
                                  <div className="text-xs text-green-200/70 leading-relaxed">Milyonlarca kullanıcı için araçlar oluştur</div>
                                </div>
                              </motion.a>

                              <motion.a 
                                href="#" 
                                onClick={() => setResourcesOpen(false)} 
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                whileHover={{ x: -4, scale: 1.02 }}
                                className="relative group flex items-start gap-4 px-4 py-4 text-gray-300 hover:text-white bg-white/0 hover:bg-gradient-to-br hover:from-pink-500/10 hover:to-rose-500/10 rounded-2xl transition-all duration-300 border border-transparent hover:border-pink-500/30 overflow-hidden"
                              >
                                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-rose-500/0 group-hover:from-pink-500/5 group-hover:to-rose-500/5 transition-all duration-500" />
                                <motion.div 
                                  whileHover={{ rotate: 360 }}
                                  transition={{ duration: 0.6 }}
                                  className="relative text-3xl"
                                >
                                  🐛
                                </motion.div>
                                <div className="relative flex-1">
                                  <div className="font-bold text-base mb-1.5">Bug Bounty</div>
                                  <div className="text-xs text-gray-400 leading-relaxed">Güvenlik açıklarını bul, ödül kazan!</div>
                                </div>
                              </motion.a>

                              <motion.a 
                                href="#" 
                                onClick={() => setResourcesOpen(false)} 
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.15 }}
                                whileHover={{ x: -4, scale: 1.02 }}
                                className="relative group flex items-start gap-4 px-4 py-4 text-gray-300 hover:text-white bg-white/0 hover:bg-gradient-to-br hover:from-cyan-500/10 hover:to-teal-500/10 rounded-2xl transition-all duration-300 border border-transparent hover:border-cyan-500/30 overflow-hidden"
                              >
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-teal-500/0 group-hover:from-cyan-500/5 group-hover:to-teal-500/5 transition-all duration-500" />
                                <motion.div 
                                  whileHover={{ scale: 1.15 }}
                                  transition={{ type: "spring", stiffness: 300 }}
                                  className="relative text-3xl"
                                >
                                  ✉️
                                </motion.div>
                                <div className="relative flex-1">
                                  <div className="font-bold text-base mb-1.5">Bize Ulaşın</div>
                                  <div className="text-xs text-gray-400 leading-relaxed">Sorularınız için 7/24 buradayız!</div>
                                </div>
                              </motion.a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Language Selector - Emoji Only */}
              <div className="relative">
                <motion.button 
                  onClick={() => {
                    setLanguageOpen(!languageOpen);
                    setFeaturesOpen(false);
                    setResourcesOpen(false);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden md:flex items-center justify-center w-10 h-10 text-2xl hover:bg-white/5 rounded-lg transition-all"
                >
                  {language === 'tr' ? '🇹🇷' : '🇬🇧'}
                </motion.button>
                {languageOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setLanguageOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-40 bg-[#1a1c2e]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="p-1">
                        <button
                          onClick={() => {
                            setLanguage('tr');
                            setLanguageOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all ${
                            language === 'tr' ? 'bg-purple-500/20 text-white' : 'text-gray-300 hover:bg-white/5'
                          }`}
                        >
                          <span className="text-base">🇹🇷</span>
                          Türkçe
                        </button>
                        <button
                          onClick={() => {
                            setLanguage('en');
                            setLanguageOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all ${
                            language === 'en' ? 'bg-purple-500/20 text-white' : 'text-gray-300 hover:bg-white/5'
                          }`}
                        >
                          <span className="text-base">🇬🇧</span>
                          English
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>

              {/* Premium Button */}
              <motion.a
                href="#premium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-bold text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20 rounded-lg transition-all"
              >
                <span className="text-base">👑</span>
                {t[language].premium}
              </motion.a>

              {/* Discord Login */}
              <motion.a
                href="https://discord.com/oauth2/authorize?response_type=code&redirect_uri=https%3A%2F%2Fneuroviabot.xyz%2Fapi%2Fauth%2Fcallback&scope=identify%20email%20guilds&client_id=773539215098249246"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#5865F2] hover:bg-[#4752C4] rounded-lg transition-all shadow-lg"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
                <span className="hidden sm:inline">{t[language].login}</span>
              </motion.a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - MEE6 Style */}
      <section className="relative z-1 min-h-[calc(100vh-20%)] flex" style={{
        background: 'linear-gradient(rgb(19, 21, 31) -4.84%, rgb(29, 28, 47) 34.9%, rgb(33, 32, 54) 48.6%, rgb(51, 40, 62) 66.41%, rgb(98, 61, 83) 103.41%, rgb(140, 81, 102) 132.18%)'
      }}>
        {/* Forest Background */}
        <div className="absolute w-full h-full -z-1 left-0 pointer-events-none overflow-hidden">
          <svg className="w-full absolute bottom-0" viewBox="0 0 1920 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 400V250C150 200 300 180 450 200C600 220 750 180 900 160C1050 140 1200 150 1350 180C1500 210 1650 190 1800 170C1920 155 1920 155 1920 155V400H0Z" fill="#0D0E15" fillOpacity="0.8"/>
            <path d="M0 400V280C150 250 300 240 450 260C600 280 750 250 900 235C1050 220 1200 230 1350 255C1500 280 1650 265 1800 245C1920 232 1920 232 1920 232V400H0Z" fill="#0D0E15" fillOpacity="0.6"/>
          </svg>
        </div>

        {/* Content */}
        <div className="min-h-full w-full flex items-center justify-start pt-16">
          <div className="mx-auto w-full max-w-[1240px] px-6 lg:px-10 py-6 lg:py-10 pt-10 lg:pt-24 lg:py-36">
            <div className="w-full text-center md:w-3/5 md:mx-auto lg:mx-0 lg:text-left lg:w-2/5">
              {/* Title */}
              <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-white min-h-[127px] font-bold text-5xl lg:text-7xl mb-7"
              >
                {t[language].title}
          </motion.h1>

          {/* Description */}
          <motion.p
                initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-gray-300 text-base mb-10 whitespace-pre-line"
          >
                {t[language].description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
                initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col md:flex-row justify-center lg:justify-start items-stretch gap-4 max-w-[168px] lg:max-w-none m-auto"
              >
                <motion.a
                  href="https://discord.com/oauth2/authorize?response_type=code&redirect_uri=https%3A%2F%2Fneuroviabot.xyz%2Fapi%2Fauth%2Fcallback&scope=identify%20email%20guilds&client_id=773539215098249246"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative flex overflow-hidden shrink-0 rounded-lg transition-all duration-200 items-center gap-1.5 bg-[#5865F2] text-white hover:bg-[#4752C4] text-base px-6 py-3 font-bold shadow-lg"
                >
                  <svg width="24" height="24" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5">
                    <path d="M15.248 1.089A15.431 15.431 0 0011.534 0a9.533 9.533 0 00-.476.921 14.505 14.505 0 00-4.12 0A9.582 9.582 0 006.461 0a15.54 15.54 0 00-3.717 1.091C.395 4.405-.242 7.636.076 10.821A15.269 15.269 0 004.631 13c.369-.473.695-.974.975-1.499a9.896 9.896 0 01-1.536-.699c.13-.089.255-.18.377-.27 1.424.639 2.979.97 4.553.97 1.574 0 3.129-.331 4.553-.97.123.096.25.188.377.27a9.94 9.94 0 01-1.54.7c.28.525.607 1.026.976 1.498a15.2 15.2 0 004.558-2.178c.373-3.693-.639-6.895-2.676-9.733zM6.01 8.862c-.888 0-1.621-.767-1.621-1.712 0-.944.708-1.718 1.618-1.718.91 0 1.638.774 1.623 1.718-.016.945-.715 1.712-1.62 1.712zm5.98 0c-.889 0-1.62-.767-1.62-1.712 0-.944.708-1.718 1.62-1.718.912 0 1.634.774 1.618 1.718-.015.945-.713 1.712-1.618 1.712z" fill="currentColor"/>
                  </svg>
                  {t[language].addToDiscord}
                </motion.a>

                <motion.a
                  href="#features"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative flex overflow-hidden shrink-0 rounded-lg transition-all duration-200 items-center gap-1.5 bg-white/10 text-white hover:bg-white/20 text-base px-6 py-3 font-semibold border border-white/10"
                >
                  {t[language].seeFeatures}
                </motion.a>
              </motion.div>
            </div>

            {/* Character Image - Right Side */}
            <div className="h-full md:w-1/2 translate-x-6 translate-y-6 md:translate-y-0 md:translate-x-0 md:absolute right-0 bottom-0 flex items-end justify-end pointer-events-none -z-1">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="w-full h-full relative">
                  {/* Placeholder for character image */}
                  <div className="w-[400px] h-[500px] lg:w-[500px] lg:h-[600px] relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent rounded-full blur-3xl"></div>
                    <svg viewBox="0 0 400 600" className="w-full h-full drop-shadow-2xl">
                      <circle cx="200" cy="150" r="80" fill="#8B5CF6" opacity="0.3"/>
                      <rect x="150" y="230" width="100" height="200" rx="20" fill="#7C3AED" opacity="0.5"/>
                      <rect x="100" y="250" width="60" height="150" rx="15" fill="#6D28D9" opacity="0.4"/>
                      <rect x="240" y="250" width="60" height="150" rx="15" fill="#6D28D9" opacity="0.4"/>
                      <text x="200" y="320" fontSize="120" fill="white" textAnchor="middle" opacity="0.8">🤖</text>
                    </svg>
                  </div>
              </div>
              </motion.div>
            </div>
          </div>
            </div>
      </section>

      {/* Features Section - Hero Style (MEE6-inspired) */}
      <section id="features" className="relative z-1 min-h-screen flex" style={{
        background: 'linear-gradient(rgb(33, 32, 54) 0%, rgb(51, 40, 62) 30%, rgb(98, 61, 83) 60%, rgb(140, 81, 102) 100%)'
      }}>
        {/* Forest Bottom - Same as Hero */}
        <div className="absolute w-full h-full left-0 pointer-events-none overflow-hidden">
          <svg className="w-full absolute bottom-0" viewBox="0 0 1920 400" fill="none" xmlns="http://www.w3.org/2000/svg" opacity="0.5">
            <path d="M0 400V250C150 200 300 180 450 200C600 220 750 180 900 160C1050 140 1200 150 1350 180C1500 210 1650 190 1800 170C1920 155 1920 155 1920 155V400H0Z" fill="#0D0E15" fillOpacity="0.8"/>
            <path d="M0 400V280C150 250 300 240 450 260C600 280 750 250 900 235C1050 220 1200 230 1350 255C1500 280 1650 265 1800 245C1920 232 1920 232 1920 232V400H0Z" fill="#0D0E15" fillOpacity="0.6"/>
          </svg>
        </div>

        <div className="relative w-full max-w-[1240px] mx-auto px-6 lg:px-10 py-20 lg:py-32 pt-32">
          {/* Section Header - Hero Style */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-24"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-white text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              {t[language].whatCanYouDo}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed"
          >
              {t[language].whatCanYouDoDesc}
          </motion.p>
          </motion.div>

          {/* Feature Grid - Hero Style Large Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Music Feature - Large */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="group relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-10 lg:p-12">
                <div className="flex items-start gap-6 mb-8">
                  <motion.div 
                    whileHover={{ scale: 1.05, rotate: 3 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-5xl shadow-xl flex-shrink-0"
                  >
                    🎵
                  </motion.div>
                  <div>
                    <h3 className="text-3xl font-black text-white mb-3">Müzik Çal</h3>
                    <p className="text-purple-300 text-base font-semibold">YouTube • Spotify • SoundCloud</p>
                  </div>
                </div>
                <p className="text-gray-200 text-lg leading-relaxed mb-6">
                  Kristal kalitede müzik deneyimi. Gelişmiş sıra yönetimi, ses kontrolü, şarkı sözleri ve daha fazlası.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-lg">Sıra Yönetimi</span>
                  <span className="px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-lg">Ses Filtreler</span>
                  <span className="px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-lg">Şarkı Sözleri</span>
                </div>
              </div>
            </motion.div>

            {/* Moderation Feature - Large */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="group relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-10 lg:p-12">
                <div className="flex items-start gap-6 mb-8">
                  <motion.div 
                    whileHover={{ scale: 1.05, rotate: -3 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center text-5xl shadow-xl flex-shrink-0"
                  >
                    🛡️
                  </motion.div>
                  <div>
                    <h3 className="text-3xl font-black text-white mb-3">Akıllı Moderasyon</h3>
                    <p className="text-blue-300 text-base font-semibold">Otomatik • Güvenli • Hızlı</p>
                  </div>
                </div>
                <p className="text-gray-200 text-lg leading-relaxed mb-6">
                  Spam, küfür ve zararlı içerikleri otomatik engelle. Uyarı sistemi, log kayıtları ve daha fazlası.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-lg">Auto-Mod</span>
                  <span className="px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-lg">Log Sistemi</span>
                  <span className="px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-lg">Uyarı</span>
                </div>
        </div>
            </motion.div>

            {/* Economy Feature - Large */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="group relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-10 lg:p-12">
                <div className="flex items-start gap-6 mb-8">
                  <motion.div 
                    whileHover={{ scale: 1.05, rotate: 3 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center text-5xl shadow-xl flex-shrink-0"
                  >
                    💰
                  </motion.div>
                  <div>
                    <h3 className="text-3xl font-black text-white mb-3">Ekonomi Sistemi</h3>
                    <p className="text-green-300 text-base font-semibold">Para • Mağaza • Casino</p>
                  </div>
                </div>
                <p className="text-gray-200 text-lg leading-relaxed mb-6">
                  Sanal para kazandır, özel mağaza kur, casino oyunları ekle. Üyelerini ödüllendir!
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-lg">Günlük Ödül</span>
                  <span className="px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-lg">Mağaza</span>
                  <span className="px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-lg">Oyunlar</span>
                </div>
        </div>
            </motion.div>

            {/* Leveling Feature - Large */}
        <motion.div
              initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="group relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-10 lg:p-12">
                <div className="flex items-start gap-6 mb-8">
                  <motion.div 
                    whileHover={{ scale: 1.05, rotate: -3 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-24 h-24 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center text-5xl shadow-xl flex-shrink-0"
                  >
                    ⭐
                  </motion.div>
                  <div>
                    <h3 className="text-3xl font-black text-white mb-3">Seviye & Çekiliş</h3>
                    <p className="text-yellow-300 text-base font-semibold">XP • Roller • Giveaway</p>
                  </div>
                </div>
                <p className="text-gray-200 text-lg leading-relaxed mb-6">
                  Aktif üyeler XP kazansın, seviye atlasın. Heyecan verici çekilişler düzenle ve topluluğunu motive et!
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-lg">Seviye Sistemi</span>
                  <span className="px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-lg">Liderlik</span>
                  <span className="px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-lg">Çekiliş</span>
                </div>
              </div>
        </motion.div>
          </div>

          {/* Bottom CTA - Hero Style */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-20 text-center"
          >
            <p className="text-gray-200 text-xl mb-8 font-medium">Ve daha fazlası! <span className="text-white font-bold">50+ özellik</span> ile sunucunu tam kontrol altına al.</p>
            <motion.a
              href="https://discord.com/oauth2/authorize?response_type=code&redirect_uri=https%3A%2F%2Fneuroviabot.xyz%2Fapi%2Fauth%2Fcallback&scope=identify%20email%20guilds&client_id=773539215098249246"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-10 py-5 bg-[#5865F2] hover:bg-[#4752C4] text-white text-lg font-bold rounded-xl shadow-2xl transition-all"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              <span>Hemen Başla - Ücretsiz</span>
            </motion.a>
        </motion.div>
        </div>
      </section>

      {/* Footer - Smooth Animated & Hero-Style */}
      <footer className="relative z-10 overflow-hidden" style={{
        background: 'linear-gradient(rgb(140, 81, 102) 0%, rgb(98, 61, 83) 30%, rgb(51, 40, 62) 60%, rgb(33, 32, 54) 100%)'
      }}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl"
          />
            </div>

        {/* Forest Silhouette Top */}
        <div className="absolute w-full h-full top-0 left-0 pointer-events-none overflow-hidden opacity-30">
          <svg className="w-full absolute top-0 rotate-180" viewBox="0 0 1920 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 400V250C150 200 300 180 450 200C600 220 750 180 900 160C1050 140 1200 150 1350 180C1500 210 1650 190 1800 170C1920 155 1920 155 1920 155V400H0Z" fill="#0D0E15" fillOpacity="0.8"/>
            <path d="M0 400V280C150 250 300 240 450 260C600 280 750 250 900 235C1050 220 1200 230 1350 255C1500 280 1650 265 1800 245C1920 232 1920 232 1920 232V400H0Z" fill="#0D0E15" fillOpacity="0.6"/>
          </svg>
          </div>

        <div className="relative max-w-[1240px] mx-auto px-6 lg:px-10 pt-20 pb-10">
          {/* Main Footer Content - Animated */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            {/* Brand Section - Animated */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <div className="flex items-center gap-3 mb-6">
                <motion.div 
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-xl"
                >
                  <motion.svg 
                    className="w-7 h-7 text-white" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                  </motion.svg>
                </motion.div>
                <span className="text-white font-black text-2xl">Neurovia</span>
              </div>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-gray-200 text-base leading-relaxed mb-6"
              >
                Discord sunucunu yönetmek için ihtiyacın olan her şey. Müzik, moderasyon, ekonomi ve daha fazlası.
              </motion.p>
              {/* Social Links - Stagger Animation */}
              <div className="flex items-center gap-3">
                {[
                  { href: "https://discord.gg/neurovia", icon: "M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z", delay: 0 },
                  { href: "https://twitter.com/neurovia", icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z", delay: 0.1 },
                  { href: "https://github.com/neurovia", icon: "M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z", delay: 0.2 },
                  { href: "https://youtube.com/@neurovia", icon: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z", delay: 0.3 }
                ].map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.href}
              target="_blank"
              rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + social.delay }}
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.icon}/>
                    </svg>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Product - Animated */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-white font-bold text-lg mb-4">Ürün</h3>
              <ul className="space-y-3">
                {["Özellikler", "Premium", "Sunucularım", "Botu Ekle"].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.05 }}
                  >
                    <a 
                      href={i === 0 ? "#features" : i === 1 ? "#premium" : i === 2 ? "/servers" : "https://discord.com/oauth2/authorize?response_type=code&redirect_uri=https%3A%2F%2Fneuroviabot.xyz%2Fapi%2Fauth%2Fcallback&scope=identify%20email%20guilds&client_id=773539215098249246"} 
                      className="text-gray-200 hover:text-white transition-all text-sm hover:translate-x-1 inline-block"
                    >
                      {item}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Resources - Animated */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-white font-bold text-lg mb-4">Kaynaklar</h3>
              <ul className="space-y-3">
                {[
                  { name: "Dokümantasyon", href: "#" },
                  { name: "Komutlar", href: "#" },
                  { name: "Destek", href: "#" },
                  { name: "Discord Sunucusu", href: "https://discord.gg/neurovia" }
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                  >
                    <a 
                      href={item.href} 
                      target={item.href.startsWith('http') ? "_blank" : undefined}
                      rel={item.href.startsWith('http') ? "noopener noreferrer" : undefined}
                      className="text-gray-200 hover:text-white transition-all text-sm hover:translate-x-1 inline-block"
                    >
                      {item.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Company - Animated */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-white font-bold text-lg mb-4">Şirket</h3>
              <ul className="space-y-3">
                {["Hakkımızda", "Blog", "Kariyer", "İletişim"].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.05 }}
                  >
                    <a 
                      href="#" 
                      className="text-gray-200 hover:text-white transition-all text-sm hover:translate-x-1 inline-block"
                    >
                      {item}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Bottom Bar - Animated */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="pt-8 border-t border-white/10"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-gray-300 text-sm"
              >
                © 2025 <span className="font-bold text-white">Neurovia</span>. Tüm hakları saklıdır.
              </motion.p>
              <div className="flex items-center gap-6">
                {["Gizlilik Politikası", "Kullanım Şartları", "Çerezler"].map((item, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
                    whileHover={{ y: -2 }}
                    className="text-gray-300 hover:text-white transition-all text-sm"
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  gradient: string;
}

function StatCard({ icon, value, label, gradient }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="relative group"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur transition duration-300" style={{
        backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`
      }}></div>
      <div className="relative p-8 bg-[#1A1B23] border border-white/10 rounded-2xl backdrop-blur-xl">
        <div className={`inline-flex items-center justify-center w-16 h-16 mb-4 rounded-xl bg-gradient-to-br ${gradient} text-white`}>
          {icon}
        </div>
        <div className="text-4xl font-black text-white mb-2">{value}+</div>
        <div className="text-gray-400 font-medium">{label}</div>
      </div>
    </motion.div>
  );
}

// Feature Card Component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  delay: number;
}

function FeatureCard({ icon, title, description, gradient, delay }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="relative group"
    >
      {/* Gradient border effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-300`}></div>
      
      {/* Card content */}
      <div className="relative p-8 bg-[#1A1B23] border border-white/10 rounded-2xl backdrop-blur-xl h-full">
        <div className={`inline-flex items-center justify-center w-16 h-16 mb-6 rounded-xl bg-gradient-to-br ${gradient} text-white transform group-hover:rotate-6 transition-transform duration-300`}>
          {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-8 h-8' })}
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
