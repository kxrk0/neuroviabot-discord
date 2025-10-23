'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrophyIcon, StarIcon, UserGroupIcon, SparklesIcon, LockClosedIcon, CheckIcon } from '@heroicons/react/24/outline';
import ScrollReveal from '@/components/nrc/ScrollReveal';
import GoBackButton from '@/components/nrc/GoBackButton';
// import ProtectedRoute from '@/components/auth/ProtectedRoute'; // TODO: Re-enable for production deployment

export default function FeaturesPage() {
  const quests = [
    { name: 'Daily Grinder', objective: 'Work 10 times', progress: 7, reward: 500, timeLeft: '12h 34m' },
    { name: 'Trading Master', objective: 'Complete 5 trades', progress: 3, reward: 1000, timeLeft: '2d 5h' },
    { name: 'Lucky Winner', objective: 'Win 3 games', progress: 3, reward: 750, timeLeft: 'Completed!' },
  ];

  const achievements = [
    { icon: '💰', title: 'First Trade', desc: 'Complete your first trade', rarity: 'Common', unlocked: true, reward: 100 },
    { icon: '🎰', title: 'High Roller', desc: 'Win 1000 NRC in games', rarity: 'Rare', unlocked: false, progress: 65 },
    { icon: '🔥', title: 'Streak Master', desc: '30 day work streak', rarity: 'Epic', unlocked: false, progress: 20 },
    { icon: '👑', title: 'Whale Status', desc: 'Hold 10,000 NRC', rarity: 'Legendary', unlocked: false, progress: 10 },
  ];

  const tierFeatures = [
    {
      tier: 'Free',
      price: '$0',
      features: ['Basic commands', 'Standard cooldowns', 'Normal rates', 'Community support'],
    },
    {
      tier: 'Premium',
      price: '$4.99/mo',
      features: ['50% reduced cooldowns', '1.5x bonus multiplier', 'Exclusive commands', 'Priority support', 'Custom reactions'],
      highlight: true,
    },
    {
      tier: 'VIP',
      price: '$9.99/mo',
      features: ['Zero cooldowns', '2x multiplier', 'All Premium features', 'Private trade rooms', 'Early access', 'Monthly 500 NRC'],
    },
  ];

  return (
    // TODO: Re-enable ProtectedRoute for production deployment
    // <ProtectedRoute reason="Özellikler sayfasına erişmek için Discord ile giriş yapmalısınız.">
      <div className="features-page">
        <GoBackButton fallbackPath="/nrc/trading-panel" />
        
        {/* Quest System Section */}
        <section className="features-section">
          <div className="features-container">
            <ScrollReveal>
            <h1 className="features-title">
              <TrophyIcon className="features-title-icon" />
              Advanced Features & Rewards
            </h1>
            <p className="features-subtitle">
              Complete quests, earn achievements, invite friends, and unlock premium benefits
            </p>
          </ScrollReveal>

          <div className="quest-grid">
            <ScrollReveal variant="fadeInLeft" className="quest-info">
              <h2>Quest System</h2>
              <p>Complete daily, weekly, and monthly quests to earn bonus NRC rewards. Each quest type offers different challenges and reward tiers.</p>
              <div className="quest-types">
                <div className="quest-type">
                  <div className="quest-type-icon">📅</div>
                  <div><strong>Daily Quests</strong><br/>Reset every 24 hours</div>
                </div>
                <div className="quest-type">
                  <div className="quest-type-icon">📊</div>
                  <div><strong>Weekly Quests</strong><br/>Higher rewards</div>
                </div>
                <div className="quest-type">
                  <div className="quest-type-icon">🏆</div>
                  <div><strong>Monthly Quests</strong><br/>Exclusive rewards</div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fadeInRight" className="quest-cards">
              {quests.map((quest, i) => (
                <motion.div key={i} className="quest-card" whileHover={{ scale: 1.02 }}>
                  <div className="quest-card-header">
                    <h3>{quest.name}</h3>
                    <div className="quest-reward">+{quest.reward} NRC</div>
                  </div>
                  <p className="quest-objective">{quest.objective}</p>
                  <div className="quest-progress">
                    <div className="quest-progress-bar">
                      <motion.div
                        className="quest-progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${(quest.progress / parseInt(quest.objective.match(/\d+/)?.[0] || '1')) * 100}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                    <span className="quest-progress-text">{quest.progress} / {quest.objective.match(/\d+/)?.[0]}</span>
                  </div>
                  <div className="quest-footer">
                    <span className="quest-time">{quest.timeLeft}</span>
                    {quest.timeLeft === 'Completed!' && (
                      <button className="quest-claim-btn">Claim Reward</button>
                    )}
                  </div>
                </motion.div>
              ))}
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Achievement System Section */}
      <section className="features-section">
        <div className="features-container">
          <ScrollReveal>
            <h2 className="section-title">
              <StarIcon className="w-8 h-8" />
              Achievement System
            </h2>
          </ScrollReveal>

          <div className="achievement-grid">
            {achievements.map((ach, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <motion.div
                  className={`achievement-card ${ach.unlocked ? 'unlocked' : 'locked'}`}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="achievement-icon">{ach.icon}</div>
                  <div className={`achievement-rarity achievement-rarity--${ach.rarity.toLowerCase()}`}>
                    {ach.rarity}
                  </div>
                  <h3>{ach.title}</h3>
                  <p>{ach.desc}</p>
                  {ach.unlocked ? (
                    <div className="achievement-unlocked">
                      <CheckIcon className="w-5 h-5" />
                      Unlocked
                    </div>
                  ) : (
                    <div className="achievement-progress">
                      <div className="achievement-progress-bar">
                        <div className="achievement-progress-fill" style={{ width: `${ach.progress}%` }} />
                      </div>
                      <span>{ach.progress}%</span>
                    </div>
                  )}
                  <div className="achievement-reward">Reward: {ach.reward} NRC</div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Referral Program Section */}
      <section className="features-section referral-section">
        <div className="features-container">
          <ScrollReveal>
            <h2 className="section-title">
              <UserGroupIcon className="w-8 h-8" />
              Referral Program
            </h2>
            <p className="section-subtitle">Invite Friends, Earn Together</p>
          </ScrollReveal>

          <div className="referral-content">
            <ScrollReveal className="referral-card">
              <h3>Your Referral Link</h3>
              <div className="referral-link-box">
                <input type="text" value="https://neurovia.bot/ref/YOUR_CODE" readOnly />
                <button>Copy</button>
              </div>

              <div className="referral-stats">
                <div className="referral-stat">
                  <div className="referral-stat-value">12</div>
                  <div className="referral-stat-label">Total Referrals</div>
                </div>
                <div className="referral-stat">
                  <div className="referral-stat-value">8</div>
                  <div className="referral-stat-label">Active Referrals</div>
                </div>
                <div className="referral-stat">
                  <div className="referral-stat-value">1,200</div>
                  <div className="referral-stat-label">NRC Earned</div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2} className="referral-tiers">
              <h3>Reward Tiers</h3>
              <div className="tier-list">
                <div className="tier-item">
                  <div className="tier-badge">Tier 1</div>
                  <div className="tier-info">
                    <strong>1-5 referrals</strong>
                    <span>100 NRC each</span>
                  </div>
                </div>
                <div className="tier-item">
                  <div className="tier-badge">Tier 2</div>
                  <div className="tier-info">
                    <strong>6-20 referrals</strong>
                    <span>150 NRC each</span>
                  </div>
                </div>
                <div className="tier-item">
                  <div className="tier-badge">Tier 3</div>
                  <div className="tier-info">
                    <strong>21+ referrals</strong>
                    <span>200 NRC each</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section className="features-section premium-section">
        <div className="features-container">
          <ScrollReveal>
            <h2 className="section-title">
              <SparklesIcon className="w-8 h-8" />
              Premium Membership
            </h2>
            <p className="section-subtitle">Unlock exclusive benefits and maximize your earnings</p>
          </ScrollReveal>

          <div className="pricing-grid">
            {tierFeatures.map((tier, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <motion.div
                  className={`pricing-card ${tier.highlight ? 'pricing-card--highlight' : ''}`}
                  whileHover={{ scale: 1.05, y: -8 }}
                >
                  {tier.highlight && <div className="pricing-badge">Most Popular</div>}
                  <h3 className="pricing-tier">{tier.tier}</h3>
                  <div className="pricing-price">{tier.price}</div>
                  <ul className="pricing-features">
                    {tier.features.map((feature, j) => (
                      <li key={j}>
                        <CheckIcon className="w-5 h-5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="pricing-btn">
                    {tier.tier === 'Free' ? 'Current Plan' : 'Upgrade Now'}
                  </button>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
    // </ProtectedRoute>
  );
}

