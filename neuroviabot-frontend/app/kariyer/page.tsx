'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  BriefcaseIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  HeartIcon,
  RocketLaunchIcon,
  UserGroupIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';

const openPositions = [
  {
    title: 'Senior Backend Developer',
    department: 'Mühendislik',
    location: 'Uzaktan',
    type: 'Tam Zamanlı',
    salary: '₺40K - ₺60K',
    description: 'Discord.js ve Node.js konusunda deneyimli, ölçeklenebilir sistemler geliştirebilen backend developer arıyoruz.',
  },
  {
    title: 'Frontend Developer',
    department: 'Mühendislik',
    location: 'Uzaktan',
    type: 'Tam Zamanlı',
    salary: '₺35K - ₺50K',
    description: 'React, Next.js ve TypeScript ile modern web uygulamaları geliştirebilen frontend developer arıyoruz.',
  },
  {
    title: 'Community Manager',
    department: 'Topluluk',
    location: 'Uzaktan',
    type: 'Yarı Zamanlı',
    salary: '₺15K - ₺25K',
    description: 'Discord topluluğumuzu yönetecek, kullanıcılarla etkileşim kuracak ve feedback toplayacak community manager arıyoruz.',
  },
];

const benefits = [
  {
    icon: RocketLaunchIcon,
    title: 'Uzaktan Çalışma',
    description: 'Dünyanın her yerinden çalışma özgürlüğü',
  },
  {
    icon: AcademicCapIcon,
    title: 'Sürekli Gelişim',
    description: 'Eğitim ve gelişim fırsatları',
  },
  {
    icon: UserGroupIcon,
    title: 'Harika Ekip',
    description: 'Tutkulu ve yetenekli ekip arkadaşları',
  },
  {
    icon: HeartIcon,
    title: 'İş-Yaşam Dengesi',
    description: 'Esnek çalışma saatleri ve yıllık izin',
  },
];

export default function CareersPage() {
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);

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
            <BriefcaseIcon className="w-12 h-12 text-purple-400" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            Kariyer
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Neurovia ailesine katılın ve Discord ekosisteminin geleceğini şekillendirin
          </p>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold mb-10 text-center text-white">Neden Neurovia?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 shadow-xl hover:border-purple-500/30 transition-all"
              >
                <benefit.icon className="w-10 h-10 text-purple-400 mb-4" />
                <h3 className="text-lg font-bold mb-2 text-white">{benefit.title}</h3>
                <p className="text-gray-400 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Open Positions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-10 text-center text-white">Açık Pozisyonlar</h2>
          <div className="space-y-4">
            {openPositions.map((position, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-purple-500/30 transition-all cursor-pointer"
                     onClick={() => setSelectedPosition(selectedPosition === index ? null : index)}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{position.title}</h3>
                      <p className="text-gray-400 mb-3">{position.description}</p>
                      <div className="flex flex-wrap gap-3">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400 text-sm">
                          <BriefcaseIcon className="w-4 h-4" />
                          {position.department}
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-sm">
                          <MapPinIcon className="w-4 h-4" />
                          {position.location}
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm">
                          <ClockIcon className="w-4 h-4" />
                          {position.type}
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 text-sm">
                          <CurrencyDollarIcon className="w-4 h-4" />
                          {position.salary}
                        </span>
                      </div>
                    </div>
                    <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all">
                      Başvur
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {openPositions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Şu anda açık pozisyon bulunmamaktadır.</p>
              <p className="text-gray-500 mt-2">Yakında yeni pozisyonlar açılacaktır. Bizi takipte kalın!</p>
            </div>
          )}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-20 text-center"
        >
          <div className="relative p-10 rounded-3xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 shadow-xl overflow-hidden">
            <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-bold mb-4 text-white">Pozisyonunuza Uygun Bir İlan Bulamadınız mı?</h2>
              <p className="text-gray-300 mb-6">
                Yine de başvurunuzu bize gönderin! Yetenekli insanlarla çalışmayı seviyoruz.
              </p>
              <a
                href="mailto:careers@neurovia.xyz"
                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                İletişime Geç
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

