'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  PlusIcon, 
  ShoppingBagIcon,
  SparklesIcon,
  CubeIcon,
  CogIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  BoltIcon,
  BuildingStorefrontIcon,
  UserGroupIcon,
  ArrowRightIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import ScrollReveal from '@/components/nrc/ScrollReveal';
import GoBackButton from '@/components/nrc/GoBackButton';
import ProductCard, { Product } from '@/components/nrc/ProductCard';
import PurchaseModal from '@/components/nrc/PurchaseModal';
// import ProtectedRoute from '@/components/auth/ProtectedRoute'; // TODO: Re-enable for production deployment

interface Server {
  _id: string;
  guildName: string;
  guildIcon?: string;
  productCount: number;
  totalSales: number;
  avgPrice: number;
}

export default function MarketplacePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'main' | 'server'>('main');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [serverSearchQuery, setServerSearchQuery] = useState('');
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = ['all', 'items', 'roles', 'services', 'custom'];
  
  // Product listings
  const listings: Product[] = [
    { 
      id: 1, 
      title: 'Premium Role',
      description: 'Exclusive premium role with special perks and access to VIP channels. Stand out in the community!', 
      seller: 'User123', 
      price: 500, 
      category: 'roles', 
      icon: <SparklesIcon />,
    },
    { 
      id: 2, 
      title: 'Custom Bot Development',
      description: 'Professional Discord bot development service with custom features tailored to your needs.', 
      seller: 'Dev456', 
      price: 2000, 
      category: 'services', 
      icon: <CogIcon />,
    },
    { 
      id: 3, 
      title: 'Server Banner Pack',
      description: 'High-quality custom server banners designed by professional artists. Multiple styles available.', 
      seller: 'Designer789', 
      price: 300, 
      category: 'items', 
      icon: <CubeIcon />,
    },
    { 
      id: 4, 
      title: 'VIP Access Pass',
      description: 'Get exclusive VIP access to premium content, events, and special community features.', 
      seller: 'Admin', 
      price: 1000, 
      category: 'roles', 
      icon: <SparklesIcon />,
    },
    { 
      id: 5, 
      title: 'Premium Emoji Pack',
      description: 'Collection of 50+ custom animated emojis perfect for your Discord server. High quality!', 
      seller: 'Artist', 
      price: 150, 
      category: 'items', 
      icon: <CubeIcon />,
    },
    { 
      id: 6, 
      title: 'Bot Setup Service',
      description: 'Professional bot configuration and setup service. Get your bot up and running perfectly.', 
      seller: 'Helper', 
      price: 750, 
      category: 'services', 
      icon: <CogIcon />,
    },
  ];

  // Fetch servers when server tab is active
  useEffect(() => {
    if (activeTab === 'server') {
      fetchServers();
    }
  }, [activeTab, serverSearchQuery]);

  const fetchServers = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const params = new URLSearchParams();
      if (serverSearchQuery) params.append('search', serverSearchQuery);
      
      const response = await axios.get(`${API_URL}/api/marketplace/servers?${params.toString()}`);
      if (response.data.success) {
        setServers(response.data.servers);
      }
    } catch (error) {
      console.error('Error fetching servers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings
    .filter(l => {
      // Category filter
      const matchesCategory = activeCategory === 'all' || l.category === activeCategory;
      
      // Search filter
      const matchesSearch = searchQuery === '' || 
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });

  const handleBuy = (productId: number) => {
    const product = listings.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
    }
  };

  const handlePurchaseSuccess = () => {
    // Refresh page data or show success message
    alert('Satın alma başarılı! Ürün hesabınıza tanımlandı.');
  };

  return (
    // TODO: Re-enable ProtectedRoute for production deployment
    // <ProtectedRoute reason="Marketplace'e erişmek için Discord ile giriş yapmalısınız.">
      <div className="marketplace-page">
        <GoBackButton fallbackPath="/nrc/trading-panel" />
        
        {/* Hero Section */}
        <section className="marketplace-hero">
          <ScrollReveal>
            <motion.div 
              className="marketplace-hero-content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <ShoppingBagIcon className="marketplace-hero-icon" />
              <h1 className="marketplace-hero-title">
                NRC Marketplace
              </h1>
              <p className="marketplace-hero-description">
                Topluluğunuz içinde öğe, rol ve hizmet alıp satın. 
                NRC Coin ile güvenli işlemler yapın ve Discord sunucunuzu bir sonraki seviyeye taşıyın.
              </p>
              <div className="marketplace-hero-features">
                <div className="marketplace-hero-feature">
                  <ShieldCheckIcon />
                  <span>Güvenli İşlemler</span>
                </div>
                <div className="marketplace-hero-feature">
                  <CurrencyDollarIcon />
                  <span>NRC Coin ile Ödeme</span>
                </div>
                <div className="marketplace-hero-feature">
                  <BoltIcon />
                  <span>Anında Teslimat</span>
                </div>
              </div>
            </motion.div>
          </ScrollReveal>
        </section>

        {/* Tabs */}
        <section className="marketplace-tabs-section">
          <div className="marketplace-tabs">
            <button
              onClick={() => setActiveTab('main')}
              className={`marketplace-tab ${activeTab === 'main' ? 'active' : ''}`}
            >
              <ShoppingBagIcon className="w-5 h-5" />
              Ana Mağaza
            </button>
            <button
              onClick={() => setActiveTab('server')}
              className={`marketplace-tab ${activeTab === 'server' ? 'active' : ''}`}
            >
              <BuildingStorefrontIcon className="w-5 h-5" />
              Sunucu Mağazası
            </button>
          </div>
        </section>

        {/* Main Store Tab Content */}
        {activeTab === 'main' && (
          <section className="marketplace-products-section">
          <div className="marketplace-products-container">
            <ScrollReveal>
              <h2 className="marketplace-section-title">
                Ürünleri Keşfedin
              </h2>
            </ScrollReveal>

            {/* Search and Filters */}
            <ScrollReveal delay={0.2}>
              <div className="marketplace-controls">
                <div className="search-bar">
                  <MagnifyingGlassIcon className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Marketplace'te ara..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <button className="create-listing-btn">
                  <PlusIcon />
                  İlan Oluştur
                </button>
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
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </ScrollReveal>

            {/* Sort Dropdown */}
            <ScrollReveal delay={0.4}>
              <div className="sort-controls">
                <FunnelIcon />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                  <option value="newest">En Yeni</option>
                  <option value="price-low">Fiyat: Düşük - Yüksek</option>
                  <option value="price-high">Fiyat: Yüksek - Düşük</option>
                  <option value="popular">En Popüler</option>
                </select>
              </div>
            </ScrollReveal>

            {/* Products Grid */}
            <div className="products-grid">
              <AnimatePresence mode="popLayout">
                {filteredListings.length > 0 ? (
                  filteredListings.map((product, index) => (
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
                    <p className="no-results-text">🔍 Aradığınız kriterlere uygun ürün bulunamadı.</p>
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
                    <span className="stat-value">{filteredListings.length}</span>
                    <span className="stat-label">Toplam İlan</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-content">
                    <span className="stat-value">24.5K</span>
                    <span className="stat-label">NRC Hacmi</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🔥</div>
                  <div className="stat-content">
                    <span className="stat-value">156</span>
                    <span className="stat-label">Bugünkü Satışlar</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Featured & Additional Stats */}
            <div className="marketplace-bottom-section">
              <ScrollReveal delay={0.7}>
                <div className="sidebar-card">
                  <h3>Öne Çıkan İlanlar</h3>
                  <div className="featured-list">
                    <div className="featured-item">
                      <span className="featured-icon">🏆</span>
                      <div>
                        <div className="featured-name">Elite Package</div>
                        <div className="featured-price">5000 NRC</div>
                      </div>
                    </div>
                    <div className="featured-item">
                      <span className="featured-icon">💎</span>
                      <div>
                        <div className="featured-name">Diamond Role</div>
                        <div className="featured-price">3000 NRC</div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.8}>
                <div className="sidebar-card">
                  <h3>Marketplace İstatistikleri</h3>
                  <div className="stat-item">
                    <span>Toplam İlan</span>
                    <strong>247</strong>
                  </div>
                  <div className="stat-item">
                    <span>Aktif Satıcı</span>
                    <strong>89</strong>
                  </div>
                  <div className="stat-item">
                    <span>Bugünkü Satış</span>
                    <strong>42</strong>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
        )}

        {/* Server Store Tab Content */}
        {activeTab === 'server' && (
          <section className="marketplace-server-section">
            <div className="marketplace-products-container">
              <ScrollReveal>
                <h2 className="marketplace-section-title">
                  Sunucu Mağazaları
                </h2>
                <p className="marketplace-section-description">
                  Bot'un bulunduğu sunucuların mağazalarını keşfedin
                </p>
              </ScrollReveal>

              {/* Server Search */}
              <ScrollReveal delay={0.2}>
                <div className="marketplace-controls">
                  <div className="search-bar">
                    <MagnifyingGlassIcon className="search-icon" />
                    <input 
                      type="text" 
                      placeholder="Sunucu ara..." 
                      value={serverSearchQuery}
                      onChange={(e) => setServerSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </ScrollReveal>

              {/* Server Grid */}
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : servers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <BuildingStorefrontIcon className="w-24 h-24 text-gray-600 mb-4" />
                  <p className="text-gray-400 text-lg">Henüz mağazası olan sunucu bulunamadı</p>
                </div>
              ) : (
                <div className="products-grid">
                  {servers.map((server, index) => (
                    <motion.div
                      key={server._id}
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
                      className="server-card"
                      onClick={() => router.push(`/nrc/marketplace/server/${server._id}`)}
                    >
                      <div className="server-card-header">
                        {server.guildIcon ? (
                          <img 
                            src={`https://cdn.discordapp.com/icons/${server._id}/${server.guildIcon}.png`}
                            alt={server.guildName}
                            className="server-icon"
                          />
                        ) : (
                          <div className="server-icon-placeholder">
                            <BuildingStorefrontIcon className="w-12 h-12" />
                          </div>
                        )}
                        <h3 className="server-name">{server.guildName}</h3>
                      </div>

                      <div className="server-card-stats">
                        <div className="server-stat">
                          <ShoppingBagIcon className="w-5 h-5 text-purple-400" />
                          <span className="stat-value">{server.productCount}</span>
                          <span className="stat-label">Ürün</span>
                        </div>
                        <div className="server-stat">
                          <ChartBarIcon className="w-5 h-5 text-emerald-400" />
                          <span className="stat-value">{server.totalSales}</span>
                          <span className="stat-label">Satış</span>
                        </div>
                        <div className="server-stat">
                          <CurrencyDollarIcon className="w-5 h-5 text-blue-400" />
                          <span className="stat-value">{Math.round(server.avgPrice)}</span>
                          <span className="stat-label">Ort. Fiyat</span>
                        </div>
                      </div>

                      <button className="server-card-button">
                        <span>Mağazaya Git</span>
                        <ArrowRightIcon className="w-5 h-5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Purchase Modal */}
        {selectedProduct && (
          <PurchaseModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onSuccess={handlePurchaseSuccess}
          />
        )}
      </div>
    // </ProtectedRoute>
  );
}
