// ==========================================
// 🤖 NeuroViaBot - Feature Manager Utility
// ==========================================

const fs = require('fs');
const path = require('path');
const { logger } = require('./logger');

class FeatureManager {
    constructor() {
        this.configPath = path.join(__dirname, '..', 'config.js');
        this.configBackup = null;
    }

    // Özelliği aktifleştir/devre dışı bırak
    async toggleFeature(feature, enabled) {
        try {
            // Config dosyasını oku
            const configContent = fs.readFileSync(this.configPath, 'utf8');
            
            // Backup oluştur
            this.configBackup = configContent;
            
            // Feature flag'i güncelle
            const updatedContent = this.updateFeatureFlag(configContent, feature, enabled);
            
            // Config dosyasını güncelle
            fs.writeFileSync(this.configPath, updatedContent, 'utf8');
            
            // Config'i yeniden yükle
            this.reloadConfig();
            
            // Global config'i güncelle
            global.featureConfig = require('../config.js');
            
            logger.info(`Özellik ${enabled ? 'aktifleştirildi' : 'devre dışı bırakıldı'}: ${feature}`);
            
            return true;
        } catch (error) {
            logger.error('Feature toggle hatası', error);
            
            // Hata durumunda backup'ı geri yükle
            if (this.configBackup) {
                try {
                    fs.writeFileSync(this.configPath, this.configBackup, 'utf8');
                    logger.info('Config backup geri yüklendi');
                } catch (restoreError) {
                    logger.error('Config backup geri yükleme hatası', restoreError);
                }
            }
            
            return false;
        }
    }

    // Config içeriğinde feature flag'i güncelle
    updateFeatureFlag(content, feature, enabled) {
        // Feature flag pattern'ini bul
        const featurePattern = new RegExp(
            `(${feature}:\\s*)(true|false)`,
            'g'
        );
        
        const replacement = `$1${enabled}`;
        const updatedContent = content.replace(featurePattern, replacement);
        
        // Eğer değişiklik yapılmadıysa, manuel olarak ekle
        if (updatedContent === content) {
            logger.warn(`Feature flag bulunamadı: ${feature}, manuel ekleme yapılıyor`);
            return this.addFeatureFlagManually(content, feature, enabled);
        }
        
        return updatedContent;
    }

    // Manuel olarak feature flag ekle
    addFeatureFlagManually(content, feature, enabled) {
        const featuresSection = content.match(/features:\s*\{[^}]*\}/s);
        
        if (featuresSection) {
            const newFeatureLine = `        ${feature}: ${enabled},\n`;
            const updatedFeatures = featuresSection[0].replace(
                /(\s+)(\w+:\s*(?:true|false),?\s*)(\n\s*})/,
                `$1$2${newFeatureLine}$3`
            );
            
            return content.replace(featuresSection[0], updatedFeatures);
        }
        
        return content;
    }

    // Config'i yeniden yükle
    reloadConfig() {
        try {
            // Config cache'ini temizle
            delete require.cache[require.resolve('../config.js')];
            
            // Yeniden yükle
            const newConfig = require('../config.js');
            
            // Global config'i güncelle
            global.featureConfig = newConfig;
            
            logger.info('Config başarıyla yeniden yüklendi');
        } catch (error) {
            logger.error('Config yeniden yükleme hatası', error);
        }
    }

    // Özellik durumunu kontrol et
    isFeatureEnabled(feature) {
        try {
            const config = require('../config.js');
            return config.features[feature] === true;
        } catch (error) {
            logger.error('Feature durum kontrol hatası', error);
            return false;
        }
    }

    // Tüm özellik durumlarını al
    getAllFeatureStatus() {
        try {
            const config = require('../config.js');
            return config.features;
        } catch (error) {
            logger.error('Tüm feature durumları alma hatası', error);
            return {};
        }
    }

    // Handler'ı yeniden başlat
    async restartHandler(handlerName, enabled) {
        try {
            const handlerPath = path.join(__dirname, '..', 'handlers', `${handlerName}.js`);
            
            if (fs.existsSync(handlerPath)) {
                // Handler cache'ini temizle
                delete require.cache[require.resolve(handlerPath)];
                
                logger.info(`Handler ${handlerName} ${enabled ? 'aktifleştirildi' : 'devre dışı bırakıldı'}`);
            }
        } catch (error) {
            logger.error(`Handler ${handlerName} yeniden başlatma hatası`, error);
        }
    }

    // Özellik adlarını al
    getFeatureNames() {
        return {
            tickets: '🎫 Ticket Sistemi',
            economy: '💰 Ekonomi Sistemi',
            moderation: '🛡️ Moderasyon Sistemi',
            leveling: '📈 Seviye Sistemi',
            giveaways: '🎉 Çekiliş Sistemi'
        };
    }

    // Handler eşleştirmeleri
    getHandlerMapping() {
        return {
            tickets: 'ticketHandler',
            economy: 'economyHandler',
            moderation: 'moderationHandler',
            leveling: 'levelingHandler',
            giveaways: 'giveawayHandler'
        };
    }
}

module.exports = new FeatureManager();
