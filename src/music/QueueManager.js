// ==========================================
// 🎵 NeuroVia Music System - Queue Manager
// ==========================================

const { EmbedBuilder } = require('discord.js');
const { logger } = require('../utils/logger');

class QueueManager {
    constructor(guildId, textChannel, musicManager) {
        this.guildId = guildId;
        this.textChannel = textChannel;
        this.musicManager = musicManager;
        
        this.tracks = [];
        this.currentTrack = null;
        this.currentIndex = -1;
        this.isPlaying = false;
        this.isPaused = false;
        this.isLooping = false;
        this.loopMode = 'none'; // 'none', 'track', 'queue'
        this.volume = 50;
        this.shuffled = false;
        this.originalOrder = [];
        
        console.log(`[QUEUE-MANAGER] Queue initialized for guild: ${guildId}`);
    }

    // ==========================================
    // Track Management
    // ==========================================

    addTrack(track) {
        try {
            console.log(`[QUEUE-MANAGER] Adding track: ${track.title}`);

            // Track doğrulama
            if (!track || !track.title || !track.url) {
                throw new Error('Invalid track data');
            }

            // Track'i kuyruğa ekle
            this.tracks.push(track);
            
            // Orijinal sırayı güncelle
            if (!this.shuffled) {
                this.originalOrder.push(track);
            }

            console.log(`[QUEUE-MANAGER] ✅ Track added. Queue size: ${this.tracks.length}`);
            return true;

        } catch (error) {
            console.error(`[QUEUE-MANAGER] Failed to add track:`, error);
            return false;
        }
    }

    addTracks(tracks) {
        try {
            console.log(`[QUEUE-MANAGER] Adding ${tracks.length} tracks`);

            let added = 0;
            for (const track of tracks) {
                if (this.addTrack(track)) {
                    added++;
                }
            }

            console.log(`[QUEUE-MANAGER] ✅ Added ${added}/${tracks.length} tracks`);
            return added;

        } catch (error) {
            console.error(`[QUEUE-MANAGER] Failed to add tracks:`, error);
            return 0;
        }
    }

    removeTrack(index) {
        try {
            console.log(`[QUEUE-MANAGER] Removing track at index: ${index}`);

            if (index < 0 || index >= this.tracks.length) {
                throw new Error('Invalid track index');
            }

            const removedTrack = this.tracks.splice(index, 1)[0];
            
            // Orijinal sırayı güncelle
            if (!this.shuffled) {
                const originalIndex = this.originalOrder.findIndex(t => t.url === removedTrack.url);
                if (originalIndex !== -1) {
                    this.originalOrder.splice(originalIndex, 1);
                }
            }

            // Current index'i güncelle
            if (index <= this.currentIndex) {
                this.currentIndex--;
            }

            console.log(`[QUEUE-MANAGER] ✅ Track removed: ${removedTrack.title}`);
            return removedTrack;

        } catch (error) {
            console.error(`[QUEUE-MANAGER] Failed to remove track:`, error);
            return null;
        }
    }

    getNextTrack() {
        try {
            console.log(`[QUEUE-MANAGER] Getting next track`);

            // Loop modu kontrolü
            if (this.loopMode === 'track' && this.currentTrack) {
                console.log(`[QUEUE-MANAGER] Looping current track: ${this.currentTrack.title}`);
                return this.currentTrack;
            }

            // Sıradaki track'i al
            this.currentIndex++;
            
            if (this.currentIndex >= this.tracks.length) {
                if (this.loopMode === 'queue' && this.tracks.length > 0) {
                    console.log(`[QUEUE-MANAGER] Looping queue from beginning`);
                    this.currentIndex = 0;
                } else {
                    console.log(`[QUEUE-MANAGER] No more tracks in queue`);
                    return null;
                }
            }

            const nextTrack = this.tracks[this.currentIndex];
            console.log(`[QUEUE-MANAGER] Next track: ${nextTrack.title}`);
            return nextTrack;

        } catch (error) {
            console.error(`[QUEUE-MANAGER] Failed to get next track:`, error);
            return null;
        }
    }

    skipTrack() {
        try {
            console.log(`[QUEUE-MANAGER] Skipping current track`);

            if (this.currentTrack) {
                console.log(`[QUEUE-MANAGER] Skipped: ${this.currentTrack.title}`);
            }

            // Current track'i temizle
            this.currentTrack = null;
            this.isPlaying = false;
            this.isPaused = false;

            return true;

        } catch (error) {
            console.error(`[QUEUE-MANAGER] Failed to skip track:`, error);
            return false;
        }
    }

    // ==========================================
    // Queue Controls
    // ==========================================

    clear() {
        try {
            console.log(`[QUEUE-MANAGER] Clearing queue`);

            this.tracks = [];
            this.originalOrder = [];
            this.currentTrack = null;
            this.currentIndex = -1;
            this.isPlaying = false;
            this.isPaused = false;

            console.log(`[QUEUE-MANAGER] ✅ Queue cleared`);
            return true;

        } catch (error) {
            console.error(`[QUEUE-MANAGER] Failed to clear queue:`, error);
            return false;
        }
    }

    shuffle() {
        try {
            console.log(`[QUEUE-MANAGER] Shuffling queue`);

            if (this.tracks.length <= 1) {
                console.log(`[QUEUE-MANAGER] Not enough tracks to shuffle`);
                return false;
            }

            // Fisher-Yates shuffle algoritması
            for (let i = this.tracks.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.tracks[i], this.tracks[j]] = [this.tracks[j], this.tracks[i]];
            }

            this.shuffled = true;
            console.log(`[QUEUE-MANAGER] ✅ Queue shuffled`);
            return true;

        } catch (error) {
            console.error(`[QUEUE-MANAGER] Failed to shuffle queue:`, error);
            return false;
        }
    }

    unshuffle() {
        try {
            console.log(`[QUEUE-MANAGER] Unshuffling queue`);

            if (!this.shuffled) {
                console.log(`[QUEUE-MANAGER] Queue is not shuffled`);
                return false;
            }

            // Orijinal sırayı geri yükle
            this.tracks = [...this.originalOrder];
            this.shuffled = false;

            console.log(`[QUEUE-MANAGER] ✅ Queue unshuffled`);
            return true;

        } catch (error) {
            console.error(`[QUEUE-MANAGER] Failed to unshuffle queue:`, error);
            return false;
        }
    }

    // ==========================================
    // Loop Controls
    // ==========================================

    setLoopMode(mode) {
        try {
            console.log(`[QUEUE-MANAGER] Setting loop mode: ${mode}`);

            const validModes = ['none', 'track', 'queue'];
            if (!validModes.includes(mode)) {
                throw new Error('Invalid loop mode');
            }

            this.loopMode = mode;
            this.isLooping = mode !== 'none';

            console.log(`[QUEUE-MANAGER] ✅ Loop mode set to: ${mode}`);
            return true;

        } catch (error) {
            console.error(`[QUEUE-MANAGER] Failed to set loop mode:`, error);
            return false;
        }
    }

    toggleLoop() {
        try {
            console.log(`[QUEUE-MANAGER] Toggling loop mode`);

            const modes = ['none', 'track', 'queue'];
            const currentIndex = modes.indexOf(this.loopMode);
            const nextIndex = (currentIndex + 1) % modes.length;
            
            return this.setLoopMode(modes[nextIndex]);

        } catch (error) {
            console.error(`[QUEUE-MANAGER] Failed to toggle loop:`, error);
            return false;
        }
    }

    // ==========================================
    // Volume Control
    // ==========================================

    setVolume(volume) {
        try {
            console.log(`[QUEUE-MANAGER] Setting volume: ${volume}%`);

            if (volume < 0 || volume > 100) {
                throw new Error('Volume must be between 0 and 100');
            }

            this.volume = volume;
            console.log(`[QUEUE-MANAGER] ✅ Volume set to: ${volume}%`);
            return true;

        } catch (error) {
            console.error(`[QUEUE-MANAGER] Failed to set volume:`, error);
            return false;
        }
    }

    // ==========================================
    // Status Management
    // ==========================================

    setCurrentTrack(track) {
        this.currentTrack = track;
        this.isPlaying = true;
        this.isPaused = false;
    }

    setPlaying(playing) {
        this.isPlaying = playing;
        if (playing) {
            this.isPaused = false;
        }
    }

    setPaused(paused) {
        this.isPaused = paused;
        if (paused) {
            this.isPlaying = false;
        }
    }

    // ==========================================
    // Information Getters
    // ==========================================

    getSize() {
        return this.tracks.length;
    }

    getCurrentTrack() {
        return this.currentTrack;
    }

    getTracks() {
        return [...this.tracks];
    }

    getTrack(index) {
        if (index >= 0 && index < this.tracks.length) {
            return this.tracks[index];
        }
        return null;
    }

    getUpcomingTracks(limit = 10) {
        const startIndex = this.currentIndex + 1;
        const endIndex = Math.min(startIndex + limit, this.tracks.length);
        return this.tracks.slice(startIndex, endIndex);
    }

    getPreviousTracks(limit = 5) {
        const startIndex = Math.max(0, this.currentIndex - limit);
        const endIndex = this.currentIndex;
        return this.tracks.slice(startIndex, endIndex);
    }

    // ==========================================
    // Queue Information
    // ==========================================

    getQueueInfo() {
        return {
            size: this.getSize(),
            currentTrack: this.currentTrack,
            currentIndex: this.currentIndex,
            isPlaying: this.isPlaying,
            isPaused: this.isPaused,
            isLooping: this.isLooping,
            loopMode: this.loopMode,
            volume: this.volume,
            shuffled: this.shuffled
        };
    }

    getQueueEmbed(page = 1, tracksPerPage = 10) {
        try {
            const totalPages = Math.ceil(this.tracks.length / tracksPerPage);
            const startIndex = (page - 1) * tracksPerPage;
            const endIndex = Math.min(startIndex + tracksPerPage, this.tracks.length);
            const pageTracks = this.tracks.slice(startIndex, endIndex);

            const embed = new EmbedBuilder()
                .setColor('#1db954')
                .setTitle('🎵 Müzik Kuyruğu')
                .setDescription(`**${this.tracks.length}** şarkı kuyrukta`)
                .setFooter({ text: `Sayfa ${page}/${totalPages} • ${this.isPlaying ? 'Çalıyor' : 'Duraklatıldı'}` })
                .setTimestamp();

            if (this.currentTrack) {
                embed.addFields({
                    name: '🎶 Şu Anda Çalan',
                    value: `**${this.currentTrack.title}**\n👤 ${this.currentTrack.author}\n⏱️ ${this.currentTrack.duration}`,
                    inline: false
                });
            }

            if (pageTracks.length > 0) {
                const trackList = pageTracks.map((track, index) => {
                    const position = startIndex + index + 1;
                    const emoji = position === this.currentIndex + 1 ? '▶️' : '🎵';
                    return `${emoji} **${position}.** ${track.title} - ${track.author}`;
                }).join('\n');

                embed.addFields({
                    name: '📋 Kuyruk',
                    value: trackList || 'Kuyruk boş',
                    inline: false
                });
            }

            return embed;

        } catch (error) {
            console.error(`[QUEUE-MANAGER] Failed to create queue embed:`, error);
            return null;
        }
    }

    // ==========================================
    // Statistics
    // ==========================================

    getStatistics() {
        return {
            totalTracks: this.tracks.length,
            currentIndex: this.currentIndex,
            isPlaying: this.isPlaying,
            isPaused: this.isPaused,
            loopMode: this.loopMode,
            volume: this.volume,
            shuffled: this.shuffled,
            uptime: process.uptime()
        };
    }
}

module.exports = QueueManager;
