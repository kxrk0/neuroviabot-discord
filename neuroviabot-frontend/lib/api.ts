/**
 * API Client for NeuroViaBot Backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Guild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  features: string[];
  botPresent?: boolean;
  memberCount?: number;
}

export interface BotStats {
  guilds: number;
  users: number;
  commands: number;
  uptime: number;
  ping: number;
  memoryUsage: number;
}

export interface GuildSettings {
  guildId: string;
  prefix: string;
  language: string;
  musicEnabled: boolean;
  moderationEnabled: boolean;
  economyEnabled: boolean;
  levelingEnabled: boolean;
  welcomeEnabled: boolean;
  welcomeChannel: string | null;
  welcomeMessage: string;
  [key: string]: any;
}

/**
 * Fetch user's guilds
 */
export async function fetchUserGuilds(accessToken: string): Promise<Guild[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/guilds/user`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch guilds');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching guilds:', error);
    throw error;
  }
}

/**
 * Check if bot is present in multiple guilds
 */
export async function checkBotInGuilds(guildIds: string[]): Promise<Record<string, boolean>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/bot/check-guilds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ guildIds }),
    });

    if (!response.ok) {
      throw new Error('Failed to check guilds');
    }

    const data = await response.json();
    return data.results.reduce((acc: Record<string, boolean>, item: any) => {
      acc[item.guildId] = item.botPresent;
      return acc;
    }, {});
  } catch (error) {
    console.error('Error checking guilds:', error);
    return {};
  }
}

/**
 * Get bot invite URL for a guild
 */
export async function getBotInviteUrl(guildId?: string): Promise<string> {
  try {
    const params = new URLSearchParams();
    if (guildId) params.append('guildId', guildId);

    const response = await fetch(`${API_BASE_URL}/api/guilds/invite-url?${params}`);
    const data = await response.json();
    return data.inviteUrl;
  } catch (error) {
    console.error('Error getting invite URL:', error);
    // Fallback URL
    const clientId = process.env.NEXT_PUBLIC_BOT_CLIENT_ID || '773539215098249246';
    return `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot%20applications.commands${guildId ? `&guild_id=${guildId}` : ''}`;
  }
}

/**
 * Fetch bot stats
 */
export async function fetchBotStats(): Promise<BotStats> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/bot/stats`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch bot stats');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching bot stats:', error);
    // Return default values on error
    return {
      guilds: 0,
      users: 0,
      commands: 43,
      uptime: 0,
      ping: 0,
      memoryUsage: 0,
    };
  }
}

/**
 * Fetch guild settings
 */
export async function fetchGuildSettings(guildId: string): Promise<GuildSettings> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/guilds/${guildId}/settings`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch guild settings');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching guild settings:', error);
    throw error;
  }
}

/**
 * Update guild settings
 */
export async function updateGuildSettings(
  guildId: string,
  settings: Partial<GuildSettings>
): Promise<{ success: boolean; settings: GuildSettings }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/guilds/${guildId}/settings`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error('Failed to update guild settings');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating guild settings:', error);
    throw error;
  }
}

/**
 * API object for easier imports
 */
export const api = {
  fetchUserGuilds,
  checkBotInGuilds,
  getBotInviteUrl,
  fetchBotStats,
  fetchGuildSettings: async (guildId: string) => await fetchGuildSettings(guildId),
  updateGuildSettings: async (guildId: string, settings: any) => await updateGuildSettings(guildId, settings),
  getGuildStats: async (guildId: string) => await fetchGuildStats(guildId),
};

/**
 * Fetch guild stats
 */
export async function fetchGuildStats(guildId: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/guilds/${guildId}/stats`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch guild stats');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching guild stats:', error);
    throw error;
  }
}