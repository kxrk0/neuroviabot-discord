# 🔧 Müzik Çalma Sorunu Debug Rehberi

## ❌ Sorun:
Şarkı kuyruğa ekleniyor ama çalmıyor.

## 🔍 Debug Adımları:

### 1. VPS'te Bot'u Güncelle
```bash
ssh root@194.105.5.37
cd /root/neuroviabot/bot
git pull origin main
pm2 restart neuroviabot
```

### 2. Debug Loglarını İzle
```bash
# Müzik ile ilgili logları izle
pm2 logs neuroviabot --lines 0 | grep -E "(DEBUG-PLAY|DEBUG-PLAYER|music|track|queue)"

# Tüm logları izle
pm2 logs neuroviabot --lines 0
```

### 3. Discord'da Test Et
```
/play https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

### 4. Beklenen Debug Çıktısı:
```
[DEBUG-PLAY] Starting playback for track: Never Gonna Give You Up
[DEBUG-PLAY] Queue connection status: Connected
[DEBUG-PLAY] Voice channel: General (123456789)
[DEBUG-PLAY] Playback started successfully
[DEBUG-PLAYER] Track started: Never Gonna Give You Up in Server Name
```

## 🐛 Olası Sorunlar ve Çözümleri:

### A) Voice Channel Bağlantı Sorunu
**Belirtiler:**
```
[DEBUG-PLAY] Queue connection status: Not connected
[DEBUG-PLAYER] Connection error: Error connecting to voice channel
```

**Çözüm:**
```bash
# Bot'un voice permissions'ını kontrol et
# Discord'da bot'a "Connect" ve "Speak" yetkisi ver
```

### B) FFmpeg Sorunu
**Belirtiler:**
```
[DEBUG-PLAYER] Player error: FFmpeg not found
```

**Çözüm:**
```bash
# VPS'te FFmpeg'i kontrol et
ffmpeg -version

# FFmpeg yoksa yükle
apt update
apt install ffmpeg -y
```

### C) Audio Stream Sorunu
**Belirtiler:**
```
[DEBUG-PLAYER] Player error: Audio stream failed
```

**Çözüm:**
```bash
# Discord Player paketlerini güncelle
npm update discord-player @discord-player/extractor
pm2 restart neuroviabot
```

### D) YouTube Extractor Sorunu
**Belirtiler:**
```
[DEBUG-PLAY] Playback error: No extractors available
```

**Çözüm:**
```bash
# Extractor'ları yeniden yükle
npm uninstall @discord-player/extractor
npm install @discord-player/extractor@latest
pm2 restart neuroviabot
```

## 🔧 Manuel Test Komutları:

### 1. Voice Channel'a Bağlan
```
/join
```

### 2. Şarkı Ekle
```
/play Never Gonna Give You Up
```

### 3. Queue'yu Kontrol Et
```
/queue
```

### 4. Şarkıyı Başlat
```
/resume
```

## 📊 Başarılı Test Sonucu:
- ✅ Şarkı kuyruğa eklenir
- ✅ Bot voice channel'a bağlanır
- ✅ Şarkı çalmaya başlar
- ✅ "Now Playing" mesajı gelir
- ✅ Ses duyulur

## ⚠️ Hala Çalışmıyorsa:
1. Bot'un Discord permissions'ını kontrol et
2. VPS'in internet bağlantısını kontrol et
3. YouTube'un bot IP'sini engellemediğini kontrol et
4. FFmpeg ve Node.js sürümlerini kontrol et
