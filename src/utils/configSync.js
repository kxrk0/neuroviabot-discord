// ==========================================
// 🤖 NeuroViaBot - Config Synchronization System
// ==========================================

const EventEmitter = require('events');
const { logger } = require('./logger');

class ConfigSync extends EventEmitter {
    constructor() {
        super();
        this.configPath = require.resolve('./config.js');
        this.lastUpdate = Date.now();
    }

    // Config'i yeniden yükle ve tüm modüllere bildir
    reloadConfig() {
        try {
            // Cache'i temizle - hem configPath hem de require.resolve kullan
            const configResolvedPath = require.resolve('./config.js');
            delete require.cache[this.configPath];
            delete require.cache[configResolvedPath];
            
            // Yeni config'i yükle
            const config = require('./config.js');
            
            // Güncelleme zamanını kaydet
            this.lastUpdate = Date.now();
            
            // Tüm dinleyicilere bildir
            this.emit('configUpdated', config);
            
            logger.info('Config başarıyla yeniden yüklendi ve senkronize edildi');
            return config;
        } catch (error) {
            // Config dosyası bulunamadığında varsayılan config kullan
            logger.warn('Config dosyası bulunamadı, varsayılan config kullanılıyor');
            const defaultConfig = {
                features: {
                    leveling: false,
                    tickets: false,
                    economy: false,
                    moderation: false,
                    giveaways: false
                }
            };
            
            // Güncelleme zamanını kaydet
            this.lastUpdate = Date.now();
            
            // Tüm dinleyicilere bildir
            this.emit('configUpdated', defaultConfig);
            
            return defaultConfig;
        }
    }

    // Config'i güvenli şekilde al (her zaman güncel)
    getConfig() {
        try {
            // Cache'i temizle - hem configPath hem de require.resolve kullan
            const configResolvedPath = require.resolve('./config.js');
            delete require.cache[this.configPath];
            delete require.cache[configResolvedPath];
            const config = require('./config.js');
            return config;
        } catch (error) {
            // Config dosyası bulunamadığında varsayılan config döndür
            logger.warn('Config dosyası bulunamadı, varsayılan config kullanılıyor');
            return {
                features: {
                    leveling: false,
                    tickets: false,
                    economy: false,
                    moderation: false,
                    giveaways: false
                }
            };
        }
    }

    // Özellik durumunu kontrol et (cache'siz)
    isFeatureEnabled(feature) {
        const config = this.getConfig();
        if (!config || !config.features) {
            return false;
        }
        const isEnabled = config.features[feature] === true;
        return isEnabled;
    }

    // Tüm özellik durumlarını al
    getAllFeatures() {
        const config = this.getConfig();
        if (!config || !config.features) {
            return {};
        }
        return config.features;
    }
}

// Singleton instance
const configSync = new ConfigSync();

module.exports = configSync;
