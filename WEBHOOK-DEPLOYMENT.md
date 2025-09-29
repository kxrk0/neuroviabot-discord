# 🔗 Webhook-Based Deployment Sistemi

SSH key problemlerini bypass eden webhook-based otomatik deployment sistemi.

---

## 🎯 Nasıl Çalışır?

```
┌─────────────────────────────────────────────────┐
│ 1. Developer → git push origin main             │
│ 2. GitHub → Webhook gönderir                    │
│ 3. VPS Webhook Server → Webhook alır            │
│ 4. VPS → Git pull + Build + Deploy              │
│ 5. PM2 → Servisleri restart eder                │
└─────────────────────────────────────────────────┘
```

**Avantajlar:**
- ✅ SSH key problemi YOK
- ✅ Daha basit setup
- ✅ Daha hızlı deployment
- ✅ Real-time deployment

---

## 📋 Kurulum Adımları

### 1️⃣ VPS'te Webhook Server Setup

```bash
# VPS'e bağlan
ssh root@194.105.5.37

# Repo'ya git
cd /root/neuroviabot/bot

# Webhook secret oluştur
WEBHOOK_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo "WEBHOOK_SECRET=$WEBHOOK_SECRET" >> .env
echo "WEBHOOK_PORT=9000" >> .env

# Secret'ı not et (GitHub'a ekleyeceğiz)
echo "GitHub'a eklenecek secret:"
cat .env | grep WEBHOOK_SECRET
```

### 2️⃣ Webhook Server'ı PM2 ile Başlat

```bash
# PM2 ile başlat
pm2 start webhook-deploy.js --name "webhook-server"
pm2 save

# Durumu kontrol et
pm2 status
pm2 logs webhook-server --lines 20
```

### 3️⃣ Firewall ve Port Ayarları

```bash
# Port 9000'i aç (firewall varsa)
ufw allow 9000/tcp

# Test et
curl http://localhost:9000/health
```

### 4️⃣ GitHub Webhook Ayarları

1. **GitHub Repository'e git:**
   ```
   https://github.com/kxrk0/neuroviabot-discord/settings/hooks
   ```

2. **"Add webhook" butonuna tıkla**

3. **Ayarları yap:**
   - **Payload URL:** `http://194.105.5.37:9000/webhook`
   - **Content type:** `application/json`
   - **Secret:** (VPS'ten aldığın `WEBHOOK_SECRET`)
   - **SSL verification:** Enable SSL verification (eğer HTTPS kullanıyorsan)
   - **Events:** "Just the push event" seç
   - **Active:** ✅ İşaretle

4. **"Add webhook" butonuna tıkla**

### 5️⃣ Caddy Reverse Proxy (Opsiyonel - HTTPS için)

```caddy
# /etc/caddy/Caddyfile
webhook.neuroviabot.xyz {
    reverse_proxy localhost:9000
    
    log {
        output file /var/log/caddy/webhook-access.log
    }
}
```

Sonra:
```bash
caddy reload
```

Artık GitHub webhook URL'i:
```
https://webhook.neuroviabot.xyz/webhook
```

---

## 🧪 Test

### 1️⃣ Lokal Test (VPS'te):

```bash
# Webhook server'ın çalıştığını kontrol et
curl http://localhost:9000/health

# Beklenen çıktı:
# {"status":"ok","uptime":123.45,"timestamp":"2025-09-29T..."}
```

### 2️⃣ Deployment Test:

```bash
# Lokal değişiklik yap
echo "test" >> README.md
git add README.md
git commit -m "Test: Webhook deployment"
git push origin main

# VPS'te webhook loglarını izle
pm2 logs webhook-server --lines 50
```

**Beklenen çıktı:**
```
[INFO] 📨 Webhook alındı
[WEBHOOK] Event: push, Branch: refs/heads/main
[DEPLOY] 🚀 Deployment başlatılıyor...
[DEPLOY] 📥 Git pull yapılıyor...
[DEPLOY] ✅ Git pull tamamlandı
[DEPLOY] 📦 Bot dependencies kuruluyor...
[DEPLOY] ✅ Bot dependencies kuruldu
[DEPLOY] 🌐 Frontend build başlıyor...
[DEPLOY] ✅ Frontend build tamamlandı
[DEPLOY] ⚙️ Backend dependencies kuruluyor...
[DEPLOY] ✅ Backend dependencies kuruldu
[DEPLOY] 🔄 PM2 servisleri yeniden başlatılıyor...
[DEPLOY] ✅ PM2 servisleri restart edildi
[SUCCESS] 🎉 DEPLOYMENT BAŞARILI!
```

---

## 🔧 Troubleshooting

### Problem: Webhook gözükmüyor

**Çözüm:**
```bash
pm2 logs webhook-server
```

### Problem: Git pull hatası

**Çözüm:**
```bash
cd /root/neuroviabot/bot
git config --global --add safe.directory /root/neuroviabot/bot
git config user.email "webhook@neuroviabot.xyz"
git config user.name "Webhook Deploy"
```

### Problem: Permission denied

**Çözüm:**
```bash
chmod +x webhook-deploy.js
chown -R root:root /root/neuroviabot/bot
```

### Problem: Port conflict

**Çözüm:**
```bash
# Farklı port kullan
pm2 delete webhook-server
WEBHOOK_PORT=9001 pm2 start webhook-deploy.js --name "webhook-server"
pm2 save
```

---

## 📊 Monitoring

### PM2 Monitoring:

```bash
# Status
pm2 status

# Logs (real-time)
pm2 logs webhook-server

# Restart
pm2 restart webhook-server

# Stop
pm2 stop webhook-server

# Start
pm2 start webhook-server
```

### GitHub Webhook Deliveries:

https://github.com/kxrk0/neuroviabot-discord/settings/hooks

Her webhook'un delivery history'sini görebilirsin:
- Request headers
- Request body
- Response status
- Response body

---

## 🎉 Avantajlar

| Özellik | GitHub Actions (SSH) | Webhook Deploy |
|---------|---------------------|----------------|
| **Setup** | Karmaşık (SSH keys) | Basit (webhook URL) |
| **Hız** | ~5-7 dakika | ~2-3 dakika |
| **Debugging** | Zor | Kolay (local logs) |
| **Maliyet** | 2000 dk/ay limit | Unlimited |
| **Güvenilirlik** | SSH sorunları | Stabil |

---

## 🔒 Güvenlik

- ✅ Webhook secret ile imzalama
- ✅ Sadece `push` eventi kabul edilir
- ✅ Sadece `main` branch için deploy
- ✅ Signature verification
- ✅ HTTPS (Caddy ile)

---

## 📝 Özet

Bu sistem ile:
1. `git push origin main` yapıyorsun
2. GitHub webhook gönderiyor
3. VPS otomatik deploy yapıyor
4. PM2 servisleri restart ediyor
5. ✅ Deployment tamamlanıyor!

**SSH key problemi tamamen bypass ediliyor!** 🎉

