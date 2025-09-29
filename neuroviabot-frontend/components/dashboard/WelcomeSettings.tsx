'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MinimalCard, Switch, Input, Button } from '@/components/ui';
import { 
  HandRaisedIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline';

interface WelcomeSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export default function WelcomeSettings({ settings, onSettingChange }: WelcomeSettingsProps) {
  const [previewMessage, setPreviewMessage] = useState('');

  const variables = [
    { name: '{user}', description: 'Mentions the new user' },
    { name: '{username}', description: "User's name" },
    { name: '{server}', description: 'Server name' },
    { name: '{memberCount}', description: 'Total member count' },
  ];

  const generatePreview = () => {
    let preview = settings.welcomeMessage || 'Welcome {user} to {server}!';
    preview = preview
      .replace('{user}', '@NewUser')
      .replace('{username}', 'NewUser')
      .replace('{server}', 'Your Server')
      .replace('{memberCount}', '1,234');
    setPreviewMessage(preview);
  };

  return (
    <MinimalCard className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-green-500/10">
          <HandRaisedIcon className="w-6 h-6 text-green-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Welcome System</h2>
          <p className="text-gray-400 text-sm">Greet new members with custom messages</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Enable Welcome */}
        <SettingRow
          icon={<HandRaisedIcon className="w-5 h-5" />}
          label="Welcome Messages"
          description="Send a message when someone joins"
          checked={settings.welcomeEnabled || false}
          onChange={(e: any) => onSettingChange('welcomeEnabled', e.target.checked)}
        />

        {settings.welcomeEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-6"
          >
            {/* Welcome Channel */}
            <div>
              <label className="text-white font-semibold mb-2 block">Welcome Channel ID</label>
              <Input
                type="text"
                placeholder="Enter channel ID"
                value={settings.welcomeChannel || ''}
                onChange={(e: any) => onSettingChange('welcomeChannel', e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">The channel where welcome messages will be sent</p>
            </div>

            {/* Welcome Message */}
            <div>
              <label className="text-white font-semibold mb-2 block">Welcome Message</label>
              <textarea
                value={settings.welcomeMessage || 'Welcome {user} to {server}! 🎉'}
                onChange={(e) => onSettingChange('welcomeMessage', e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-discord focus:outline-none resize-none h-24"
                placeholder="Enter your welcome message..."
              />
              
              {/* Variables */}
              <div className="mt-3 p-4 bg-white/5 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">Available Variables:</p>
                <div className="grid grid-cols-2 gap-2">
                  {variables.map((v) => (
                    <div key={v.name} className="flex items-center gap-2">
                      <code className="text-xs px-2 py-1 bg-discord/20 text-discord rounded">
                        {v.name}
                      </code>
                      <span className="text-xs text-gray-500">{v.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview Button */}
              <Button
                variant="secondary"
                onClick={generatePreview}
                className="mt-3"
              >
                <SparklesIcon className="w-4 h-4" />
                Preview Message
              </Button>

              {previewMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-4 bg-discord/10 border border-discord/30 rounded-lg"
                >
                  <p className="text-sm text-gray-400 mb-1">Preview:</p>
                  <p className="text-white">{previewMessage}</p>
                </motion.div>
              )}
            </div>

            {/* Embed Options */}
            <div className="pt-6 border-t border-white/10">
              <SettingRow
                icon={<PhotoIcon className="w-5 h-5" />}
                label="Use Embed Message"
                description="Send welcome message as a rich embed"
                checked={settings.welcomeEmbed || false}
                onChange={(e: any) => onSettingChange('welcomeEmbed', e.target.checked)}
              />

              {settings.welcomeEmbed && (
                <div className="ml-12 mt-4 space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Embed Color (Hex)</label>
                    <Input
                      type="text"
                      placeholder="#5865F2"
                      value={settings.welcomeEmbedColor || '#5865F2'}
                      onChange={(e: any) => onSettingChange('welcomeEmbedColor', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Embed Image URL (optional)</label>
                    <Input
                      type="text"
                      placeholder="https://..."
                      value={settings.welcomeEmbedImage || ''}
                      onChange={(e: any) => onSettingChange('welcomeEmbedImage', e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* DM Welcome */}
            <div className="pt-6 border-t border-white/10">
              <SettingRow
                icon={<ChatBubbleLeftRightIcon className="w-5 h-5" />}
                label="Send DM to New Members"
                description="Send a private welcome message"
                checked={settings.welcomeDM || false}
                onChange={(e: any) => onSettingChange('welcomeDM', e.target.checked)}
              />
            </div>

            {/* Auto Role */}
            <div className="pt-6 border-t border-white/10">
              <h3 className="text-lg font-bold text-white mb-2">Auto-Role Assignment</h3>
              <p className="text-sm text-gray-400 mb-4">Automatically give roles to new members</p>
              <Input
                type="text"
                placeholder="Role ID"
                value={settings.autoRole || ''}
                onChange={(e: any) => onSettingChange('autoRole', e.target.value)}
                className="w-full"
              />
            </div>
          </motion.div>
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
