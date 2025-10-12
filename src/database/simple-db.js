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
            userEconomy: new Map(), // Legacy economy (to be migrated)
            neuroCoinBalances: new Map(), // New: userId -> { wallet, bank, total, lastDaily, lastWork }
            neuroCoinTransactions: new Map(), // New: txId -> transaction details
            marketplaceListings: new Map(), // New: listingId -> item details
            userInventory: new Map(), // New: userId -> [items]
            achievements: new Map(), // New: userId -> [achievements]
            dailyStreaks: new Map(), // New: userId -> streak data
            questProgress: new Map(), // New: userId -> quest data
            serverMarketConfig: new Map(), // New: guildId -> market settings
            activityRewards: new Map(), // New: userId -> last reward timestamp
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

    // ==========================================
    // NeuroCoin Economy Methods
    // ==========================================

    getNeuroCoinBalance(userId) {
        if (!this.data.neuroCoinBalances.has(userId)) {
            this.data.neuroCoinBalances.set(userId, {
                wallet: 0,
                bank: 0,
                total: 0,
                lastDaily: null,
                lastWork: null
            });
        }
        return this.data.neuroCoinBalances.get(userId);
    }

    updateNeuroCoinBalance(userId, amount, type = 'wallet') {
        const balance = this.getNeuroCoinBalance(userId);
        
        if (type === 'wallet') {
            balance.wallet += amount;
        } else if (type === 'bank') {
            balance.bank += amount;
        }
        
        balance.total = balance.wallet + balance.bank;
        this.data.neuroCoinBalances.set(userId, balance);
        this.saveData();
        
        return balance;
    }

    transferNeuroCoin(fromUserId, toUserId, amount) {
        const fromBalance = this.getNeuroCoinBalance(fromUserId);
        const toBalance = this.getNeuroCoinBalance(toUserId);
        
        if (fromBalance.wallet < amount) {
            return { success: false, error: 'Yetersiz bakiye' };
        }
        
        fromBalance.wallet -= amount;
        fromBalance.total = fromBalance.wallet + fromBalance.bank;
        
        toBalance.wallet += amount;
        toBalance.total = toBalance.wallet + toBalance.bank;
        
        this.data.neuroCoinBalances.set(fromUserId, fromBalance);
        this.data.neuroCoinBalances.set(toUserId, toBalance);
        
        // Record transaction
        const txId = `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        this.recordTransaction(fromUserId, toUserId, amount, 'transfer', { txId });
        
        this.saveData();
        return { success: true, txId };
    }

    recordTransaction(from, to, amount, type, metadata = {}) {
        const txId = metadata.txId || `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const transaction = {
            id: txId,
            from,
            to,
            amount,
            type, // 'transfer', 'activity', 'daily', 'work', 'game', 'marketplace'
            metadata,
            timestamp: new Date().toISOString()
        };
        
        this.data.neuroCoinTransactions.set(txId, transaction);
        this.saveData();
        
        return transaction;
    }

    getUserTransactions(userId, limit = 50) {
        const transactions = [];
        for (const [id, tx] of this.data.neuroCoinTransactions) {
            if (tx.from === userId || tx.to === userId) {
                transactions.push(tx);
            }
        }
        
        // Sort by timestamp descending
        transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        return transactions.slice(0, limit);
    }

    // ==========================================
    // Marketplace Methods
    // ==========================================

    createListing(userId, item, price, guildId = 'global') {
        const listingId = `listing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const listing = {
            id: listingId,
            seller: userId,
            item,
            price,
            guildId,
            listed: new Date().toISOString(),
            active: true
        };
        
        this.data.marketplaceListings.set(listingId, listing);
        this.saveData();
        
        return listing;
    }

    purchaseListing(listingId, buyerId) {
        const listing = this.data.marketplaceListings.get(listingId);
        if (!listing || !listing.active) {
            return { success: false, error: 'Liste bulunamadı veya aktif değil' };
        }
        
        const buyerBalance = this.getNeuroCoinBalance(buyerId);
        if (buyerBalance.wallet < listing.price) {
            return { success: false, error: 'Yetersiz bakiye' };
        }
        
        // Transfer NRC
        const transfer = this.transferNeuroCoin(buyerId, listing.seller, listing.price);
        if (!transfer.success) {
            return transfer;
        }
        
        // Add item to buyer inventory
        const inventory = this.data.userInventory.get(buyerId) || [];
        inventory.push({
            ...listing.item,
            purchasedAt: new Date().toISOString(),
            purchasedFrom: listing.seller
        });
        this.data.userInventory.set(buyerId, inventory);
        
        // Mark listing as sold
        listing.active = false;
        listing.soldTo = buyerId;
        listing.soldAt = new Date().toISOString();
        this.data.marketplaceListings.set(listingId, listing);
        
        this.saveData();
        return { success: true, listing };
    }

    getMarketplaceListings(guildId, filters = {}) {
        const listings = [];
        for (const [id, listing] of this.data.marketplaceListings) {
            if (listing.active && (guildId === 'global' || listing.guildId === guildId || listing.guildId === 'global')) {
                listings.push(listing);
            }
        }
        return listings;
    }

    getServerMarketConfig(guildId) {
        if (!this.data.serverMarketConfig.has(guildId)) {
            this.data.serverMarketConfig.set(guildId, {
                enabled: true,
                tax: 0,
                allowGlobal: true,
                customItems: [],
                featured: [],
                blacklist: []
            });
        }
        return this.data.serverMarketConfig.get(guildId);
    }

    updateServerMarketConfig(guildId, config) {
        const currentConfig = this.getServerMarketConfig(guildId);
        const newConfig = { ...currentConfig, ...config };
        this.data.serverMarketConfig.set(guildId, newConfig);
        this.saveData();
        return newConfig;
    }

    // ==========================================
    // Activity Rewards
    // ==========================================

    getLastActivityReward(userId) {
        return this.data.activityRewards.get(userId) || 0;
    }

    setLastActivityReward(userId, timestamp = Date.now()) {
        this.data.activityRewards.set(userId, timestamp);
        this.saveData();
    }

    // Statistics
    getStats() {
        return {
            users: this.data.users.size,
            guilds: this.data.guilds.size,
            guildMembers: this.data.guildMembers.size,
            userEconomy: this.data.userEconomy.size,
            neuroCoinBalances: this.data.neuroCoinBalances.size,
            neuroCoinTransactions: this.data.neuroCoinTransactions.size,
            marketplaceListings: this.data.marketplaceListings.size,
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
