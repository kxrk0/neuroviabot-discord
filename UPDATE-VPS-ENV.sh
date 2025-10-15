#!/bin/bash

# ==========================================
# VPS'de Dev-Panel için .env Dosyalarını Güncelle
# ==========================================

echo "🔧 Dev-Panel .env dosyaları güncelleniyor..."
echo ""

# Backend .env dosyasını güncelle
echo "📝 Backend .env güncelleniyor..."
cat >> /root/neuroviabot/bot/neuroviabot-backend/.env << 'EOF'

# Bot API Configuration (Developer Panel)
BOT_API_URL=http://localhost:3002
BOT_API_KEY=neuroviabot-secure-api-key-2024-production
EOF

echo "✅ Backend .env güncellendi!"
echo ""

# Bot .env dosyasını güncelle
echo "📝 Bot .env güncelleniyor..."
cat >> /root/neuroviabot/bot/.env << 'EOF'

# Bot API Key (Developer Panel Authentication)
BOT_API_KEY=neuroviabot-secure-api-key-2024-production
EOF

echo "✅ Bot .env güncellendi!"
echo ""

# Servisleri restart et
echo "🔄 Servisler yeniden başlatılıyor..."
pm2 restart neuroviabot-backend
sleep 2
pm2 restart neuroviabot

echo ""
echo "✅ DEV-PANEL KONFIGÜRASYONU TAMAMLANDI!"
echo ""
echo "📊 Servis durumları:"
pm2 status

echo ""
echo "🎯 Dev-Panel'i test et: https://neuroviabot.xyz/dev-panel"

