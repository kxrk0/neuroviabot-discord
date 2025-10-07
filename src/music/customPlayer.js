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
        
        console.log('[CUSTOM-PLAYER] Custom Music Player initialized with @discordjs/voice');
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

            // play-dl ile stream oluştur
            console.log(`[CUSTOM-PLAYER] Creating stream for URL: ${track.url}`);
            
            let stream;
            try {
                // Önce video info al
                const videoInfo = await playdl.video_basic_info(track.url);
                console.log(`[CUSTOM-PLAYER] Video info retrieved successfully`);
                console.log(`[CUSTOM-PLAYER] Video info structure:`, {
                    hasVideoDetails: !!videoInfo.video_details,
                    videoDetailsUrl: videoInfo.video_details?.url,
                    videoDetailsId: videoInfo.video_details?.id,
                    trackUrl: track.url
                });
                
                // videoInfo.video_details.url'yi kontrol et ve gerekirse düzelt
                if (!videoInfo.video_details.url) {
                    console.log(`[CUSTOM-PLAYER] video_details.url is missing, setting to track.url: ${track.url}`);
                    videoInfo.video_details.url = track.url;
                }
                
                // videoInfo.video_details.id'yi de kontrol et
                if (!videoInfo.video_details.id && track.url.includes('watch?v=')) {
                    const videoId = track.url.split('watch?v=')[1].split('&')[0];
                    console.log(`[CUSTOM-PLAYER] Setting video_details.id to: ${videoId}`);
                    videoInfo.video_details.id = videoId;
                }
                
                console.log(`[CUSTOM-PLAYER] Attempting stream_from_info with:`, {
                    url: videoInfo.video_details.url,
                    id: videoInfo.video_details.id
                });
                
                // Stream'i info'dan oluştur
                stream = await playdl.stream_from_info(videoInfo);
                console.log(`[CUSTOM-PLAYER] Stream created successfully, type: ${stream.type}`);
            } catch (streamError) {
                console.error(`[CUSTOM-PLAYER] Failed to create stream from info:`, streamError);
                
                // Alternatif yöntem: Direkt stream
                try {
                    console.log(`[CUSTOM-PLAYER] Trying direct stream for URL: ${track.url}`);
                    stream = await playdl.stream(track.url);
                    console.log(`[CUSTOM-PLAYER] Direct stream created successfully, type: ${stream.type}`);
                } catch (directError) {
                    console.error(`[CUSTOM-PLAYER] Direct stream also failed:`, directError);
                    
                    // Son çare: Video ID ile deneme
                    try {
                        const videoId = track.url.split('watch?v=')[1]?.split('&')[0];
                        if (videoId) {
                            console.log(`[CUSTOM-PLAYER] Trying with video ID: ${videoId}`);
                            const directUrl = `https://www.youtube.com/watch?v=${videoId}`;
                            
                            // Video info ile deneme
                            const videoInfo = await playdl.video_basic_info(directUrl);
                            if (!videoInfo.video_details.url) {
                                videoInfo.video_details.url = directUrl;
                            }
                            stream = await playdl.stream_from_info(videoInfo);
                            console.log(`[CUSTOM-PLAYER] Video ID stream created successfully`);
                        } else {
                            throw new Error('No video ID found');
                        }
                    } catch (idError) {
                        console.error(`[CUSTOM-PLAYER] Video ID approach also failed:`, idError);
                        throw new Error('Failed to create stream with all methods');
                    }
                }
            }

            // Stream tipini kontrol et ve düzelt
            let inputType = stream.type;
            if (!inputType || inputType === 'unknown') {
                inputType = 'arbitrary'; // Varsayılan tip
                console.log(`[CUSTOM-PLAYER] Stream type unknown, using 'arbitrary'`);
            }
            
            console.log(`[CUSTOM-PLAYER] Creating audio resource with type: ${inputType}`);
            console.log(`[CUSTOM-PLAYER] Stream info:`, {
                hasStream: !!stream.stream,
                streamType: stream.type,
                inputType: inputType
            });

            const resource = createAudioResource(stream.stream, {
                inputType: inputType,
                inlineVolume: true
            });

            // Audio player oluştur
            const player = createAudioPlayer();
            this.players.set(guildId, player);

            // Connection'a player'ı bağla
            const connection = this.connections.get(guildId);
            if (connection) {
                console.log(`[CUSTOM-PLAYER] Connection state:`, {
                    status: connection.state.status,
                    joinConfig: connection.joinConfig
                });
                
                connection.subscribe(player);
                console.log(`[CUSTOM-PLAYER] Player subscribed to connection`);
            } else {
                console.error(`[CUSTOM-PLAYER] No connection found for guild: ${guildId}`);
            }

            // Player event listeners
            player.on(AudioPlayerStatus.Playing, () => {
                console.log(`[CUSTOM-PLAYER] ✅ Started playing: ${track.title}`);
                console.log(`[CUSTOM-PLAYER] Player state:`, {
                    status: player.state.status,
                    resource: !!player.state.resource,
                    playbackDuration: player.state.resource?.playbackDuration || 0
                });
                
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

            player.on(AudioPlayerStatus.Buffering, () => {
                console.log(`[CUSTOM-PLAYER] 🔄 Buffering: ${track.title}`);
            });

            player.on(AudioPlayerStatus.Paused, () => {
                console.log(`[CUSTOM-PLAYER] ⏸️ Paused: ${track.title}`);
            });

            player.on(AudioPlayerStatus.AutoPaused, () => {
                console.log(`[CUSTOM-PLAYER] ⏸️ Auto-paused: ${track.title}`);
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