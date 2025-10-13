'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  TicketIcon,
  GiftIcon,
  SparklesIcon,
  BoltIcon,
  CommandLineIcon,
  UserGroupIcon,
  ArrowLeftIcon,
  ShoppingBagIcon,
  ArrowsRightLeftIcon,
  ChartPieIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';

export default function FeaturesPage() {
  const features = [
    {
      icon: CurrencyDollarIcon,
      title: 'NeuroCoin (NRC) Ekonomisi',
      description: 'Tam özellikli kripto-benzeri ekonomi sistemi',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/10 to-pink-500/10',
      tags: ['Daily/Work', 'Transfer', 'Banka Sistemi', 'Leaderboard'],
      status: 'active'
    },
    {
      icon: ArrowsRightLeftIcon,
      title: 'P2P Trading Network',
      description: 'Kullanıcılar arası güvenli ticaret',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/10',
      tags: ['Escrow', 'Counter-Offer', 'Trade History', 'Reputation'],
      status: 'active'
    },
    {
      icon: ChartPieIcon,
      title: 'Investment & Staking',
      description: 'NRC yatırım ve kredi sistemi',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/10 to-emerald-500/10',
      tags: ['Staking', 'Interest', 'Loans', 'Credit Score'],
      status: 'active'
    },
    {
      icon: ShoppingBagIcon,
      title: 'Global Marketplace',
      description: 'Sunucular arası pazar yeri',
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-500/10 to-orange-500/10',
      tags: ['Cross-Server', 'Tax System', 'Guild Treasury', 'Categories'],
      status: 'active'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Advanced Auto-Moderation',
      description: 'Gelişmiş otomatik moderasyon',
      gradient: 'from-red-500 to-rose-500',
      bgGradient: 'from-red-500/10 to-rose-500/10',
      tags: ['Spam Protection', 'Link Filter', 'Word Filter', 'Raid Protection'],
      status: 'active'
    },
    {
      icon: UserGroupIcon,
      title: 'Reaction Roles',
      description: 'Emoji ile rol verme sistemi',
      gradient: 'from-indigo-500 to-purple-500',
      bgGradient: 'from-indigo-500/10 to-purple-500/10',
      tags: ['Bot Messages', 'Multiple Roles', 'Custom Emojis', 'Auto-Setup'],
      status: 'active'
    },
    {
      icon: ChartBarIcon,
      title: 'Leveling & XP System',
      description: 'Seviye ve deneyim sistemi',
      gradient: 'from-blue-500 to-indigo-500',
      bgGradient: 'from-blue-500/10 to-indigo-500/10',
      tags: ['XP Kazanımı', 'Rol Ödülleri', 'Leaderboard', 'Özelleştirilebilir'],
      status: 'active'
    },
    {
      icon: TicketIcon,
      title: 'Ticket System',
      description: 'Profesyonel destek sistemi',
      gradient: 'from-cyan-500 to-teal-500',
      bgGradient: 'from-cyan-500/10 to-teal-500/10',
      tags: ['Support', 'Categories', 'Transcript', 'Auto-Close'],
      status: 'active'
    },
    {
      icon: GiftIcon,
      title: 'Giveaways',
      description: 'Çekiliş ve etkinlik sistemi',
      gradient: 'from-pink-500 to-rose-500',
      bgGradient: 'from-pink-500/10 to-rose-500/10',
      tags: ['Auto Giveaway', 'Winner Selection', 'Requirements', 'Multi-Prize'],
      status: 'active'
    },
    {
      icon: SparklesIcon,
      title: 'Quest System',
      description: 'Görev ve başarım sistemi',
      gradient: 'from-violet-500 to-purple-500',
      bgGradient: 'from-violet-500/10 to-purple-500/10',
      tags: ['Daily Quests', 'Rewards', 'Achievements', 'Progress Tracking'],
      status: 'active'
    },
    {
      icon: CommandLineIcon,
      title: 'Custom Commands',
      description: 'Özel komut oluşturma',
      gradient: 'from-gray-500 to-slate-500',
      bgGradient: 'from-gray-500/10 to-slate-500/10',
      tags: ['Custom Responses', 'Variables', 'Embeds', 'Permissions'],
      status: 'active'
    },
    {
      icon: WrenchScrewdriverIcon,
      title: 'Developer Bot Panel',
      description: 'Geliştiriciler için yönetim paneli',
      gradient: 'from-yellow-500 to-amber-500',
      bgGradient: 'from-yellow-500/10 to-amber-500/10',
      tags: ['Bot Stats', 'Command Manager', 'Database Tools', 'System Control'],
      status: 'active'
    },
  ];

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(rgb(19, 21, 31) -4.84%, rgb(29, 28, 47) 34.9%, rgb(33, 32, 54) 48.6%, rgb(51, 40, 62) 66.41%, rgb(98, 61, 83) 103.41%, rgb(140, 81, 102) 132.18%)'
    }}>
      {/* Navbar Spacer */}
      <div className="h-20"></div>

      {/* Hero Header */}
      <section className="relative px-6 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeftIcon className="w-5 h-5" />
              Ana Sayfaya Dön
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block p-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl mb-6"
            >
              <BoltIcon className="w-12 h-12 text-purple-400" />
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Güçlü Özellikler
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              NeuroViaBot ile Discord sunucunuzu profesyonel bir platforma dönüştürün. 
              <span className="text-purple-400 font-bold"> {features.length}+ özellik</span> ile tam kontrol.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="group relative"
              >
                {/* Glow Effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500`}></div>
                
                {/* Card */}
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8 h-full hover:border-gray-600 transition">
                  {/* Icon */}
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.bgGradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-8 h-8 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent' }} />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                    {feature.title}
                    {feature.status === 'active' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                        Aktif
                      </span>
                    )}
                    {feature.status === 'beta' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        Beta
                      </span>
                    )}
                    {feature.status === 'soon' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Yakında
                      </span>
                    )}
                  </h3>
                  <p className="text-gray-400 mb-6">{feature.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {feature.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300 hover:bg-white/10 transition"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-32">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 p-12 text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 backdrop-blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                Hemen Başlayın
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                NeuroViaBot'u sunucunuza ekleyin ve tüm bu özelliklerin keyfini çıkarın!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://discord.com/oauth2/authorize?client_id=773539215098249246&scope=bot%20applications.commands&permissions=8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white overflow-hidden rounded-xl transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transition-transform group-hover:scale-105"></div>
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_30px_rgba(168,85,247,0.6)]"></div>
                  <span className="relative">Botu Ekle</span>
                </a>
                <Link
                  href="/komutlar"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold border-2 border-white/20 rounded-xl hover:bg-white/5 transition-all"
                >
                  Komutları Gör
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
