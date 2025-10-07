// ==========================================
// 🎵 NeuroVia Music System - Stream Extractor
// ==========================================

const ytdl = require('ytdl-core');
const { logger } = require('../utils/logger');

class StreamExtractor {
    constructor() {
        this.cache = new Map(); // URL -> TrackInfo cache
        this.cacheTimeout = 300000; // 5 dakika
        this.maxRetries = 3;
        this.retryDelay = 1000;
        
        console.log('[STREAM-EXTRACTOR] ✅ YouTube stream extractor initialized');
    }

    // ==========================================
    // Track Information Extraction
    // ==========================================

    async extractTrackInfo(query) {
        try {
            console.log(`[STREAM-EXTRACTOR] Extracting track info: ${query}`);

            // Cache kontrolü
            const cached = this.getCachedInfo(query);
            if (cached) {
                console.log(`[STREAM-EXTRACTOR] Using cached info: ${cached.title}`);
                return cached;
            }

            // URL doğrulama
            if (!this.isValidYouTubeURL(query)) {
                throw new Error('Invalid YouTube URL');
            }

            // Video bilgilerini çıkar
            const videoInfo = await this.getVideoInfo(query);
            if (!videoInfo) {
                throw new Error('Failed to get video information');
            }

            // Track bilgilerini oluştur
            const trackInfo = {
                title: videoInfo.videoDetails.title,
                author: videoInfo.videoDetails.author?.name || 'Bilinmiyor',
                duration: this.formatDuration(videoInfo.videoDetails.lengthSeconds),
                durationSeconds: parseInt(videoInfo.videoDetails.lengthSeconds) || 0,
                url: query,
                thumbnail: this.getBestThumbnail(videoInfo.videoDetails.thumbnails),
                views: parseInt(videoInfo.videoDetails.viewCount) || 0,
                uploadDate: videoInfo.videoDetails.uploadDate,
                description: videoInfo.videoDetails.description,
                channel: {
                    name: videoInfo.videoDetails.author?.name,
                    url: videoInfo.videoDetails.author?.channel_url,
                    verified: videoInfo.videoDetails.author?.verified
                }
            };

            // Cache'e kaydet
            this.setCachedInfo(query, trackInfo);

            console.log(`[STREAM-EXTRACTOR] ✅ Track info extracted: ${trackInfo.title}`);
            return trackInfo;

        } catch (error) {
            console.error(`[STREAM-EXTRACTOR] Failed to extract track info:`, error);
            throw error;
        }
    }

    async getVideoInfo(url) {
        let lastError;
        
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                console.log(`[STREAM-EXTRACTOR] Getting video info (attempt ${attempt}/${this.maxRetries})`);

                const videoInfo = await ytdl.getInfo(url, {
                    requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                        }
                    }
                });

                return videoInfo;

            } catch (error) {
                lastError = error;
                console.warn(`[STREAM-EXTRACTOR] Attempt ${attempt} failed:`, error.message);
                
                if (attempt < this.maxRetries) {
                    await this.delay(this.retryDelay * attempt);
                }
            }
        }

        throw lastError;
    }

    // ==========================================
    // Stream Creation
    // ==========================================

    async createStream(url) {
        try {
            console.log(`[STREAM-EXTRACTOR] Creating stream: ${url}`);

            let lastError;
            
            for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
                try {
                    console.log(`[STREAM-EXTRACTOR] Creating stream (attempt ${attempt}/${this.maxRetries})`);

                    const stream = ytdl(url, {
                        filter: 'audioonly',
                        quality: 'highestaudio',
                        highWaterMark: 1 << 25, // 32MB buffer
                        requestOptions: {
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                            }
                        }
                    });

                    // Stream hata yakalama
                    stream.on('error', (error) => {
                        console.error(`[STREAM-EXTRACTOR] Stream error:`, error);
                    });

                    // Stream başarılı
                    console.log(`[STREAM-EXTRACTOR] ✅ Stream created successfully`);
                    return stream;

                } catch (error) {
                    lastError = error;
                    console.warn(`[STREAM-EXTRACTOR] Stream attempt ${attempt} failed:`, error.message);
                    
                    if (attempt < this.maxRetries) {
                        await this.delay(this.retryDelay * attempt);
                    }
                }
            }

            throw lastError;

        } catch (error) {
            console.error(`[STREAM-EXTRACTOR] Failed to create stream:`, error);
            throw error;
        }
    }

    // ==========================================
    // URL Validation
    // ==========================================

    isValidYouTubeURL(url) {
        if (!url || typeof url !== 'string') {
            return false;
        }

        const patterns = [
            /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
            /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/,
            /^https?:\/\/(www\.)?youtube\.com\/v\/[\w-]+/,
            /^https?:\/\/youtu\.be\/[\w-]+/,
            /^https?:\/\/(www\.)?youtube\.com\/playlist\?list=[\w-]+/
        ];

        return patterns.some(pattern => pattern.test(url));
    }

    // ==========================================
    // Utility Functions
    // ==========================================

    formatDuration(seconds) {
        if (!seconds || isNaN(seconds)) {
            return 'Bilinmiyor';
        }

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
        }
    }

    getBestThumbnail(thumbnails) {
        if (!thumbnails || !Array.isArray(thumbnails)) {
            return null;
        }

        // En yüksek çözünürlüklü thumbnail'i seç
        const sorted = thumbnails.sort((a, b) => {
            const aSize = (a.width || 0) * (a.height || 0);
            const bSize = (b.width || 0) * (b.height || 0);
            return bSize - aSize;
        });

        return sorted[0]?.url || null;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ==========================================
    // Cache Management
    // ==========================================

    getCachedInfo(url) {
        const cached = this.cache.get(url);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        
        if (cached) {
            this.cache.delete(url);
        }
        
        return null;
    }

    setCachedInfo(url, data) {
        this.cache.set(url, {
            data: data,
            timestamp: Date.now()
        });

        // Cache temizliği
        if (this.cache.size > 100) {
            this.cleanupCache();
        }
    }

    cleanupCache() {
        const now = Date.now();
        for (const [url, cached] of this.cache) {
            if (now - cached.timestamp > this.cacheTimeout) {
                this.cache.delete(url);
            }
        }
    }

    // ==========================================
    // Statistics
    // ==========================================

    getStatistics() {
        return {
            cacheSize: this.cache.size,
            maxRetries: this.maxRetries,
            cacheTimeout: this.cacheTimeout
        };
    }
}

module.exports = StreamExtractor;
