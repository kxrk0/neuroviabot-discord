const { DisTube } = require('distube');
const { EmbedBuilder } = require('discord.js');
const ffmpegPath = require('ffmpeg-static');

class CustomMusicPlayer {
    constructor(client) {
        this.client = client;
        
        // Create DisTube instance
        this.distube = new DisTube(client, {
            emitNewSongOnly: false,
            leaveOnFinish: false,
            leaveOnStop: false,
            savePreviousSongs: true,
            searchSongs: 5,
            nsfw: false,
            emptyCooldown: 30,
            leaveOnEmpty: true,
            customFilters: {},
            ffmpeg: {
                path: ffmpegPath
            }
        });
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('[CUSTOM-PLAYER] DisTube initialized');
    }
    
    setupEventListeners() {
        // Track started playing
        this.distube.on('playSong', (queue, song) => {
            console.log(`[CUSTOM-PLAYER] Started playing: ${song.name}`);
            
            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('🎵 Şimdi Çalıyor')
                .setDescription(`**${song.name}**`)
                .addFields(
                    { name: '👤 Sanatçı', value: song.uploader?.name || 'Bilinmiyor', inline: true },
                    { name: '⏱️ Süre', value: song.formattedDuration || 'Bilinmiyor', inline: true },
                    { name: '📊 Sırada', value: `${queue.songs.length - 1} şarkı`, inline: true }
                )
                .setThumbnail(song.thumbnail)
                .setURL(song.url)
                .setTimestamp();

            queue.textChannel.send({ embeds: [embed] }).catch(console.error);
        });

        // Track added to queue
        this.distube.on('addSong', (queue, song) => {
            console.log(`[CUSTOM-PLAYER] Added to queue: ${song.name}`);
            
            if (queue.songs.length > 1) {
                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('➕ Sıraya Eklendi')
                    .setDescription(`**${song.name}**`)
                    .addFields(
                        { name: '⏱️ Süre', value: song.formattedDuration, inline: true },
                        { name: '📍 Sıradaki Pozisyon', value: `${queue.songs.length}`, inline: true }
                    )
                    .setThumbnail(song.thumbnail)
                    .setTimestamp();

                queue.textChannel.send({ embeds: [embed] }).catch(console.error);
            }
        });

        // Playlist added
        this.distube.on('addList', (queue, playlist) => {
            console.log(`[CUSTOM-PLAYER] Added playlist: ${playlist.name}`);
            
            const embed = new EmbedBuilder()
                .setColor('#ff9900')
                .setTitle('📋 Çalma Listesi Eklendi')
                .setDescription(`**${playlist.name}**`)
                .addFields(
                    { name: '🎵 Şarkı Sayısı', value: `${playlist.songs.length}`, inline: true }
                )
                .setTimestamp();

            queue.textChannel.send({ embeds: [embed] }).catch(console.error);
        });

        // Queue finished
        this.distube.on('finish', (queue) => {
            console.log(`[CUSTOM-PLAYER] Queue finished`);
            
            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('✅ Sıra Tamamlandı')
                .setDescription('Çalma listesindeki tüm şarkılar bitti!')
                .setTimestamp();

            queue.textChannel.send({ embeds: [embed] }).catch(console.error);
        });

        // Error handling
        this.distube.on('error', (channel, error) => {
            console.error(`[CUSTOM-PLAYER] Error:`, error);
            
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Hata')
                .setDescription('Bir hata oluştu!')
                .addFields({
                    name: '🔧 Hata Detayı',
                    value: `\`\`\`${error.message}\`\`\``,
                    inline: false
                })
                .setTimestamp();

            if (channel && channel.send) {
                channel.send({ embeds: [embed] }).catch(console.error);
            }
        });

        // Empty channel
        this.distube.on('empty', (queue) => {
            console.log(`[CUSTOM-PLAYER] Channel empty`);
            
            const embed = new EmbedBuilder()
                .setColor('#ffaa00')
                .setTitle('👋 Kanald Kimse Yok')
                .setDescription('Ses kanalında kimse kalmadığı için ayrılıyorum.')
                .setTimestamp();

            queue.textChannel.send({ embeds: [embed] }).catch(console.error);
        });
    }
    
    async joinChannel(guildId, voiceChannel) {
        // DisTube handles joining automatically
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

            await this.distube.play(member.voice.channel, query, {
                member: member,
                textChannel: textChannel
            });

            return true;
        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Failed to add track:`, error);
            throw error;
        }
    }

    async stop(guildId) {
        try {
            const queue = this.distube.getQueue(guildId);
            if (!queue) return false;

            await this.distube.stop(guildId);
            return true;
        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Failed to stop:`, error);
            return false;
        }
    }

    getQueue(guildId) {
        const queue = this.distube.getQueue(guildId);
        return queue ? queue.songs : [];
    }

    getCurrentTrack(guildId) {
        const queue = this.distube.getQueue(guildId);
        return queue ? queue.songs[0] : null;
    }

    isPlaying(guildId) {
        const queue = this.distube.getQueue(guildId);
        return queue ? queue.playing : false;
    }

    isPaused(guildId) {
        const queue = this.distube.getQueue(guildId);
        return queue ? queue.paused : false;
    }

    async pause(guildId) {
        try {
            const queue = this.distube.getQueue(guildId);
            if (!queue) return false;

            await this.distube.pause(guildId);
            return true;
        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Failed to pause:`, error);
            return false;
        }
    }

    async resume(guildId) {
        try {
            const queue = this.distube.getQueue(guildId);
            if (!queue) return false;

            await this.distube.resume(guildId);
            return true;
        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Failed to resume:`, error);
            return false;
        }
    }

    cleanup(guildId) {
        try {
            const queue = this.distube.getQueue(guildId);
            if (queue) {
                this.distube.stop(guildId);
            }
        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Failed to cleanup:`, error);
        }
    }

    async leave(guildId) {
        try {
            const queue = this.distube.getQueue(guildId);
            if (queue) {
                await this.distube.voices.leave(guild);
                return true;
            }
            return false;
        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Failed to leave:`, error);
            return false;
        }
    }
}

module.exports = CustomMusicPlayer;
