'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamic imports to prevent SSR issues
const LiveActivityFeed = dynamic(() => import('@/components/nrc/LiveActivityFeed'), { ssr: false });
const ActivityFilters = dynamic(() => import('@/components/nrc/ActivityFilters'), { ssr: false });

interface Stats {
    totalActivities: number;
    last24h: number;
    last7d: number;
    totalVolume: number;
    volume24h: number;
    avgPerActivity: number;
    typeBreakdown?: Record<string, number>;
}

export default function NRCCoinPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [currentPrice] = useState(1.00); // Mock price
    const [priceChange] = useState('+12.5%');
    const heroRef = useRef<HTMLDivElement>(null);

    const { scrollY } = useScroll();
    const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
    const heroScale = useTransform(scrollY, [0, 300], [1, 0.9]);

    useEffect(() => {
        loadStats();
        const interval = setInterval(loadStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadStats = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
            const response = await fetch(`${API_URL}/api/nrc/activity/stats`);
            
            if (response.ok) {
                const data = await response.json();
                setStats(data.stats || {
                    totalActivities: 0,
                    last24h: 0,
                    last7d: 0,
                    totalVolume: 0,
                    volume24h: 0,
                    avgPerActivity: 0
                });
            }
        } catch (error) {
            console.error('[NRC Page] Error loading stats:', error);
            setStats({
                totalActivities: 0,
                last24h: 0,
                last7d: 0,
                totalVolume: 0,
                volume24h: 0,
                avgPerActivity: 0
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="nrc-universe">
            {/* Animated Background */}
            <div className="cosmic-bg">
                <div className="stars"></div>
                <div className="stars2"></div>
                <div className="stars3"></div>
            </div>

            {/* Hero Section - Glassmorphic Design */}
            <motion.section 
                ref={heroRef}
                className="hero-universe"
                style={{ opacity: heroOpacity, scale: heroScale }}
            >
                <div className="hero-container">
                    {/* Floating 3D Coin */}
                    <motion.div 
                        className="coin-3d"
                        animate={{
                            rotateY: [0, 360],
                            y: [0, -20, 0]
                        }}
                        transition={{
                            rotateY: { duration: 4, repeat: Infinity, ease: "linear" },
                            y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                    >
                        <div className="coin-face">
                            <span className="coin-symbol">Ⓝ</span>
                        </div>
                    </motion.div>

                    {/* Hero Content */}
                    <div className="hero-content-glass">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="hero-title">
                                <span className="title-neu">Neuro</span>
                                <span className="title-coin">Coin</span>
                            </h1>
                            <p className="hero-subtitle">Geleceğin Para Birimi • Şimdi Burada</p>
                        </motion.div>

                        {/* Live Price Ticker */}
                        <motion.div 
                            className="price-ticker"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="price-main">
                                <span className="price-value">${currentPrice.toFixed(2)}</span>
                                <span className={`price-change ${priceChange.startsWith('+') ? 'positive' : 'negative'}`}>
                                    {priceChange}
                                </span>
                            </div>
                            <div className="price-stats">
                                <div className="price-stat">
                                    <span className="stat-label">24h Hacim</span>
                                    <span className="stat-value">{(stats?.volume24h || 0).toLocaleString()} NRC</span>
                                </div>
                                <div className="price-stat">
                                    <span className="stat-label">İşlem</span>
                                    <span className="stat-value">{stats?.last24h || 0}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.div 
                    className="scroll-indicator"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <div className="mouse"></div>
                    <p>Aşağı Kaydır</p>
                </motion.div>
            </motion.section>

            {/* Main Content - Bento Grid Layout */}
            <section className="bento-section">
                <div className="bento-container">
                    {/* Live Feed - Large Card */}
                    <motion.div 
                        className="bento-card bento-large"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="card-header">
                            <div className="header-left">
                                <span className="card-icon">🔥</span>
                                <h2 className="card-title">Canlı Aktivite Akışı</h2>
                            </div>
                            <div className="live-badge">
                                <span className="pulse-dot"></span>
                                <span>CANLI</span>
                            </div>
                        </div>

                        <div className="card-body">
                            <ActivityFilters
                                activeFilter={activeFilter}
                                onFilterChange={setActiveFilter}
                            />
                            <LiveActivityFeed filter={activeFilter} />
                        </div>
                    </motion.div>

                    {/* Stats Cards - Grid */}
                    <div className="stats-grid-bento">
                        <motion.div 
                            className="bento-card stat-card-1"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="stat-icon-bg">📊</div>
                            <div className="stat-content">
                                <p className="stat-label">Toplam İşlem</p>
                                <h3 className="stat-number">{stats?.totalActivities || 0}</h3>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="bento-card stat-card-2"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="stat-icon-bg">💰</div>
                            <div className="stat-content">
                                <p className="stat-label">Toplam Hacim</p>
                                <h3 className="stat-number">{(stats?.totalVolume || 0).toLocaleString()}</h3>
                                <span className="stat-unit">NRC</span>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="bento-card stat-card-3"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="stat-icon-bg">📈</div>
                            <div className="stat-content">
                                <p className="stat-label">Son 7 Gün</p>
                                <h3 className="stat-number">{stats?.last7d || 0}</h3>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="bento-card stat-card-4"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="stat-icon-bg">⚡</div>
                            <div className="stat-content">
                                <p className="stat-label">Ortalama/İşlem</p>
                                <h3 className="stat-number">{Math.floor(stats?.avgPerActivity || 0).toLocaleString()}</h3>
                                <span className="stat-unit">NRC</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Activity Breakdown */}
                    {stats?.typeBreakdown && Object.keys(stats.typeBreakdown).length > 0 && (
                        <motion.div 
                            className="bento-card bento-medium"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="card-header">
                                <span className="card-icon">📊</span>
                                <h2 className="card-title">Aktivite Dağılımı</h2>
                            </div>
                            <div className="breakdown-list">
                                {Object.entries(stats.typeBreakdown).map(([type, count]) => (
                                    <motion.div 
                                        key={type}
                                        className="breakdown-item"
                                        whileHover={{ x: 5 }}
                                    >
                                        <span className="breakdown-name">{getTypeLabel(type)}</span>
                                        <div className="breakdown-right">
                                            <div className="breakdown-bar">
                                                <motion.div 
                                                    className="breakdown-fill"
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${Math.min((count / (stats.totalActivities || 1)) * 100, 100)}%` }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 1, delay: 0.2 }}
                                                />
                                            </div>
                                            <span className="breakdown-count">{count}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <motion.div 
                    className="features-container"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <h2 className="features-title">NeuroCoin ile Neler Yapabilirsiniz?</h2>
                    
                    <div className="features-grid">
                        {[
                            { icon: '🎨', title: 'NFT Koleksiyonu', desc: 'Benzersiz NFT\'ler satın alın ve koleksiyon yapın' },
                            { icon: '🛒', title: 'Marketplace', desc: 'Güvenli escrow sistemiyle NFT alım satımı' },
                            { icon: '👑', title: 'Premium', desc: 'Premium abonelik ile özel özelliklere erişin' },
                            { icon: '💰', title: 'Yatırım', desc: 'NRC\'nizi stake edin ve faiz kazanın' },
                            { icon: '🎮', title: 'Oyunlar', desc: 'Mini oyunlar oynayarak NRC kazanın' },
                            { icon: '🎯', title: 'Görevler', desc: 'Günlük ve haftalık görevleri tamamlayın' }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className="feature-card"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5, scale: 1.02 }}
                            >
                                <div className="feature-icon">{feature.icon}</div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-desc">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            <style jsx>{`
                .nrc-universe {
                    min-height: 100vh;
                    background: #0a0a0f;
                    position: relative;
                    overflow-x: hidden;
                }

                /* Cosmic Background */
                .cosmic-bg {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 0;
                }

                .stars, .stars2, .stars3 {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: transparent;
                }

                .stars {
                    background-image: 
                        radial-gradient(2px 2px at 20px 30px, #eee, rgba(0,0,0,0)),
                        radial-gradient(2px 2px at 60px 70px, #fff, rgba(0,0,0,0)),
                        radial-gradient(1px 1px at 50px 50px, #fff, rgba(0,0,0,0)),
                        radial-gradient(1px 1px at 130px 80px, #fff, rgba(0,0,0,0)),
                        radial-gradient(2px 2px at 90px 10px, #fff, rgba(0,0,0,0));
                    background-size: 200px 200px;
                    animation: stars-move 100s linear infinite;
                }

                .stars2 {
                    background-image: 
                        radial-gradient(1px 1px at 40px 60px, #fff, rgba(0,0,0,0)),
                        radial-gradient(1px 1px at 110px 90px, #fff, rgba(0,0,0,0)),
                        radial-gradient(1px 1px at 170px 120px, #fff, rgba(0,0,0,0));
                    background-size: 250px 250px;
                    animation: stars-move 150s linear infinite;
                }

                .stars3 {
                    background-image: 
                        radial-gradient(1px 1px at 75px 125px, #ffe60a, rgba(0,0,0,0)),
                        radial-gradient(1px 1px at 165px 25px, #ffe60a, rgba(0,0,0,0));
                    background-size: 300px 300px;
                    animation: stars-move 200s linear infinite;
                }

                @keyframes stars-move {
                    from { transform: translateY(0); }
                    to { transform: translateY(-2000px); }
                }

                /* Hero Section */
                .hero-universe {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    z-index: 1;
                    padding: 2rem;
                }

                .hero-container {
                    max-width: 1400px;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 3rem;
                }

                /* 3D Coin */
                .coin-3d {
                    width: 200px;
                    height: 200px;
                    position: relative;
                    transform-style: preserve-3d;
                    filter: drop-shadow(0 20px 60px rgba(255, 215, 0, 0.4));
                }

                .coin-face {
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 
                        inset 0 0 30px rgba(255,255,255,0.3),
                        0 0 50px rgba(255,215,0,0.5);
                }

                .coin-symbol {
                    font-size: 6rem;
                    font-weight: 900;
                    color: #0a0a0f;
                    text-shadow: 0 2px 10px rgba(0,0,0,0.3);
                }

                /* Hero Content - Glassmorphism */
                .hero-content-glass {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 30px;
                    padding: 3rem 4rem;
                    text-align: center;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                }

                .hero-title {
                    font-size: 5rem;
                    font-weight: 900;
                    margin: 0 0 1rem 0;
                    line-height: 1;
                }

                .title-neu {
                    background: linear-gradient(135deg, #00d4ff 0%, #0099ff 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    text-shadow: 0 0 30px rgba(0, 212, 255, 0.5);
                }

                .title-coin {
                    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    text-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
                }

                .hero-subtitle {
                    font-size: 1.5rem;
                    color: rgba(255, 255, 255, 0.8);
                    margin-bottom: 2rem;
                }

                /* Price Ticker */
                .price-ticker {
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 215, 0, 0.3);
                    border-radius: 20px;
                    padding: 1.5rem 2rem;
                    margin-top: 2rem;
                }

                .price-main {
                    display: flex;
                    align-items: baseline;
                    justify-content: center;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }

                .price-value {
                    font-size: 3rem;
                    font-weight: 800;
                    color: #FFD700;
                }

                .price-change {
                    font-size: 1.5rem;
                    font-weight: 700;
                    padding: 0.25rem 0.75rem;
                    border-radius: 8px;
                }

                .price-change.positive {
                    color: #00ff88;
                    background: rgba(0, 255, 136, 0.1);
                }

                .price-change.negative {
                    color: #ff4444;
                    background: rgba(255, 68, 68, 0.1);
                }

                .price-stats {
                    display: flex;
                    gap: 3rem;
                    justify-content: center;
                }

                .price-stat {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .stat-label {
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.6);
                }

                .stat-value {
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: #fff;
                }

                /* Scroll Indicator */
                .scroll-indicator {
                    position: absolute;
                    bottom: 2rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    color: rgba(255, 255, 255, 0.5);
                }

                .mouse {
                    width: 24px;
                    height: 40px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 12px;
                    position: relative;
                }

                .mouse::before {
                    content: '';
                    position: absolute;
                    top: 8px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 4px;
                    height: 8px;
                    background: rgba(255, 255, 255, 0.5);
                    border-radius: 2px;
                }

                /* Bento Grid Section */
                .bento-section {
                    position: relative;
                    z-index: 1;
                    padding: 4rem 2rem;
                }

                .bento-container {
                    max-width: 1400px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: repeat(12, 1fr);
                    gap: 1.5rem;
                }

                .bento-card {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 24px;
                    padding: 2rem;
                    transition: all 0.3s ease;
                }

                .bento-card:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(255, 215, 0, 0.3);
                    box-shadow: 0 20px 60px rgba(255, 215, 0, 0.1);
                }

                .bento-large {
                    grid-column: span 8;
                }

                .bento-medium {
                    grid-column: span 12;
                }

                .stats-grid-bento {
                    grid-column: span 4;
                    display: grid;
                    gap: 1.5rem;
                }

                .stat-card-1, .stat-card-2, .stat-card-3, .stat-card-4 {
                    position: relative;
                    overflow: hidden;
                }

                .stat-icon-bg {
                    position: absolute;
                    top: -20px;
                    right: -20px;
                    font-size: 6rem;
                    opacity: 0.1;
                }

                .stat-content {
                    position: relative;
                    z-index: 1;
                }

                .stat-label {
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.6);
                    margin-bottom: 0.5rem;
                }

                .stat-number {
                    font-size: 2.5rem;
                    font-weight: 800;
                    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .stat-unit {
                    font-size: 1rem;
                    color: rgba(255, 255, 255, 0.5);
                    margin-left: 0.5rem;
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }

                .header-left {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .card-icon {
                    font-size: 1.5rem;
                }

                .card-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #fff;
                }

                .live-badge {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    background: rgba(255, 0, 0, 0.1);
                    border: 1px solid rgba(255, 0, 0, 0.3);
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: #ff4444;
                }

                .pulse-dot {
                    width: 8px;
                    height: 8px;
                    background: #ff4444;
                    border-radius: 50%;
                    animation: pulse 1.5s ease-in-out infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.2); }
                }

                .card-body {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                /* Breakdown List */
                .breakdown-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .breakdown-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 12px;
                    transition: background 0.3s ease;
                }

                .breakdown-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                }

                .breakdown-name {
                    font-size: 1rem;
                    color: rgba(255, 255, 255, 0.8);
                }

                .breakdown-right {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .breakdown-bar {
                    width: 150px;
                    height: 8px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                    overflow: hidden;
                }

                .breakdown-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #FFD700 0%, #FFA500 100%);
                    border-radius: 4px;
                }

                .breakdown-count {
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: #FFD700;
                    min-width: 40px;
                    text-align: right;
                }

                /* Features Section */
                .features-section {
                    position: relative;
                    z-index: 1;
                    padding: 4rem 2rem;
                }

                .features-container {
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .features-title {
                    font-size: 3rem;
                    font-weight: 800;
                    text-align: center;
                    margin-bottom: 3rem;
                    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                }

                .feature-card {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    padding: 2rem;
                    text-align: center;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .feature-card:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(255, 215, 0, 0.3);
                    box-shadow: 0 20px 60px rgba(255, 215, 0, 0.2);
                }

                .feature-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                }

                .feature-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #fff;
                    margin-bottom: 0.5rem;
                }

                .feature-desc {
                    font-size: 1rem;
                    color: rgba(255, 255, 255, 0.7);
                    line-height: 1.6;
                }

                /* Responsive */
                @media (max-width: 1024px) {
                    .bento-large, .stats-grid-bento {
                        grid-column: span 12;
                    }

                    .hero-title {
                        font-size: 3rem;
                    }

                    .coin-3d {
                        width: 150px;
                        height: 150px;
                    }

                    .coin-symbol {
                        font-size: 4rem;
                    }
                }

                @media (max-width: 768px) {
                    .hero-content-glass {
                        padding: 2rem;
                    }

                    .price-stats {
                        flex-direction: column;
                        gap: 1rem;
                    }

                    .features-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}

function getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
        nft_purchase: '🎨 NFT Satın Alımı',
        marketplace_trade: '🛒 Marketplace Trade',
        premium_activated: '👑 Premium Aktivasyon',
        investment_created: '💰 Yatırım',
        game_win: '🎮 Oyun Kazancı',
        quest_completed: '🎯 Quest Tamamlama'
    };
    return labels[type] || type;
}
