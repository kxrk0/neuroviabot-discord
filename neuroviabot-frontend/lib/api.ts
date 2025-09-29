import axios, { AxiosInstance, AxiosError } from 'axios';

/**
 * API Client for Backend Communication
 */
class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Send cookies
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = typeof window !== 'undefined' 
          ? localStorage.getItem('authToken') 
          : null;
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Unauthorized - redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // ==========================================
  // BOT STATS
  // ==========================================
  
  async getBotStats() {
    const { data } = await this.client.get('/api/bot/stats');
    return data;
  }

  async getBotStatus() {
    const { data } = await this.client.get('/api/bot/status');
    return data;
  }

  // ==========================================
  // USER & AUTH
  // ==========================================
  
  async getCurrentUser() {
    const { data } = await this.client.get('/api/user/me');
    return data;
  }

  async getUserGuilds() {
    const { data } = await this.client.get('/api/user/guilds');
    return data;
  }

  // ==========================================
  // GUILD/SERVER MANAGEMENT
  // ==========================================
  
  async getGuildSettings(guildId: string) {
    const { data } = await this.client.get(`/api/guilds/${guildId}/settings`);
    return data;
  }

  async updateGuildSettings(guildId: string, settings: any) {
    const { data } = await this.client.patch(`/api/guilds/${guildId}/settings`, settings);
    return data;
  }

  async getGuildStats(guildId: string) {
    const { data } = await this.client.get(`/api/guilds/${guildId}/stats`);
    return data;
  }

  async getGuildMembers(guildId: string, page: number = 1, limit: number = 50) {
    const { data } = await this.client.get(`/api/guilds/${guildId}/members`, {
      params: { page, limit },
    });
    return data;
  }

  // ==========================================
  // MODERATION
  // ==========================================
  
  async getModerationCases(guildId: string) {
    const { data } = await this.client.get(`/api/guilds/${guildId}/moderation/cases`);
    return data;
  }

  async createModerationCase(guildId: string, caseData: any) {
    const { data } = await this.client.post(`/api/guilds/${guildId}/moderation/cases`, caseData);
    return data;
  }

  // ==========================================
  // ECONOMY
  // ==========================================
  
  async getEconomySettings(guildId: string) {
    const { data } = await this.client.get(`/api/guilds/${guildId}/economy/settings`);
    return data;
  }

  async updateEconomySettings(guildId: string, settings: any) {
    const { data } = await this.client.patch(`/api/guilds/${guildId}/economy/settings`, settings);
    return data;
  }

  async getLeaderboard(guildId: string, type: 'money' | 'level' = 'money') {
    const { data } = await this.client.get(`/api/guilds/${guildId}/leaderboard/${type}`);
    return data;
  }

  // ==========================================
  // LEVELING
  // ==========================================
  
  async getLevelingSettings(guildId: string) {
    const { data } = await this.client.get(`/api/guilds/${guildId}/leveling/settings`);
    return data;
  }

  async updateLevelingSettings(guildId: string, settings: any) {
    const { data } = await this.client.patch(`/api/guilds/${guildId}/leveling/settings`, settings);
    return data;
  }

  // ==========================================
  // MUSIC
  // ==========================================
  
  async getMusicQueue(guildId: string) {
    const { data } = await this.client.get(`/api/guilds/${guildId}/music/queue`);
    return data;
  }

  async playMusic(guildId: string, query: string) {
    const { data } = await this.client.post(`/api/guilds/${guildId}/music/play`, { query });
    return data;
  }

  async pauseMusic(guildId: string) {
    const { data } = await this.client.post(`/api/guilds/${guildId}/music/pause`);
    return data;
  }

  async skipMusic(guildId: string) {
    const { data} = await this.client.post(`/api/guilds/${guildId}/music/skip`);
    return data;
  }

  async stopMusic(guildId: string) {
    const { data } = await this.client.post(`/api/guilds/${guildId}/music/stop`);
    return data;
  }

  // ==========================================
  // COMMANDS
  // ==========================================
  
  async getCommandStats(guildId?: string) {
    const { data } = await this.client.get('/api/commands/stats', {
      params: guildId ? { guildId } : undefined,
    });
    return data;
  }

  async getCommandHistory(guildId: string, page: number = 1, limit: number = 50) {
    const { data } = await this.client.get(`/api/guilds/${guildId}/commands/history`, {
      params: { page, limit },
    });
    return data;
  }

  // ==========================================
  // ANALYTICS
  // ==========================================
  
  async getAnalytics(guildId: string, period: '7d' | '30d' | '90d' = '7d') {
    const { data } = await this.client.get(`/api/guilds/${guildId}/analytics`, {
      params: { period },
    });
    return data;
  }
}

// Export singleton instance
export const api = new APIClient();
export default api;
