#!/bin/bash

echo "🔧 GitHub Actions SSH Key Setup"
echo "================================"
echo ""

# SSH dizinini oluştur (yoksa)
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# SSH key oluştur
echo "🔑 SSH key oluşturuluyor..."
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy -N ""

# Public key'i authorized_keys'e ekle
echo "✅ Public key authorized_keys'e ekleniyor..."
cat ~/.ssh/github_actions_deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

echo ""
echo "✅ SSH key başarıyla oluşturuldu!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 GITHUB SECRETS'A EKLENECEKs DEĞERLER:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔗 Git: https://github.com/kxrk0/neuroviabot-discord/settings/secrets/actions"
echo ""
echo "1️⃣ VPS_SSH_KEY (Private Key):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cat ~/.ssh/github_actions_deploy
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "2️⃣ VPS_HOST:"
echo "   194.105.5.37"
echo ""
echo "3️⃣ VPS_USERNAME:"
echo "   root"
echo ""
echo "4️⃣ VPS_PORT:"
echo "   22"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 Private key'i (yukarıdaki tüm satırları) VPS_SSH_KEY olarak GitHub'a ekle!"
echo ""
echo "✅ Setup tamamlandı! Şimdi:"
echo "   1. GitHub Secrets'ı ekle"
echo "   2. Bir commit push et ve test et"
echo "   3. pm2 delete webhook-deploy (artık gerek yok)"
echo ""

