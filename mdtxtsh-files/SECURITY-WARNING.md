# 🔒 GÜVENLİK UYARISI - ÖNEMLİ!

## ⚠️ Discord Token Güvenliği

### **ASLA YAPMAMANIZ GEREKENLER:**

❌ **Token'ları GitHub'a push etmeyin**
- .env dosyasını commit etmeyin
- Hardcoded token kullanmayın
- Public repository'de token göstermeyin

❌ **Token'ları paylaşmayın**
- Discord'da paylaşmayın
- Screenshot'larda göstermeyin
- Log dosyalarında göstermeyin

❌ **Güvensiz yerlerde saklamayın**
- Plain text dosyalarında
- Public pastebin'lerde
- Şifrelenmemiş yerlerde

---

## ✅ GÜVENLİ KULLANIM PRATİKLERİ:

### 1. **Environment Variables Kullanın**

```javascript
// ❌ YANLIŞ - Hardcoded token
const token = 'MTIzNDU2Nzg5MDEyMzQ1Njc4OTAu...'; // ASLA BÖYLE YAPMAYIN!

// ✅ DOĞRU - Environment variable
const token = process.env.DISCORD_TOKEN;
```

### 2. **.gitignore Kullanın**

```gitignore
# Environment files
.env
.env.local
.env.production

# Config files with secrets
config/config.json
```

### 3. **.env.example Oluşturun**

```env
# .env.example (GitHub'a ekleyin)
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
```

```env
# .env (GitHub'a ASLA EKLEMEYİN!)
DISCORD_TOKEN=MTIzNDU2Nzg5MDEyMzQ1Njc4OTAuAbCdEf.GhIjKlMnOpQrStUvWxYz123456789012
DISCORD_CLIENT_ID=123456789012345678
DISCORD_CLIENT_SECRET=AbCdEfGhIjKlMnOpQrStUvWxYz123456
```

---

## 🚨 TOKEN SIZDI MI?

Eğer token'ınız public oldu ise **HEMEN**:

### 1. **Discord Developer Portal'a Gidin**
https://discord.com/developers/applications

### 2. **Token'ı Regenerate Edin**
- Uygulamanızı seçin
- Bot sekmesine gidin
- "Reset Token" butonuna tıklayın
- Yeni token'ı kopyalayın

### 3. **Tüm Yerlerde Güncelleyin**
```bash
# Local .env dosyanızı güncelleyin
nano .env
# Yeni token'ı yapıştırın

# VPS'te .env dosyasını güncelleyin
ssh root@your_vps_ip
cd /root/neuroviabot/bot
nano .env
# Yeni token'ı yapıştırın

# GitHub Secrets'ı güncelleyin
# Settings > Secrets > DISCORD_TOKEN > Update
```

### 4. **Botu Restart Edin**
```bash
# VPS'te
pm2 restart neuroviabot
```

---

## 🔐 GitHub Secrets

GitHub Actions için secret'ları şu şekilde saklayın:

**Repository > Settings > Secrets and variables > Actions**

✅ **Avantajları:**
- Logs'da görünmez
- History'de saklanmaz
- Sadece Actions erişebilir
- Şifreli saklanır

---

## 📊 Token Leak Kontrol

Repository'nizde leak olup olmadığını kontrol edin:

```bash
# Git history'de token arama
git log -p | grep -i "discord_token"

# Tüm dosyalarda arama
grep -r "NzczNTM5" .

# .env dosyasının commit edilmediğini kontrol
git ls-files | grep .env
```

Eğer `.env` çıktı verirse:
```bash
# .env'i git'ten kaldır
git rm --cached .env
git commit -m "Remove .env from git"
git push origin main
```

---

## 🛡️ Proaktif Güvenlik

### **1. Pre-commit Hook Kullanın**

```bash
# .git/hooks/pre-commit
#!/bin/bash
if grep -r "DISCORD_TOKEN.*=.*[A-Za-z0-9]" . --exclude-dir=.git --exclude-dir=node_modules; then
    echo "❌ ERROR: Discord token found in files!"
    echo "Remove tokens before committing."
    exit 1
fi
```

### **2. Secret Scanner Kullanın**

```bash
# truffleHog ile scan
pip install truffleHog
trufflehog --regex --entropy=False .
```

### **3. GitHub Secret Scanning**

GitHub otomatik olarak token'ları tespit eder ve size bildirim gönderir.

**Settings > Code security and analysis > Secret scanning**

---

## 📞 Yardım

Token sızdı ve ne yapacağınızı bilmiyorsanız:

1. **Önce token'ı regenerate edin** (yukarıdaki adımlar)
2. GitHub'daki tüm commit history'de token varsa:
   - Repository'i private yapın
   - Veya history'i temizleyin (tehlikeli!)
3. Yardım için Discord sunucumuza gelin

---

## ✅ Güvenlik Kontrol Listesi

Deployment öncesi kontrol edin:

- [ ] `.env` dosyası `.gitignore`'da
- [ ] `.env` dosyası commit edilmemiş
- [ ] Hardcoded token yok
- [ ] GitHub Secrets yapılandırılmış
- [ ] Token regenerate edildi (public olduysa)
- [ ] VPS .env dosyası güncel
- [ ] Bot çalışıyor

---

**🔒 Unutmayın:** Token'ınız = Bot'unuzun şifresi  
**Kimseyle paylaşmayın, güvenli saklayın!**

**Son Güncelleme:** 29 Eylül 2025
