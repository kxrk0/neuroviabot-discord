# 🔧 /manage Sayfası Debug Rehberi

## ❌ Sorun: Ayarlar Değişmiyor

### 🔍 Nedenleri:

1. **Frontend State Güncellenmiyor** → Toggle tıklandığında `setSettings` çalışmıyor
2. **Backend'e Gönderilmiyor** → Kaydet butonu hata veriyor
3. **Bot Almıyor** → Socket.IO bağlantısı yok

---

## ✅ HIZLI ÇÖZÜM

### **Adım 1: Browser Console'u Aç**
1. `https://neuroviabot.xyz/manage` sayfasını aç
2. **F12** tuşuna bas (DevTools)
3. **Console** sekmesine git

### **Adım 2: Toggle'a Tıkla**
1. **Leveling** kategorisine git
2. **Seviye Sistemi** toggle'ına tıkla
3. Console'da şunu gör:

**✅ Başarılı:**
```
[Manage] Loaded settings for guild 123456789: 50 settings
```

**❌ Hata:**
```
TypeError: Cannot read property 'levelingEnabled' of undefined
Failed to fetch
CORS error
```

### **Adım 3: Kaydet Butonuna Bas**
1. Toggle'ı aç/kapa
2. **KAYDET** butonuna bas
3. Console'da şunu gör:

**✅ Başarılı:**
```
[Manage] Saving settings for guild 123456789: {...}
[Manage] Settings saved successfully for guild 123456789
```

**❌ Hata:**
```
[Manage] Failed to save settings: {error: "..."}
401 Unauthorized
403 Forbidden
500 Internal Server Error
```

---

## 🐛 Yaygın Hatalar ve Çözümleri

### **1. "401 Unauthorized"**
**Neden:** Giriş yapılmamış veya session süresi dolmuş
**Çözüm:**
```
1. Çıkış yap
2. Tekrar Discord ile giriş yap
3. /manage sayfasını yenile
```

### **2. "403 Forbidden"**
**Neden:** Sunucuda yönetici yetkisi yok
**Çözüm:**
- Discord'da sunucu ayarlarından "Sunucuyu Yönet" yetkisini al

### **3. "500 Internal Server Error"**
**Neden:** Backend hatası
**Çözüm:**
```bash
# VPS'te backend loglarını kontrol et
pm2 logs neuroviabot-backend --lines 50
```

### **4. Toggle Görünmüyor / Değişmiyor**
**Neden:** `settingsMapper` hatası veya state güncellenmiyor
**Çözüm:**
```
1. Sayfayı hard refresh yap (Ctrl + Shift + R)
2. Browser cache'i temizle
3. Incognito/Private mode'da dene
```

---

## 🧪 Manuel Test

### **Test 1: API Endpoint**
```bash
# Terminal'de test et
curl -X GET "https://neuroviabot.xyz/api/guilds/YOUR_GUILD_ID/settings" \
  -H "Cookie: YOUR_SESSION_COOKIE"
```

**Beklenen:**
```json
{
  "guildId": "123456789",
  "leveling": {
    "enabled": false,
    "xpPerMessage": 15,
    ...
  }
}
```

### **Test 2: POST Request**
```bash
curl -X POST "https://neuroviabot.xyz/api/guilds/YOUR_GUILD_ID/settings" \
  -H "Content-Type: application/json" \
  -H "Cookie: YOUR_SESSION_COOKIE" \
  -d '{"leveling":{"enabled":true,"xpPerMessage":20}}'
```

**Beklenen:**
```json
{
  "guildId": "123456789",
  "leveling": {
    "enabled": true,
    "xpPerMessage": 20,
    ...
  }
}
```

---

## 📊 VPS'te Backend Kontrol

### **Backend Çalışıyor mu?**
```bash
pm2 list | grep backend
```

**Beklenen:**
```
neuroviabot-backend │ online │ 0
```

### **Backend Logları:**
```bash
pm2 logs neuroviabot-backend --lines 50
```

**Aranacak:**
```
✅ POST /api/guilds/123456789/settings
✅ Settings saved for guild 123456789
⚠️  Settings update error: ...
```

---

## 🔄 Socket.IO Kontrol

### **Bot Backend'e Bağlandı mı?**
```bash
pm2 logs neuroviabot --lines 50 | grep Backend
```

**Beklenen:**
```
✅ Backend'e bağlanıldı: http://localhost:5000
```

**Hata:**
```
❌ Backend bağlantısı kesildi
Socket.IO hatası: connect ECONNREFUSED
```

**Çözüm:**
```bash
# Backend port kontrol
cat neuroviabot-backend/.env | grep PORT

# Bot .env kontrol
cat .env | grep BACKEND_URL

# Port eşleştir
echo "BACKEND_URL=http://localhost:5000" >> .env
pm2 restart neuroviabot
```

---

## 🎯 SON KONTROL LİSTESİ

- [ ] Frontend build edildi mi? (`npm run build`)
- [ ] Backend çalışıyor mu? (`pm2 list`)
- [ ] Bot çalışıyor mu? (`pm2 list`)
- [ ] Socket.IO bağlı mı? (`pm2 logs neuroviabot | grep Backend`)
- [ ] Kullanıcı giriş yaptı mı? (Browser'da kontrol et)
- [ ] Sunucuda yetki var mı? (Discord'da kontrol et)
- [ ] Database dosyası var mı? (`ls -la data/database.json`)

---

## 🚀 Hızlı Fix Komutu

```bash
# VPS'te tüm servisleri restart et
cd /root/neuroviabot/bot
pm2 restart all
pm2 logs neuroviabot --lines 30
```

---

## 📝 Debug Çıktıları Bana Gönder

Eğer sorun devam ediyorsa, şunları gönder:

1. **Browser Console Screenshot** (F12 → Console)
2. **Backend Logs:**
```bash
pm2 logs neuroviabot-backend --lines 50
```

3. **Bot Logs:**
```bash
pm2 logs neuroviabot --lines 50 | grep -E "Backend|Socket|settings"
```

4. **Database İçeriği (Settings):**
```bash
cat data/database.json | grep -A 20 '"settings"'
```

