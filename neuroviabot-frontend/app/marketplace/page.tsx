'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  ShoppingBagIcon,
  SparklesIcon,
  FireIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface MarketItem {
  id: string;
  type: 'role' | 'badge' | 'boost' | 'custom' | 'nft';
  name: string;
  description: string;
  price: number;
  seller: string;
  sellerName: string;
  guildId: string | 'global';
  guildName?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  quantity: number;
  listed: string;
  expires?: string;
  status: 'active' | 'sold' | 'expired';
}

const rarityColors = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-600'
};

const rarityBorders = {
  common: 'border-gray-500',
  rare: 'border-blue-500',
  epic: 'border-purple-500',
  legendary: 'border-yellow-500'
};

const typeIcons = {
  role: '👑',
  badge: '🏅',
  boost: '⚡',
  custom: '✨',
  nft: '🎨'
};

export default function MarketplacePage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  
  const [listings, setListings] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    fetchListings();
  }, [selectedType, selectedRarity, priceRange, sortBy, page]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...(selectedType !== 'all' && { type: selectedType }),
        ...(selectedRarity !== 'all' && { rarity: selectedRarity }),
        minPrice: priceRange[0].toString(),
        maxPrice: priceRange[1].toString(),
        sort: sortBy,
        page: page.toString(),
        limit: '20'
      });

      const response = await fetch(`/api/marketplace/global?${params}`);
      const data = await response.json();

      if (data.success) {
        setListings(data.listings);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Header */}
      <div className="bg-gray-900/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
                <ShoppingBagIcon className="w-10 h-10 text-purple-400" />
                NeuroCoin Marketplace
              </h1>
              <p className="text-gray-400">The Neural Currency of Discord - Global Trading Network</p>
            </div>
            <button
              onClick={() => router.push('/marketplace/create')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Yeni İlan Oluştur
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="İlan ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white hover:bg-gray-700/50 transition-colors flex items-center gap-2"
            >
              <FunnelIcon className="w-5 h-5" />
              Filtreler
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-6 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="newest">En Yeni</option>
              <option value="oldest">En Eski</option>
              <option value="price_low">Ucuzdan Pahalıya</option>
              <option value="price_high">Pahalıdan Ucuza</option>
              <option value="ending_soon">Yakında Bitenler</option>
            </select>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-6 bg-gray-800/50 border border-white/10 rounded-lg"
            >
              <div className="grid grid-cols-3 gap-6">
                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Tür</label>
                  <div className="space-y-2">
                    {['all', 'role', 'badge', 'boost', 'custom', 'nft'].map(type => (
                      <label key={type} className="flex items-center gap-2 text-gray-300 cursor-pointer hover:text-white">
                        <input
                          type="radio"
                          name="type"
                          value={type}
                          checked={selectedType === type}
                          onChange={(e) => setSelectedType(e.target.value)}
                          className="text-purple-600 focus:ring-purple-500"
                        />
                        <span className="capitalize">{type === 'all' ? 'Tümü' : type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rarity Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Nadirlik</label>
                  <div className="space-y-2">
                    {['all', 'common', 'rare', 'epic', 'legendary'].map(rarity => (
                      <label key={rarity} className="flex items-center gap-2 text-gray-300 cursor-pointer hover:text-white">
                        <input
                          type="radio"
                          name="rarity"
                          value={rarity}
                          checked={selectedRarity === rarity}
                          onChange={(e) => setSelectedRarity(e.target.value)}
                          className="text-purple-600 focus:ring-purple-500"
                        />
                        <span className="capitalize">{rarity === 'all' ? 'Tümü' : rarity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Fiyat Aralığı</label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>0 NRC</span>
                      <span>{priceRange[1].toLocaleString()} NRC</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Listings Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-800/50 rounded-lg p-6 animate-pulse">
                <div className="w-full h-32 bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBagIcon className="w-20 h-20 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">İlan Bulunamadı</h3>
            <p className="text-gray-400">Arama kriterlerinize uygun ilan bulunmuyor.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredListings.map((item) => (
                <MarketplaceCard key={item.id} item={item} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-800/50 border border-white/10 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50"
                >
                  Önceki
                </button>
                <span className="px-4 py-2 text-white">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-gray-800/50 border border-white/10 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50"
                >
                  Sonraki
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function MarketplaceCard({ item }: { item: MarketItem }) {
  const router = useRouter();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={() => router.push(`/marketplace/${item.id}`)}
      className={`bg-gray-800/50 backdrop-blur-xl border-2 ${rarityBorders[item.rarity]} rounded-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all`}
    >
      {/* Rarity Badge */}
      <div className={`h-2 bg-gradient-to-r ${rarityColors[item.rarity]}`}></div>

      <div className="p-4">
        {/* Icon & Type */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-4xl">{item.icon || typeIcons[item.type]}</div>
          <span className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300 capitalize">
            {item.type}
          </span>
        </div>

        {/* Name & Description */}
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{item.name}</h3>
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{item.description}</p>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <span className="text-xs">🪙</span>
            </div>
            <span className="text-xl font-bold text-white">{item.price.toLocaleString()}</span>
            <span className="text-sm text-gray-400">NRC</span>
          </div>
        </div>

        {/* Seller & Server */}
        <div className="text-xs text-gray-400 space-y-1">
          <div className="flex items-center gap-1">
            <span>👤</span>
            <span>{item.sellerName}</span>
          </div>
          {item.guildId !== 'global' && item.guildName && (
            <div className="flex items-center gap-1">
              <span>🏠</span>
              <span className="line-clamp-1">{item.guildName}</span>
            </div>
          )}
          {item.guildId === 'global' && (
            <div className="flex items-center gap-1">
              <span>🌍</span>
              <span>Global Market</span>
            </div>
          )}
        </div>

        {/* Buy Button */}
        <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all">
          Satın Al
        </button>
      </div>
    </motion.div>
  );
}

