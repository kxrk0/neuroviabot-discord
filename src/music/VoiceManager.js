const { 
    joinVoiceChannel, 
    createAudioPlayer, 
    createAudioResource,
    AudioPlayerStatus,
    VoiceConnectionStatus,
    getVoiceConnection,
    entersState
} = require('@discordjs/voice');
const { pipeline } = require('stream');
const { promisify } = require('util');
const pipelineAsync = promisify(pipeline);

/**
 * Modern Voice Manager - @discordjs/voice tabanlı
 * Discord voice bağlantı ve audio player yönetimi
 */
class VoiceManager {
    constructor(client) {
        this.client = client;
        this.connections = new Map();
        this.players = new Map();
        
        console.log('[VOICE-MANAGER] @discordjs/voice tabanlı voice manager başlatıldı');
    }

    /**
     * Voice channel'a bağlan
     */
    async connect(guildId, voiceChannelId, textChannelId) {
        try {
            console.log(`[VOICE-MANAGER] Voice channel'a bağlanılıyor: ${voiceChannelId}`);

            // Mevcut bağlantıyı kontrol et
            const existingConnection = this.connections.get(guildId);
            if (existingConnection) {
                await this.disconnect(guildId);
            }

            // Yeni bağlantı oluştur
            const connection = joinVoiceChannel({
                channelId: voiceChannelId,
                guildId: guildId,
                adapterCreator: guildId => {
                    const guild = this.client.guilds.cache.get(guildId);
                    return guild.voiceAdapterCreator;
                }
            });

            // Bağlantıyı kaydet
            this.connections.set(guildId, {
                connection,
                voiceChannelId,
                textChannelId,
                connectedAt: new Date()
            });

            // Bağlantı durumunu bekle
            await entersState(connection, VoiceConnectionStatus.Ready, 30000);

            console.log(`[VOICE-MANAGER] Voice channel'a bağlandı: ${voiceChannelId}`);
            return connection;

        } catch (error) {
            console.error(`[VOICE-MANAGER] Voice channel bağlantı hatası:`, error);
            throw new Error(`Voice channel'a bağlanılamadı: ${error.message}`);
        }
    }

    /**
     * Voice channel'dan ayrıl
     */
    async disconnect(guildId) {
        try {
            const connectionData = this.connections.get(guildId);
            if (!connectionData) {
                return;
            }

            console.log(`[VOICE-MANAGER] Voice channel'dan ayrılıyor: ${guildId}`);

            // Audio player'ı durdur
            const player = this.players.get(guildId);
            if (player) {
                player.stop();
                this.players.delete(guildId);
            }

            // Bağlantıyı kapat
            connectionData.connection.destroy();
            this.connections.delete(guildId);

            console.log(`[VOICE-MANAGER] Voice channel'dan ayrıldı: ${guildId}`);

        } catch (error) {
            console.error(`[VOICE-MANAGER] Voice channel ayrılma hatası:`, error);
        }
    }

    /**
     * Audio player oluştur
     */
    createPlayer(guildId) {
        try {
            console.log(`[VOICE-MANAGER] Audio player oluşturuluyor: ${guildId}`);

            const player = createAudioPlayer({
                behaviors: {
                    noSubscriber: 'pause',
                    maxMissedFrames: 5
                }
            });

            // Player event listener'ları
            player.on(AudioPlayerStatus.Playing, () => {
                console.log(`[VOICE-MANAGER] Audio player başladı: ${guildId}`);
            });

            player.on(AudioPlayerStatus.Paused, () => {
                console.log(`[VOICE-MANAGER] Audio player duraklatıldı: ${guildId}`);
            });

            player.on(AudioPlayerStatus.Idle, () => {
                console.log(`[VOICE-MANAGER] Audio player boşta: ${guildId}`);
            });

            player.on('error', (error) => {
                console.error(`[VOICE-MANAGER] Audio player hatası:`, error);
            });

            // Player'ı kaydet
            this.players.set(guildId, player);

            // Voice connection'a bağla
            const connectionData = this.connections.get(guildId);
            if (connectionData) {
                connectionData.connection.subscribe(player);
            }

            console.log(`[VOICE-MANAGER] Audio player oluşturuldu: ${guildId}`);
            return player;

        } catch (error) {
            console.error(`[VOICE-MANAGER] Audio player oluşturma hatası:`, error);
            throw new Error(`Audio player oluşturulamadı: ${error.message}`);
        }
    }

    /**
     * Audio resource oluştur
     */
    createResource(stream, options = {}) {
        try {
            console.log(`[VOICE-MANAGER] Audio resource oluşturuluyor`);

            const resource = createAudioResource(stream, {
                inputType: 'stream',
                inlineVolume: true,
                ...options
            });

            console.log(`[VOICE-MANAGER] Audio resource oluşturuldu`);
            return resource;

        } catch (error) {
            console.error(`[VOICE-MANAGER] Audio resource oluşturma hatası:`, error);
            throw new Error(`Audio resource oluşturulamadı: ${error.message}`);
        }
    }

    /**
     * Müzik çal
     */
    async play(guildId, stream, options = {}) {
        try {
            console.log(`[VOICE-MANAGER] Müzik çalınıyor: ${guildId}`);

            // Audio player'ı al veya oluştur
            let player = this.players.get(guildId);
            if (!player) {
                player = this.createPlayer(guildId);
            }

            // Audio resource oluştur
            const resource = this.createResource(stream, options);

            // Müziği çal
            player.play(resource);

            console.log(`[VOICE-MANAGER] Müzik çalınıyor: ${guildId}`);
            return player;

        } catch (error) {
            console.error(`[VOICE-MANAGER] Müzik çalma hatası:`, error);
            throw new Error(`Müzik çalınamadı: ${error.message}`);
        }
    }

    /**
     * Müziği duraklat
     */
    pause(guildId) {
        try {
            const player = this.players.get(guildId);
            if (player && player.state.status === AudioPlayerStatus.Playing) {
                player.pause();
                console.log(`[VOICE-MANAGER] Müzik duraklatıldı: ${guildId}`);
                return true;
            }
            return false;
        } catch (error) {
            console.error(`[VOICE-MANAGER] Müzik duraklatma hatası:`, error);
            return false;
        }
    }

    /**
     * Müziği devam ettir
     */
    resume(guildId) {
        try {
            const player = this.players.get(guildId);
            if (player && player.state.status === AudioPlayerStatus.Paused) {
                player.unpause();
                console.log(`[VOICE-MANAGER] Müzik devam ettirildi: ${guildId}`);
                return true;
            }
            return false;
        } catch (error) {
            console.error(`[VOICE-MANAGER] Müzik devam ettirme hatası:`, error);
            return false;
        }
    }

    /**
     * Müziği durdur
     */
    stop(guildId) {
        try {
            const player = this.players.get(guildId);
            if (player) {
                player.stop();
                console.log(`[VOICE-MANAGER] Müzik durduruldu: ${guildId}`);
                return true;
            }
            return false;
        } catch (error) {
            console.error(`[VOICE-MANAGER] Müzik durdurma hatası:`, error);
            return false;
        }
    }

    /**
     * Ses seviyesini ayarla
     */
    setVolume(guildId, volume) {
        try {
            const player = this.players.get(guildId);
            if (player && player.state.resource) {
                player.state.resource.volume.setVolume(volume / 100);
                console.log(`[VOICE-MANAGER] Ses seviyesi ayarlandı: ${guildId} - ${volume}%`);
                return true;
            }
            return false;
        } catch (error) {
            console.error(`[VOICE-MANAGER] Ses seviyesi ayarlama hatası:`, error);
            return false;
        }
    }

    /**
     * Bağlantı durumunu kontrol et
     */
    isConnected(guildId) {
        const connectionData = this.connections.get(guildId);
        return connectionData && connectionData.connection.state.status === VoiceConnectionStatus.Ready;
    }

    /**
     * Player durumunu kontrol et
     */
    getPlayerStatus(guildId) {
        const player = this.players.get(guildId);
        return player ? player.state.status : null;
    }

    /**
     * Sistem durumu
     */
    getStatus() {
        return {
            activeConnections: this.connections.size,
            activePlayers: this.players.size,
            connections: Array.from(this.connections.keys()),
            players: Array.from(this.players.keys())
        };
    }

    /**
     * Tüm bağlantıları temizle
     */
    async cleanup() {
        try {
            console.log('[VOICE-MANAGER] Tüm bağlantılar temizleniyor');

            for (const [guildId] of this.connections) {
                await this.disconnect(guildId);
            }

            this.connections.clear();
            this.players.clear();

            console.log('[VOICE-MANAGER] Tüm bağlantılar temizlendi');
        } catch (error) {
            console.error('[VOICE-MANAGER] Temizleme hatası:', error);
        }
    }
}

module.exports = VoiceManager;
