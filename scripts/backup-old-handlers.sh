#!/bin/bash

# 🔧 Backup All Old Sequelize Handlers
# Sadece loggingHandler ve levelingHandler kalacak (simple-db kullananlar)

REPO_PATH="/root/neuroviabot/bot"

echo "🔍 Eski Sequelize handler'larını yedekliyorum..."
cd $REPO_PATH/src/handlers

# İlk önce guardHandler'ı sil (zaten backup var)
echo "🗑️  guardHandler.js siliniyor..."
rm -f guardHandler.js

# Diğer eski handler'ları yedekle
echo "📦 Eski handler'lar yedekleniyor..."

# Sequelize kullanan handler'lar
for handler in welcomeHandler.js verificationHandler.js ticketHandler.js roleReactionHandler.js giveawayHandler.js customCommandHandler.js backupHandler.js; do
    if [ -f "$handler" ]; then
        echo "  ✅ $handler → ${handler}.backup"
        mv "$handler" "${handler}.old_$(date +%Y%m%d)" 2>/dev/null || true
    fi
done

echo ""
echo "📋 Kalan aktif handler'lar (simple-db kullananlar):"
ls -lah | grep -E "loggingHandler|levelingHandler" | grep -v backup

echo ""
echo "📦 Yedeklenen dosyalar:"
ls -lah | grep -E "\.backup|\.old_"

echo ""
echo "✅ Temizleme tamamlandı!"
echo ""
echo "🔄 PM2'yi yeniden başlat: pm2 restart neuroviabot"
echo "📊 Logları kontrol et: pm2 logs neuroviabot --err --lines 20"

