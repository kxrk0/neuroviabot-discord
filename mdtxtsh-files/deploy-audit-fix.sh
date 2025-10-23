#!/bin/bash

# ==========================================
# 📋 Audit Log Real-Time Fix Deployment
# ==========================================

echo "🚀 Audit Log Real-Time Fix Deployment başlatılıyor..."

# Git pull
echo "📥 Git pull yapılıyor..."
cd /root/neuroviabot/bot/neuroviabot-discord
git stash
git pull origin main

# Bot'u restart et
echo "🤖 Bot yeniden başlatılıyor..."
pm2 restart neuroviabot-discord

# Logları kontrol et
echo ""
echo "📋 Bot logları (son 30 satır):"
pm2 logs neuroviabot-discord --lines 30 --nostream | grep -E "Audit|Socket|Backend"

# Backend'i restart et
echo ""
echo "🔧 Backend yeniden başlatılıyor..."
cd /root/neuroviabot/bot/neuroviabot-backend
pm2 restart neuroviabot-backend

# Backend logları kontrol et
echo ""
echo "📋 Backend logları (son 20 satır):"
pm2 logs neuroviabot-backend --lines 20 --nostream | grep -E "audit|Socket"

# PM2 save
echo ""
echo "💾 PM2 durumu kaydediliyor..."
pm2 save

# Status
echo ""
echo "📊 Servis durumları:"
pm2 status

echo ""
echo "✅ Deployment tamamlandı!"
echo ""
echo "📋 Kontrol listesi:"
echo "  ✅ Bot logunda '📋 Audit Log Handler initialized' var mı?"
echo "  ✅ Bot logunda '📋 Audit Logger Socket.IO client set' var mı?"
echo "  ✅ Bot logunda '✅ Backend'e bağlanıldı' var mı?"
echo ""
echo "🧪 Test adımları:"
echo "  1. Discord sunucusunda bir işlem yap (mesaj sil, üye at, rol oluştur)"
echo "  2. Manage panelinde Denetim Günlüğü sayfasını aç"
echo "  3. Yeni log'un 1-2 saniye içinde görünmesini bekle"
echo ""
echo "🔍 Debug komutları:"
echo "  pm2 logs neuroviabot-discord --lines 100 | grep Audit"
echo "  pm2 logs neuroviabot-backend --lines 50 | grep audit"

