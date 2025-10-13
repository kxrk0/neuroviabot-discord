'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  LifebuoyIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  ChevronDownIcon,
  TicketIcon,
} from '@heroicons/react/24/outline';

const faqs = [
  {
    question: 'NeuroViaBot nasıl kurulur?',
    answer: 'Botumuz Discord.com/oauth2/authorize linki ile sunucunuza ekleyebilirsiniz. Kurulum sonrası /setup komutunu kullanarak hızlı kurulum yapabilirsiniz.',
  },
  {
    question: 'Premium özellikler nelerdir?',
    answer: 'Premium üyelerimiz gelişmiş ekonomi sistemi, özel destek, sınırsız özel komutlar ve reklamsız deneyimin keyfini çıkarır.',
  },
  {
    question: 'NRC ekonomi sistemi nasıl etkinleştirilir?',
    answer: '/economy settings komutu ile ekonomi sistemini etkinleştirebilir ve özelleştirebilirsiniz. Detaylı rehber için blog sayfamızı ziyaret edin.',
  },
  {
    question: 'Bot çalışmıyor, ne yapmalıyım?',
    answer: 'Öncelikle botun gerekli izinlere sahip olduğundan emin olun. Sorun devam ederse Discord sunucumuzdan destek alabilirsiniz.',
  },
  {
    question: 'Veri güvenliği nasıl sağlanıyor?',
    answer: 'Tüm verileriniz şifreli olarak saklanır ve 3. taraflarla paylaşılmaz. GDPR ve KVKK uyumlu çalışıyoruz.',
  },
  {
    question: 'Özel komut nasıl oluşturulur?',
    answer: '/custom create komutu ile özel komutlar oluşturabilirsiniz. Premium kullanıcılar sınırsız özel komut oluşturabilir.',
  },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert('Mesajınız gönderildi! En kısa sürede size dönüş yapacağız.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

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
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block p-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl mb-6"
          >
            <LifebuoyIcon className="w-12 h-12 text-purple-400" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            Destek
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Size yardımcı olmak için buradayız
          </p>
        </motion.div>

        {/* Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <motion.a
            href="https://discord.gg/neurovia"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700 hover:border-purple-500/30 transition-all text-center">
              <ChatBubbleLeftRightIcon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Discord Sunucusu</h3>
              <p className="text-gray-400">Topluluğumuzdan anında destek alın</p>
            </div>
          </motion.a>

          <motion.a
            href="mailto:support@neurovia.xyz"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700 hover:border-blue-500/30 transition-all text-center">
              <EnvelopeIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">E-posta</h3>
              <p className="text-gray-400">support@neurovia.xyz</p>
            </div>
          </motion.a>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700 hover:border-green-500/30 transition-all text-center">
              <TicketIcon className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Ticket Sistemi</h3>
              <p className="text-gray-400">Dashboard üzerinden ticket açın</p>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold mb-10 text-center text-white">Sık Sorulan Sorular</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.05 }}
                className="relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 shadow-xl hover:border-purple-500/30 transition-all"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h3 className="text-lg font-bold text-white pr-4">{faq.question}</h3>
                  <motion.div
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDownIcon className="w-6 h-6 text-purple-400" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 text-gray-300">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <div className="relative p-10 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 shadow-xl overflow-hidden">
            <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-bold mb-6 text-white text-center">Bize Ulaşın</h2>
              <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Adınız Soyadınız"
                    required
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="E-posta Adresiniz"
                    required
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Konu"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                />
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Mesajınız"
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none resize-none"
                />
                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  Gönder
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

