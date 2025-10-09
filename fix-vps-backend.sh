#!/bin/bash

echo "🔧 VPS Backend Sorununu Çözme Scripti"
echo "====================================="

# VPS'e bağlan ve backend'i yeniden başlat
echo "📡 VPS'e bağlanılıyor..."

ssh root@194.105.5.37 << 'EOF'
echo "✅ VPS'e bağlandı"
echo "📁 Proje dizinine geçiliyor..."
cd /root/neuroviabot/bot

echo "🔄 Değişiklikleri çekiliyor..."
git pull origin main

echo "🛑 Backend'i durduruluyor..."
pm2 stop neuroviabot-backend

echo "🛑 Bot'u durduruluyor..."
pm2 stop neuroviabot

echo "🛑 Frontend'i durduruluyor..."
pm2 stop neuroviabot-frontend

echo "⏳ 5 saniye bekleniyor..."
sleep 5

echo "🚀 Backend'i başlatılıyor..."
pm2 start neuroviabot-backend

echo "🚀 Bot'u başlatılıyor..."
pm2 start neuroviabot

echo "🚀 Frontend'i başlatılıyor..."
pm2 start neuroviabot-frontend

echo "⏳ 10 saniye bekleniyor..."
sleep 10

echo "📊 PM2 durumu:"
pm2 status

echo "🔍 Backend logları (son 20 satır):"
pm2 logs neuroviabot-backend --lines 20

echo "🔍 Bot logları (son 20 satır):"
pm2 logs neuroviabot --lines 20

echo "🔍 Frontend logları (son 20 satır):"
pm2 logs neuroviabot-frontend --lines 20

echo "🌐 Port kontrolü:"
netstat -tlnp | grep 5000
netstat -tlnp | grep 3002

echo "✅ VPS backend sorunu çözüldü!"
EOF

echo "🎉 Script tamamlandı!"
