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

  useEffect(() => {
    setMounted(true);
    fetchBotStats()
      .then(data => setStats(data))
      .catch(() => setStats({ guilds: 66, users: 59032, commands: 43 }));
  }, []);

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
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div 
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center"
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </motion.div>
              <span className="text-xl font-black text-white">NeuroViaBot</span>
            </Link>

            {/* Center Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                Özellikler
                <ChevronDownIcon className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                Kaynaklar
                <ChevronDownIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <button className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                <span className="text-base">🇹🇷</span>
                <span>TR</span>
                <ChevronDownIcon className="w-3.5 h-3.5" />
              </button>

              {/* Premium Button */}
              <motion.a
                href="#premium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-bold text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20 rounded-lg transition-all"
              >
                <span className="text-base">👑</span>
                Premium
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
                <span className="hidden sm:inline">Giriş Yap</span>
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
                Discord için en iyi{' '}
                <span className="whitespace-nowrap">hepsi bir arada</span> bot
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-gray-300 text-base mb-10 whitespace-pre-line"
              >
                NeuroViaBot, dünya çapında binlerce Discord sunucusunun topluluklarını yönetmek, eğlendirmek ve büyütmek için güvendiği kullanımı kolay, eksiksiz bir Discord botudur.
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
                  Discord'a Ekle
                </motion.a>

                <motion.a
                  href="#features"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative flex overflow-hidden shrink-0 rounded-lg transition-all duration-200 items-center gap-1.5 bg-white/10 text-white hover:bg-white/20 text-base px-6 py-3 font-semibold border border-white/10"
                >
                  Özellikleri gör
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

      {/* Features Section - Modern Cards */}
      <section id="features" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header - Simplified */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Neler <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Yapabilirsin?</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-xl mx-auto">
              Sunucunu yönetmek ve eğlenceli hale getirmek için her şey burada
            </p>
          </motion.div>

          {/* Feature Grid - Simplified descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<MusicalNoteIcon />}
              title="🎵 Müzik Çal"
              description="YouTube ve Spotify'dan dilediğin şarkıyı çal. Sıra yönetimi, ses kontrolü hepsi dahil!"
              gradient="from-purple-500 to-blue-500"
              delay={0}
            />
            <FeatureCard
              icon={<ShieldCheckIcon />}
              title="🛡️ Sunucunu Koru"
              description="Spam, küfür ve zararlı içerikleri otomatik engelle. Sunucun güvende!"
              gradient="from-blue-500 to-cyan-500"
              delay={0.1}
            />
            <FeatureCard
              icon={<CurrencyDollarIcon />}
              title="💰 Ekonomi Oluştur"
              description="Üyelerine sanal para kazan, alışveriş yap ve casino oyunları oyna!"
              gradient="from-cyan-500 to-teal-500"
              delay={0.2}
            />
            <FeatureCard
              icon={<ChartBarIcon />}
              title="⭐ Seviye Sistemi"
              description="Aktif üyeler XP kazanıp seviye atlasın. Otomatik roller ver!"
              gradient="from-teal-500 to-green-500"
              delay={0.3}
            />
            <FeatureCard
              icon={<TicketIcon />}
              title="🎫 Destek Al"
              description="Üyelerine destek sistemini kur. Ticket aç, yönet, kaydet."
              gradient="from-green-500 to-lime-500"
              delay={0.4}
            />
            <FeatureCard
              icon={<GiftIcon />}
              title="🎁 Çekiliş Yap"
              description="Kolayca çekiliş başlat. Otomatik kazanan seç, herkes mutlu!"
              gradient="from-pink-500 to-rose-500"
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* CTA Section - Simplified */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative p-10 rounded-2xl bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-xl"
          >
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                Hadi Başlayalım! 🚀
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Kurulum 30 saniye sürüyor. Ücretsiz, kredi kartı gerekmez!
              </p>
              <motion.a
                href="https://discord.com/oauth2/authorize?response_type=code&redirect_uri=https%3A%2F%2Fneuroviabot.xyz%2Fapi%2Fauth%2Fcallback&scope=identify%20email%20guilds&client_id=773539215098249246"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300"
              >
                <RocketLaunchIcon className="w-6 h-6" />
                <span>Şimdi Dene</span>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Simplified */}
      <footer className="relative z-10 py-8 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </div>
            <span className="text-white font-bold text-lg">NeuroViaBot</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="#features" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
              Özellikler
            </Link>
            <a
              href="https://discord.com/oauth2/authorize?response_type=code&redirect_uri=https%3A%2F%2Fneuroviabot.xyz%2Fapi%2Fauth%2Fcallback&scope=identify%20email%20guilds&client_id=773539215098249246"
              className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
            >
              Botu Ekle
            </a>
          </div>

          <p className="text-gray-500 text-sm">
            © 2025 NeuroViaBot
          </p>
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
