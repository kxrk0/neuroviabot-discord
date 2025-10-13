'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import DeveloperOnly from '@/components/DeveloperOnly';
import {
    ArrowLeftIcon,
    CurrencyDollarIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    PlusIcon,
    MinusIcon
} from '@heroicons/react/24/outline';

export default function NRCManagementPage() {
    const [analytics, setAnalytics] = useState<any>(null);
    const [supply, setSupply] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [userId, setUserId] = useState('');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');

    useEffect(() => {
        loadNRCData();
        
        const interval = setInterval(loadNRCData, 10000);
        
        return () => clearInterval(interval);
    }, []);

    const loadNRCData = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
            
            const [analyticsRes, supplyRes] = await Promise.all([
                fetch(`${API_URL}/api/nrc/admin/analytics`, { credentials: 'include' }),
                fetch(`${API_URL}/api/nrc/admin/supply`, { credentials: 'include' })
            ]);

            if (analyticsRes.ok) {
                const data = await analyticsRes.json();
                setAnalytics(data.analytics);
            }

            if (supplyRes.ok) {
                const data = await supplyRes.json();
                setSupply(data.supply);
            }
        } catch (error) {
            console.error('[NRC Management] Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddNRC = async () => {
        if (!userId || !amount) {
            alert('User ID ve miktar gerekli');
            return;
        }

        try {
            setActionLoading(true);
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
            
            const response = await fetch(`${API_URL}/api/nrc/admin/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ userId, amount: parseFloat(amount), reason })
            });

            const data = await response.json();
            
            if (response.ok) {
                alert(`✅ ${amount} NRC başarıyla eklendi!`);
                setUserId('');
                setAmount('');
                setReason('');
                loadNRCData();
            } else {
                alert(`❌ Hata: ${data.error}`);
            }
        } catch (error) {
            alert('❌ İşlem başarısız');
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleRemoveNRC = async () => {
        if (!userId || !amount) {
            alert('User ID ve miktar gerekli');
            return;
        }

        if (!confirm(`${userId} kullanıcısından ${amount} NRC kaldırmak istediğinizden emin misiniz?`)) {
            return;
        }

        try {
            setActionLoading(true);
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
            
            const response = await fetch(`${API_URL}/api/nrc/admin/remove`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ userId, amount: parseFloat(amount), reason })
            });

            const data = await response.json();
            
            if (response.ok) {
                alert(`✅ ${amount} NRC başarıyla kaldırıldı!`);
                setUserId('');
                setAmount('');
                setReason('');
                loadNRCData();
            } else {
                alert(`❌ Hata: ${data.error}`);
            }
        } catch (error) {
            alert('❌ İşlem başarısız');
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <DeveloperOnly>
            <div className="min-h-screen bg-gradient-to-b from-[#0F0F14] via-[#1A1B23] to-[#0F0F14]">
                {/* Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-gray-900/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50"
                >
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center gap-4">
                            <Link 
                                href="/dev-panel"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-white"
                            >
                                <ArrowLeftIcon className="w-5 h-5" />
                                <span className="font-semibold">Geri</span>
                            </Link>
                            
                            <div className="h-8 w-px bg-white/20"></div>
                            
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-lg">
                                    <CurrencyDollarIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-black text-white">NRC Coin Yönetimi</h1>
                                    <p className="text-sm text-gray-400">Developer ekonomi kontrol paneli</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full"
                            />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Analytics */}
                            {analytics && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                                >
                                    <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-6">
                                        <div className="text-sm text-blue-300 font-semibold mb-2">Toplam Arz</div>
                                        <div className="text-3xl font-black text-white">{analytics.totalSupply?.toLocaleString()}</div>
                                        <div className="text-xs text-gray-400 mt-1">NRC</div>
                                    </div>

                                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6">
                                        <div className="text-sm text-green-300 font-semibold mb-2">Dolaşımdaki Arz</div>
                                        <div className="text-3xl font-black text-white">{analytics.circulatingSupply?.toLocaleString()}</div>
                                        <div className="text-xs text-gray-400 mt-1">NRC</div>
                                    </div>

                                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6">
                                        <div className="text-sm text-purple-300 font-semibold mb-2">Güncel Fiyat</div>
                                        <div className="text-3xl font-black text-white">{analytics.currentPrice?.toFixed(2)}</div>
                                        <div className="text-xs text-gray-400 mt-1">Sunucu Para Birimi</div>
                                    </div>

                                    <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-xl p-6">
                                        <div className="text-sm text-yellow-300 font-semibold mb-2">Toplam İşlem</div>
                                        <div className="text-3xl font-black text-white">{analytics.totalTransactions || 0}</div>
                                        <div className="text-xs text-gray-400 mt-1">İşlem sayısı</div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Supply Progress */}
                            {supply && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-white/5 border border-white/10 rounded-xl p-6"
                                >
                                    <h3 className="text-xl font-bold text-white mb-4">Arz Durumu</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Toplam / Maksimum</span>
                                            <span className="text-white font-semibold">
                                                {supply.total?.toLocaleString()} / {supply.max?.toLocaleString()} NRC
                                            </span>
                                        </div>
                                        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-yellow-500 to-amber-500"
                                                style={{ width: `${supply.percentage}%` }}
                                            ></div>
                                        </div>
                                        <div className="text-center text-sm text-gray-400">
                                            {supply.percentage?.toFixed(2)}% kullanılmış
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Admin Actions */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white/5 border border-white/10 rounded-xl p-6"
                            >
                                <h3 className="text-xl font-bold text-white mb-4">Admin İşlemleri</h3>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="block text-sm text-gray-300 font-semibold">User ID</label>
                                        <input
                                            type="text"
                                            value={userId}
                                            onChange={(e) => setUserId(e.target.value)}
                                            placeholder="Discord User ID"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="block text-sm text-gray-300 font-semibold">Miktar (NRC)</label>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none"
                                        />
                                    </div>

                                    <div className="lg:col-span-2 space-y-3">
                                        <label className="block text-sm text-gray-300 font-semibold">Sebep (Opsiyonel)</label>
                                        <input
                                            type="text"
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            placeholder="İşlem sebebi..."
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none"
                                        />
                                    </div>

                                    <button
                                        onClick={handleAddNRC}
                                        disabled={actionLoading || !userId || !amount}
                                        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                                            actionLoading || !userId || !amount
                                                ? 'bg-gray-600 cursor-not-allowed'
                                                : 'bg-green-600 hover:bg-green-700'
                                        } text-white`}
                                    >
                                        <PlusIcon className="w-5 h-5" />
                                        <span>NRC Ekle</span>
                                    </button>

                                    <button
                                        onClick={handleRemoveNRC}
                                        disabled={actionLoading || !userId || !amount}
                                        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                                            actionLoading || !userId || !amount
                                                ? 'bg-gray-600 cursor-not-allowed'
                                                : 'bg-red-600 hover:bg-red-700'
                                        } text-white`}
                                    >
                                        <MinusIcon className="w-5 h-5" />
                                        <span>NRC Kaldır</span>
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
        </DeveloperOnly>
    );
}

