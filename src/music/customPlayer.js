const { EmbedBuilder } = require('discord.js');
const { logger } = require('../utils/logger');
const { Player } = require('discord-player');

class CustomMusicPlayer {
    constructor(client) {
        this.client = client;
        this.player = new Player(client, {
            ytdlOptions: {
                quality: 'highestaudio',
                highWaterMark: 1 << 25,
                requestOptions: {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    }
                }
            }
        });
        
        this.setupEventListeners();
        this.initializeExtractors();
        console.log('[CUSTOM-PLAYER] Custom Music Player initialized with discord-player');
    }
    
    setupEventListeners() {
        this.player.events.on('playerStart', (queue, track) => {
            console.log(`[CUSTOM-PLAYER] Started playing: ${track.title}`);
            
            const nowPlayingEmbed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('🎵 Şimdi Çalıyor')
                .setDescription(`**${track.title}**`)
                .addFields(
                    { name: '👤 Sanatçı', value: track.author || 'Bilinmiyor', inline: true },
                    { name: '⏱️ Süre', value: track.duration || 'Bilinmiyor', inline: true },
                    { name: '🔗 Kaynak', value: 'YouTube', inline: true }
                )
                .setThumbnail(track.thumbnail || null)
                .setTimestamp();

            queue.metadata.send({ embeds: [nowPlayingEmbed] }).catch(console.error);
        });

        this.player.events.on('playerFinish', (queue, track) => {
            console.log(`[CUSTOM-PLAYER] Finished playing: ${track.title}`);
        });

        this.player.events.on('playerError', (queue, error) => {
            console.error(`[CUSTOM-PLAYER] Player error:`, error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Çalma Hatası')
                .setDescription('Şarkı çalınamadı!')
                .addFields({
                    name: '🔧 Hata Detayı',
                    value: `\`\`\`${error.message}\`\`\``,
                    inline: false
                })
                .setTimestamp();

            queue.metadata.send({ embeds: [errorEmbed] }).catch(console.error);
        });

        this.player.events.on('queueEnd', (queue) => {
            console.log(`[CUSTOM-PLAYER] Queue ended for guild: ${queue.guild.id}`);
        });

        this.player.events.on('connectionError', (queue, error) => {
            console.error(`[CUSTOM-PLAYER] Connection error:`, error);
        });
    }
    
    async initializeExtractors() {
        try {
            console.log('[CUSTOM-PLAYER] Loading extractors...');
            
            // Default extractorları yükle
            await this.player.extractors.loadDefault();
            console.log('[CUSTOM-PLAYER] Default extractors loaded successfully');
            
            // Manuel extractor yükleme
            const { YoutubeExtractor } = require('@discord-player/extractor');
            this.player.extractors.register(YoutubeExtractor, {});
            console.log('[CUSTOM-PLAYER] YouTube extractor registered successfully');
            
        } catch (error) {
            console.error('[CUSTOM-PLAYER] Failed to load extractors:', error);
        }
    }
    
    formatDuration(seconds) {
        if (!seconds || isNaN(seconds)) return 'Bilinmiyor';
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
        }
    }
    
    async joinChannel(guildId, voiceChannel) {
        try {
            const queue = this.player.nodes.create(voiceChannel.guild, {
                metadata: voiceChannel,
                selfDeaf: true,
                volume: 80,
                leaveOnEmpty: true,
                leaveOnEmptyCooldown: 300000,
                leaveOnEnd: true,
                leaveOnEndCooldown: 300000,
            });

            await queue.connect(voiceChannel);
            console.log(`[CUSTOM-PLAYER] Connected to ${voiceChannel.name}`);
            return true;
        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Failed to join voice channel:`, error);
            return false;
        }
    }

    async addTrack(guildId, track, metadata) {
        try {
            console.log(`[CUSTOM-PLAYER] Adding track to queue:`, {
                title: track.title,
                url: track.url,
                author: track.author,
                duration: track.duration
            });

            // Track URL'yi kontrol et
            if (!track.url || typeof track.url !== 'string') {
                console.error(`[CUSTOM-PLAYER] Invalid track URL in addTrack: ${track.url}`);
                return false;
            }

            const guild = this.client.guilds.cache.get(guildId);
            if (!guild) {
                console.error(`[CUSTOM-PLAYER] Guild not found: ${guildId}`);
                return false;
            }

            const queue = this.player.nodes.get(guild);
            if (!queue) {
                console.error(`[CUSTOM-PLAYER] Queue not found for guild: ${guildId}`);
                return false;
            }

            // Track'i queue'ya ekle
            await queue.addTrack(track);
            console.log(`[CUSTOM-PLAYER] Added track to queue: ${track.title} (URL: ${track.url})`);

            // Eğer şu anda çalan şarkı yoksa, çalmaya başla
            if (!queue.isPlaying()) {
                await queue.node.play();
            }

            return true;
        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Failed to add track:`, error);
            return false;
        }
    }

    async playNext(guildId) {
        // Bu metod artık discord-player tarafından otomatik olarak yönetiliyor
        console.log(`[CUSTOM-PLAYER] playNext called for guild: ${guildId} - handled by discord-player`);
        return true;
    }

    async stop(guildId) {
        try {
            const guild = this.client.guilds.cache.get(guildId);
            if (!guild) {
                console.error(`[CUSTOM-PLAYER] Guild not found: ${guildId}`);
                return false;
            }

            const queue = this.player.nodes.get(guild);
            if (!queue) {
                console.log(`[CUSTOM-PLAYER] No queue found for guild: ${guildId}`);
                return false;
            }

            queue.delete();
            console.log(`[CUSTOM-PLAYER] Stopped playback for ${guildId}`);
            return true;
        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Failed to stop playback:`, error);
            return false;
        }
    }

    getQueue(guildId) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return [];
        
        const queue = this.player.nodes.get(guild);
        if (!queue) return [];
        
        return queue.tracks.toArray();
    }

    getCurrentTrack(guildId) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return null;
        
        const queue = this.player.nodes.get(guild);
        if (!queue) return null;
        
        return queue.currentTrack;
    }

    isPlaying(guildId) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return false;
        
        const queue = this.player.nodes.get(guild);
        if (!queue) return false;
        
        return queue.isPlaying();
    }

    isPaused(guildId) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return false;
        
        const queue = this.player.nodes.get(guild);
        if (!queue) return false;
        
        return queue.node.isPaused();
    }

    async pause(guildId) {
        try {
            const guild = this.client.guilds.cache.get(guildId);
            if (!guild) return false;

            const queue = this.player.nodes.get(guild);
            if (!queue) return false;

            queue.node.pause();
            console.log(`[CUSTOM-PLAYER] Paused playback in ${guildId}`);
            return true;
        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Failed to pause:`, error);
            return false;
        }
    }

    async resume(guildId) {
        try {
            const guild = this.client.guilds.cache.get(guildId);
            if (!guild) return false;

            const queue = this.player.nodes.get(guild);
            if (!queue) return false;

            queue.node.resume();
            console.log(`[CUSTOM-PLAYER] Resumed playback in ${guildId}`);
            return true;
        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Failed to resume:`, error);
            return false;
        }
    }

    cleanup(guildId) {
        try {
            const guild = this.client.guilds.cache.get(guildId);
            if (!guild) return;

            const queue = this.player.nodes.get(guild);
            if (queue) {
                queue.delete();
            }
            
            console.log(`[CUSTOM-PLAYER] Cleaned up ${guildId}`);
        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Failed to cleanup:`, error);
        }
    }

    async leave(guildId) {
        try {
            const guild = this.client.guilds.cache.get(guildId);
            if (!guild) return false;

            const queue = this.player.nodes.get(guild);
            if (queue) {
                queue.delete();
            }
            
            console.log(`[CUSTOM-PLAYER] Left ${guildId}`);
            return true;
        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Failed to leave:`, error);
            return false;
        }
    }
}

module.exports = CustomMusicPlayer;