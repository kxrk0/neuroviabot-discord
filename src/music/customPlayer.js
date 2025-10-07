const { DisTube } = require('distube');
const { EmbedBuilder } = require('discord.js');
const { logger } = require('../utils/logger');

class CustomMusicPlayer {
    constructor(client) {
        this.client = client;
        
        // DisTube oluştur - Built-in YouTube support (DisTube v5 config)
        this.distube = new DisTube(client, {
            emitNewSongOnly: true,
            nsfw: false
        });
        
        // Event listener'ları kur
        this.setupEventListeners();
        
        console.log('[CUSTOM-PLAYER] DisTube Music Player initialized successfully');
    }
    
    setupEventListeners() {
        // Şarkı çalmaya başladığında
        this.distube.on('playSong', (queue, song) => {
            console.log(`[CUSTOM-PLAYER] Started playing: ${song.name}`);
            
            const nowPlayingEmbed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('🎵 Şimdi Çalıyor')
                .setDescription(`**${song.name}**`)
                .addFields(
                    { name: '👤 Sanatçı', value: song.uploader?.name || song.user?.username || 'Bilinmiyor', inline: true },
                    { name: '⏱️ Süre', value: song.formattedDuration || 'Bilinmiyor', inline: true },
                    { name: '🔗 Kaynak', value: this.getSourceName(song.source), inline: true },
                    { name: '📊 Sırada', value: `${queue.songs.length - 1} şarkı`, inline: true },
                    { name: '🔊 Ses Seviyesi', value: `${queue.volume}%`, inline: true },
                    { name: '🎧 İsteyen', value: `${song.user}`, inline: true }
                )
                .setThumbnail(song.thumbnail)
                .setURL(song.url)
                .setTimestamp();

            queue.textChannel.send({ embeds: [nowPlayingEmbed] }).catch(console.error);
        });

        // Şarkı sıraya eklendiğinde
        this.distube.on('addSong', (queue, song) => {
            console.log(`[CUSTOM-PLAYER] Added song to queue: ${song.name}`);
            
            const addedEmbed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('➕ Sıraya Eklendi')
                .setDescription(`**${song.name}**`)
                .addFields(
                    { name: '⏱️ Süre', value: song.formattedDuration || 'Bilinmiyor', inline: true },
                    { name: '📍 Sıradaki Pozisyon', value: `${queue.songs.length}`, inline: true },
                    { name: '🎧 İsteyen', value: `${song.user}`, inline: true }
                )
                .setThumbnail(song.thumbnail)
                .setTimestamp();

            queue.textChannel.send({ embeds: [addedEmbed] }).catch(console.error);
        });

        // Şarkı listesi eklendiğinde
        this.distube.on('addList', (queue, playlist) => {
            console.log(`[CUSTOM-PLAYER] Added playlist: ${playlist.name}`);
            
            const playlistEmbed = new EmbedBuilder()
                .setColor('#ff9900')
                .setTitle('📋 Çalma Listesi Eklendi')
                .setDescription(`**${playlist.name}**`)
                .addFields(
                    { name: '🎵 Şarkı Sayısı', value: `${playlist.songs.length}`, inline: true },
                    { name: '⏱️ Toplam Süre', value: playlist.formattedDuration || 'Bilinmiyor', inline: true },
                    { name: '🎧 İsteyen', value: `${playlist.user}`, inline: true }
                )
                .setTimestamp();

            queue.textChannel.send({ embeds: [playlistEmbed] }).catch(console.error);
        });

        // Şarkı bittiğinde
        this.distube.on('finishSong', (queue, song) => {
            console.log(`[CUSTOM-PLAYER] Finished playing: ${song.name}`);
        });

        // Hata oluştuğunda
        this.distube.on('error', (channel, error) => {
            console.error(`[CUSTOM-PLAYER] Error:`, error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Hata Oluştu')
                .setDescription('Şarkı çalınırken bir hata oluştu!')
                .addFields({
                    name: '🔧 Hata Detayı',
                    value: `\`\`\`${error.message}\`\`\``,
                    inline: false
                })
                .setTimestamp();

            channel.send({ embeds: [errorEmbed] }).catch(console.error);
        });

        // Boş kanal - bot ayrılıyor
        this.distube.on('empty', (queue) => {
            console.log(`[CUSTOM-PLAYER] Voice channel is empty, leaving...`);
            
            const emptyEmbed = new EmbedBuilder()
                .setColor('#ffaa00')
                .setTitle('👋 Ayrılıyorum')
                .setDescription('Ses kanalında kimse kalmadı, ben de ayrılıyorum!')
                .setTimestamp();

            queue.textChannel.send({ embeds: [emptyEmbed] }).catch(console.error);
        });

        // Queue bitti
        this.distube.on('finish', (queue) => {
            console.log(`[CUSTOM-PLAYER] Queue finished`);
            
            const finishEmbed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('✅ Sıra Tamamlandı')
                .setDescription('Çalma listesindeki tüm şarkılar bitti!')
                .setTimestamp();

            queue.textChannel.send({ embeds: [finishEmbed] }).catch(console.error);
        });

        // Arama tamamlandı
        this.distube.on('searchResult', (message, results) => {
            console.log(`[CUSTOM-PLAYER] Search results: ${results.length} found`);
        });

        // Arama yapılırken
        this.distube.on('searchNoResult', (message, query) => {
            console.log(`[CUSTOM-PLAYER] No search results for: ${query}`);
            
            const noResultEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('🔍 Sonuç Bulunamadı')
                .setDescription(`\`${query}\` için hiçbir şarkı bulunamadı!`)
                .setTimestamp();

            message.channel.send({ embeds: [noResultEmbed] }).catch(console.error);
        });
    }
    
    getSourceName(source) {
        const sources = {
            'youtube': 'YouTube',
            'spotify': 'Spotify',
            'soundcloud': 'SoundCloud',
            'facebook': 'Facebook',
            'bandcamp': 'Bandcamp',
            'vimeo': 'Vimeo'
        };
        return sources[source] || source || 'Bilinmiyor';
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
            // DisTube otomatik olarak kanala bağlanır
            console.log(`[CUSTOM-PLAYER] Will connect to ${voiceChannel.name} when playing`);
            return true;
        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Failed to join voice channel:`, error);
            return false;
        }
    }

    async addTrack(guildId, query, metadata) {
        try {
            console.log(`[CUSTOM-PLAYER] Playing: ${query}`);
            
            const voiceChannel = metadata.member?.voice?.channel;
            if (!voiceChannel) {
                throw new Error('Ses kanalında değilsiniz!');
            }

            // DisTube ile şarkı çal
            await this.distube.play(voiceChannel, query, {
                textChannel: metadata.channel,
                member: metadata.member
            });

            return true;
        } catch (error) {
            console.error(`[CUSTOM-PLAYER] Failed to play:`, error);
            throw error;
        }
    }

    async stop(guildId) {
        try {
            const guild = this.client.guilds.cache.get(guildId);
            if (!guild) {
                console.error(`[CUSTOM-PLAYER] Guild not found: ${guildId}`);
                return false;
            }

            const queue = this.distube.getQueue(guild);
            if (!queue) {
                console.log(`[CUSTOM-PLAYER] No queue found for guild: ${guildId}`);
                return false;
            }

            this.distube.stop(guild);
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
        
        const queue = this.distube.getQueue(guild);
        if (!queue) return [];
        
        return queue.songs || [];
    }

    getCurrentTrack(guildId) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return null;
        
        const queue = this.distube.getQueue(guild);
        if (!queue) return null;
        
        return queue.songs[0] || null;
    }

    isPlaying(guildId) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return false;
        
        const queue = this.distube.getQueue(guild);
        if (!queue) return false;
        
        return queue.playing || false;
    }

    isPaused(guildId) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return false;
        
        const queue = this.distube.getQueue(guild);
        if (!queue) return false;
        
        return queue.paused || false;
    }

    async pause(guildId) {
        try {
            const guild = this.client.guilds.cache.get(guildId);
            if (!guild) return false;

            const queue = this.distube.getQueue(guild);
            if (!queue) return false;

            this.distube.pause(guild);
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

            const queue = this.distube.getQueue(guild);
            if (!queue) return false;

            this.distube.resume(guild);
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

            const queue = this.distube.getQueue(guild);
            if (queue) {
                this.distube.stop(guild);
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

            const queue = this.distube.getQueue(guild);
            if (queue) {
                this.distube.voices.leave(guild);
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
