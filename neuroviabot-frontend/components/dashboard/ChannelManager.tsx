'use client';

import React from 'react';
import { HashtagIcon } from '@heroicons/react/24/outline';

interface ChannelManagerProps {
  guildId: string;
  userId: string;
}

export default function ChannelManager({ guildId, userId }: ChannelManagerProps) {
  return (
    <div className="text-center p-12">
      <HashtagIcon className="w-16 h-16 text-blue-400 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">Kanal Yönetimi</h3>
      <p className="text-gray-400">Kanal yönetimi özellikleri geliştiriliyor...</p>
    </div>
  );
}

