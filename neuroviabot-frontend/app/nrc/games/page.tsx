'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrophyIcon, SparklesIcon, CurrencyDollarIcon, ChartBarIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import ScrollReveal from '@/components/nrc/ScrollReveal';
import GoBackButton from '@/components/nrc/GoBackButton';
// import ProtectedRoute from '@/components/auth/ProtectedRoute'; // TODO: Re-enable for production deployment

export default function GamesPage() {
  const games = [
    {
      name: 'Slots Machine',
      icon: '🎰',
      description: 'Spin the reels and win big jackpots',
      minBet: 10,
      maxBet: 1000,
      plays: 15420,
      winRate: 35,
    },
    {
      name: 'Blackjack',
      icon: '🃏',
      description: 'Beat the dealer in this classic card game',
      minBet: 50,
      maxBet: 5000,
      plays: 8932,
      winRate: 48,
    },
    {
      name: 'Coinflip',
      icon: '🪙',
      description: 'Double or nothing - heads or tails',
      minBet: 5,
      maxBet: 10000,
      plays: 24156,
      winRate: 50,
    },
  ];

  const recentPlays = [
    { player: 'User123', game: 'Slots', bet: 500, result: 'won', winnings: 2500, time: '2 mins ago' },
    { player: 'User456', game: 'Blackjack', bet: 1000, result: 'lost', winnings: 0, time: '5 mins ago' },
    { player: 'User789', game: 'Coinflip', bet: 200, result: 'won', winnings: 400, time: '8 mins ago' },
  ];

  return (
    // TODO: Re-enable ProtectedRoute for production deployment
    // <ProtectedRoute reason="Oyunlara erişmek için Discord ile giriş yapmalısınız.">
      <div className="games-page">
        <GoBackButton fallbackPath="/nrc/trading-panel" />
        
        {/* Hero Banner */}
        <section className="games-hero">
          <div className="games-container">
            <ScrollReveal>
            <h1 className="games-title">
              <TrophyIcon className="w-12 h-12" />
              Test Your Luck, Win Big
            </h1>
            <div className="jackpot-display">
              <SparklesIcon className="jackpot-icon" />
              <div className="jackpot-label">Current Jackpot</div>
              <div className="jackpot-amount">125,000 NRC</div>
            </div>
          </ScrollReveal>

          {/* Recent Big Wins Ticker */}
          <ScrollReveal delay={0.2}>
            <div className="big-wins-ticker">
              <span className="ticker-label">🔥 Recent Big Wins:</span>
              <div className="ticker-content">
                <span>User123 won 5,000 NRC</span>
                <span>•</span>
                <span>User456 won 3,500 NRC</span>
                <span>•</span>
                <span>User789 won 2,800 NRC</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Games Grid */}
      <section className="games-grid-section">
        <div className="games-container">
          <div className="games-grid">
            {games.map((game, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <motion.div
                  className="game-card"
                  whileHover={{ scale: 1.03, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="game-glow" />
                  <div className="game-icon">{game.icon}</div>
                  <h2 className="game-name">{game.name}</h2>
                  <p className="game-description">{game.description}</p>
                  
                  <div className="game-limits">
                    <div className="game-limit">
                      <span>Min Bet</span>
                      <strong>{game.minBet} NRC</strong>
                    </div>
                    <div className="game-limit">
                      <span>Max Bet</span>
                      <strong>{game.maxBet} NRC</strong>
                    </div>
                  </div>

                  <div className="game-stats">
                    <div className="game-stat">
                      <ChartBarIcon className="w-5 h-5" />
                      <span>{game.plays.toLocaleString()} plays</span>
                    </div>
                    <div className="game-stat">
                      <TrophyIcon className="w-5 h-5" />
                      <span>{game.winRate}% win rate</span>
                    </div>
                  </div>

                  <div className="game-actions">
                    <button className="game-play-btn">Play Now</button>
                    <button className="game-rules-btn">
                      <QuestionMarkCircleIcon className="w-5 h-5" />
                      Rules
                    </button>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Your Game Stats */}
      <section className="games-stats-section">
        <div className="games-container">
          <ScrollReveal>
            <h2 className="section-title">Your Gaming Stats</h2>
          </ScrollReveal>

          <div className="stats-grid">
            <ScrollReveal delay={0.1}>
              <div className="stat-card">
                <div className="stat-icon">
                  <TrophyIcon className="w-8 h-8" />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Total Games</div>
                  <div className="stat-value">342</div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="stat-card">
                <div className="stat-icon">
                  <ChartBarIcon className="w-8 h-8" />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Win Rate</div>
                  <div className="stat-value">42%</div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="stat-card">
                <div className="stat-icon">
                  <CurrencyDollarIcon className="w-8 h-8" />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Total Winnings</div>
                  <div className="stat-value positive">+8,450 NRC</div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div className="stat-card">
                <div className="stat-icon">
                  <SparklesIcon className="w-8 h-8" />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Biggest Win</div>
                  <div className="stat-value">2,500 NRC</div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Recent Plays Feed */}
      <section className="recent-plays-section">
        <div className="games-container">
          <ScrollReveal>
            <h2 className="section-title">Recent Plays</h2>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="recent-plays-table">
              <table>
                <thead>
                  <tr>
                    <th>Player</th>
                    <th>Game</th>
                    <th>Bet</th>
                    <th>Result</th>
                    <th>Winnings</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPlays.map((play, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <td className="player-cell">
                        <div className="player-avatar">👤</div>
                        {play.player}
                      </td>
                      <td>{play.game}</td>
                      <td>{play.bet} NRC</td>
                      <td>
                        <span className={`result-badge result-${play.result}`}>
                          {play.result === 'won' ? '✓' : '✗'} {play.result}
                        </span>
                      </td>
                      <td className={play.result === 'won' ? 'positive' : 'negative'}>
                        {play.result === 'won' ? `+${play.winnings}` : play.winnings} NRC
                      </td>
                      <td className="time-cell">{play.time}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
    // </ProtectedRoute>
  );
}

