'use client';

import { MinimalCard, Switch, Input } from '@/components/ui';
import { MusicalNoteIcon, SpeakerWaveIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface MusicSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export default function MusicSettings({ settings, onSettingChange }: MusicSettingsProps) {
  return (
    <MinimalCard className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-purple-500/10">
          <MusicalNoteIcon className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Music Settings</h2>
          <p className="text-gray-400 text-sm">Configure music playback options</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Enable Music */}
        <SettingRow
          icon={<MusicalNoteIcon className="w-5 h-5" />}
          label="Music System"
          description="Enable music commands and playback"
          checked={settings.musicEnabled || false}
          onChange={(e: any) => onSettingChange('musicEnabled', e.target.checked)}
        />

        {settings.musicEnabled && (
          <>
            {/* Default Volume */}
            <div>
              <label className="text-white font-semibold mb-2 block flex items-center gap-2">
                <SpeakerWaveIcon className="w-5 h-5" />
                Default Volume
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.defaultVolume || 50}
                  onChange={(e) => onSettingChange('defaultVolume', parseInt(e.target.value))}
                  className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-discord"
                />
                <span className="text-white font-bold w-12 text-right">{settings.defaultVolume || 50}%</span>
              </div>
            </div>

            {/* DJ Role */}
            <div>
              <label className="text-white font-semibold mb-2 block flex items-center gap-2">
                <UserGroupIcon className="w-5 h-5" />
                DJ Role (optional)
              </label>
              <Input
                type="text"
                placeholder="DJ Role ID - Leave empty for everyone"
                value={settings.djRole || ''}
                onChange={(e: any) => onSettingChange('djRole', e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Users with this role can control music</p>
            </div>

            {/* Music Channel Restriction */}
            <div>
              <label className="text-white font-semibold mb-2 block">Music Channel Restriction</label>
              <Input
                type="text"
                placeholder="Channel ID - Leave empty for all channels"
                value={settings.musicChannel || ''}
                onChange={(e: any) => onSettingChange('musicChannel', e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Limit music commands to specific channel</p>
            </div>

            {/* Queue Settings */}
            <div className="pt-6 border-t border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Queue Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Max Queue Size</label>
                  <Input
                    type="number"
                    value={settings.maxQueueSize || 100}
                    onChange={(e: any) => onSettingChange('maxQueueSize', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Max Song Duration (minutes)</label>
                  <Input
                    type="number"
                    value={settings.maxSongDuration || 30}
                    onChange={(e: any) => onSettingChange('maxSongDuration', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Advanced Options */}
            <div className="pt-6 border-t border-white/10 space-y-4">
              <SettingRow
                icon={<MusicalNoteIcon className="w-5 h-5" />}
                label="24/7 Mode"
                description="Keep bot in voice channel 24/7"
                checked={settings.music247 || false}
                onChange={(e: any) => onSettingChange('music247', e.target.checked)}
              />
              
              <SettingRow
                icon={<MusicalNoteIcon className="w-5 h-5" />}
                label="Allow Filters"
                description="Enable audio filters (bass boost, nightcore, etc.)"
                checked={settings.allowFilters || true}
                onChange={(e: any) => onSettingChange('allowFilters', e.target.checked)}
              />
            </div>
          </>
        )}
      </div>
    </MinimalCard>
  );
}

function SettingRow({ icon, label, description, checked, onChange }: any) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-start gap-3 flex-1">
        <div className="p-2 rounded-lg bg-white/5 text-gray-400 mt-1">
          {icon}
        </div>
        <div>
          <h4 className="text-white font-semibold mb-1">{label}</h4>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onChange={onChange} />
    </div>
  );
}
