'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  NewspaperIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  ClockIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

const blogPosts = [
  {
    id: 1,
    title: 'NeuroViaBot v2.0 Yayınlandı!',
    excerpt: 'Yeni ekonomi sistemi, gelişmiş moderasyon ve daha fazlası ile NeuroViaBot v2.0 yayında.',
    category: 'Güncelleme',
    date: '15 Ocak 2025',
    readTime: '5 dk',
    image: '/blog/v2-release.jpg',
    author: 'Neurovia Ekibi',
  },
  {
    id: 2,
    title: 'NeuroCoin (NRC) Ekonomi Sistemi Rehberi',
    excerpt: 'NRC ekonomi sistemini nasıl kullanacağınızı ve sunucunuzda nasıl etkinleştireceğinizi öğrenin.',
    category: 'Rehber',
    date: '10 Ocak 2025',
    readTime: '8 dk',
    image: '/blog/nrc-guide.jpg',
    author: 'Ahmet Yılmaz',
  },
  {
    id: 3,
    title: 'Discord Sunucunuzu Daha Güvenli Hale Getirin',
    excerpt: 'Auto-moderation ve raid protection özellikleri ile sunucunuzu koruyun.',
    category: 'Güvenlik',
    date: '5 Ocak 2025',
    readTime: '6 dk',
    image: '/blog/security-tips.jpg',
    author: 'Zeynep Kaya',
  },
];

const categories = ['Tümü', 'Güncelleme', 'Rehber', 'Güvenlik', 'İpuçları', 'Duyuru'];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'Tümü' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(rgb(19, 21, 31) -4.84%, rgb(29, 28, 47) 34.9%, rgb(33, 32, 54) 48.6%, rgb(51, 40, 62) 66.41%, rgb(98, 61, 83) 103.41%, rgb(140, 81, 102) 132.18%)'
    }}>
      {/* Navbar Spacer */}
      <div className="h-20"></div>

      <div className="max-w-6xl mx-auto px-6 py-20">
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

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block p-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl mb-6"
          >
            <NewspaperIcon className="w-12 h-12 text-purple-400" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            Blog
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Son güncellemeler, rehberler ve ipuçları
          </p>
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          {/* Search Bar */}
          <div className="relative mb-6">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Blog yazılarında ara..."
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all">
                {/* Image Placeholder */}
                <div className="w-full h-48 bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                  <NewspaperIcon className="w-16 h-16 text-purple-400 opacity-50" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-400">
                      <TagIcon className="w-3 h-3" />
                      {post.category}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-gray-400 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-sm text-gray-400">Yazar: {post.author}</p>
                  </div>
                </div>

                <Link href={`/blog/${post.id}`} className="absolute inset-0"></Link>
              </div>
            </motion.article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <NewspaperIcon className="w-20 h-20 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Aradığınız kriterlere uygun blog yazısı bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
}

