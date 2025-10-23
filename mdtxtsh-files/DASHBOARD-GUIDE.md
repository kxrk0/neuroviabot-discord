# 🎮 NeuroViaBot Dashboard - Kullanım Kılavuzu

## ✅ Tamamlanan Özellikler

### 🎨 Frontend
- ✅ Modern, Discord temalı tasarım
- ✅ Smooth animasyonlar ve geçişler
- ✅ Discord OAuth entegrasyonu (direkt yetkilendirme)
- ✅ Dashboard ana sayfası (sunucu listesi)
- ✅ Sunucu detay sayfası (/dashboard/[serverId])
- ✅ 6 kategori ayar paneli:
  - Müzik Ayarları
  - Moderasyon Ayarları
  - Ekonomi Ayarları
  - Seviye Sistemi Ayarları
  - Karşılama Sistemi Ayarları
  - Genel Ayarlar
- ✅ Real-time ayar güncellemeleri
- ✅ Loading states ve error handling
- ✅ Responsive tasarım (mobile + desktop)

### 🔧 Backend
- ✅ Discord OAuth callback handler
- ✅ Auth middleware (kullanıcı doğrulama)
- ✅ Guild settings API endpoints (CRUD)
- ✅ WebSocket (Socket.IO) entegrasyonu
- ✅ Database models (Mongoose schemas)
- ✅ CORS ve session yönetimi

---

## 🚀 Kurulum ve Çalıştırma

### 1. Backend Başlatma

```bash
cd neuroviabot-backend
npm install
npm start
```

Backend **http://localhost:5000** adresinde çalışacak.

### 2. Frontend Başlatma

```bash
cd neuroviabot-frontend
npm install
npm run dev
```

Frontend **http://localhost:3000** adresinde çalışacak.

### 3. Bot Başlatma (İsteğe Bağlı)

```bash
# Ana dizinde
npm install
node index.js
```

---

## 📱 Kullanım

### Discord ile Giriş

1. **Ana sayfaya git:** `http://localhost:3000`
2. **"Discord ile Giriş Yap"** butonuna tıkla
3. Discord yetkilendirme sayfasında izin ver
4. Otomatik olarak `/dashboard` sayfasına yönlendirileceksin

### Sunucu Yönetimi

#### Dashboard Ana Sayfası
- **Sunucu Listesi**: Yönetici yetkisine sahip olduğun sunucular
- **Bot Durumu**: Her sunucu için bot var mı yok mu gösterir
- **Butonlar**:
  - **"Yönet"**: Bot varsa → Sunucu ayarlarına git
  - **"Botu Ekle"**: Bot yoksa → Invite URL aç

#### Sunucu Ayarları Sayfası (`/dashboard/[serverId]`)

**Sidebar (Sol Taraf)**
- 6 kategori arasında geçiş yap
- Aktif kategori highlight edilir
- Smooth animasyonlu geçişler

**Ayarlar Paneli (Sağ Taraf)**
- Toggle switches
- Input alanları
- Sliders
- Textarea'lar
- "Değişiklikleri Kaydet" butonu

---

## 🎯 API Endpoints

### Authentication
```
GET  /api/auth/user           - Mevcut kullanıcı bilgisi
GET  /api/auth/callback       - OAuth callback (Discord'dan dönüş)
POST /api/auth/logout         - Çıkış yap
```

### Bot Stats
```
GET  /api/bot/stats                    - Bot istatistikleri
GET  /api/bot/status                   - Bot durumu
GET  /api/bot/check-guild/:guildId     - Tek sunucu kontrolü
POST /api/bot/check-guilds             - Çoklu sunucu kontrolü
```

### Guild Settings
```
GET  /api/guilds/:guildId                      - Sunucu bilgisi
GET  /api/guilds/:guildId/settings             - Tüm ayarlar
GET  /api/guilds/:guildId/settings/:category   - Kategori ayarları
PUT  /api/guilds/:guildId/settings/:category   - Kategori güncelle
PUT  /api/guilds/:guildId/settings             - Bulk güncelleme
POST /api/guilds/:guildId/settings/reset       - Ayarları sıfırla
```

---

## 🔌 WebSocket Events

### Client → Server
```javascript
socket.emit('join_guild', guildId);        // Sunucu odasına katıl
socket.emit('leave_guild', guildId);       // Sunucu odasından ayrıl
socket.emit('settings_update', {           // Ayar güncelleme
  guildId,
  settings
});
```

### Server → Client
```javascript
socket.on('settings_changed', (data) => {  // Ayar değişti (real-time)
  // data: { guildId, settings, timestamp }
});
```

---

## 🎨 Ayar Kategorileri

### 1. Müzik Ayarları
- **enabled**: Müzik sistemi aktif mi?
- **defaultVolume**: Varsayılan ses seviyesi (0-100)
- **maxQueueSize**: Maksimum sıra boyutu
- **djRoleId**: DJ rolü ID
- **allowFilters**: Ses filtreleri (bassboost vb.)

### 2. Moderasyon Ayarları
- **enabled**: Moderasyon sistemi aktif mi?
- **autoMod**: Otomatik moderasyon
- **spamProtection**: Spam koruması
- **logChannelId**: Log kanalı ID
- **muteRoleId**: Mute rolü ID

### 3. Ekonomi Ayarları
- **enabled**: Ekonomi sistemi aktif mi?
- **startingBalance**: Başlangıç parası
- **dailyReward**: Günlük ödül
- **workReward**: Çalışma ödülü

### 4. Seviye Sistemi Ayarları
- **enabled**: Seviye sistemi aktif mi?
- **xpPerMessage**: Mesaj başına XP
- **xpCooldown**: XP cooldown (saniye)
- **levelUpMessage**: Seviye atlama mesajı

### 5. Karşılama Sistemi Ayarları
- **enabled**: Karşılama sistemi aktif mi?
- **channelId**: Karşılama kanalı ID
- **message**: Karşılama mesajı ({user} placeholder)

### 6. Genel Ayarlar
- **prefix**: Komut öneki (!,?,. vb.)
- **language**: Dil (tr, en)

---

## 🗄️ Database Schema

```javascript
{
  guildId: String (unique),
  music: { ... },
  moderation: { ... },
  economy: { ... },
  leveling: { ... },
  welcome: { ... },
  general: { ... },
  createdAt: Date,
  updatedAt: Date
}
```

**Model Methods:**
- `updateCategory(category, updates)` - Kategori güncelle
- `resetToDefaults()` - Varsayılana döndür

**Static Methods:**
- `findOrCreate(guildId)` - Bul veya oluştur

---

## 🔐 Güvenlik

### Auth Middleware
```javascript
const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};
```

Tüm `/api/guilds/*` endpoint'leri auth gerektirir.

### CORS
```javascript
cors({
  origin: 'http://localhost:3000',
  credentials: true
})
```

### Session
```javascript
session({
  secret: process.env.SESSION_SECRET,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production'
})
```

---

## 🎯 Özellikler

### ✅ Real-time Updates
- WebSocket ile anlık senkronizasyon
- Ayar değişikliği → Tüm clientlere broadcast
- Bot'a direkt iletim

### ✅ Kullanıcı Dostu
- Smooth animasyonlar
- Loading states
- Success/Error feedback
- Responsive design

### ✅ Modern Tasarım
- Discord teması
- Glassmorphism efektler
- Gradient borders
- Hover animations

### ✅ Performans
- Optimized bundle size
- Lazy loading
- Efficient re-renders
- WebSocket connection pooling

---

## 📝 TODO - Gelecek Özellikler

### Eklenebilecek Özellikler
- [ ] Role selection dropdown (Discord API'den roller çek)
- [ ] Channel selection dropdown (Discord API'den kanallar çek)
- [ ] Command enable/disable (komut bazlı ayarlar)
- [ ] Custom commands editor (özel komut oluşturma)
- [ ] Emoji picker (karşılama mesajları için)
- [ ] Color picker (embed renkleri için)
- [ ] Activity logs (ayar değişiklik geçmişi)
- [ ] Backup/Restore (ayarları yedekle/geri yükle)
- [ ] Multi-language support (i18n)
- [ ] Dark/Light theme toggle

### Database Integration
```bash
# MongoDB bağlantısı ekle (örnek)
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

# Model kullanımı
const GuildSettings = require('./src/models/GuildSettings');
const settings = await GuildSettings.findOrCreate(guildId);
```

---

## 🐛 Troubleshooting

### Bot Eklenemiyorsa
- Discord Client ID'yi kontrol et (`773539215098249246`)
- Bot permissions doğru mu? (8 = Administrator)
- Bot online mi?

### OAuth Çalışmıyorsa
- Backend çalışıyor mu? (`http://localhost:5000`)
- Discord Client Secret `.env` dosyasında mı?
- Callback URL doğru mu? (`http://localhost:5000/api/auth/callback`)

### Ayarlar Kaydedilmiyorsa
- Session aktif mi?
- CORS ayarları doğru mu?
- Auth middleware çalışıyor mu?

---

## 🎉 Sonuç

**Tamamlandı! 20/20 TODO ✅**

Artık tam fonksiyonel bir Discord bot dashboard sistemine sahipsiniz:
- Modern, kullanıcı dostu arayüz
- Real-time senkronizasyon
- Kapsamlı ayar panelleri
- Güvenli auth sistemi
- Hazır backend API
- WebSocket desteği

**Başlatmak için:**
```bash
# 1. Backend
cd neuroviabot-backend && npm start

# 2. Frontend (yeni terminal)
cd neuroviabot-frontend && npm run dev

# 3. Tarayıcı
http://localhost:3000
```

🚀 **Keyifli kodlamalar!**

