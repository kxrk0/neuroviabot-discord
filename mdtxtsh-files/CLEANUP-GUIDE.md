# 🧹 NeuroViaBot - Eski Handler Temizleme Rehberi

## 🔥 Problem: Auto-Mod Handler Hatası

**Hata:**
```
❌ Auto-mod handler hatası
TypeError: Guild.findOne is not a function
```

**Sebep:** `guardHandler.js` ve diğer eski handler'lar **Sequelize ORM** kullanıyor, ancak proje artık **simple-db (JSON database)** kullanıyor.

---

## ✅ Çözüm: Tüm Eski Handler'ları Devre Dışı Bırak

### 📋 Yeni Sistem (Aktif)
- ✅ `loggingHandler.js` - simple-db kullanıyor
- ✅ `levelingHandler.js` - simple-db kullanıyor
- ✅ `messageCreate.js` - auto-mod işlevini içeriyor (simple-db ile)

### ❌ Eski Sistem (Devre Dışı Bırakılacak)
- ❌ `guardHandler.js` - **SİLİNMELİ** (auto-mod duplicate)
- ❌ `welcomeHandler.js` - Sequelize kullanıyor
- ❌ `verificationHandler.js` - Sequelize kullanıyor
- ❌ `ticketHandler.js` - Sequelize kullanıyor
- ❌ `roleReactionHandler.js` - Sequelize kullanıyor
- ❌ `giveawayHandler.js` - Sequelize kullanıyor
- ❌ `customCommandHandler.js` - Sequelize kullanıyor
- ❌ `backupHandler.js` - Sequelize kullanıyor

---

## 🚀 Hızlı Kurulum (VPS'te)

### Adım 1: SSH Bağlantısı
```bash
ssh root@194.105.5.37
# Şifre: swaffogx.2425
```

### Adım 2: Güncel Kodu Çek
```bash
cd /root/neuroviabot/bot
git pull origin main
```

### Adım 3: Cleanup Script'ini Çalıştır
```bash
bash scripts/backup-old-handlers.sh
```

### Adım 4: PM2'yi Restart Et
```bash
pm2 restart neuroviabot
```

### Adım 5: Hataları Kontrol Et
```bash
pm2 logs neuroviabot --err --lines 20
```

✅ **Başarılı olursa:** "Auto-mod handler hatası" kaybolacak!

---

## 🔧 Manuel Temizleme (Script çalışmazsa)

```bash
cd /root/neuroviabot/bot/src/handlers

# 1. guardHandler'ı sil
rm -f guardHandler.js

# 2. Diğer eski handler'ları yedekle
mv welcomeHandler.js welcomeHandler.js.backup_$(date +%Y%m%d)
mv verificationHandler.js verificationHandler.js.backup_$(date +%Y%m%d)
mv ticketHandler.js ticketHandler.js.backup_$(date +%Y%m%d)
mv roleReactionHandler.js roleReactionHandler.js.backup_$(date +%Y%m%d)
mv giveawayHandler.js giveawayHandler.js.backup_$(date +%Y%m%d)
mv customCommandHandler.js customCommandHandler.js.backup_$(date +%Y%m%d)
mv backupHandler.js backupHandler.js.backup_$(date +%Y%m%d)

# 3. Kalan aktif handler'ları kontrol et
ls -lah | grep -v backup

# Çıktı:
# loggingHandler.js
# levelingHandler.js
# (Sadece bu ikisi kalmalı!)

# 4. PM2 restart
cd /root/neuroviabot/bot
pm2 restart neuroviabot
pm2 logs neuroviabot --err --lines 20
```

---

## 📊 Beklenen Sonuç

### ✅ Başarılı Çıktı
```bash
pm2 logs neuroviabot --err --lines 20
```

**Görmemiz Gereken:**
- ✅ Bot başladı
- ✅ Leveling sistemi aktif
- ✅ Logging sistemi aktif
- ✅ Auto-mod çalışıyor (messageCreate.js içinde)

**GÖRMEMEMİZ GEREKEN:**
- ❌ "Auto-mod handler hatası"
- ❌ "Guild.findOne is not a function"
- ❌ "getDatabase is not a function"

---

## 🎯 Özet

### Önceki Sistem (Eski - Sequelize)
```
index.js
  ↓
guardHandler.js (Sequelize - HATA!)
welcomeHandler.js (Sequelize)
ticketHandler.js (Sequelize)
... (7 tane daha)
```

### Yeni Sistem (simple-db)
```
index.js
  ↓
messageCreate.js → handleAutoModeration() (simple-db ✅)
                 → levelingHandler.handleMessageXp() (simple-db ✅)
                 
loggingHandler.js (simple-db ✅)
levelingHandler.js (simple-db ✅)
```

---

## ❓ Sorun Giderme

### Hala "Auto-mod handler hatası" görüyorum
```bash
# guardHandler.js hala var mı kontrol et
ls -lah /root/neuroviabot/bot/src/handlers/guardHandler.js

# Varsa sil
rm -f /root/neuroviabot/bot/src/handlers/guardHandler.js

# PM2'yi hard restart yap
pm2 delete neuroviabot
cd /root/neuroviabot/bot
pm2 start PM2-ECOSYSTEM.config.js --only neuroviabot
pm2 save
```

### Bot çalışmıyor
```bash
# Log dosyasını kontrol et
pm2 logs neuroviabot --lines 50

# Index.js'i kontrol et
cd /root/neuroviabot/bot
node index.js
# CTRL+C ile çık, hataları gör
```

---

## 📝 Not

Bu temizlik sonrası şu özellikler **GEÇİCİ OLARAK DEVREDİŞI** olacak:
- ❌ Welcome sistemi (handler devre dışı)
- ❌ Verification sistemi (handler devre dışı)
- ❌ Ticket sistemi (handler devre dışı)
- ❌ Role reaction (handler devre dışı)
- ❌ Giveaway (handler devre dışı)
- ❌ Custom commands (handler devre dışı)

**Bunları tekrar aktif etmek için:** Her handler'ı **simple-db**'ye çevirmemiz gerekiyor.

**ŞU AN AKTİF OLAN ÖZELLİKLER:**
- ✅ Auto-moderation (messageCreate.js içinde)
- ✅ Leveling/XP sistemi
- ✅ Logging (message delete/update, member join/leave, vb.)
- ✅ Music player
- ✅ Economy sistemi
- ✅ Moderation komutları
- ✅ Tüm slash komutlar

---

**Son Güncelleme:** 2025-10-06  
**Durum:** ✅ Ready to deploy

