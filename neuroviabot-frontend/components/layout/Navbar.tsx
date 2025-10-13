'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import UserDropdown from '@/components/auth/UserDropdown';
import NeuroCoinBadge from './NeuroCoinBadge';
import DeveloperMenu from './DeveloperMenu';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useUser } from '@/hooks/useUser';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useUser();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick || (() => setMobileMenuOpen(!mobileMenuOpen))}
            className="navbar-toggle"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
          
          <Link href="/" className="navbar-brand">
            <div className="navbar-brand-logo">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </div>
            <span className="hidden sm:block">
              Neurovia
            </span>
          </Link>
        </div>
        
        {/* Center: Navigation Links (Desktop) */}
        <div className={`navbar-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <Link href="/servers" className="navbar-link">
            Servers
          </Link>
          <Link href="/marketplace" className="navbar-link">
            Marketplace
          </Link>
          <Link href="/quests" className="navbar-link">
            Quests
          </Link>
          <Link href="/leaderboards" className="navbar-link">
            Leaderboards
          </Link>
          <Link href="/premium" className="navbar-link">
            Premium
          </Link>
        </div>
        
        {/* Right: NeuroCoin + Notifications + User */}
        <div className="navbar-actions">
          {/* NeuroCoin Balance (only when logged in) */}
          {user && <NeuroCoinBadge />}
          
          {/* Developer Menu (only visible to developers) */}
          <DeveloperMenu />
          
          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
            className="relative p-2 rounded-lg hover:bg-[#383A40] transition text-gray-400 hover:text-white flex items-center gap-2"
            aria-label="Change language"
            title={language === 'tr' ? 'Switch to English' : 'Türkçe\'ye geç'}
          >
            <span className="text-lg">{language === 'tr' ? '🇹🇷' : '🇺🇸'}</span>
            <span className="hidden md:inline text-sm font-medium">
              {language === 'tr' ? 'TR' : 'EN'}
            </span>
          </button>
          
          {/* Notifications */}
          <button 
            className="relative p-2 rounded-lg hover:bg-[#383A40] transition text-gray-400 hover:text-white nav-notification"
            aria-label="Notifications"
          >
            <BellIcon className="w-6 h-6" />
          </button>
          
          {/* User Dropdown */}
          <UserDropdown />
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
}
