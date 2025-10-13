'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  SparklesIcon,
  RocketLaunchIcon,
  HeartIcon,
  UserGroupIcon,
  CodeBracketIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

export default function AboutPage() {
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
            <SparklesIcon className="w-12 h-12 text-purple-400" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            Hakkımızda
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discord sunucularını güçlendiren yeni nesil bot platformu
          </p>
        </motion.div>

        {/* Our Story */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-20"
        >
          <div className="relative p-10 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 shadow-xl overflow-hidden">
            <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
                <RocketLaunchIcon className="w-8 h-8 text-purple-400" />
                Hikayemiz
              </h2>
              <div className="space-y-4 text-gray-300 text-lg">
                <p>
                  Neurovia, Discord topluluklarına güç katmak amacıyla 2024 yılında kuruldu. Amacımız, sunucu yöneticilerine kapsamlı, kullanımı kolay ve özelleştirilebilir bir bot deneyimi sunmaktı.
                </p>
                <p>
                  Bugün binlerce sunucuya hizmet veren Neurovia, sürekli gelişiyor ve kullanıcı geri bildirimlerine dayalı olarak yeni özellikler ekleniyor. Moderasyon araçlarından ekonomi sistemine, oyunlardan analitiklere kadar geniş bir yelpazede özellik sunuyoruz.
                </p>
                <p>
                  Vizyonumuz, her Discord sunucusunun eşsiz ihtiyaçlarına uyum sağlayabilen, güçlü ve esnek bir bot platformu olmak.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative p-8 rounded-3xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 shadow-xl overflow-hidden"
          >
            <HeartIcon className="w-10 h-10 text-purple-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-white">Misyonumuz</h3>
            <p className="text-gray-300">
              Discord sunucularını daha güvenli, eğlenceli ve yönetilebilir hale getirmek. Kullanıcılarımıza en iyi deneyimi sunmak için sürekli yenilik yapıyoruz.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative p-8 rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 shadow-xl overflow-hidden"
          >
            <SparklesIcon className="w-10 h-10 text-blue-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-white">Vizyonumuz</h3>
            <p className="text-gray-300">
              Discord ekosisteminin vazgeçilmez bir parçası olmak. Her büyüklükteki topluluk için erişilebilir, güvenilir ve yenilikçi çözümler sunmak.
            </p>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold mb-10 text-center text-white">Sayılarla Neurovia</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: UserGroupIcon, value: '50K+', label: 'Kullanıcı', color: 'from-purple-500 to-pink-500' },
              { icon: RocketLaunchIcon, value: '1K+', label: 'Sunucu', color: 'from-blue-500 to-cyan-500' },
              { icon: CodeBracketIcon, value: '39+', label: 'Komut', color: 'from-green-500 to-emerald-500' },
              { icon: ChartBarIcon, value: '99.9%', label: 'Uptime', color: 'from-amber-500 to-orange-500' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className="relative group"
              >
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300`}></div>
                <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 text-center">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-purple-400" />
                  <div className={`text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r ${stat.color}`}>
                    {stat.value}
                  </div>
                  <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technologies */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <div className="relative p-10 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 shadow-xl overflow-hidden">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
                <CodeBracketIcon className="w-8 h-8 text-blue-400" />
                Kullandığımız Teknolojiler
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Discord.js v14', 'Node.js', 'Next.js 14', 'TypeScript', 'Socket.IO', 'Express', 'React', 'Tailwind CSS'].map((tech, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 + index * 0.05 }}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-center text-gray-300 hover:bg-white/10 transition-all"
                  >
                    {tech}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

