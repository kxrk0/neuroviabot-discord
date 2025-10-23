# 🔧 VPS'te Manuel Olarak Çalıştırılacak Komutlar

**SSH bağlantısı:**
```bash
ssh root@194.105.5.37
# Şifre: swaffogx.2425
```

**1. Git pull (güncel kodu çek)**
```bash
cd /root/neuroviabot/bot
git pull origin main
```

**2. guardHandler.js'i sil**
```bash
rm -f src/handlers/guardHandler.js
ls -lah src/handlers/ | grep guard
```

**3. PM2'yi restart et**
```bash
pm2 restart neuroviabot
```

**4. Hataları kontrol et**
```bash
pm2 logs neuroviabot --err --lines 20
```

**5. Eğer hala "Auto-mod handler hatası" varsa, tüm eski handler'ları yedekle**
```bash
cd /root/neuroviabot/bot

# Eski handler'ları .backup yap
mv src/handlers/welcomeHandler.js src/handlers/welcomeHandler.js.backup 2>/dev/null || true
mv src/handlers/verificationHandler.js src/handlers/verificationHandler.js.backup 2>/dev/null || true
mv src/handlers/ticketHandler.js src/handlers/ticketHandler.js.backup 2>/dev/null || true
mv src/handlers/roleReactionHandler.js src/handlers/roleReactionHandler.js.backup 2>/dev/null || true
mv src/handlers/giveawayHandler.js src/handlers/giveawayHandler.js.backup 2>/dev/null || true
mv src/handlers/customCommandHandler.js src/handlers/customCommandHandler.js.backup 2>/dev/null || true
mv src/handlers/backupHandler.js src/handlers/backupHandler.js.backup 2>/dev/null || true

# Sadece yeni handler'lar kalsın
ls -lah src/handlers/
```

**6. Tekrar restart**
```bash
pm2 restart neuroviabot
pm2 logs neuroviabot --err --lines 10
```

---

## 📋 Beklenen Çıktı

✅ **Başarılı olursa:**
- `guardHandler.js` silinmiş olacak
- PM2 loglarında "Auto-mod handler hatası" görülmeyecek
- Sadece loggingHandler ve levelingHandler aktif olacak

❌ **Eğer hala hata varsa:**
- Tüm eski handler'lar backup olacak
- Sadece 2 yeni handler kalacak

