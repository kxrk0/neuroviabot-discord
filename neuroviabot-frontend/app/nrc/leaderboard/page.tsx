'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrophyIcon, ChartBarIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import ScrollReveal from '@/components/nrc/ScrollReveal';
import GoBackButton from '@/components/nrc/GoBackButton';
// import ProtectedRoute from '@/components/auth/ProtectedRoute'; // TODO: Re-enable for production deployment

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<'balance' | 'earnings' | 'trades' | 'games'>('balance');

  const topThree = [
    { rank: 1, userId: 'user1', username: 'CryptoKing', balance: 125000, change: 5, avatar: '👑', level: 50 },
    { rank: 2, userId: 'user2', username: 'TradeMaster', balance: 98000, change: 2, avatar: '🥈', level: 48 },
    { rank: 3, userId: 'user3', username: 'GamePro', balance: 87500, change: -1, avatar: '🥉', level: 45 },
  ];

  const leaderboard = [
    { rank: 4, userId: 'user4', username: 'User4', balance: 75000, change: 3 },
    { rank: 5, userId: 'user5', username: 'User5', balance: 68000, change: -2 },
    { rank: 6, userId: 'user6', username: 'User6', balance: 62000, change: 1 },
    { rank: 7, userId: 'user7', username: 'User7', balance: 58000, change: 0 },
    { rank: 8, userId: 'user8', username: 'User8', balance: 54000, change: 4 },
    { rank: 9, userId: 'user9', username: 'User9', balance: 51000, change: -1 },
    { rank: 10, userId: 'user10', username: 'User10', balance: 48000, change: 2 },
  ];

  return (
    // TODO: Re-enable ProtectedRoute for production deployment
    // <ProtectedRoute reason="Leaderboard'a erişmek için Discord ile giriş yapmalısınız.">
      <div className="leaderboard-page">
        <GoBackButton fallbackPath="/nrc/trading-panel" />
        
        {/* Header */}
        <section className="leaderboard-header">
          <div className="leaderboard-container">
            <ScrollReveal>
            <h1 className="leaderboard-title">
              <TrophyIcon className="w-12 h-12" />
              Leaderboard
            </h1>
            <p className="leaderboard-subtitle">
              Compete with others and climb to the top
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Podium - Top 3 */}
      <section className="podium-section">
        <div className="leaderboard-container">
          <div className="podium">
            {/* 2nd Place */}
            <ScrollReveal variant="fadeInLeft" delay={0.2}>
              <motion.div
                className="podium-card podium-card--second"
                whileHover={{ scale: 1.05, y: -8 }}
              >
                <div className="podium-rank">2</div>
                <div className="podium-avatar">{topThree[1].avatar}</div>
                <h3 className="podium-username">{topThree[1].username}</h3>
                <div className="podium-balance">{topThree[1].balance.toLocaleString()} NRC</div>
                <div className="podium-stats">
                  <div className="podium-stat">
                    <span>Level</span>
                    <strong>{topThree[1].level}</strong>
                  </div>
                  <div className="podium-stat">
                    <span>Change</span>
                    <strong className={topThree[1].change > 0 ? 'positive' : 'negative'}>
                      {topThree[1].change > 0 ? '+' : ''}{topThree[1].change}
                    </strong>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>

            {/* 1st Place - Center & Largest */}
            <ScrollReveal delay={0.1}>
              <motion.div
                className="podium-card podium-card--first"
                whileHover={{ scale: 1.05, y: -8 }}
              >
                <div className="podium-crown">👑</div>
                <div className="podium-rank">1</div>
                <div className="podium-avatar podium-avatar--large">{topThree[0].avatar}</div>
                <h3 className="podium-username">{topThree[0].username}</h3>
                <div className="podium-balance">{topThree[0].balance.toLocaleString()} NRC</div>
                <div className="podium-stats">
                  <div className="podium-stat">
                    <span>Level</span>
                    <strong>{topThree[0].level}</strong>
                  </div>
                  <div className="podium-stat">
                    <span>Change</span>
                    <strong className="positive">+{topThree[0].change}</strong>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>

            {/* 3rd Place */}
            <ScrollReveal variant="fadeInRight" delay={0.2}>
              <motion.div
                className="podium-card podium-card--third"
                whileHover={{ scale: 1.05, y: -8 }}
              >
                <div className="podium-rank">3</div>
                <div className="podium-avatar">{topThree[2].avatar}</div>
                <h3 className="podium-username">{topThree[2].username}</h3>
                <div className="podium-balance">{topThree[2].balance.toLocaleString()} NRC</div>
                <div className="podium-stats">
                  <div className="podium-stat">
                    <span>Level</span>
                    <strong>{topThree[2].level}</strong>
                  </div>
                  <div className="podium-stat">
                    <span>Change</span>
                    <strong className="negative">{topThree[2].change}</strong>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="leaderboard-tabs-section">
        <div className="leaderboard-container">
          <ScrollReveal>
            <div className="leaderboard-tabs">
              <button
                className={`tab ${activeTab === 'balance' ? 'active' : ''}`}
                onClick={() => setActiveTab('balance')}
              >
                All Time Balance
              </button>
              <button
                className={`tab ${activeTab === 'earnings' ? 'active' : ''}`}
                onClick={() => setActiveTab('earnings')}
              >
                Monthly Earnings
              </button>
              <button
                className={`tab ${activeTab === 'trades' ? 'active' : ''}`}
                onClick={() => setActiveTab('trades')}
              >
                Total Trades
              </button>
              <button
                className={`tab ${activeTab === 'games' ? 'active' : ''}`}
                onClick={() => setActiveTab('games')}
              >
                Game Wins
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Leaderboard Table */}
      <section className="leaderboard-table-section">
        <div className="leaderboard-container">
          <div className="leaderboard-grid">
            <ScrollReveal className="leaderboard-table-wrapper">
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>User</th>
                    <th>Balance</th>
                    <th>Change</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((user, i) => (
                    <motion.tr
                      key={user.rank}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <td className="rank-cell">#{user.rank}</td>
                      <td className="user-cell">
                        <div className="user-avatar">👤</div>
                        <span>{user.username}</span>
                      </td>
                      <td className="balance-cell">{user.balance.toLocaleString()} NRC</td>
                      <td className={`change-cell ${user.change > 0 ? 'positive' : user.change < 0 ? 'negative' : ''}`}>
                        {user.change > 0 && <ArrowUpIcon className="w-4 h-4" />}
                        {user.change < 0 && <ArrowDownIcon className="w-4 h-4" />}
                        {user.change !== 0 && Math.abs(user.change)}
                      </td>
                      <td>
                        <Link href={`/nrc/leaderboard/${user.userId}`}>
                          <button className="view-profile-btn">View Profile</button>
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </ScrollReveal>

            {/* Your Stats Sidebar */}
            <ScrollReveal variant="fadeInRight" className="your-stats-card">
              <h3>Your Stats</h3>
              <div className="your-rank">
                <TrophyIcon className="w-12 h-12" />
                <div className="your-rank-number">#142</div>
                <div className="your-rank-label">Your Rank</div>
              </div>
              <div className="stat-row">
                <span>Your Balance</span>
                <strong>15,420 NRC</strong>
              </div>
              <div className="stat-row">
                <span>Next Rank</span>
                <strong>500 NRC away</strong>
              </div>
              <div className="stat-row">
                <span>Today's Change</span>
                <strong className="positive">+12</strong>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '68%' }}></div>
              </div>
              <p className="progress-text">68% to next rank</p>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
    // </ProtectedRoute>
  );
}

