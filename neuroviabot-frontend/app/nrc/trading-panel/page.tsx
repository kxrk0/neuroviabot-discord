'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  CurrencyDollarIcon,
  TrophyIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  PuzzlePieceIcon,
  ClockIcon,
  BoltIcon,
  ArrowPathIcon,
  PaperAirplaneIcon,
  DocumentTextIcon,
  ChartPieIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import { useNRC } from '@/contexts/NRCContext';
import ScrollReveal from '@/components/nrc/ScrollReveal';
import StatCard from '@/components/nrc/StatCard';
import GoBackButton from '@/components/nrc/GoBackButton';
// import ProtectedRoute from '@/components/auth/ProtectedRoute'; // TODO: Re-enable for production deployment

export default function TradingPanelPage() {
  const { userBalance, userStats, currentPrice } = useNRC();
  const [activeTab, setActiveTab] = useState<'history' | 'analytics' | 'docs'>('history');

  // Mock data - replace with real data
  const mockTransactions = [
    { id: 1, date: '2024-01-20', type: 'Work', amount: 100, balance: 1234.56, details: 'Daily work reward' },
    { id: 2, date: '2024-01-20', type: 'Trade', amount: -50, balance: 1134.56, details: 'P2P trade with @user' },
    { id: 3, date: '2024-01-19', type: 'Game Win', amount: 250, balance: 1184.56, details: 'Slots jackpot' },
  ];

  const mockActivities = [
    { user: 'User123', action: 'won', amount: 500, game: 'Slots', time: '2 mins ago' },
    { user: 'User456', action: 'traded', amount: 100, game: null, time: '5 mins ago' },
    { user: 'User789', action: 'worked', amount: 50, game: null, time: '8 mins ago' },
  ];

  return (
    // TODO: Re-enable ProtectedRoute for production deployment
    // <ProtectedRoute reason="Trading Panel'e erişmek için Discord ile giriş yapmalısınız.">
      <div className="trading-panel-page">
        <GoBackButton fallbackPath="/nrc/about" />
        
        {/* Header Section */}
        <section className="trading-panel-header">
          <div className="trading-panel-container">
            <div className="trading-panel-header__grid">
            {/* User Profile Card */}
            <ScrollReveal className="trading-panel-profile">
              <div className="trading-panel-profile__avatar">
                <div className="trading-panel-profile__avatar-inner">👤</div>
              </div>
              <div className="trading-panel-profile__info">
                <h2 className="trading-panel-profile__username">Username</h2>
                <div className="trading-panel-profile__balance">
                  <span className="trading-panel-profile__balance-label">Balance</span>
                  <div className="trading-panel-profile__balance-value">
                    {userBalance.toFixed(2)} <span className="currency">NRC</span>
                  </div>
                  <div className="trading-panel-profile__balance-usd">
                    ≈ ${(userBalance * currentPrice).toFixed(2)} USD
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Quick Stats */}
            <div className="trading-panel-header__stats">
              <StatCard
                label="Today's Earnings"
                value={`${userStats?.todayEarnings || 0} NRC`}
                icon={CurrencyDollarIcon}
                trend="up"
                trendValue="+12.5%"
                delay={0.1}
              />
              <StatCard
                label="Total Trades"
                value={userStats?.totalTrades || 0}
                icon={ArrowPathIcon}
                delay={0.2}
              />
              <StatCard
                label="Rank Position"
                value={`#${userStats?.rank || 0}`}
                icon={TrophyIcon}
                trend="up"
                trendValue="+3"
                delay={0.3}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="trading-panel-main">
        <div className="trading-panel-container">
          <div className="trading-panel-main__grid">
            {/* Left Column - Quick Actions */}
            <ScrollReveal variant="fadeInLeft" className="trading-panel-column">
              <h3 className="trading-panel-column__title">Quick Actions</h3>
              
              {/* Daily Reward */}
              <motion.div className="action-card" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <div className="action-card__icon">
                  <ClockIcon className="w-6 h-6" />
                </div>
                <div className="action-card__content">
                  <h4 className="action-card__title">Daily Reward</h4>
                  <p className="action-card__desc">Claim your daily bonus</p>
                  <div className="action-card__countdown">Ready to claim!</div>
                </div>
                <button className="action-card__button">Claim</button>
              </motion.div>

              {/* Work Command */}
              <motion.div className="action-card" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <div className="action-card__icon">
                  <BoltIcon className="w-6 h-6" />
                </div>
                <div className="action-card__content">
                  <h4 className="action-card__title">Work</h4>
                  <p className="action-card__desc">Earn NRC by working</p>
                  <div className="action-card__cooldown">Cooldown: 1h 23m</div>
                </div>
                <button className="action-card__button" disabled>Wait</button>
              </motion.div>

              {/* Quick Trade */}
              <motion.div className="action-card" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <div className="action-card__icon">
                  <ArrowPathIcon className="w-6 h-6" />
                </div>
                <div className="action-card__content">
                  <h4 className="action-card__title">Quick Trade</h4>
                  <p className="action-card__desc">P2P trading</p>
                </div>
                <button className="action-card__button">Trade</button>
              </motion.div>

              {/* Send NRC */}
              <motion.div className="action-card" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <div className="action-card__icon">
                  <PaperAirplaneIcon className="w-6 h-6" />
                </div>
                <div className="action-card__content">
                  <h4 className="action-card__title">Send NRC</h4>
                  <p className="action-card__desc">Transfer to others</p>
                </div>
                <button className="action-card__button">Send</button>
              </motion.div>
            </ScrollReveal>

            {/* Center Column - Services Hub */}
            <ScrollReveal className="trading-panel-column trading-panel-services">
              <h3 className="trading-panel-column__title">Services</h3>
              
              <div className="services-grid">
                <Link href="/nrc/games" className="service-card">
                  <TrophyIcon className="service-card__icon" />
                  <h4 className="service-card__title">Games Hub</h4>
                  <p className="service-card__desc">Play and win NRC</p>
                  <div className="service-card__arrow">→</div>
                </Link>

                <Link href="/nrc/marketplace" className="service-card">
                  <ShoppingBagIcon className="service-card__icon" />
                  <h4 className="service-card__title">Marketplace</h4>
                  <p className="service-card__desc">Buy & sell items</p>
                  <div className="service-card__arrow">→</div>
                </Link>

                <Link href="/nrc/leaderboard" className="service-card">
                  <ChartBarIcon className="service-card__icon" />
                  <h4 className="service-card__title">Leaderboard</h4>
                  <p className="service-card__desc">View rankings</p>
                  <div className="service-card__arrow">→</div>
                </Link>

                <Link href="/nrc/features" className="service-card">
                  <PuzzlePieceIcon className="service-card__icon" />
                  <h4 className="service-card__title">Features</h4>
                  <p className="service-card__desc">Quests & more</p>
                  <div className="service-card__arrow">→</div>
                </Link>

                <div className="service-card service-card--inline">
                  <CurrencyDollarIcon className="service-card__icon" />
                  <h4 className="service-card__title">Staking</h4>
                  <p className="service-card__desc">Passive income</p>
                  <div className="service-card__badge">Coming Soon</div>
                </div>

                <div className="service-card service-card--inline">
                  <DocumentTextIcon className="service-card__icon" />
                  <h4 className="service-card__title">History</h4>
                  <p className="service-card__desc">View below ↓</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Right Column - Live Feed */}
            <ScrollReveal variant="fadeInRight" className="trading-panel-column">
              <h3 className="trading-panel-column__title">Live Activity</h3>
              
              <div className="live-feed">
                {mockActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    className="live-feed__item"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="live-feed__avatar">👤</div>
                    <div className="live-feed__content">
                      <div className="live-feed__text">
                        <strong>{activity.user}</strong> {activity.action}{' '}
                        <span className="highlight">{activity.amount} NRC</span>
                        {activity.game && ` in ${activity.game}`}
                      </div>
                      <div className="live-feed__time">{activity.time}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="live-feed__filters">
                <button className="filter-btn active">All</button>
                <button className="filter-btn">Work</button>
                <button className="filter-btn">Trade</button>
                <button className="filter-btn">Games</button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Bottom Section - History & Analytics */}
      <section className="trading-panel-bottom">
        <div className="trading-panel-container">
          <ScrollReveal>
            <div className="trading-panel-tabs">
              <button
                className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                <DocumentTextIcon className="w-5 h-5" />
                Transaction History
              </button>
              <button
                className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                <ChartPieIcon className="w-5 h-5" />
                Analytics
              </button>
              <button
                className={`tab-btn ${activeTab === 'docs' ? 'active' : ''}`}
                onClick={() => setActiveTab('docs')}
              >
                <QuestionMarkCircleIcon className="w-5 h-5" />
                Documentation
              </button>
            </div>

            <div className="trading-panel-tab-content">
              {activeTab === 'history' && (
                <div className="history-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Balance After</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockTransactions.map((tx) => (
                        <tr key={tx.id}>
                          <td>{tx.date}</td>
                          <td><span className={`type-badge type-${tx.type.toLowerCase().replace(' ', '-')}`}>{tx.type}</span></td>
                          <td className={tx.amount > 0 ? 'positive' : 'negative'}>
                            {tx.amount > 0 ? '+' : ''}{tx.amount} NRC
                          </td>
                          <td>{tx.balance} NRC</td>
                          <td>{tx.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button className="export-btn">Export CSV</button>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="analytics-content">
                  <div className="analytics-grid">
                    <div className="chart-placeholder">
                      📈 Earnings Chart (7d/30d)
                    </div>
                    <div className="chart-placeholder">
                      📊 Activity Distribution
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'docs' && (
                <div className="docs-content">
                  <h3>Getting Started</h3>
                  <p>Learn how to use NRC Coin trading panel...</p>
                  <h3>Commands</h3>
                  <ul>
                    <li><code>/balance</code> - Check your balance</li>
                    <li><code>/work</code> - Earn NRC</li>
                    <li><code>/trade</code> - Trade with others</li>
                  </ul>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
    // </ProtectedRoute>
  );
}

