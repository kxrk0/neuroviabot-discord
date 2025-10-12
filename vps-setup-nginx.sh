#!/bin/bash

echo "🔧 NeuroViaBot - Nginx Reverse Proxy Kurulumu"
echo "=============================================="
echo ""

# 1. Nginx kurulumu
echo "📦 Nginx kuruluyor..."
apt update
apt install -y nginx

# 2. Nginx'i etkinleştir
echo "✅ Nginx enable ediliyor..."
systemctl enable nginx

# 3. Eski config'i yedekle
echo "💾 Mevcut config yedekleniyor..."
if [ -f /etc/nginx/sites-available/default ]; then
    cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup
fi

# 4. Webhook config'ini kopyala
echo "📝 Webhook config kopyalanıyor..."
cp /root/neuroviabot/bot/nginx-webhook.conf /etc/nginx/sites-available/webhook

# 5. Config'i aktif et
echo "🔗 Config aktif ediliyor..."
ln -sf /etc/nginx/sites-available/webhook /etc/nginx/sites-enabled/webhook

# 6. Default config'i devre dışı bırak (opsiyonel)
echo "🚫 Default site devre dışı bırakılıyor..."
rm -f /etc/nginx/sites-enabled/default

# 7. Nginx config testi
echo "🧪 Nginx config test ediliyor..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx config geçerli"
    
    # 8. Nginx'i restart et
    echo "🔄 Nginx restart ediliyor..."
    systemctl restart nginx
    
    echo ""
    echo "✅ Nginx başarıyla kuruldu ve yapılandırıldı!"
    echo ""
    echo "📊 Nginx durumu:"
    systemctl status nginx --no-pager
    echo ""
    echo "🌐 Webhook artık şu adreste erişilebilir:"
    echo "   http://VPS_IP_ADRESINIZ/webhook"
    echo ""
    echo "💡 GitHub webhook URL'ini şu şekilde güncelle:"
    echo "   http://VPS_IP_ADRESINIZ/webhook"
    echo ""
    echo "🔥 UFW firewall ayarları:"
    echo "   sudo ufw allow 80/tcp"
    echo "   sudo ufw allow 443/tcp"
    echo "   sudo ufw reload"
    echo ""
else
    echo "❌ Nginx config hatası! Lütfen kontrol edin."
    exit 1
fi

