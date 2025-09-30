# 🔧 Production Auth Hatalarını Çözme Rehberi

**Hata:** `https://neuroviabot.xyz/api/auth/error`

**⚠️ NOT:** VPS kullanıyorsan **VPS-KURULUM-REHBERI.md** dosyasına bak! Daha spesifik ve kolay.

Bu hatanın 3 ana nedeni var. Hepsini adım adım çözelim:

---

## ❌ HATA 1: Redirect URL Eksik

### 🔍 Sorun Nedir?
Discord, OAuth callback için doğru redirect URL'i bulamıyor.

### ✅ DETAYLI ÇÖZÜM

#### Adım 1: Discord Developer Portal'a Git
1. Tarayıcında [https://discord.com/developers/applications](https://discord.com/developers/applications) adresini aç
2. Discord hesabınla giriş yap

#### Adım 2: Uygulamanı Seç
1. Uygulamalar listesinde **Client ID'si `773539215098249246` olan** uygulamayı bul
2. Üstüne tıkla

#### Adım 3: OAuth2 Ayarlarına Git
1. Sol menüden **"OAuth2"** sekmesine tıkla
2. **"General"** alt sekmesinde kal

#### Adım 4: Redirect URL Ekle
1. Sayfayı aşağı kaydır, **"Redirects"** bölümünü bul
2. **"Add Redirect"** butonuna tıkla
3. Açılan kutucuğa **TAM OLARAK** şunu yaz:
   ```
   https://neuroviabot.xyz/api/auth/callback/discord
   ```

#### ⚠️ ÖNEMLİ NOKTALAR:
- ✅ `https://` ile başlamalı (http değil!)
- ✅ Son `/` işareti **OLMAMALI**
- ✅ `api/auth/callback/discord` - tam olarak bu path
- ✅ Domain adı **neuroviabot.xyz** (www olmadan)

#### Adım 5: Kaydet
1. Sayfanın altındaki **"Save Changes"** butonuna tıkla
2. Yeşil "Saved!" mesajını gör

#### Adım 6: Doğrula
**Redirects** listesinde şunları görmelisin:
```
✓ https://neuroviabot.xyz/api/auth/callback/discord
✓ http://localhost:3001/api/auth/callback/discord (development için)
```

#### 📸 Görsel Yardım:
```
┌─────────────────────────────────────────┐
│ OAuth2 > General                        │
├─────────────────────────────────────────┤
│                                         │
│ Redirects                               │
│ ┌─────────────────────────────────────┐ │
│ │ https://neuroviabot.xyz/api/auth/  │ │
│ │ callback/discord                    │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [+ Add Redirect]    [Save Changes]     │
└─────────────────────────────────────────┘
```

---

## ❌ HATA 2: NEXTAUTH_SECRET Yok

### 🔍 Sorun Nedir?
NextAuth, güvenlik için rastgele bir secret key bekliyor ama bulamıyor.

### ✅ DETAYLI ÇÖZÜM

#### Adım 1: Secret Oluştur

**Windows PowerShell'de:**
```powershell
# PowerShell'i aç (Win + X, sonra A)
# Şu komutu çalıştır:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Mac/Linux Terminal'de:**
```bash
openssl rand -base64 32
```

**Çıktı örneği:**
```
KzY8vH9fJ2mN4pQ1rS6tU7vW8xY9zA0bC1dE2fG3hH4=
```

Bu değeri **KOPYALA** (Ctrl+C / Cmd+C)

#### Adım 2: Hosting Platformuna Ekle

##### VERCEL Kullanıyorsan:

1. [https://vercel.com/dashboard](https://vercel.com/dashboard) git
2. Projenin adına tıkla (neuroviabot veya benzeri)
3. Üstte **"Settings"** sekmesine tıkla
4. Sol menüden **"Environment Variables"** seç
5. **"Add"** butonuna tıkla

**Şu bilgileri gir:**
```
Name:  NEXTAUTH_SECRET
Value: KzY8vH9fJ2mN4pQ1rS6tU7vW8xY9zA0bC1dE2fG3hH4=
        (senin generate ettiğin değer)
Environment: Production, Preview, Development (hepsini seç)
```

6. **"Save"** butonuna tıkla

##### NETLIFY Kullanıyorsan:

1. Netlify Dashboard'a git
2. Site'ını seç
3. **Site settings** → **Environment variables**
4. **"Add a variable"** tıkla
5. Key: `NEXTAUTH_SECRET`
6. Value: (generate ettiğin değer)
7. **"Set variable"** tıkla

##### Kendi VPS/Sunucu Kullanıyorsan:

1. SSH ile sunucuna bağlan
2. Proje klasörüne git
3. `.env.production` dosyasını düzenle:
```bash
nano .env.production
# veya
vim .env.production
```

4. Şu satırı ekle:
```env
NEXTAUTH_SECRET=KzY8vH9fJ2mN4pQ1rS6tU7vW8xY9zA0bC1dE2fG3hH4=
```

5. Kaydet (Ctrl+X, Y, Enter)
6. Uygulamayı yeniden başlat:
```bash
pm2 restart neuroviabot-frontend
```

#### Adım 3: Doğrula

Environment variables listesinde şunu görmelisin:
```
✓ NEXTAUTH_SECRET = KzY8vH9fJ2...
```

---

## ❌ HATA 3: DISCORD_CLIENT_SECRET Yanlış

### 🔍 Sorun Nedir?
Discord'a gönderilen client secret yanlış veya eski.

### ✅ DETAYLI ÇÖZÜM

#### Adım 1: Discord'dan Doğru Secret'ı Al

1. [Discord Developer Portal](https://discord.com/developers/applications)'a git
2. Uygulamanı aç
3. **"OAuth2"** → **"General"** sekmesine git
4. **"Client Secret"** bölümünü bul

#### Adım 2: Secret'ı Görüntüle

**ÖNEMLİ:** Secret gizlidir, görmek için:

1. **"Reset Secret"** butonunu BUL (ama henüz tıklama!)
2. Eğer secret'ı daha önce kaybettiysen:
   - **"Reset Secret"** butonuna tıkla
   - **"Yes, do it!"** onaylayarak yeni secret oluştur
   - ⚠️ **DİKKAT:** Bu eski secret'ı geçersiz kılar!

3. Secret göründüğünde **"Copy"** butonuna tıkla

**Secret örneği:**
```
vH9fJ2mN4pQ1rS6tU7vW8xY9zA0bC1dE2fG3hH4iJ5k
```

#### Adım 3: Hosting Platformuna Ekle

##### VERCEL:

1. Vercel Dashboard → Projen → Settings → Environment Variables
2. Varsa `DISCORD_CLIENT_SECRET`'ı bul ve **Edit** tıkla
3. Yoksa **"Add"** tıkla
4. Şu bilgileri gir:
```
Name:  DISCORD_CLIENT_SECRET
Value: vH9fJ2mN4pQ1rS6tU7vW8xY9zA0bC1dE2fG3hH4iJ5k
        (Discord'dan kopyaladığın değer)
Environment: Production, Preview, Development
```
5. **"Save"** tıkla

##### NETLIFY:

1. Netlify → Site → Site settings → Environment variables
2. Varsa `DISCORD_CLIENT_SECRET`'ı düzenle
3. Yoksa **"Add a variable"** tıkla
4. Key: `DISCORD_CLIENT_SECRET`
5. Value: (Discord'dan kopyaladığın)
6. **"Set variable"** tıkla

##### VPS/Sunucu:

```bash
# .env.production dosyasını düzenle
nano .env.production

# Şu satırı ekle/güncelle:
DISCORD_CLIENT_SECRET=vH9fJ2mN4pQ1rS6tU7vW8xY9zA0bC1dE2fG3hH4iJ5k

# Kaydet ve çık
# Uygulamayı yeniden başlat
pm2 restart all
```

#### Adım 4: Tüm Environment Variables'ı Kontrol Et

Hosting platformunda şunları göreceksin:

```
✓ DISCORD_CLIENT_ID        = 773539215098249246
✓ DISCORD_CLIENT_SECRET    = vH9fJ2mN...
✓ NEXTAUTH_URL            = https://neuroviabot.xyz
✓ NEXTAUTH_SECRET         = KzY8vH9...
✓ NEXT_PUBLIC_API_URL     = https://neuroviabot.xyz
✓ NEXT_PUBLIC_BOT_CLIENT_ID = 773539215098249246
```

---

## 🚀 ADIM 4: Yeniden Deploy Et

### Vercel:
1. Environment variables'ı kaydettikten sonra **otomatik** redeploy olur
2. Veya manuel: **Deployments** → en üstteki deployment → **"..."** → **"Redeploy"**

### Netlify:
1. **Deploys** sekmesine git
2. **"Trigger deploy"** → **"Clear cache and deploy site"**

### VPS:
```bash
# Git'ten çek
git pull origin main

# Dependencies güncelle
cd neuroviabot-frontend
npm install

# Build
npm run build

# Restart
pm2 restart neuroviabot-frontend
```

---

## ✅ ADIM 5: Test Et

### 1. Tarayıcı Temizliği
1. Tarayıcıda `Ctrl + Shift + Delete` (Windows) veya `Cmd + Shift + Delete` (Mac)
2. **Cookies** ve **Cached images** seç
3. Time range: **Last hour**
4. **Clear data** tıkla

### 2. Test Login
1. `https://neuroviabot.xyz/login` adresine git
2. **"Continue with Discord"** butonuna tıkla
3. Discord yetkilendirme sayfası açılmalı
4. **"Authorize"** tıkla
5. `https://neuroviabot.xyz/dashboard/servers` adresine yönlendirilmelisin

### 3. Başarı Göstergeleri

✅ **ÇALIŞIYORSA:**
- Discord yetkilendirme sayfası açılır
- "Authorize" sonrası dashboard'a gider
- URL'de `/api/auth/error` görünmez
- Kullanıcı bilgilerin gözükür

❌ **HALA HATA VARSA:**
- `/api/auth/error` sayfasına gider
- Console'da hata mesajları görünür
- Login sonsuz döngüye girer

---

## 🔍 Hala Çalışmıyorsa?

### Debug Mode Aç

1. Hosting platformunda env var ekle:
```
NEXTAUTH_DEBUG=true
```

2. Redeploy et

3. Browser'da `F12` (Developer Tools) aç

4. **Console** sekmesine git

5. Login'i tekrar dene

6. Console'da detaylı hata mesajlarını göreceksin

### Hata Mesajlarını Oku

**"redirect_uri_mismatch"**
→ Redirect URL yanlış, HATA 1'e dön

**"invalid_client"**
→ Client secret yanlış, HATA 3'e dön

**"Configuration error"**
→ NEXTAUTH_SECRET eksik, HATA 2'ye dön

---

## 📋 Final Checklist

Tüm bunları yaptıktan sonra kontrol et:

- [ ] Discord Portal → Redirect URL eklendi: `https://neuroviabot.xyz/api/auth/callback/discord`
- [ ] Hosting → `NEXTAUTH_SECRET` eklendi (32+ karakter, rastgele)
- [ ] Hosting → `DISCORD_CLIENT_SECRET` eklendi (Discord'dan alındı)
- [ ] Hosting → `NEXTAUTH_URL=https://neuroviabot.xyz` (trailing slash yok!)
- [ ] Hosting → Tüm env vars **Production** environment'a eklendi
- [ ] Deploy işlemi tamamlandı
- [ ] Browser cookies temizlendi
- [ ] Test login başarılı

---

## 💡 Ekstra İpuçları

### URL Formatları
```
✅ DOĞRU: https://neuroviabot.xyz
❌ YANLIŞ: https://neuroviabot.xyz/
❌ YANLIŞ: http://neuroviabot.xyz
❌ YANLIŞ: https://www.neuroviabot.xyz
```

### Secret Format
```
✅ DOĞRU: KzY8vH9fJ2mN4pQ1rS6tU7vW8xY9zA0bC1dE2fG3hH4=
❌ YANLIŞ: mysecret123
❌ YANLIŞ: test
```

### Environment Variables İsimleri
```
✅ DOĞRU: NEXTAUTH_SECRET
❌ YANLIŞ: NEXT_AUTH_SECRET
❌ YANLIŞ: nextauth_secret
❌ YANLIŞ: NextAuthSecret
```

---

## 📞 Destek

Hala sorun yaşıyorsan:

1. Browser console screenshot'unu al
2. Hosting platform environment variables listesini kontrol et (values gizli olsun)
3. Discord redirect URLs screenshot'unu al
4. GitHub Issues'a detaylı açıklama ile aç

---

**Son Güncelleme:** 2025-01-30  
**Versiyon:** 2.0  
**Test Edildi:** ✅ Vercel, Netlify, VPS
