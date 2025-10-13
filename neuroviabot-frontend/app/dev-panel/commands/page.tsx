'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import DeveloperOnly from '@/components/DeveloperOnly';
import {
    ArrowLeftIcon,
    MagnifyingGlassIcon,
    CommandLineIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

interface Command {
    name: string;
    description: string;
    category: string;
    options: number;
    usageCount: number;
    enabled?: boolean;
}

export default function CommandsPage() {
    const [commands, setCommands] = useState<Command[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        loadCommands();
    }, []);

    const loadCommands = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
            const response = await fetch(`${API_URL}/api/dev/bot/commands`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setCommands(data.commands || []);
            }
        } catch (error) {
            console.error('[Dev Panel] Error loading commands:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleCommand = async (name: string, currentStatus: boolean) => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
            const response = await fetch(`${API_URL}/api/dev/bot/commands/${name}/toggle`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ enabled: !currentStatus })
            });

            if (response.ok) {
                // Update local state
                setCommands(prev => prev.map(cmd => 
                    cmd.name === name ? { ...cmd, enabled: !currentStatus } : cmd
                ));
            }
        } catch (error) {
            console.error('[Dev Panel] Error toggling command:', error);
        }
    };

    const filteredCommands = commands.filter(cmd => {
        const matchesSearch = cmd.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            cmd.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || cmd.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });

    const categories = ['all', ...Array.from(new Set(commands.map(cmd => cmd.category)))];

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
                                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                                    <CommandLineIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-black text-white">Komut Yönetimi</h1>
                                    <p className="text-sm text-gray-400">{commands.length} komut kayıtlı</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-6 flex flex-col md:flex-row gap-4"
                    >
                        {/* Search */}
                        <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Komut ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                            />
                        </div>

                        {/* Category Filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat} className="bg-gray-900">
                                    {cat === 'all' ? 'Tüm Kategoriler' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </option>
                            ))}
                        </select>
                    </motion.div>

                    {/* Commands Grid */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
                            />
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                        >
                            {filteredCommands.map((cmd, index) => (
                                <motion.div
                                    key={cmd.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition-all"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-white mb-1">
                                                /{cmd.name}
                                            </h3>
                                            <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-md">
                                                {cmd.category}
                                            </span>
                                        </div>
                                        
                                        <button
                                            onClick={() => toggleCommand(cmd.name, cmd.enabled ?? true)}
                                            className={`p-2 rounded-lg transition-all ${
                                                cmd.enabled !== false 
                                                    ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' 
                                                    : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                                            }`}
                                        >
                                            {cmd.enabled !== false ? (
                                                <CheckCircleIcon className="w-5 h-5" />
                                            ) : (
                                                <XCircleIcon className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>

                                    <p className="text-gray-400 text-sm mb-4">
                                        {cmd.description}
                                    </p>

                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>{cmd.options} seçenek</span>
                                        <span>{cmd.usageCount || 0} kullanım</span>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {!loading && filteredCommands.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-400">Komut bulunamadı</p>
                        </div>
                    )}
                </div>
            </div>
        </DeveloperOnly>
    );
}

