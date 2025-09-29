# 🤖 NeuroViaBot

**Gelişmiş Çok Amaçlı Discord Botu** - Müzik, Moderasyon, Ekonomi ve daha fazlası!

> Discord sunucunuz için her şeyi bir arada sunan akıllı bot. Müzik, moderasyon, ekonomi, seviye sistemi, destek biletleri ve çekilişlerle sunucunuzu kolayca yönetin!

[![Bot Status](https://img.shields.io/badge/Bot-Online-brightgreen?style=for-the-badge)](https://discord.com/invite/your-invite)
[![Discord.js](https://img.shields.io/badge/Discord.js-v14-blue?style=for-the-badge)](https://discord.js.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green?style=for-the-badge)](https://nodejs.org/)

## 🚀 Hızlı Başlangıç

**3 Adımda Sunucunuzu Kurun:**

1. **Bot'u Davet Edin** → Discord sunucunuza ekleyin
2. **`/quicksetup`** → Otomatik kurulum başlatın  
3. **Kullanmaya Başlayın** → Tüm özellikler hazır!

## 📋 Özellikler

### 🎵 Müzik Sistemi
- YouTube, Spotify desteği
- Playlist yönetimi
- Ses kontrolleri (volume, skip, pause, resume)
- Queue (sıra) sistemi

### 🛡️ Moderasyon
- Mesaj temizleme
- Uyarı sistemi
- Backup/Restore
- Auto-moderation

### 💰 Ekonomi Sistemi
- Coin sistemi
- Shop/Store
- Inventory
- Kumar oyunları (blackjack, slots, coinflip)

### 🎯 Diğer Özellikler
- Seviye sistemi
- Ticket sistemi
- Karşılama mesajları
- Rol reaksiyon sistemi
- Özel komutlar
- Giveaway sistemi

## 🌐 Web Dashboard (Planlanmakta)

### 📱 Kullanıcı Arayüzü
Modern, responsive ve kullanıcı dostu web tabanlı yönetim paneli

### 🔐 Giriş Sistemi
- **Discord OAuth2** ile güvenli giriş
- Kullanıcı kimlik doğrulama
- Yetki kontrolü sistemi

### 🏠 Ana Sayfa
Giriş yaptıktan sonra kullanıcıyı karşılayan ana ekran:
- Kullanıcı profil bilgileri
- Yönetici olunan sunucuların listesi
- Bot durumu (online/offline)
- Genel istatistikler

### 🔍 Sunucu Seçimi
- **Yönetici Olduğu Sunucular:** Kullanıcının `MANAGE_GUILD` yetkisine sahip olduğu sunucuları listeleme
- **Bot Durumu Kontrolü:** Seçilen sunucuda bot'un bulunup bulunmadığını kontrol etme

#### Bot Yok İse:
- **"Bot Ekle" Butonu** - Discord'un bot davet sayfasına yönlendirme
- Gerekli izinlerle beraber davet linki
- Bot eklendikten sonra otomatik dashboard'a yönlendirme

#### Bot Var İse:
- Direkt sunucu dashboard'ına yönlendirme
- Bot istatistiklerinin gösterilmesi

### 🎛️ Sunucu Dashboard'ı
Real-time bot yönetimi ve konfigürasyon paneli

#### 🛡️ Moderasyon Ayarları
- **Auto-Moderation Kuralları:**
  - Küfür filtreleme (özelleştirilebilir kelime listesi)
  - Spam koruması (mesaj limiti, interval ayarları)
  - Link/invite koruması
  - Caps lock kontrolü
  - Emoji spam kontrolü

- **Ceza Sistemi:**
  - Uyarı sistemi ayarları
  - Otomatik mute/kick/ban kuralları
  - Ceza süresi ayarları
  - Log kanalı belirleme

- **Backup Sistemi:**
  - Otomatik backup aralığı
  - Backup içeriği seçimi
  - Manuel backup alma

#### 👋 Karşılama Sistemi
- **Karşılama Mesajları:**
  - Özel karşılama mesajı editörü
  - Embed designer (renk, başlık, açıklama, resim)
  - Değişken sistemi (`{user}`, `{server}`, `{memberCount}`)
  - Önizleme özelliği

- **Kanal Ayarları:**
  - Karşılama kanalı seçimi
  - Hoş geldin DM mesajları
  - Ayrılma mesajları

- **Rol Verme:**
  - Otomatik rol verme
  - Doğrulama sistemi
  - Seçilebilir roller

#### ⚙️ Yönetim Sistemi
- **Rol Yönetimi:**
  - Reaksiyon rol sistemi
  - Otomatik rol verme kuralları
  - Rol hiyerarşisi ayarları

- **Kanal Yönetimi:**
  - Auto-channel sistemi
  - Ticket sistemi konfigürasyonu
  - Log kanalları ayarlama

- **İzin Sistemi:**
  - Komut izinleri
  - Kanal bazlı izinler
  - Rol bazlı kısıtlamalar

#### 🎵 Müzik Ayarları
- **Ses Ayarları:**
  - Default volume seviyesi
  - DJ rolü belirleme
  - Müzik kanalı kısıtlaması

- **Queue Ayarları:**
  - Maksimum şarkı sayısı
  - Tekrar modu ayarları
  - Otomatik çalma listesi

#### 💰 Ekonomi Sistemi
- **Coin Ayarları:**
  - Daily coin miktarı
  - Mesaj başına coin
  - Ses kanalında kalma bonusu

- **Mağaza Yönetimi:**
  - Özel eşya ekleme/çıkarma
  - Fiyat ayarları
  - Stok yönetimi

#### 🎯 Diğer Özellikler
- **Seviye Sistemi:**
  - XP kazanım oranları
  - Seviye rolleri
  - Leaderboard ayarları

- **Giveaway Sistemi:**
  - Çekiliş oluşturma
  - Otomatik çekiliş ayarları
  - Geçmişi görüntüleme

### 📊 İstatistik ve Analytics
- **Bot Aktivitesi:**
  - Komut kullanım istatistikleri
  - Günlük/haftalık/aylık grafikler
  - Kullanıcı aktivite analizi

- **Sunucu İstatistikleri:**
  - Üye sayısı değişimi
  - Mesaj istatistikleri
  - En aktif üyeler/kanallar

### 🔄 Real-time İşlevler
- **WebSocket Bağlantısı:** Bot ile dashboard arasında anlık veri akışı
- **Canlı Güncelleme:** Ayarlar değiştiğinde bot'ta anlık uygulanma
- **Live Log:** Bot aktivitelerini real-time izleme
- **Instant Notifications:** Sistem bildirimleri ve uyarılar

### 🎨 Teknik Özellikler
- **Frontend:** React.js / Next.js
- **Backend:** Node.js / Express.js
- **Database:** SQLite / PostgreSQL
- **Real-time:** Socket.IO
- **Authentication:** Discord OAuth2
- **Responsive Design:** Mobil ve desktop uyumlu
- **Dark/Light Theme:** Tema değiştirme özelliği

### 📱 Dashboard Yapısı
```
Dashboard/
├── 🏠 Ana Sayfa
│   ├── Sunucu listesi
│   ├── Bot durumu
│   └── Genel istatistikler
├── ⚙️ Sunucu Ayarları
│   ├── Moderasyon
│   ├── Karşılama
│   ├── Yönetim
│   ├── Müzik
│   ├── Ekonomi
│   └── Diğer
├── 📊 İstatistikler
│   ├── Bot analytics
│   ├── Komut istatistikleri
│   └── Sunucu verileri
├── 📝 Loglar
│   ├── Canlı log akışı
│   ├── Hata logları
│   └── Komut geçmişi
└── 👤 Profil
    ├── Kullanıcı ayarları
    ├── Bildirim tercihleri
    └── Çıkış
```

## 📂 Proje Yapısı

```
NeuroViaBot/
├── 📁 src/
│   ├── 📁 commands/        # Bot komutları
│   ├── 📁 events/          # Discord.js event'leri
│   ├── 📁 handlers/        # Özellik handler'ları
│   ├── 📁 models/          # Veritabanı modelleri
│   ├── 📁 utils/           # Yardımcı fonksiyonlar
│   └── 📁 database/        # Veritabanı dosyaları
├── 📁 config/              # Konfigürasyon dosyaları
├── 📁 logs/                # Bot logları
├── 📄 index.js             # Ana bot dosyası
├── 📄 package.json         # Dependencies
└── 📄 .env                 # Environment variables
```

## 🚀 Kurulum

### 1. Repository'yi klonlayın
```bash
git clone <repository-url>
cd neuroviabot
```

### 2. Dependencies'i yükleyin
```bash
npm install
```

### 3. Environment variables'i ayarlayın
`.env` dosyasını düzenleyin:
```env
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
```

### 4. Bot'u başlatın
```bash
npm start
```

## ⚙️ Konfigürasyon

### Discord Bot Token
1. [Discord Developer Portal](https://discord.com/developers/applications)'a gidin
2. Yeni application oluşturun
3. Bot sekmesinden token'ı kopyalayın
4. `.env` dosyasına ekleyin

### Spotify (İsteğe Bağlı)
Müzik komutları için Spotify API:
1. [Spotify Developer Console](https://developer.spotify.com/dashboard)'a gidin
2. Yeni app oluşturun
3. Client ID ve Secret'ı `.env` dosyasına ekleyin

## 🎮 Komutlar

### Müzik Komutları
- `!play <şarkı>` - Şarkı çal
- `!skip` - Sonraki şarkıya geç
- `!pause` - Duraklat
- `!resume` - Devam et
- `!queue` - Sırayı göster
- `!volume <0-100>` - Ses seviyesi

### Moderasyon Komutları
- `!clear <sayı>` - Mesaj sil
- `!backup` - Sunucu backup'ı
- `!guard` - Auto-moderation

### Ekonomi Komutları
- `!economy` - Ekonomi durumu
- `!shop` - Mağaza
- `!buy <item>` - Satın al
- `!inventory` - Envanter

### Eğlence Komutları
- `!blackjack` - Blackjack oyunu
- `!slots` - Slot makinesi
- `!coinflip` - Yazı tura

## 🗄️ Veritabanı

Bot SQLite veritabanı kullanır:
- **Lokasyon:** `src/database/bot_database.sqlite`
- **Modeller:** `src/models/` klasöründe
- **Bağlantı:** `src/database/connection.js`

## 📊 Logging

Bot aktiviteleri `logs/` klasöründe tutulur:
- `general-YYYY-MM-DD.log` - Genel loglar
- `commands-YYYY-MM-DD.log` - Komut logları
- `errors-YYYY-MM-DD.log` - Hata logları
- `system-YYYY-MM-DD.log` - Sistem logları

## 🔧 Geliştirme

### Yeni Komut Ekleme
```javascript
// src/commands/your-command.js
module.exports = {
    name: 'komut-adi',
    description: 'Komut açıklaması',
    execute(message, args) {
        // Komut mantığı
    }
};
```

### Handler Ekleme
```javascript
// src/handlers/yourHandler.js
module.exports = {
    init(client) {
        // Handler başlatma
    }
};
```

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork'layın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit'leyin (`git commit -m 'Add amazing feature'`)
4. Push'layın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📞 Destek

Herhangi bir sorunuz veya sorununuz varsa:
- GitHub Issues açın
- Discord sunucumuzdan destek alın

---

**NeuroViaBot** - Gelişmiş Discord Bot Çözümü 🚀