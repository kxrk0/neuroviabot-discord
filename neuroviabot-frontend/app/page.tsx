'use client';

import React from 'react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [languageOpen, setLanguageOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const loadStats = async () => {
      try {
        console.log('🔄 Starting to fetch bot stats...');
        const data = await fetchBotStats();
        console.log('✅ Bot stats received:', data);
        console.log('📊 Users value:', data.users, 'Type:', typeof data.users);
        
        // Eğer users 0 veya geçersizse, fallback kullan
        const finalStats = {
          guilds: data.guilds || 66,
          users: (data.users && data.users > 0) ? data.users : 59032,
          commands: data.commands || 43
        };
        
        console.log('💾 Setting stats to:', finalStats);
        setStats(finalStats);
      } catch (error) {
        console.error('❌ Failed to fetch bot stats:', error);
        setStats({ guilds: 66, users: 59032, commands: 43 });
      }
    };
    
    loadStats();
    
    // Her 30 saniyede bir güncelle
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const t = {
    tr: {
      title: 'Discord için en iyi hepsi bir arada bot',
      description: 'NeuroViaBot, dünya çapında binlerce Discord sunucusunun topluluklarını yönetmek, eğlendirmek ve büyütmek için güvendiği kullanımı kolay, eksiksiz bir Discord botudur.',
      addToDiscord: "Discord'a Ekle",
      seeFeatures: 'Özellikleri gör',
      features: 'Özellikler',
      commands: 'Komutlar',
      contact: 'Bize Ulaşın',
      feedback: 'Geri Bildirim',
      resources: 'Kaynaklar',
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
      commands: 'Commands',
      contact: 'Contact Us',
      feedback: 'Feedback',
      resources: 'Resources',
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

      {/* Ultra Modern Hero-Style Navbar with Smooth Entry */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        {/* Glassmorphism Background with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0b0f]/95 via-[#13151f]/95 to-[#1a1c2e]/95 backdrop-blur-2xl"></div>
        
        {/* Top Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
        
        {/* Bottom Gradient Border */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        
        {/* Ambient Glow Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Hero Style */}
            <Link href="/" className="relative flex items-center gap-3 group z-10">
              {/* Logo Glow Effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-200"></div>
              
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-purple-500/30"
              >
                {/* Inner Glow */}
                <div className="absolute inset-0.5 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-2xl"></div>
                
                <motion.svg 
                  className="relative w-7 h-7 text-white drop-shadow-lg" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ 
                    scale: [1, 1.08, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </motion.svg>
                
                {/* Pulse Ring */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-purple-400"
                  animate={{
                    scale: [1, 1.3, 1.3],
                    opacity: [0.5, 0, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              </motion.div>
              
              <div className="relative flex flex-col">
                <motion.span 
                  className="text-2xl font-black tracking-tight"
                  initial={{ backgroundPosition: "0% 50%" }}
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  style={{
                    background: "linear-gradient(90deg, #fff 0%, #c084fc 20%, #60a5fa 40%, #c084fc 60%, #fff 80%, #fff 100%)",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Neurovia
                </motion.span>
                {/* Tagline */}
                <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">Discord Bot</span>
            </div>
          </Link>
          
            {/* Center Navigation - Hero Style */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Features Link */}
              <Link 
                href="/ozellikler"
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-lg transition-colors"
              >
                {t[language].features}
              </Link>

              {/* Commands Link */}
              <Link 
                href="/komutlar"
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-lg transition-colors"
              >
                {t[language].commands}
              </Link>

              {/* Contact Link */}
              <Link 
                href="/iletisim"
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-lg transition-colors"
              >
                {t[language].contact}
              </Link>

              {/* Feedback Link */}
              <Link 
                href="/geri-bildirim"
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-lg transition-colors"
              >
                {t[language].feedback}
            </Link>
          </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Language Selector - Emoji Only */}
              <div className="relative">
                <motion.button 
                  onClick={() => setLanguageOpen(!languageOpen)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden md:flex items-center justify-center w-10 h-10 text-2xl hover:bg-white/5 rounded-lg transition-all"
                >
                  {language === 'tr' ? '🇹🇷' : '🇬🇧'}
                </motion.button>
                <AnimatePresence>
                {languageOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setLanguageOpen(false);
                      }} 
                    />
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
                          <span className="text-base">EN</span>
                          English
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
                </AnimatePresence>
              </div>

              {/* Discord Login - Modern */}
              <motion.a
                href="https://discord.com/oauth2/authorize?response_type=code&redirect_uri=https%3A%2F%2Fneuroviabot.xyz%2Fapi%2Fauth%2Fcallback&scope=identify%20email%20guilds&client_id=773539215098249246"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group flex items-center gap-2.5 px-6 py-3 text-sm font-bold overflow-hidden rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                {/* Background with gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#5865F2] to-[#7289DA] transition-all duration-150"></div>
                
                {/* Animated glow */}
                <motion.div
                  animate={{
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-[#5865F2] blur-xl opacity-50"
                />
                
                {/* Content */}
                <div className="relative flex items-center gap-2.5 text-white z-10">
                  <motion.svg 
                    className="w-5 h-5" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
                  >
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                  </motion.svg>
                  <span className="hidden sm:inline font-bold tracking-wide drop-shadow-sm">{t[language].login}</span>
                </div>
                
                {/* Border glow */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity ring-2 ring-white/20"></div>
              </motion.a>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - Enhanced MEE6 Style */}
      <section className="relative z-1 min-h-[calc(100vh-20%)] flex overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/wallpaper.jpg)',
            filter: 'brightness(0.7) contrast(1.1)'
          }}
        />
        
        {/* Gradient Overlay for better text visibility */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(19, 21, 31, 0.7) 0%, rgba(29, 28, 47, 0.8) 50%, rgba(33, 32, 54, 0.9) 100%)'
          }}
        />
        
        {/* Animated Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient Orbs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.25, 0.15],
              x: [0, 50, 0],
              y: [0, 30, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
            style={{ willChange: 'transform, opacity' }}
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1],
              x: [0, -30, 0],
              y: [0, 50, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-3xl"
            style={{ willChange: 'transform, opacity' }}
          />
          
          {/* Floating Particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.sin(i) * 50, 0],
                opacity: [0, 0.6, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.8,
                ease: "easeInOut"
              }}
              className="absolute"
              style={{
                left: `${10 + i * 10}%`,
                top: `${30 + (i % 3) * 20}%`,
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: `rgba(${168 + i * 10}, ${85 + i * 5}, 247, 0.8)`,
                willChange: 'transform, opacity'
              }}
            />
          ))}
          
          {/* Decorative Circles */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 right-20 w-32 h-32 border border-purple-500/20 rounded-full"
            style={{ willChange: 'transform' }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-40 left-40 w-48 h-48 border border-blue-500/15 rounded-full"
            style={{ willChange: 'transform' }}
          />
        </div>

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
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 backdrop-blur-sm"
                style={{ willChange: 'transform, opacity' }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-400"
                />
                <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300">
                  ✨ Yeni Özellikler Eklendi
            </span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-green-400"
                />
          </motion.div>

          {/* Title with Gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.7, 
              ease: [0.22, 1, 0.36, 1]
            }}
            className="min-h-[127px] font-bold text-5xl lg:text-7xl mb-7 relative"
            style={{ willChange: 'transform, opacity' }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-blue-200"
            >
              {t[language].title}
            </motion.span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.25,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="text-gray-300 text-base mb-10 whitespace-pre-line leading-relaxed"
            style={{ willChange: 'transform, opacity' }}
          >
            {t[language].description}
          </motion.p>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.35,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="flex flex-wrap gap-6 mb-8 justify-center lg:justify-start"
            style={{ willChange: 'transform, opacity' }}
          >
            {[
              { icon: '🎵', value: '43+', label: 'Komut', color: 'purple' },
              { icon: '🏆', value: stats.guilds || '66', label: 'Sunucu', color: 'yellow' },
              { icon: '👥', value: stats.users.toLocaleString(), label: 'Kullanıcı', color: 'blue' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.45 + index * 0.1,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
                className={`flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg border transition-all duration-300 ${
                  stat.color === 'purple' 
                    ? 'border-purple-500/30 hover:border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]'
                    : stat.color === 'yellow'
                    ? 'border-yellow-500/30 hover:border-yellow-500/60 shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)]'
                    : 'border-blue-500/30 hover:border-blue-500/60 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]'
                }`}
              >
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.6,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="flex flex-col md:flex-row justify-center lg:justify-start items-stretch gap-4 max-w-[168px] lg:max-w-none m-auto"
            style={{ willChange: 'transform, opacity' }}
          >
            <motion.a
              href="https://discord.com/oauth2/authorize?response_type=code&redirect_uri=https%3A%2F%2Fneuroviabot.xyz%2Fapi%2Fauth%2Fcallback&scope=identify%20email%20guilds&client_id=773539215098249246"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(88, 101, 242, 0.5)"
              }}
              whileTap={{ scale: 0.98 }}
              className="relative flex shrink-0 rounded-xl items-center justify-center gap-2 bg-[#5865F2] text-white text-base px-8 py-4 font-bold shadow-xl"
              style={{ willChange: 'transform' }}
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 18 13" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M15.248 1.089A15.431 15.431 0 0011.534 0a9.533 9.533 0 00-.476.921 14.505 14.505 0 00-4.12 0A9.582 9.582 0 006.461 0a15.54 15.54 0 00-3.717 1.091C.395 4.405-.242 7.636.076 10.821A15.269 15.269 0 004.631 13c.369-.473.695-.974.975-1.499a9.896 9.896 0 01-1.536-.699c.13-.089.255-.18.377-.27 1.424.639 2.979.97 4.553.97 1.574 0 3.129-.331 4.553-.97.123.096.25.188.377.27a9.94 9.94 0 01-1.54.7c.28.525.607 1.026.976 1.498a15.2 15.2 0 004.558-2.178c.373-3.693-.639-6.895-2.676-9.733zM6.01 8.862c-.888 0-1.621-.767-1.621-1.712 0-.944.708-1.718 1.618-1.718.91 0 1.638.774 1.623 1.718-.016.945-.715 1.712-1.62 1.712zm5.98 0c-.889 0-1.62-.767-1.62-1.712 0-.944.708-1.718 1.62-1.718.912 0 1.634.774 1.618 1.718-.015.945-.713 1.712-1.618 1.712z" fill="currentColor"/>
              </svg>
              <span>{t[language].addToDiscord}</span>
            </motion.a>

            <motion.a
              href="#features"
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                borderColor: "rgba(255, 255, 255, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
              className="relative flex shrink-0 rounded-xl items-center justify-center gap-2 bg-white/5 backdrop-blur-sm text-white text-base px-8 py-4 font-semibold border border-white/10"
              style={{ willChange: 'transform' }}
            >
              <span>{t[language].seeFeatures}</span>
              <span>→</span>
            </motion.a>
          </motion.div>
              </div>

            {/* Character Image - Right Side */}
            <div className="h-full md:w-1/2 translate-x-6 translate-y-6 md:translate-y-0 md:translate-x-0 md:absolute right-0 bottom-0 flex items-end justify-end pointer-events-none -z-1">
          <motion.div
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  scale: 1
                }}
                transition={{ 
                  duration: 0.7,
                  delay: 0.3,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="relative"
                style={{ willChange: 'transform, opacity' }}
              >
                <motion.div 
                  className="w-full h-full relative"
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 1, 0, -1, 0]
                  }}
                  transition={{ 
                    y: { 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    },
                    rotate: {
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                  style={{ willChange: 'transform' }}
                >
                  {/* Placeholder for character image */}
                  <div className="w-[400px] h-[500px] lg:w-[500px] lg:h-[600px] relative">
                    {/* Multiple Glow Layers for Depth */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-purple-500/30 to-transparent rounded-full blur-3xl"
                      animate={{ 
                        scale: [1, 1.15, 1],
                        opacity: [0.3, 0.5, 0.3]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{ willChange: 'transform, opacity' }}
                    />
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent rounded-full blur-2xl"
                      animate={{ 
                        scale: [1.1, 1, 1.1],
                        opacity: [0.2, 0.4, 0.2]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                      }}
                      style={{ willChange: 'transform, opacity' }}
                    />
                    
                    {/* Orbiting particles */}
                    {[0, 120, 240].map((angle, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          rotate: 360
                        }}
                        transition={{
                          duration: 10 + i * 2,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          transformOrigin: 'center',
                          willChange: 'transform'
                        }}
                      >
                        <motion.div
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.4, 0.8, 0.4]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.3
                          }}
                          className="w-3 h-3 rounded-full bg-purple-400"
                          style={{
                            position: 'absolute',
                            top: '30%',
                            left: '50%',
                            transform: `translate(-50%, -50%) translateY(-120px) rotate(${angle}deg) translateX(150px)`
                          }}
                        />
                      </motion.div>
                    ))}
                    
                    <svg viewBox="0 0 400 600" className="w-full h-full drop-shadow-2xl relative z-10">
                      <circle cx="200" cy="150" r="80" fill="#8B5CF6" opacity="0.3"/>
                      <rect x="150" y="230" width="100" height="200" rx="20" fill="#7C3AED" opacity="0.5"/>
                      <rect x="100" y="250" width="60" height="150" rx="15" fill="#6D28D9" opacity="0.4"/>
                      <rect x="240" y="250" width="60" height="150" rx="15" fill="#6D28D9" opacity="0.4"/>
                      <text x="200" y="320" fontSize="120" fill="white" textAnchor="middle" opacity="0.8">🤖</text>
                    </svg>
            </div>
            </motion.div>
              </motion.div>
              </div>
            </div>
            </div>
      </section>

      {/* Features Section - Compact Hero Style */}
      <section id="features" className="relative z-1 py-20 lg:py-28" style={{
        background: 'linear-gradient(rgb(19, 21, 31) -4.84%, rgb(29, 28, 47) 34.9%, rgb(33, 32, 54) 48.6%, rgb(51, 40, 62) 66.41%, rgb(98, 61, 83) 103.41%, rgb(140, 81, 102) 132.18%)'
      }}>
        {/* Forest Bottom */}
        <div className="absolute w-full h-full left-0 pointer-events-none overflow-hidden">
          <svg className="w-full absolute bottom-0" viewBox="0 0 1920 400" fill="none" xmlns="http://www.w3.org/2000/svg" opacity="0.5">
            <path d="M0 400V250C150 200 300 180 450 200C600 220 750 180 900 160C1050 140 1200 150 1350 180C1500 210 1650 190 1800 170C1920 155 1920 155 1920 155V400H0Z" fill="#0D0E15" fillOpacity="0.8"/>
            <path d="M0 400V280C150 250 300 240 450 260C600 280 750 250 900 235C1050 220 1200 230 1350 255C1500 280 1650 265 1800 245C1920 232 1920 232 1920 232V400H0Z" fill="#0D0E15" fillOpacity="0.6"/>
          </svg>
        </div>

        <div className="relative w-full max-w-[1240px] mx-auto px-6 lg:px-10">
          {/* Section Header - Compact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ 
              duration: 0.4,
              ease: "easeOut"
            }}
            className="text-center mb-16"
          >
            <h2 className="text-white text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {t[language].whatCanYouDo}
            </h2>
            <p className="text-base text-gray-200 max-w-2xl mx-auto">
              {t[language].whatCanYouDoDesc}
            </p>
          </motion.div>

          {/* Feature Grid - Compact 3-Column */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Music Feature - Compact */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.4,
                delay: 0,
                ease: [0.16, 1, 0.3, 1]
              }}
              whileHover={{ 
                scale: 1.03,
                transition: { duration: 0.15, ease: "easeOut" }
              }}
              className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-200"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 transition-all duration-300"></div>
              <div className="relative p-6">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                  className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-3xl shadow-lg mb-4"
                >
                  🎵
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">Müzik Çal</h3>
                <p className="text-purple-300 text-xs font-medium mb-3">YouTube • Spotify • SoundCloud</p>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  Kristal kalitede müzik, sıra yönetimi ve ses kontrolü.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/10 text-white text-xs font-medium rounded-lg">Sıra</span>
                  <span className="px-3 py-1 bg-white/10 text-white text-xs font-medium rounded-lg">Filtre</span>
                  <span className="px-3 py-1 bg-white/10 text-white text-xs font-medium rounded-lg">Lyrics</span>
        </div>
              </div>
            </motion.div>

            {/* Moderation Feature - Compact */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.4,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
              whileHover={{ 
                scale: 1.03,
                transition: { duration: 0.15, ease: "easeOut" }
              }}
              className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-200"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 transition-all duration-300"></div>
              <div className="relative p-6">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ duration: 0.2 }}
                  className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center text-3xl shadow-lg mb-4"
                >
                  🛡️
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">Akıllı Moderasyon</h3>
                <p className="text-blue-300 text-xs font-medium mb-3">Otomatik • Güvenli • Hızlı</p>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  Spam ve zararlı içerik engellemesi, log kayıtları.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/10 text-white text-xs font-medium rounded-lg">Auto-Mod</span>
                  <span className="px-3 py-1 bg-white/10 text-white text-xs font-medium rounded-lg">Logs</span>
                  <span className="px-3 py-1 bg-white/10 text-white text-xs font-medium rounded-lg">Warn</span>
        </div>
              </div>
            </motion.div>

            {/* Economy Feature - Compact */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ 
            duration: 0.4,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1]
          }}
          whileHover={{ 
            scale: 1.03,
            transition: { duration: 0.15, ease: "easeOut" }
          }}
          className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-green-500/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] transition-all duration-200"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-500/0 group-hover:from-green-500/5 group-hover:to-emerald-500/5 transition-all duration-300"></div>
              <div className="relative p-6">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                  className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center text-3xl shadow-lg mb-4"
                >
                  💰
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">Ekonomi Sistemi</h3>
                <p className="text-green-300 text-xs font-medium mb-3">Para • Mağaza • Casino</p>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  Sanal para, özel mağaza ve casino oyunları.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/10 text-white text-xs font-medium rounded-lg">Daily</span>
                  <span className="px-3 py-1 bg-white/10 text-white text-xs font-medium rounded-lg">Shop</span>
                  <span className="px-3 py-1 bg-white/10 text-white text-xs font-medium rounded-lg">Games</span>
                </div>
              </div>
        </motion.div>

            {/* Leveling Feature - Compact */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.4,
                delay: 0,
                ease: [0.16, 1, 0.3, 1]
              }}
              whileHover={{ 
                scale: 1.03,
                transition: { duration: 0.15, ease: "easeOut" }
              }}
              className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-yellow-500/50 hover:shadow-[0_0_30px_rgba(234,179,8,0.15)] transition-all duration-200"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-orange-500/0 group-hover:from-yellow-500/5 group-hover:to-orange-500/5 transition-all duration-300"></div>
              <div className="relative p-6">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ duration: 0.2 }}
                  className="w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center text-3xl shadow-lg mb-4"
                >
                  ⭐
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">Seviye & Çekiliş</h3>
                <p className="text-yellow-300 text-xs font-medium mb-3">XP • Roller • Giveaway</p>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  XP sistemi, seviye atlama ve heyecan verici çekilişler.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/10 text-white text-xs font-medium rounded-lg">Leveling</span>
                  <span className="px-3 py-1 bg-white/10 text-white text-xs font-medium rounded-lg">Ranks</span>
                  <span className="px-3 py-1 bg-white/10 text-white text-xs font-medium rounded-lg">Giveaway</span>
                </div>
        </div>
            </motion.div>

            {/* Social Media - Compact */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.4,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
              whileHover={{ 
                scale: 1.03,
                transition: { duration: 0.15, ease: "easeOut" }
              }}
              className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-pink-500/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] transition-all duration-200"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-rose-500/0 group-hover:from-pink-500/5 group-hover:to-rose-500/5 transition-all duration-300"></div>
              <div className="relative p-6">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                  className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center text-3xl shadow-lg mb-4"
                >
                  📱
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">Sosyal Medya</h3>
                <p className="text-pink-300 text-xs font-medium mb-3">Twitch • YouTube • X (Twitter)</p>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  Canlı yayın ve sosyal medya bildirimleri.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/10 text-white text-xs font-medium rounded-lg">Twitch</span>
                  <span className="px-3 py-1 bg-white/10 text-white text-xs font-medium rounded-lg">YouTube</span>
                  <span className="px-3 py-1 bg-white/10 text-white text-xs font-medium rounded-lg">RSS</span>
                </div>
        </div>
            </motion.div>

            {/* AI & Custom - Compact */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ 
            duration: 0.4,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1]
          }}
          whileHover={{ 
            scale: 1.03,
            transition: { duration: 0.15, ease: "easeOut" }
          }}
          className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-200"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-teal-500/0 group-hover:from-cyan-500/5 group-hover:to-teal-500/5 transition-all duration-300"></div>
              <div className="relative p-6">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ duration: 0.2 }}
                  className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center text-3xl shadow-lg mb-4"
                >
                  ✨
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">AI & Özelleştirme</h3>
                <p className="text-cyan-300 text-xs font-medium mb-3">Avatar • İsim • Kişilik</p>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  Yapay zeka destekli özelleştirme ve branding.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/10 text-white text-xs font-medium rounded-lg">AI Chat</span>
                  <span className="px-3 py-1 bg-white/10 text-white text-xs font-medium rounded-lg">Custom</span>
                  <span className="px-3 py-1 bg-white/10 text-white text-xs font-medium rounded-lg">Brand</span>
                </div>
              </div>
        </motion.div>
          </div>

          {/* Bottom CTA - Compact */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ 
              duration: 0.7, 
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1],
              type: "spring",
              stiffness: 100,
              damping: 20
            }}
            className="mt-12 text-center"
          >
          <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-gray-200 text-base mb-6"
          >
              Ve daha fazlası! <span className="text-white font-bold">50+ özellik</span> ile sunucunu kontrol et.
          </motion.p>
            <motion.a
              href="https://discord.com/oauth2/authorize?response_type=code&redirect_uri=https%3A%2F%2Fneuroviabot.xyz%2Fapi%2Fauth%2Fcallback&scope=identify%20email%20guilds&client_id=773539215098249246"
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center gap-3 px-8 py-4 overflow-hidden rounded-2xl text-white text-base font-bold shadow-xl transition-all duration-300 hover:shadow-2xl"
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#5865F2] via-[#7289DA] to-[#5865F2] bg-[length:200%_100%] group-hover:bg-[length:100%_100%] transition-all duration-500"></div>
              
              {/* Animated glow layer */}
              <motion.div
                animate={{
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-[#5865F2] blur-xl opacity-60"
              />
              
              {/* Top shine bar */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
              
              {/* Content */}
              <div className="relative z-10 flex items-center gap-3">
                {/* Discord icon with bounce */}
                <motion.svg 
                  className="w-6 h-6" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                  whileHover={{ 
                    rotate: [0, -10, 10, -10, 0],
                    transition: { duration: 0.5 }
                  }}
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </motion.svg>
                
                <span className="font-bold tracking-wide">Hemen Başla - Ücretsiz</span>
                
                {/* Arrow with slide animation */}
                <motion.svg 
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  initial={{ x: 0 }}
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </motion.svg>
        </div>

              {/* Bottom glow ring */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-white/20 group-hover:ring-white/40 transition-all duration-300"></div>
            </motion.a>
          </motion.div>
            </div>
      </section>

      {/* Footer - Smooth Animated & Hero-Style */}
      <footer className="relative z-10 overflow-hidden" style={{
        background: 'linear-gradient(rgb(33, 32, 54) 0%, rgb(51, 40, 62) 30%, rgb(98, 61, 83) 60%, rgb(140, 81, 102) 100%)'
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
                  <svg 
                    className="w-7 h-7 text-white" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
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
                {["Özellikler", "Sunucularım", "Botu Ekle"].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.05 }}
                  >
                    <a 
                      href={i === 0 ? "/ozellikler" : i === 1 ? "/servers" : "https://discord.com/oauth2/authorize?response_type=code&redirect_uri=https%3A%2F%2Fneuroviabot.xyz%2Fapi%2Fauth%2Fcallback&scope=identify%20email%20guilds&client_id=773539215098249246"} 
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
                <motion.a
                  href="/privacy"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                  whileHover={{ y: -2 }}
                  className="text-gray-300 hover:text-white transition-all text-sm"
                >
                  Gizlilik Politikası
                </motion.a>
                <motion.a
                  href="/terms"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  whileHover={{ y: -2 }}
                  className="text-gray-300 hover:text-white transition-all text-sm"
                >
                  Kullanım Şartları
                </motion.a>
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

