# 🚀 NeuroViaBot Deployment Guide

## 📋 İçindekiler

- [VPS Gereksinimleri](#vps-gereksinimleri)
- [İlk Kurulum](#ilk-kurulum)
- [GitHub Secrets Yapılandırması](#github-secrets-yapılandırması)
- [Manuel Deployment](#manuel-deployment)
- [Otomatik Deployment](#otomatik-deployment)
- [Sorun Giderme](#sorun-giderme)

---

## 🖥️ VPS Gereksinimleri

### Minimum Sistem Gereksinimleri

- **İşletim Sistemi:** Ubuntu 20.04 LTS veya üzeri
- **RAM:** 2GB minimum (4GB önerilir)
- **Disk:** 20GB SSD
- **CPU:** 2 core
- **Bant Genişliği:** 1TB/ay

### Gerekli Yazılımlar

- Node.js 18.x
- npm 8.x+
- PM2 (process manager)
- Git
- Nginx (reverse proxy için)

---

## 🔧 İlk Kurulum

### 1. VPS'e Bağlanma

```bash
ssh your_user@your_vps_ip
```

### 2. Kurulum Scriptini Çalıştırma

```bash
# Script'i indir
wget https://raw.githubusercontent.com/kxrk0/neuroviabot-discord/main/scripts/vps-setup.sh

# İzin ver
chmod +x vps-setup.sh

# Çalıştır
./vps-setup.sh
```

### 3. SSH Key'i GitHub'a Ekleme

Script çalıştıktan sonra gösterilen SSH public key'i GitHub repository'nizin **Settings > Deploy keys** bölümüne ekleyin:

1. GitHub repository > Settings > Deploy keys
2. "Add deploy key" butonuna tıklayın
3. Title: "VPS Deploy Key"
4. Key: VPS'ten kopyalanan public key
5. ✅ "Allow write access" seçeneğini işaretleyin
6. "Add key" butonuna tıklayın

---

## 🔐 GitHub Secrets Yapılandırması

Repository'nizin **Settings > Secrets and variables > Actions** bölümüne aşağıdaki secret'ları ekleyin:

### Bot Secrets

| Secret Adı | Açıklama | Örnek |
|------------|----------|-------|
| `DISCORD_TOKEN` | Bot token'ı | `NzczNTM5...` |
| `DISCORD_CLIENT_ID` | Bot client ID | `773539215098249246` |
| `DISCORD_CLIENT_SECRET` | Bot client secret | `Yu6sYxI...` |

### VPS Secrets

| Secret Adı | Açıklama | Örnek |
|------------|----------|-------|
| `VPS_SSH_KEY` | VPS SSH private key | SSH key içeriği |
| `VPS_HOST` | VPS IP adresi | `123.45.67.89` |
| `VPS_USER` | VPS kullanıcı adı | `ubuntu` |
| `VPS_BOT_PATH` | Bot klasör yolu | `/home/ubuntu/neuroviabot/bot` |
| `VPS_FRONTEND_PATH` | Frontend klasör yolu | `/home/ubuntu/neuroviabot/frontend` |
| `VPS_BACKEND_PATH` | Backend klasör yolu | `/home/ubuntu/neuroviabot/backend` |

### API Secrets

| Secret Adı | Açıklama | Örnek |
|------------|----------|-------|
| `API_URL` | Backend API URL | `https://api.yourdomain.com` |
| `FRONTEND_URL` | Frontend URL | `https://yourdomain.com` |
| `SESSION_SECRET` | Session secret key | Random string |
| `DISCORD_REDIRECT_URI` | OAuth redirect URI | `https://api.yourdomain.com/api/auth/callback` |
| `BACKEND_PORT` | Backend port | `5000` |

### Optional Secrets

| Secret Adı | Açıklama |
|------------|----------|
| `SPOTIFY_CLIENT_ID` | Spotify API client ID |
| `SPOTIFY_CLIENT_SECRET` | Spotify API secret |
| `DATABASE_URL` | Database connection string |

---

## 🚀 Manuel Deployment

### Bot Deployment

```bash
ssh your_user@your_vps_ip

cd ~/neuroviabot/bot

# Güncel kodu çek
git pull origin main

# Temizlik
./scripts/cleanup.sh

# Dependencies
npm install --production

# PM2 ile başlat
pm2 restart neuroviabot || pm2 start index.js --name neuroviabot
pm2 save
```

### Frontend Deployment

```bash
cd ~/neuroviabot/frontend

# Güncel kodu çek
git pull origin main

# Temizlik
rm -rf .next node_modules

# Build
npm install
npm run build

# PM2 ile başlat
pm2 restart neuroviabot-frontend || pm2 start npm --name neuroviabot-frontend -- start
pm2 save
```

### Backend Deployment

```bash
cd ~/neuroviabot/backend

# Güncel kodu çek
git pull origin main

# Temizlik
rm -rf node_modules

# Dependencies
npm install --production

# PM2 ile başlat
pm2 restart neuroviabot-backend || pm2 start index.js --name neuroviabot-backend
pm2 save
```

---

## ⚡ Otomatik Deployment

GitHub Actions ile otomatik deployment kurulu. Her `main` branch'e push olduğunda:

### Bot Deployment Tetikleme

```bash
# Kod değişiklikleri sonrası
git add .
git commit -m "🐛 Fix bug in music system"
git push origin main

# Deployment otomatik başlayacak
# GitHub Actions > Deploy Discord Bot to VPS
```

### Frontend Deployment Tetikleme

Frontend klasöründeki değişiklikler otomatik detect edilir:

```bash
git add frontend/
git commit -m "✨ Add new dashboard feature"
git push origin main
```

### Manuel Tetikleme

GitHub repository > Actions > Workflow seç > "Run workflow"

---

## 🔍 Monitoring & Logs

### PM2 Status

```bash
# Tüm process'leri göster
pm2 status

# Detaylı bilgi
pm2 show neuroviabot

# Canlı loglar
pm2 logs neuroviabot --lines 100

# Sadece hatalar
pm2 logs neuroviabot --err
```

### Sistem Kaynakları

```bash
# CPU & Memory kullanımı
pm2 monit

# Detaylı istatistikler
pm2 info neuroviabot
```

---

## 🐛 Sorun Giderme

### Bot Başlamıyor

```bash
# Logları kontrol et
pm2 logs neuroviabot --lines 50

# Process'i yeniden başlat
pm2 restart neuroviabot

# Process'i sil ve yeniden oluştur
pm2 delete neuroviabot
pm2 start index.js --name neuroviabot
```

### Deployment Hataları

1. **SSH Bağlantı Hatası:**
   - VPS_SSH_KEY secret'ının doğru olduğundan emin olun
   - SSH key'in **private key** olduğundan emin olun

2. **Git Pull Hatası:**
   - VPS'te SSH key'in GitHub'a eklendiğinden emin olun
   - `ssh -T git@github.com` ile test edin

3. **Permission Hatası:**
   ```bash
   # Klasör izinlerini düzelt
   sudo chown -R $USER:$USER ~/neuroviabot
   chmod -R 755 ~/neuroviabot
   ```

### Database Sorunları

```bash
# Backup'tan geri yükle
cd ~/neuroviabot/bot/data
cp database-backup-YYYYMMDD-HHMMSS.json database.json
pm2 restart neuroviabot
```

### Nginx Sorunları

```bash
# Nginx durumunu kontrol et
sudo systemctl status nginx

# Nginx config test
sudo nginx -t

# Nginx restart
sudo systemctl restart nginx
```

---

## 🔄 Güncellemeler

### Bot Güncelleme

```bash
cd ~/neuroviabot/bot
git pull origin main
npm install
pm2 restart neuroviabot
```

### Dependencies Güncelleme

```bash
# Outdated packages
npm outdated

# Güncelle
npm update

# Major güncellemeler için
npm install package-name@latest
```

---

## 💾 Backup Stratejisi

### Otomatik Backup

Her deployment'ta otomatik backup alınır:
- Database: `data/database-backup-YYYYMMDD-HHMMSS.json`
- Son 10 backup saklanır

### Manuel Backup

```bash
# Database backup
cd ~/neuroviabot/bot
cp data/database.json data/manual-backup-$(date +%Y%m%d).json

# Full backup
cd ~
tar -czf neuroviabot-backup-$(date +%Y%m%d).tar.gz neuroviabot/
```

---

## 📊 Performance Optimization

### PM2 Memory Limit

```bash
# Memory limit ile başlat
pm2 start index.js --name neuroviabot --max-memory-restart 500M
```

### Log Rotation

```bash
# PM2 log rotation
pm2 install pm2-logrotate

# Ayarlar
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 10
```

---

## 🔒 Güvenlik

### Firewall

```bash
# Sadece gerekli portları aç
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

### SSL Certificate (Let's Encrypt)

```bash
# Certbot kurulumu
sudo apt-get install certbot python3-certbot-nginx

# Certificate al
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## 📞 Destek

- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/kxrk0/neuroviabot-discord/issues)
- 💬 **Discord:** [Support Server](https://discord.gg/support)
- 📧 **Email:** support@neuroviabot.com

---

**Son Güncelleme:** 29 Eylül 2025  
**Versiyon:** 2.0.0
