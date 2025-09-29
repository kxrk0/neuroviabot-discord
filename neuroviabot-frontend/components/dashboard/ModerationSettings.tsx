'use client';

import { motion } from 'framer-motion';
import { MinimalCard, Switch, Input } from '@/components/ui';
import { 
  ShieldExclamationIcon, 
  ChatBubbleBottomCenterTextIcon,
  LinkIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

interface ModerationSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export default function ModerationSettings({ settings, onSettingChange }: ModerationSettingsProps) {
  return (
    <MinimalCard className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-red-500/10">
          <ShieldExclamationIcon className="w-6 h-6 text-red-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Moderation Settings</h2>
          <p className="text-gray-400 text-sm">Auto-moderation and security features</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Auto-Moderation Toggle */}
        <SettingRow
          icon={<ShieldExclamationIcon className="w-5 h-5" />}
          label="Auto-Moderation"
          description="Automatically detect and handle rule violations"
          checked={settings.autoModEnabled || false}
          onChange={(e: any) => onSettingChange('autoModEnabled', e.target.checked)}
        />

        {settings.autoModEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-12 space-y-4 pl-6 border-l-2 border-discord/30"
          >
            {/* Spam Protection */}
            <SettingRow
              icon={<ChatBubbleBottomCenterTextIcon className="w-5 h-5" />}
              label="Spam Protection"
              description="Prevent message spam and flooding"
              checked={settings.spamProtection || false}
              onChange={(e: any) => onSettingChange('spamProtection', e.target.checked)}
            />

            {settings.spamProtection && (
              <div className="grid grid-cols-2 gap-4 ml-12">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Max Messages</label>
                  <Input
                    type="number"
                    value={settings.spamMaxMessages || 5}
                    onChange={(e: any) => onSettingChange('spamMaxMessages', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Time Window (seconds)</label>
                  <Input
                    type="number"
                    value={settings.spamTimeWindow || 5}
                    onChange={(e: any) => onSettingChange('spamTimeWindow', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {/* Link Protection */}
            <SettingRow
              icon={<LinkIcon className="w-5 h-5" />}
              label="Link/Invite Protection"
              description="Block unauthorized Discord invites and suspicious links"
              checked={settings.linkProtection || false}
              onChange={(e: any) => onSettingChange('linkProtection', e.target.checked)}
            />

            {/* Profanity Filter */}
            <SettingRow
              icon={<ExclamationTriangleIcon className="w-5 h-5" />}
              label="Profanity Filter"
              description="Automatically filter inappropriate language"
              checked={settings.profanityFilter || false}
              onChange={(e: any) => onSettingChange('profanityFilter', e.target.checked)}
            />

            {settings.profanityFilter && (
              <div className="ml-12">
                <label className="text-sm text-gray-400 mb-2 block">Custom Filtered Words (comma separated)</label>
                <Input
                  type="text"
                  placeholder="word1, word2, word3"
                  value={settings.customFilterWords || ''}
                  onChange={(e: any) => onSettingChange('customFilterWords', e.target.value)}
                  className="w-full"
                />
              </div>
            )}
          </motion.div>
        )}

        {/* Warning System */}
        <div className="pt-6 border-t border-white/10">
          <h3 className="text-lg font-bold text-white mb-4">Warning System</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Max Warnings Before Action</label>
              <Input
                type="number"
                value={settings.maxWarnings || 3}
                onChange={(e: any) => onSettingChange('maxWarnings', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Action After Max Warnings</label>
              <select
                value={settings.warningAction || 'mute'}
                onChange={(e) => onSettingChange('warningAction', e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-discord focus:outline-none"
              >
                <option value="mute">Mute</option>
                <option value="kick">Kick</option>
                <option value="ban">Ban</option>
              </select>
            </div>
          </div>
        </div>

        {/* Log Channel */}
        <div className="pt-6 border-t border-white/10">
          <h3 className="text-lg font-bold text-white mb-2">Moderation Logs</h3>
          <p className="text-sm text-gray-400 mb-4">Channel to send moderation logs</p>
          <Input
            type="text"
            placeholder="Log Channel ID"
            value={settings.modLogChannel || ''}
            onChange={(e: any) => onSettingChange('modLogChannel', e.target.value)}
            className="w-full"
          />
        </div>
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
