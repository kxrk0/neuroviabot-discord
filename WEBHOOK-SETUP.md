# 🔗 Webhook Setup - Hızlı Başlangıç

## ✅ Webhook Server Çalışıyor!

VPS'te webhook server aktif ve hazır:
- ✅ Port 9000'de dinliyor
- ✅ Caddy reverse proxy aktif
- ⏳ SSL sertifikası (DNS propagation bekleniyor)

---

## 📋 GitHub Webhook Ayarları

### Geçici (HTTP - Şimdi):

1. **URL:** https://github.com/kxrk0/neuroviabot-discord/settings/hooks
2. **Add webhook** tıkla
3. **Ayarlar:**
   ```
   Payload URL: http://webhook.neuroviabot.xyz/webhook
   Content type: application/json
   Secret: (VPS'teki .env dosyasındaki WEBHOOK_SECRET)
   SSL verification: Disable SSL verification (geçici)
   Events: Just the push event
   Active: ✅
   ```
4. **Add webhook**

### Kalıcı (HTTPS - 10 dakika sonra):

DNS propagate olunca webhook URL'ini güncelle:
```
Payload URL: https://webhook.neuroviabot.xyz/webhook
SSL verification: Enable SSL verification
```

---

## 🧪 Test

### VPS'te:

```bash
# Webhook server logları
pm2 logs webhook-server

# Caddy logları
sudo tail -f /var/log/caddy/webhook-access.log
```

### Push Test:

```bash
echo "# Webhook Test" >> README.md
git add README.md
git commit -m "Test: Webhook deployment"
git push origin main
```

**Beklenen çıktı (VPS'te):**
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

## 🔐 Webhook Secret

VPS'te `.env` dosyasından al:

```bash
ssh root@194.105.5.37
cd /root/neuroviabot/bot
cat .env | grep WEBHOOK_SECRET
```

Bu değeri GitHub webhook ayarlarında **Secret** alanına yapıştır!

---

## 📊 Monitoring

### PM2:
```bash
pm2 status
pm2 logs webhook-server
```

### GitHub:
https://github.com/kxrk0/neuroviabot-discord/settings/hooks
- Recent Deliveries bölümünde webhook isteklerini görebilirsin

---

## ✅ Başarı Kriterleri

1. ✅ Webhook server çalışıyor (pm2 status)
2. ✅ Caddy aktif (systemctl status caddy)
3. ✅ DNS kayıtları doğru (nslookup webhook.neuroviabot.xyz)
4. ✅ GitHub webhook eklendi
5. ✅ Push sonrası deployment başlıyor
6. ✅ PM2 servisleri restart ediliyor

---

## 🎉 Tamamlandı!

Artık her `git push origin main` yaptığında:
1. GitHub webhook gönderir
2. VPS webhook alır
3. Otomatik deployment başlar
4. 2-3 dakika içinde tamamlanır
5. PM2 servisleri restart edilir

**SSH key problemi tamamen çözüldü!** 🚀
