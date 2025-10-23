# ⚠️ GÜVENLİK UYARISI - LÜTFEN OKUYUN!

## 🔒 ASLA YAPMAYINIZ

❌ **GERÇEK TOKEN'LARI GITHUB'A PUSH ETMEYİN!**
❌ **GERÇEK SECRET'LARI DOKÜMANTASYONDA PAYLAŞMAYIN!**
❌ **GERÇEK .env DOSYALARINI COMMIT ETMEYİN!**

---

## ✅ Token'larınızı Nerede Saklayacağınız

### 1. **LOCAL (Bilgisayarınız)**
```
📁 /root/neuroviabot/bot/.env
   └─ GERÇEK token'lar burada
   └─ .gitignore'da (push edilmez)
```

### 2. **VPS (Sunucu)**
```
📁 /root/neuroviabot/bot/.env
   └─ GERÇEK token'lar burada
   └─ Git tarafından yönetilmez
```

### 3. **GitHub Secrets**
```
🔐 Settings > Secrets > Actions
   └─ DISCORD_TOKEN: gerçek token
   └─ DISCORD_CLIENT_SECRET: gerçek secret
   └─ SESSION_SECRET: gerçek secret
```

---

## 📝 Dokümantasyonda SADECE Placeholder Kullanın

### ✅ DOĞRU Örnekler:

```bash
DISCORD_TOKEN=YOUR_BOT_TOKEN_HERE
DISCORD_CLIENT_ID=YOUR_CLIENT_ID_HERE
DISCORD_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
```

```bash
DISCORD_TOKEN=MTIzNDU2Nzg5MDEyMzQ1Njc4OTAu... (örnek - gerçek değil)
```

### ❌ YANLIŞ - Gerçek Token Örneği:

```bash
# BU ŞEKİLDE ASLA YAZMAYINIZ!
DISCORD_TOKEN=NzczNTM5MjE1MDk4MjQ5MjQ2.GpTMDe.WArQmgqTCJX_xWhHREZ75EKTKEN_DqMbUW6_ys
```

---

## 🔍 Token Leak Kontrolü

Push yapmadan önce kontrol edin:

```bash
# Repository'de token var mı?
git log -p | grep -i "GpTMDe\|UXxunZzBQ"

# Hangi dosyalarda var?
grep -r "GpTMDe" .

# .env commit edilmiş mi?
git ls-files | grep .env
```

---

## 🚨 Token Sızdıysa Ne Yapmalı?

1. **HEMEN Discord Developer Portal'a gidin**
2. **Token'ı Regenerate edin**
3. **Yeni token'ı sadece güvenli yerlere ekleyin:**
   - Local `.env` dosyası
   - VPS `.env` dosyası  
   - GitHub Secrets
4. **GitHub history'i temizleyin (gerekirse)**

---

## ✅ Güvenli Push Kontrol Listesi

Push yapmadan önce:

- [ ] `.env` dosyası `.gitignore`'da mı?
- [ ] Gerçek token'lar dokümantasyonda yok mu?
- [ ] `git status` temiz mi?
- [ ] Sadece kod ve placeholder'lar push ediliyor mu?

---

## 📚 Daha Fazla Bilgi

- **SECURITY-WARNING.md** - Detaylı güvenlik rehberi
- **GITHUB-SECRETS.md** - GitHub Secrets yapılandırması
- **DEPLOYMENT.md** - Güvenli deployment rehberi

---

**🔒 UNUTMAYIN:**
Token'ınız = Bot'unuzun şifresi!  
Kimseyle paylaşmayın, public yapmayın!

**Son Güncelleme:** 29 Eylül 2025
