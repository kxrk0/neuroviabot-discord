'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ActivityFiltersProps {
    activeFilter: string;
    onFilterChange: (filter: string) => void;
}

const filters = [
    { id: 'all', label: 'Tümü', icon: '📋', color: '#95A5A6' },
    { id: 'nft_purchase', label: 'NFT', icon: '🎨', color: '#E91E63' },
    { id: 'marketplace_trade', label: 'Trade', icon: '🛒', color: '#2ECC71' },
    { id: 'game_win', label: 'Oyun', icon: '🎮', color: '#9B59B6' },
    { id: 'premium_activated', label: 'Premium', icon: '👑', color: '#FFD700' },
    { id: 'investment_created', label: 'Yatırım', icon: '💰', color: '#3498DB' },
    { id: 'quest_completed', label: 'Quest', icon: '🎯', color: '#F39C12' }
];

export default function ActivityFilters({ activeFilter, onFilterChange }: ActivityFiltersProps) {
    return (
        <div className="activity-filters">
            {filters.map((filter) => (
                <motion.button
                    key={filter.id}
                    className={`filter-button ${activeFilter === filter.id ? 'active' : ''}`}
                    onClick={() => onFilterChange(filter.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        borderColor: activeFilter === filter.id ? filter.color : 'rgba(255, 255, 255, 0.1)',
                        background: activeFilter === filter.id ? `${filter.color}15` : 'rgba(255, 255, 255, 0.03)'
                    }}
                >
                    <span className="filter-icon">{filter.icon}</span>
                    <span className="filter-label">{filter.label}</span>
                </motion.button>
            ))}

            <style jsx>{`
                .activity-filters {
                    display: flex;
                    gap: 0.75rem;
                    flex-wrap: wrap;
                    margin-bottom: 1.5rem;
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 12px;
                }

                .filter-button {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    border: 2px solid;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.8);
                }

                .filter-button:hover {
                    color: #fff;
                }

                .filter-button.active {
                    color: #fff;
                }

                .filter-icon {
                    font-size: 1.2rem;
                }

                .filter-label {
                    white-space: nowrap;
                }

                @media (max-width: 768px) {
                    .activity-filters {
                        overflow-x: auto;
                        flex-wrap: nowrap;
                    }
                }
            `}</style>
        </div>
    );
}

