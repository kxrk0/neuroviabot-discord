const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');
const { logger } = require('../utils/logger');
const playdl = require('play-dl');

class CustomMusicPlayer {
    constructor(client) {
        this.client = client;
        this.connections = new Map();
        this.players = new Map();
        this.queues = new Map();
        
        console.log('[CUSTOM-PLAYER] Custom Music Player initialized with play-dl');
    }

    async joinChannel(guildId, voiceChannel) {
        try {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });

            this.connections.set(guildId, connection);
            console.log(`[CUSTOM-PLAYER] Connected to ${voiceChannel.name}`);
            return true;
        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Failed to join voice channel:`, error);
            return false;
        }
    }

    async addTrack(guildId, track, metadata) {
        try {
            let queue = this.queues.get(guildId);
            if (!queue) {
                queue = [];
                this.queues.set(guildId, queue);
            }

            queue.push({
                ...track,
                metadata: metadata
            });

            console.log(`[CUSTOM-PLAYER] Added track to queue: ${track.title}`);

            // Eğer şu anda çalan şarkı yoksa, çalmaya başla
            if (!this.players.has(guildId)) {
                await this.playNext(guildId);
            }

            return true;
        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Failed to add track:`, error);
            return false;
        }
    }

    async playNext(guildId) {
        try {
            const queue = this.queues.get(guildId);
            if (!queue || queue.length === 0) {
                console.log(`[CUSTOM-PLAYER] No tracks in queue for ${guildId}`);
                return false;
            }

            const track = queue.shift();
            console.log(`[CUSTOM-PLAYER] Playing: ${track.title}`);

            // play-dl ile stream oluştur
            const stream = await playdl.stream(track.url);
            const resource = createAudioResource(stream.stream, {
                inputType: stream.type
            });

            // Audio player oluştur
            const player = createAudioPlayer();
            this.players.set(guildId, player);

            // Connection'a player'ı bağla
            const connection = this.connections.get(guildId);
            if (connection) {
                connection.subscribe(player);
            }

            // Player event listeners
            player.on(AudioPlayerStatus.Playing, () => {
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

                track.metadata.channel.send({ embeds: [nowPlayingEmbed] }).catch(console.error);
            });

            player.on(AudioPlayerStatus.Idle, () => {
                console.log(`[CUSTOM-PLAYER] Finished playing: ${track.title}`);
                this.players.delete(guildId);
                
                // Sıradaki şarkıyı çal
                setTimeout(() => {
                    this.playNext(guildId);
                }, 1000);
            });

            player.on('error', (error) => {
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

                track.metadata.channel.send({ embeds: [errorEmbed] }).catch(console.error);
                
                this.players.delete(guildId);
                this.playNext(guildId);
            });

            // Şarkıyı çalmaya başla
            player.play(resource);
            return true;

        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Failed to play track:`, error);
            return false;
        }
    }

    async stop(guildId) {
        try {
            const player = this.players.get(guildId);
            if (player) {
                player.stop();
                this.players.delete(guildId);
            }
            
            const queue = this.queues.get(guildId);
            if (queue) {
                queue.length = 0; // Queue'yu temizle
            }
            
            console.log(`[CUSTOM-PLAYER] Stopped playback for ${guildId}`);
            return true;
        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Failed to stop playback:`, error);
            return false;
        }
    }

    getQueue(guildId) {
        const queue = this.queues.get(guildId);
        return queue || [];
    }

    getCurrentTrack(guildId) {
        // Basit implementasyon - şu anda çalan track'i döndür
        return null;
    }

    isPlaying(guildId) {
        return this.players.has(guildId);
    }

    isPaused(guildId) {
        const player = this.players.get(guildId);
        return player ? player.state.status === AudioPlayerStatus.Paused : false;
    }

    async pause(guildId) {
        try {
            const player = this.players.get(guildId);
            if (player) {
                player.pause();
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
            const player = this.players.get(guildId);
            if (player) {
                player.unpause();
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
            const player = this.players.get(guildId);
            if (player) {
                player.stop();
                this.players.delete(guildId);
            }
            
            const connection = this.connections.get(guildId);
            if (connection) {
                connection.destroy();
                this.connections.delete(guildId);
            }
            
            const queue = this.queues.get(guildId);
            if (queue) {
                queue.length = 0;
            }
            
            console.log(`[CUSTOM-PLAYER] Cleaned up ${guildId}`);
        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Failed to cleanup:`, error);
        }
    }

    async leave(guildId) {
        try {
            await this.stop(guildId);
            
            const connection = this.connections.get(guildId);
            if (connection) {
                connection.destroy();
                this.connections.delete(guildId);
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