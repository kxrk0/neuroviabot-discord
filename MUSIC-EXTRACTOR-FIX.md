# 🔧 Müzik Extractor Sorunu Çözümü

## ❌ Sorun:
```
[NoExtractors] Warning: Skipping extractors execution since zero extractors were registered
❌ Hiçbir YouTube extractor yüklenemedi!
❌ Fallback extractor da başarısız
```

## ✅ Çözüm Adımları:

### 1. VPS'te Paketleri Güncelle
```bash
ssh root@194.105.5.37
cd /root/neuroviabot/bot

# Mevcut paketleri kontrol et
npm list discord-player @discord-player/extractor

# Paketleri güncelle
npm update discord-player @discord-player/extractor

# Alternatif: Paketleri yeniden yükle
npm uninstall discord-player @discord-player/extractor
npm install discord-player@latest @discord-player/extractor@latest
```

### 2. Bot'u Yeniden Başlat
```bash
pm2 restart neuroviabot
pm2 logs neuroviabot --lines 50 | grep -E "(extractor|music|YouTube)"
```

### 3. Alternatif Çözümler

#### A) Manuel Extractor Kaydı
```javascript
// index.js'e ekle
const { Player } = require('discord-player');
const { YouTubeExtractor } = require('@discord-player/extractor');

// Player oluşturduktan sonra
player.extractors.register(YouTubeExtractor);
```

#### B) Play-dl Kullanımı
```bash
npm install play-dl@latest
```

#### C) YTDL-Core Güncellemesi
```bash
npm install ytdl-core@latest
```

### 4. Test
```bash
# Discord'da test et
/play https://www.youtube.com/watch?v=dQw4w9WgXcQ
/play Never Gonna Give You Up
```

## 🔍 Beklenen Sonuç:
```
✅ YouTubeExtractor yüklendi
✅ Discord Music Player başlatıldı!
🎵 Discord Player hazır
```

## ⚠️ Hala Çalışmıyorsa:
1. Node.js sürümünü kontrol et: `node --version` (>=16.0.0)
2. FFmpeg kurulu mu: `ffmpeg -version`
3. İnternet bağlantısını kontrol et
4. YouTube'un bot IP'sini engellemediğini kontrol et

## 📊 Debug Logları:
```bash
pm2 logs neuroviabot --lines 100 | grep -E "(extractor|music|error|warning)"
```
