# 🔍 Auth Debug Checklist - neuroviabot.xyz

## ❌ Hata: `/api/auth/error` - Hala yönlendiriyor

## 📋 Kontrol Listesi

### 1. Discord Developer Portal Kontrolü

**ÇOK ÖNEMLİ**: Bu **TAM** URL'nin Discord Developer Portal'da olması gerekiyor:

```
https://neuroviabot.xyz/api/auth/callback/discord
```

⚠️ **DİKKAT**:
- URL'de `https://` olmalı (http değil!)
- URL sonunda `/discord` olmalı
- Slash'ler doğru olmalı
- Domain doğru olmalı

#### Adımlar:
1. [Discord Developer Portal](https://discord.com/developers/applications) → Uygulamanı seç
2. **OAuth2** → **General** → **Redirects** bölümü
3. Şu URL'nin **AYNEN** ekli olduğunu kontrol et:
   ```
   https://neuroviabot.xyz/api/auth/callback/discord
   ```
4. **Save Changes** bas

### 2. VPS Environment Variables Kontrolü

SSH ile VPS'e bağlan ve kontrol et:

```bash
ssh user@your-vps-ip
cd /path/to/neuroviabot-discord/neuroviabot-frontend
cat .env.local
```

**Olması gerekenler**:

```env
# Discord OAuth
DISCORD_CLIENT_ID=773539215098249246
DISCORD_CLIENT_SECRET=your_actual_secret_here

# NextAuth - ÇOK ÖNEMLİ!
NEXTAUTH_URL=https://neuroviabot.xyz
NEXTAUTH_URL_INTERNAL=https://neuroviabot.xyz
NEXTAUTH_SECRET=your_random_secret_here

# Session Secret
SESSION_SECRET=your_random_secret_here

# API
NEXT_PUBLIC_API_URL=https://neuroviabot.xyz
NEXT_PUBLIC_BOT_CLIENT_ID=773539215098249246

# Environment
NODE_ENV=production
```

⚠️ **ÖNEMLİ KONTROLLER**:
- ✅ `NEXTAUTH_URL` sonunda `/` YOK
- ✅ `https://` ile başlıyor (http değil!)
- ✅ `DISCORD_CLIENT_SECRET` dolu
- ✅ `NEXTAUTH_SECRET` dolu (minimum 32 karakter)

### 3. Client Secret Kontrolü

Discord Developer Portal'da:
1. **OAuth2** → **General**
2. **Client Secret** → **Reset Secret** (yeni secret oluştur)
3. Yeni secret'i kopyala
4. VPS'deki `.env.local` dosyasına yapıştır:
   ```bash
   nano .env.local
   # DISCORD_CLIENT_SECRET satırını güncelle
   ```

### 4. PM2 Restart

```bash
cd /path/to/neuroviabot-discord
git pull origin main
cd neuroviabot-frontend
npm install
npm run build
pm2 restart neuroviabot-frontend
pm2 logs neuroviabot-frontend --lines 50
```

### 5. Browser Test

1. **Önce cookies'i temizle**:
   - `Ctrl + Shift + Delete`
   - Time range: All time
   - Cookies and site data: ✅
   - Clear data

2. `https://neuroviabot.xyz/login` adresine git

3. **F12** → **Console** tab'ini aç (hataları görmek için)

4. **F12** → **Network** tab'ini aç

5. "Continue with Discord" butonuna bas

6. **Network** tab'inde şunları kontrol et:
   - `/api/auth/signin` request'i olmalı
   - Discord'a redirect olmalı
   - Discord'dan geri dönünce `/api/auth/callback/discord` request'i olmalı

### 6. Debug Logs Kontrolü

Debug mode açık, PM2 logs'ta şunları ara:

```bash
pm2 logs neuroviabot-frontend --lines 100 | grep -i "auth\|discord\|error"
```

Şunları görmelisin:
- `[auth][debug] session callback`
- `[auth][debug] jwt callback`
- Hata varsa gösterir

### 7. Nginx Proxy Kontrolü

```bash
sudo nano /etc/nginx/sites-available/neuroviabot.xyz
```

Şu location olmalı:

```nginx
location /api/auth/ {
    proxy_pass http://localhost:3001/api/auth/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

Nginx'i restart et:

```bash
sudo nginx -t
sudo systemctl restart nginx
```

### 8. Port Kontrolü

Frontend'in 3001 portunda çalıştığından emin ol:

```bash
pm2 list
# neuroviabot-frontend portunu kontrol et

# Eğer yanlış portsa:
pm2 delete neuroviabot-frontend
cd /path/to/neuroviabot-discord/neuroviabot-frontend
PORT=3001 pm2 start npm --name "neuroviabot-frontend" -- start
pm2 save
```

## 🔍 Hata Mesajları ve Çözümleri

### Error: "Configuration" veya "Invalid callback URL"
**Çözüm**: Discord Developer Portal'da redirect URL'yi kontrol et

### Error: "Session required"
**Çözüm**: `NEXTAUTH_SECRET` set edilmemiş

### Error: "OAuth access denied"
**Çözüm**: User Discord'da "Cancel" butonuna basmış, tekrar dene

### Error: "Missing client secret"
**Çözüm**: `.env.local` dosyasında `DISCORD_CLIENT_SECRET` yok veya yanlış

### 404 Error on callback
**Çözüm**: Nginx proxy yanlış veya frontend çalışmıyor

## ✅ Başarılı Auth Flow

Doğru çalıştığında:

1. `/login` → Login sayfası açılır
2. "Continue with Discord" → Discord OAuth sayfası açılır
3. "Authorize" → Discord yetki verir
4. `https://neuroviabot.xyz/api/auth/callback/discord?code=...` → Callback
5. `/dashboard/servers` → Dashboard'a yönlendirilir

## 📞 Hala Çalışmıyorsa

Şunları gönder:
1. PM2 logs (`pm2 logs neuroviabot-frontend --lines 100`)
2. Browser console screenshot (F12)
3. Discord Developer Portal Redirects screenshot
4. `.env.local` içeriği (secretler hariç):
   ```bash
   cat .env.local | grep -v "SECRET\|secret"
   ```
