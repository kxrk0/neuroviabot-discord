'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MinimalCard, Switch, Input, Button } from '@/components/ui';
import { ChartBarIcon, TrophyIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface LevelingSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export default function LevelingSettings({ settings, onSettingChange }: LevelingSettingsProps) {
  const [levelRoles, setLevelRoles] = useState(settings.levelRoles || []);

  const addLevelRole = () => {
    const newRole = { level: 0, roleId: '' };
    const updated = [...levelRoles, newRole];
    setLevelRoles(updated);
    onSettingChange('levelRoles', updated);
  };

  const removeLevelRole = (index: number) => {
    const updated = levelRoles.filter((_: any, i: number) => i !== index);
    setLevelRoles(updated);
    onSettingChange('levelRoles', updated);
  };

  const updateLevelRole = (index: number, field: string, value: any) => {
    const updated = [...levelRoles];
    updated[index][field] = value;
    setLevelRoles(updated);
    onSettingChange('levelRoles', updated);
  };

  return (
    <MinimalCard className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-blue-500/10">
          <ChartBarIcon className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Leveling System</h2>
          <p className="text-gray-400 text-sm">XP tracking and role rewards</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Enable Leveling */}
        <SettingRow
          icon={<ChartBarIcon className="w-5 h-5" />}
          label="Leveling System"
          description="Track user activity with XP and levels"
          checked={settings.levelingEnabled || false}
          onChange={(e: any) => onSettingChange('levelingEnabled', e.target.checked)}
        />

        {settings.levelingEnabled && (
          <>
            {/* XP Rates */}
            <div className="pt-6 border-t border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">XP Earning Rates</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Min XP Per Message</label>
                    <Input
                      type="number"
                      value={settings.xpMin || 15}
                      onChange={(e: any) => onSettingChange('xpMin', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Max XP Per Message</label>
                    <Input
                      type="number"
                      value={settings.xpMax || 25}
                      onChange={(e: any) => onSettingChange('xpMax', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">XP Cooldown (seconds)</label>
                  <Input
                    type="number"
                    value={settings.xpCooldown || 60}
                    onChange={(e: any) => onSettingChange('xpCooldown', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">Prevent XP spam</p>
                </div>
              </div>
            </div>

            {/* XP Multiplier */}
            <div>
              <label className="text-white font-semibold mb-2 block">XP Multiplier</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.5"
                  value={settings.xpMultiplier || 1}
                  onChange={(e) => onSettingChange('xpMultiplier', parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-discord"
                />
                <span className="text-white font-bold w-12 text-right">{settings.xpMultiplier || 1}x</span>
              </div>
            </div>

            {/* Level-Up Messages */}
            <div className="pt-6 border-t border-white/10">
              <SettingRow
                icon={<TrophyIcon className="w-5 h-5" />}
                label="Level-Up Messages"
                description="Send a message when users level up"
                checked={settings.levelUpMessages || true}
                onChange={(e: any) => onSettingChange('levelUpMessages', e.target.checked)}
              />

              {settings.levelUpMessages && (
                <div className="ml-12 mt-4">
                  <label className="text-sm text-gray-400 mb-2 block">Level-Up Message</label>
                  <Input
                    type="text"
                    placeholder="Congrats {user}! You reached level {level}!"
                    value={settings.levelUpMessage || 'Congrats {user}! You reached level {level}!'}
                    onChange={(e: any) => onSettingChange('levelUpMessage', e.target.value)}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">Variables: {'{user}'}, {'{level}'}</p>
                </div>
              )}
            </div>

            {/* Level Roles */}
            <div className="pt-6 border-t border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Level Role Rewards</h3>
                <Button variant="secondary" onClick={addLevelRole} className="flex items-center gap-2">
                  <PlusIcon className="w-4 h-4" />
                  Add Role Reward
                </Button>
              </div>

              {levelRoles.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-white/10 rounded-lg">
                  <TrophyIcon className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">No role rewards configured</p>
                  <p className="text-gray-500 text-xs">Click "Add Role Reward" to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {levelRoles.map((role: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                    >
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <Input
                          type="number"
                          placeholder="Level"
                          value={role.level}
                          onChange={(e: any) => updateLevelRole(index, 'level', parseInt(e.target.value))}
                        />
                        <Input
                          type="text"
                          placeholder="Role ID"
                          value={role.roleId}
                          onChange={(e: any) => updateLevelRole(index, 'roleId', e.target.value)}
                        />
                      </div>
                      <button
                        onClick={() => removeLevelRole(index)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Ignored Channels */}
            <div className="pt-6 border-t border-white/10">
              <label className="text-white font-semibold mb-2 block">Ignored Channels</label>
              <Input
                type="text"
                placeholder="Channel IDs (comma separated)"
                value={settings.levelingIgnoredChannels || ''}
                onChange={(e: any) => onSettingChange('levelingIgnoredChannels', e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Channels where users won't earn XP</p>
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
