const { Collection } = require('discord.js');
const StreamManager = require('./StreamManager');
const VoiceManager = require('./VoiceManager');
const QueueManager = require('./QueueManager');
const EventManager = require('./EventManager');

/**
 * Modern Music Manager - Discord.js v14 + yt-dlp tabanlı
 * Native dependency'lerden kaçınır, pure JavaScript kullanır
 */
class MusicManager {
    constructor(client) {
        this.client = client;
        this.guilds = new Collection();
        
        // Manager'ları başlat
        this.streamManager = new StreamManager();
        this.voiceManager = new VoiceManager(client);
        this.queueManager = new QueueManager();
        this.eventManager = new EventManager();
        
        console.log('[MUSIC-MANAGER] Modern müzik sistemi başlatıldı');
    }

    /**
     * Guild için müzik sistemi başlat
     */
    async initializeGuild(guildId) {
        try {
            if (this.guilds.has(guildId)) {
                return this.guilds.get(guildId);
            }

            const guildData = {
                id: guildId,
                queue: [],
                currentTrack: null,
                isPlaying: false,
                isPaused: false,
                volume: 50,
                loopMode: 'none', // none, track, queue
                voiceConnection: null,
                audioPlayer: null,
                textChannel: null,
                voiceChannel: null,
                createdAt: new Date(),
                lastActivity: new Date()
            };

            this.guilds.set(guildId, guildData);
            console.log(`[MUSIC-MANAGER] Guild ${guildId} için müzik sistemi başlatıldı`);
            
            return guildData;
        } catch (error) {
            console.error(`[MUSIC-MANAGER] Guild ${guildId} başlatma hatası:`, error);
            throw error;
        }
    }

    /**
     * Guild müzik verilerini al
     */
    getGuildData(guildId) {
        return this.guilds.get(guildId) || null;
    }

    /**
     * Guild müzik verilerini güncelle
     */
    updateGuildData(guildId, data) {
        const guildData = this.getGuildData(guildId);
        if (guildData) {
            Object.assign(guildData, data);
            guildData.lastActivity = new Date();
            return guildData;
        }
        return null;
    }

    /**
     * Guild müzik sistemini temizle
     */
    async cleanupGuild(guildId) {
        try {
            const guildData = this.getGuildData(guildId);
            if (guildData) {
                // Voice connection'ı kapat
                if (guildData.voiceConnection) {
                    await this.voiceManager.disconnect(guildData.voiceConnection);
                }
                
                // Audio player'ı durdur
                if (guildData.audioPlayer) {
                    guildData.audioPlayer.stop();
                }
                
                // Guild verilerini temizle
                this.guilds.delete(guildId);
                console.log(`[MUSIC-MANAGER] Guild ${guildId} müzik sistemi temizlendi`);
            }
        } catch (error) {
            console.error(`[MUSIC-MANAGER] Guild ${guildId} temizleme hatası:`, error);
        }
    }

    /**
     * Sistem durumunu kontrol et
     */
    getSystemStatus() {
        return {
            totalGuilds: this.guilds.size,
            activeGuilds: Array.from(this.guilds.values()).filter(g => g.isPlaying || g.queue.length > 0).length,
            streamManager: this.streamManager.getStatus(),
            voiceManager: this.voiceManager.getStatus(),
            queueManager: this.queueManager.getStatus()
        };
    }

    /**
     * Sistem istatistiklerini al
     */
    getStatistics() {
        const guilds = Array.from(this.guilds.values());
        return {
            totalGuilds: guilds.length,
            playingGuilds: guilds.filter(g => g.isPlaying).length,
            pausedGuilds: guilds.filter(g => g.isPaused).length,
            totalTracks: guilds.reduce((sum, g) => sum + g.queue.length, 0),
            averageQueueSize: guilds.length > 0 ? guilds.reduce((sum, g) => sum + g.queue.length, 0) / guilds.length : 0
        };
    }
}

module.exports = MusicManager;
