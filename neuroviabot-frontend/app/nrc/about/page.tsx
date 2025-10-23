'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { 
  ArrowRightIcon, 
  BoltIcon, 
  ShieldCheckIcon, 
  CurrencyDollarIcon,
  UsersIcon,
  SparklesIcon,
  ChartBarIcon,
  TrophyIcon,
  ServerIcon,
  RocketLaunchIcon,
  LockClosedIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

// Feature Card Component with 3D tilt
function FeatureCard({ icon: Icon, title, description, index }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="nrc-feature-card"
    >
      <div className="nrc-feature-card__icon">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="nrc-feature-card__title">{title}</h3>
      <p className="nrc-feature-card__desc">{description}</p>
      <div className="nrc-feature-card__glow" />
    </motion.div>
  );
}

// Stat Card Component
function StatCard({ value, label, index }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="nrc-stat-card"
    >
      <motion.div 
        className="nrc-stat-card__value"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: index * 0.15 + 0.3 }}
      >
        {value}
      </motion.div>
      <div className="nrc-stat-card__label">{label}</div>
    </motion.div>
  );
}

export default function NRCAboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const smoothProgress = useSpring(scrollYProgress, { 
    stiffness: 100, 
    damping: 30, 
    restDelta: 0.001 
  });

  // Parallax effects
  const yHero = useTransform(smoothProgress, [0, 0.3], [0, 150]);
  const opacityHero = useTransform(smoothProgress, [0, 0.3], [1, 0]);

  const features = [
    {
      icon: BoltIcon,
      title: 'Instant Transactions',
      description: 'Lightning-fast transfers powered by real-time WebSocket technology'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Bank-Grade Security',
      description: 'Military-grade encryption protecting every transaction'
    },
    {
      icon: UsersIcon,
      title: 'Community Driven',
      description: 'Built by the community, for the community with continuous evolution'
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Earn Rewards',
      description: 'Daily quests, challenges, and passive income opportunities'
    },
    {
      icon: ChartBarIcon,
      title: 'Live Analytics',
      description: 'Real-time insights into your portfolio and market trends'
    },
    {
      icon: TrophyIcon,
      title: 'Competitive Gaming',
      description: 'Slots, blackjack, coinflip and more ways to win big'
    }
  ];

  const stats = [
    { value: '500K+', label: 'Active Users' },
    { value: '10K+', label: 'Discord Servers' },
    { value: '$10M+', label: 'Trading Volume' },
    { value: '1M+', label: 'Transactions' }
  ];

  return (
    <div className="nrc-about-v2" ref={containerRef}>
      {/* Animated Background */}
      <div className="nrc-about-v2__bg">
        <div className="nrc-about-v2__bg-gradient" />
        <div className="nrc-about-v2__bg-mesh" />
        <div className="nrc-about-v2__bg-grid" />
      </div>

      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="nrc-hero-v2"
        style={{ y: yHero, opacity: opacityHero }}
      >
        <div className="nrc-hero-v2__container">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="nrc-hero-v2__badge"
          >
            <SparklesIcon className="w-4 h-4" />
            <span>Next Generation Economy System</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="nrc-hero-v2__title"
          >
            The Future of
            <br />
            <span className="nrc-hero-v2__title-gradient">Discord Economy</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="nrc-hero-v2__subtitle"
          >
            Revolutionizing community commerce with instant transactions,
            <br />
            secure trading, and unlimited earning potential
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="nrc-hero-v2__cta"
          >
            <Link href="/nrc/trading-panel" className="nrc-btn-primary">
              <span>Start Trading</span>
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
            <a href="#features" className="nrc-btn-secondary">
              <span>Explore Features</span>
            </a>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="nrc-hero-v2__stats"
          >
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} index={index} />
            ))}
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="nrc-hero-v2__orb nrc-hero-v2__orb--1" />
        <div className="nrc-hero-v2__orb nrc-hero-v2__orb--2" />
        <div className="nrc-hero-v2__orb nrc-hero-v2__orb--3" />
      </motion.section>

      {/* Features Section */}
      <section id="features" className="nrc-features-v2">
        <div className="nrc-features-v2__container">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="nrc-features-v2__header"
          >
            <h2 className="nrc-section-title">
              Powerful Features for Your Community
            </h2>
            <p className="nrc-section-subtitle">
              Everything you need to build a thriving economy ecosystem
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="nrc-features-v2__grid">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Discord Integration Section */}
      <section className="nrc-discord-v2">
        <div className="nrc-discord-v2__container">
          <div className="nrc-discord-v2__content">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="nrc-discord-v2__text"
            >
              <div className="nrc-section-badge">
                <ServerIcon className="w-4 h-4" />
                <span>Seamless Integration</span>
              </div>
              <h2 className="nrc-section-title">
                Built for Discord,
                <br />
                Powered by Innovation
              </h2>
              <p className="nrc-section-text">
                Add NRC Coin to your server in seconds. No technical knowledge required—
                just powerful features that work instantly.
              </p>

              {/* Quick Commands */}
              <div className="nrc-discord-v2__commands">
                <div className="nrc-command">
                  <code>/balance</code>
                  <span>Check your NRC balance</span>
                </div>
                <div className="nrc-command">
                  <code>/work</code>
                  <span>Earn NRC by working</span>
                </div>
                <div className="nrc-command">
                  <code>/trade @user amount</code>
                  <span>Trade with others</span>
                </div>
                <div className="nrc-command">
                  <code>/shop</code>
                  <span>Browse marketplace</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="nrc-discord-v2__visual"
            >
              <div className="nrc-discord-mockup">
                <div className="nrc-discord-mockup__window">
                  <div className="nrc-discord-mockup__dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="nrc-discord-mockup__title"># general</span>
                </div>
                <div className="nrc-discord-mockup__content">
                  <div className="nrc-message">
                    <div className="nrc-message__avatar" />
                    <div className="nrc-message__body">
                      <span className="nrc-message__user">User</span>
                      <span className="nrc-message__text">/balance</span>
                    </div>
                  </div>
                  <div className="nrc-message nrc-message--bot">
                    <div className="nrc-message__avatar nrc-message__avatar--bot" />
                    <div className="nrc-message__body">
                      <span className="nrc-message__user">Neurovia Bot</span>
                      <div className="nrc-embed">
                        <div className="nrc-embed__title">💰 Your Balance</div>
                        <div className="nrc-embed__field">
                          <span>NRC Balance:</span>
                          <span className="highlight">1,234.56 NRC</span>
                        </div>
                        <div className="nrc-embed__field">
                          <span>USD Value:</span>
                          <span>$1,234.56</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="nrc-security-v2">
        <div className="nrc-security-v2__container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="nrc-security-v2__header"
          >
            <div className="nrc-section-badge">
              <LockClosedIcon className="w-4 h-4" />
              <span>Enterprise Security</span>
            </div>
            <h2 className="nrc-section-title">
              Secure, Reliable, Transparent
            </h2>
          </motion.div>

          <div className="nrc-security-v2__grid">
            {[
              {
                icon: ServerIcon,
                title: 'Robust Architecture',
                features: ['Node.js backend', 'Real-time WebSocket', 'Secure database', 'RESTful API']
              },
              {
                icon: BoltIcon,
                title: 'Advanced Features',
                features: ['Transaction logging', 'Balance verification', 'Rate limiting', 'Anti-cheat system']
              },
              {
                icon: LockClosedIcon,
                title: 'Bank-Grade Security',
                features: ['Encrypted transactions', 'Complete audit trail', 'User authentication', 'Data protection']
              }
            ].map((col, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="nrc-security-column"
              >
                <div className="nrc-security-column__icon">
                  <col.icon className="w-6 h-6" />
                </div>
                <h3 className="nrc-security-column__title">{col.title}</h3>
                <ul className="nrc-security-column__list">
                  {col.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="nrc-cta-v2">
        <div className="nrc-cta-v2__container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="nrc-cta-v2__content"
          >
            <RocketLaunchIcon className="nrc-cta-v2__icon" />
            <h2 className="nrc-cta-v2__title">
              Ready to Transform Your Community?
            </h2>
            <p className="nrc-cta-v2__text">
              Join thousands of Discord servers already using NRC Coin
            </p>
            <Link href="/nrc/trading-panel" className="nrc-btn-cta">
              <span>Start Trading Now</span>
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </motion.div>
          <div className="nrc-cta-v2__glow" />
        </div>
      </section>
    </div>
  );
}
