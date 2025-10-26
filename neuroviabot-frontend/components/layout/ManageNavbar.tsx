'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  BellIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';

interface ManageNavbarProps {
  user?: any;
  guild?: any;
  guilds?: any[];
  onLogout?: () => void;
  onSidebarToggle?: () => void;
  unreadCount?: number;
}

export default function ManageNavbar({ 
  user, 
  guild, 
  guilds = [], 
  onLogout, 
  onSidebarToggle,
  unreadCount = 0 
}: ManageNavbarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-gray-900/95 backdrop-blur-xl border-b border-white/10 z-50">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger */}
          <button
            onClick={onSidebarToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <Bars3Icon className="w-6 h-6 text-gray-300" />
          </button>

          {/* Back to Servers */}
          <Link
            href="/servers"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group"
          >
            <ArrowLeftIcon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
            <span className="hidden sm:inline text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
              Sunuculara Dön
            </span>
          </Link>

          {/* Server Info */}
          {guild && (
            <div className="hidden md:flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center overflow-hidden">
                {guild.icon ? (
                  <img
                    src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=64`}
                    alt={guild.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-sm font-black">
                    {guild.name?.charAt(0) || 'S'}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-tight">
                  {guild.name}
                </p>
                <p className="text-xs text-gray-400">
                  {guild.memberCount || 0} üye
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
            <BellIcon className="w-5 h-5 text-gray-300" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Menu */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all"
              >
                <img
                  src={
                    user.avatar
                      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`
                      : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator || '0') % 5}.png`
                  }
                  alt={user.username}
                  className="w-7 h-7 rounded-full"
                />
                <span className="hidden sm:inline text-sm font-medium text-white">
                  {user.username}
                </span>
                <ChevronDownIcon
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    userMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 rounded-lg bg-gray-800 border border-white/10 shadow-xl z-50 overflow-hidden"
                    >
                      <div className="p-3 border-b border-white/10">
                        <p className="text-white font-semibold text-sm">
                          {user.username}
                        </p>
                        {user.discriminator && user.discriminator !== '0' && (
                          <p className="text-gray-400 text-xs">
                            #{user.discriminator}
                          </p>
                        )}
                      </div>
                      <div className="p-2">
                        <Link
                          href="/"
                          className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-md transition-colors text-sm"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Ana Sayfa
                        </Link>
                        <Link
                          href="/servers"
                          className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-md transition-colors text-sm"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Sunucularım
                        </Link>
                        {onLogout && (
                          <button
                            onClick={() => {
                              setUserMenuOpen(false);
                              onLogout();
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors text-sm"
                          >
                            Çıkış Yap
                          </button>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
