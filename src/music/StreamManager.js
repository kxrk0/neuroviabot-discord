const ytdlp = require('yt-dlp-wrap');
const { createReadStream } = require('fs');
const { pipeline } = require('stream');
const { promisify } = require('util');
const pipelineAsync = promisify(pipeline);

/**
 * Modern Stream Manager - yt-dlp tabanlı
 * YouTube stream extraction ve audio processing
 */
class StreamManager {
    constructor() {
        this.ytdlp = new ytdlp();
        this.cache = new Map();
        this.maxCacheSize = 100;
        this.cacheTimeout = 300000; // 5 dakika
        
        console.log('[STREAM-MANAGER] yt-dlp tabanlı stream manager başlatıldı');
    }

    /**
     * YouTube URL'den track bilgilerini al
     */
    async getTrackInfo(url) {
        try {
            // Cache kontrolü
            const cacheKey = `info_${url}`;
            if (this.cache.has(cacheKey)) {
                const cached = this.cache.get(cacheKey);
                if (Date.now() - cached.timestamp < this.cacheTimeout) {
                    return cached.data;
                }
            }

            console.log(`[STREAM-MANAGER] Track bilgileri alınıyor: ${url}`);

            const info = await this.ytdlp.getVideoInfo(url);
            
            const trackInfo = {
                id: info.id,
                title: info.title,
                url: info.webpage_url || url,
                duration: info.duration || 0,
                thumbnail: info.thumbnail,
                uploader: info.uploader,
                uploader_url: info.uploader_url,
                view_count: info.view_count,
                like_count: info.like_count,
                description: info.description,
                format: info.format,
                filesize: info.filesize,
                fps: info.fps,
                vcodec: info.vcodec,
                acodec: info.acodec,
                abr: info.abr,
                vbr: info.vbr,
                tbr: info.tbr,
                ext: info.ext,
                resolution: info.resolution,
                aspect_ratio: info.aspect_ratio,
                fps: info.fps,
                vcodec: info.vcodec,
                acodec: info.acodec,
                abr: info.abr,
                vbr: info.vbr,
                tbr: info.tbr,
                ext: info.ext,
                resolution: info.resolution,
                aspect_ratio: info.aspect_ratio
            };

            // Cache'e kaydet
            this.cache.set(cacheKey, {
                data: trackInfo,
                timestamp: Date.now()
            });

            // Cache temizleme
            this.cleanupCache();

            console.log(`[STREAM-MANAGER] Track bilgileri alındı: ${trackInfo.title}`);
            return trackInfo;

        } catch (error) {
            console.error(`[STREAM-MANAGER] Track bilgisi alma hatası:`, error);
            throw new Error(`Track bilgisi alınamadı: ${error.message}`);
        }
    }

    /**
     * YouTube URL'den audio stream oluştur
     */
    async createAudioStream(url, options = {}) {
        try {
            console.log(`[STREAM-MANAGER] Audio stream oluşturuluyor: ${url}`);

            const streamOptions = {
                format: 'bestaudio[ext=m4a]/bestaudio/best',
                output: '-',
                noPlaylist: true,
                ...options
            };

            const stream = await this.ytdlp.execStream([
                url,
                ...this.buildArgs(streamOptions)
            ]);

            console.log(`[STREAM-MANAGER] Audio stream oluşturuldu: ${url}`);
            return stream;

        } catch (error) {
            console.error(`[STREAM-MANAGER] Audio stream oluşturma hatası:`, error);
            throw new Error(`Audio stream oluşturulamadı: ${error.message}`);
        }
    }

    /**
     * YouTube playlist bilgilerini al
     */
    async getPlaylistInfo(url) {
        try {
            console.log(`[STREAM-MANAGER] Playlist bilgileri alınıyor: ${url}`);

            const info = await this.ytdlp.getPlaylistInfo(url);
            
            const playlistInfo = {
                id: info.id,
                title: info.title,
                url: info.webpage_url || url,
                uploader: info.uploader,
                uploader_url: info.uploader_url,
                description: info.description,
                entries: info.entries || [],
                entry_count: info.entry_count || 0
            };

            console.log(`[STREAM-MANAGER] Playlist bilgileri alındı: ${playlistInfo.title} (${playlistInfo.entry_count} şarkı)`);
            return playlistInfo;

        } catch (error) {
            console.error(`[STREAM-MANAGER] Playlist bilgisi alma hatası:`, error);
            throw new Error(`Playlist bilgisi alınamadı: ${error.message}`);
        }
    }

    /**
     * YouTube arama yap
     */
    async search(query, limit = 10) {
        try {
            console.log(`[STREAM-MANAGER] Arama yapılıyor: ${query}`);

            const results = await this.ytdlp.exec([
                `ytsearch${limit}:${query}`,
                '--get-title',
                '--get-url',
                '--get-duration',
                '--get-thumbnail',
                '--get-uploader'
            ]);

            const tracks = [];
            for (let i = 0; i < results.length; i += 5) {
                if (i + 4 < results.length) {
                    tracks.push({
                        title: results[i],
                        url: results[i + 1],
                        duration: results[i + 2],
                        thumbnail: results[i + 3],
                        uploader: results[i + 4]
                    });
                }
            }

            console.log(`[STREAM-MANAGER] Arama tamamlandı: ${tracks.length} sonuç`);
            return tracks;

        } catch (error) {
            console.error(`[STREAM-MANAGER] Arama hatası:`, error);
            throw new Error(`Arama yapılamadı: ${error.message}`);
        }
    }

    /**
     * yt-dlp argümanlarını oluştur
     */
    buildArgs(options) {
        const args = [];
        
        if (options.format) {
            args.push('-f', options.format);
        }
        
        if (options.output) {
            args.push('-o', options.output);
        }
        
        if (options.noPlaylist) {
            args.push('--no-playlist');
        }
        
        if (options.audioOnly) {
            args.push('--extract-audio');
        }
        
        if (options.audioFormat) {
            args.push('--audio-format', options.audioFormat);
        }
        
        if (options.audioQuality) {
            args.push('--audio-quality', options.audioQuality);
        }
        
        return args;
    }

    /**
     * Cache temizleme
     */
    cleanupCache() {
        if (this.cache.size > this.maxCacheSize) {
            const entries = Array.from(this.cache.entries());
            entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
            
            const toDelete = entries.slice(0, entries.length - this.maxCacheSize);
            toDelete.forEach(([key]) => this.cache.delete(key));
            
            console.log(`[STREAM-MANAGER] Cache temizlendi: ${toDelete.length} eski entry silindi`);
        }
    }

    /**
     * Sistem durumu
     */
    getStatus() {
        return {
            cacheSize: this.cache.size,
            maxCacheSize: this.maxCacheSize,
            cacheTimeout: this.cacheTimeout,
            ytdlpVersion: this.ytdlp.getVersion ? this.ytdlp.getVersion() : 'unknown'
        };
    }

    /**
     * Cache'i temizle
     */
    clearCache() {
        this.cache.clear();
        console.log('[STREAM-MANAGER] Cache temizlendi');
    }
}

module.exports = StreamManager;
