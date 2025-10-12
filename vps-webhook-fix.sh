#!/bin/bash
# VPS'de çalıştırılacak webhook fix script'i

echo "🔧 NeuroViaBot Webhook Fix Başlatılıyor..."
echo ""

# Repo dizinine git
cd /root/neuroviabot/bot

echo "📥 Git pull yapılıyor..."
git pull origin main

echo ""
echo "🔐 SESSION_SECRET kontrol ediliyor..."

# .env dosyasında SESSION_SECRET var mı kontrol et
if grep -q "SESSION_SECRET=" .env 2>/dev/null; then
    echo "✅ SESSION_SECRET zaten mevcut"
else
    echo "⚠️ SESSION_SECRET bulunamadı, ekleniyor..."
    echo "SESSION_SECRET=fdd863a42064ec909542df57b48d3f160d6f6ccc36ce8e31c303d480e1f03186" >> .env
    echo "✅ SESSION_SECRET eklendi"
fi

echo ""
echo "🔄 PM2 servisleri yeniden başlatılıyor..."

# Webhook-deploy var mı kontrol et
if pm2 list | grep -q webhook-deploy; then
    echo "Webhook-deploy restart ediliyor..."
    pm2 restart webhook-deploy
else
    echo "Webhook-deploy başlatılıyor..."
    pm2 start webhook-deploy.js --name webhook-deploy
fi

# Bot servisleri restart
pm2 restart neuroviabot
pm2 restart neuroviabot-backend
pm2 restart neuroviabot-frontend

pm2 save

echo ""
echo "📊 PM2 Status:"
pm2 status

echo ""
echo "✅ Webhook fix tamamlandı!"
echo ""
echo "🔍 Webhook loglarını görmek için:"
echo "   pm2 logs webhook-deploy"
echo ""
echo "🧪 GitHub'dan push yaparak test edin!"

