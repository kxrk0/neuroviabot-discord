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
        
        console.log('[CUSTOM-PLAYER] Custom Music Player initialized with @discordjs/voice + play-dl');
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

            let queue = this.queues.get(guildId);
            if (!queue) {
                queue = [];
                this.queues.set(guildId, queue);
            }

            queue.push({
                ...track,
                metadata: metadata
            });

            console.log(`[CUSTOM-PLAYER] Added track to queue: ${track.title} (URL: ${track.url})`);

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
            console.log(`[CUSTOM-PLAYER] Track URL: ${track.url}`);

            // URL doğrulama
            if (!track.url || typeof track.url !== 'string') {
                console.error(`[CUSTOM-PLAYER] Invalid track URL: ${track.url}`);
                await this.playNext(guildId); // Sıradaki şarkıyı çal
                return false;
            }

            // Stream oluşturma - play-dl ile
            console.log(`[CUSTOM-PLAYER] Creating stream for URL: ${track.url}`);
            
            let stream;
            try {
                // URL doğrulama
                const isValidUrl = playdl.yt_validate(track.url);
                console.log(`[CUSTOM-PLAYER] URL validation result: ${isValidUrl}`);
                
                if (!isValidUrl) {
                    throw new Error(`Invalid YouTube URL: ${track.url}`);
                }
                
                // play-dl ile stream oluşturma - basit yaklaşım
                stream = await playdl.stream(track.url);
                
                console.log(`[CUSTOM-PLAYER] Stream created successfully with play-dl`);
                
            } catch (streamError) {
                console.error(`[CUSTOM-PLAYER] Failed to create stream with play-dl:`, streamError);
                
                // Fallback: video_basic_info + stream_from_info
                try {
                    console.log(`[CUSTOM-PLAYER] Trying fallback method...`);
                    
                    // URL'yi tekrar kontrol et
                    if (!playdl.yt_validate(track.url)) {
                        throw new Error(`Invalid YouTube URL: ${track.url}`);
                    }
                    
                    const videoInfo = await playdl.video_basic_info(track.url);
                    console.log(`[CUSTOM-PLAYER] Video info retrieved:`, {
                        title: videoInfo.video_details.title,
                        url: videoInfo.video_details.url
                    });
                    
                    // Video info'dan stream oluştur
                    stream = await playdl.stream_from_info(videoInfo);
                    console.log(`[CUSTOM-PLAYER] Fallback stream created successfully`);
                    
                } catch (fallbackError) {
                    console.error(`[CUSTOM-PLAYER] Fallback also failed:`, fallbackError);
                    
                    // Son çare: basit stream oluşturma
                    try {
                        console.log(`[CUSTOM-PLAYER] Trying simple stream method...`);
                        stream = await playdl.stream(track.url, { quality: 1 });
                        console.log(`[CUSTOM-PLAYER] Simple stream created successfully`);
                    } catch (simpleError) {
                        console.error(`[CUSTOM-PLAYER] Simple stream also failed:`, simpleError);
                        throw new Error(`All stream methods failed: ${streamError.message}`);
                    }
                }
            }

            const resource = createAudioResource(stream.stream, {
                inputType: 'arbitrary',
                inlineVolume: true
            });

            console.log(`[CUSTOM-PLAYER] Audio resource created successfully`);

            // Audio player oluştur
            const player = createAudioPlayer();
            this.players.set(guildId, player);
            console.log(`[CUSTOM-PLAYER] Audio player created and stored for guild: ${guildId}`);

            // Connection'a player'ı bağla
            const connection = this.connections.get(guildId);
            if (connection) {
                connection.subscribe(player);
                console.log(`[CUSTOM-PLAYER] Player subscribed to connection for guild: ${guildId}`);
            } else {
                console.error(`[CUSTOM-PLAYER] No connection found for guild: ${guildId}`);
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

                track.metadata.send({ embeds: [nowPlayingEmbed] }).catch(console.error);
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

                track.metadata.send({ embeds: [errorEmbed] }).catch(console.error);
                
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