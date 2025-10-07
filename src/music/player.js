// ==========================================
// 🤖 NeuroViaBot - Music Player System
// ==========================================

const { Player } = require('discord-player');
const { YoutubeiExtractor, YouTubeExtractor } = require('@discord-player/extractor');
const { logger } = require('../utils/logger');
const config = require('../config.js');

class MusicPlayer {
    constructor(client) {
        this.client = client;
        this.player = null;
        this.initialized = false;
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
                    encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200']
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

            // Extractor'ları yükle
            const extractorsLoaded = await this.loadExtractors();
            if (!extractorsLoaded) {
                logger.error('Extractor yüklenemedi - Müzik sistemi devre dışı');
                return false;
            }
            
            // Event listener'ları kur
            this.setupEventListeners();
            
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
        // Player ready
        this.player.on('playerStart', (queue, track) => {
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

        // Track ended
        this.player.on('playerFinish', (queue, track) => {
            console.log(`[DEBUG-PLAYER] Track finished: ${track.title} in ${queue.guild.name}`);
            logger.musicEvent('Track Finished', {
                title: track.title,
                guild: queue.guild.name
            });
        });

        // Queue ended
        this.player.on('emptyQueue', (queue) => {
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
        this.player.on('connectionError', (queue, error) => {
            console.error(`[DEBUG-PLAYER] Connection error in ${queue.guild.name}:`, error);
            logger.playerError(error, {
                guild: queue.guild.name,
                event: 'connectionError'
            });
        });

        // Track error
        this.player.on('playerError', (queue, error, track) => {
            console.error(`[DEBUG-PLAYER] Player error in ${queue.guild.name} for track ${track?.title}:`, error);
            console.error(`[DEBUG-PLAYER] Error details:`, {
                message: error.message,
                code: error.code,
                stack: error.stack
            });
            logger.playerError(error, {
                guild: queue.guild.name,
                track: track.title,
                event: 'playerError'
            });

            // Hata mesajı gönder
            if (queue.metadata) {
                queue.metadata.send(`❌ **Şarkı çalınamadı:** ${track.title}\n\`\`\`${error.message}\`\`\``);
            }
        });

        // Bot disconnected
        this.player.on('disconnect', (queue) => {
            console.log(`[DEBUG-PLAYER] Bot disconnected from ${queue.guild.name}`);
            logger.musicEvent('Bot Disconnected', {
                guild: queue.guild.name
            });

            if (queue.metadata) {
                queue.metadata.send('🔌 **Sesli kanaldan ayrıldım!** Müzik durduruldu.');
            }
        });

        // No results
        this.player.on('noResults', (queue, query) => {
            logger.warn(`Arama sonucu bulunamadı: ${query}`, {
                guild: queue.guild.name
            });
        });

        // Debug events (sadece development'ta)
        if (process.env.NODE_ENV === 'development') {
            this.player.on('debug', (queue, message) => {
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
