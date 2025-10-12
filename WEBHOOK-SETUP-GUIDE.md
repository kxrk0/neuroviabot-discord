# 🚀 NeuroViaBot Webhook Setup Guide

## Durum Kontrolü

Push yaptık ama webhook tetiklenmedi. İşte adım adım çözüm:

---

## 📋 Adım 1: VPS'de Fix Script'i Çalıştırın

```bash
# VPS'e SSH bağlanın
ssh root@YOUR_VPS_IP

# Repo dizinine gidin
cd /root/neuroviabot/bot

# Git pull yapın (fix script'i gelecek)
git pull origin main

# Fix script'i çalıştırılabilir yapın
chmod +x vps-webhook-fix.sh

# Script'i çalıştırın
./vps-webhook-fix.sh
```

Script şunları yapacak:
- ✅ WEBHOOK_SECRET'ı .env'e ekleyecek
- ✅ Git pull yapacak
- ✅ Webhook-deploy'i başlatacak/restart edecek
- ✅ Tüm servisleri restart edecek

---

## 📋 Adım 2: GitHub Webhook Ayarları

### 2.1. GitHub'da Webhook Kurulumu

1. Bu URL'ye gidin:
   ```
   https://github.com/kxrk0/neuroviabot-discord/settings/hooks
   ```

2. Eğer webhook yoksa "Add webhook" butonuna tıklayın

3. Şu ayarları yapın:
   - **Payload URL**: `http://YOUR_VPS_IP:9000/webhook`
   - **Content type**: `application/json`
   - **Secret**: `fdd863a42064ec909542df57b48d3f160d6f6ccc36ce8e31c303d480e1f03186`
   - **Which events**: "Just the push event" seçin
   - **Active**: ✅ İşaretli olsun

4. "Add webhook" veya "Update webhook" butonuna tıklayın

### 2.2. Webhook Test

1. Webhook oluşturulduktan sonra, webhook'a tıklayın
2. "Recent Deliveries" sekmesine gidin
3. "Redeliver" butonuna tıklayarak test edin
4. Response 200 olmalı

---

## 📋 Adım 3: Port Kontrolü (VPS'de)

```bash
# Port 9000 açık mı kontrol edin
sudo ufw status | grep 9000

# Eğer kapalıysa açın
sudo ufw allow 9000/tcp

# Port'un dinlendiğini kontrol edin
netstat -tlnp | grep 9000
# veya
ss -tlnp | grep 9000
```

Beklenen çıktı:
```
tcp        0      0 0.0.0.0:9000            0.0.0.0:*               LISTEN
```

---

## 📋 Adım 4: Migration Script'ini Çalıştırın

```bash
cd /root/neuroviabot/bot

# Migration'ı çalıştırın
node migration-guild-features.js
```

Beklenen çıktı:
```
🚀 Guild Features Migration başlatılıyor...

✅ Features eklendi: Guild 123456789
⏭️ Features zaten mevcut: Guild 987654321

📊 Migration Özeti:
   - Güncellenen guild'ler: 1
   - Atlanan guild'ler: 1
   - Toplam guild: 2

✅ Migration tamamlandı!
```

---

## 📋 Adım 5: Logları Kontrol Edin

```bash
# Webhook logları
pm2 logs webhook-deploy --lines 50

# Bot logları
pm2 logs neuroviabot --lines 30

# Tüm servis durumu
pm2 status
```

Webhook loglarında şunu görmelisiniz:
```
[TIMESTAMP] [START] 🎯 Webhook server listening on port 9000
[TIMESTAMP] [START] 🔐 Webhook secret configured
[TIMESTAMP] [START] ✅ Ready to receive webhooks!
```

---

## 🧪 Test

### Local'den Push Test

```bash
# Boş commit
git commit --allow-empty -m "test: webhook test"
git push origin main
```

### VPS'de Webhook Loglarını İzleyin

```bash
pm2 logs webhook-deploy --lines 0
```

Başarılı deployment görmelisiniz:
```
[TIMESTAMP] [WEBHOOK] 📨 Webhook alındı
[TIMESTAMP] [WEBHOOK] Event: push, Branch: refs/heads/main
[TIMESTAMP] [DEPLOY] 🚀 Deployment başlatılıyor...
[TIMESTAMP] [DEPLOY] ✅ Git pull tamamlandı
[TIMESTAMP] [DEPLOY] ✅ Bot dependencies kuruldu
[TIMESTAMP] [DEPLOY] ✅ Frontend build tamamlandı
[TIMESTAMP] [DEPLOY] ✅ Backend dependencies kuruldu
[TIMESTAMP] [DEPLOY] ✅ PM2 servisleri restart edildi
[TIMESTAMP] [SUCCESS] 🎉 DEPLOYMENT BAŞARILI!
```

---

## ❌ Sorun Giderme

### Problem 1: "WEBHOOK_SECRET environment variable is required"

**Çözüm**:
```bash
cd /root/neuroviabot/bot
echo "WEBHOOK_SECRET=fdd863a42064ec909542df57b48d3f160d6f6ccc36ce8e31c303d480e1f03186" >> .env
pm2 restart webhook-deploy
```

### Problem 2: Webhook 404 Error

**Neden**: GitHub webhook'a ulaşamıyor

**Çözüm**:
```bash
# Port açık mı kontrol et
sudo ufw status | grep 9000

# Açık değilse
sudo ufw allow 9000/tcp

# Webhook çalışıyor mu kontrol et
pm2 list | grep webhook-deploy

# Çalışmıyorsa başlat
pm2 start webhook-deploy.js --name webhook-deploy
pm2 save
```

### Problem 3: Invalid Signature

**Neden**: GitHub'daki secret ile .env'deki secret farklı

**Çözüm**:
1. GitHub webhook settings'e gidin
2. Secret'ı güncelleyin: `fdd863a42064ec909542df57b48d3f160d6f6ccc36ce8e31c303d480e1f03186`
3. "Update webhook" butonuna tıklayın

### Problem 4: Port 9000 zaten kullanımda

**Çözüm**:
```bash
# Hangi process kullanıyor kontrol et
sudo lsof -i :9000

# Eski webhook process'i öldür
pm2 delete webhook-deploy

# Yeniden başlat
pm2 start webhook-deploy.js --name webhook-deploy
pm2 save
```

---

## ✅ Başarı Kriterleri

- [x] VPS'de fix script çalıştı
- [x] WEBHOOK_SECRET .env'de mevcut
- [x] webhook-deploy PM2'de çalışıyor
- [x] Port 9000 açık ve dinleniyor
- [x] GitHub webhook kurulu ve aktif
- [x] Test push'u deployment'ı tetikledi
- [x] Migration script çalıştı
- [x] Tüm servisler ayakta

---

## 🎯 Sonraki Adımlar

1. Discord'da test edin:
   ```
   /özellikler durum
   ```

2. Guild-specific features test:
   ```
   /özellikler kapat economy
   /balance
   ```
   Hata vermeli: "Bu sunucuda ekonomi sistemi devre dışı!"

3. Frontend'den test:
   - Dashboard'a giriş yapın
   - Features sekmesine gidin
   - Bir feature'ı kapatıp açın

---

## 📞 Yardım

Sorun devam ederse:
- PM2 logları: `pm2 logs webhook-deploy`
- Bot logları: `pm2 logs neuroviabot`
- Sistem durumu: `pm2 status`
- Port kontrolü: `netstat -tlnp | grep 9000`

**NOT**: Webhook test için her push sonrası GitHub webhook "Recent Deliveries" sekmesinden response'u kontrol edin!

