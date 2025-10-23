'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import axios from 'axios';
import {
  ShoppingBagIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import ScrollReveal from '@/components/nrc/ScrollReveal';
import GoBackButton from '@/components/nrc/GoBackButton';
import ProductCard, { Product } from '@/components/nrc/ProductCard';
import PurchaseModal from '@/components/nrc/PurchaseModal';

interface GuildInfo {
  id: string;
  name: string;
  icon?: string;
}

export default function ServerStorePage() {
  const params = useParams();
  const guildId = params?.guildId as string;

  const [guildInfo, setGuildInfo] = useState<GuildInfo | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = ['all', 'role', 'custom'];

  useEffect(() => {
    if (guildId) {
      fetchServerStore();
    }
  }, [guildId, searchQuery, activeCategory, sortBy]);

  const fetchServerStore = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (activeCategory !== 'all') params.append('category', activeCategory);
      params.append('sort', sortBy);

      const response = await axios.get(
        `${API_URL}/api/marketplace/server/${guildId}/products?${params.toString()}`
      );

      if (response.data.success) {
        setGuildInfo(response.data.guild);
        
        // Transform products to match Product interface
        const transformedProducts = response.data.products.map((p: any) => ({
          id: p.productId,
          title: p.title,
          description: p.description,
          price: p.price,
          category: p.category,
          seller: p.seller || p.ownerUsername,
          icon: p.icon ? <span>{p.icon}</span> : <ShoppingBagIcon />,
        }));
        
        setProducts(transformedProducts);
      }
    } catch (error) {
      console.error('Error fetching server store:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
    }
  };

  const handlePurchaseSuccess = () => {
    // Refresh product data or show success message
    fetchServerStore();
    alert('Satın alma başarılı! Ürün hesabınıza tanımlandı.');
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1018] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="marketplace-page">
      <GoBackButton fallbackPath="/nrc/marketplace" />

      {/* Server Store Hero */}
      <section className="marketplace-hero">
        <ScrollReveal>
          <motion.div 
            className="marketplace-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {guildInfo?.icon ? (
              <img 
                src={`https://cdn.discordapp.com/icons/${guildInfo.id}/${guildInfo.icon}.png?size=128`}
                alt={guildInfo.name}
                className="w-24 h-24 rounded-full mb-6 border-4 border-purple-500/30"
              />
            ) : (
              <BuildingStorefrontIcon className="marketplace-hero-icon" />
            )}
            <h1 className="marketplace-hero-title">
              {guildInfo?.name || 'Sunucu'} Mağazası
            </h1>
            <p className="marketplace-hero-description">
              Bu sunucuya özel ürünler ve hizmetler
            </p>
          </motion.div>
        </ScrollReveal>
      </section>

      {/* Products Section */}
      <section className="marketplace-products-section">
        <div className="marketplace-products-container">
          <ScrollReveal>
            <h2 className="marketplace-section-title">
              Mağaza Ürünleri
            </h2>
          </ScrollReveal>

          {/* Search and Filters */}
          <ScrollReveal delay={0.2}>
            <div className="marketplace-controls">
              <div className="search-bar">
                <MagnifyingGlassIcon className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Ürünlerde ara..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </ScrollReveal>

          {/* Category Pills */}
          <ScrollReveal delay={0.3}>
            <div className="category-pills">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat === 'all' ? 'Tümü' : cat === 'role' ? 'Roller' : 'Özel'}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Sort Dropdown */}
          <ScrollReveal delay={0.4}>
            <div className="sort-controls">
              <FunnelIcon className="w-5 h-5" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)} 
                className="sort-select"
              >
                <option value="newest">En Yeniler</option>
                <option value="price-low">Fiyat: Düşükten Yükseğe</option>
                <option value="price-high">Fiyat: Yüksekten Düşüğe</option>
                <option value="popular">En Popüler</option>
              </select>
            </div>
          </ScrollReveal>

          {/* Products Grid */}
          <div className="products-grid">
            <AnimatePresence mode="popLayout">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1, 
                      y: 0,
                      transition: {
                        duration: 0.5,
                        delay: Math.min(index * 0.08, 0.8),
                        ease: [0.22, 1, 0.36, 1]
                      }
                    }}
                    exit={{ 
                      opacity: 0, 
                      scale: 0.9,
                      transition: {
                        duration: 0.3,
                        ease: [0.22, 1, 0.36, 1]
                      }
                    }}
                  >
                    <ProductCard product={product} onBuy={handleBuy} />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="no-results"
                >
                  <p className="no-results-text">
                    {searchQuery ? '🔍 Aradığınız kriterlere uygun ürün bulunamadı.' : '📦 Bu mağazada henüz ürün bulunmuyor.'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Stats Section */}
          <ScrollReveal delay={0.6}>
            <div className="marketplace-stats">
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-content">
                  <span className="stat-value">{products.length}</span>
                  <span className="stat-label">Toplam Ürün</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <span className="stat-value">
                    {products.length > 0 
                      ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)
                      : 0}
                  </span>
                  <span className="stat-label">Ortalama Fiyat</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🏪</div>
                <div className="stat-content">
                  <span className="stat-value">{guildInfo?.name.substring(0, 10) || 'Mağaza'}</span>
                  <span className="stat-label">Sunucu Mağazası</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Purchase Modal */}
      {selectedProduct && (
        <PurchaseModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSuccess={handlePurchaseSuccess}
        />
      )}
    </div>
  );
}

