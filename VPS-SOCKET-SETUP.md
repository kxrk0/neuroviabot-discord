# 🔄 Real-Time Senkronizasyon Kurulumu

## 📝 .env Dosyaları

### **1. BOT .env (ana dizin)**
```bash
# /root/neuroviabot/bot/.env

# Discord Bot Token
DISCORD_TOKEN=your_discord_bot_token_here
DISCORD_CLIENT_ID=your_discord_client_id

# Backend URL (Socket.IO için)
BACKEND_URL=http://localhost:5000

# Spotify API (Müzik için)
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# Database
DATABASE_PATH=./data/database.json
```

### **2. Backend .env (mevcut - DEĞİŞMEZ)**
```bash
# /root/neuroviabot/bot/neuroviabot-backend/.env

# Server Configuration
PORT=5000
NODE_ENV=production

# Frontend URL
FRONTEND_URL=https://neuroviabot.xyz

# Webhook URLs
CONTACT_WEBHOOK_URL=your_contact_webhook_url
FEEDBACK_WEBHOOK_URL=your_feedback_webhook_url

# Discord OAuth (Passport.js)
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
DISCORD_CALLBACK_URL=https://neuroviabot.xyz/api/auth/callback

# Session Secret
SESSION_SECRET=your_session_secret_here
```

---

## 🚀 VPS Kurulum Komutları

### **Adım 1: Git Pull**
```bash
cd /root/neuroviabot/bot
git pull origin main
```

### **Adım 2: Socket.IO Client Kur**
```bash
npm install
```

### **Adım 3: Bot .env Dosyasını Kontrol Et**
```bash
# Mevcut .env'i kontrol et
cat .env

# Eğer BACKEND_URL yoksa ekle
echo "" >> .env
echo "# Backend URL (Socket.IO Real-time Sync)" >> .env
echo "BACKEND_URL=http://localhost:3001" >> .env
```

### **Adım 4: Backend Port Kontrol**
Backend'in hangi portta çalıştığını kontrol et:
```bash
cat neuroviabot-backend/.env | grep PORT
# Çıktı: PORT=5000 (ama kod 3001 kullanıyor mu?)
```

**ÖNEMLİ:** Backend `index.js` dosyasında hangi port kullanılıyor?

```bash
grep -E "listen|PORT" neuroviabot-backend/index.js
```

### **Adım 5: Doğru Backend URL'yi Belirle**

Eğer backend **5000** portunda çalışıyorsa:
```bash
# .env'de BACKEND_URL'yi güncelle
sed -i 's|BACKEND_URL=http://localhost:3001|BACKEND_URL=http://localhost:5000|g' .env
```

### **Adım 6: PM2 Restart**
```bash
pm2 restart neuroviabot
```

### **Adım 7: Logları Kontrol Et**
```bash
pm2 logs neuroviabot --lines 50 | grep -E "Backend|Socket|settings_changed"
```

---

## ✅ Beklenen Çıktı

### **Başarılı Bağlantı:**
```
✅ Backend'e bağlanıldı: http://localhost:5000
```

### **Hata (Port Yanlış):**
```
❌ Backend bağlantısı kesildi
Socket.IO hatası: connect ECONNREFUSED
```

**Çözüm:** `.env` dosyasındaki `BACKEND_URL` portunu backend'in çalıştığı port ile eşleştir.

---

## 🧪 Test Senaryosu

### **1. Frontend'te Ayar Değiştir:**
```
https://neuroviabot.xyz/manage → Leveling → Aktif Et → KAYDET
```

### **2. Bot Loglarını İzle:**
```bash
pm2 logs neuroviabot --lines 0
```

### **3. Görülmesi Gereken:**
```
🔄 Ayarlar güncellendi: Guild 123456789 - leveling
📊 Leveling ayarları güncellendi: {"enabled":true,"xpPerMessage":15}
✅ Guild 123456789 ayarları senkronize edildi
```

### **4. Discord'da Test:**
```
/level setup durum:True
/level rank
```

Ayarlar **ANINDA** aktif olacak! 🎉

---

## 📋 Özet Komutlar (Tek Satır)

```bash
cd /root/neuroviabot/bot && git pull origin main && npm install && echo -e "\n# Backend URL (Socket.IO Real-time Sync)\nBACKEND_URL=http://localhost:5000" >> .env && pm2 restart neuroviabot && pm2 logs neuroviabot --lines 30
```

**NOT:** Backend port'u kontrol et! Eğer 3001'de çalışıyorsa `BACKEND_URL=http://localhost:3001` yap.

