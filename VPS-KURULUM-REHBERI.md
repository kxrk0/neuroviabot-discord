# 🚀 VPS Kurulum Rehberi - neuroviabot.xyz

## ✅ Discord Redirects Kontrolü

Ekran görüntünde gördüğüm redirects **DOĞRU**:
```
✓ https://neuroviabot.xyz/api/auth/callback/discord
✓ http://localhost:5000/api/auth/callback
✓ http://localhost:3001/api/auth/callback/discord
```

**Discord tarafı tamam!** ✅

---

## 🔧 VPS'te Yapman Gerekenler

### 1️⃣ Environment Variables Ayarla

VPS'ine SSH ile bağlan:
```bash
ssh root@neuroviabot.xyz
# veya
ssh user@your-server-ip
```

#### Frontend için `.env.production` oluştur:

```bash
cd /var/www/neuroviabot-discord/neuroviabot-frontend
# veya projenin bulunduğu klasör

# .env.production dosyasını oluştur
nano .env.production
```

**İçine şunları ekle:**
```env
# Discord OAuth
DISCORD_CLIENT_ID=773539215098249246
DISCORD_CLIENT_SECRET=buraya_discord_client_secret_yaz

# NextAuth
NEXTAUTH_URL=https://neuroviabot.xyz
NEXTAUTH_SECRET=buraya_random_secret_oluştur

# API
NEXT_PUBLIC_API_URL=https://neuroviabot.xyz
NEXT_PUBLIC_BOT_CLIENT_ID=773539215098249246

# Environment
NODE_ENV=production
```

**Kaydet:** `Ctrl + X`, sonra `Y`, sonra `Enter`

---

### 2️⃣ NEXTAUTH_SECRET Oluştur

VPS terminalinde çalıştır:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Çıkan değeri kopyala** ve `.env.production` dosyasındaki `NEXTAUTH_SECRET` yerine yapıştır.

Örnek:
```env
NEXTAUTH_SECRET=KzY8vH9fJ2mN4pQ1rS6tU7vW8xY9zA0bC1dE2fG3hH4=
```

---

### 3️⃣ DISCORD_CLIENT_SECRET'ı Al

1. [Discord Developer Portal](https://discord.com/developers/applications) → Uygulamayı aç
2. **OAuth2** → **General**
3. **"Client Secret"** bölümünde:
   - Eğer secret'ı bilmiyorsan → **"Reset Secret"** tıkla
   - Yeni secret'ı **kopyala**

4. VPS'te `.env.production` dosyasına yapıştır:
```env
DISCORD_CLIENT_SECRET=vH9fJ2mN4pQ1rS6tU7vW8xY9zA0bC1dE2fG3hH4iJ5k
```

---

### 4️⃣ Backend için de Environment Variables

```bash
cd /var/www/neuroviabot-discord/neuroviabot-backend

nano .env
```

**İçine ekle:**
```env
# Discord Bot
DISCORD_CLIENT_ID=773539215098249246
DISCORD_CLIENT_SECRET=yukarıdaki_aynı_secret

# Server
PORT=5000
NODE_ENV=production

# Frontend URL
FRONTEND_URL=https://neuroviabot.xyz

# Callback
DISCORD_CALLBACK_URL=https://neuroviabot.xyz/api/auth/callback

# Session
SESSION_SECRET=başka_bir_random_secret_oluştur
```

Session secret için:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

### 5️⃣ Git'ten Son Değişiklikleri Çek

```bash
cd /var/www/neuroviabot-discord
# veya projenin ana dizini

git pull origin main
```

---

### 6️⃣ Frontend Build & Restart

```bash
cd neuroviabot-frontend

# Dependencies güncelle
npm install

# Production build
npm run build

# PM2 ile restart (eğer PM2 kullanıyorsan)
pm2 restart neuroviabot-frontend

# Veya direkt node ile çalıştırıyorsan:
pm2 start npm --name "neuroviabot-frontend" -- start

# PM2 yoksa önce kur:
npm install -g pm2
```

---

### 7️⃣ Backend Restart

```bash
cd /var/www/neuroviabot-discord/neuroviabot-backend

# Dependencies güncelle
npm install

# Restart
pm2 restart neuroviabot-backend

# İlk kez başlatıyorsan:
pm2 start index.js --name "neuroviabot-backend"
```

---

### 8️⃣ PM2 Process Listesi Kontrol

```bash
pm2 list
```

**Göreceğin:**
```
┌─────┬────────────────────────┬─────────┬─────────┬──────────┐
│ id  │ name                   │ status  │ restart │ uptime   │
├─────┼────────────────────────┼─────────┼─────────┼──────────┤
│ 0   │ neuroviabot-frontend   │ online  │ 0       │ 5s       │
│ 1   │ neuroviabot-backend    │ online  │ 0       │ 3s       │
└─────┴────────────────────────┴─────────┴─────────┴──────────┘
```

Her ikisi de **online** olmalı! ✅

---

### 9️⃣ Nginx Konfigürasyonu Kontrol

Nginx config dosyasını kontrol et:
```bash
cat /etc/nginx/sites-available/neuroviabot.xyz
# veya
cat /etc/nginx/conf.d/neuroviabot.conf
```

**Olması gereken:**
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name neuroviabot.xyz www.neuroviabot.xyz;
    
    # HTTPS'e yönlendir
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name neuroviabot.xyz www.neuroviabot.xyz;

    # SSL Sertifikası (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/neuroviabot.xyz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/neuroviabot.xyz/privkey.pem;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Nginx'i test et ve reload et:**
```bash
# Test
sudo nginx -t

# Reload
sudo systemctl reload nginx
```

---

### 🔟 Port Kontrolü

Frontend ve backend doğru portlarda çalışıyor mu?

```bash
# Frontend 3000 portunda mı?
sudo netstat -tlnp | grep 3000

# Backend 5000 portunda mı?
sudo netstat -tlnp | grep 5000
```

**Göreceğin:**
```
tcp  0  0 0.0.0.0:3000  0.0.0.0:*  LISTEN  12345/node
tcp  0  0 0.0.0.0:5000  0.0.0.0:*  LISTEN  12346/node
```

---

## ✅ Test Et

### 1. Browser Cookies Temizle
- `F12` (Developer Tools)
- **Application** → **Cookies** → `neuroviabot.xyz` → **Clear all**

### 2. Login Dene
1. `https://neuroviabot.xyz/login` git
2. **"Continue with Discord"** butonuna tıkla
3. Discord yetkilendirme sayfası açılmalı
4. **"Authorize"** tıkla
5. ✅ `/dashboard/servers` sayfasına yönlenmeli

---

## 🐛 Hata Çözme

### Hata 1: "Cannot connect to backend"

**Çözüm:**
```bash
# Backend çalışıyor mu?
pm2 list

# Log kontrol
pm2 logs neuroviabot-backend

# Restart
pm2 restart neuroviabot-backend
```

### Hata 2: "502 Bad Gateway"

**Çözüm:**
```bash
# Frontend çalışıyor mu?
pm2 list

# Log kontrol
pm2 logs neuroviabot-frontend

# Port kontrolü
sudo netstat -tlnp | grep 3000

# Restart
pm2 restart neuroviabot-frontend
```

### Hata 3: "redirect_uri_mismatch"

**Discord redirect URL'leri tekrar kontrol et:**
- ✅ `https://neuroviabot.xyz/api/auth/callback/discord`

### Hata 4: "Configuration error"

**Environment variables kontrol:**
```bash
cd neuroviabot-frontend
cat .env.production

# Olması gerekenler:
# ✓ NEXTAUTH_SECRET var mı?
# ✓ DISCORD_CLIENT_SECRET var mı?
# ✓ NEXTAUTH_URL = https://neuroviabot.xyz
```

---

## 📋 Final Checklist - VPS

```
☑ SSH ile VPS'e bağlandım
☑ Git pull yaptım (son değişiklikler)
☑ Frontend .env.production oluşturdum
☑ Backend .env oluşturdum
☑ NEXTAUTH_SECRET generate ettim (32+ karakter)
☑ DISCORD_CLIENT_SECRET Discord'dan aldım
☑ SESSION_SECRET generate ettim
☑ npm install yaptım (frontend + backend)
☑ npm run build yaptım (frontend)
☑ pm2 restart yaptım (her ikisi de)
☑ pm2 list - her ikisi de online
☑ Nginx config doğru
☑ Port 3000 ve 5000 çalışıyor
☑ HTTPS çalışıyor (SSL sertifikası)
☑ Browser cookies temizledim
☑ Test login başarılı
```

---

## 🔐 Güvenlik İpuçları

### .env Dosyalarını Gitignore'a Ekle

```bash
cd /var/www/neuroviabot-discord

# .gitignore dosyasını kontrol et
cat .gitignore

# Olması gerekenler:
# .env
# .env.production
# .env.local
```

### File Permissions

```bash
# .env dosyalarını sadece owner okuyabilsin
chmod 600 neuroviabot-frontend/.env.production
chmod 600 neuroviabot-backend/.env
```

---

## 🚀 PM2 Startup (Sunucu Yeniden Başlayınca Otomatik Başlat)

```bash
# PM2'yi startup'a ekle
pm2 startup

# Çıkan komutu çalıştır (sudo ile başlayacak)
# Örnek: sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u user --hp /home/user

# Şu anki process'leri kaydet
pm2 save
```

Artık sunucu yeniden başladığında bot ve dashboard otomatik başlayacak! ✅

---

## 📊 Monitoring

### Logları İzle

```bash
# Tüm loglar
pm2 logs

# Sadece frontend
pm2 logs neuroviabot-frontend

# Sadece backend
pm2 logs neuroviabot-backend

# Logları temizle
pm2 flush
```

### Process İstatistikleri

```bash
pm2 monit
```

---

**Özet:** VPS'te yapman gereken:
1. `.env.production` ve `.env` dosyalarını oluştur
2. Secret'ları generate et ve ekle
3. Git pull + npm install + build
4. PM2 restart
5. Test et

Hepsi bu! 🚀
