'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '@/contexts/SocketContext';
import ActivityCard from './ActivityCard';

interface LiveActivity {
    activityId: string;
    type: string;
    userId: string;
    username: string;
    avatar: string;
    serverId?: string;
    serverName?: string;
    serverIcon?: string;
    details: any;
    amount?: number;
    timestamp: string;
}

interface LiveActivityFeedProps {
    filter?: string;
}

export default function LiveActivityFeed({ filter = 'all' }: LiveActivityFeedProps) {
    const [activities, setActivities] = useState<LiveActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const socket = useSocket();

    useEffect(() => {
        loadInitialActivities();

        // Listen for real-time activities
        if (socket) {
            socket.on('nrc_activity', handleNewActivity);
        }

        return () => {
            if (socket) {
                socket.off('nrc_activity', handleNewActivity);
            }
        };
    }, [socket, filter]);

    const loadInitialActivities = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
            const typeParam = filter !== 'all' ? `&type=${filter}` : '';
            const response = await fetch(`${API_URL}/api/nrc/activity/live?limit=50${typeParam}`);
            
            if (response.ok) {
                const data = await response.json();
                setActivities(data.activities || []);
            }
        } catch (error) {
            console.error('[Activity Feed] Error loading activities:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNewActivity = (activity: any) => {
        // Check if filter matches
        if (filter !== 'all' && activity.type !== filter) {
            return;
        }

        setActivities(prev => {
            const newActivities = [activity as LiveActivity, ...prev];
            // Keep only last 50
            return newActivities.slice(0, 50);
        });
    };

    const filteredActivities = filter === 'all' 
        ? activities 
        : activities.filter(a => a.type === filter);

    if (loading) {
        return (
            <div className="activity-feed-loading">
                <motion.div
                    className="spinner"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <p>Aktiviteler yükleniyor...</p>

                <style jsx>{`
                    .activity-feed-loading {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 4rem 2rem;
                        color: rgba(255, 255, 255, 0.6);
                    }

                    .spinner {
                        width: 40px;
                        height: 40px;
                        border: 3px solid rgba(255, 255, 255, 0.1);
                        border-top-color: #FFD700;
                        border-radius: 50%;
                        margin-bottom: 1rem;
                    }
                `}</style>
            </div>
        );
    }

    if (filteredActivities.length === 0) {
        return (
            <div className="activity-feed-empty">
                <div className="empty-icon">📭</div>
                <p>Henüz aktivite yok</p>
                <span className="empty-hint">İlk aktivite siz olun!</span>

                <style jsx>{`
                    .activity-feed-empty {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 4rem 2rem;
                        color: rgba(255, 255, 255, 0.5);
                        text-align: center;
                    }

                    .empty-icon {
                        font-size: 4rem;
                        margin-bottom: 1rem;
                    }

                    p {
                        font-size: 1.2rem;
                        margin-bottom: 0.5rem;
                    }

                    .empty-hint {
                        font-size: 0.9rem;
                        opacity: 0.7;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="live-activity-feed">
            <AnimatePresence mode="popLayout">
                {filteredActivities.map((activity, index) => (
                    <ActivityCard 
                        key={activity.activityId} 
                        activity={activity}
                        index={index}
                    />
                ))}
            </AnimatePresence>

            <style jsx>{`
                .live-activity-feed {
                    max-height: 800px;
                    overflow-y: auto;
                    padding-right: 0.5rem;
                }

                .live-activity-feed::-webkit-scrollbar {
                    width: 6px;
                }

                .live-activity-feed::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }

                .live-activity-feed::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 10px;
                }

                .live-activity-feed::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
            `}</style>
        </div>
    );
}

