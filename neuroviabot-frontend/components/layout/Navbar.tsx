'use client';

import Link from 'next/link';
import UserAvatar from '../auth/UserAvatar';
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline';

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-30 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Menu + Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition text-gray-400"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-discord rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="hidden sm:block text-white font-bold text-lg">
                NeuroViaBot
              </span>
            </Link>
          </div>
          
          {/* Right: Notifications + User */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-800 transition text-gray-400">
              <BellIcon className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* User Avatar */}
            <UserAvatar />
          </div>
        </div>
      </div>
    </nav>
  );
}
