// ==========================================
// 🤖 NeuroViaBot - Feature Manager Utility
// ==========================================

const fs = require('fs');
const path = require('path');
const { logger } = require('./logger');
const configSync = require('./configSync');

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
            
            // Config'i yeniden yükle ve senkronize et
            this.reloadConfig();
            
            // ConfigSync'i de güncelle
            const configSync = require('./configSync');
            configSync.reloadConfig();
            
            // Değişikliği doğrula
            const isActuallyEnabled = this.isFeatureEnabled(feature);
            
            if (isActuallyEnabled !== enabled) {
                logger.error(`Feature toggle doğrulama başarısız: ${feature} beklenen=${enabled}, gerçek=${isActuallyEnabled}`);
                return false;
            }
            
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
        // Feature flag'i bul ve değiştir - daha güvenli regex
        const lines = content.split('\n');
        let found = false;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // Feature flag satırını bul (tickets: false, economy: true gibi)
            if (line.includes(`${feature}:`) && (line.includes('true') || line.includes('false'))) {
                // Satırı güncelle
                lines[i] = line.replace(/:\s*(true|false)/, `: ${enabled}`);
                found = true;
                logger.info(`Feature flag güncellendi: ${feature} = ${enabled}`);
                break;
            }
        }
        
        if (!found) {
            logger.warn(`Feature flag bulunamadı: ${feature}, manuel ekleme yapılıyor`);
            return this.addFeatureFlagManually(content, feature, enabled);
        }
        
        return lines.join('\n');
    }

    // Manuel olarak feature flag ekle
    addFeatureFlagManually(content, feature, enabled) {
        const lines = content.split('\n');
        let featuresStartIndex = -1;
        let featuresEndIndex = -1;
        
        // Features bölümünü bul
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('features:')) {
                featuresStartIndex = i;
            }
            if (featuresStartIndex !== -1 && lines[i].includes('}') && i > featuresStartIndex) {
                featuresEndIndex = i;
                break;
            }
        }
        
        if (featuresStartIndex !== -1 && featuresEndIndex !== -1) {
            // Features bölümünün sonuna yeni feature ekle
            const newFeatureLine = `        ${feature}: ${enabled},`;
            lines.splice(featuresEndIndex, 0, newFeatureLine);
            return lines.join('\n');
        }
        
        return content;
    }

    // Config'i yeniden yükle
    reloadConfig() {
        try {
            // Config cache'ini temizle - hem configPath hem de require.resolve kullan
            const configResolvedPath = require.resolve('../config.js');
            delete require.cache[this.configPath];
            delete require.cache[configResolvedPath];
            
            logger.info('Config başarıyla yeniden yüklendi');
        } catch (error) {
            logger.error('Config yeniden yükleme hatası', error);
        }
    }

    // Özellik durumunu kontrol et (cache'siz)
    isFeatureEnabled(feature) {
        try {
            // Config cache'ini temizle ve yeniden oku - hem configPath hem de require.resolve kullan
            const configResolvedPath = require.resolve('../config.js');
            delete require.cache[this.configPath];
            delete require.cache[configResolvedPath];
            const config = require('../config.js');
            
            // Güvenli kontrol
            if (!config || !config.features || typeof config.features[feature] === 'undefined') {
                logger.warn(`Feature durumu bulunamadı: ${feature}`);
                return false;
            }
            
            return config.features[feature] === true;
        } catch (error) {
            logger.error('Feature durum kontrol hatası', error);
            return false;
        }
    }

    // Tüm özellik durumlarını al (cache'siz)
    getAllFeatureStatus() {
        try {
            // Config cache'ini temizle ve yeniden oku - hem configPath hem de require.resolve kullan
            const configResolvedPath = require.resolve('../config.js');
            delete require.cache[this.configPath];
            delete require.cache[configResolvedPath];
            const config = require('../config.js');
            return config.features;
        } catch (error) {
            logger.error('Tüm feature durumları alma hatası', error);
            return {};
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

}

module.exports = new FeatureManager();
