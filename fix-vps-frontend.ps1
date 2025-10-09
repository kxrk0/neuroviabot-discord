# VPS Frontend Sorununu Çözme Scripti
Write-Host "🔧 VPS Frontend Sorununu Çözme Scripti" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# VPS'e bağlan ve frontend'i yeniden build et
Write-Host "📡 VPS'e bağlanılıyor..." -ForegroundColor Yellow

$commands = @"
echo "✅ VPS'e bağlandı"
echo "📁 Proje dizinine geçiliyor..."
cd /root/neuroviabot/bot

echo "🔄 Değişiklikleri çekiliyor..."
git pull origin main

echo "🛑 Frontend'i durduruluyor..."
pm2 stop neuroviabot-frontend

echo "🗑️ Eski .next dizinini siliyor..."
rm -rf neuroviabot-frontend/.next

echo "📦 Frontend dependencies kontrol ediliyor..."
cd neuroviabot-frontend
npm install

echo "🔨 Frontend build ediliyor..."
npm run build

echo "✅ Build tamamlandı!"
echo "📁 .next dizini oluşturuldu:"
ls -la .next/

echo "🚀 Frontend'i başlatılıyor..."
cd ..
pm2 start neuroviabot-frontend

echo "⏳ 10 saniye bekleniyor..."
sleep 10

echo "📊 PM2 durumu:"
pm2 status

echo "🔍 Frontend logları (son 20 satır):"
pm2 logs neuroviabot-frontend --lines 20

echo "🌐 Port kontrolü:"
netstat -tlnp | grep 3000

echo "✅ VPS frontend sorunu çözüldü!"
"@

# SSH ile VPS'e bağlan
ssh root@194.105.5.37 $commands

Write-Host "🎉 Script tamamlandı!" -ForegroundColor Green
