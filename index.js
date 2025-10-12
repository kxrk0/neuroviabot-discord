// ==========================================
// 🤖 NeuroViaBot - Ana Bot Dosyası
// ==========================================

// Environment variables yükleme
require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Collection, REST, Routes, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Console renkli çıktı için
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

// Logging fonksiyonu
function log(message, type = 'INFO') {
    const timestamp = new Date().toISOString();
    let color = colors.reset;
    
    switch(type) {
        case 'ERROR': color = colors.red; break;
        case 'SUCCESS': color = colors.green; break;
        case 'WARNING': color = colors.yellow; break;
        case 'INFO': color = colors.cyan; break;
        case 'DEBUG': color = colors.magenta; break;
    }
    
    console.log(`${color}[${timestamp}] [${type}] ${message}${colors.reset}`);
}

// Bot client oluşturma (Discord.js v15 optimized)
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildModeration
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction
    ]
});

// EventEmitter listener limitini artır
client.setMaxListeners(20);

// Discord.js v14 doesn't need raw voice adapter anymore

// Collections for commands and events
client.commands = new Collection();
client.events = new Collection();

// Environment variables kontrol
function checkEnvironmentVariables() {
    const required = ['DISCORD_TOKEN', 'DISCORD_CLIENT_ID'];
    const missing = required.filter(variable => !process.env[variable]);
    
    if (missing.length > 0) {
        log(`Missing environment variables: ${missing.join(', ')}`, 'ERROR');
        process.exit(1);
    }
    
    log('Environment variables loaded successfully', 'SUCCESS');
}

// Komutları yükleme fonksiyonu
async function loadCommands() {
    const commandsPath = path.join(__dirname, 'src', 'commands');
    
    if (!fs.existsSync(commandsPath)) {
        log('Commands directory not found, creating...', 'WARNING');
        fs.mkdirSync(commandsPath, { recursive: true });
        return;
    }
    
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    let commandCount = 0;
    
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        try {
            // Delete from cache to allow hot reloading
            delete require.cache[require.resolve(filePath)];
            const command = require(filePath);
            
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
                commandCount++;
                log(`Loaded command: ${command.data.name}`, 'DEBUG');
            } else {
                log(`Command ${file} is missing required properties (data & execute)`, 'WARNING');
            }
        } catch (error) {
            log(`Error loading command ${file}: ${error.message}`, 'ERROR');
        }
    }
    
    log(`Loaded ${commandCount} commands successfully`, 'SUCCESS');
}

// Event'leri yükleme fonksiyonu
async function loadEvents() {
    const eventsPath = path.join(__dirname, 'src', 'events');
    
    if (!fs.existsSync(eventsPath)) {
        log('Events directory not found, creating...', 'WARNING');
        fs.mkdirSync(eventsPath, { recursive: true });
        return;
    }
    
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    let eventCount = 0;
    
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        try {
            const event = require(filePath);
            
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
            
            client.events.set(event.name, event);
            eventCount++;
        } catch (error) {
            log(`Error loading event ${file}: ${error.message}`, 'ERROR');
        }
    }
    
    log(`Loaded ${eventCount} events`, 'SUCCESS');
}

// Handler'ları yükleme fonksiyonu
async function loadHandlers() {
    const handlersPath = path.join(__dirname, 'src', 'handlers');
    
    if (!fs.existsSync(handlersPath)) {
        log('Handlers directory not found, creating...', 'WARNING');
        fs.mkdirSync(handlersPath, { recursive: true });
        return;
    }
    
    const handlerFiles = fs.readdirSync(handlersPath).filter(file => file.endsWith('.js'));
    let handlerCount = 0;
    
    for (const file of handlerFiles) {
        const filePath = path.join(handlersPath, file);
        try {
            delete require.cache[require.resolve(filePath)];
            const Handler = require(filePath);
            
            // Handler'ı başlat
            if (typeof Handler === 'function') {
                new Handler(client);
                handlerCount++;
                log(`Loaded handler: ${file}`, 'DEBUG');
            } else if (Handler.init && typeof Handler.init === 'function') {
                await Handler.init(client);
                handlerCount++;
                log(`Loaded handler: ${file}`, 'DEBUG');
            } else {
                log(`Handler ${file} has invalid structure`, 'WARNING');
            }
        } catch (error) {
            log(`Error loading handler ${file}: ${error.message}`, 'ERROR');
        }
    }
    
    log(`Loaded ${handlerCount} handlers successfully`, 'SUCCESS');
}

// Slash komutları Discord'a kaydetme
async function registerSlashCommands() {
    const commands = [];
    
    for (const command of client.commands.values()) {
        if (command.data) {
            commands.push(command.data.toJSON());
        }
    }
    
    if (commands.length === 0) {
        log('No slash commands to register', 'INFO');
        return;
    }
    
    const rest = new REST().setToken(process.env.DISCORD_TOKEN);
    
    try {
        log(`Registering ${commands.length} slash commands...`, 'INFO');
        
        // Önce global komutları kaydet
        try {
            const globalData = await rest.put(
                Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
                { body: commands }
            );
            
            log(`Successfully registered ${globalData.length} global slash commands`, 'SUCCESS');
        } catch (globalError) {
            log(`Error registering global commands: ${globalError.message}`, 'WARNING');
        }
        
        // Her sunucu için ayrı ayrı da kaydet (daha hızlı görünmesi için)
        for (const [guildId, guild] of client.guilds.cache) {
            try {
                const guildData = await rest.put(
                    Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, guildId),
                    { body: commands }
                );
                
                log(`Successfully registered ${guildData.length} slash commands for guild: ${guild.name}`, 'SUCCESS');
            } catch (guildError) {
                log(`Error registering commands for guild ${guild.name}: ${guildError.message}`, 'WARNING');
            }
        }
        
    } catch (error) {
        log(`Error registering slash commands: ${error.message}`, 'ERROR');
    }
}

// Bot hazır olduğunda (Discord.js v14+ için clientReady event)
client.once('clientReady', async () => {
    log(`Bot logged in as ${client.user.tag}`, 'SUCCESS');
    log(`Bot ID: ${client.user.id}`, 'INFO');
    
    // Stats cache'i başlat
    statsCache.initialize(client);
    client.statsCache = statsCache;
    
    // Gerçek stats'ı logla
    const stats = statsCache.getStats();
    log(`Guilds: ${stats.guilds}`, 'INFO');
    log(`Users: ${stats.users.toLocaleString()}`, 'INFO');
    log(`Commands: ${stats.commands}`, 'INFO');
    
    // Activity ready.js event handler'ında ayarlanıyor (website + stats rotation)
    
    // Slash komutları kaydet - Rate limit nedeniyle devre dışı
    // await registerSlashCommandsWithQueue();
    
    // Her 2 dakikada bir frontend'e stats broadcast et
    setInterval(() => {
        if (client.socket && client.socket.connected && client.statsCache) {
            const currentStats = client.statsCache.getStats();
            log(`📊 Broadcasting stats update: ${currentStats.users.toLocaleString()} users, ${currentStats.guilds} guilds`, 'INFO');
            
            // Global broadcast - tüm frontend client'lara gönder
            client.socket.emit('broadcast_global', {
                event: 'bot_stats_update',
                data: {
                    guilds: currentStats.guilds,
                    users: currentStats.users,
                    commands: currentStats.commands,
                    uptime: currentStats.uptime,
                    ping: currentStats.ping,
                    timestamp: new Date().toISOString()
                }
            });
            
            log(`✅ Stats broadcast sent to all clients`, 'DEBUG');
        }
    }, 2 * 60 * 1000); // 2 dakika (120,000 ms)
    
    log('Bot is ready and operational!', 'SUCCESS');
});

// Slash komut etkileşimleri artık src/events/interactionCreate.js'de yönetiliyor

// Handlers
const LoggingHandler = require('./src/handlers/loggingHandler');
const LevelingHandler = require('./src/handlers/levelingHandler');
const TicketHandler = require('./src/handlers/ticketHandler');
const RoleReactionHandler = require('./src/handlers/roleReactionHandler');
const WebCommandHandler = require('./src/utils/webCommandHandler');
const BackupHandler = require('./src/handlers/backupHandler');
const GiveawayHandler = require('./src/handlers/giveawayHandler');
const GuardHandler = require('./src/handlers/guardHandler');
const VerificationHandler = require('./src/handlers/verificationHandler');
const WelcomeHandler = require('./src/handlers/welcomeHandler');
const { statsCache } = require('./src/utils/statsCache');

// Initialize handlers
client.loggingHandler = new LoggingHandler(client);
client.levelingHandler = new LevelingHandler(client);
client.ticketHandler = new TicketHandler(client);
client.roleReactionHandler = new RoleReactionHandler(client);
client.webCommandHandler = new WebCommandHandler(client);
client.backupHandler = new BackupHandler(client);
client.giveawayHandler = new GiveawayHandler(client);
client.guardHandler = new GuardHandler(client);
client.verificationHandler = new VerificationHandler(client);
client.welcomeHandler = new WelcomeHandler(client);

client.on('messageDelete', async (message) => {
    const { logMessageDelete } = require('./src/handlers/loggingHandler');
    await logMessageDelete(message);
});

client.on('messageUpdate', async (oldMessage, newMessage) => {
    const { logMessageUpdate } = require('./src/handlers/loggingHandler');
    await logMessageUpdate(oldMessage, newMessage);
});

client.on('guildMemberAdd', async (member) => {
    const { logMemberJoin } = require('./src/handlers/loggingHandler');
    await logMemberJoin(member);
});

client.on('guildMemberRemove', async (member) => {
    const { logMemberLeave } = require('./src/handlers/loggingHandler');
    await logMemberLeave(member);
});

client.on('roleCreate', async (role) => {
    const { logRoleCreate } = require('./src/handlers/loggingHandler');
    await logRoleCreate(role);
});

client.on('roleDelete', async (role) => {
    const { logRoleDelete } = require('./src/handlers/loggingHandler');
    await logRoleDelete(role);
});

client.on('channelCreate', async (channel) => {
    const { logChannelCreate } = require('./src/handlers/loggingHandler');
    await logChannelCreate(channel);
});

client.on('channelDelete', async (channel) => {
    const { logChannelDelete } = require('./src/handlers/loggingHandler');
    await logChannelDelete(channel);
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    const { logVoiceStateUpdate } = require('./src/handlers/loggingHandler');
    await logVoiceStateUpdate(oldState, newState);
});

// Hata yakalama
client.on('error', error => {
    log(`Client error: ${error.message}`, 'ERROR');
});

client.on('warn', warning => {
    log(`Client warning: ${warning}`, 'WARNING');
});

// Process hata yakalama
process.on('unhandledRejection', error => {
    log(`Unhandled promise rejection: ${error.message}`, 'ERROR');
});

process.on('uncaughtException', error => {
    log(`Uncaught exception: ${error.message}`, 'ERROR');
    process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
    log('Received SIGINT, shutting down gracefully...', 'INFO');
    client.destroy();
    process.exit(0);
});

process.on('SIGTERM', () => {
    log('Received SIGTERM, shutting down gracefully...', 'INFO');
    client.destroy();
    process.exit(0);
});

// Socket.IO setup (Backend ile real-time senkronizasyon)
async function setupSocketIO(client) {
    try {
        const io = require('socket.io-client');
        const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
        
        const socket = io(BACKEND_URL, {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 10
        });

        socket.on('connect', () => {
            log(`✅ Backend'e bağlanıldı: ${BACKEND_URL}`, 'SUCCESS');
            console.log(`[DEBUG-SOCKET] Socket connected with ID: ${socket.id}`);
             
            // Tüm guild'lere subscribe ol
            client.guilds.cache.forEach(guild => {
                socket.emit('join_guild', guild.id);
                log(`🔗 Guild room'a join edildi: ${guild.name} (${guild.id})`, 'DEBUG');
            });
        });

        socket.on('disconnect', () => {
            log('❌ Backend bağlantısı kesildi', 'WARNING');
        });

        // Real-time stats request from backend
        socket.on('get_bot_stats', async (data, callback) => {
            try {
                // Stats cache'den al (merkezi kaynak)
                const stats = client.statsCache.getStats();
                
                log(`📊 Real-time stats sent: ${JSON.stringify(stats)}`, 'DEBUG');
                
                if (callback) {
                    callback({ success: true, data: stats });
                }
            } catch (error) {
                log(`Error sending stats: ${error.message}`, 'ERROR');
                if (callback) {
                    callback({ success: false, error: error.message });
                }
            }
        });

        // Settings değişikliğini dinle
        socket.on('settings_changed', async (data) => {
            const { guildId, settings, category } = data;
            
            log(`🔄 Ayarlar güncellendi: Guild ${guildId}${category ? ` - ${category}` : ''}`, 'INFO');
            
            // Database'i yeniden yükle (simple-db otomatik kaydediyor)
            const { getDatabase } = require('./src/database/simple-db');
            const db = getDatabase();
            
            // Bot'un database'ini güncelle
            if (settings) {
                db.data.settings.set(guildId, settings);
                db.saveData();
                log(`💾 Bot database güncellendi: Guild ${guildId}`, 'DEBUG');
            }
            
            // Leveling handler'ı güncelle
            if (settings.leveling && client.levelingHandler) {
                log(`📊 Leveling ayarları güncellendi: ${JSON.stringify(settings.leveling)}`, 'DEBUG');
            }
            
            // Moderation ayarları güncellendi
            if (settings.moderation) {
                log(`🛡️ Moderasyon ayarları güncellendi`, 'DEBUG');
            }
            
            log(`✅ Guild ${guildId} ayarları senkronize edildi`, 'SUCCESS');
        });

        // Guild broadcast handler - Management actions
        socket.on('broadcast_to_guild', (data) => {
            const { guildId, event, data: eventData } = data;
            log(`📢 Broadcasting to guild ${guildId}: ${event}`, 'DEBUG');
            
            // Broadcast event back to all connected frontend clients for this guild
            socket.emit(event, {
                guildId,
                ...eventData,
            });
        });

        client.socket = socket;
        
    } catch (error) {
        log(`Socket.IO hatası: ${error.message}`, 'WARNING');
        // Socket hatasında bot çalışmaya devam eder (kritik değil)
    }
}

// Ana başlatma fonksiyonu
async function startBot() {
    log('Starting NeuroViaBot...', 'INFO');
    log('==========================================', 'INFO');
    
    try {
        // Environment variables kontrol et
        checkEnvironmentVariables();
        
        // Database'i başlat
        const { initializeModels } = require('./src/models/index');
        await initializeModels();
        
        // Music Player kaldırıldı
        
        // Security ve Analytics sistemlerini başlat
        const { security } = require('./src/utils/security');
        const { analytics } = require('./src/utils/analytics');
        client.security = security;
        client.analytics = analytics;
        
        // Handler'ları yükle
        await loadHandlers();
        
        // Socket.IO bağlantısı (Backend ile real-time senkronizasyon)
        await setupSocketIO(client);
        
        // Real-time updates sistemini başlat
        const { realtimeUpdates } = require('./src/utils/realtime');
        global.realtimeUpdates = realtimeUpdates;
        
        // Broadcast fonksiyonlarını set et
        realtimeUpdates.setBroadcastFunctions(
            (guildId, event, data) => {
                console.log(`[DEBUG-SOCKET] Broadcasting to guild ${guildId}: ${event}`);
                if (client.socket) {
                    client.socket.emit('broadcast_to_guild', { guildId, event, data });
                    console.log(`[DEBUG-SOCKET] Event sent to backend`);
                } else {
                    console.log(`[DEBUG-SOCKET] client.socket is not available`);
                }
            },
            (event, data) => {
                console.log(`[DEBUG-SOCKET] Broadcasting globally: ${event}`);
                if (client.socket) {
                    client.socket.emit('broadcast_global', { event, data });
                    console.log(`[DEBUG-SOCKET] Global event sent to backend`);
                } else {
                    console.log(`[DEBUG-SOCKET] client.socket is not available for global broadcast`);
                }
            }
        );
        
        // Komutları ve event'leri yükle
        await loadCommands();
        await loadEvents();
        
        // Bot'u başlat
        await client.login(process.env.DISCORD_TOKEN);
        
    } catch (error) {
        log(`Failed to start bot: ${error.message}`, 'ERROR');
        process.exit(1);
    }
}

// Queue sistemi ile komut kaydı
async function registerSlashCommandsWithQueue() {
    const CommandQueueManager = require('./src/utils/commandQueueManager');
    const commandQueueManager = new CommandQueueManager(client);
    
    const commands = [];
    
    for (const command of client.commands.values()) {
        if (command.data) {
            commands.push(command.data.toJSON());
        }
    }
    
    if (commands.length === 0) {
        log('No slash commands to register', 'INFO');
        return;
    }
    
    try {
        log(`Registering ${commands.length} slash commands with queue system...`, 'INFO');
        
        // Önce global komutları kaydet
        await commandQueueManager.registerGlobalCommands(commands);
        log('✅ Global commands registered', 'SUCCESS');
        
        // Sonra tüm sunuculara dağıt
        await commandQueueManager.distributeCommandsToAllGuilds(commands);
        log('✅ Guild commands distributed', 'SUCCESS');
        
        // Kuyruk durumunu logla
        const queueStatus = commandQueueManager.getQueueStatus();
        log(`📊 Queue Status: ${JSON.stringify(queueStatus, null, 2)}`, 'INFO');
        
    } catch (error) {
        log(`❌ Command registration error: ${error.message}`, 'ERROR');
    }
}

// Bot'u başlat
startBot();

// Activity Reward Handler
const ActivityRewardHandler = require('./src/handlers/activityRewardHandler');
let activityRewardHandler = null;

// Quest Progress Handler
const QuestProgressHandler = require('./src/handlers/questProgressHandler');
let questProgressHandler = null;

// Achievement Handler
const AchievementHandler = require('./src/handlers/achievementHandler');
let achievementHandler = null;

// Reaction Role Handler
const ReactionRoleHandler = require('./src/handlers/reactionRoleHandler');
let reactionRoleHandler = null;

// Analytics Handler
const AnalyticsHandler = require('./src/handlers/analyticsHandler');
let analyticsHandler = null;

// Monitoring Service
const { getMonitoringService } = require('./src/utils/monitoring');
let monitoring = null;

// HTTP API Server for web interface
const express = require('express');
const { router: webApiRouter, setClient: setWebApiClient } = require('./src/routes/webApi');
const { router: guildManagementRouter, setClient: setGuildManagementClient } = require('./src/routes/guild-management');
const { router: marketplaceRouter } = require('./src/routes/marketplace');
const { router: levelingRouter, setClient: setLevelingClient } = require('./src/routes/leveling');
const { router: botStatsRouter, setClient: setBotStatsClient } = require('./src/routes/bot-stats');
const { router: reactionRolesRouter, setClient: setReactionRolesClient } = require('./src/routes/reactionRoles');

const apiApp = express();
apiApp.use(express.json());
apiApp.use('/api/bot', webApiRouter);
apiApp.use('/api/bot/guilds', guildManagementRouter);
apiApp.use('/api/bot/marketplace', marketplaceRouter);
apiApp.use('/api/bot/leveling', levelingRouter);
apiApp.use('/api/bot/stats', botStatsRouter);
apiApp.use('/api/bot/reaction-roles', reactionRolesRouter);

const apiPort = process.env.BOT_API_PORT || 3002;
apiApp.listen(apiPort, () => {
    log(`🌐 Bot HTTP API server started on port ${apiPort}`, 'SUCCESS');
}).on('error', (err) => {
    log(`❌ Bot API server error: ${err.message}`, 'ERROR');
});

// Client'ı bot hazır olduktan sonra set et
client.once('clientReady', () => {
    setWebApiClient(client);
    setGuildManagementClient(client);
    setLevelingClient(client);
    setBotStatsClient(client);
    setReactionRolesClient(client);
    
    // Activity Reward Handler'ı başlat
    activityRewardHandler = new ActivityRewardHandler(client);
    log('🎯 Activity Reward Handler initialized', 'SUCCESS');
    
    // Quest Progress Handler'ı başlat
    questProgressHandler = new QuestProgressHandler(client);
    log('🗺️ Quest Progress Handler initialized', 'SUCCESS');
    
    // Achievement Handler'ı başlat
    achievementHandler = new AchievementHandler(client);
    log('🏆 Achievement Handler initialized', 'SUCCESS');
    
    // Reaction Role Handler'ı başlat
    reactionRoleHandler = new ReactionRoleHandler(client);
    log('⚡ Reaction Role Handler initialized', 'SUCCESS');
    
    // Analytics Handler'ı başlat
    analyticsHandler = new AnalyticsHandler(client);
    client.analyticsHandler = analyticsHandler;
    log('📊 Analytics Handler initialized', 'SUCCESS');
    
    // Monitoring Service'i başlat
    monitoring = getMonitoringService();
    log('📊 Monitoring Service initialized', 'SUCCESS');
    
    log(`🌐 Client web API'ye bağlandı`, 'SUCCESS');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    log('🛑 Shutting down gracefully...', 'WARNING');
    
    // Cleanup activity rewards
    if (activityRewardHandler) {
        await activityRewardHandler.cleanup();
    }
    
    // Destroy client
    client.destroy();
    log('👋 Bot shutdown complete', 'SUCCESS');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    log('🛑 Shutting down gracefully...', 'WARNING');
    
    // Cleanup activity rewards
    if (activityRewardHandler) {
        await activityRewardHandler.cleanup();
    }
    
    // Destroy client
    client.destroy();
    log('👋 Bot shutdown complete', 'SUCCESS');
    process.exit(0);
});

// Export client for other modules
module.exports = client;
