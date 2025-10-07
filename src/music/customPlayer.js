const { DisTube } = require('distube');
const { EmbedBuilder } = require('discord.js');

class CustomMusicPlayer {
    constructor(client) {
        this.client = client;
        
        // Initialize DisTube with YouTube cookies support
        this.distube = new DisTube(client, {
            emitNewSongOnly: false,
            leaveOnEmpty: true,
            leaveOnFinish: false,
            leaveOnStop: true,
            savePreviousSongs: true,
            searchSongs: 5,
            searchCooldown: 30,
            youtubeCookie: process.env.YOUTUBE_COOKIE,
            ytdlOptions: {
                highWaterMark: 1024 * 1024 * 64,
                quality: 'highestaudio',
                filter: 'audioonly',
                dlChunkSize: 0
            }
        });
        
        this.setupEvents();
        console.log('[CUSTOM-PLAYER] DisTube v5 initialized with YouTube cookies');
    }
    
    setupEvents() {
        this.distube.on('playSong', (queue, song) => {
            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('🎵 Now Playing')
                .setDescription(`**${song.name}**`)
                .setThumbnail(song.thumbnail)
                .addFields(
                    { name: '⏱️ Duration', value: song.formattedDuration, inline: true },
                    { name: '👤 Requested by', value: song.user.tag, inline: true },
                    { name: '📊 Queue', value: `${queue.songs.length} song(s)`, inline: true }
                )
                .setURL(song.url)
                .setTimestamp();
                
            queue.textChannel.send({ embeds: [embed] }).catch(console.error);
            console.log(`[DISTUBE] Now playing: ${song.name}`);
        });
        
        this.distube.on('addSong', (queue, song) => {
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('✅ Added to Queue')
                .setDescription(`**${song.name}**`)
                .setThumbnail(song.thumbnail)
                .addFields(
                    { name: '⏱️ Duration', value: song.formattedDuration, inline: true },
                    { name: '📍 Position', value: `${queue.songs.length}`, inline: true }
                )
                .setFooter({ text: `Requested by ${song.user.tag}` })
                .setTimestamp();
                
            queue.textChannel.send({ embeds: [embed] }).catch(console.error);
        });
        
        this.distube.on('finish', (queue) => {
            queue.textChannel.send('✅ Queue finished!').catch(console.error);
        });
        
        this.distube.on('error', (channel, error) => {
            console.error('[DISTUBE] Error:', error);
            if (channel) {
                channel.send(`❌ An error occurred: ${error.message}`).catch(console.error);
            }
        });
        
        this.distube.on('initQueue', (queue) => {
            queue.autoplay = false;
            queue.volume = 50;
        });
    }
    
    async addTrack(guildId, query, textChannel, user) {
        try {
            console.log(`[DISTUBE] Playing: ${query}`);
            
            const guild = this.client.guilds.cache.get(guildId);
            if (!guild) throw new Error('Guild not found');
            
            const member = guild.members.cache.get(user.id);
            const voiceChannel = member?.voice?.channel;
            
            if (!voiceChannel) {
                throw new Error('You must be in a voice channel!');
            }
            
            await this.distube.play(voiceChannel, query, {
                textChannel: textChannel,
                member: member
            });
            
            return true;
        } catch (error) {
            console.error('[DISTUBE] Failed to play:', error);
            throw error;
        }
    }
    
    async stop(guildId) {
        try {
            const queue = this.distube.getQueue(guildId);
            if (queue) {
                await this.distube.stop(guildId);
                return true;
            }
            return false;
        } catch (error) {
            console.error('[DISTUBE] Stop error:', error);
            return false;
        }
    }
    
    async pause(guildId) {
        try {
            const queue = this.distube.getQueue(guildId);
            if (queue && !queue.paused) {
                await this.distube.pause(guildId);
                return true;
            }
            return false;
        } catch (error) {
            console.error('[DISTUBE] Pause error:', error);
            return false;
        }
    }
    
    async resume(guildId) {
        try {
            const queue = this.distube.getQueue(guildId);
            if (queue && queue.paused) {
                await this.distube.resume(guildId);
                return true;
            }
            return false;
        } catch (error) {
            console.error('[DISTUBE] Resume error:', error);
            return false;
        }
    }
    
    async skip(guildId) {
        try {
            const queue = this.distube.getQueue(guildId);
            if (queue) {
                await this.distube.skip(guildId);
                return true;
            }
            return false;
        } catch (error) {
            console.error('[DISTUBE] Skip error:', error);
            return false;
        }
    }
    
    getQueue(guildId) {
        try {
            const queue = this.distube.getQueue(guildId);
            return queue ? queue.songs : [];
        } catch (error) {
            return [];
        }
    }
    
    getCurrentTrack(guildId) {
        try {
            const queue = this.distube.getQueue(guildId);
            return queue ? queue.songs[0] : null;
        } catch (error) {
            return null;
        }
    }
    
    isPlaying(guildId) {
        try {
            const queue = this.distube.getQueue(guildId);
            return queue ? queue.playing : false;
        } catch (error) {
            return false;
        }
    }
    
    isPaused(guildId) {
        try {
            const queue = this.distube.getQueue(guildId);
            return queue ? queue.paused : false;
        } catch (error) {
            return false;
        }
    }
    
    async leave(guildId) {
        try {
            const queue = this.distube.getQueue(guildId);
            if (queue) {
                await queue.voice.leave();
                return true;
            }
            return false;
        } catch (error) {
            console.error('[DISTUBE] Leave error:', error);
            return false;
        }
    }
}

module.exports = CustomMusicPlayer;
