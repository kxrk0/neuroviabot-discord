'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [stats, setStats] = useState({ guilds: 0, users: 0, commands: 0 });

  useEffect(() => {
    // Fetch bot stats
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bot/stats`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Failed to fetch stats:', err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-discord-bg via-discord-bg-secondary to-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-discord-bg/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-discord rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="text-white font-bold text-xl">NeuroViaBot</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition">
                Dashboard
              </Link>
              <Link href="/docs" className="text-gray-300 hover:text-white transition">
                Docs
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            NeuroViaBot
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-slide-up">
            Advanced Multi-Purpose Discord Bot
          </p>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-12">
            Music, Moderation, Economy, Leveling & More! 🎵💰🛡️
          </p>
          
          <div className="flex justify-center space-x-4">
            <a
              href="/dashboard"
              className="px-8 py-4 bg-discord hover:bg-discord-dark text-white rounded-lg font-semibold transition transform hover:scale-105"
            >
              Open Dashboard
            </a>
            <a
              href="https://github.com/kxrk0/neuroviabot-discord"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition transform hover:scale-105"
            >
              View on GitHub
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 text-center border border-gray-700">
            <div className="text-4xl font-bold text-discord mb-2">{stats.guilds}+</div>
            <div className="text-gray-400">Servers</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 text-center border border-gray-700">
            <div className="text-4xl font-bold text-discord mb-2">{(stats.users / 1000).toFixed(0)}K+</div>
            <div className="text-gray-400">Users</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 text-center border border-gray-700">
            <div className="text-4xl font-bold text-discord mb-2">{stats.commands}</div>
            <div className="text-gray-400">Commands</div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard icon="🎵" title="Music System" description="YouTube & Spotify support with queue management" />
          <FeatureCard icon="💰" title="Economy" description="Virtual currency, daily rewards, and casino games" />
          <FeatureCard icon="🛡️" title="Moderation" description="Auto-moderation, warnings, and ban management" />
          <FeatureCard icon="📊" title="Leveling" description="XP tracking with role rewards and leaderboards" />
          <FeatureCard icon="🎫" title="Tickets" description="Support ticket system with categories" />
          <FeatureCard icon="🎉" title="Giveaways" description="Time-based giveaways with winner selection" />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>© 2025 NeuroViaBot. All rights reserved.</p>
          <p className="mt-2 text-sm">Made with ❤️ by the NeuroVia Team</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-discord transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
