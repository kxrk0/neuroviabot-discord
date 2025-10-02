'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MusicalNoteIcon,
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
} from '@heroicons/react/24/outline';

export default function FeaturesPage() {
  const features = [
    {
      icon: ShieldCheckIcon,
      title: 'Moderasyon & Güvenlik',
      description: 'Sunucunuzu güvende tutun',
      gradient: 'from-purple-500 to-blue-500',
      bgGradient: 'from-purple-500/10 to-blue-500/10',
      tags: ['Auto-Mod', 'Spam Koruması', 'Ban/Kick', 'Uyarı Sistemi']
    },
    {
      icon: MusicalNoteIcon,
      title: 'Müzik Sistemi',
      description: 'Yüksek kaliteli müzik deneyimi',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/10 to-emerald-500/10',
      tags: ['YouTube', 'Spotify', 'Kuyruk', 'Kaliteli Ses']
    },
    {
      icon: TicketIcon,
      title: 'Ticket Sistemi',
      description: 'Profesyonel destek sistemi',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/10',
      tags: ['Destek', 'Kategoriler', 'Transcript', 'Otomatik']
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Ekonomi Sistemi',
      description: 'Eğlenceli ekonomi ve seviye',
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-500/10 to-orange-500/10',
      tags: ['Para Kazanma', 'Günlük', 'Seviye', 'Liderlik']
    },
    {
      icon: GiftIcon,
      title: 'Çekiliş & Etkinlik',
      description: 'Heyecan verici çekilişler',
      gradient: 'from-pink-500 to-rose-500',
      bgGradient: 'from-pink-500/10 to-rose-500/10',
      tags: ['Çekiliş', 'Giveaway', 'Roller', 'Otomatik']
    },
    {
      icon: CommandLineIcon,
      title: 'Araçlar & Utilities',
      description: 'Sunucu yönetim araçları',
      gradient: 'from-indigo-500 to-purple-500',
      bgGradient: 'from-indigo-500/10 to-purple-500/10',
      tags: ['Embed', 'Logs', 'Stats', 'Backup']
    },
    {
      icon: BoltIcon,
      title: 'Sosyal Medya',
      description: 'Sosyal medya entegrasyonları',
      gradient: 'from-cyan-500 to-teal-500',
      bgGradient: 'from-cyan-500/10 to-teal-500/10',
      tags: ['Twitch', 'YouTube', 'X', 'Bildirimler']
    },
    {
      icon: SparklesIcon,
      title: 'AI & Özelleştirme',
      description: 'Yapay zeka destekli özellikler',
      gradient: 'from-violet-500 to-purple-500',
      bgGradient: 'from-violet-500/10 to-purple-500/10',
      tags: ['AI Mod', 'Özel Komutlar', 'Kişilik', 'Branding']
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
            className="mb-8"
          >
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Ana Sayfaya Dön</span>
            </Link>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
              Bot <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Özellikleri</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Sunucunu yönetmek ve eğlenceli hale getirmek için ihtiyacın olan her şey burada
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="group relative"
                >
                  {/* Card */}
                  <div className={`relative h-full p-6 rounded-2xl bg-gradient-to-br ${feature.bgGradient} backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300`}>
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    
                    {/* Icon */}
                    <div className="relative mb-4">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-4">
                        {feature.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {feature.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-3 py-1 text-xs font-medium text-gray-300 bg-white/5 rounded-full border border-white/10"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-20 text-center"
          >
            <div className="inline-flex flex-col sm:flex-row gap-4">
              <Link
                href="https://discord.com/oauth2/authorize?client_id=773539215098249246&scope=bot%20applications.commands&permissions=8"
                className="px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300"
              >
                Botu Sunucuna Ekle
              </Link>
              <Link
                href="/servers"
                className="px-8 py-4 text-lg font-bold text-white bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                Dashboard'a Git
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Spacer */}
      <div className="h-20"></div>
    </div>
  );
}

