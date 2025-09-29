# 🚀 NeuroViaBot VPS Kurulum Rehberi

## 📋 Sistem Özeti

```
VPS: /root/neuroviabot/bot/
├── Bot (Discord)     → PM2: neuroviabot
├── Frontend (Next.js)→ PM2: neuroviabot-frontend (Port 3001)
├── Backend (Express) → PM2: neuroviabot-backend (Port 5000)
└── Caddy            → neuroviabot.xyz (Auto SSL)
```

---

## ✅ 1. TEMEL KURULUM (Zaten Yapıldı)

### Bot Kurulumu
```bash
ssh root@194.105.5.37
cd /root/neuroviabot/bot

# Dependencies
npm install

# .env dosyası
nano .env
# Token'ları yapıştır

# PM2 ile başlat
pm2 start index.js --name neuroviabot --max-memory-restart 500M
pm2 save
```

✅ **Durum:** Bot çalışıyor!

---

## 🌐 2. FRONTEND KURULUMU

### A. Dependencies Kur
```bash
cd /root/neuroviabot/bot/frontend
npm install
```

### B. .env.production Oluştur
```bash
cat > .env.production << 'EOF'
NEXT_PUBLIC_API_URL=https://neuroviabot.xyz
NEXT_PUBLIC_BOT_CLIENT_ID=773539215098249246
NODE_ENV=production
PORT=3001
EOF
```

### C. Build & Start
```bash
# Build Next.js
npm run build

# PM2 ile başlat
pm2 start npm --name neuroviabot-frontend -- start \
    --max-memory-restart 300M \
    --time \
    --log-date-format "YYYY-MM-DD HH:mm:ss"
    
pm2 save
```

---

## ⚙️ 3. BACKEND KURULUMU

### A. Dependencies Kur
```bash
cd /root/neuroviabot/bot/backend
npm install --production
```

### B. .env Oluştur
```bash
cat > .env << 'EOF'
PORT=5000
NODE_ENV=production
DISCORD_CLIENT_ID=773539215098249246
DISCORD_CLIENT_SECRET=UXxunZzBQNpkRIAlCgDGPIdcbSZNemlk
DISCORD_REDIRECT_URI=https://neuroviabot.xyz/api/auth/callback
SESSION_SECRET=[rastgele-32-karakter-string]
BOT_TOKEN=NzczNTM5MjE1MDk4MjQ5MjQ2.GpTMDe.WArQmgqTCJX_xWhHREZ75EKTKEN_DqMbUW6_ys
DATABASE_URL=../data/database.json
CORS_ORIGIN=https://neuroviabot.xyz
EOF
```

**SESSION_SECRET oluştur:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### C. Start with PM2
```bash
pm2 start index.js --name neuroviabot-backend \
    --max-memory-restart 400M \
    --time \
    --log-date-format "YYYY-MM-DD HH:mm:ss"
    
pm2 save
```

---

## 🔧 4. CADDY KURULUMU

### A. Caddy Kur (Eğer yoksa)
```bash
# Caddy kurulumu
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

### B. Caddyfile Güncelle
```bash
# Mevcut Caddyfile'a ekle
sudo nano /etc/caddy/Caddyfile
```

**Şu bloğu EKLE (mevcut ValoClass yapılandırmasının SONUNA):**

```caddy
# ==========================================
# NeuroViaBot Discord Bot Dashboard
# ==========================================
neuroviabot.xyz www.neuroviabot.xyz {
    # Backend API - Express.js (Port 5000)
    handle /api/* {
        reverse_proxy localhost:5000 {
            header_up Host {upstream_hostport}
            header_up X-Real-IP {remote_host}
            header_up X-Forwarded-For {remote_host}
            header_up X-Forwarded-Proto {scheme}
        }
    }
    
    # WebSocket support
    handle /socket.io/* {
        reverse_proxy localhost:5000
    }
    
    # Next.js static assets
    handle /_next/* {
        reverse_proxy localhost:3001
    }
    
    handle /public/* {
        reverse_proxy localhost:3001
    }
    
    handle /favicon.ico {
        reverse_proxy localhost:3001
    }
    
    # Catch-all for Next.js
    handle /* {
        reverse_proxy localhost:3001 {
            header_up Host {upstream_hostport}
            header_up X-Real-IP {remote_host}
            header_up X-Forwarded-For {remote_host}
            header_up X-Forwarded-Proto {scheme}
        }
    }
    
    # Security headers
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Content-Type-Options nosniff
        X-Frame-Options DENY
        X-XSS-Protection "1; mode=block"
        Content-Security-Policy "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://discord.com https://cdn.discordapp.com https: data:;"
        -Server
        -X-Powered-By
    }
    
    encode gzip
    
    log {
        output file /var/log/caddy/neuroviabot-access.log
        level INFO
    }
}
```

### C. Caddy'yi Test Et ve Restart
```bash
# Config test
sudo caddy validate --config /etc/caddy/Caddyfile

# Restart
sudo systemctl restart caddy

# Status kontrol
sudo systemctl status caddy

# Logs izle
sudo tail -f /var/log/caddy/neuroviabot-access.log
```

---

## 📊 5. DURUM KONTROL

### PM2 Status
```bash
pm2 status
```

Görmemiz gereken:
```
┌─────┬──────────────────────────┬─────────┬──────┐
│ id  │ name                     │ status  │ cpu  │
├─────┼──────────────────────────┼─────────┼──────┤
│ 0   │ neuroviabot              │ online  │ 0%   │
│ 1   │ neuroviabot-frontend     │ online  │ 0%   │
│ 2   │ neuroviabot-backend      │ online  │ 0%   │
└─────┴──────────────────────────┴─────────┴──────┘
```

### Port Kontrol
```bash
# Frontend (3001)
curl http://localhost:3001

# Backend (5000)
curl http://localhost:5000/health

# Caddy
curl https://neuroviabot.xyz
```

### DNS Kontrol
```bash
# A record'u kontrol et
dig neuroviabot.xyz +short

# VPS IP'sini görmeli: 194.105.5.37
```

---

## 🔧 6. SORUN GİDERME

### Frontend Çalışmıyor
```bash
# Logs kontrol
pm2 logs neuroviabot-frontend --lines 50

# Port 3001 dinliyor mu?
netstat -tulpn | grep 3001

# Manuel başlat
cd /root/neuroviabot/bot/frontend
npm run start

# Build var mı kontrol
ls -la .next/
```

### Backend Çalışmıyor
```bash
# Logs kontrol
pm2 logs neuroviabot-backend --lines 50

# Port 5000 dinliyor mu?
netstat -tulpn | grep 5000

# Manuel başlat
cd /root/neuroviabot/bot/backend
node index.js
```

### Caddy SSL Alamıyor
```bash
# Logs kontrol
sudo journalctl -u caddy -n 50 --no-pager

# DNS doğru mu?
dig neuroviabot.xyz

# Port 80 ve 443 açık mı?
sudo ufw status

# Cloudflare proxy KAPALI olmalı (DNS only)!
```

---

## 🚀 7. HIZLI DEPLOYMENT SCRIPTI

```bash
# Script'i kullan
cd /root/neuroviabot/bot
chmod +x scripts/deploy-website.sh
./scripts/deploy-website.sh
```

---

## 📝 8. GÜNLÜK KOMUTLAR

```bash
# Tüm servisleri restart
pm2 restart all

# Logları izle
pm2 logs

# Sadece frontend logları
pm2 logs neuroviabot-frontend

# Sadece backend logları
pm2 logs neuroviabot-backend

# Sadece bot logları
pm2 logs neuroviabot

# PM2 monitoring
pm2 monit

# Caddy reload (config değiştirince)
sudo systemctl reload caddy

# Caddy logs
sudo tail -f /var/log/caddy/neuroviabot-access.log
```

---

## ✅ BAŞARILI KURULUM KONTROLİ

- [ ] Bot çalışıyor (`pm2 status` → neuroviabot online)
- [ ] Frontend çalışıyor (`pm2 status` → neuroviabot-frontend online)
- [ ] Backend çalışıyor (`pm2 status` → neuroviabot-backend online)
- [ ] Caddy çalışıyor (`systemctl status caddy` → active)
- [ ] DNS doğru (`dig neuroviabot.xyz` → 194.105.5.37)
- [ ] SSL çalışıyor (`curl https://neuroviabot.xyz` → 200 OK)
- [ ] Frontend erişilebilir (https://neuroviabot.xyz)
- [ ] Backend API erişilebilir (https://neuroviabot.xyz/api/bot/stats)

---

**🎉 Kurulum Tamamlandı!**

**Website:** https://neuroviabot.xyz  
**API:** https://neuroviabot.xyz/api  
**Bot Status:** `pm2 status`

**Son Güncelleme:** 29 Eylül 2025
