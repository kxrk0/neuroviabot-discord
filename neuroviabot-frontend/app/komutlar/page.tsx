'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  MusicalNoteIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  TicketIcon,
  GiftIcon,
  Cog6ToothIcon,
  SparklesIcon,
  CommandLineIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface Command {
  name: string;
  description: string;
  usage: string;
  permissions?: string;
  premium?: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactElement;
  color: string;
  commands: Command[];
}

const commandCategories: Category[] = [
  {
    id: 'music',
    name: 'Müzik Komutları',
    icon: <MusicalNoteIcon className="w-6 h-6" />,
    color: 'green',
    commands: [
      { name: '/play', description: 'YouTube veya Spotify\'dan müzik çalar', usage: '/play <şarkı adı veya URL>' },
      { name: '/play-simple', description: 'Basit müzik çalıcı', usage: '/play-simple <şarkı adı>' },
      { name: '/pause', description: 'Müziği duraklatır', usage: '/pause' },
      { name: '/resume', description: 'Duraklatılmış müziği devam ettirir', usage: '/resume' },
      { name: '/stop', description: 'Müziği durdurur ve kuyruğu temizler', usage: '/stop' },
      { name: '/skip', description: 'Şu anki şarkıyı atlar', usage: '/skip' },
      { name: '/queue', description: 'Müzik kuyruğunu gösterir', usage: '/queue' },
      { name: '/nowplaying', description: 'Çalan şarkı bilgilerini gösterir', usage: '/nowplaying' },
      { name: '/volume', description: 'Ses seviyesini ayarlar', usage: '/volume <0-100>' },
      { name: '/loop', description: 'Şarkı veya kuyruk tekrarını ayarlar', usage: '/loop <mode>' },
      { name: '/shuffle', description: 'Kuyruğu karıştırır', usage: '/shuffle' },
      { name: '/seek', description: 'Şarkının belirli bir yerine atlar', usage: '/seek <saniye>' },
      { name: '/remove', description: 'Kuyruktan şarkı çıkarır', usage: '/remove <numara>' },
      { name: '/join', description: 'Botu ses kanalına çağırır', usage: '/join' },
      { name: '/leave', description: 'Botu ses kanalından çıkarır', usage: '/leave' },
      { name: '/move', description: 'Botu başka kanala taşır', usage: '/move' },
      { name: '/playlist', description: 'Spotify veya YouTube playlist çalar', usage: '/playlist <URL>' }
    ]
  },
  {
    id: 'moderation',
    name: 'Moderasyon Komutları',
    icon: <ShieldCheckIcon className="w-6 h-6" />,
    color: 'red',
    commands: [
      { name: '/moderation', description: 'Moderasyon ayarlarını yapılandırır', usage: '/moderation', permissions: 'Yönetici' },
      { name: '/clear', description: 'Belirtilen sayıda mesajı siler', usage: '/clear <miktar>', permissions: 'Mesajları Yönet' },
      { name: '/clear-messages', description: 'Kullanıcı mesajlarını temizler', usage: '/clear-messages <kullanıcı> <miktar>', permissions: 'Mesajları Yönet' },
      { name: '/guard', description: 'Sunucu koruma sistemini yönetir', usage: '/guard <ayar>', permissions: 'Yönetici' }
    ]
  },
  {
    id: 'neurocoin',
    name: '🪙 NeuroCoin (NRC)',
    icon: <CurrencyDollarIcon className="w-6 h-6" />,
    color: 'purple',
    commands: [
      { name: '/economy balance', description: 'NeuroCoin bakiyeni görüntüle', usage: '/economy balance [kullanıcı]' },
      { name: '/economy daily', description: 'Günlük NRC ödülünü al (500-1000 NRC)', usage: '/economy daily' },
      { name: '/economy work', description: 'Çalış ve NRC kazan (200-500 NRC)', usage: '/economy work' },
      { name: '/economy transfer', description: 'Başka kullanıcıya NRC gönder', usage: '/economy transfer <kullanıcı> <miktar>' },
      { name: '/economy deposit', description: 'Bankaya NRC yatır', usage: '/economy deposit <miktar>' },
      { name: '/economy withdraw', description: 'Bankadan NRC çek', usage: '/economy withdraw <miktar>' },
      { name: '/economy leaderboard', description: 'NRC zenginlik sıralaması', usage: '/economy leaderboard [tür]' },
      { name: '/economy stats', description: 'NRC istatistikleri', usage: '/economy stats [kullanıcı]' },
      { name: '/economy convert', description: 'Eski coinleri NRC\'ye çevir', usage: '/economy convert' },
      { name: '/economy portfolio', description: 'NRC portföyünü görüntüle', usage: '/economy portfolio' }
    ]
  },
  {
    id: 'quest',
    name: '🗺️ Görevler & Başarılar',
    icon: <SparklesIcon className="w-6 h-6" />,
    color: 'blue',
    commands: [
      { name: '/quest list', description: 'Mevcut görevleri görüntüle', usage: '/quest list [tür]' },
      { name: '/quest progress', description: 'Görev ilerlemeni kontrol et', usage: '/quest progress' },
      { name: '/quest claim', description: 'Tamamlanan görev ödülünü al', usage: '/quest claim <görev-id>' },
      { name: '/quest daily', description: 'Günlük görevleri görüntüle', usage: '/quest daily' }
    ]
  },
  {
    id: 'profile',
    name: '👤 Profil & Sosyal',
    icon: <SparklesIcon className="w-6 h-6" />,
    color: 'pink',
    commands: [
      { name: '/profile view', description: 'Profil görüntüle', usage: '/profile view [kullanıcı]' },
      { name: '/profile bio', description: 'Bio ayarla', usage: '/profile bio <metin>' },
      { name: '/profile color', description: 'Profil rengi ayarla', usage: '/profile color <renk>' },
      { name: '/profile badge', description: 'Rozet yönetimi', usage: '/profile badge <işlem> [rozet]' },
      { name: '/leaderboard neurocoin', description: 'NRC sıralaması', usage: '/leaderboard neurocoin [kapsam]' },
      { name: '/leaderboard activity', description: 'Aktivite sıralaması', usage: '/leaderboard activity <tür>' },
      { name: '/leaderboard trading', description: 'Ticaret hacmi sıralaması', usage: '/leaderboard trading' },
      { name: '/leaderboard quests', description: 'Görev tamamlama sıralaması', usage: '/leaderboard quests' },
      { name: '/leaderboard streak', description: 'En uzun streak sıralaması', usage: '/leaderboard streak' }
    ]
  },
  {
    id: 'marketplace',
    name: '🛒 Pazar Yeri',
    icon: <CurrencyDollarIcon className="w-6 h-6" />,
    color: 'yellow',
    commands: [
      { name: '/market-config enable', description: 'Sunucu pazar yerini aç/kapat', usage: '/market-config enable <durum>', permissions: 'Yönetici' },
      { name: '/market-config tax', description: 'İşlem vergisi ayarla', usage: '/market-config tax <oran>', permissions: 'Yönetici' },
      { name: '/market-config allow-global', description: 'Global pazar erişimi', usage: '/market-config allow-global <durum>', permissions: 'Yönetici' },
      { name: '/market-config min-price', description: 'Minimum ilan fiyatı', usage: '/market-config min-price <fiyat>', permissions: 'Yönetici' },
      { name: '/market-config max-price', description: 'Maximum ilan fiyatı', usage: '/market-config max-price <fiyat>', permissions: 'Yönetici' },
      { name: '/market-config blacklist', description: 'Eşya türlerini yasakla', usage: '/market-config blacklist <tür> <yasakla>', permissions: 'Yönetici' },
      { name: '/market-config view', description: 'Mevcut ayarları görüntüle', usage: '/market-config view', permissions: 'Yönetici' },
      { name: '/market-config reset', description: 'Ayarları sıfırla', usage: '/market-config reset', permissions: 'Yönetici' }
    ]
  },
  {
    id: 'games',
    name: '🎮 Oyunlar',
    icon: <SparklesIcon className="w-6 h-6" />,
    color: 'red',
    commands: [
      { name: '/blackjack', description: 'Blackjack oyunu oynar', usage: '/blackjack <miktar>' },
      { name: '/coinflip', description: 'Yazı-tura atar', usage: '/coinflip <miktar> <seçim>' },
      { name: '/dice', description: 'Zar atar', usage: '/dice <miktar>' },
      { name: '/slots', description: 'Slot makinesi oynar', usage: '/slots <miktar>' }
    ]
  },
  {
    id: 'leveling',
    name: 'Seviye Sistemi',
    icon: <ChartBarIcon className="w-6 h-6" />,
    color: 'blue',
    commands: [
      { name: '/level', description: 'Seviye ve XP bilgilerini gösterir', usage: '/level [kullanıcı]' }
    ]
  },
  {
    id: 'ticket',
    name: 'Ticket Sistemi',
    icon: <TicketIcon className="w-6 h-6" />,
    color: 'purple',
    commands: [
      { name: '/ticket', description: 'Ticket sistemini yapılandırır', usage: '/ticket <ayar>', permissions: 'Yönetici' }
    ]
  },
  {
    id: 'giveaway',
    name: 'Çekiliş Sistemi',
    icon: <GiftIcon className="w-6 h-6" />,
    color: 'pink',
    commands: [
      { name: '/giveaway', description: 'Çekiliş başlatır veya yönetir', usage: '/giveaway <komut>', permissions: 'Çekilişleri Yönet' }
    ]
  },
  {
    id: 'admin',
    name: 'Yönetim Komutları',
    icon: <Cog6ToothIcon className="w-6 h-6" />,
    color: 'gray',
    commands: [
      { name: '/setup', description: 'Bot kurulum sihirbazını başlatır', usage: '/setup', permissions: 'Yönetici' },
      { name: '/quicksetup', description: 'Hızlı bot kurulumu yapar', usage: '/quicksetup', permissions: 'Yönetici' },
      { name: '/admin', description: 'Admin panelini açar', usage: '/admin', permissions: 'Yönetici' },
      { name: '/role', description: 'Rol yönetimi yapar', usage: '/role <komut>', permissions: 'Rolleri Yönet' },
      { name: '/backup', description: 'Sunucu yedeği alır veya yükler', usage: '/backup <komut>', permissions: 'Yönetici' },
      { name: '/welcome', description: 'Karşılama sistemini yapılandırır', usage: '/welcome', permissions: 'Yönetici' },
      { name: '/verify', description: 'Doğrulama sistemini ayarlar', usage: '/verify', permissions: 'Yönetici' },
      { name: '/custom', description: 'Özel komutlar oluşturur', usage: '/custom <komut>', permissions: 'Yönetici' }
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    icon: <SparklesIcon className="w-6 h-6" />,
    color: 'gold',
    commands: [
      { name: '/premium', description: 'Premium özelliklerini yönetir', usage: '/premium' }
    ]
  },
  {
    id: 'general',
    name: 'Genel Komutlar',
    icon: <CommandLineIcon className="w-6 h-6" />,
    color: 'indigo',
    commands: [
      { name: '/ping', description: 'Bot gecikme süresini gösterir', usage: '/ping' },
      { name: '/stats', description: 'Bot istatistiklerini gösterir', usage: '/stats' },
      { name: '/yardım', description: 'Komut listesi ve yardım sayfası', usage: '/yardım [kategori]' }
    ]
  }
];

const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  green: { bg: 'bg-green-500/10', border: 'border-green-500/50', text: 'text-green-400', glow: 'from-green-500/10' },
  red: { bg: 'bg-red-500/10', border: 'border-red-500/50', text: 'text-red-400', glow: 'from-red-500/10' },
  yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/50', text: 'text-yellow-400', glow: 'from-yellow-500/10' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/50', text: 'text-blue-400', glow: 'from-blue-500/10' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/50', text: 'text-purple-400', glow: 'from-purple-500/10' },
  pink: { bg: 'bg-pink-500/10', border: 'border-pink-500/50', text: 'text-pink-400', glow: 'from-pink-500/10' },
  gray: { bg: 'bg-gray-500/10', border: 'border-gray-500/50', text: 'text-gray-400', glow: 'from-gray-500/10' },
  gold: { bg: 'bg-amber-500/10', border: 'border-amber-500/50', text: 'text-amber-400', glow: 'from-amber-500/10' },
  indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/50', text: 'text-indigo-400', glow: 'from-indigo-500/10' }
};

export default function CommandsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = commandCategories.map(category => ({
    ...category,
    commands: category.commands.filter(cmd =>
      cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.commands.length > 0);

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
            <CommandLineIcon className="w-12 h-12 text-purple-400" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            Bot Komutları
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            NeuroViaBot'un sunduğu <span className="text-purple-400 font-bold">{commandCategories.reduce((acc, cat) => acc + cat.commands.length, 0)}+ komut</span> ile Discord sunucunuzu bir üst seviyeye taşıyın.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Komut ara... (örn: play, ban, ekonomi)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>
          </div>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {filteredCategories.map((category, index) => {
            const colors = colorMap[category.color] || colorMap.purple;
            return (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
                className={`relative p-6 rounded-2xl border transition-all text-left ${
                  selectedCategory === category.id
                    ? `${colors.bg} ${colors.border}`
                    : 'bg-white/5 border-white/10 hover:border-purple-500/30'
                }`}
              >
                {/* Glow Effect */}
                <div className={`absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br ${colors.glow} to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                
                <div className="relative flex items-center gap-4">
                  <div className={`flex-shrink-0 p-3 rounded-xl ${colors.bg} ${colors.text}`}>
                    {category.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-400">
                      {category.commands.length} komut
                    </p>
                  </div>
                  <motion.div
                    animate={{ rotate: selectedCategory === category.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Command Details */}
        <AnimatePresence mode="wait">
          {selectedCategory && (
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {filteredCategories
                .filter(cat => cat.id === selectedCategory)
                .map(category => {
                  const colors = colorMap[category.color] || colorMap.purple;
                  return (
                    <div key={category.id} className="space-y-4">
                      {category.commands.map((command, index) => (
                        <motion.div
                          key={command.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.05 * index }}
                          className="relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-purple-500/30 transition-all"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <code className={`text-lg font-bold ${colors.text}`}>
                                  {command.name}
                                </code>
                                {command.premium && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 border border-amber-500/50 rounded text-xs text-amber-400 font-semibold">
                                    <SparklesIcon className="w-3 h-3" />
                                    Premium
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-300 mb-3">{command.description}</p>
                              <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                  <span className="text-sm text-gray-500 font-semibold min-w-[80px]">Kullanım:</span>
                                  <code className="text-sm text-purple-400 bg-purple-500/10 px-2 py-1 rounded">
                                    {command.usage}
                                  </code>
                                </div>
                                {command.permissions && (
                                  <div className="flex items-start gap-2">
                                    <span className="text-sm text-gray-500 font-semibold min-w-[80px]">Yetki:</span>
                                    <span className="text-sm text-gray-400">
                                      {command.permissions}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  );
                })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Results */}
        {searchQuery && filteredCategories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <MagnifyingGlassIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-400 mb-2">Komut Bulunamadı</h3>
            <p className="text-gray-500">
              "{searchQuery}" araması için sonuç bulunamadı.
            </p>
          </motion.div>
        )}

        {/* CTA Section */}
        {!selectedCategory && !searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-20"
          >
            <div className="relative p-10 rounded-3xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 overflow-hidden">
              <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl" />
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Botu Sunucuna Ekle
                </h2>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                  Tüm bu güçlü komutları Discord sunucunda kullanmaya başla!
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <a
                    href="https://discord.com/oauth2/authorize?client_id=773539215098249246&scope=bot%20applications.commands&permissions=8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group px-8 py-4 text-base font-bold overflow-hidden rounded-xl transition-all"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_20px_rgba(168,85,247,0.5)]" />
                    <span className="relative">Botu Sunucuna Ekle</span>
                  </a>
                  <Link
                    href="/ozellikler"
                    className="px-8 py-4 text-base font-bold border border-white/20 rounded-xl hover:bg-white/5 transition-all"
                  >
                    Özellikleri Keşfet
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

