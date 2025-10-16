'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import DiscordAvatar from './DiscordAvatar';

interface ActivityCardProps {
    activity: any; // Accept any activity type for flexibility
    index?: number;
}

export default function ActivityCard({ activity, index = 0 }: ActivityCardProps) {
    const getActivityText = () => {
        switch (activity.type) {
            case 'nft_purchase':
                return `${activity.details.itemName} satın aldı`;
            case 'marketplace_trade':
                return `${activity.details.itemName} trade yaptı`;
            case 'premium_activated':
                return `${activity.details.tier.toUpperCase()} Premium aktive etti`;
            case 'investment_created':
                return `${activity.details.duration} günlük yatırım yaptı`;
            case 'game_win':
                return `${activity.details.game}'de kazandı`;
            case 'quest_completed':
                return `${activity.details.questName} tamamladı`;
            default:
                return 'Bir aktivite gerçekleştirdi';
        }
    };

    const getActivityColor = () => {
        const colors: Record<string, string> = {
            nft_purchase: '#E91E63',
            marketplace_trade: '#2ECC71',
            premium_activated: '#FFD700',
            investment_created: '#3498DB',
            game_win: '#9B59B6',
            quest_completed: '#F39C12'
        };
        return colors[activity.type] || '#95A5A6';
    };

    const getActivityIcon = () => {
        const icons: Record<string, string> = {
            nft_purchase: '🎨',
            marketplace_trade: '🛒',
            premium_activated: '👑',
            investment_created: '💰',
            game_win: '🎮',
            quest_completed: '🎯'
        };
        return icons[activity.type] || '📋';
    };

    const timeAgo = formatDistanceToNow(new Date(activity.timestamp), { 
        addSuffix: true,
        locale: tr 
    });

    return (
        <motion.div
            className="activity-card"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            style={{ borderLeftColor: getActivityColor() }}
        >
            <div className="activity-header">
                <div className="avatar-section">
                    <DiscordAvatar
                        userId={activity.userId}
                        avatar={activity.avatar}
                        username={activity.username}
                        size={48}
                        showServer={!!activity.serverIcon}
                        serverIcon={activity.serverIcon}
                    />
                </div>

                <div className="activity-details">
                    <div className="user-info">
                        <span className="username">@{activity.username}</span>
                        {activity.serverName && (
                            <>
                                <span className="separator">·</span>
                                <span className="server-name">{activity.serverName}</span>
                            </>
                        )}
                    </div>
                    <div className="activity-action">
                        <span className="activity-icon">{getActivityIcon()}</span>
                        <span>{getActivityText()}</span>
                    </div>
                </div>

                {activity.amount && (
                    <div className="activity-value" style={{ color: getActivityColor() }}>
                        <span className="amount">{activity.amount.toLocaleString()}</span>
                        <span className="currency">NRC</span>
                    </div>
                )}
            </div>

            <div className="activity-footer">
                <span className="timestamp">{timeAgo}</span>
            </div>

            <style jsx>{`
                .activity-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-left: 3px solid;
                    border-radius: 12px;
                    padding: 1rem;
                    margin-bottom: 0.75rem;
                    transition: all 0.3s ease;
                }

                .activity-card:hover {
                    background: rgba(255, 255, 255, 0.05);
                    transform: translateX(4px);
                }

                .activity-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 0.5rem;
                }

                .avatar-section {
                    flex-shrink: 0;
                }

                .activity-details {
                    flex: 1;
                    min-width: 0;
                }

                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.25rem;
                    font-size: 0.85rem;
                }

                .username {
                    color: #fff;
                    font-weight: 600;
                }

                .separator {
                    color: rgba(255, 255, 255, 0.3);
                }

                .server-name {
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 0.8rem;
                }

                .activity-action {
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 0.95rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .activity-icon {
                    font-size: 1.2rem;
                }

                .activity-value {
                    flex-shrink: 0;
                    text-align: right;
                }

                .amount {
                    font-size: 1.2rem;
                    font-weight: 700;
                }

                .currency {
                    font-size: 0.9rem;
                    margin-left: 0.25rem;
                    opacity: 0.8;
                }

                .activity-footer {
                    padding-left: 64px;
                }

                .timestamp {
                    color: rgba(255, 255, 255, 0.4);
                    font-size: 0.75rem;
                }
            `}</style>
        </motion.div>
    );
}

