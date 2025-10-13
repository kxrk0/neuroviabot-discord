'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, QuestionMarkCircleIcon, ChatBubbleLeftRightIcon, BookOpenIcon } from '@heroicons/react/24/outline';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="h-20"></div>
      
      <div className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
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
          className="text-center mb-16"
        >
          <div className="inline-block p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl mb-6">
            <QuestionMarkCircleIcon className="w-12 h-12 text-blue-400" />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
            Destek Merkezi
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Size yardımcı olmak için buradayız
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6 hover:scale-105 transition-transform"
          >
            <ChatBubbleLeftRightIcon className="w-10 h-10 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Discord Sunucusu</h3>
            <p className="text-gray-400 mb-4">Topluluğumuzla sohbet edin ve anlık destek alın</p>
            <a
              href="https://discord.gg/Neurovia"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sunucuya Katıl
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 hover:scale-105 transition-transform"
          >
            <BookOpenIcon className="w-10 h-10 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Dokümantasyon</h3>
            <p className="text-gray-400 mb-4">Detaylı kullanım kılavuzu ve API dökümanları</p>
            <Link
              href="/api-dokumantasyon"
              className="inline-block px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Dokümanlara Git
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6 hover:scale-105 transition-transform"
          >
            <ChatBubbleLeftRightIcon className="w-10 h-10 text-green-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Geri Bildirim</h3>
            <p className="text-gray-400 mb-4">Önerilerinizi ve sorunlarınızı bildirin</p>
            <Link
              href="/geri-bildirim"
              className="inline-block px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              Geri Bildirim Gönder
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-600 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold mb-6">Sık Sorulan Sorular</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-2">Botu nasıl eklerim?</h3>
              <p className="text-gray-400">Ana sayfadaki "Botu Ekle" butonuna tıklayarak Discord yetkilendirme sayfasına yönlendirileceksiniz.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-2">NRC nedir?</h3>
              <p className="text-gray-400">NeuroCoin (NRC), botumuzun kendi ekonomi sistemi için kullanılan sanal para birimidir.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-2">Premium özellikleri nelerdir?</h3>
              <p className="text-gray-400">Premium üyelikle gelişmiş analitik, özel komutlar ve öncelikli destek gibi özelliklere erişebilirsiniz.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
