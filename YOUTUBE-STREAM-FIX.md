# 🔧 YouTube Stream Extraction Sorunu Çözümü

## ❌ Sorun:
```
[Object] Could not extract stream for this track
Error: Could not extract functions
    at /root/neuroviabot/bot/node_modules/ytdl-core/lib/sig.js:20:11
```

## 🔍 Neden:
YouTube'un anti-bot güncellemeleri nedeniyle ytdl-core'un signature extraction fonksiyonları çalışmıyor.

## ✅ Çözüm Adımları:

### 1. VPS'te Paketleri Güncelle
```bash
ssh root@194.105.5.37
cd /root/neuroviabot/bot

# Mevcut paketleri kontrol et
npm list discord-player @discord-player/extractor ytdl-core

# Paketleri güncelle
npm update discord-player @discord-player/extractor ytdl-core

# Alternatif: Paketleri yeniden yükle
npm uninstall discord-player @discord-player/extractor ytdl-core
npm install discord-player@latest @discord-player/extractor@latest ytdl-core@latest
```

### 2. Play-dl Alternatifi
```bash
# Play-dl paketini yükle
npm install play-dl@latest

# Bot'u yeniden başlat
pm2 restart neuroviabot
```

### 3. Bot'u Güncelle
```bash
git pull origin main
pm2 restart neuroviabot
```

### 4. Test
```bash
# Discord'da test et
/play https://www.youtube.com/watch?v=dQw4w9WgXcQ
/play Never Gonna Give You Up
```

## 🔧 Yapılan Düzeltmeler:

### A) User-Agent Header Eklendi
```javascript
ytdlOptions: {
    requestOptions: {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    }
}
```

### B) Default Extractor'lar Yüklendi
```javascript
await this.player.extractors.loadDefault();
```

### C) Multiple Extractor Fallback
- YouTubeExtractor
- YoutubeiExtractor (IOS, ANDROID, WEB)
- Default extractors

## 🐛 Hala Çalışmıyorsa:

### 1. Play-dl Kullanımı
```javascript
// Player oluştururken
const queue = player.createQueue(guild, {
    async onBeforeCreateStream(track, source, _queue) {
        if (source === 'youtube') {
            return (await playdl.stream(track.url, { 
                discordPlayerCompatibility: true 
            })).stream;
        }
    }
});
```

### 2. Alternatif YouTube Extractor
```bash
npm install @distube/ytdl-core
```

### 3. Proxy Kullanımı
```javascript
ytdlOptions: {
    requestOptions: {
        proxy: 'http://proxy-server:port'
    }
}
```

## 📊 Beklenen Sonuç:
```
✅ Default extractors yüklendi
✅ YouTubeExtractor yüklendi
✅ Music extractors yükleme tamamlandı
[DEBUG-PLAY] Playback started successfully
[DEBUG-PLAYER] Track started: Never Gonna Give You Up in Server Name
```

## ⚠️ Notlar:
- YouTube sık sık anti-bot güncellemeleri yapar
- ytdl-core paketi düzenli güncellenmelidir
- Play-dl alternatif olarak kullanılabilir
- User-Agent header'ı güncel tutulmalıdır

## 🔍 Debug Logları:
```bash
pm2 logs neuroviabot --lines 100 | grep -E "(extractor|stream|ytdl|error)"
```
