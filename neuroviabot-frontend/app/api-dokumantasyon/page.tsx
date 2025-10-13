'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  CodeBracketIcon,
  KeyIcon,
  ClipboardDocumentIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const apiEndpoints = [
  {
    method: 'GET',
    endpoint: '/api/bot/stats',
    description: 'Bot istatistiklerini getirir',
    auth: false,
    example: `{
  "guilds": 1000,
  "users": 50000,
  "commands": 39,
  "uptime": 99.9
}`,
  },
  {
    method: 'GET',
    endpoint: '/api/bot/commands/list',
    description: 'Tüm bot komutlarını listeler',
    auth: false,
    example: `{
  "success": true,
  "commands": [...],
  "total": 39
}`,
  },
  {
    method: 'GET',
    endpoint: '/api/guild-management/:guildId/members',
    description: 'Sunucu üyelerini getirir',
    auth: true,
    example: `{
  "members": [...],
  "total": 100
}`,
  },
  {
    method: 'POST',
    endpoint: '/api/economy/transfer',
    description: 'NRC transfer işlemi yapar',
    auth: true,
    example: `{
  "from": "userId1",
  "to": "userId2",
  "amount": 1000
}`,
  },
];

export default function APIDocsPage() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(text);
    setTimeout(() => setCopiedEndpoint(null), 2000);
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
            <CodeBracketIcon className="w-12 h-12 text-purple-400" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            API Dokümantasyonu
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            NeuroViaBot API'sini kullanarak kendi uygulamalarınızı geliştirin
          </p>
        </motion.div>

        {/* Authentication */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 shadow-xl overflow-hidden">
            <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-3">
                <KeyIcon className="w-7 h-7 text-purple-400" />
                Kimlik Doğrulama
              </h2>
              <p className="text-gray-300 mb-4">
                API isteklerinizi yaparken aşağıdaki header'ı eklemeniz gerekmektedir:
              </p>
              <div className="relative">
                <pre className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 text-gray-300 overflow-x-auto">
                  <code>Authorization: Bearer YOUR_API_KEY</code>
                </pre>
                <button
                  onClick={() => copyToClipboard('Authorization: Bearer YOUR_API_KEY')}
                  className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                >
                  <ClipboardDocumentIcon className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-4">
                API anahtarınızı <Link href="/dashboard" className="text-purple-400 hover:text-purple-300">dashboard</Link> üzerinden alabilirsiniz.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Rate Limits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 shadow-xl overflow-hidden">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-3">
                <ShieldCheckIcon className="w-7 h-7 text-blue-400" />
                Rate Limiting
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                  <p className="text-sm text-gray-400 mb-2">Free Tier</p>
                  <p className="text-2xl font-bold text-white">100 <span className="text-sm text-gray-400">/ saat</span></p>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                  <p className="text-sm text-gray-400 mb-2">Pro Tier</p>
                  <p className="text-2xl font-bold text-white">1000 <span className="text-sm text-gray-400">/ saat</span></p>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                  <p className="text-sm text-gray-400 mb-2">Enterprise</p>
                  <p className="text-2xl font-bold text-white">Sınırsız</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* API Endpoints */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-white">API Endpoints</h2>
          <div className="space-y-6">
            {apiEndpoints.map((endpoint, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 shadow-xl hover:border-purple-500/30 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                        endpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-purple-400 font-mono">{endpoint.endpoint}</code>
                      {endpoint.auth && (
                        <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs">Auth Required</span>
                      )}
                    </div>
                    <p className="text-gray-300">{endpoint.description}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(endpoint.endpoint)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all flex items-center gap-2"
                  >
                    <ClipboardDocumentIcon className="w-4 h-4" />
                    {copiedEndpoint === endpoint.endpoint ? 'Kopyalandı!' : 'Kopyala'}
                  </button>
                </div>
                <div className="relative">
                  <p className="text-sm text-gray-400 mb-2">Örnek Response:</p>
                  <pre className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 text-gray-300 overflow-x-auto text-sm">
                    <code>{endpoint.example}</code>
                  </pre>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Support CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-20 text-center"
        >
          <div className="relative p-10 rounded-3xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 shadow-xl overflow-hidden">
            <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-bold mb-4 text-white">API Kullanımında Yardıma mı İhtiyacınız Var?</h2>
              <p className="text-gray-300 mb-6">
                Teknik ekibimiz size yardımcı olmaktan mutluluk duyar.
              </p>
              <Link
                href="/destek"
                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                Destek Al
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

