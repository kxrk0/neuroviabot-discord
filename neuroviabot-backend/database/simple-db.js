// ==========================================
// 🤖 NeuroViaBot - Simple JSON Database (Backend)
// Shared with bot for real-time settings sync
// ==========================================

const fs = require('fs');
const path = require('path');

class SimpleDatabase {
    constructor() {
        // Use shared data directory with bot
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
        
        // Auto-save every 5 minutes
        setInterval(() => this.saveData(), 5 * 60 * 1000);
    }

    ensureDirectory() {
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
        }
    }

    // Load data from disk
    loadData() {
        try {
            if (fs.existsSync(this.dbPath)) {
                const rawData = fs.readFileSync(this.dbPath, 'utf8');
                const jsonData = JSON.parse(rawData);
                
                // Convert JSON objects to Maps
                for (const [key, value] of Object.entries(jsonData)) {
                    if (this.data.hasOwnProperty(key)) {
                        this.data[key] = new Map(Object.entries(value || {}));
                    }
                }
                
                console.log('[Backend DB] Database loaded from JSON file');
            } else {
                console.log('[Backend DB] Creating new database');
                this.saveData();
            }
        } catch (error) {
            console.error('[Backend DB] Database load error:', error.message);
            
            // Try to restore from backup
            if (fs.existsSync(this.backupPath)) {
                try {
                    const backupData = fs.readFileSync(this.backupPath, 'utf8');
                    const jsonBackup = JSON.parse(backupData);
                    
                    for (const [key, value] of Object.entries(jsonBackup)) {
                        if (this.data.hasOwnProperty(key)) {
                            this.data[key] = new Map(Object.entries(value || {}));
                        }
                    }
                    
                    console.warn('[Backend DB] Database restored from backup');
                } catch (backupError) {
                    console.error('[Backend DB] Backup restore error:', backupError.message);
                }
            }
        }
    }

    // Save data to disk
    saveData() {
        try {
            // Create backup
            if (fs.existsSync(this.dbPath)) {
                fs.copyFileSync(this.dbPath, this.backupPath);
            }
            
            // Convert Maps to JSON objects
            const jsonData = {};
            for (const [key, mapValue] of Object.entries(this.data)) {
                jsonData[key] = Object.fromEntries(mapValue);
            }
            
            // Write to file
            fs.writeFileSync(this.dbPath, JSON.stringify(jsonData, null, 2), 'utf8');
            
        } catch (error) {
            console.error('[Backend DB] Database save error:', error.message);
        }
    }

    // Guild settings operations
    getGuildSettings(guildId) {
        let settings = this.data.settings.get(guildId);
        
        if (!settings) {
            // Default settings matching bot format
            settings = {
                guildId,
                prefix: '!',
                language: 'tr',
                welcomeChannel: null,
                leaveChannel: null,
                logChannel: null,
                muteRole: null,
                features: {
                    music: true,
                    economy: true,
                    moderation: true,
                    leveling: true,
                    tickets: true,
                    giveaways: true,
                    welcome: true,
                    autorole: false
                },
                welcome: {
                    enabled: true,
                    channelId: null,
                    message: 'Hoş geldin {user}! Sunucumuza katıldığın için teşekkürler! 🎉',
                    embedEnabled: false,
                    embedColor: '#5865F2',
                },
                leave: {
                    enabled: false,
                    channelId: null,
                    message: '{user} sunucudan ayrıldı. Görüşmek üzere! 👋',
                },
                moderation: {
                    enabled: true,
                    autoMod: true,
                    spamProtection: true,
                    antiInvite: false,
                    antiLink: false,
                    logChannelId: null,
                    muteRoleId: null,
                    maxWarnings: 3,
                },
                leveling: {
                    enabled: true,
                    xpPerMessage: 15,
                    xpCooldown: 60,
                    levelUpMessage: true,
                    levelUpChannelId: null,
                },
                autorole: {
                    enabled: false,
                    roleIds: [],
                },
                general: {
                    prefix: '!',
                    language: 'tr',
                }
            };
            
            this.data.settings.set(guildId, settings);
            this.saveData();
        }
        
        return settings;
    }

    updateGuildSettings(guildId, updates) {
        const current = this.getGuildSettings(guildId);
        const updated = { ...current, ...updates };
        this.data.settings.set(guildId, updated);
        this.saveData();
        return updated;
    }

    updateGuildSettingsCategory(guildId, category, updates) {
        const current = this.getGuildSettings(guildId);
        current[category] = { ...current[category], ...updates };
        this.data.settings.set(guildId, current);
        this.saveData();
        return current;
    }

    // Statistics
    getStats() {
        return {
            users: this.data.users.size,
            guilds: this.data.guilds.size,
            guildMembers: this.data.guildMembers.size,
            economy: this.data.userEconomy.size,
            warnings: this.data.warnings.size,
            tickets: this.data.tickets.size,
            giveaways: this.data.giveaways.size,
            customCommands: this.data.customCommands.size,
            settings: this.data.settings.size
        };
    }
}

// Singleton instance
let dbInstance = null;

function getDatabase() {
    if (!dbInstance) {
        dbInstance = new SimpleDatabase();
    }
    return dbInstance;
}

module.exports = {
    getDatabase,
    SimpleDatabase
};

