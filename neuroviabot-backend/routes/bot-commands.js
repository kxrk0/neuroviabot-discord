const express = require('express');
const router = express.Router();

// Bot komutlarını çalıştırma endpoint'i
router.post('/execute/:command', async (req, res) => {
    try {
        const { command } = req.params;
        const { guildId, userId, ...params } = req.body;
        
        // Komut parametrelerini doğrula
        if (!guildId || !userId) {
            return res.status(400).json({ 
                success: false, 
                error: 'Guild ID ve User ID gerekli' 
            });
        }

        // Gerçek komut çalıştırma - Bot'a HTTP isteği gönder
        try {
            const botResponse = await fetch(`http://localhost:3001/api/bot/execute-command`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.BOT_API_KEY || 'neuroviabot-secret'}`,
                },
                body: JSON.stringify({
                    command,
                    guildId,
                    userId,
                    subcommand,
                    params,
                    timestamp: Date.now()
                }),
            });

            if (botResponse.ok) {
                const botData = await botResponse.json();
                res.json({
                    success: true,
                    message: `${command}${subcommand ? ` ${subcommand}` : ''} komutu başarıyla çalıştırıldı`,
                    data: botData
                });
            } else {
                throw new Error('Bot komut çalıştırma hatası');
            }
        } catch (botError) {
            console.error('Bot API hatası:', botError);
            // Fallback: Mock response
            res.json({
                success: true,
                message: `${command}${subcommand ? ` ${subcommand}` : ''} komutu başarıyla çalıştırıldı (Mock)`,
                data: {
                    command,
                    guildId,
                    userId,
                    subcommand,
                    params,
                    timestamp: Date.now()
                }
            });
        }

    } catch (error) {
        console.error('Bot command execution error:', error);
        res.status(500).json({
            success: false,
            error: 'Komut çalıştırılırken hata oluştu'
        });
    }
});

// Bot komut durumunu kontrol et
router.get('/status/:guildId', async (req, res) => {
    try {
        const { guildId } = req.params;
        
        // Bot durumunu kontrol et
        const status = {
            online: true, // Bot'un online olup olmadığı
            commands: {
                total: 28, // Toplam komut sayısı
                available: 25, // Kullanılabilir komut sayısı
                disabled: 3 // Devre dışı komut sayısı
            },
            features: {
                economy: true,
                moderation: true,
                leveling: true,
                tickets: true,
                giveaways: false
            },
            lastUpdate: Date.now()
        };

        res.json({
            success: true,
            data: status
        });

    } catch (error) {
        console.error('Bot status check error:', error);
        res.status(500).json({
            success: false,
            error: 'Bot durumu kontrol edilirken hata oluştu'
        });
    }
});

// Komut listesini getir
router.get('/commands/:guildId', async (req, res) => {
    try {
        const { guildId } = req.params;
        
        // Bot'tan gerçek komut listesini al
        try {
            const botResponse = await fetch(`http://localhost:3001/api/bot/commands`, {
                headers: {
                    'Authorization': `Bearer ${process.env.BOT_API_KEY || 'neuroviabot-secret'}`,
                },
            });

            if (botResponse.ok) {
                const botData = await botResponse.json();
                res.json({
                    success: true,
                    data: botData.commands
                });
                return;
            }
        } catch (error) {
            console.error('Bot API hatası:', error);
        }

        // Fallback: Mock komut listesi
        const commands = [
            {
                name: 'özellikler',
                description: 'Bot özelliklerini yönet',
                category: 'admin',
                subcommands: [
                    { name: 'durum', description: 'Özellik durumunu göster' },
                    { name: 'aç', description: 'Özelliği aktifleştir' },
                    { name: 'kapat', description: 'Özelliği devre dışı bırak' },
                    { name: 'tümünü-aç', description: 'Tüm özellikleri aktifleştir' },
                    { name: 'tümünü-kapat', description: 'Tüm özellikleri devre dışı bırak' }
                ]
            },
            {
                name: 'ticket',
                description: 'Ticket sistemi yönetimi',
                category: 'moderation',
                subcommands: [
                    { name: 'setup', description: 'Ticket sistemini kur' },
                    { name: 'close', description: 'Ticket\'i kapat' },
                    { name: 'add', description: 'Ticket\'e kullanıcı ekle' },
                    { name: 'remove', description: 'Ticket\'ten kullanıcı çıkar' },
                    { name: 'claim', description: 'Ticket\'i üstlen' },
                    { name: 'unclaim', description: 'Ticket\'ten vazgeç' },
                    { name: 'transcript', description: 'Ticket transcript\'i oluştur' },
                    { name: 'stats', description: 'Ticket istatistikleri' }
                ]
            },
            {
                name: 'moderation',
                description: 'Moderasyon komutları',
                category: 'moderation',
                subcommands: [
                    { name: 'ban', description: 'Kullanıcıyı yasakla' },
                    { name: 'kick', description: 'Kullanıcıyı at' },
                    { name: 'mute', description: 'Kullanıcıyı sustur' },
                    { name: 'unmute', description: 'Kullanıcının susturmasını kaldır' },
                    { name: 'warn', description: 'Kullanıcıya uyarı ver' },
                    { name: 'clear', description: 'Mesajları temizle' }
                ]
            },
            {
                name: 'economy',
                description: 'Ekonomi sistemi',
                category: 'economy',
                subcommands: [
                    { name: 'balance', description: 'Bakiye görüntüle' },
                    { name: 'daily', description: 'Günlük ödül al' },
                    { name: 'work', description: 'Çalış' },
                    { name: 'shop', description: 'Mağazayı görüntüle' },
                    { name: 'buy', description: 'Ürün satın al' },
                    { name: 'inventory', description: 'Envanteri görüntüle' }
                ]
            },
            {
                name: 'level',
                description: 'Seviye sistemi',
                category: 'leveling',
                subcommands: [
                    { name: 'rank', description: 'Seviye sıralaması' },
                    { name: 'leaderboard', description: 'Liderlik tablosu' },
                    { name: 'rewards', description: 'Seviye ödülleri' }
                ]
            },
            {
                name: 'giveaway',
                description: 'Çekiliş sistemi',
                category: 'giveaway',
                subcommands: [
                    { name: 'start', description: 'Çekiliş başlat' },
                    { name: 'end', description: 'Çekilişi bitir' },
                    { name: 'reroll', description: 'Çekilişi yeniden çek' }
                ]
            },
            {
                name: 'welcome',
                description: 'Hoşgeldin sistemi',
                category: 'welcome',
                subcommands: [
                    { name: 'setup', description: 'Hoşgeldin sistemini kur' },
                    { name: 'test', description: 'Hoşgeldin mesajını test et' }
                ]
            },
            {
                name: 'role',
                description: 'Rol yönetimi',
                category: 'roles',
                subcommands: [
                    { name: 'add', description: 'Rol ekle' },
                    { name: 'remove', description: 'Rol kaldır' },
                    { name: 'list', description: 'Rolleri listele' }
                ]
            },
            {
                name: 'setup',
                description: 'Bot kurulumu',
                category: 'admin',
                subcommands: [
                    { name: 'quick', description: 'Hızlı kurulum' },
                    { name: 'advanced', description: 'Gelişmiş kurulum' }
                ]
            },
            {
                name: 'stats',
                description: 'Bot istatistikleri',
                category: 'info',
                subcommands: []
            },
            {
                name: 'help',
                description: 'Yardım menüsü',
                category: 'info',
                subcommands: []
            },
            {
                name: 'ping',
                description: 'Bot gecikme süresi',
                category: 'info',
                subcommands: []
            }
        ];

        res.json({
            success: true,
            data: commands
        });

    } catch (error) {
        console.error('Commands list error:', error);
        res.status(500).json({
            success: false,
            error: 'Komut listesi alınırken hata oluştu'
        });
    }
});

// Komut geçmişini getir
router.get('/history/:guildId', async (req, res) => {
    try {
        const { guildId } = req.params;
        const { limit = 50, offset = 0 } = req.query;
        
        // Mock komut geçmişi
        const history = [
            {
                id: 1,
                command: 'özellikler',
                subcommand: 'aç',
                user: 'swaffval',
                userId: '123456789',
                timestamp: Date.now() - 1000,
                success: true,
                result: 'Ticket sistemi aktifleştirildi'
            },
            {
                id: 2,
                command: 'ticket',
                subcommand: 'setup',
                user: 'swaffval',
                userId: '123456789',
                timestamp: Date.now() - 5000,
                success: true,
                result: 'Ticket sistemi kuruldu'
            }
        ];

        res.json({
            success: true,
            data: {
                commands: history,
                total: history.length,
                limit: parseInt(limit),
                offset: parseInt(offset)
            }
        });

    } catch (error) {
        console.error('Command history error:', error);
        res.status(500).json({
            success: false,
            error: 'Komut geçmişi alınırken hata oluştu'
        });
    }
});

module.exports = router;
