#!/bin/bash
# ==========================================
# 🚨 ACIL VPS FIX - SESSION_SECRET Sorunu
# ==========================================
# VPS'de SSH ile bağlandıktan sonra bu komutları çalıştırın

cd /root/neuroviabot/bot

echo "📋 Mevcut .env içeriğini kontrol ediyorum..."
cat .env

echo ""
echo "🔐 SESSION_SECRET ekleniyor/güncelleniyor..."

# SESSION_SECRET'ı sil (varsa)
sed -i '/SESSION_SECRET/d' .env

# Yeni SESSION_SECRET ekle
echo "SESSION_SECRET=fdd863a42064ec909542df57b48d3f160d6f6ccc36ce8e31c303d480e1f03186" >> .env

echo ""
echo "✅ Güncellenmiş .env içeriği:"
cat .env

echo ""
echo "🔥 PM2 tamamen yeniden başlatılıyor..."
pm2 kill

sleep 2

echo ""
echo "🚀 PM2 Ecosystem başlatılıyor..."
pm2 start PM2-ECOSYSTEM.config.js

sleep 3

echo ""
echo "💾 PM2 konfigürasyonu kaydediliyor..."
pm2 save

echo ""
echo "📊 PM2 Status:"
pm2 status

echo ""
echo "🔍 Webhook-deploy logları (son 20 satır):"
pm2 logs webhook-deploy --lines 20

echo ""
echo "✅ Fix tamamlandı! Webhook-deploy 'Ready to receive webhooks!' mesajını vermeli."
echo "🧪 GitHub'dan push yaparak test edin!"

