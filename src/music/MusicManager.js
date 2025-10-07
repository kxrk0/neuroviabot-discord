// ==========================================
// 🎵 NeuroVia Music System - Core Manager
// ==========================================

const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');
const { logger } = require('../utils/logger');
const StreamExtractor = require('./StreamExtractor');
const QueueManager = require('./QueueManager');
const AudioProcessor = require('./AudioProcessor');
const EventHandler = require('./EventHandler');

class MusicManager {
    constructor(client) {
        this.client = client;
        this.connections = new Map(); // Guild ID -> VoiceConnection
        this.players = new Map(); // Guild ID -> AudioPlayer
        this.queues = new Map(); // Guild ID -> QueueManager
        this.extractor = new StreamExtractor();
        this.processor = new AudioProcessor();
        this.eventHandler = new EventHandler(this);
        
        this.initialize();
        console.log('[MUSIC-MANAGER] 🎵 NeuroVia Music System initialized');
    }

    initialize() {
        // Event handler'ı başlat
        this.eventHandler.setupEventListeners();
        
        // Periodic cleanup
        setInterval(() => this.cleanup(), 300000); // 5 dakikada bir
        
        console.log('[MUSIC-MANAGER] ✅ System initialized successfully');
    }

    // ==========================================
    // Voice Connection Management
    // ==========================================

    async joinChannel(guildId, voiceChannel, textChannel) {
        try {
            console.log(`[MUSIC-MANAGER] Joining voice channel: ${voiceChannel.name} (${guildId})`);

            // Mevcut bağlantıyı kontrol et
            const existingConnection = getVoiceConnection(guildId);
            if (existingConnection) {
                console.log(`[MUSIC-MANAGER] Already connected to voice channel`);
                return true;
            }

            // Yeni bağlantı oluştur
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                selfDeaf: true,
                selfMute: false
            });

            // Bağlantıyı kaydet
            this.connections.set(guildId, connection);

            // Audio player oluştur
            const player = createAudioPlayer();
            this.players.set(guildId, player);

            // Kuyruk yöneticisi oluştur
            const queue = new QueueManager(guildId, textChannel, this);
            this.queues.set(guildId, queue);

            // Bağlantı event listener'ları
            connection.on(VoiceConnectionStatus.Ready, () => {
                console.log(`[MUSIC-MANAGER] ✅ Connected to voice channel: ${voiceChannel.name}`);
                connection.subscribe(player);
            });

            connection.on(VoiceConnectionStatus.Disconnected, () => {
                console.log(`[MUSIC-MANAGER] ❌ Disconnected from voice channel`);
                this.cleanupGuild(guildId);
            });

            connection.on('error', (error) => {
                console.error(`[MUSIC-MANAGER] Voice connection error:`, error);
                this.cleanupGuild(guildId);
            });

            return true;

        } catch (error) {
            console.error(`[MUSIC-MANAGER] Failed to join voice channel:`, error);
            return false;
        }
    }

    async leaveChannel(guildId) {
        try {
            console.log(`[MUSIC-MANAGER] Leaving voice channel (${guildId})`);

            const connection = this.connections.get(guildId);
            if (connection) {
                connection.destroy();
            }

            this.cleanupGuild(guildId);
            return true;

        } catch (error) {
            console.error(`[MUSIC-MANAGER] Failed to leave voice channel:`, error);
            return false;
        }
    }

    // ==========================================
    // Track Management
    // ==========================================

    async addTrack(guildId, query, requester) {
        try {
            console.log(`[MUSIC-MANAGER] Adding track: ${query} (${guildId})`);

            const queue = this.queues.get(guildId);
            if (!queue) {
                throw new Error('Queue not found. Please join a voice channel first.');
            }

            // Track bilgilerini çıkar
            const trackInfo = await this.extractor.extractTrackInfo(query);
            if (!trackInfo) {
                throw new Error('Failed to extract track information');
            }

            // Track'i kuyruğa ekle
            const track = {
                ...trackInfo,
                requester: requester,
                addedAt: Date.now(),
                guildId: guildId
            };

            const added = queue.addTrack(track);
            if (!added) {
                throw new Error('Failed to add track to queue');
            }

            // Eğer hiçbir şey çalmıyorsa, çalmaya başla
            if (!queue.isPlaying()) {
                await this.playNext(guildId);
            }

            return track;

        } catch (error) {
            console.error(`[MUSIC-MANAGER] Failed to add track:`, error);
            throw error;
        }
    }

    async playNext(guildId) {
        try {
            console.log(`[MUSIC-MANAGER] Playing next track (${guildId})`);

            const queue = this.queues.get(guildId);
            const player = this.players.get(guildId);
            const connection = this.connections.get(guildId);

            if (!queue || !player || !connection) {
                throw new Error('Missing components for playback');
            }

            // Sıradaki track'i al
            const track = queue.getNextTrack();
            if (!track) {
                console.log(`[MUSIC-MANAGER] No tracks in queue`);
                return false;
            }

            console.log(`[MUSIC-MANAGER] Playing: ${track.title}`);

            // Stream çıkar
            const stream = await this.extractor.createStream(track.url);
            if (!stream) {
                throw new Error('Failed to create audio stream');
            }

            // Audio resource oluştur
            const resource = createAudioResource(stream, {
                inputType: 'arbitrary',
                inlineVolume: true
            });

            // Ses işleme uygula
            this.processor.processAudio(resource, track);

            // Çalmaya başla
            player.play(resource);

            // Track'i aktif olarak işaretle
            queue.setCurrentTrack(track);

            // Event gönder
            this.eventHandler.emit('trackStart', { guildId, track });

            return true;

        } catch (error) {
            console.error(`[MUSIC-MANAGER] Failed to play next track:`, error);
            
            // Hata durumunda sıradaki track'e geç
            const queue = this.queues.get(guildId);
            if (queue) {
                queue.skipTrack();
                setTimeout(() => this.playNext(guildId), 1000);
            }
            
            return false;
        }
    }

    // ==========================================
    // Player Controls
    // ==========================================

    pause(guildId) {
        const player = this.players.get(guildId);
        if (player && player.state.status === AudioPlayerStatus.Playing) {
            player.pause();
            return true;
        }
        return false;
    }

    resume(guildId) {
        const player = this.players.get(guildId);
        if (player && player.state.status === AudioPlayerStatus.Paused) {
            player.unpause();
            return true;
        }
        return false;
    }

    stop(guildId) {
        const player = this.players.get(guildId);
        if (player) {
            player.stop();
            return true;
        }
        return false;
    }

    skip(guildId) {
        const queue = this.queues.get(guildId);
        if (queue) {
            queue.skipTrack();
            this.playNext(guildId);
            return true;
        }
        return false;
    }

    setVolume(guildId, volume) {
        const player = this.players.get(guildId);
        if (player) {
            player.state.resource?.volume?.setVolume(volume / 100);
            return true;
        }
        return false;
    }

    // ==========================================
    // Queue Management
    // ==========================================

    getQueue(guildId) {
        return this.queues.get(guildId);
    }

    clearQueue(guildId) {
        const queue = this.queues.get(guildId);
        if (queue) {
            queue.clear();
            return true;
        }
        return false;
    }

    shuffleQueue(guildId) {
        const queue = this.queues.get(guildId);
        if (queue) {
            queue.shuffle();
            return true;
        }
        return false;
    }

    removeTrack(guildId, index) {
        const queue = this.queues.get(guildId);
        if (queue) {
            return queue.removeTrack(index);
        }
        return false;
    }

    // ==========================================
    // Status & Information
    // ==========================================

    isConnected(guildId) {
        return this.connections.has(guildId);
    }

    isPlaying(guildId) {
        const player = this.players.get(guildId);
        return player && player.state.status === AudioPlayerStatus.Playing;
    }

    isPaused(guildId) {
        const player = this.players.get(guildId);
        return player && player.state.status === AudioPlayerStatus.Paused;
    }

    getCurrentTrack(guildId) {
        const queue = this.queues.get(guildId);
        return queue ? queue.getCurrentTrack() : null;
    }

    getQueueSize(guildId) {
        const queue = this.queues.get(guildId);
        return queue ? queue.getSize() : 0;
    }

    // ==========================================
    // Cleanup & Maintenance
    // ==========================================

    cleanupGuild(guildId) {
        console.log(`[MUSIC-MANAGER] Cleaning up guild: ${guildId}`);

        // Player'ı durdur
        const player = this.players.get(guildId);
        if (player) {
            player.stop();
        }

        // Bağlantıları temizle
        this.connections.delete(guildId);
        this.players.delete(guildId);
        this.queues.delete(guildId);
    }

    cleanup() {
        console.log(`[MUSIC-MANAGER] Running periodic cleanup`);

        for (const [guildId, connection] of this.connections) {
            if (connection.state.status === VoiceConnectionStatus.Disconnected) {
                this.cleanupGuild(guildId);
            }
        }
    }

    // ==========================================
    // Statistics
    // ==========================================

    getStatistics() {
        return {
            totalConnections: this.connections.size,
            totalPlayers: this.players.size,
            totalQueues: this.queues.size,
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage()
        };
    }
}

module.exports = MusicManager;
