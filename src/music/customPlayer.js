const { EmbedBuilder } = require('discord.js');
const { 
    joinVoiceChannel, 
    createAudioPlayer, 
    createAudioResource, 
    AudioPlayerStatus,
    VoiceConnectionStatus,
    entersState
} = require('@discordjs/voice');
const play = require('play-dl');

class CustomMusicPlayer {
    constructor(client) {
        this.client = client;
        this.queues = new Map(); // guildId -> { connection, player, songs: [], textChannel }
        
        console.log('[CUSTOM-PLAYER] Pure @discordjs/voice player initialized');
    }
    
    async addTrack(guildId, query, textChannel, user) {
        try {
            console.log(`[CUSTOM-PLAYER] Searching for: ${query}`);
            
            const guild = this.client.guilds.cache.get(guildId);
            if (!guild) throw new Error('Guild not found');
            
            const member = guild.members.cache.get(user.id);
            if (!member?.voice?.channel) {
                throw new Error('You must be in a voice channel!');
            }
            
            // Search YouTube
            const searched = await play.search(query, { limit: 1 });
            if (!searched || searched.length === 0) {
                throw new Error('No results found!');
            }
            
            const video = searched[0];
            const song = {
                title: video.title,
                url: video.url,
                duration: video.durationInSec,
                thumbnail: video.thumbnails[0]?.url,
                requester: user
            };
            
            // Get or create queue
            let queue = this.queues.get(guildId);
            
            if (!queue) {
                // Create voice connection
                const connection = joinVoiceChannel({
                    channelId: member.voice.channel.id,
                    guildId: guildId,
                    adapterCreator: guild.voiceAdapterCreator,
                    selfDeaf: true,
                    selfMute: false
                });
                
                console.log('[CUSTOM-PLAYER] Joining voice channel...');
                
                // Wait for connection to be ready
                try {
                    await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
                    console.log('[CUSTOM-PLAYER] Voice connection ready!');
                } catch (error) {
                    connection.destroy();
                    throw new Error(`Failed to join voice channel: ${error.message}`);
                }
                
                const player = createAudioPlayer();
                connection.subscribe(player);
                
                queue = {
                    connection,
                    player,
                    songs: [],
                    textChannel,
                    playing: false
                };
                
                this.queues.set(guildId, queue);
                
                // Player events
                player.on(AudioPlayerStatus.Idle, () => {
                    console.log('[CUSTOM-PLAYER] Song ended, playing next...');
                    queue.songs.shift();
                    if (queue.songs.length > 0) {
                        this.playSong(guildId);
                    } else {
                        queue.playing = false;
                        textChannel.send('✅ Queue finished!').catch(console.error);
                    }
                });
                
                player.on('error', error => {
                    console.error('[CUSTOM-PLAYER] Player error:', error);
                    queue.songs.shift();
                    if (queue.songs.length > 0) {
                        this.playSong(guildId);
                    }
                });
            }
            
            queue.songs.push(song);
            
            if (!queue.playing) {
                await this.playSong(guildId);
            } else {
                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('✅ Added to Queue')
                    .setDescription(`**${song.title}**`)
                    .addFields(
                        { name: 'Position', value: `${queue.songs.length}`, inline: true },
                        { name: 'Duration', value: `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}`, inline: true }
                    )
                    .setThumbnail(song.thumbnail)
                    .setFooter({ text: `Requested by ${user.tag}` });
                    
                textChannel.send({ embeds: [embed] }).catch(console.error);
            }
            
            return true;
        } catch (error) {
            console.error('[CUSTOM-PLAYER] Failed to add track:', error);
            throw error;
        }
    }
    
    async playSong(guildId) {
        const queue = this.queues.get(guildId);
        if (!queue || queue.songs.length === 0) return;
        
        const song = queue.songs[0];
        queue.playing = true;
        
        try {
            console.log(`[CUSTOM-PLAYER] Playing: ${song.title}`);
            
            const stream = await play.stream(song.url);
            const resource = createAudioResource(stream.stream, {
                inputType: stream.type,
                inlineVolume: true
            });
            
            resource.volume?.setVolume(0.5);
            queue.player.play(resource);
            
            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('🎵 Now Playing')
                .setDescription(`**${song.title}**`)
                .setThumbnail(song.thumbnail)
                .addFields(
                    { name: 'Duration', value: `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}`, inline: true },
                    { name: 'Requested by', value: song.requester.tag, inline: true }
                )
                .setURL(song.url);
                
            queue.textChannel.send({ embeds: [embed] }).catch(console.error);
            
        } catch (error) {
            console.error('[CUSTOM-PLAYER] Failed to play song:', error);
            queue.songs.shift();
            if (queue.songs.length > 0) {
                await this.playSong(guildId);
            } else {
                queue.playing = false;
            }
        }
    }
    
    async stop(guildId) {
        const queue = this.queues.get(guildId);
        if (!queue) return false;
        
        queue.songs = [];
        queue.player.stop();
        queue.connection.destroy();
        this.queues.delete(guildId);
        
        console.log(`[CUSTOM-PLAYER] Stopped and cleaned up ${guildId}`);
        return true;
    }
    
    getQueue(guildId) {
        const queue = this.queues.get(guildId);
        return queue?.songs || [];
    }
    
    getCurrentTrack(guildId) {
        const queue = this.queues.get(guildId);
        return queue?.songs[0] || null;
    }
    
    isPlaying(guildId) {
        const queue = this.queues.get(guildId);
        return queue?.playing || false;
    }
    
    async pause(guildId) {
        const queue = this.queues.get(guildId);
        if (!queue) return false;
        queue.player.pause();
        return true;
    }
    
    async resume(guildId) {
        const queue = this.queues.get(guildId);
        if (!queue) return false;
        queue.player.unpause();
        return true;
    }
    
    async leave(guildId) {
        return this.stop(guildId);
    }
}

module.exports = CustomMusicPlayer;
