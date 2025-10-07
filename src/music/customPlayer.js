const { AudioPlayer, AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');
const playdl = require('play-dl');
const { logger } = require('../utils/logger');

class CustomMusicPlayer {
    constructor(client) {
        this.client = client;
        this.players = new Map(); // guildId -> player data
        this.queues = new Map(); // guildId -> queue
        this.connections = new Map(); // guildId -> connection
    }

    async joinChannel(guildId, voiceChannel) {
        try {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: guildId,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                selfDeaf: true,
                selfMute: false
            });

            this.connections.set(guildId, connection);
            
            const player = createAudioPlayer();
            this.players.set(guildId, player);
            
            connection.subscribe(player);
            
            // Connection event listeners
            connection.on(VoiceConnectionStatus.Ready, () => {
                console.log(`[CUSTOM-PLAYER] Connected to ${voiceChannel.name}`);
            });

            connection.on(VoiceConnectionStatus.Disconnected, () => {
                console.log(`[CUSTOM-PLAYER] Disconnected from ${voiceChannel.name}`);
                this.cleanup(guildId);
            });

            // Player event listeners
            player.on(AudioPlayerStatus.Playing, () => {
                console.log(`[CUSTOM-PLAYER] Playing in ${guildId}`);
            });

            player.on(AudioPlayerStatus.Idle, () => {
                console.log(`[CUSTOM-PLAYER] Player idle in ${guildId}`);
                this.playNext(guildId);
            });

            player.on('error', (error) => {
                console.error(`[CUSTOM-PLAYER] Player error in ${guildId}:`, error);
                this.playNext(guildId);
            });

            return true;
        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Join error:`, error);
            return false;
        }
    }

    async addTrack(guildId, track, metadata) {
        if (!this.queues.has(guildId)) {
            this.queues.set(guildId, []);
        }

        const queue = this.queues.get(guildId);
        queue.push({
            ...track,
            metadata: metadata
        });

        console.log(`[CUSTOM-PLAYER] Added track to queue: ${track.title}`);
        
        // Eğer şu anda çalmıyorsa çalmaya başla
        const player = this.players.get(guildId);
        if (player && player.state.status === AudioPlayerStatus.Idle) {
            await this.playNext(guildId);
        }
    }

    async playNext(guildId) {
        const queue = this.queues.get(guildId);
        const player = this.players.get(guildId);
        
        if (!queue || queue.length === 0 || !player) {
            console.log(`[CUSTOM-PLAYER] No tracks to play in ${guildId}`);
            return;
        }

        const track = queue.shift();
        console.log(`[CUSTOM-PLAYER] Playing: ${track.title}`);

        try {
            // URL kontrolü
            if (!track.url || track.url === 'undefined' || track.url === 'null') {
                throw new Error(`Invalid track URL: ${track.url}`);
            }
            
            // Play-dl ile stream oluştur
            console.log(`[CUSTOM-PLAYER] Creating stream for: ${track.url}`);
            
            // Direkt stream oluştur (video_basic_info bypass)
            console.log(`[CUSTOM-PLAYER] Creating direct stream for: ${track.url}`);
            const stream = await playdl.stream(track.url, {
                discordPlayerCompatibility: true,
                quality: 2
            });
            console.log(`[CUSTOM-PLAYER] Stream created successfully, type: ${stream.type}`);

            const resource = createAudioResource(stream.stream, {
                inputType: stream.type,
                inlineVolume: true
            });
            console.log(`[CUSTOM-PLAYER] Audio resource created successfully`);

            player.play(resource);
            console.log(`[CUSTOM-PLAYER] Player.play() called successfully`);
            
            // Şimdi çalıyor mesajı gönder
            if (track.metadata) {
                console.log(`[CUSTOM-PLAYER] Sending now playing message for: ${track.title}`);
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

                try {
                    await track.metadata.send({ embeds: [nowPlayingEmbed] });
                    console.log(`[CUSTOM-PLAYER] Now playing message sent successfully`);
                } catch (error) {
                    console.error(`[CUSTOM-PLAYER] Failed to send now playing message:`, error);
                }
            }

        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Stream error for ${track.title}:`, error);
            
            // Hata mesajı gönder
            if (track.metadata) {
                console.log(`[CUSTOM-PLAYER] Sending error message for: ${track.title}`);
                const errorEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('❌ Çalma Hatası')
                    .setDescription(`**${track.title}** çalınamadı!`)
                    .addFields({
                        name: '🔧 Hata Detayı',
                        value: `\`\`\`${error.message}\`\`\``,
                        inline: false
                    })
                    .setTimestamp();

                try {
                    await track.metadata.send({ embeds: [errorEmbed] });
                    console.log(`[CUSTOM-PLAYER] Error message sent successfully`);
                } catch (sendError) {
                    console.error(`[CUSTOM-PLAYER] Failed to send error message:`, sendError);
                }
            }

            // Sonraki şarkıya geç
            await this.playNext(guildId);
        }
    }

    async stop(guildId) {
        const player = this.players.get(guildId);
        if (player) {
            player.stop();
        }
        
        if (this.queues.has(guildId)) {
            this.queues.set(guildId, []);
        }
        
        console.log(`[CUSTOM-PLAYER] Stopped playback in ${guildId}`);
    }

    async pause(guildId) {
        const player = this.players.get(guildId);
        if (player && player.state.status === AudioPlayerStatus.Playing) {
            player.pause();
            console.log(`[CUSTOM-PLAYER] Paused playback in ${guildId}`);
            return true;
        }
        return false;
    }

    async resume(guildId) {
        const player = this.players.get(guildId);
        if (player && player.state.status === AudioPlayerStatus.Paused) {
            player.unpause();
            console.log(`[CUSTOM-PLAYER] Resumed playback in ${guildId}`);
            return true;
        }
        return false;
    }

    async skip(guildId) {
        const player = this.players.get(guildId);
        if (player) {
            player.stop();
            console.log(`[CUSTOM-PLAYER] Skipped track in ${guildId}`);
            return true;
        }
        return false;
    }

    async setVolume(guildId, volume) {
        const player = this.players.get(guildId);
        if (player && player.state.resource) {
            player.state.resource.volume.setVolume(volume / 100);
            console.log(`[CUSTOM-PLAYER] Volume set to ${volume}% in ${guildId}`);
            return true;
        }
        return false;
    }

    getQueue(guildId) {
        return this.queues.get(guildId) || [];
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
        return queue && queue.length > 0 ? queue[0] : null;
    }

    cleanup(guildId) {
        this.players.delete(guildId);
        this.queues.delete(guildId);
        this.connections.delete(guildId);
        console.log(`[CUSTOM-PLAYER] Cleaned up ${guildId}`);
    }

    async leave(guildId) {
        const connection = this.connections.get(guildId);
        if (connection) {
            connection.destroy();
        }
        this.cleanup(guildId);
        console.log(`[CUSTOM-PLAYER] Left ${guildId}`);
    }
}

module.exports = CustomMusicPlayer;
