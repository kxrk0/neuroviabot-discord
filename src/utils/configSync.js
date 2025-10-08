// ==========================================
// 🤖 NeuroViaBot - Config Synchronization System
// ==========================================

const EventEmitter = require('events');
const { logger } = require('./logger');

class ConfigSync extends EventEmitter {
    constructor() {
        super();
        this.configPath = require.resolve('../config.js');
        this.lastUpdate = Date.now();
    }

    // Config'i yeniden yükle ve tüm modüllere bildir
    reloadConfig() {
        try {
            // Cache'i temizle
            delete require.cache[this.configPath];
            
            // Yeni config'i yükle
            const config = require('../config.js');
            
            // Güncelleme zamanını kaydet
            this.lastUpdate = Date.now();
            
            // Tüm dinleyicilere bildir
            this.emit('configUpdated', config);
            
            logger.info('Config başarıyla yeniden yüklendi ve senkronize edildi');
            return config;
        } catch (error) {
            logger.error('Config yeniden yükleme hatası', error);
            return null;
        }
    }

    // Config'i güvenli şekilde al (her zaman güncel)
    getConfig() {
        try {
            // Cache'i temizle
            delete require.cache[this.configPath];
            return require('../config.js');
        } catch (error) {
            logger.error('Config alma hatası', error);
            return null;
        }
    }

    // Özellik durumunu kontrol et (cache'siz)
    isFeatureEnabled(feature) {
        const config = this.getConfig();
        if (!config || !config.features) {
            return false;
        }
        return config.features[feature] === true;
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
