# 🔐 GitHub Secrets Configuration Guide

Bu rehber, NeuroViaBot için gerekli GitHub Secrets yapılandırmasını adım adım açıklar.

## 📍 GitHub Secrets'a Erişim

1. Repository'nize gidin: https://github.com/kxrk0/neuroviabot-discord
2. **Settings** sekmesine tıklayın
3. Sol menüden **Secrets and variables** > **Actions** seçin
4. **New repository secret** butonuna tıklayın

---

## 🤖 Discord Bot Secrets (Zorunlu)

### DISCORD_TOKEN
```
Name: DISCORD_TOKEN
Secret: NzczNTM5MjE1MDk4MjQ5MjQ2.GpTMDe.WArQmgqTCJX_xWhHREZ75EKTKEN_DqMbUW6_ys
```
**Açıklama:** Discord bot token'ı. Bot'un Discord'a bağlanması için gerekli.

### DISCORD_CLIENT_ID
```
Name: DISCORD_CLIENT_ID
Secret: 773539215098249246
```
**Açıklama:** Discord bot'unuzun Application ID'si.

### DISCORD_CLIENT_SECRET
```
Name: DISCORD_CLIENT_SECRET
Secret: UXxunZzBQNpkRIAlCgDGPIdcbSZNemlk
```
**Açıklama:** Discord OAuth için gerekli secret key.

---

## 🖥️ VPS Secrets (Deployment için Zorunlu)

### VPS_SSH_KEY
```
Name: VPS_SSH_KEY
Secret: [SSH Private Key İçeriği]
```
**Nasıl Alınır:**
```bash
# VPS'te SSH key oluştur
ssh-keygen -t rsa -b 4096 -C "github-actions"

# Private key'i göster
cat ~/.ssh/id_rsa

# Public key'i authorized_keys'e ekle
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
```
⚠️ **ÖNEMLİ:** `-----BEGIN RSA PRIVATE KEY-----` ile başlayan PRIVATE key'i ekleyin!

### VPS_HOST
```
Name: VPS_HOST
Secret: [VPS IP Adresi]
```
**Örnek:** `123.45.67.89` veya `vps.yourdomain.com`

### VPS_USER
```
Name: VPS_USER
Secret: root
```
**Açıklama:** VPS kullanıcı adınız (root kullanıcısı)

### VPS_BOT_PATH
```
Name: VPS_BOT_PATH
Secret: /root/neuroviabot/bot
```
**Açıklama:** VPS'te bot'un kurulu olacağı dizin

### VPS_FRONTEND_PATH
```
Name: VPS_FRONTEND_PATH
Secret: /root/neuroviabot/frontend
```
**Açıklama:** VPS'te frontend'in kurulu olacağı dizin

### VPS_BACKEND_PATH
```
Name: VPS_BACKEND_PATH
Secret: /root/neuroviabot/backend
```
**Açıklama:** VPS'te backend'in kurulu olacağı dizin

---

## 🌐 API & Frontend Secrets

### API_URL
```
Name: API_URL
Secret: https://api.yourdomain.com
```
**Development:** `http://localhost:5000`  
**Production:** VPS'teki backend URL'i

### FRONTEND_URL
```
Name: FRONTEND_URL
Secret: https://yourdomain.com
```
**Development:** `http://localhost:3000`  
**Production:** VPS'teki frontend URL'i

### SESSION_SECRET
```
Name: SESSION_SECRET
Secret: [Rastgele güvenli string]
```
**Nasıl Oluşturulur:**
```bash
# Node.js ile
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# OpenSSL ile
openssl rand -hex 32
```

### DISCORD_REDIRECT_URI
```
Name: DISCORD_REDIRECT_URI
Secret: https://api.yourdomain.com/api/auth/callback
```
**Development:** `http://localhost:5000/api/auth/callback`  
**Production:** Backend URL + `/api/auth/callback`

⚠️ Bu URL'i Discord Developer Portal'da da ayarlamalısınız:
1. https://discord.com/developers/applications
2. Uygulamanızı seçin
3. OAuth2 > Redirects bölümüne ekleyin

### BACKEND_PORT
```
Name: BACKEND_PORT
Secret: 5000
```
**Açıklama:** Backend API'nin çalışacağı port

---

## 🎵 Spotify Integration (Opsiyonel)

### SPOTIFY_CLIENT_ID
```
Name: SPOTIFY_CLIENT_ID
Secret: [Spotify Client ID]
```
**Nasıl Alınır:**
1. https://developer.spotify.com/dashboard
2. "Create an App" butonuna tıklayın
3. Client ID'yi kopyalayın

### SPOTIFY_CLIENT_SECRET
```
Name: SPOTIFY_CLIENT_SECRET
Secret: [Spotify Client Secret]
```
**Açıklama:** Spotify Developer Dashboard'dan alınan secret

---

## 💾 Database (Opsiyonel)

### DATABASE_URL
```
Name: DATABASE_URL
Secret: ../data/database.json
```
**Açıklama:** Database dosyasının yolu (şu an JSON kullanıyoruz)

---

## ✅ Secrets Kontrol Listesi

Deployment öncesi bu listeyi kontrol edin:

### Bot Deployment İçin Gerekli
- [x] DISCORD_TOKEN
- [x] DISCORD_CLIENT_ID
- [x] DISCORD_CLIENT_SECRET
- [x] VPS_SSH_KEY
- [x] VPS_HOST
- [x] VPS_USER
- [x] VPS_BOT_PATH

### Frontend Deployment İçin Gerekli
- [x] VPS_SSH_KEY
- [x] VPS_HOST
- [x] VPS_USER
- [x] VPS_FRONTEND_PATH
- [x] API_URL
- [x] DISCORD_CLIENT_ID
- [x] DISCORD_CLIENT_SECRET
- [x] SESSION_SECRET

### Backend Deployment İçin Gerekli
- [x] VPS_SSH_KEY
- [x] VPS_HOST
- [x] VPS_USER
- [x] VPS_BACKEND_PATH
- [x] DISCORD_CLIENT_ID
- [x] DISCORD_CLIENT_SECRET
- [x] DISCORD_REDIRECT_URI
- [x] SESSION_SECRET
- [x] DISCORD_TOKEN
- [x] FRONTEND_URL
- [x] BACKEND_PORT

---

## 🔍 Secrets Test

Secrets'ları doğru girdiğinizi test etmek için:

1. **GitHub Actions** sekmesine gidin
2. **Deploy Discord Bot to VPS** workflow'unu seçin
3. **Run workflow** butonuna tıklayın
4. Deployment loglarını kontrol edin

---

## 🐛 Sorun Giderme

### Secret Bulunamıyor Hatası
```
Error: Secret VPS_SSH_KEY not found
```
**Çözüm:** Secret'ın adını tam olarak kontrol edin (büyük-küçük harf duyarlı!)

### SSH Bağlantı Hatası
```
Permission denied (publickey)
```
**Çözüm:** 
1. VPS_SSH_KEY'in **private key** olduğundan emin olun
2. VPS'te public key'in `~/.ssh/authorized_keys` dosyasında olduğunu kontrol edin

### Discord OAuth Hatası
```
Invalid redirect_uri
```
**Çözüm:** 
1. DISCORD_REDIRECT_URI'nin doğru olduğundan emin olun
2. Discord Developer Portal'da aynı URL'i ekleyin

---

## 📞 Yardım

Herhangi bir sorunla karşılaşırsanız:
- 📖 [DEPLOYMENT.md](./DEPLOYMENT.md) dosyasını okuyun
- 🐛 [GitHub Issues](https://github.com/kxrk0/neuroviabot-discord/issues) açın
- 💬 Discord sunucumuza katılın

---

**Son Güncelleme:** 29 Eylül 2025
