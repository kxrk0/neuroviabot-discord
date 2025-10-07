const { Player } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const { logger } = require('../utils/logger');

class CustomMusicPlayer {
    constructor(client) {
        this.client = client;
        this.player = new Player(client, {
            ytdlOptions: {
                quality: 'highestaudio',
                highWaterMark: 1 << 25,
                filter: 'audioonly',
                opusEncoded: false,
                requestOptions: {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    }
                }
            }
        });
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Player events
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

            queue.metadata.channel.send({ embeds: [errorEmbed] }).catch(console.error);
        });

        this.player.events.on('queueEnd', (queue) => {
            console.log(`[CUSTOM-PLAYER] Queue ended for ${queue.guild.name}`);
        });

        this.player.events.on('connectionError', (queue, error) => {
            console.error(`[CUSTOM-PLAYER] Connection error:`, error);
        });

        console.log('[CUSTOM-PLAYER] Event listeners setup completed');
    }

    async joinChannel(guildId, voiceChannel) {
        try {
            const queue = this.player.nodes.create(voiceChannel.guild, {
                metadata: {
                    channel: voiceChannel,
                    guild: voiceChannel.guild
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
            const queue = this.player.nodes.get(guildId);
            if (!queue) {
                console.log(`[CUSTOM-PLAYER] No queue found for guild ${guildId}`);
                return false;
            }

            await queue.addTrack(track);
            console.log(`[CUSTOM-PLAYER] Added track to queue: ${track.title}`);
            
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
        const queue = this.player.nodes.get(guildId);
        if (queue && !queue.isPlaying()) {
            await queue.node.play();
        }
    }

    async stop(guildId) {
        const queue = this.player.nodes.get(guildId);
        if (queue) {
            queue.delete();
            console.log(`[CUSTOM-PLAYER] Stopped playback and cleaned up for ${guildId}`);
        }
    }

    getQueue(guildId) {
        const queue = this.player.nodes.get(guildId);
        return queue ? queue.tracks.toArray() : [];
    }

    getCurrentTrack(guildId) {
        const queue = this.player.nodes.get(guildId);
        return queue?.currentTrack || null;
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
        const queue = this.player.nodes.get(guildId);
        if (queue && queue.isPlaying()) {
            queue.node.pause();
            console.log(`[CUSTOM-PLAYER] Paused playback in ${guildId}`);
            return true;
        }
        return false;
    }

    async resume(guildId) {
        const queue = this.player.nodes.get(guildId);
        if (queue && queue.node.isPaused()) {
            queue.node.resume();
            console.log(`[CUSTOM-PLAYER] Resumed playback in ${guildId}`);
            return true;
        }
        return false;
    }

    cleanup(guildId) {
        const queue = this.player.nodes.get(guildId);
        if (queue) {
            queue.delete();
        }
        console.log(`[CUSTOM-PLAYER] Cleaned up ${guildId}`);
    }

    async leave(guildId) {
        const queue = this.player.nodes.get(guildId);
        if (queue) {
            queue.delete();
        }
        console.log(`[CUSTOM-PLAYER] Left ${guildId}`);
    }
}

module.exports = CustomMusicPlayer;