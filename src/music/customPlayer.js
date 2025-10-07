const { Player, QueryType } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const ffmpegPath = require('ffmpeg-static');
const ffprobePath = require('ffprobe-static').path;

class CustomMusicPlayer {
    constructor(client) {
        this.client = client;
        
        // Create Discord Player instance with FFmpeg configuration
        this.player = new Player(client, {
            ytdlOptions: {
                quality: 'highestaudio',
                highWaterMark: 1 << 25,
                filter: 'audioonly'
            },
            ffmpeg: {
                path: ffmpegPath,
                probe: ffprobePath
            }
        });

        // Load extractors from @discord-player/extractor
        this.loadExtractors();
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('[CUSTOM-PLAYER] Discord Player initialized');
        console.log('[CUSTOM-PLAYER] Registered extractors count:', this.player.extractors.store.size);
    }

    async loadExtractors() {
        try {
            const { ext } = await import('@discord-player/extractor');
            await ext(this.player);
            console.log('[CUSTOM-PLAYER] ✅ All extractors loaded successfully');
        } catch (error) {
            console.error('[CUSTOM-PLAYER] ❌ Failed to load extractors:', error.message);
        }
    }
    
    setupEventListeners() {
        // Track started playing
        this.player.events.on('playerStart', (queue, track) => {
            console.log(`[CUSTOM-PLAYER] Started playing: ${track.title}`);
            
            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('🎵 Şimdi Çalıyor')
                .setDescription(`**${track.title}**`)
                .addFields(
                    { name: '👤 Sanatçı', value: track.author, inline: true },
                    { name: '⏱️ Süre', value: track.duration, inline: true },
                    { name: '📊 Sırada', value: `${queue.tracks.size} şarkı`, inline: true }
                )
                .setThumbnail(track.thumbnail)
                .setURL(track.url)
                .setTimestamp();

            queue.metadata.channel.send({ embeds: [embed] }).catch(console.error);
        });

        // Track added to queue
        this.player.events.on('audioTrackAdd', (queue, track) => {
            console.log(`[CUSTOM-PLAYER] Added to queue: ${track.title}`);
            
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('➕ Sıraya Eklendi')
                .setDescription(`**${track.title}**`)
                .addFields(
                    { name: '⏱️ Süre', value: track.duration, inline: true },
                    { name: '📍 Sıradaki Pozisyon', value: `${queue.tracks.size + 1}`, inline: true }
                )
                .setThumbnail(track.thumbnail)
                .setTimestamp();

            queue.metadata.channel.send({ embeds: [embed] }).catch(console.error);
        });

        // Queue finished
        this.player.events.on('emptyQueue', (queue) => {
            console.log(`[CUSTOM-PLAYER] Queue finished`);
            
            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('✅ Sıra Tamamlandı')
                .setDescription('Çalma listesindeki tüm şarkılar bitti!')
                .setTimestamp();

            queue.metadata.channel.send({ embeds: [embed] }).catch(console.error);
        });

        // Error handling
        this.player.events.on('playerError', (queue, error) => {
            console.error(`[CUSTOM-PLAYER] Player error:`, error);
            
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Çalma Hatası')
                .setDescription('Şarkı çalınırken bir hata oluştu!')
                .setTimestamp();

            queue.metadata.channel.send({ embeds: [embed] }).catch(console.error);
        });

        this.player.events.on('error', (queue, error) => {
            console.error(`[CUSTOM-PLAYER] Error:`, error);
            
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Hata')
                .setDescription('Bir hata oluştu!')
                .setTimestamp();

            queue.metadata.channel.send({ embeds: [embed] }).catch(console.error);
        });
    }
    
    async joinChannel(guildId, voiceChannel) {
        // Discord Player handles joining automatically
        return true;
    }

    async addTrack(guildId, query, textChannel, user) {
        try {
            console.log(`[CUSTOM-PLAYER] Searching for: ${query}`);
            
            const guild = this.client.guilds.cache.get(guildId);
            if (!guild) {
                throw new Error('Guild not found');
            }

            const member = guild.members.cache.get(user.id);
            if (!member?.voice?.channel) {
                throw new Error('User not in voice channel');
            }

            // Search for the track
            const result = await this.player.search(query, {
                requestedBy: user,
                searchEngine: QueryType.AUTO
            });

            if (!result || !result.tracks || result.tracks.length === 0) {
                throw new Error('Hiçbir şarkı bulunamadı!');
            }

            // Create or get queue
            const queue = this.player.nodes.create(guild, {
                metadata: {
                    channel: textChannel,
                    client: this.client,
                    requestedBy: user
                },
                selfDeaf: true,
                volume: 50,
                leaveOnEmpty: true,
                leaveOnEmptyCooldown: 30000,
                leaveOnEnd: false,
                leaveOnEndCooldown: 30000
            });

            // Connect to voice channel if not connected
            if (!queue.connection) {
                await queue.connect(member.voice.channel);
            }

            // Add track(s) to queue
            if (result.playlist) {
                queue.addTrack(result.tracks);
                
                const embed = new EmbedBuilder()
                    .setColor('#ff9900')
                    .setTitle('📋 Çalma Listesi Eklendi')
                    .setDescription(`**${result.playlist.title}**`)
                    .addFields(
                        { name: '🎵 Şarkı Sayısı', value: `${result.tracks.length}`, inline: true },
                        { name: '🎧 İsteyen', value: user.tag, inline: true }
                    )
                    .setTimestamp();

                textChannel.send({ embeds: [embed] }).catch(console.error);
            } else {
                queue.addTrack(result.tracks[0]);
            }

            // Start playing if not already
            if (!queue.isPlaying()) {
                await queue.node.play();
            }

            return true;
        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Failed to add track:`, error);
            throw error;
        }
    }

    async stop(guildId) {
        try {
            const guild = this.client.guilds.cache.get(guildId);
            if (!guild) return false;

            const queue = this.player.nodes.get(guild);
            if (!queue) return false;

            queue.delete();
            return true;
        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Failed to stop:`, error);
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

            return true;
        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Failed to leave:`, error);
            return false;
        }
    }
}

module.exports = CustomMusicPlayer;
