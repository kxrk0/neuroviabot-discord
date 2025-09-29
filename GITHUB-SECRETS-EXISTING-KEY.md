# 🔑 Mevcut SSH Key ile GitHub Secrets Kurulumu

Bu rehber, zaten kullandığınız SSH key'i NeuroViaBot deployment için nasıl kullanacağınızı gösterir.

## ✅ **Adım Adım Kurulum**

### **1. Mevcut SSH Key'inizi Bulun**

VPS'te veya local makinenizde:

```bash
# Mevcut key'leri listele
ls -la ~/.ssh/

# Genellikle:
# id_rsa (private key)
# id_rsa.pub (public key)
# veya
# id_ed25519 (private key)
# id_ed25519.pub (public key)
```

### **2. Private Key'i Kopyalayın**

```bash
# Private key'in TAMAMINI kopyalayın
cat ~/.ssh/id_rsa
# veya
cat ~/.ssh/id_ed25519
```

**Örnek çıktı:**
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABlwAAAAdzc2gtcn
NhAAAAAwEAAQAAAYEAzxQ...
...
...tüm satırlar...
...
-----END OPENSSH PRIVATE KEY-----
```

⚠️ **ÖNEMLİ:** 
- `-----BEGIN` ile başlayan ve `-----END` ile biten TÜM satırları kopyalayın
- Hiçbir satırı eksik bırakmayın
- Başında/sonunda boşluk bırakmayın

### **3. GitHub Secrets'a Ekleyin**

1. GitHub repository'nize gidin: https://github.com/kxrk0/neuroviabot-discord
2. **Settings** > **Secrets and variables** > **Actions**
3. **New repository secret** butonuna tıklayın
4. Secret ekleyin:

```
Name: VPS_SSH_KEY
Secret: [Kopyaladığınız PRIVATE KEY'in tamamı]
```

5. **Add secret** butonuna tıklayın

### **4. Public Key'in VPS'te Olduğunu Doğrulayın**

```bash
# VPS'e bağlanın (root kullanıcısı)
ssh root@your_vps_ip

# Public key'in authorized_keys'de olduğunu kontrol edin
cat ~/.ssh/authorized_keys | grep "$(cat ~/.ssh/id_rsa.pub | cut -d' ' -f2)"
```

Eğer çıktı varsa, key zaten ekli ✅

Eğer çıktı yoksa, ekleyin:

```bash
# Public key'i authorized_keys'e ekle
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys

# İzinleri düzelt
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

---

## 🧪 **Test: SSH Key'in Çalıştığını Doğrulayın**

### **Manuel Test (Local'den VPS'e)**

```bash
# SSH ile bağlanmayı test edin
ssh -i ~/.ssh/id_rsa root@your_vps_ip "echo 'SSH connection successful!'"
```

✅ Başarılı olursa: `SSH connection successful!` yazmalı  
❌ Hata alırsanız: Aşağıdaki sorun giderme adımlarına bakın

### **GitHub Actions Test**

1. GitHub repository > **Actions** sekmesi
2. **Deploy Discord Bot to VPS** workflow'u seç
3. **Run workflow** butonuna tıkla
4. Logları izle

**Başarılı deployment logları:**
```
✅ Checking out code
✅ Setting up SSH
✅ Deploying to VPS
✅ Starting bot deployment...
✅ Bot deployment completed!
```

---

## 🐛 **Sorun Giderme**

### **Problem 1: Permission denied (publickey)**

```bash
# VPS'te izinleri kontrol edin
ls -la ~/.ssh/
# authorized_keys: -rw------- (600)
# .ssh klasörü: drwx------ (700)

# İzinleri düzeltin
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### **Problem 2: Host key verification failed**

GitHub Actions workflow'larında `StrictHostKeyChecking=no` zaten var, sorun olmamalı.

Manuel test için:
```bash
ssh -o StrictHostKeyChecking=no -i ~/.ssh/id_rsa root@your_vps_ip
```

### **Problem 3: Key'de passphrase var**

❌ **Sorun:** GitHub Actions passphrase giremez, otomatik erişim başarısız olur.

✅ **Çözüm 1:** Passphrase'siz yeni bir key oluşturun (sadece GitHub Actions için)

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github-actions -N ""
```

✅ **Çözüm 2:** Mevcut key'in passphrase'ini kaldırın (önerilmez)

```bash
ssh-keygen -p -f ~/.ssh/id_rsa
# Enter old passphrase
# New passphrase: [boş bırakın]
# Confirm: [boş bırakın]
```

### **Problem 4: VPS_SSH_KEY secret yanlış kopyalanmış**

- Secret'ı kontrol edin: GitHub > Settings > Secrets > VPS_SSH_KEY
- Başında/sonunda boşluk olmamalı
- `-----BEGIN` ve `-----END` satırları olmalı
- Tüm satırlar eksiksiz olmalı

**Yeniden eklemek için:**
1. Eski secret'ı silin
2. Private key'i temiz bir şekilde yeniden kopyalayın
3. Yeni secret oluşturun

---

## 🔒 **Güvenlik Önerileri**

### **✅ YAPILMASI GEREKENLER**

1. **Key Rotasyonu:** 6 ayda bir key'i değiştirin
2. **Authorized Keys Kontrolü:** Düzenli olarak gereksiz key'leri silin
3. **Monitoring:** SSH login loglarını takip edin
4. **Firewall:** SSH portunu (22) sadece gerekli IP'lere açın

```bash
# SSH login loglarını kontrol et
sudo tail -f /var/log/auth.log

# Aktif SSH bağlantılarını gör
who
```

### **❌ YAPILMAMASI GEREKENLER**

1. ❌ Private key'i public yere koymayın (GitHub repo, blog, vs.)
2. ❌ Aynı key'i çok fazla yerde kullanmayın
3. ❌ Root user için aynı key'i kullanmayın
4. ❌ Key'i şifrelenmemiş olarak paylaşmayın

---

## 📊 **Önerilen: Key Yönetim Stratejisi**

Farklı amaçlar için farklı key'ler:

```
~/.ssh/
├── id_rsa              # Ana key (genel kullanım)
├── id_rsa.pub
├── github-actions      # Sadece GitHub Actions için
├── github-actions.pub
├── backup-key          # Backup için
└── backup-key.pub
```

**Her key için authorized_keys'de:**
```bash
# ~/.ssh/authorized_keys
command="echo 'GitHub Actions only'" ssh-ed25519 AAAA... github-actions
ssh-rsa AAAA... your-main-key
```

---

## 🎯 **Hızlı Başlangıç Checklist**

- [ ] Mevcut private key'i buldum
- [ ] Private key'in TAMAMINI kopyaladım
- [ ] GitHub Secrets'a VPS_SSH_KEY olarak ekledim
- [ ] Public key'in VPS'te authorized_keys'de olduğunu doğruladım
- [ ] SSH bağlantısını manuel olarak test ettim
- [ ] GitHub Actions workflow'unu çalıştırdım
- [ ] Deployment başarılı oldu

---

## 📞 **Yardım**

Hala sorun mu yaşıyorsunuz?

1. [DEPLOYMENT.md](./DEPLOYMENT.md) dosyasına bakın
2. [GITHUB-SECRETS.md](./GITHUB-SECRETS.md) dosyasına bakın
3. GitHub Issues açın

---

**Son Güncelleme:** 29 Eylül 2025
