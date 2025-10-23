# 🔧 Müzik Playback Başarısızlık Debug Rehberi

## ❌ Sorun:
Playback başlıyor ama 1 saniye sonra track siliniyor:
```
[DEBUG-PLAY] Playback started successfully
[DEBUG-PLAY] Queue state after playback: isPlaying=false, currentTrack=None, tracksSize=0
```

## 🔍 Olası Nedenler:

### 1. **FFmpeg Sorunu**
**Belirtiler:**
- Playback başlar ama hemen durur
- Audio stream oluşturulamaz

**Çözüm:**
```bash
# VPS'te FFmpeg'i kontrol et
ffmpeg -version

# FFmpeg yoksa yükle
apt update
apt install ffmpeg -y

# FFmpeg'i yeniden başlat
systemctl restart ffmpeg
```

### 2. **YouTube Extractor Sorunu**
**Belirtiler:**
- Track bulunur ama stream oluşturulamaz
- Extractor hatası

**Çözüm:**
```bash
# Extractor'ları yeniden yükle
npm uninstall @discord-player/extractor
npm install @discord-player/extractor@latest
pm2 restart neuroviabot
```

### 3. **Audio Stream Sorunu**
**Belirtiler:**
- Voice channel'a bağlanır ama ses gelmez
- Stream oluşturma hatası

**Çözüm:**
```bash
# Discord Player paketlerini güncelle
npm update discord-player @discord-player/extractor
pm2 restart neuroviabot
```

### 4. **Voice Channel Bağlantı Sorunu**
**Belirtiler:**
- Bot bağlanır ama hemen ayrılır
- Connection error

**Çözüm:**
- Bot'un "Connect" ve "Speak" yetkisi var mı kontrol et
- Voice channel'da başka bot var mı kontrol et
- Bot'un internet bağlantısını kontrol et

## 🔧 Debug Adımları:

### 1. VPS'te Bot'u Güncelle
```bash
ssh root@194.105.5.37
cd /root/neuroviabot/bot
git pull origin main
pm2 restart neuroviabot
```

### 2. Detaylı Logları İzle
```bash
# Tüm player event'lerini izle
pm2 logs neuroviabot --lines 0 | grep -E "(DEBUG-PLAYER|playerError|connectionError|disconnect|emptyQueue)"

# FFmpeg hatalarını izle
pm2 logs neuroviabot --lines 0 | grep -i ffmpeg

# Audio stream hatalarını izle
pm2 logs neuroviabot --lines 0 | grep -i "stream\|audio"
```

### 3. Discord'da Test Et
```
/play https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

### 4. Beklenen Debug Çıktısı:
```
[DEBUG-PLAY] Queue state before playback: isPlaying=false, currentTrack=None, tracksSize=1
[DEBUG-PLAY] Starting playback for track: Never Gonna Give You Up
[DEBUG-PLAY] Playback started successfully
[DEBUG-PLAYER] Track started: Never Gonna Give You Up in Server Name
[DEBUG-PLAY] Queue state after playback: isPlaying=true, currentTrack=Never Gonna Give You Up, tracksSize=0
```

## 🐛 Hata Durumları:

### A) FFmpeg Hatası
```
[DEBUG-PLAYER] Player error: FFmpeg not found
[DEBUG-PLAYER] Error details: { message: "FFmpeg not found", code: "FFMPEG_ERROR" }
```

### B) Audio Stream Hatası
```
[DEBUG-PLAYER] Player error: Audio stream failed
[DEBUG-PLAYER] Error details: { message: "Stream creation failed", code: "STREAM_ERROR" }
```

### C) Connection Hatası
```
[DEBUG-PLAYER] Connection error: Voice connection lost
[DEBUG-PLAYER] Bot disconnected from Server Name
```

### D) Extractor Hatası
```
[DEBUG-PLAYER] Player error: No extractors available
[DEBUG-PLAYER] Error details: { message: "Extractor failed", code: "EXTRACTOR_ERROR" }
```

## 🔧 Manuel Test Komutları:

### 1. FFmpeg Test
```bash
# VPS'te FFmpeg'i test et
ffmpeg -f lavfi -i testsrc=duration=10:size=320x240:rate=1 -f null -

# Ses testi
ffmpeg -f lavfi -i sine=frequency=1000:duration=5 -f null -
```

### 2. YouTube Test
```bash
# YouTube'dan ses indirme testi
youtube-dl --extract-audio --audio-format mp3 "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

### 3. Bot Test
```bash
# Bot'un voice bağlantısını test et
# Discord'da /join komutunu kullan
# Sonra /play komutunu kullan
```

## 📊 Başarılı Test Sonucu:
- ✅ FFmpeg çalışıyor
- ✅ YouTube extractor çalışıyor
- ✅ Audio stream oluşturuluyor
- ✅ Voice channel'a bağlanıyor
- ✅ Şarkı çalıyor
- ✅ Queue durumu korunuyor

## ⚠️ Hala Çalışmıyorsa:
1. VPS'in internet bağlantısını kontrol et
2. YouTube'un bot IP'sini engellemediğini kontrol et
3. Discord'un bot permissions'ını kontrol et
4. Node.js ve npm sürümlerini kontrol et
5. VPS'in RAM ve CPU kullanımını kontrol et
