// ==========================================
// 🎵 NeuroVia Music System - Event Handler
// ==========================================

const { EmbedBuilder } = require('discord.js');
const { AudioPlayerStatus } = require('@discordjs/voice');
const { logger } = require('../utils/logger');

class EventHandler {
    constructor(musicManager) {
        this.musicManager = musicManager;
        this.events = new Map();
        
        console.log('[EVENT-HANDLER] ✅ Event handler initialized');
    }

    // ==========================================
    // Event Listener Setup
    // ==========================================

    setupEventListeners() {
        try {
            console.log('[EVENT-HANDLER] Setting up event listeners');

            // Audio player event listeners
            this.setupAudioPlayerListeners();
            
            // Voice connection event listeners
            this.setupVoiceConnectionListeners();
            
            // Queue event listeners
            this.setupQueueListeners();

            console.log('[EVENT-HANDLER] ✅ Event listeners setup completed');

        } catch (error) {
            console.error('[EVENT-HANDLER] Failed to setup event listeners:', error);
        }
    }

    setupAudioPlayerListeners() {
        try {
            console.log('[EVENT-HANDLER] Setting up audio player listeners');

            // Her guild için audio player listener'ları kur
            for (const [guildId, player] of this.musicManager.players) {
                this.setupPlayerListeners(guildId, player);
            }

        } catch (error) {
            console.error('[EVENT-HANDLER] Failed to setup audio player listeners:', error);
        }
    }

    setupPlayerListeners(guildId, player) {
        try {
            console.log(`[EVENT-HANDLER] Setting up listeners for guild: ${guildId}`);

            // Track başladığında
            player.on(AudioPlayerStatus.Playing, () => {
                console.log(`[EVENT-HANDLER] Track started playing: ${guildId}`);
                this.emit('trackStart', { guildId, player });
            });

            // Track duraklatıldığında
            player.on(AudioPlayerStatus.Paused, () => {
                console.log(`[EVENT-HANDLER] Track paused: ${guildId}`);
                this.emit('trackPause', { guildId, player });
            });

            // Track bittiğinde
            player.on(AudioPlayerStatus.Idle, () => {
                console.log(`[EVENT-HANDLER] Track finished: ${guildId}`);
                this.emit('trackEnd', { guildId, player });
                
                // Sıradaki track'i çal
                setTimeout(() => {
                    this.musicManager.playNext(guildId);
                }, 1000);
            });

            // Hata durumunda
            player.on('error', (error) => {
                console.error(`[EVENT-HANDLER] Player error: ${guildId}`, error);
                this.emit('playerError', { guildId, player, error });
                
                // Hata durumunda sıradaki track'e geç
                setTimeout(() => {
                    this.musicManager.playNext(guildId);
                }, 2000);
            });

        } catch (error) {
            console.error(`[EVENT-HANDLER] Failed to setup player listeners for guild ${guildId}:`, error);
        }
    }

    setupVoiceConnectionListeners() {
        try {
            console.log('[EVENT-HANDLER] Setting up voice connection listeners');

            // Her guild için voice connection listener'ları kur
            for (const [guildId, connection] of this.musicManager.connections) {
                this.setupConnectionListeners(guildId, connection);
            }

        } catch (error) {
            console.error('[EVENT-HANDLER] Failed to setup voice connection listeners:', error);
        }
    }

    setupConnectionListeners(guildId, connection) {
        try {
            console.log(`[EVENT-HANDLER] Setting up connection listeners for guild: ${guildId}`);

            // Bağlantı hazır olduğunda
            connection.on('stateChange', (oldState, newState) => {
                console.log(`[EVENT-HANDLER] Connection state changed: ${guildId} (${oldState.status} -> ${newState.status})`);
                this.emit('connectionStateChange', { guildId, oldState, newState });
            });

            // Bağlantı kesildiğinde
            connection.on('disconnect', () => {
                console.log(`[EVENT-HANDLER] Connection disconnected: ${guildId}`);
                this.emit('connectionDisconnect', { guildId });
                
                // Guild'i temizle
                this.musicManager.cleanupGuild(guildId);
            });

            // Hata durumunda
            connection.on('error', (error) => {
                console.error(`[EVENT-HANDLER] Connection error: ${guildId}`, error);
                this.emit('connectionError', { guildId, error });
            });

        } catch (error) {
            console.error(`[EVENT-HANDLER] Failed to setup connection listeners for guild ${guildId}:`, error);
        }
    }

    setupQueueListeners() {
        try {
            console.log('[EVENT-HANDLER] Setting up queue listeners');

            // Her guild için queue listener'ları kur
            for (const [guildId, queue] of this.musicManager.queues) {
                this.setupQueueListenersForGuild(guildId, queue);
            }

        } catch (error) {
            console.error('[EVENT-HANDLER] Failed to setup queue listeners:', error);
        }
    }

    setupQueueListenersForGuild(guildId, queue) {
        try {
            console.log(`[EVENT-HANDLER] Setting up queue listeners for guild: ${guildId}`);

            // Queue boşaldığında
            if (queue.getSize() === 0) {
                this.emit('queueEmpty', { guildId, queue });
            }

            // Queue dolu olduğunda
            if (queue.getSize() > 50) {
                this.emit('queueFull', { guildId, queue });
            }

        } catch (error) {
            console.error(`[EVENT-HANDLER] Failed to setup queue listeners for guild ${guildId}:`, error);
        }
    }

    // ==========================================
    // Event Emission
    // ==========================================

    emit(eventName, data) {
        try {
            console.log(`[EVENT-HANDLER] Emitting event: ${eventName}`);

            // Event listener'ları çağır
            const listeners = this.events.get(eventName) || [];
            for (const listener of listeners) {
                try {
                    listener(data);
                } catch (error) {
                    console.error(`[EVENT-HANDLER] Error in event listener for ${eventName}:`, error);
                }
            }

            // Özel event handler'ları çağır
            this.handleSpecialEvents(eventName, data);

        } catch (error) {
            console.error(`[EVENT-HANDLER] Failed to emit event ${eventName}:`, error);
        }
    }

    handleSpecialEvents(eventName, data) {
        try {
            switch (eventName) {
                case 'trackStart':
                    this.handleTrackStart(data);
                    break;
                case 'trackEnd':
                    this.handleTrackEnd(data);
                    break;
                case 'playerError':
                    this.handlePlayerError(data);
                    break;
                case 'connectionDisconnect':
                    this.handleConnectionDisconnect(data);
                    break;
                case 'queueEmpty':
                    this.handleQueueEmpty(data);
                    break;
                default:
                    // Özel işlem gerekmiyor
                    break;
            }

        } catch (error) {
            console.error(`[EVENT-HANDLER] Failed to handle special event ${eventName}:`, error);
        }
    }

    handleTrackStart(data) {
        try {
            const { guildId, player } = data;
            const queue = this.musicManager.getQueue(guildId);
            const currentTrack = queue ? queue.getCurrentTrack() : null;

            if (currentTrack) {
                console.log(`[EVENT-HANDLER] 🎵 Now playing: ${currentTrack.title}`);
                
                // Real-time güncelleme gönder
                this.sendNowPlayingUpdate(guildId, currentTrack);
            }

        } catch (error) {
            console.error('[EVENT-HANDLER] Failed to handle track start:', error);
        }
    }

    handleTrackEnd(data) {
        try {
            const { guildId, player } = data;
            const queue = this.musicManager.getQueue(guildId);
            const currentTrack = queue ? queue.getCurrentTrack() : null;

            if (currentTrack) {
                console.log(`[EVENT-HANDLER] 🎵 Finished playing: ${currentTrack.title}`);
                
                // Track bitiş güncellemesi gönder
                this.sendTrackEndUpdate(guildId, currentTrack);
            }

        } catch (error) {
            console.error('[EVENT-HANDLER] Failed to handle track end:', error);
        }
    }

    handlePlayerError(data) {
        try {
            const { guildId, player, error } = data;
            console.error(`[EVENT-HANDLER] 🎵❌ Player error in guild ${guildId}:`, error);

            // Hata güncellemesi gönder
            this.sendErrorUpdate(guildId, error);

        } catch (error) {
            console.error('[EVENT-HANDLER] Failed to handle player error:', error);
        }
    }

    handleConnectionDisconnect(data) {
        try {
            const { guildId } = data;
            console.log(`[EVENT-HANDLER] 🔌 Connection disconnected: ${guildId}`);

            // Bağlantı kesilme güncellemesi gönder
            this.sendDisconnectUpdate(guildId);

        } catch (error) {
            console.error('[EVENT-HANDLER] Failed to handle connection disconnect:', error);
        }
    }

    handleQueueEmpty(data) {
        try {
            const { guildId, queue } = data;
            console.log(`[EVENT-HANDLER] 📋 Queue empty: ${guildId}`);

            // Kuyruk boş güncellemesi gönder
            this.sendQueueEmptyUpdate(guildId);

        } catch (error) {
            console.error('[EVENT-HANDLER] Failed to handle queue empty:', error);
        }
    }

    // ==========================================
    // Update Notifications
    // ==========================================

    sendNowPlayingUpdate(guildId, track) {
        try {
            const queue = this.musicManager.getQueue(guildId);
            if (!queue || !queue.textChannel) {
                return;
            }

            const embed = new EmbedBuilder()
                .setColor('#1db954')
                .setTitle('🎵 Şimdi Çalıyor')
                .setDescription(`**${track.title}**`)
                .addFields(
                    { name: '👤 Sanatçı', value: track.author, inline: true },
                    { name: '⏱️ Süre', value: track.duration, inline: true },
                    { name: '🔗 Kaynak', value: 'YouTube', inline: true }
                )
                .setTimestamp();

            if (track.thumbnail) {
                embed.setThumbnail(track.thumbnail);
            }

            queue.textChannel.send({ embeds: [embed] }).catch(console.error);

        } catch (error) {
            console.error('[EVENT-HANDLER] Failed to send now playing update:', error);
        }
    }

    sendTrackEndUpdate(guildId, track) {
        try {
            const queue = this.musicManager.getQueue(guildId);
            if (!queue || !queue.textChannel) {
                return;
            }

            const embed = new EmbedBuilder()
                .setColor('#ffa500')
                .setTitle('✅ Şarkı Bitti')
                .setDescription(`**${track.title}** çalma tamamlandı`)
                .setTimestamp();

            queue.textChannel.send({ embeds: [embed] }).catch(console.error);

        } catch (error) {
            console.error('[EVENT-HANDLER] Failed to send track end update:', error);
        }
    }

    sendErrorUpdate(guildId, error) {
        try {
            const queue = this.musicManager.getQueue(guildId);
            if (!queue || !queue.textChannel) {
                return;
            }

            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Müzik Hatası')
                .setDescription('Şarkı çalınırken bir hata oluştu. Sıradaki şarkıya geçiliyor...')
                .addFields({
                    name: '🔧 Hata Detayı',
                    value: `\`\`\`${error.message || 'Bilinmeyen hata'}\`\`\``
                })
                .setTimestamp();

            queue.textChannel.send({ embeds: [embed] }).catch(console.error);

        } catch (error) {
            console.error('[EVENT-HANDLER] Failed to send error update:', error);
        }
    }

    sendDisconnectUpdate(guildId) {
        try {
            const queue = this.musicManager.getQueue(guildId);
            if (!queue || !queue.textChannel) {
                return;
            }

            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('🔌 Bağlantı Kesildi')
                .setDescription('Sesli kanal bağlantısı kesildi. Müzik durduruldu.')
                .setTimestamp();

            queue.textChannel.send({ embeds: [embed] }).catch(console.error);

        } catch (error) {
            console.error('[EVENT-HANDLER] Failed to send disconnect update:', error);
        }
    }

    sendQueueEmptyUpdate(guildId) {
        try {
            const queue = this.musicManager.getQueue(guildId);
            if (!queue || !queue.textChannel) {
                return;
            }

            const embed = new EmbedBuilder()
                .setColor('#ffa500')
                .setTitle('📋 Kuyruk Boş')
                .setDescription('Tüm şarkılar çalındı. Yeni şarkı eklemek için `/play` komutunu kullanın.')
                .setTimestamp();

            queue.textChannel.send({ embeds: [embed] }).catch(console.error);

        } catch (error) {
            console.error('[EVENT-HANDLER] Failed to send queue empty update:', error);
        }
    }

    // ==========================================
    // Event Listener Management
    // ==========================================

    on(eventName, listener) {
        try {
            if (!this.events.has(eventName)) {
                this.events.set(eventName, []);
            }

            this.events.get(eventName).push(listener);
            console.log(`[EVENT-HANDLER] Event listener added: ${eventName}`);

        } catch (error) {
            console.error(`[EVENT-HANDLER] Failed to add event listener for ${eventName}:`, error);
        }
    }

    off(eventName, listener) {
        try {
            const listeners = this.events.get(eventName);
            if (listeners) {
                const index = listeners.indexOf(listener);
                if (index !== -1) {
                    listeners.splice(index, 1);
                    console.log(`[EVENT-HANDLER] Event listener removed: ${eventName}`);
                }
            }

        } catch (error) {
            console.error(`[EVENT-HANDLER] Failed to remove event listener for ${eventName}:`, error);
        }
    }

    // ==========================================
    // Statistics
    // ==========================================

    getStatistics() {
        return {
            totalEvents: this.events.size,
            eventTypes: Array.from(this.events.keys()),
            uptime: process.uptime()
        };
    }
}

module.exports = EventHandler;
