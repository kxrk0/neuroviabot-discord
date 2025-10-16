'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import LiveActivityFeed from '@/components/nrc/LiveActivityFeed';
import ActivityFilters from '@/components/nrc/ActivityFilters';
import {
    CurrencyDollarIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    ChartBarIcon,
    FireIcon,
    UsersIcon
} from '@heroicons/react/24/outline';

export default function NRCCoinPage() {
    const [stats, setStats] = useState<any>(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
        const interval = setInterval(loadStats, 30000); // Update every 30s
        return () => clearInterval(interval);
    }, []);

    const loadStats = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
            const response = await fetch(`${API_URL}/api/nrc/activity/stats`);
            
            if (response.ok) {
                const data = await response.json();
                setStats(data.stats);
            }
        } catch (error) {
            console.error('[NRC Page] Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="nrc-coin-page">
            {/* Hero Section */}
            <motion.div
                className="hero-section"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <div className="hero-content">
                    <div className="hero-left">
                        <div className="nrc-logo">
                            <CurrencyDollarIcon className="logo-icon" />
                        </div>
                        <div className="hero-text">
                            <h1>NeuroCoin</h1>
                            <p className="tagline">NeuroViaBot Global Para Birimi</p>
                        </div>
                    </div>

                    {!loading && stats && (
                        <div className="hero-stats">
                            <div className="stat-item">
                                <span className="stat-label">24h İşlemler</span>
                                <span className="stat-value">{stats.last24h || 0}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Toplam Hacim</span>
                                <span className="stat-value">{(stats.volume24h || 0).toLocaleString()} NRC</span>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="main-content">
                <div className="content-grid">
                    {/* Left Column - Live Activity Feed */}
                    <div className="feed-column">
                        <div className="section-header">
                            <FireIcon className="section-icon" />
                            <h2>Canlı Aktivite Akışı</h2>
                            <span className="live-indicator">
                                <span className="pulse"></span>
                                CANLI
                            </span>
                        </div>

                        <ActivityFilters
                            activeFilter={activeFilter}
                            onFilterChange={setActiveFilter}
                        />

                        <LiveActivityFeed filter={activeFilter} />
                    </div>

                    {/* Right Column - Statistics */}
                    <div className="stats-column">
                        <div className="section-header">
                            <ChartBarIcon className="section-icon" />
                            <h2>İstatistikler</h2>
                        </div>

                        {loading ? (
                            <div className="stats-loading">
                                <motion.div
                                    className="spinner"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                            </div>
                        ) : stats ? (
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-header">
                                        <span className="stat-icon">📊</span>
                                        <span className="stat-title">Toplam Aktivite</span>
                                    </div>
                                    <div className="stat-number">{stats.totalActivities || 0}</div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-header">
                                        <span className="stat-icon">📈</span>
                                        <span className="stat-title">Son 7 Gün</span>
                                    </div>
                                    <div className="stat-number">{stats.last7d || 0}</div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-header">
                                        <span className="stat-icon">💰</span>
                                        <span className="stat-title">Toplam Hacim</span>
                                    </div>
                                    <div className="stat-number">{(stats.totalVolume || 0).toLocaleString()} NRC</div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-header">
                                        <span className="stat-icon">📊</span>
                                        <span className="stat-title">Ortalama/İşlem</span>
                                    </div>
                                    <div className="stat-number">{Math.floor(stats.avgPerActivity || 0).toLocaleString()} NRC</div>
                                </div>

                                {/* Activity Type Breakdown */}
                                {stats.typeBreakdown && (
                                    <div className="type-breakdown">
                                        <h3>Aktivite Türleri</h3>
                                        {Object.entries(stats.typeBreakdown).map(([type, count]: [string, any]) => (
                                            <div key={type} className="type-item">
                                                <span className="type-name">{getTypeLabel(type)}</span>
                                                <span className="type-count">{count}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="stats-error">
                                <p>İstatistikler yüklenemedi</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Info Section */}
            <div className="info-section">
                <div className="info-card">
                    <h3>💡 NeuroCoin Nedir?</h3>
                    <p>
                        NeuroCoin (NRC), NeuroViaBot ekosisteminin ana para birimidir. 
                        NFT satın alabilir, premium özellikler edinebilir, yatırım yapabilir 
                        ve oyunlar oynayarak kazanabilirsiniz.
                    </p>
                </div>
                <div className="info-card">
                    <h3>🎯 Nasıl Kazanılır?</h3>
                    <ul>
                        <li>✅ Günlük ve haftalık görevleri tamamlayın</li>
                        <li>🎮 Mini oyunlar oynayın</li>
                        <li>💬 Sunucuda aktif olun</li>
                        <li>📈 Seviye atlayın</li>
                    </ul>
                </div>
            </div>

            <style jsx>{`
                .nrc-coin-page {
                    min-height: 100vh;
                    background: linear-gradient(180deg, #0F0F14 0%, #1A1B23 50%, #0F0F14 100%);
                    padding-bottom: 4rem;
                }

                .hero-section {
                    background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 165, 0, 0.1) 100%);
                    border-bottom: 2px solid rgba(255, 215, 0, 0.2);
                    padding: 3rem 2rem;
                }

                .hero-content {
                    max-width: 1400px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 2rem;
                }

                .hero-left {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }

                .nrc-logo {
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .logo-icon {
                    width: 50px;
                    height: 50px;
                    color: #0F0F14;
                }

                .hero-text h1 {
                    font-size: 3rem;
                    font-weight: 900;
                    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 0.5rem;
                }

                .tagline {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 1.2rem;
                }

                .hero-stats {
                    display: flex;
                    gap: 2rem;
                }

                .stat-item {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                }

                .stat-label {
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 0.9rem;
                    margin-bottom: 0.25rem;
                }

                .stat-value {
                    color: #FFD700;
                    font-size: 1.5rem;
                    font-weight: 700;
                }

                .main-content {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 2rem;
                }

                .content-grid {
                    display: grid;
                    grid-template-columns: 1.5fr 1fr;
                    gap: 2rem;
                }

                @media (max-width: 1024px) {
                    .content-grid {
                        grid-template-columns: 1fr;
                    }
                }

                .section-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1.5rem;
                }

                .section-icon {
                    width: 24px;
                    height: 24px;
                    color: #FFD700;
                }

                .section-header h2 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #fff;
                    flex: 1;
                }

                .live-indicator {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.25rem 0.75rem;
                    background: rgba(255, 0, 0, 0.1);
                    border: 1px solid rgba(255, 0, 0, 0.3);
                    border-radius: 6px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #ff4444;
                }

                .pulse {
                    width: 8px;
                    height: 8px;
                    background: #ff4444;
                    border-radius: 50%;
                    animation: pulse 1.5s ease-in-out infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }

                .feed-column, .stats-column {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    padding: 1.5rem;
                }

                .stats-loading {
                    display: flex;
                    justify-content: center;
                    padding: 4rem 0;
                }

                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(255, 255, 255, 0.1);
                    border-top-color: #FFD700;
                    border-radius: 50%;
                }

                .stats-grid {
                    display: grid;
                    gap: 1rem;
                }

                .stat-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 1.25rem;
                }

                .stat-header {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.75rem;
                }

                .stat-icon {
                    font-size: 1.5rem;
                }

                .stat-title {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 0.9rem;
                }

                .stat-number {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #FFD700;
                }

                .type-breakdown {
                    margin-top: 1rem;
                    padding: 1.25rem;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                }

                .type-breakdown h3 {
                    font-size: 1.1rem;
                    margin-bottom: 1rem;
                    color: #fff;
                }

                .type-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 0.5rem 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }

                .type-name {
                    color: rgba(255, 255, 255, 0.8);
                }

                .type-count {
                    font-weight: 700;
                    color: #FFD700;
                }

                .info-section {
                    max-width: 1400px;
                    margin: 3rem auto 0;
                    padding: 0 2rem;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                }

                .info-card {
                    background: rgba(255, 215, 0, 0.05);
                    border: 1px solid rgba(255, 215, 0, 0.2);
                    border-radius: 12px;
                    padding: 2rem;
                }

                .info-card h3 {
                    font-size: 1.3rem;
                    margin-bottom: 1rem;
                    color: #FFD700;
                }

                .info-card p {
                    color: rgba(255, 255, 255, 0.8);
                    line-height: 1.6;
                }

                .info-card ul {
                    list-style: none;
                    padding: 0;
                    color: rgba(255, 255, 255, 0.8);
                    line-height: 1.8;
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

