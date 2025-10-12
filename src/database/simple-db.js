// ==========================================
// 🤖 NeuroViaBot - Simple JSON Database
// ==========================================

const fs = require('fs');
const path = require('path');
const { logger } = require('../utils/logger');

class SimpleDatabase {
    constructor() {
        this.dataDir = path.join(__dirname, '..', '..', 'data');
        this.dbPath = path.join(this.dataDir, 'database.json');
        this.backupPath = path.join(this.dataDir, 'database-backup.json');
        
        this.data = {
            users: new Map(),
            guilds: new Map(),
            guildMembers: new Map(),
            userEconomy: new Map(),
            warnings: new Map(),
            tickets: new Map(),
            giveaways: new Map(),
            customCommands: new Map(),
            settings: new Map()
        };
        
        this.ensureDirectory();
        this.loadData();
        
        // Otomatik kaydetme (her 5 dakikada)
        setInterval(() => this.saveData(), 5 * 60 * 1000);
    }

    ensureDirectory() {
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
        }
    }

    // Veriyi diskten yükle
    loadData() {
        try {
            if (fs.existsSync(this.dbPath)) {
                const rawData = fs.readFileSync(this.dbPath, 'utf8');
                const jsonData = JSON.parse(rawData);
                
                // JSON objelerini Map'lere dönüştür
                for (const [key, value] of Object.entries(jsonData)) {
                    if (this.data.hasOwnProperty(key)) {
                        this.data[key] = new Map(Object.entries(value || {}));
                    }
                }
                
                logger.success('Database JSON dosyasından yüklendi');
            } else {
                logger.info('Yeni database oluşturuluyor');
                this.saveData();
            }
        } catch (error) {
            logger.error('Database yükleme hatası', error);
            
            // Backup'tan geri yüklemeyi dene
            if (fs.existsSync(this.backupPath)) {
                try {
                    const backupData = fs.readFileSync(this.backupPath, 'utf8');
                    const jsonBackup = JSON.parse(backupData);
                    
                    for (const [key, value] of Object.entries(jsonBackup)) {
                        if (this.data.hasOwnProperty(key)) {
                            this.data[key] = new Map(Object.entries(value || {}));
                        }
                    }
                    
                    logger.warn('Database backup\'tan geri yüklendi');
                } catch (backupError) {
                    logger.error('Backup geri yükleme hatası', backupError);
                }
            }
        }
    }

    // Veriyi diske kaydet
    saveData() {
        try {
            // Backup oluştur
            if (fs.existsSync(this.dbPath)) {
                fs.copyFileSync(this.dbPath, this.backupPath);
            }
            
            // Map'leri JSON objelerine dönüştür
            const jsonData = {};
            for (const [key, mapValue] of Object.entries(this.data)) {
                jsonData[key] = Object.fromEntries(mapValue);
            }
            
            // Dosyaya yaz
            fs.writeFileSync(this.dbPath, JSON.stringify(jsonData, null, 2), 'utf8');
            logger.debug('Database kaydedildi');
            
        } catch (error) {
            logger.error('Database kaydetme hatası', error);
        }
    }

    // User işlemleri
    getUser(userId) {
        return this.data.users.get(userId) || null;
    }

    createUser(userId, userData = {}) {
        const user = {
            id: userId,
            username: userData.username || 'Unknown',
            discriminator: userData.discriminator || '0000',
            globalName: userData.globalName || null,
            avatar: userData.avatar || null,
            createdAt: new Date().toISOString(),
            lastSeen: new Date().toISOString(),
            ...userData
        };
        
        this.data.users.set(userId, user);
        return user;
    }

    getOrCreateUser(userId, userData = {}) {
        let user = this.getUser(userId);
        if (!user) {
            user = this.createUser(userId, userData);
        } else {
            // Güncelle
            if (userData.username) user.username = userData.username;
            if (userData.discriminator) user.discriminator = userData.discriminator;
            if (userData.globalName !== undefined) user.globalName = userData.globalName;
            if (userData.avatar !== undefined) user.avatar = userData.avatar;
            user.lastSeen = new Date().toISOString();
            this.data.users.set(userId, user);
        }
        return user;
    }

    // Guild işlemleri
    getGuild(guildId) {
        return this.data.guilds.get(guildId) || null;
    }

    createGuild(guildId, guildData = {}) {
        const guild = {
            id: guildId,
            name: guildData.name || 'Unknown Guild',
            createdAt: new Date().toISOString(),
            ...guildData
        };
        
        this.data.guilds.set(guildId, guild);
        return guild;
    }

    getOrCreateGuild(guildId, guildData = {}) {
        let guild = this.getGuild(guildId);
        if (!guild) {
            guild = this.createGuild(guildId, guildData);
        } else {
            if (guildData.name) guild.name = guildData.name;
            this.data.guilds.set(guildId, guild);
        }
        return guild;
    }

    // Economy işlemleri
    getUserEconomy(userId) {
        return this.data.userEconomy.get(userId) || {
            userId,
            balance: 0,
            bank: 0,
            lastDaily: null,
            lastWork: null,
            lastCrime: null,
            inventory: [],
            createdAt: new Date().toISOString()
        };
    }

    updateUserEconomy(userId, economyData) {
        const current = this.getUserEconomy(userId);
        const updated = { ...current, ...economyData };
        this.data.userEconomy.set(userId, updated);
        return updated;
    }

    // Settings işlemleri
    getGuildSettings(guildId) {
        return this.data.settings.get(guildId) || {
            guildId,
            prefix: '!',
            welcomeChannel: null,
            leaveChannel: null,
            autoRole: null,
            modRole: null,
            muteRole: null,
            logChannel: null,
            features: {
                music: true,
                economy: true,
                moderation: true,
                leveling: true,
                tickets: true,
                giveaways: true
            }
        };
    }

    updateGuildSettings(guildId, settings) {
        const current = this.getGuildSettings(guildId);
        const updated = { ...current, ...settings };
        this.data.settings.set(guildId, updated);
        return updated;
    }

    // Guild Features yönetimi (guild-specific)
    isGuildFeatureEnabled(guildId, feature) {
        const settings = this.getGuildSettings(guildId);
        return settings.features?.[feature] === true;
    }

    updateGuildFeature(guildId, feature, enabled) {
        const settings = this.getGuildSettings(guildId);
        if (!settings.features) {
            settings.features = {};
        }
        settings.features[feature] = enabled;
        this.updateGuildSettings(guildId, settings);
        this.saveData();
        return true;
    }

    getGuildFeatures(guildId) {
        const settings = this.getGuildSettings(guildId);
        return settings.features || {};
    }

    // Warning işlemleri
    addWarning(userId, guildId, moderatorId, reason) {
        const warningId = Date.now().toString();
        const warning = {
            id: warningId,
            userId,
            guildId,
            moderatorId,
            reason,
            createdAt: new Date().toISOString(),
            active: true
        };
        
        this.data.warnings.set(warningId, warning);
        return warning;
    }

    getUserWarnings(userId, guildId) {
        const warnings = [];
        for (const [id, warning] of this.data.warnings) {
            if (warning.userId === userId && warning.guildId === guildId && warning.active) {
                warnings.push(warning);
            }
        }
        return warnings;
    }

    removeWarning(warningId) {
        const warning = this.data.warnings.get(warningId);
        if (warning) {
            warning.active = false;
            this.data.warnings.set(warningId, warning);
            return true;
        }
        return false;
    }

    // Statistics
    getStats() {
        return {
            users: this.data.users.size,
            guilds: this.data.guilds.size,
            guildMembers: this.data.guildMembers.size,
            userEconomy: this.data.userEconomy.size,
            warnings: this.data.warnings.size,
            tickets: this.data.tickets.size,
            giveaways: this.data.giveaways.size,
            customCommands: this.data.customCommands.size,
            settings: this.data.settings.size
        };
    }

    // Backup ve maintenance
    createBackup() {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupFile = path.join(this.dataDir, `backup-${timestamp}.json`);
            
            fs.copyFileSync(this.dbPath, backupFile);
            logger.success(`Backup oluşturuldu: ${backupFile}`);
            return backupFile;
        } catch (error) {
            logger.error('Backup oluşturma hatası', error);
            return null;
        }
    }

    cleanOldBackups() {
        try {
            const files = fs.readdirSync(this.dataDir);
            const backupFiles = files.filter(f => f.startsWith('backup-'));
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            
            backupFiles.forEach(file => {
                const filePath = path.join(this.dataDir, file);
                const stats = fs.statSync(filePath);
                
                if (stats.mtime < thirtyDaysAgo) {
                    fs.unlinkSync(filePath);
                    logger.info(`Eski backup silindi: ${file}`);
                }
            });
        } catch (error) {
            logger.error('Backup temizleme hatası', error);
        }
    }
}

// Singleton instance
const db = new SimpleDatabase();

// Graceful shutdown
process.on('SIGINT', () => {
    logger.info('Database kaydediliyor...');
    db.saveData();
});

process.on('SIGTERM', () => {
    logger.info('Database kaydediliyor...');
    db.saveData();
});

// Export both the instance and a getter function for compatibility
module.exports = db;
module.exports.getDatabase = () => db;
