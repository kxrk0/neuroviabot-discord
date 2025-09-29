// ==========================================
// 🤖 NeuroViaBot - Configuration Module
// ==========================================

module.exports = {
    // Bot yapılandırması
    clientId: process.env.DISCORD_CLIENT_ID,
    
    // Embed renk ayarları
    embedColor: process.env.EMBED_COLOR || '#7289DA',
    
    // Müzik yapılandırması
    defaultVolume: parseInt(process.env.DEFAULT_VOLUME) || 50,
    maxQueueSize: parseInt(process.env.MAX_QUEUE_SIZE) || 100,
    
    // Spotify yapılandırması
    spotify: {
        clientId: process.env.SPOTIFY_CLIENT_ID || null,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET || null,
        enabled: process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET
    },
    
    // Ekonomi yapılandırması
    economy: {
        dailyAmount: parseInt(process.env.DAILY_AMOUNT) || 100,
        workAmount: parseInt(process.env.WORK_AMOUNT) || 50,
        crimeAmount: parseInt(process.env.CRIME_AMOUNT) || 200,
        maxBet: parseInt(process.env.MAX_BET) || 1000,
        minBet: parseInt(process.env.MIN_BET) || 10
    },
    
    // Moderasyon yapılandırması
    moderation: {
        autoMod: process.env.AUTO_MOD === 'true',
        maxWarns: parseInt(process.env.MAX_WARNS) || 3,
        muteDuration: parseInt(process.env.MUTE_DURATION) || 3600000 // 1 hour in ms
    },
    
    // Premium özellikleri
    premium: {
        enabled: process.env.PREMIUM_ENABLED === 'true',
        tier1Price: parseInt(process.env.PREMIUM_TIER1) || 500,
        tier2Price: parseInt(process.env.PREMIUM_TIER2) || 1000,
        tier3Price: parseInt(process.env.PREMIUM_TIER3) || 2000
    },
    
    // Log yapılandırması
    logging: {
        enabled: process.env.LOGGING_ENABLED !== 'false',
        level: process.env.LOG_LEVEL || 'INFO',
        fileLogging: process.env.FILE_LOGGING === 'true'
    },
    
    // Sistem yapılandırması
    system: {
        maxRetries: parseInt(process.env.MAX_RETRIES) || 3,
        timeout: parseInt(process.env.TIMEOUT) || 30000,
        rateLimitMessages: parseInt(process.env.RATE_LIMIT_MESSAGES) || 5,
        rateLimitTime: parseInt(process.env.RATE_LIMIT_TIME) || 60000
    },
    
    // Feature flags
    features: {
        music: process.env.FEATURE_MUSIC !== 'false',
        economy: process.env.FEATURE_ECONOMY !== 'false',
        moderation: process.env.FEATURE_MODERATION !== 'false',
        leveling: process.env.FEATURE_LEVELING !== 'false',
        tickets: process.env.FEATURE_TICKETS !== 'false',
        giveaways: process.env.FEATURE_GIVEAWAYS !== 'false'
    },
    
    // Mesajlar
    messages: {
        noPermission: '❌ Bu komutu kullanmak için yeterli yetkiniz yok!',
        botMissingPermissions: '❌ Bu işlemi yapabilmem için gerekli izinlerim yok!',
        userNotInVoice: '🔊 Bu komutu kullanabilmek için bir ses kanalında olmalısınız!',
        botNotInVoice: '❌ Bot şu anda bir ses kanalında değil!',
        sameVoiceChannel: '❌ Bot ile aynı ses kanalında olmalısınız!',
        nothingPlaying: '❌ Şu anda herhangi bir şey çalmıyor!',
        queueEmpty: '❌ Çalma listesi boş!',
        invalidNumber: '❌ Geçerli bir sayı giriniz!',
        commandError: '❌ Komut çalıştırılırken bir hata oluştu!',
        cooldownMessage: '⏰ Bu komutu tekrar kullanabilmek için {time} saniye bekleyin!'
    },
    
    // Cooldown süreleri (saniye cinsinden)
    cooldowns: {
        daily: 86400,  // 24 hours
        work: 3600,    // 1 hour
        crime: 7200,   // 2 hours
        slots: 10,     // 10 seconds
        coinflip: 5,   // 5 seconds
        blackjack: 15, // 15 seconds
        music: 3,      // 3 seconds
        moderation: 5  // 5 seconds
    }
};
