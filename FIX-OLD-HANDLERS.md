# 🔧 Eski Handler'ları Temizleme Planı

## ❌ Devre Dışı Bırakılacak Dosyalar
- `src/handlers/guardHandler.js` → TAMAMEN SİL (simple-db kullanılıyor)
- `src/handlers/guardHandler.js.backup` → ZATEN YEDEK

## ✅ Aktif Kalacak Handler'lar
- `src/handlers/loggingHandler.js` → ✅ YENİ (simple-db kullanıyor)
- `src/handlers/levelingHandler.js` → ✅ YENİ (simple-db kullanıyor)

## ⚠️ Kontrol Edilecek Handler'lar
- `src/handlers/welcomeHandler.js` → Sequelize kullanıyor mu?
- `src/handlers/verificationHandler.js` → Sequelize kullanıyor mu?
- `src/handlers/ticketHandler.js` → Sequelize kullanıyor mu?
- `src/handlers/roleReactionHandler.js` → Sequelize kullanıyor mu?
- `src/handlers/giveawayHandler.js` → Sequelize kullanıyor mu?
- `src/handlers/customCommandHandler.js` → Sequelize kullanıyor mu?
- `src/handlers/backupHandler.js` → Sequelize kullanıyor mu?

## 📝 Yapılacaklar
1. `guardHandler.js`'i sil (VPS'te)
2. Diğer handler'ları kontrol et
3. Eski Sequelize import'ları varsa simple-db'ye çevir VEYA devre dışı bırak
4. PM2 restart
5. Hata loglarını kontrol et

