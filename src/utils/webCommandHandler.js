const { logger } = require('./logger');
const configSync = require('./configSync');

class WebCommandHandler {
    constructor(client) {
        this.client = client;
        this.commandHistory = new Map();
        this.setupSocketHandlers();
    }

    setupSocketHandlers() {
        // Web arayüzünden gelen komutları dinle
        this.client.on('webCommand', async (data) => {
            try {
                const { command, guildId, userId, subcommand, params } = data;
                
                logger.info(`🌐 Web komutu alındı: ${command}${subcommand ? ` ${subcommand}` : ''} - Guild: ${guildId}, User: ${userId}`);
                
                // Komutu çalıştır
                const result = await this.executeWebCommand(command, guildId, userId, subcommand, params);
                
                // Sonucu web arayüzüne gönder
                this.client.emit('webCommandResult', {
                    command,
                    guildId,
                    userId,
                    subcommand,
                    success: true,
                    result,
                    timestamp: Date.now()
                });
                
            } catch (error) {
                logger.error('Web komut hatası:', error);
                
                this.client.emit('webCommandResult', {
                    command: data.command,
                    guildId: data.guildId,
                    userId: data.userId,
                    subcommand: data.subcommand,
                    success: false,
                    error: error.message,
                    timestamp: Date.now()
                });
            }
        });
    }

    async executeWebCommand(command, guildId, userId, subcommand, params) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) {
            throw new Error('Sunucu bulunamadı');
        }

        const user = this.client.users.cache.get(userId);
        if (!user) {
            throw new Error('Kullanıcı bulunamadı');
        }

        // Mock interaction objesi oluştur
        const mockInteraction = {
            guild,
            user,
            member: guild.members.cache.get(userId),
            commandName: command,
            options: {
                getSubcommand: () => subcommand,
                getString: (name) => params[name],
                getInteger: (name) => parseInt(params[name]),
                getBoolean: (name) => params[name] === 'true',
                getChannel: (name) => guild.channels.cache.get(params[name]),
                getRole: (name) => guild.roles.cache.get(params[name]),
                getUser: (name) => guild.members.cache.get(params[name])?.user
            },
            reply: async (options) => {
                logger.info(`📝 Mock interaction reply: ${JSON.stringify(options)}`);
                return { content: options.content || 'Komut çalıştırıldı' };
            },
            editReply: async (options) => {
                logger.info(`📝 Mock interaction editReply: ${JSON.stringify(options)}`);
                return { content: options.content || 'Komut güncellendi' };
            },
            deferReply: async (options) => {
                logger.info(`📝 Mock interaction deferReply: ${JSON.stringify(options)}`);
                return { content: 'Komut işleniyor...' };
            },
            followUp: async (options) => {
                logger.info(`📝 Mock interaction followUp: ${JSON.stringify(options)}`);
                return { content: options.content || 'Takip mesajı' };
            }
        };

        // Komut dosyasını bul ve çalıştır
        const commandFile = this.client.commands.get(command);
        if (!commandFile) {
            throw new Error(`Komut bulunamadı: ${command}`);
        }

        // Komut geçmişine ekle
        this.addToHistory({
            command,
            subcommand,
            guildId,
            userId,
            user: user.username,
            timestamp: Date.now(),
            success: true
        });

        // Komutu çalıştır
        await commandFile.execute(mockInteraction, this.client);
        
        return `${command}${subcommand ? ` ${subcommand}` : ''} komutu başarıyla çalıştırıldı`;
    }

    addToHistory(data) {
        const guildId = data.guildId;
        if (!this.commandHistory.has(guildId)) {
            this.commandHistory.set(guildId, []);
        }
        
        const history = this.commandHistory.get(guildId);
        history.unshift({
            id: Date.now(),
            ...data
        });
        
        // Son 100 komutu tut
        if (history.length > 100) {
            history.splice(100);
        }
    }

    getHistory(guildId, limit = 50) {
        const history = this.commandHistory.get(guildId) || [];
        return history.slice(0, limit);
    }

    // Özellik durumunu kontrol et
    isFeatureEnabled(feature) {
        return configSync.isFeatureEnabled(feature);
    }

    // Bot durumunu al
    getBotStatus() {
        return {
            online: this.client.readyAt ? true : false,
            uptime: this.client.uptime,
            guilds: this.client.guilds.cache.size,
            users: this.client.users.cache.size,
            commands: this.client.commands.size,
            features: {
                economy: this.isFeatureEnabled('economy'),
                moderation: this.isFeatureEnabled('moderation'),
                leveling: this.isFeatureEnabled('leveling'),
                tickets: this.isFeatureEnabled('tickets'),
                giveaways: this.isFeatureEnabled('giveaways')
            }
        };
    }
}

module.exports = WebCommandHandler;
