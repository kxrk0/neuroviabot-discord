const { Player } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const { logger } = require('../utils/logger');
const { YoutubeiExtractor } = require('discord-player-youtubei');

class CustomMusicPlayer {
    constructor(client) {
        this.client = client;
        
        // Discord Player instance oluştur
        this.player = new Player(client, {
            ytdlOptions: {
                quality: 'highestaudio',
                highWaterMark: 1 << 25,
                requestOptions: {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    }
                }
            },
            ffmpegPath: require('ffmpeg-static'),
            ffprobePath: require('ffprobe-static').path
        });
        
        // Extractors yükle
        this.player.extractors.register(YoutubeiExtractor, {});
        this.player.extractors.loadDefault();
        
        // Event listeners kur
        this.setupEventListeners();
        
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

            queue.metadata.channel.send({ embeds: [nowPlayingEmbed] }).catch(console.error);
        });

        this.player.events.on('playerFinish', (queue, track) => {
            console.log(`[CUSTOM-PLAYER] Finished playing: ${track.title}`);
        });

        this.player.events.on('playerError', (queue, error, track) => {
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

            queue.metadata.channel.send({ embeds: [errorEmbed] }).catch(console.error);
        });

        this.player.events.on('queueEnd', (queue) => {
            console.log(`[CUSTOM-PLAYER] Queue ended for ${queue.guild.id}`);
        });

        this.player.events.on('connectionError', (queue, error) => {
            console.error(`[CUSTOM-PLAYER] Connection error:`, error);
        });
    }

    async joinChannel(guildId, voiceChannel) {
        try {
            const queue = this.player.nodes.create(guildId, {
                metadata: {
                    channel: voiceChannel,
                    client: this.client,
                    requestedBy: null
                }
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

            const queue = this.player.nodes.get(guildId);
            if (!queue) {
                console.error(`[CUSTOM-PLAYER] No queue found for guild ${guildId}`);
                return false;
            }

            // Discord Player ile track ekle
            const searchResult = await this.player.search(track.url, {
                requestedBy: metadata.user || null,
                searchEngine: 'youtube'
            });

            if (!searchResult.hasTracks()) {
                console.error(`[CUSTOM-PLAYER] No tracks found for: ${track.url}`);
                return false;
            }

            const foundTrack = searchResult.tracks[0];
            queue.addTrack(foundTrack);

            console.log(`[CUSTOM-PLAYER] Added track to queue: ${foundTrack.title} (URL: ${foundTrack.url})`);

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
        // Discord Player otomatik olarak sıradaki şarkıyı çalar
        const queue = this.player.nodes.get(guildId);
        if (queue && !queue.isPlaying()) {
            await queue.node.play();
        }
        return true;
    }

    async stop(guildId) {
        try {
            const queue = this.player.nodes.get(guildId);
            if (queue) {
                queue.delete();
                console.log(`[CUSTOM-PLAYER] Stopped playback for ${guildId}`);
                return true;
            }
            return false;
        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Failed to stop playback:`, error);
            return false;
        }
    }

    getQueue(guildId) {
        const queue = this.player.nodes.get(guildId);
        return queue ? queue.tracks.toArray() : [];
    }

    getCurrentTrack(guildId) {
        const queue = this.player.nodes.get(guildId);
        return queue ? queue.currentTrack : null;
    }

    isPlaying(guildId) {
        const queue = this.player.nodes.get(guildId);
        return queue ? queue.isPlaying() : false;
    }

    isPaused(guildId) {
        const queue = this.player.nodes.get(guildId);
        return queue ? queue.node.isPaused() : false;
    }

    async pause(guildId) {
        try {
            const queue = this.player.nodes.get(guildId);
            if (queue) {
                queue.node.pause();
                console.log(`[CUSTOM-PLAYER] Paused playback in ${guildId}`);
                return true;
            }
            return false;
        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Failed to pause:`, error);
            return false;
        }
    }

    async resume(guildId) {
        try {
            const queue = this.player.nodes.get(guildId);
            if (queue) {
                queue.node.resume();
                console.log(`[CUSTOM-PLAYER] Resumed playback in ${guildId}`);
                return true;
            }
            return false;
        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Failed to resume:`, error);
            return false;
        }
    }

    cleanup(guildId) {
        try {
            const queue = this.player.nodes.get(guildId);
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
            const queue = this.player.nodes.get(guildId);
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