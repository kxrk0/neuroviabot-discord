// ==========================================
// 🤖 NeuroViaBot - Music Player System
// ==========================================

const { Player } = require('discord-player');
const { YoutubeiExtractor, YouTubeExtractor } = require('@discord-player/extractor');
const { logger } = require('../utils/logger');
const config = require('../config.js');

// Play-dl import (alternatif YouTube stream için)
let playdl = null;
try {
    playdl = require('play-dl');
    logger.success('Play-dl yüklendi - alternatif YouTube stream aktif');
} catch (error) {
    logger.warn('Play-dl yüklenemedi - sadece ytdl-core kullanılacak');
}

class MusicPlayer {
    constructor(client) {
        this.client = client;
        this.player = null;
        this.initialized = false;
        this.eventListenersSetup = false;
    }

    async initialize() {
        try {
            // Discord Player instance oluştur
            this.player = new Player(this.client, {
                ytdlOptions: {
                    quality: 'highestaudio',
                    highWaterMark: 1 << 25,
                    filter: 'audioonly',
                    opusEncoded: false,
                    encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200'],
                    // YouTube signature extraction için ek ayarlar
                    requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                        }
                    }
                },
                skipFFmpeg: false,
                leaveOnEmpty: true,
                leaveOnEmptyDelay: 300000, // 5 minutes
                leaveOnEnd: true,
                leaveOnEndDelay: 300000, // 5 minutes
                autoSelfDeaf: true,
                initialVolume: config.defaultVolume || 50,
                bufferingTimeout: 3000
            });

            // Play-dl stream handler ekle (eğer mevcutsa)
            if (playdl) {
                // Discord Player v6'da farklı event adları olabilir
                const streamEvents = ['beforeCreateStream', 'onBeforeCreateStream', 'createStream'];
                
                for (const eventName of streamEvents) {
                    try {
                        this.player.events.on(eventName, async (track, source, _queue) => {
                            if (source === 'youtube') {
                                try {
                                    console.log(`[DEBUG-PLAYER] Using play-dl for YouTube stream: ${track.title}`);
                                    const stream = await playdl.stream(track.url, { 
                                        discordPlayerCompatibility: true 
                                    });
                                    return stream.stream;
                                } catch (error) {
                                    console.error(`[DEBUG-PLAYER] Play-dl stream error:`, error);
                                    // Fallback to default extractor
                                    return null;
                                }
                            }
                        });
                        console.log(`[DEBUG-PLAYER] Stream handler registered for event: ${eventName}`);
                    } catch (err) {
                        console.log(`[DEBUG-PLAYER] Event ${eventName} not available: ${err.message}`);
                    }
                }
            }

            // Event listener'ları hemen kur (Player oluşturulur oluşturulmaz)
            if (!this.eventListenersSetup) {
                this.setupEventListeners();
                this.eventListenersSetup = true;
            }

            // Extractor'ları yükle
            const extractorsLoaded = await this.loadExtractors();
            if (!extractorsLoaded) {
                logger.error('Extractor yüklenemedi - Müzik sistemi devre dışı');
                return false;
            }
            
            this.initialized = true;
            logger.success('Discord Music Player başlatıldı!');
            
            return true;
        } catch (error) {
            logger.error('Music Player başlatma hatası', error);
            return false;
        }
    }

    async loadExtractors() {
        try {
            // Discord Player v6'da default extractor'ları yükle
            try {
                await this.player.extractors.loadDefault();
                logger.success('Default extractors yüklendi');
            } catch (err) {
                logger.warn(`Default extractors yüklenemedi: ${err.message}`);
            }

            // Multiple extractor attempts
            const extractorConfigs = [
                { extractor: YouTubeExtractor, name: 'YouTubeExtractor', options: {} },
                { extractor: YoutubeiExtractor, name: 'YoutubeiExtractor', options: { useClient: 'IOS' } },
                { extractor: YoutubeiExtractor, name: 'YoutubeiExtractor', options: { useClient: 'ANDROID' } },
                { extractor: YoutubeiExtractor, name: 'YoutubeiExtractor', options: { useClient: 'WEB' } },
                { extractor: YoutubeiExtractor, name: 'YoutubeiExtractor', options: {} }
            ];

            let extractorLoaded = false;
            for (const config of extractorConfigs) {
                try {
                    if (Object.keys(config.options).length > 0) {
                        await this.player.extractors.register(config.extractor, {
                            streamOptions: config.options
                        });
                    } else {
                        await this.player.extractors.register(config.extractor);
                    }
                    logger.success(`${config.name} yüklendi`);
                    extractorLoaded = true;
                    break;
                } catch (err) {
                    logger.warn(`${config.name} yüklenemedi: ${err.message}`);
                }
            }

            if (!extractorLoaded) {
                logger.error('Hiçbir extractor yüklenemedi! Müzik sistemi devre dışı.');
                return false;
            }

            // Spotify desteği (eğer API anahtarları varsa)
            if (config.spotify.enabled) {
                logger.success('Spotify integration aktif');
            } else {
                logger.warn('Spotify API anahtarları bulunamadı - sadece YouTube aktif');
            }

            logger.success('Music extractors yükleme tamamlandı');
            return true;
        } catch (error) {
            logger.error('Extractor yükleme hatası', error);
            return false;
        }
    }

    setupEventListeners() {
        console.log(`[DEBUG-PLAYER] Setting up event listeners...`);
        
        // Discord Player v6'da event listener'lar player.events.on ile kurulur
        // Player ready
        this.player.events.on('playerStart', (queue, track) => {
            console.log(`[DEBUG-PLAYER] Track started: ${track.title} in ${queue.guild.name}`);
            logger.musicEvent('Track Started', {
                title: track.title,
                author: track.author,
                duration: track.duration,
                guild: queue.guild.name
            });

            // Now playing mesajı gönder
            this.sendNowPlayingMessage(queue, track);
        });

        // Player ready event
        this.player.events.on('playerReady', (queue) => {
            console.log(`[DEBUG-PLAYER] Player ready in ${queue.guild.name}`);
            logger.musicEvent('Player Ready', {
                guild: queue.guild.name
            });
        });

        // Track ended
        this.player.events.on('playerFinish', (queue, track) => {
            console.log(`[DEBUG-PLAYER] Track finished: ${track.title} in ${queue.guild.name}`);
            logger.musicEvent('Track Finished', {
                title: track.title,
                guild: queue.guild.name
            });
        });

        // Queue ended
        this.player.events.on('emptyQueue', (queue) => {
            console.log(`[DEBUG-PLAYER] Queue empty in ${queue.guild.name}`);
            logger.musicEvent('Queue Empty', {
                guild: queue.guild.name
            });

            // Queue boş olduğunda mesaj gönder
            if (queue.metadata) {
                queue.metadata.send('🎵 **Queue bitti!** Tüm şarkılar çalındı.');
            }
        });

        // Connection error
        this.player.events.on('connectionError', (queue, error) => {
            console.error(`[DEBUG-PLAYER] Connection error in ${queue.guild.name}:`, error);
            logger.playerError(error, {
                guild: queue.guild.name,
                event: 'connectionError'
            });
        });

        // Track error - Discord Player v6'da hem 'error' hem 'playerError' event'leri var
        this.player.events.on('error', (queue, error, track) => {
            console.error(`[DEBUG-PLAYER] Player error in ${queue.guild.name} for track ${track?.title}:`, error);
            console.error(`[DEBUG-PLAYER] Error details:`, {
                message: error.message,
                code: error.code,
                stack: error.stack
            });
            logger.playerError(error, {
                guild: queue.guild.name,
                track: track?.title || 'Unknown',
                event: 'error'
            });

            // Hata mesajı gönder
            if (queue.metadata && track) {
                queue.metadata.send(`❌ **Şarkı çalınamadı:** ${track.title}\n\`\`\`${error.message}\`\`\``);
            }
        });

        // PlayerError event listener (Discord Player v6'da bu da var)
        this.player.events.on('playerError', (queue, error, track) => {
            console.error(`[DEBUG-PLAYER] PlayerError in ${queue.guild.name} for track ${track?.title}:`, error);
            console.error(`[DEBUG-PLAYER] PlayerError details:`, {
                message: error.message,
                code: error.code,
                stack: error.stack
            });
            logger.playerError(error, {
                guild: queue.guild.name,
                track: track?.title || 'Unknown',
                event: 'playerError'
            });

            // Hata mesajı gönder
            if (queue.metadata && track) {
                queue.metadata.send(`❌ **Şarkı çalınamadı:** ${track.title}\n\`\`\`${error.message}\`\`\``);
            }
        });

        // Bot disconnected
        this.player.events.on('disconnect', (queue) => {
            console.log(`[DEBUG-PLAYER] Bot disconnected from ${queue.guild.name}`);
            logger.musicEvent('Bot Disconnected', {
                guild: queue.guild.name
            });

            if (queue.metadata) {
                queue.metadata.send('🔌 **Sesli kanaldan ayrıldım!** Müzik durduruldu.');
            }
        });

        // No results
        this.player.events.on('noResults', (queue, query) => {
            logger.warn(`Arama sonucu bulunamadı: ${query}`, {
                guild: queue.guild.name
            });
        });

        // General error event listener (Discord Player v6'da bu event yok, sadece yukarıdaki error event'i var)
        // Bu yüzden bu listener'ı kaldırıyoruz

        console.log(`[DEBUG-PLAYER] Event listeners setup completed`);

        // Debug events (sadece development'ta)
        if (process.env.NODE_ENV === 'development') {
            this.player.events.on('debug', (queue, message) => {
                logger.debug(`Player Debug: ${message}`, {
                    guild: queue?.guild?.name || 'Unknown'
                });
            });
        }
    }

    async sendNowPlayingMessage(queue, track) {
        try {
            if (!queue.metadata) return;

            const { EmbedBuilder } = require('discord.js');
            
            const embed = new EmbedBuilder()
                .setColor(config.embedColor)
                .setTitle('🎵 Şimdi Çalıyor')
                .setDescription(`**[${track.title}](${track.url})**`)
                .addFields(
                    {
                        name: '👤 Sanatçı',
                        value: track.author,
                        inline: true
                    },
                    {
                        name: '⏱️ Süre',
                        value: track.duration,
                        inline: true
                    },
                    {
                        name: '🔊 Ses Seviyesi',
                        value: `${queue.node.volume}%`,
                        inline: true
                    },
                    {
                        name: '📋 Kuyruk',
                        value: `${queue.tracks.size} şarkı`,
                        inline: true
                    },
                    {
                        name: '🔁 Mod',
                        value: queue.repeatMode === 0 ? 'Kapalı' : 
                               queue.repeatMode === 1 ? 'Şarkı' : 
                               queue.repeatMode === 2 ? 'Kuyruk' : 'Otomatik',
                        inline: true
                    },
                    {
                        name: '🎧 İstek Sahibi',
                        value: `${track.requestedBy}`,
                        inline: true
                    }
                )
                .setThumbnail(track.thumbnail)
                .setTimestamp();

            await queue.metadata.send({ embeds: [embed] });
        } catch (error) {
            logger.error('Now playing mesajı gönderme hatası', error);
        }
    }

    // Helper functions
    getPlayer() {
        return this.player;
    }

    isInitialized() {
        return this.initialized;
    }

    async getGuildQueue(guild) {
        if (!this.initialized) return null;
        return this.player.nodes.get(guild.id) || null;
    }

    async createGuildQueue(guild, voiceChannel, textChannel) {
        if (!this.initialized) return null;
        
        return this.player.nodes.create(guild, {
            metadata: textChannel,
            volume: config.defaultVolume,
            leaveOnEmpty: true,
            leaveOnEmptyDelay: 300000,
            leaveOnEnd: true,
            leaveOnEndDelay: 300000,
            selfDeaf: true,
            voiceChannel: voiceChannel
        });
    }

    // Statistics
    getStatistics() {
        if (!this.initialized) return null;

        const queues = this.player.nodes.cache;
        return {
            totalQueues: queues.size,
            totalTracks: queues.reduce((acc, queue) => acc + queue.tracks.size, 0),
            activeConnections: queues.filter(queue => queue.connection).length,
            uptime: process.uptime()
        };
    }
}

module.exports = MusicPlayer;
