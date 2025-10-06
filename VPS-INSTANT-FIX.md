# 🔥 VPS INSTANT FIX - Manuel Komutlar

Bu komutları VPS'de sırayla çalıştır:

## 1️⃣ Analytics StartTime Hatası Düzelt
```bash
cd /root/neuroviabot/bot
nano src/utils/analytics.js
# Line 17'de: startTime: Date.now(), ekle
```

Veya otomatik:
```bash
cd /root/neuroviabot/bot
sed -i '/system: {/a\                startTime: Date.now(),' src/utils/analytics.js
```

## 2️⃣ Database Kontrol
```bash
cd /root/neuroviabot/bot
ls -lah data/database.json
cat data/database.json | jq '.members | keys | length'
```

## 3️⃣ Level Komut Flags Düzelt
```bash
cd /root/neuroviabot/bot
sed -i 's/ephemeral: true/flags: [4096]/g' src/commands/level.js
```

## 4️⃣ Frontend Rebuild
```bash
cd /root/neuroviabot/bot/neuroviabot-frontend
rm -rf .next
npm run build
```

## 5️⃣ PM2 Restart
```bash
pm2 restart neuroviabot
pm2 restart neuroviabot-frontend
sleep 3
pm2 logs neuroviabot --lines 20 --nostream
```

## 🚀 TEK KOMUTTA TÜMÜ:
```bash
cd /root/neuroviabot/bot && \
sed -i '/system: {/a\                startTime: Date.now(),' src/utils/analytics.js && \
sed -i 's/ephemeral: true/flags: [4096]/g' src/commands/level.js && \
cd neuroviabot-frontend && \
rm -rf .next && \
npm run build && \
cd .. && \
pm2 restart all && \
sleep 3 && \
pm2 logs neuroviabot --lines 20 --nostream
```

