'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, CodeBracketIcon } from '@heroicons/react/24/outline';

export default function APIDocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="h-20"></div>
      
      <div className="max-w-6xl mx-auto px-6 py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-10">
          <ArrowLeftIcon className="w-5 h-5" />
          Ana Sayfaya Dön
        </Link>

        <div className="text-center mb-16">
          <CodeBracketIcon className="w-16 h-16 text-purple-400 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            API Dokümantasyonu
          </h1>
          <p className="text-xl text-gray-300">NeuroViaBot API kullanım kılavuzu</p>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">API Endpoints</h2>
          <div className="space-y-4">
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <code className="text-green-400">GET /api/bot/stats</code>
              <p className="text-gray-400 mt-2">Bot istatistiklerini getirir</p>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <code className="text-blue-400">POST /api/nrc/transfer</code>
              <p className="text-gray-400 mt-2">NRC transfer işlemi yapar</p>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <code className="text-purple-400">GET /api/guilds/:guildId</code>
              <p className="text-gray-400 mt-2">Sunucu bilgilerini getirir</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
