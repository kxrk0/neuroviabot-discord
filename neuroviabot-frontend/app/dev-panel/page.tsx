'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import DeveloperOnly from '@/components/DeveloperOnly';
import {
    ChartBarIcon,
    CommandLineIcon,
    CpuChipIcon,
    ExclamationTriangleIcon,
    CircleStackIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

export default function DeveloperPanelPage() {
    const [stats, setStats] = useState<any>(null);
    const [health, setHealth] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
        
        // Refresh every 5 seconds
        const interval = setInterval(loadDashboardData, 5000);
        
        return () => clearInterval(interval);
    }, []);

    const loadDashboardData = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
            
            // Load real-time stats
            const statsResponse = await fetch(`${API_URL}/api/dev/bot/stats/real-time`, {
                credentials: 'include'
            });
            
            if (statsResponse.ok) {
                const statsData = await statsResponse.json();
                setStats(statsData.stats);
            }

            // Load system health
            const healthResponse = await fetch(`${API_URL}/api/dev/system/health`, {
                credentials: 'include'
            });
            
            if (healthResponse.ok) {
                const healthData = await healthResponse.json();
                setHealth(healthData.health);
            }
        } catch (error) {
            console.error('[Dev Panel] Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getHealthStatusColor = (status: string) => {
        switch (status) {
            case 'healthy': return 'text-green-500';
            case 'warning': return 'text-yellow-500';
            case 'degraded': return 'text-orange-500';
            case 'error': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    const getHealthStatusBg = (status: string) => {
        switch (status) {
            case 'healthy': return 'bg-green-500/20 border-green-500/50';
            case 'warning': return 'bg-yellow-500/20 border-yellow-500/50';
            case 'degraded': return 'bg-orange-500/20 border-orange-500/50';
            case 'error': return 'bg-red-500/20 border-red-500/50';
            default: return 'bg-gray-500/20 border-gray-500/50';
        }
    };

    const sections = [
        {
            id: 'stats',
            title: 'Bot İstatistikleri',
            description: 'Real-time bot istatistikleri ve metrikler',
            icon: ChartBarIcon,
            color: 'from-blue-500 to-cyan-500',
            href: '/dev-panel/stats'
        },
        {
            id: 'commands',
            title: 'Komut Yönetimi',
            description: 'Bot komutlarını düzenle ve yönet',
            icon: CommandLineIcon,
            color: 'from-purple-500 to-pink-500',
            href: '/dev-panel/commands'
        },
        {
            id: 'health',
            title: 'Sistem Sağlığı',
            description: 'Sunucu ve bot sistem durumu',
            icon: CpuChipIcon,
            color: 'from-green-500 to-emerald-500',
            href: '/dev-panel/health'
        },
        {
            id: 'errors',
            title: 'Hata Yönetimi',
            description: 'Hata logları ve otomatik düzeltme',
            icon: ExclamationTriangleIcon,
            color: 'from-red-500 to-orange-500',
            href: '/dev-panel/errors'
        },
        {
            id: 'database',
            title: 'Database Yönetimi',
            description: 'Veritabanı yedekleme ve geri yükleme',
            icon: CircleStackIcon,
            color: 'from-yellow-500 to-amber-500',
            href: '/dev-panel/database'
        },
        {
            id: 'nrc',
            title: 'NRC Coin Yönetimi',
            description: 'Ekonomi sistemi ve NRC coin kontrolü',
            icon: CircleStackIcon,
            color: 'from-yellow-600 to-amber-600',
            href: '/dev-panel/nrc-management'
        }
    ];

    return (
        <DeveloperOnly>
            <div className="min-h-screen bg-gradient-to-b from-[#0F0F14] via-[#1A1B23] to-[#0F0F14]">
                {/* Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gray-900/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50"
                >
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Link 
                                    href="/"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-white"
                                >
                                    <ArrowLeftIcon className="w-5 h-5" />
                                    <span className="font-semibold">Ana Sayfa</span>
                                </Link>
                                
                                <div className="h-8 w-px bg-white/20"></div>
                                
                                <div>
                                    <h1 className="text-2xl font-black text-white">Developer Panel</h1>
                                    <p className="text-sm text-gray-400">Bot Yönetim ve İzleme</p>
                                </div>
                            </div>

                            {health && (
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getHealthStatusBg(health.status)}`}>
                                    {health.status === 'healthy' ? (
                                        <CheckCircleIcon className={`w-5 h-5 ${getHealthStatusColor(health.status)}`} />
                                    ) : (
                                        <XCircleIcon className={`w-5 h-5 ${getHealthStatusColor(health.status)}`} />
                                    )}
                                    <span className={`font-bold capitalize ${getHealthStatusColor(health.status)}`}>
                                        {health.status}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Quick Stats */}
                    {stats && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                        >
                            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm">
                                <div className="text-sm text-blue-300 font-semibold mb-2">Sunucular</div>
                                <div className="text-3xl font-black text-white">{stats.guilds || 0}</div>
                                <div className="text-xs text-gray-400 mt-1">Aktif sunucu</div>
                            </div>

                            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
                                <div className="text-sm text-purple-300 font-semibold mb-2">Kullanıcılar</div>
                                <div className="text-3xl font-black text-white">{stats.users?.toLocaleString() || 0}</div>
                                <div className="text-xs text-gray-400 mt-1">Toplam kullanıcı</div>
                            </div>

                            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm">
                                <div className="text-sm text-green-300 font-semibold mb-2">Komutlar</div>
                                <div className="text-3xl font-black text-white">{stats.commands || 0}</div>
                                <div className="text-xs text-gray-400 mt-1">Kayıtlı komut</div>
                            </div>

                            <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-xl p-6 backdrop-blur-sm">
                                <div className="text-sm text-yellow-300 font-semibold mb-2">Ping</div>
                                <div className="text-3xl font-black text-white">{stats.ping || 0}ms</div>
                                <div className="text-xs text-gray-400 mt-1">Discord API</div>
                            </div>
                        </motion.div>
                    )}

                    {/* Navigation Sections */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {sections.map((section, index) => {
                            const Icon = section.icon;
                            
                            return (
                                <Link
                                    key={section.id}
                                    href={section.href}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                                        whileHover={{ scale: 1.03, y: -5 }}
                                        className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all cursor-pointer"
                                    >
                                        {/* Gradient Background */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                                        
                                        {/* Content */}
                                        <div className="relative p-6">
                                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                                <Icon className="w-7 h-7 text-white" />
                                            </div>
                                            
                                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
                                                {section.title}
                                            </h3>
                                            
                                            <p className="text-gray-400 text-sm">
                                                {section.description}
                                            </p>
                                        </div>

                                        {/* Arrow */}
                                        <div className="absolute bottom-4 right-4 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </div>
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </motion.div>
                </div>
            </div>
        </DeveloperOnly>
    );
}

