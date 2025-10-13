'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const feedbackTypes = [
  {
    icon: <HandThumbUpIcon className="w-6 h-6" />,
    value: 'positive',
    label: 'Pozitif Geri Bildirim',
    description: 'Beğendiğiniz özellikler hakkında',
    emoji: '😊'
  },
  {
    icon: <HandThumbDownIcon className="w-6 h-6" />,
    value: 'negative',
    label: 'Negatif Geri Bildirim',
    description: 'Geliştirilmesi gereken alanlar',
    emoji: '😕'
  },
  {
    icon: <LightBulbIcon className="w-6 h-6" />,
    value: 'suggestion',
    label: 'Öneri',
    description: 'Yeni özellik fikirleri',
    emoji: '💡'
  },
  {
    icon: <ExclamationTriangleIcon className="w-6 h-6" />,
    value: 'issue',
    label: 'Sorun Bildirimi',
    description: 'Karşılaştığınız problemler',
    emoji: '⚠️'
  }
];

const experienceAreas = [
  'NRC Ekonomi Sistemi',
  'P2P Trading',
  'Moderasyon & Auto-Mod',
  'Ticket Sistemi',
  'Çekiliş Sistemi',
  'Leveling Sistemi',
  'Dashboard Arayüzü',
  'Bot Performansı',
  'Komut Kullanımı',
  'Destek Hizmeti',
  'Dokümantasyon',
  'Pazar Yeri',
  'Yatırım & Staking'
];

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    discordTag: '',
    serverName: '',
    feedbackType: '',
    rating: 0,
    experienceAreas: [] as string[],
    title: '',
    message: ''
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [stats, setStats] = useState({ total: 0, implemented: 0, resolved: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const apiUrl = (process.env as any).NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
      const response = await axios.get(`${apiUrl}/api/feedback/stats`);
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch feedback stats:', error);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const apiUrl = (process.env as any).NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
      const response = await fetch(`${apiUrl}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to submit');

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        discordTag: '',
        serverName: '',
        feedbackType: '',
        rating: 0,
        experienceAreas: [],
        title: '',
        message: ''
      });

      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Feedback form error:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const toggleExperienceArea = (area: string) => {
    setFormData(prev => ({
      ...prev,
      experienceAreas: prev.experienceAreas.includes(area)
        ? prev.experienceAreas.filter(a => a !== area)
        : [...prev.experienceAreas, area]
    }));
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0a0b0f] via-[#13151f] to-[#1a1c2e] text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 py-20 pt-32">
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

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-block p-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl mb-6"
          >
            <ChatBubbleLeftRightIcon className="w-12 h-12 text-purple-400" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            Geri Bildiriminiz Bizim İçin Değerli
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Neurovia'u daha iyi hale getirmemize yardımcı olun. Deneyimlerinizi, önerilerinizi ve görüşlerinizi bizimle paylaşın.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Feedback Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 shadow-xl overflow-hidden">
              {/* Glow Effect */}
              <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" />

              <form onSubmit={handleSubmit} className="relative space-y-6">
                {/* Name & Email */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2">
                      Ad Soyad *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                      E-posta Adresi *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                {/* Discord Tag & Server Name */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="discordTag" className="block text-sm font-semibold text-gray-300 mb-2">
                      Discord Kullanıcı Adı
                    </label>
                    <input
                      type="text"
                      id="discordTag"
                      name="discordTag"
                      value={formData.discordTag}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                      placeholder="username"
                    />
                  </div>
                  <div>
                    <label htmlFor="serverName" className="block text-sm font-semibold text-gray-300 mb-2">
                      Sunucu Adı (İsteğe bağlı)
                    </label>
                    <input
                      type="text"
                      id="serverName"
                      name="serverName"
                      value={formData.serverName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                      placeholder="My Awesome Server"
                    />
                  </div>
                </div>

                {/* Feedback Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Geri Bildirim Türü *
                  </label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {feedbackTypes.map((type) => (
                      <label
                        key={type.value}
                        className={`relative flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                          formData.feedbackType === type.value
                            ? 'bg-purple-500/20 border-purple-500/50'
                            : 'bg-white/5 border-white/10 hover:border-purple-500/30'
                        }`}
                      >
                        <input
                          type="radio"
                          name="feedbackType"
                          value={type.value}
                          checked={formData.feedbackType === type.value}
                          onChange={handleChange}
                          className="sr-only"
                          required
                        />
                        <div className="text-2xl">{type.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-white">{type.label}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{type.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Genel Memnuniyet Puanı *
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform hover:scale-110"
                      >
                        {star <= (hoverRating || formData.rating) ? (
                          <StarIconSolid className="w-10 h-10 text-yellow-400" />
                        ) : (
                          <StarIcon className="w-10 h-10 text-gray-600" />
                        )}
                      </button>
                    ))}
                    <span className="ml-4 text-gray-400 text-sm">
                      {formData.rating > 0 ? `${formData.rating}/5` : 'Puan verin'}
                    </span>
                  </div>
                </div>

                {/* Experience Areas */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Hangi alanlar hakkında geri bildirim veriyorsunuz? (Birden fazla seçebilirsiniz)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {experienceAreas.map((area) => (
                      <button
                        key={area}
                        type="button"
                        onClick={() => toggleExperienceArea(area)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                          formData.experienceAreas.includes(area)
                            ? 'bg-purple-500/20 border-purple-500/50 text-white'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-purple-500/30'
                        }`}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-300 mb-2">
                    Başlık *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    placeholder="Kısaca özetleyin"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-300 mb-2">
                    Detaylı Açıklama *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none"
                    placeholder="Deneyimlerinizi, önerilerinizi veya karşılaştığınız sorunları detaylı olarak anlatın..."
                  />
                </div>

                {/* Submit Status */}
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-4 bg-green-500/20 border border-green-500/50 rounded-xl"
                  >
                    <CheckCircleIcon className="w-6 h-6 text-green-400" />
                    <div>
                      <div className="text-sm font-semibold text-green-400">Geri bildiriminiz alındı!</div>
                      <div className="text-xs text-gray-300">Değerli geri bildiriminiz için teşekkür ederiz. 💜</div>
                    </div>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-4 bg-red-500/20 border border-red-500/50 rounded-xl"
                  >
                    <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
                    <div>
                      <div className="text-sm font-semibold text-red-400">Bir hata oluştu</div>
                      <div className="text-xs text-gray-300">Lütfen daha sonra tekrar deneyin.</div>
                    </div>
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || formData.rating === 0}
                  className="w-full relative group px-8 py-4 text-base font-bold overflow-hidden rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {/* Background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 transition-transform group-hover:scale-105" />
                  {/* Border glow */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_20px_rgba(168,85,247,0.5)]" />
                  {/* Content */}
                  <span className="relative flex items-center justify-center gap-2">
                    <ChatBubbleLeftRightIcon className="w-5 h-5" />
                    {isSubmitting ? 'Gönderiliyor...' : 'Geri Bildirimi Gönder'}
                  </span>
                </button>
              </form>
            </div>
          </motion.div>

          {/* Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-6"
          >
            {/* Why Feedback Matters */}
            <div className="relative p-6 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 shadow-xl overflow-hidden">
              <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" />
              <div className="relative">
                <LightBulbIcon className="w-10 h-10 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">Geri Bildiriminiz Neden Önemli?</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Her geri bildiriminiz, Neurovia'u daha iyi hale getirmemize yardımcı olur. Kullanıcılarımızın deneyimleri bizim için en değerli rehberdir.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="relative p-6 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 shadow-xl overflow-hidden">
              <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
              <div className="relative">
                <h3 className="text-xl font-bold mb-4">İstatistikler</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Geri Bildirim</span>
                    <span className="text-white font-bold">{stats.total}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Uygulanan Öneri</span>
                    <span className="text-green-400 font-bold">{stats.implemented}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Çözülen Sorun</span>
                    <span className="text-blue-400 font-bold">{stats.resolved}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Alternative Contact */}
            <div className="relative p-6 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 shadow-xl overflow-hidden">
              <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" />
              <div className="relative">
                <h3 className="text-xl font-bold mb-2">Hemen İletişime Geç</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Acil bir sorununuz mu var?
                </p>
                <Link
                  href="/iletisim"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-semibold"
                >
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  Bize Ulaşın
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

