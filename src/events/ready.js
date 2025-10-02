const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`✅ ${client.user.tag} olarak giriş yapıldı!`);
        console.log(`🎵 Discord Player hazır!`);
        console.log(`📊 ${client.guilds.cache.size} sunucuda aktif`);
        console.log(`👥 ${client.users.cache.size} kullanıcıya hizmet veriyor`);
        
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

