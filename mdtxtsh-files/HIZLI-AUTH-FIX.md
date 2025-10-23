# ⚡ Hızlı Auth Hatası Çözümü

## ❌ Hata: https://neuroviabot.xyz/api/auth/error

## ✅ Çözüm (VPS için):

### 1. Discord Developer Portal'da Redirect URL Kontrolü

1. [Discord Developer Portal](https://discord.com/developers/applications)'a git
2. Application'ını seç (Client ID: `773539215098249246`)
3. **OAuth2** → **General** → **Redirects** bölümüne git
4. Bu URL'nin ekli olduğundan **EMİN OL**:

```
https://neuroviabot.xyz/api/auth/callback/discord
```

⚠️ **ÖNEMLİ**: URL'de `/discord` sonunda olmalı!

5. **Save Changes** butonuna bas

### 2. VPS'de Environment Variables

VPS'e SSH ile bağlan ve şu dosyayı oluştur/düzenle:

```bash
ssh user@your-vps-ip
cd /path/to/neuroviabot-discord/neuroviabot-frontend
nano .env.local
```

`.env.local` dosyasına şunları yaz:

```env
# Discord OAuth
DISCORD_CLIENT_ID=773539215098249246
DISCORD_CLIENT_SECRET=buraya_discord_client_secretini_yaz

# NextAuth - PRODUCTION
NEXTAUTH_URL=https://neuroviabot.xyz
NEXTAUTH_URL_INTERNAL=https://neuroviabot.xyz
NEXTAUTH_SECRET=buraya_random_secret_yaz

# Session Secret (yedek)
SESSION_SECRET=buraya_ayni_random_secreti_yaz

# API Configuration
NEXT_PUBLIC_API_URL=https://neuroviabot.xyz
NEXT_PUBLIC_BOT_CLIENT_ID=773539215098249246

# Environment
NODE_ENV=production
```

### 3. Secret Oluşturma

VPS'de şu komutu çalıştır:

```bash
openssl rand -base64 32
```

Çıkan değeri kopyala ve `NEXTAUTH_SECRET` ve `SESSION_SECRET` değerlerine yapıştır.

### 4. Rebuild & Restart

```bash
cd /path/to/neuroviabot-discord
git pull origin main
cd neuroviabot-frontend
npm install
npm run build
pm2 restart neuroviabot-frontend
```

### 5. Nginx Kontrolü

Nginx config'inde `/api/auth/` route'unun doğru proxy'lendiğinden emin ol:

```bash
sudo nano /etc/nginx/sites-available/neuroviabot.xyz
```

Şu satırlar olmalı:

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
sudo systemctl restart nginx
```

### 6. Test Et

1. Browser'ı aç (Chrome/Firefox)
2. `Ctrl + Shift + Delete` → Clear all cookies for `neuroviabot.xyz`
3. `https://neuroviabot.xyz/login` adresine git
4. "Continue with Discord" butonuna bas
5. Discord'a yönlendirmeli ve geri dönmeli

## 🔍 Sorun Devam Ederse

### A. Discord Client Secret Kontrolü

Discord Developer Portal'da:
1. **OAuth2** → **General**
2. **Client Secret** → **Reset Secret** (yeni secret oluştur)
3. Yeni secret'i kopyala
4. VPS'deki `.env.local` dosyasına yapıştır
5. Rebuild & restart yap

### B. PM2 Logs Kontrolü

```bash
pm2 logs neuroviabot-frontend
```

Hata mesajlarına bak. Genelde şunlardan biri olur:
- `NEXTAUTH_SECRET` tanımlı değil
- `DISCORD_CLIENT_SECRET` yanlış
- Redirect URL Discord'da yok

### C. Browser Console Kontrolü

1. `F12` → Console
2. Hata mesajlarını oku
3. Network tab'inde `/api/auth/` requestlerini izle

## ✅ Sonuç

Auth sistemi şimdi eski çalışan haline döndü:
- ✅ Eski scope ayarları
- ✅ SESSION_SECRET desteği eklendi
- ✅ Gereksiz debug/prompt ayarları kaldırıldı
- ✅ Production URL'leri doğru set edildi

## 📞 Hala Çalışmıyorsa

1. `.env.local` dosyasının içeriğini kontrol et (secretler dışında)
2. Discord Developer Portal screenshot'u gönder
3. PM2 logs'u paylaş (`pm2 logs neuroviabot-frontend --lines 50`)
