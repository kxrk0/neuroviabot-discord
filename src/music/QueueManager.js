const { Collection } = require('discord.js');

/**
 * Modern Queue Manager
 * Müzik kuyruğu yönetimi ve track organizasyonu
 */
class QueueManager {
    constructor() {
        this.queues = new Collection();
        this.maxQueueSize = 100;
        this.maxHistorySize = 50;
        
        console.log('[QUEUE-MANAGER] Queue manager başlatıldı');
    }

    /**
     * Guild için kuyruk oluştur
     */
    createQueue(guildId) {
        if (this.queues.has(guildId)) {
            return this.queues.get(guildId);
        }

        const queue = {
            guildId,
            tracks: [],
            currentTrack: null,
            currentIndex: -1,
            history: [],
            loopMode: 'none', // none, track, queue
            shuffleMode: false,
            shuffleSeed: Math.random(),
            createdAt: new Date(),
            lastUpdated: new Date()
        };

        this.queues.set(guildId, queue);
        console.log(`[QUEUE-MANAGER] Kuyruk oluşturuldu: ${guildId}`);
        return queue;
    }

    /**
     * Guild kuyruğunu al
     */
    getQueue(guildId) {
        return this.queues.get(guildId) || this.createQueue(guildId);
    }

    /**
     * Kuyruğa track ekle
     */
    addTrack(guildId, track, position = -1) {
        try {
            const queue = this.getQueue(guildId);
            
            // Kuyruk boyutu kontrolü
            if (queue.tracks.length >= this.maxQueueSize) {
                throw new Error(`Kuyruk boyutu limiti aşıldı (${this.maxQueueSize})`);
            }

            // Track objesini oluştur
            const queueTrack = {
                ...track,
                id: track.id || `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                addedAt: new Date(),
                addedBy: track.addedBy || 'unknown',
                position: position === -1 ? queue.tracks.length : position
            };

            // Pozisyona göre ekle
            if (position === -1) {
                queue.tracks.push(queueTrack);
            } else {
                queue.tracks.splice(position, 0, queueTrack);
                // Pozisyonları güncelle
                queue.tracks.forEach((t, index) => {
                    t.position = index;
                });
            }

            queue.lastUpdated = new Date();
            console.log(`[QUEUE-MANAGER] Track eklendi: ${guildId} - ${queueTrack.title}`);
            return queueTrack;

        } catch (error) {
            console.error(`[QUEUE-MANAGER] Track ekleme hatası:`, error);
            throw error;
        }
    }

    /**
     * Kuyruğa playlist ekle
     */
    addPlaylist(guildId, playlist, addedBy = 'unknown') {
        try {
            const queue = this.getQueue(guildId);
            const addedTracks = [];

            for (const track of playlist.entries) {
                const queueTrack = this.addTrack(guildId, {
                    ...track,
                    addedBy
                });
                addedTracks.push(queueTrack);
            }

            console.log(`[QUEUE-MANAGER] Playlist eklendi: ${guildId} - ${addedTracks.length} track`);
            return addedTracks;

        } catch (error) {
            console.error(`[QUEUE-MANAGER] Playlist ekleme hatası:`, error);
            throw error;
        }
    }

    /**
     * Kuyruktan track kaldır
     */
    removeTrack(guildId, position) {
        try {
            const queue = this.getQueue(guildId);
            
            if (position < 0 || position >= queue.tracks.length) {
                throw new Error('Geçersiz pozisyon');
            }

            const removedTrack = queue.tracks.splice(position, 1)[0];
            
            // Pozisyonları güncelle
            queue.tracks.forEach((track, index) => {
                track.position = index;
            });

            queue.lastUpdated = new Date();
            console.log(`[QUEUE-MANAGER] Track kaldırıldı: ${guildId} - ${removedTrack.title}`);
            return removedTrack;

        } catch (error) {
            console.error(`[QUEUE-MANAGER] Track kaldırma hatası:`, error);
            throw error;
        }
    }

    /**
     * Kuyruğu temizle
     */
    clearQueue(guildId) {
        try {
            const queue = this.getQueue(guildId);
            const clearedCount = queue.tracks.length;
            
            queue.tracks = [];
            queue.currentTrack = null;
            queue.currentIndex = -1;
            queue.lastUpdated = new Date();

            console.log(`[QUEUE-MANAGER] Kuyruk temizlendi: ${guildId} - ${clearedCount} track`);
            return clearedCount;

        } catch (error) {
            console.error(`[QUEUE-MANAGER] Kuyruk temizleme hatası:`, error);
            throw error;
        }
    }

    /**
     * Sonraki track'i al
     */
    getNextTrack(guildId) {
        try {
            const queue = this.getQueue(guildId);
            
            if (queue.tracks.length === 0) {
                return null;
            }

            let nextIndex;
            
            if (queue.loopMode === 'track' && queue.currentTrack) {
                // Aynı track'i tekrar çal
                nextIndex = queue.currentIndex;
            } else if (queue.loopMode === 'queue' && queue.currentIndex >= queue.tracks.length - 1) {
                // Kuyruk sonuna gelindi, başa dön
                nextIndex = 0;
            } else {
                // Normal sırada sonraki track
                nextIndex = queue.currentIndex + 1;
            }

            if (nextIndex >= queue.tracks.length) {
                return null;
            }

            const nextTrack = queue.tracks[nextIndex];
            queue.currentIndex = nextIndex;
            queue.currentTrack = nextTrack;
            queue.lastUpdated = new Date();

            console.log(`[QUEUE-MANAGER] Sonraki track: ${guildId} - ${nextTrack.title}`);
            return nextTrack;

        } catch (error) {
            console.error(`[QUEUE-MANAGER] Sonraki track alma hatası:`, error);
            return null;
        }
    }

    /**
     * Önceki track'i al
     */
    getPreviousTrack(guildId) {
        try {
            const queue = this.getQueue(guildId);
            
            if (queue.tracks.length === 0 || queue.currentIndex <= 0) {
                return null;
            }

            const prevIndex = queue.currentIndex - 1;
            const prevTrack = queue.tracks[prevIndex];
            
            queue.currentIndex = prevIndex;
            queue.currentTrack = prevTrack;
            queue.lastUpdated = new Date();

            console.log(`[QUEUE-MANAGER] Önceki track: ${guildId} - ${prevTrack.title}`);
            return prevTrack;

        } catch (error) {
            console.error(`[QUEUE-MANAGER] Önceki track alma hatası:`, error);
            return null;
        }
    }

    /**
     * Track'i atla
     */
    skipTrack(guildId, count = 1) {
        try {
            const queue = this.getQueue(guildId);
            
            if (queue.tracks.length === 0) {
                return null;
            }

            // Mevcut track'i history'ye ekle
            if (queue.currentTrack) {
                queue.history.unshift(queue.currentTrack);
                
                // History boyutu kontrolü
                if (queue.history.length > this.maxHistorySize) {
                    queue.history.pop();
                }
            }

            // İleri git
            const newIndex = Math.min(queue.currentIndex + count, queue.tracks.length - 1);
            queue.currentIndex = newIndex;
            queue.currentTrack = queue.tracks[newIndex];
            queue.lastUpdated = new Date();

            console.log(`[QUEUE-MANAGER] Track atlandı: ${guildId} - ${count} adet`);
            return queue.currentTrack;

        } catch (error) {
            console.error(`[QUEUE-MANAGER] Track atlama hatası:`, error);
            return null;
        }
    }

    /**
     * Kuyruğu karıştır
     */
    shuffleQueue(guildId) {
        try {
            const queue = this.getQueue(guildId);
            
            if (queue.tracks.length <= 1) {
                return false;
            }

            // Fisher-Yates shuffle algoritması
            for (let i = queue.tracks.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [queue.tracks[i], queue.tracks[j]] = [queue.tracks[j], queue.tracks[i]];
            }

            // Pozisyonları güncelle
            queue.tracks.forEach((track, index) => {
                track.position = index;
            });

            queue.shuffleMode = true;
            queue.shuffleSeed = Math.random();
            queue.lastUpdated = new Date();

            console.log(`[QUEUE-MANAGER] Kuyruk karıştırıldı: ${guildId}`);
            return true;

        } catch (error) {
            console.error(`[QUEUE-MANAGER] Kuyruk karıştırma hatası:`, error);
            return false;
        }
    }

    /**
     * Loop modunu ayarla
     */
    setLoopMode(guildId, mode) {
        try {
            const queue = this.getQueue(guildId);
            
            if (!['none', 'track', 'queue'].includes(mode)) {
                throw new Error('Geçersiz loop modu');
            }

            queue.loopMode = mode;
            queue.lastUpdated = new Date();

            console.log(`[QUEUE-MANAGER] Loop modu ayarlandı: ${guildId} - ${mode}`);
            return true;

        } catch (error) {
            console.error(`[QUEUE-MANAGER] Loop modu ayarlama hatası:`, error);
            return false;
        }
    }

    /**
     * Kuyruk bilgilerini al
     */
    getQueueInfo(guildId) {
        const queue = this.getQueue(guildId);
        
        return {
            guildId: queue.guildId,
            totalTracks: queue.tracks.length,
            currentTrack: queue.currentTrack,
            currentIndex: queue.currentIndex,
            loopMode: queue.loopMode,
            shuffleMode: queue.shuffleMode,
            historySize: queue.history.length,
            createdAt: queue.createdAt,
            lastUpdated: queue.lastUpdated
        };
    }

    /**
     * Kuyruk listesini al
     */
    getQueueList(guildId, limit = 10) {
        const queue = this.getQueue(guildId);
        
        return {
            tracks: queue.tracks.slice(0, limit),
            totalTracks: queue.tracks.length,
            currentIndex: queue.currentIndex,
            hasMore: queue.tracks.length > limit
        };
    }

    /**
     * Sistem durumu
     */
    getStatus() {
        return {
            totalQueues: this.queues.size,
            maxQueueSize: this.maxQueueSize,
            maxHistorySize: this.maxHistorySize,
            queues: Array.from(this.queues.keys())
        };
    }

    /**
     * Guild kuyruğunu sil
     */
    deleteQueue(guildId) {
        if (this.queues.has(guildId)) {
            this.queues.delete(guildId);
            console.log(`[QUEUE-MANAGER] Kuyruk silindi: ${guildId}`);
            return true;
        }
        return false;
    }

    /**
     * Tüm kuyrukları temizle
     */
    cleanup() {
        this.queues.clear();
        console.log('[QUEUE-MANAGER] Tüm kuyruklar temizlendi');
    }
}

module.exports = QueueManager;
