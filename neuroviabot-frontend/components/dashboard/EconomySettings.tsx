'use client';

import { MinimalCard, Switch, Input } from '@/components/ui';
import { CurrencyDollarIcon, GiftIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

interface EconomySettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export default function EconomySettings({ settings, onSettingChange }: EconomySettingsProps) {
  return (
    <MinimalCard className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-yellow-500/10">
          <CurrencyDollarIcon className="w-6 h-6 text-yellow-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Economy Settings</h2>
          <p className="text-gray-400 text-sm">Virtual currency and rewards system</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Enable Economy */}
        <SettingRow
          icon={<CurrencyDollarIcon className="w-5 h-5" />}
          label="Economy System"
          description="Enable virtual currency and casino games"
          checked={settings.economyEnabled || false}
          onChange={(e: any) => onSettingChange('economyEnabled', e.target.checked)}
        />

        {settings.economyEnabled && (
          <>
            {/* Currency Name */}
            <div>
              <label className="text-white font-semibold mb-2 block">Currency Name</label>
              <Input
                type="text"
                placeholder="coins"
                value={settings.currencyName || 'coins'}
                onChange={(e: any) => onSettingChange('currencyName', e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">The name of your server's currency</p>
            </div>

            {/* Currency Symbol */}
            <div>
              <label className="text-white font-semibold mb-2 block">Currency Symbol</label>
              <Input
                type="text"
                placeholder="💰"
                value={settings.currencySymbol || '💰'}
                onChange={(e: any) => onSettingChange('currencySymbol', e.target.value)}
                className="w-full"
              />
            </div>

            {/* Earning Settings */}
            <div className="pt-6 border-t border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Earning Rates</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block flex items-center gap-2">
                    <GiftIcon className="w-4 h-4" />
                    Daily Reward Amount
                  </label>
                  <Input
                    type="number"
                    value={settings.dailyAmount || 100}
                    onChange={(e: any) => onSettingChange('dailyAmount', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Coins Per Message</label>
                  <Input
                    type="number"
                    value={settings.messageCoins || 5}
                    onChange={(e: any) => onSettingChange('messageCoins', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">Reward for sending messages (has cooldown)</p>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Voice Channel Bonus (per minute)</label>
                  <Input
                    type="number"
                    value={settings.voiceBonus || 2}
                    onChange={(e: any) => onSettingChange('voiceBonus', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Casino Settings */}
            <div className="pt-6 border-t border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Casino & Gambling</h3>
              
              <div className="space-y-4">
                <SettingRow
                  icon={<CurrencyDollarIcon className="w-5 h-5" />}
                  label="Enable Casino Games"
                  description="Allow users to gamble their coins"
                  checked={settings.casinoEnabled || true}
                  onChange={(e: any) => onSettingChange('casinoEnabled', e.target.checked)}
                />

                {settings.casinoEnabled && (
                  <div className="ml-12 grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Minimum Bet</label>
                      <Input
                        type="number"
                        value={settings.minBet || 10}
                        onChange={(e: any) => onSettingChange('minBet', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Maximum Bet</label>
                      <Input
                        type="number"
                        value={settings.maxBet || 1000}
                        onChange={(e: any) => onSettingChange('maxBet', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Shop Settings */}
            <div className="pt-6 border-t border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <ShoppingBagIcon className="w-5 h-5" />
                Shop System
              </h3>
              
              <SettingRow
                icon={<ShoppingBagIcon className="w-5 h-5" />}
                label="Enable Shop"
                description="Allow users to buy items with coins"
                checked={settings.shopEnabled || true}
                onChange={(e: any) => onSettingChange('shopEnabled', e.target.checked)}
              />
            </div>

            {/* Work Command */}
            <div className="pt-6 border-t border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Work Command</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Min Work Reward</label>
                  <Input
                    type="number"
                    value={settings.workMin || 50}
                    onChange={(e: any) => onSettingChange('workMin', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Max Work Reward</label>
                  <Input
                    type="number"
                    value={settings.workMax || 150}
                    onChange={(e: any) => onSettingChange('workMax', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="text-sm text-gray-400 mb-2 block">Work Cooldown (hours)</label>
                <Input
                  type="number"
                  value={settings.workCooldown || 1}
                  onChange={(e: any) => onSettingChange('workCooldown', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
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
