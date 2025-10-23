#!/bin/bash

# ==========================================
# 📋 Real-Time Audit Log System Deployment
# ==========================================

echo "🚀 Real-Time Audit Log System Deployment başlatılıyor..."

# 1. Git pull (en son değişiklikleri al)
echo "📥 Git pull yapılıyor..."
cd /root/neuroviabot/bot/neuroviabot-discord
git stash
git pull origin main

# 2. Bot'u yeniden başlat
echo "🤖 Bot yeniden başlatılıyor..."
pm2 restart neuroviabot-discord

# 3. Backend'i yeniden başlat
echo "🔧 Backend yeniden başlatılıyor..."
cd /root/neuroviabot/bot/neuroviabot-backend
pm2 restart neuroviabot-backend

# 4. Frontend'i rebuild ve restart
echo "🎨 Frontend rebuild ediliyor..."
cd /root/neuroviabot/bot/neuroviabot-frontend

# Dependencies check (sadece gerekiyorsa)
if [ ! -d "node_modules" ]; then
    echo "📦 Dependencies yükleniyor..."
    npm install --legacy-peer-deps
fi

# Build
echo "🔨 Build yapılıyor..."
npm run build

# Restart
echo "♻️ Frontend yeniden başlatılıyor..."
pm2 restart neuroviabot-frontend

# 5. PM2 save
echo "💾 PM2 durumu kaydediliyor..."
pm2 save

# 6. Status check
echo "📊 Servis durumları:"
pm2 status

echo ""
echo "✅ Deployment tamamlandı!"
echo ""
echo "📋 Test adımları:"
echo "1. Manage paneline git: https://neuroviabot.xyz/manage/{serverId}"
echo "2. 'Denetim Günlüğü' sekmesini aç"
echo "3. Discord sunucusunda bir işlem yap (mesaj sil, üye at, rol oluştur, vb.)"
echo "4. Audit log'un real-time güncellendiğini kontrol et"
echo ""
echo "🎉 Audit Log System hazır!"

