const { ActivityType } = require('discord.js');
const { logger } = require('../utils/logger');

module.exports = {
    name: 'clientReady',
    once: true,
    execute(client) {
        console.log(`✅ ${client.user.tag} olarak giriş yapıldı!`);
        console.log(`🎵 Bot hazır!`);
        console.log(`📊 ${client.guilds.cache.size} sunucuda aktif`);
        console.log(`👥 ${client.users.cache.size} kullanıcıya hizmet veriyor`);
        
        // Mevcut guild'leri database'e yükle
        loadExistingGuilds(client);
        
        // Bot status'unu ayarla - Website + ULTRA REAL-TIME kullanıcı ve sunucu sayısı
        let activityIndex = 0;
        function updateActivity() {
            try {
                // REAL-TIME veri alma - guild cache'den anlık bilgileri al
                const totalUsers = client.guilds.cache.reduce((acc, guild) => {
                    // Her guild'den gerçek member count al
                    return acc + (guild.memberCount || 0);
                }, 0);
                
                const totalServers = client.guilds.cache.size;
                
                // Rotate between website and stats
                const activities = [
                    `neuroviabot.xyz 🌐`,
                    `${totalUsers.toLocaleString()} kullanıcı | ${totalServers} sunucu 📊`
                ];
                
                const activityText = activities[activityIndex];
                activityIndex = (activityIndex + 1) % activities.length;
                
                client.user.setActivity(activityText, { 
                    type: ActivityType.Streaming,
                    url: 'https://www.twitch.tv/swaffval'
                });
                
                // Activity updated silently - no debug logs needed
                
            } catch (error) {
                console.error('❌ Activity güncelleme hatası:', error);
            }
        }
        
        // İlk activity'i ayarla
        updateActivity();
        
        // REAL-TIME güncelleme: Her 10 saniyede bir activity değiştir
        setInterval(() => {
            updateActivity();
        }, 10000); // 10 saniye
        
        // Guild join/leave event'lerinde de güncelle (gerçek real-time için)
        client.on('guildCreate', () => {
            setTimeout(() => updateActivity(), 1000); // 1 saniye gecikme ile güncelle
        });
        
        client.on('guildDelete', () => {
            setTimeout(() => updateActivity(), 1000); // 1 saniye gecikme ile güncelle
        });
        
        console.log('🚀 Bot tamamen hazır ve çalışıyor!');
    },
};

// Mevcut guild'leri database'e yükle
function loadExistingGuilds(client) {
    try {
        const db = require('../database/simple-db');
        let loadedCount = 0;
        
        console.log(`🔄 Mevcut ${client.guilds.cache.size} guild database'e yükleniyor...`);
        
        client.guilds.cache.forEach(guild => {
            const guildData = {
                name: guild.name,
                memberCount: guild.memberCount,
                ownerId: guild.ownerId,
                region: guild.preferredLocale,
                joinedAt: new Date().toISOString(),
                features: guild.features || [],
                boostLevel: guild.premiumTier || 0,
                boostCount: guild.premiumSubscriptionCount || 0,
                icon: guild.icon,
                active: true
            };
            
            db.getOrCreateGuild(guild.id, guildData);
            loadedCount++;
        });
        
        console.log(`✅ ${loadedCount} guild database'e yüklendi`);
        logger.success(`Bot başlangıcında ${loadedCount} guild database'e yüklendi`);
        
    } catch (error) {
        console.error('❌ Guild yükleme hatası:', error);
        logger.error('Guild yükleme hatası', error);
    }
}

