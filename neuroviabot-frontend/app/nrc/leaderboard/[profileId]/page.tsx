'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import GoBackButton from '@/components/nrc/GoBackButton';
// import ProtectedRoute from '@/components/auth/ProtectedRoute'; // TODO: Re-enable for production deployment

interface Achievement {
  id: string;
  name: string;
  icon: string;
  rarity: string;
}

interface Activity {
  id: string;
  type: string;
  amount: number;
  timestamp: string;
}

interface ProfileData {
  userId: string;
  username: string;
  avatar: string | null;
  balance: number;
  rank: number;
  joinedAt: string;
  totalTrades: number;
  totalEarned: number;
  totalSpent: number;
  level: number;
  achievements: Achievement[];
  recentActivity: Activity[];
  premiumTier: 'free' | 'premium' | 'vip';
}

export default function ProfilePage() {
  const params = useParams();
  const profileId = params.profileId as string;
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [profileId]);

  async function loadProfile() {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(`${API_URL}/api/nrc/profile/${profileId}`, {
        credentials: 'include'
      });
      
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
      }
    } catch (error) {
      console.error('Profile load error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    // TODO: Re-enable ProtectedRoute for production deployment
    // <ProtectedRoute reason="Kullanıcı profillerini görüntülemek için giriş yapmalısınız.">
      <div className="profile-page">
        <GoBackButton />
        
        <div className="profile-container">
          {loading ? (
            <div className="profile-loading">
              <div className="profile-loading__spinner" />
              <p>Profil yükleniyor...</p>
            </div>
          ) : profile ? (
            <>
              {/* Profile Header */}
              <motion.section 
                className="profile-header"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="profile-header__avatar">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt={profile.username} />
                  ) : (
                    <div className="profile-header__avatar-placeholder">
                      {profile.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {profile.premiumTier !== 'free' && (
                    <div className="profile-header__badge">
                      {profile.premiumTier === 'vip' ? '👑' : '⭐'}
                    </div>
                  )}
                </div>
                
                <div className="profile-header__info">
                  <h1>{profile.username}</h1>
                  <div className="profile-header__rank">
                    Sıralama: #{profile.rank}
                  </div>
                  <div className="profile-header__joined">
                    Katılım: {new Date(profile.joinedAt).toLocaleDateString('tr-TR')}
                  </div>
                </div>

                <div className="profile-header__balance">
                  <span className="label">Bakiye</span>
                  <span className="value">{profile.balance.toLocaleString()} NRC</span>
                </div>
              </motion.section>

              {/* Stats Grid */}
              <motion.section 
                className="profile-stats"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="profile-stat-card">
                  <span className="label">Seviye</span>
                  <span className="value">{profile.level}</span>
                </div>
                <div className="profile-stat-card">
                  <span className="label">Toplam İşlem</span>
                  <span className="value">{profile.totalTrades}</span>
                </div>
                <div className="profile-stat-card">
                  <span className="label">Toplam Kazanç</span>
                  <span className="value">{profile.totalEarned.toLocaleString()}</span>
                </div>
                <div className="profile-stat-card">
                  <span className="label">Toplam Harcama</span>
                  <span className="value">{profile.totalSpent.toLocaleString()}</span>
                </div>
              </motion.section>

              {/* Achievements */}
              {profile.achievements && profile.achievements.length > 0 && (
                <motion.section 
                  className="profile-achievements"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h2>Başarılar</h2>
                  <div className="achievements-grid">
                    {profile.achievements.map(achievement => (
                      <div key={achievement.id} className="achievement-card">
                        <div className="achievement-icon">{achievement.icon || '🏆'}</div>
                        <div className="achievement-name">{achievement.name}</div>
                        <div className={`achievement-rarity achievement-rarity--${achievement.rarity}`}>
                          {achievement.rarity}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Recent Activity */}
              {profile.recentActivity && profile.recentActivity.length > 0 && (
                <motion.section 
                  className="profile-activity"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h2>Son Aktiviteler</h2>
                  <div className="activity-list">
                    {profile.recentActivity.map(activity => (
                      <div key={activity.id} className="activity-item">
                        <span className="activity-type">{activity.type}</span>
                        <span className={`activity-amount ${activity.amount > 0 ? 'positive' : 'negative'}`}>
                          {activity.amount > 0 ? '+' : ''}{activity.amount} NRC
                        </span>
                        <span className="activity-time">
                          {new Date(activity.timestamp).toLocaleString('tr-TR')}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}
            </>
          ) : (
            <div className="profile-not-found">
              <div className="profile-not-found__icon">😔</div>
              <h2>Profil Bulunamadı</h2>
              <p>Aradığınız kullanıcı profili bulunamadı veya erişiminiz yok.</p>
            </div>
          )}
        </div>
      </div>
    // </ProtectedRoute>
  );
}

