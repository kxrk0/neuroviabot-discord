'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MusicalNoteIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ForwardIcon,
  SpeakerWaveIcon,
  QueueListIcon,
  ArrowPathIcon,
  ShuffleIcon,
} from '@heroicons/react/24/outline';

interface MusicSettingsProps {
  guildId: string;
  userId: string;
}

interface MusicCommand {
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  category: 'player' | 'controls' | 'queue';
}

const musicCommands: MusicCommand[] = [
  {
    name: 'play',
    description: 'YouTube veya Spotify\'dan müzik çalar',
    icon: PlayIcon,
    color: 'from-green-500 to-emerald-500',
    category: 'player'
  },
  {
    name: 'pause',
    description: 'Müziği duraklatır',
    icon: PauseIcon,
    color: 'from-yellow-500 to-amber-500',
    category: 'controls'
  },
  {
    name: 'resume',
    description: 'Duraklatılmış müziği devam ettirir',
    icon: PlayIcon,
    color: 'from-green-500 to-emerald-500',
    category: 'controls'
  },
  {
    name: 'stop',
    description: 'Müziği durdurur ve kuyruğu temizler',
    icon: StopIcon,
    color: 'from-red-500 to-rose-500',
    category: 'controls'
  },
  {
    name: 'skip',
    description: 'Şu anki şarkıyı atlar',
    icon: ForwardIcon,
    color: 'from-blue-500 to-cyan-500',
    category: 'controls'
  },
  {
    name: 'queue',
    description: 'Müzik kuyruğunu gösterir',
    icon: QueueListIcon,
    color: 'from-purple-500 to-pink-500',
    category: 'queue'
  },
  {
    name: 'nowplaying',
    description: 'Çalan şarkı bilgilerini gösterir',
    icon: MusicalNoteIcon,
    color: 'from-indigo-500 to-purple-500',
    category: 'player'
  },
  {
    name: 'volume',
    description: 'Ses seviyesini ayarlar',
    icon: SpeakerWaveIcon,
    color: 'from-orange-500 to-red-500',
    category: 'controls'
  },
  {
    name: 'clear',
    description: 'Müzik kuyruğunu temizle',
    icon: ArrowPathIcon,
    color: 'from-gray-500 to-slate-500',
    category: 'queue'
  },
  {
    name: 'join',
    description: 'Botu ses kanalına çağırır',
    icon: MusicalNoteIcon,
    color: 'from-teal-500 to-cyan-500',
    category: 'player'
  },
  {
    name: 'leave',
    description: 'Botu ses kanalından çıkarır',
    icon: StopIcon,
    color: 'from-red-500 to-pink-500',
    category: 'player'
  },
];

export default function MusicSettings({ guildId, userId }: MusicSettingsProps) {
  const [selectedCategory, setSelectedCategory] = useState<'player' | 'controls' | 'queue'>('player');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [volume, setVolume] = useState(50);
  const [queue, setQueue] = useState<any[]>([]);

  const categories = [
    { id: 'player', name: 'Çalıcı', icon: MusicalNoteIcon },
    { id: 'controls', name: 'Kontroller', icon: PlayIcon },
    { id: 'queue', name: 'Kuyruk', icon: QueueListIcon },
  ];

  const filteredCommands = musicCommands.filter(cmd => cmd.category === selectedCategory);

  const executeCommand = async (commandName: string, params: any = {}) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neuroviabot.xyz';
      const response = await fetch(`${API_URL}/api/bot-commands/execute/${commandName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          guildId,
          userId,
          ...params
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Update state based on command
        if (commandName === 'play') {
          setIsPlaying(true);
        } else if (commandName === 'pause') {
          setIsPlaying(false);
        } else if (commandName === 'stop') {
          setIsPlaying(false);
          setCurrentTrack(null);
          setQueue([]);
        } else if (commandName === 'volume') {
          setVolume(params.volume || 50);
        }
      }

      return result;
    } catch (error) {
      console.error(`Error executing ${commandName}:`, error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
          <MusicalNoteIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Müzik Sistemi</h2>
          <p className="text-gray-400 text-sm">Sesli kanallarda müzik çalma ve yönetme</p>
        </div>
      </div>

      {/* Current Track Display */}
      {currentTrack && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <MusicalNoteIcon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold">{currentTrack.title}</h3>
              <p className="text-gray-400 text-sm">{currentTrack.artist}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-32 h-1 bg-gray-600 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: '60%' }} />
                </div>
                <span className="text-gray-400 text-xs">2:30 / 4:15</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => executeCommand(isPlaying ? 'pause' : 'resume')}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                {isPlaying ? (
                  <PauseIcon className="w-5 h-5 text-white" />
                ) : (
                  <PlayIcon className="w-5 h-5 text-white" />
                )}
              </button>
              <button
                onClick={() => executeCommand('skip')}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ForwardIcon className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => executeCommand('stop')}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <StopIcon className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Category Tabs */}
      <div className="flex gap-2 p-1 bg-gray-800/50 rounded-lg">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Commands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCommands.map((command, index) => {
          const Icon = command.icon;
          return (
            <motion.div
              key={command.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${command.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-sm">/{command.name}</h3>
                  <p className="text-gray-400 text-xs mt-1">{command.description}</p>
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => executeCommand(command.name)}
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all"
                >
                  Çalıştır
                </button>
                <button
                  onClick={() => executeCommand(command.name, { help: true })}
                  className="px-3 py-2 bg-white/10 text-gray-400 text-xs rounded-lg hover:bg-white/20 hover:text-white transition-all"
                >
                  ?
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Volume Control */}
      <div className="bg-gray-800/50 border border-white/10 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <SpeakerWaveIcon className="w-5 h-5 text-gray-400" />
          <span className="text-white font-semibold">Ses Seviyesi</span>
          <span className="text-gray-400 text-sm">{volume}%</span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          />
          <button
            onClick={() => executeCommand('volume', { volume })}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all"
          >
            Uygula
          </button>
        </div>
      </div>

      {/* Queue Display */}
      {queue.length > 0 && (
        <div className="bg-gray-800/50 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <QueueListIcon className="w-5 h-5 text-gray-400" />
            <span className="text-white font-semibold">Kuyruk ({queue.length} şarkı)</span>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {queue.slice(0, 5).map((track, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                <span className="text-gray-400 text-sm w-6">{index + 1}.</span>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{track.title}</p>
                  <p className="text-gray-400 text-xs">{track.artist}</p>
                </div>
                <span className="text-gray-400 text-xs">{track.duration}</span>
              </div>
            ))}
            {queue.length > 5 && (
              <p className="text-gray-400 text-xs text-center py-2">
                ve {queue.length - 5} şarkı daha...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}