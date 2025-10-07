const { 
    joinVoiceChannel, 
    createAudioPlayer, 
    createAudioResource, 
    AudioPlayerStatus,
    VoiceConnectionStatus,
    entersState
} = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');
const playdl = require('play-dl');
const { logger } = require('../utils/logger');

class CustomMusicPlayer {
    constructor(client) {
        this.client = client;
        this.queues = new Map(); // guildId -> { connection, player, songs: [], currentSong, textChannel }
        
        console.log('[CUSTOM-PLAYER] Play-DL Music Player initialized successfully');
    }
    
    async joinChannel(guildId, voiceChannel) {
        try {
            const existingQueue = this.queues.get(guildId);
            if (existingQueue?.connection) {
                return existingQueue.connection;
            }

            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                selfDeaf: true
            });

            // Wait for connection to be ready
            await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
            
            const player = createAudioPlayer();
            connection.subscribe(player);

            // Setup player event handlers
            player.on(AudioPlayerStatus.Playing, () => {
                console.log(`[CUSTOM-PLAYER] Audio player is now playing`);
            });

            player.on(AudioPlayerStatus.Idle, () => {
                console.log(`[CUSTOM-PLAYER] Audio player is idle, playing next...`);
                this.playNext(guildId);
            });

            player.on('error', error => {
                console.error(`[CUSTOM-PLAYER] Audio player error:`, error);
                this.playNext(guildId);
            });

            // Setup connection handlers
            connection.on(VoiceConnectionStatus.Disconnected, async () => {
                try {
                    await Promise.race([
                        entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                        entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
                    ]);
                } catch (error) {
                    console.log(`[CUSTOM-PLAYER] Connection lost, cleaning up`);
                    this.cleanup(guildId);
                }
            });

            const queue = this.queues.get(guildId) || { songs: [] };
            queue.connection = connection;
            queue.player = player;
            this.queues.set(guildId, queue);

            console.log(`[CUSTOM-PLAYER] Connected to ${voiceChannel.name}`);
            return connection;
        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Failed to join voice channel:`, error);
            throw error;
        }
    }

    async addTrack(guildId, query, textChannel, user) {
        try {
            console.log(`[CUSTOM-PLAYER] Searching for: ${query}`);
            
            let searchResult;
            
            // Check if it's a URL
            if (playdl.yt_validate(query) === 'video') {
                searchResult = await playdl.video_info(query);
                searchResult = searchResult.video_details;
            } else if (playdl.yt_validate(query) === 'playlist') {
                const playlist = await playdl.playlist_info(query);
                const videos = await playlist.all_videos();
                
                for (const video of videos) {
                    await this.addToQueue(guildId, video, textChannel, user, videos.length > 1);
                }
                
                const playlistEmbed = new EmbedBuilder()
                    .setColor('#ff9900')
                    .setTitle('📋 Çalma Listesi Eklendi')
                    .setDescription(`**${playlist.title}**`)
                    .addFields(
                        { name: '🎵 Şarkı Sayısı', value: `${videos.length}`, inline: true },
                        { name: '🎧 İsteyen', value: user.tag, inline: true }
                    )
                    .setTimestamp();
                
                textChannel.send({ embeds: [playlistEmbed] }).catch(console.error);
                return true;
            } else {
                // Search by query
                const searched = await playdl.search(query, { limit: 1, source: { youtube: 'video' } });
                if (!searched || searched.length === 0) {
                    throw new Error('Hiçbir şarkı bulunamadı!');
                }
                searchResult = searched[0];
            }
            
            await this.addToQueue(guildId, searchResult, textChannel, user, false);
            return true;
        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Failed to add track:`, error);
            throw error;
        }
    }

    async addToQueue(guildId, videoDetails, textChannel, user, isPlaylist) {
        const queue = this.queues.get(guildId) || { songs: [] };
        
        // Ensure we have a valid URL
        const videoUrl = videoDetails.url || videoDetails.video_url || `https://www.youtube.com/watch?v=${videoDetails.id}`;
        
        const song = {
            title: videoDetails.title,
            url: videoUrl,
            id: videoDetails.id,
            thumbnail: videoDetails.thumbnails?.[0]?.url || null,
            duration: this.formatDuration(videoDetails.durationInSec),
            durationRaw: videoDetails.durationInSec,
            requester: user,
            channelName: videoDetails.channel?.name || 'Unknown',
            videoDetails: videoDetails // Store full details for streaming
        };

        queue.songs.push(song);
        queue.textChannel = textChannel;
        this.queues.set(guildId, queue);

        console.log(`[CUSTOM-PLAYER] Added to queue: ${song.title} (URL: ${song.url})`);

        // If nothing is playing, start playing
        if (!queue.currentSong && queue.connection && queue.player) {
            this.playNext(guildId);
        } else if (!isPlaylist) {
            // Send "added to queue" message
            const addedEmbed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('➕ Sıraya Eklendi')
                .setDescription(`**${song.title}**`)
                .addFields(
                    { name: '⏱️ Süre', value: song.duration, inline: true },
                    { name: '📍 Sıradaki Pozisyon', value: `${queue.songs.length}`, inline: true },
                    { name: '🎧 İsteyen', value: user.tag, inline: true }
                )
                .setThumbnail(song.thumbnail)
                .setTimestamp();

            textChannel.send({ embeds: [addedEmbed] }).catch(console.error);
        }
    }

    async playNext(guildId) {
        const queue = this.queues.get(guildId);
        if (!queue || !queue.connection || !queue.player) {
            console.log(`[CUSTOM-PLAYER] No queue or connection for ${guildId}`);
            return;
        }

        // Clear current song
        queue.currentSong = null;

        if (queue.songs.length === 0) {
            console.log(`[CUSTOM-PLAYER] Queue is empty for ${guildId}`);
            
            const finishEmbed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('✅ Sıra Tamamlandı')
                .setDescription('Çalma listesindeki tüm şarkılar bitti!')
                .setTimestamp();

            queue.textChannel?.send({ embeds: [finishEmbed] }).catch(console.error);
            return;
        }

        const song = queue.songs.shift();
        queue.currentSong = song;
        this.queues.set(guildId, queue);

        try {
            console.log(`[CUSTOM-PLAYER] Playing: ${song.title} (URL: ${song.url})`);
            
            // Validate URL before streaming
            if (!song.url || song.url === 'undefined') {
                throw new Error('Invalid song URL');
            }
            
            // Get fresh video info for streaming
            const videoInfo = await playdl.video_info(song.url);
            console.log(`[CUSTOM-PLAYER] Got video info for streaming`);
            console.log(`[CUSTOM-PLAYER] VideoInfo type:`, typeof videoInfo);
            console.log(`[CUSTOM-PLAYER] VideoInfo keys:`, Object.keys(videoInfo));
            
            // Use video_details from the info object
            const stream = await playdl.stream_from_info(videoInfo.video_details, { quality: 2 });
            console.log(`[CUSTOM-PLAYER] Stream created successfully`);
            
            const resource = createAudioResource(stream.stream, {
                inputType: stream.type,
                inlineVolume: true
            });

            resource.volume?.setVolume(0.5); // 50% default volume

            queue.player.play(resource);

            // Send now playing message
            const nowPlayingEmbed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('🎵 Şimdi Çalıyor')
                .setDescription(`**${song.title}**`)
                .addFields(
                    { name: '👤 Kanal', value: song.channelName, inline: true },
                    { name: '⏱️ Süre', value: song.duration, inline: true },
                    { name: '📊 Sırada', value: `${queue.songs.length} şarkı`, inline: true },
                    { name: '🎧 İsteyen', value: song.requester.tag, inline: true }
                )
                .setThumbnail(song.thumbnail)
                .setURL(song.url)
                .setTimestamp();

            queue.textChannel?.send({ embeds: [nowPlayingEmbed] }).catch(console.error);
        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Failed to play song:`, error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Çalma Hatası')
                .setDescription(`**${song.title}** çalınamadı!`)
                .addFields({
                    name: '🔧 Hata',
                    value: error.message,
                    inline: false
                })
                .setTimestamp();

            queue.textChannel?.send({ embeds: [errorEmbed] }).catch(console.error);
            
            // Try next song
            this.playNext(guildId);
        }
    }

    async stop(guildId) {
        try {
            const queue = this.queues.get(guildId);
            if (!queue || !queue.player) {
                return false;
            }

            queue.songs = [];
            queue.currentSong = null;
            queue.player.stop();
            
            console.log(`[CUSTOM-PLAYER] Stopped playback for ${guildId}`);
            return true;
        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Failed to stop:`, error);
            return false;
        }
    }

    getQueue(guildId) {
        const queue = this.queues.get(guildId);
        return queue?.songs || [];
    }

    getCurrentTrack(guildId) {
        const queue = this.queues.get(guildId);
        return queue?.currentSong || null;
    }

    isPlaying(guildId) {
        const queue = this.queues.get(guildId);
        return queue?.player?.state?.status === AudioPlayerStatus.Playing;
    }

    isPaused(guildId) {
        const queue = this.queues.get(guildId);
        return queue?.player?.state?.status === AudioPlayerStatus.Paused;
    }

    async pause(guildId) {
        try {
            const queue = this.queues.get(guildId);
            if (!queue || !queue.player) return false;

            queue.player.pause();
            console.log(`[CUSTOM-PLAYER] Paused playback in ${guildId}`);
            return true;
        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Failed to pause:`, error);
            return false;
        }
    }

    async resume(guildId) {
        try {
            const queue = this.queues.get(guildId);
            if (!queue || !queue.player) return false;

            queue.player.unpause();
            console.log(`[CUSTOM-PLAYER] Resumed playback in ${guildId}`);
            return true;
        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Failed to resume:`, error);
            return false;
        }
    }

    cleanup(guildId) {
        try {
            const queue = this.queues.get(guildId);
            if (!queue) return;

            queue.player?.stop();
            queue.connection?.destroy();
            this.queues.delete(guildId);
            
            console.log(`[CUSTOM-PLAYER] Cleaned up ${guildId}`);
        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Failed to cleanup:`, error);
        }
    }

    async leave(guildId) {
        try {
            const queue = this.queues.get(guildId);
            if (!queue) return false;

            queue.connection?.destroy();
            this.queues.delete(guildId);
            
            console.log(`[CUSTOM-PLAYER] Left ${guildId}`);
            return true;
        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Failed to leave:`, error);
            return false;
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
}

module.exports = CustomMusicPlayer;
