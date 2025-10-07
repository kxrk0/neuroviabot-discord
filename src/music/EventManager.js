const { EventEmitter } = require('events');

/**
 * Modern Event Manager
 * Müzik sistemi event'lerini yönetir ve real-time güncellemeler sağlar
 */
class EventManager extends EventEmitter {
    constructor() {
        super();
        this.maxListeners = 20;
        this.setMaxListeners(this.maxListeners);
        
        console.log('[EVENT-MANAGER] Event manager başlatıldı');
    }

    /**
     * Track başladığında event emit et
     */
    emitTrackStart(guildId, track, queueInfo) {
        const eventData = {
            guildId,
            track,
            queueInfo,
            timestamp: new Date(),
            type: 'trackStart'
        };

        this.emit('trackStart', eventData);
        console.log(`[EVENT-MANAGER] Track başladı: ${guildId} - ${track.title}`);
    }

    /**
     * Track bittiğinde event emit et
     */
    emitTrackEnd(guildId, track, reason = 'finished') {
        const eventData = {
            guildId,
            track,
            reason,
            timestamp: new Date(),
            type: 'trackEnd'
        };

        this.emit('trackEnd', eventData);
        console.log(`[EVENT-MANAGER] Track bitti: ${guildId} - ${track.title} (${reason})`);
    }

    /**
     * Track duraklatıldığında event emit et
     */
    emitTrackPause(guildId, track) {
        const eventData = {
            guildId,
            track,
            timestamp: new Date(),
            type: 'trackPause'
        };

        this.emit('trackPause', eventData);
        console.log(`[EVENT-MANAGER] Track duraklatıldı: ${guildId} - ${track.title}`);
    }

    /**
     * Track devam ettirildiğinde event emit et
     */
    emitTrackResume(guildId, track) {
        const eventData = {
            guildId,
            track,
            timestamp: new Date(),
            type: 'trackResume'
        };

        this.emit('trackResume', eventData);
        console.log(`[EVENT-MANAGER] Track devam ettirildi: ${guildId} - ${track.title}`);
    }

    /**
     * Track atlandığında event emit et
     */
    emitTrackSkip(guildId, skippedTrack, nextTrack) {
        const eventData = {
            guildId,
            skippedTrack,
            nextTrack,
            timestamp: new Date(),
            type: 'trackSkip'
        };

        this.emit('trackSkip', eventData);
        console.log(`[EVENT-MANAGER] Track atlandı: ${guildId} - ${skippedTrack.title} -> ${nextTrack?.title || 'Sonraki yok'}`);
    }

    /**
     * Kuyruğa track eklendiğinde event emit et
     */
    emitTrackAdd(guildId, track, position) {
        const eventData = {
            guildId,
            track,
            position,
            timestamp: new Date(),
            type: 'trackAdd'
        };

        this.emit('trackAdd', eventData);
        console.log(`[EVENT-MANAGER] Track eklendi: ${guildId} - ${track.title} (pozisyon: ${position})`);
    }

    /**
     * Kuyruktan track kaldırıldığında event emit et
     */
    emitTrackRemove(guildId, track, position) {
        const eventData = {
            guildId,
            track,
            position,
            timestamp: new Date(),
            type: 'trackRemove'
        };

        this.emit('trackRemove', eventData);
        console.log(`[EVENT-MANAGER] Track kaldırıldı: ${guildId} - ${track.title} (pozisyon: ${position})`);
    }

    /**
     * Kuyruk temizlendiğinde event emit et
     */
    emitQueueClear(guildId, clearedCount) {
        const eventData = {
            guildId,
            clearedCount,
            timestamp: new Date(),
            type: 'queueClear'
        };

        this.emit('queueClear', eventData);
        console.log(`[EVENT-MANAGER] Kuyruk temizlendi: ${guildId} - ${clearedCount} track`);
    }

    /**
     * Loop modu değiştiğinde event emit et
     */
    emitLoopModeChange(guildId, oldMode, newMode) {
        const eventData = {
            guildId,
            oldMode,
            newMode,
            timestamp: new Date(),
            type: 'loopModeChange'
        };

        this.emit('loopModeChange', eventData);
        console.log(`[EVENT-MANAGER] Loop modu değişti: ${guildId} - ${oldMode} -> ${newMode}`);
    }

    /**
     * Shuffle modu değiştiğinde event emit et
     */
    emitShuffleModeChange(guildId, enabled) {
        const eventData = {
            guildId,
            enabled,
            timestamp: new Date(),
            type: 'shuffleModeChange'
        };

        this.emit('shuffleModeChange', eventData);
        console.log(`[EVENT-MANAGER] Shuffle modu değişti: ${guildId} - ${enabled ? 'Açık' : 'Kapalı'}`);
    }

    /**
     * Ses seviyesi değiştiğinde event emit et
     */
    emitVolumeChange(guildId, oldVolume, newVolume) {
        const eventData = {
            guildId,
            oldVolume,
            newVolume,
            timestamp: new Date(),
            type: 'volumeChange'
        };

        this.emit('volumeChange', eventData);
        console.log(`[EVENT-MANAGER] Ses seviyesi değişti: ${guildId} - ${oldVolume}% -> ${newVolume}%`);
    }

    /**
     * Voice channel'a bağlanıldığında event emit et
     */
    emitVoiceConnect(guildId, voiceChannelId, textChannelId) {
        const eventData = {
            guildId,
            voiceChannelId,
            textChannelId,
            timestamp: new Date(),
            type: 'voiceConnect'
        };

        this.emit('voiceConnect', eventData);
        console.log(`[EVENT-MANAGER] Voice channel'a bağlanıldı: ${guildId} - ${voiceChannelId}`);
    }

    /**
     * Voice channel'dan ayrıldığında event emit et
     */
    emitVoiceDisconnect(guildId, reason = 'manual') {
        const eventData = {
            guildId,
            reason,
            timestamp: new Date(),
            type: 'voiceDisconnect'
        };

        this.emit('voiceDisconnect', eventData);
        console.log(`[EVENT-MANAGER] Voice channel'dan ayrıldı: ${guildId} - ${reason}`);
    }

    /**
     * Hata oluştuğunda event emit et
     */
    emitError(guildId, error, context = '') {
        const eventData = {
            guildId,
            error: {
                message: error.message,
                stack: error.stack,
                name: error.name
            },
            context,
            timestamp: new Date(),
            type: 'error'
        };

        this.emit('error', eventData);
        console.error(`[EVENT-MANAGER] Hata oluştu: ${guildId} - ${error.message} (${context})`);
    }

    /**
     * Sistem durumu değiştiğinde event emit et
     */
    emitSystemStatusChange(status) {
        const eventData = {
            status,
            timestamp: new Date(),
            type: 'systemStatusChange'
        };

        this.emit('systemStatusChange', eventData);
        console.log(`[EVENT-MANAGER] Sistem durumu değişti: ${JSON.stringify(status)}`);
    }

    /**
     * Real-time güncelleme gönder
     */
    emitRealtimeUpdate(guildId, eventType, data) {
        const eventData = {
            guildId,
            eventType,
            data,
            timestamp: new Date(),
            type: 'realtimeUpdate'
        };

        this.emit('realtimeUpdate', eventData);
        
        // Global realtime updates sistemine gönder
        if (global.realtimeUpdates) {
            global.realtimeUpdates.broadcastToGuild(guildId, `music_${eventType}`, data);
        }
    }

    /**
     * Event listener'ları temizle
     */
    cleanup() {
        this.removeAllListeners();
        console.log('[EVENT-MANAGER] Tüm event listener\'lar temizlendi');
    }

    /**
     * Sistem durumu
     */
    getStatus() {
        return {
            maxListeners: this.maxListeners,
            listenerCount: this.listenerCount(),
            eventNames: this.eventNames()
        };
    }
}

module.exports = EventManager;
