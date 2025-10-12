# 🔐 SESSION_SECRET Fix Guide

## ✅ Yapılan Değişiklikler

1. **WEBHOOK_SECRET → SESSION_SECRET migration tamamlandı**
   - `webhook-deploy.js`: `process.env.SESSION_SECRET` kullanıyor
   - `vps-webhook-fix.sh`: SESSION_SECRET kontrol ediyor
   - `PM2-ECOSYSTEM.config.js`: Webhook-deploy için düzeltildi

## 🚀 VPS'de Yapılacaklar

### 1️⃣ Git Reset ve Pull
```bash
cd /root/neuroviabot/bot

# Local değişiklikleri temizle
git reset --hard origin/main

# Son değişiklikleri çek
git pull origin main
```

### 2️⃣ Webhook Fix Script'ini Çalıştır
```bash
# Script'i çalıştır (SESSION_SECRET .env'e eklenecek)
./vps-webhook-fix.sh
```

**Beklenen Çıktı:**
```
🔧 NeuroViaBot Webhook Fix Başlatılıyor...
📥 Git pull yapılıyor...
Already up to date.
🔐 SESSION_SECRET kontrol ediliyor...
✅ SESSION_SECRET zaten mevcut
🔄 PM2 servisleri yeniden başlatılıyor...
✅ Webhook fix tamamlandı!
```

### 3️⃣ PM2 Servisleri Yeniden Yükle (ÖNEMLİ!)
```bash
# Ecosystem config'i kullanarak tüm servisleri yeniden yükle
pm2 delete all
pm2 start PM2-ECOSYSTEM.config.js
pm2 save

# Veya sadece webhook-deploy'u yeniden başlat
pm2 restart webhook-deploy --update-env
```

### 4️⃣ Migration Script'i Çalıştır
```bash
node migration-guild-features.js
```

### 5️⃣ Webhook Loglarını İzle
```bash
# Webhook'un çalışıp çalışmadığını kontrol et
pm2 logs webhook-deploy --lines 20
```

**Başarılı başlatma şöyle görünmeli:**
```
[START] 🎯 Webhook server listening on port 9000
[START] 🔐 Webhook secret configured
[START] 📁 Repository path: /root/neuroviabot/bot
[START] ✅ Ready to receive webhooks!
```

## 🧪 Test Etme

1. GitHub'dan boş bir push yap (bu zaten yapıldı)
2. Webhook loglarını izle:
   ```bash
   pm2 logs webhook-deploy --lines 0
   ```
3. Başarılı deployment şöyle görünecek:
   ```
   [WEBHOOK] 📨 Webhook alındı
   [WEBHOOK] Event: push, Branch: refs/heads/main
   [DEPLOY] 🚀 Deployment başlatılıyor...
   [DEPLOY] ✅ Git pull tamamlandı
   [DEPLOY] 🎉 DEPLOYMENT BAŞARILI!
   ```

## ⚠️ Sorun Giderme

### Hala "SESSION_SECRET required" hatası alıyorsanız:

```bash
# .env dosyasını kontrol et
cat /root/neuroviabot/bot/.env | grep SESSION_SECRET

# Eğer yoksa ekle:
echo "SESSION_SECRET=fdd863a42064ec909542df57b48d3f160d6f6ccc36ce8e31c303d480e1f03186" >> /root/neuroviabot/bot/.env

# PM2'yi tamamen yeniden başlat (env'ler yüklensin)
pm2 delete webhook-deploy
pm2 start PM2-ECOSYSTEM.config.js
pm2 save
```

### PM2 eski env'leri kullanıyorsa:

```bash
# Tüm servisleri sil ve yeniden başlat
pm2 kill
pm2 start PM2-ECOSYSTEM.config.js
pm2 startup
pm2 save
```

## 📊 Final Check

```bash
# Tüm servislerin çalıştığını doğrula
pm2 status

# Her servis için son logları kontrol et
pm2 logs neuroviabot --lines 10
pm2 logs neuroviabot-backend --lines 10
pm2 logs neuroviabot-frontend --lines 10
pm2 logs webhook-deploy --lines 10
```

## ✅ Başarı Göstergeleri

- ✅ Webhook-deploy "SESSION_SECRET required" hatası vermeden başlıyor
- ✅ Port 9000 açık: `netstat -tlnp | grep 9000`
- ✅ GitHub push sonrası webhook tetikleniyor
- ✅ Deployment başarıyla tamamlanıyor
- ✅ Migration script hatasız çalışıyor

---

**Son Durum:** Tüm dosyalar GitHub'a push edildi. VPS'de yukarıdaki adımları uygulayın ve webhook'un çalıştığını doğrulayın! 🎯

