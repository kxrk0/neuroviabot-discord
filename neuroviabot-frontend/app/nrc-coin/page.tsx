'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    CurrencyDollarIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    ChartBarIcon,
    ShoppingCartIcon,
    TrophyIcon
} from '@heroicons/react/24/outline';

export default function NRCCoinPage() {
    const [stats, setStats] = useState<any>(null);
    const [price, setPrice] = useState<any>(null);
    const [priceHistory, setPriceHistory] = useState<any[]>([]);
    const [trades, setTrades] = useState<any[]>([]);
    const [holders, setHolders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNRCData();
        
        const interval = setInterval(loadNRCData, 5000);
        
        return () => clearInterval(interval);
    }, []);

    const loadNRCData = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
            
            const [statsRes, priceRes, historyRes, tradesRes, holdersRes] = await Promise.all([
                fetch(`${API_URL}/api/nrc/global-stats`),
                fetch(`${API_URL}/api/nrc/market/price`),
                fetch(`${API_URL}/api/nrc/market/history?days=7`),
                fetch(`${API_URL}/api/nrc/trading/list`),
                fetch(`${API_URL}/api/nrc/leaderboard?limit=10`)
            ]);

            if (statsRes.ok) {
                const data = await statsRes.json();
                setStats(data.stats);
            }

            if (priceRes.ok) {
                const data = await priceRes.json();
                setPrice(data);
            }

            if (historyRes.ok) {
                const data = await historyRes.json();
                setPriceHistory(data.history || []);
            }

            if (tradesRes.ok) {
                const data = await tradesRes.json();
                setTrades(data.trades || []);
            }

            if (holdersRes.ok) {
                const data = await holdersRes.json();
                setHolders(data.holders || []);
            }
        } catch (error) {
            console.error('[NRC Coin] Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const priceChange = priceHistory.length >= 2 
        ? ((priceHistory[priceHistory.length - 1]?.price - priceHistory[0]?.price) / priceHistory[0]?.price) * 100 
        : 0;

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0F0F14] via-[#1A1B23] to-[#0F0F14]">
            {/* Header */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-gradient-to-r from-yellow-600/20 to-amber-600/20 border-b border-yellow-500/30 backdrop-blur-xl"
            >
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-4 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-2xl">
                                    <CurrencyDollarIcon className="w-12 h-12 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-5xl font-black text-white mb-2">NRC Coin</h1>
                                    <p className="text-xl text-gray-300">NeuroViaBot Global Para Birimi</p>
                                </div>
                            </div>
                        </div>

                        {price && (
                            <div className="text-right">
                                <div className="text-5xl font-black text-white mb-2">
                                    {price.price?.toFixed(2)}
                                </div>
                                <div className={`text-xl font-bold flex items-center gap-2 ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {priceChange >= 0 ? <ArrowTrendingUpIcon className="w-6 h-6" /> : <ArrowTrendingDownIcon className="w-6 h-6" />}
                                    {Math.abs(priceChange).toFixed(2)}%
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full"
                        />
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Stats */}
                        {stats && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-1 md:grid-cols-4 gap-4"
                            >
                                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-6">
                                    <div className="text-sm text-blue-300 font-semibold mb-2">Toplam Arz</div>
                                    <div className="text-3xl font-black text-white">{stats.totalSupply?.toLocaleString()}</div>
                                </div>

                                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6">
                                    <div className="text-sm text-green-300 font-semibold mb-2">Dolaşımda</div>
                                    <div className="text-3xl font-black text-white">{stats.circulatingSupply?.toLocaleString()}</div>
                                </div>

                                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6">
                                    <div className="text-sm text-purple-300 font-semibold mb-2">Toplam İşlem</div>
                                    <div className="text-3xl font-black text-white">{stats.totalTransactions || 0}</div>
                                </div>

                                <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-xl p-6">
                                    <div className="text-sm text-yellow-300 font-semibold mb-2">Aktif Trade</div>
                                    <div className="text-3xl font-black text-white">{stats.activeTrades || 0}</div>
                                </div>
                            </motion.div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Active Trades */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white/5 border border-white/10 rounded-xl p-6"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <ShoppingCartIcon className="w-6 h-6 text-green-400" />
                                    <h2 className="text-2xl font-bold text-white">Aktif Trade'ler</h2>
                                </div>

                                {trades.length === 0 ? (
                                    <p className="text-gray-400 text-center py-8">Henüz aktif trade yok</p>
                                ) : (
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {trades.map((trade, idx) => (
                                            <div key={idx} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <div className="text-white font-bold">{trade.amount} NRC</div>
                                                        <div className="text-sm text-gray-400">@ {trade.pricePerNRC} per NRC</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-green-400 font-bold">{trade.totalPrice} SP</div>
                                                        <div className="text-xs text-gray-500">
                                                            {new Date(trade.createdAt).toLocaleDateString('tr-TR')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>

                            {/* Top Holders */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white/5 border border-white/10 rounded-xl p-6"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <TrophyIcon className="w-6 h-6 text-yellow-400" />
                                    <h2 className="text-2xl font-bold text-white">Top Holder'lar</h2>
                                </div>

                                {holders.length === 0 ? (
                                    <p className="text-gray-400 text-center py-8">Henüz holder yok</p>
                                ) : (
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {holders.map((holder, idx) => (
                                            <div key={idx} className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                                        idx === 0 ? 'bg-yellow-500 text-black' :
                                                        idx === 1 ? 'bg-gray-400 text-black' :
                                                        idx === 2 ? 'bg-orange-600 text-white' :
                                                        'bg-gray-700 text-gray-300'
                                                    }`}>
                                                        {idx + 1}
                                                    </div>
                                                    <span className="text-gray-400 text-sm">User {holder.userId.substring(0, 8)}...</span>
                                                </div>
                                                <div className="text-white font-bold">{holder.balance?.toLocaleString()} NRC</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        {/* Info Box */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-xl p-8"
                        >
                            <h3 className="text-2xl font-bold text-white mb-4">NRC Coin Nedir?</h3>
                            <p className="text-gray-300 mb-4">
                                NRC Coin, NeuroViaBot'a özel global para birimidir. Bitcoin gibi kendi ekonomisine sahiptir ve değeri bot geliştiricileri tarafından dengelenir.
                            </p>
                            <ul className="space-y-2 text-gray-300">
                                <li>• Her seviye atladığınızda <span className="text-yellow-400 font-bold">10 NRC</span> kazanırsınız</li>
                                <li>• P2P trading sistemiyle diğer kullanıcılarla NRC ticareti yapabilirsiniz</li>
                                <li>• NRC coin değeri otomatik olarak dalgalanır (volatility simulation)</li>
                                <li>• Toplam arz sınırlıdır ve yıllık %2 enflasyon uygulanır</li>
                                <li>• Trading işlemlerinde %5 komisyon kesilir</li>
                            </ul>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}

