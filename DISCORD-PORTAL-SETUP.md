# 🔧 Discord Developer Portal Kurulum Rehberi

## 📍 Adım 1: Discord Developer Portal'a Git

1. [Discord Developer Portal](https://discord.com/developers/applications) adresine git
2. Application'ını seç (Client ID: `773539215098249246`)

## 📍 Adım 2: OAuth2 Redirect URLs'leri Ekle

### OAuth2 → General → Redirects bölümüne git

Şu **4 URL'yi** ekle:

### ✅ Development (Local) URL'leri:

```
http://localhost:3001/api/auth/callback/discord
```
↑ NextAuth (Frontend) için

```
http://localhost:5000/api/auth/callback
```
↑ Backend Passport.js için (yedek)

### ✅ Production (VPS) URL'leri:

```
https://neuroviabot.xyz/api/auth/callback/discord
```
↑ NextAuth (Frontend) için - **ANA SİSTEM**

```
https://neuroviabot.xyz/api/auth/callback
```
↑ Backend Passport.js için (yedek)

### ⚠️ ÖNEMLİ:
- Her URL'yi tek tek ekle
- **Save Changes** butonuna bas
- URL'lerde hiç boşluk olmamalı
- Tam olarak yukarıdaki gibi olmalı

## 📍 Adım 3: Scopes Kontrolü

OAuth2 bölümünde şu scope'ların seçili olduğundan emin ol:
- ✅ `identify`
- ✅ `email`
- ✅ `guilds`

## 📍 Adım 4: Bot Permissions

Bot → Permissions bölümünde:
- ✅ Administrator (Permission: 8) - **Tüm yetkiler**

## 📍 Adım 5: URL Generator (Test için)

OAuth2 → URL Generator bölümüne git:

### Login URL'si için:
**Scopes:**
- ✅ identify
- ✅ email
- ✅ guilds

**Redirect URL:**
```
http://localhost:3001/api/auth/callback/discord
```

**Oluşan URL:**
```
https://discord.com/oauth2/authorize?client_id=773539215098249246&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fapi%2Fauth%2Fcallback%2Fdiscord&scope=identify+email+guilds
```

### Bot Ekleme URL'si için:
**Scopes:**
- ✅ bot

**Bot Permissions:**
- ✅ Administrator (8)

**Redirect URL:**
```
http://localhost:3001/api/auth/callback/discord
```

**Oluşan URL:**
```
https://discord.com/oauth2/authorize?client_id=773539215098249246&permissions=8&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fapi%2Fauth%2Fcallback%2Fdiscord&scope=bot
```

## ✅ Özet

Discord Developer Portal'da olması gerekenler:

### Redirects (4 adet):
1. `http://localhost:3001/api/auth/callback/discord` ← **Development Ana**
2. `http://localhost:5000/api/auth/callback` ← Development Yedek
3. `https://neuroviabot.xyz/api/auth/callback/discord` ← **Production Ana**
4. `https://neuroviabot.xyz/api/auth/callback` ← Production Yedek

### Scopes:
- `identify`, `email`, `guilds` (OAuth için)
- `bot` (Bot ekleme için)

### Permissions:
- Administrator (8) - Tüm yetkiler

## 🎯 Sonraki Adımlar

1. ✅ Discord Portal ayarları tamam
2. ✅ ENV dosyaları güncellendi
3. 🔄 Şimdi local'de test et:
   ```bash
   # Backend'i başlat
   cd neuroviabot-backend
   npm run dev
   
   # Frontend'i başlat (başka terminal)
   cd neuroviabot-frontend
   npm run dev
   ```
4. 🌐 http://localhost:3001/login adresine git
5. 🎮 "Continue with Discord" butonuna bas
6. ✅ Discord'a yönlendirilmeli ve geri dönmeli
