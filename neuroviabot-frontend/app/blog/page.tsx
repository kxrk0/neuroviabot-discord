'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, NewspaperIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';

export default function BlogPage() {
  const posts = [
    {
      title: 'Neurovia 2.0 Güncellemesi',
      excerpt: 'Yeni NRC ekonomi sistemi, gelişmiş moderasyon ve daha fazlası...',
      date: '13 Ocak 2025',
      author: 'NeuroVia Team',
      category: 'Güncellemeler'
    },
    {
      title: 'Discord Sunucunuzu Nasıl Büyütürsünüz?',
      excerpt: 'Etkili stratejiler ve ipuçları ile topluluğunuzu geliştirin',
      date: '10 Ocak 2025',
      author: 'NeuroVia Team',
      category: 'Rehber'
    },
    {
      title: 'NRC Ekonomi Sistemi Detayları',
      excerpt: 'NeuroCoin ile sunucunuzda dinamik bir ekonomi oluşturun',
      date: '5 Ocak 2025',
      author: 'NeuroVia Team',
      category: 'Özellikler'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="h-20"></div>
      
      <div className="max-w-6xl mx-auto px-6 py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-10">
          <ArrowLeftIcon className="w-5 h-5" />
          Ana Sayfaya Dön
        </Link>

        <div className="text-center mb-16">
          <NewspaperIcon className="w-16 h-16 text-blue-400 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
            Blog
          </h1>
          <p className="text-xl text-gray-300">Güncellemeler, rehberler ve daha fazlası</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-600 rounded-2xl p-6 hover:scale-105 transition-transform cursor-pointer"
            >
              <span className="inline-block px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs mb-4">
                {post.category}
              </span>
              <h2 className="text-xl font-bold mb-3">{post.title}</h2>
              <p className="text-gray-400 mb-4">{post.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4" />
                  {post.date}
                </div>
                <div className="flex items-center gap-1">
                  <UserIcon className="w-4 h-4" />
                  {post.author}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400">Daha fazla içerik yakında...</p>
        </div>
      </div>
    </div>
  );
}
