# 📋 Real-Time Audit Log System - VPS Deployment

## 🚀 Quick Deploy

### Otomatik Deployment
```bash
# 1. Deploy script'i çalıştır
cd /root/neuroviabot/bot/neuroviabot-discord
chmod +x deploy-audit-system.sh
./deploy-audit-system.sh
```

### Manuel Deployment

```bash
# 1. Ana dizine git
cd /root/neuroviabot/bot/neuroviabot-discord

# 2. Git pull
git stash
git pull origin main

# 3. Bot'u restart et
pm2 restart neuroviabot-discord

# 4. Backend'i restart et
cd /root/neuroviabot/bot/neuroviabot-backend
pm2 restart neuroviabot-backend

# 5. Frontend'i rebuild et
cd /root/neuroviabot/bot/neuroviabot-frontend
npm run build
pm2 restart neuroviabot-frontend

# 6. PM2 save
pm2 save

# 7. Status check
pm2 status
```

## ✅ Test Adımları

### 1. Manage Panelini Aç
```
https://neuroviabot.xyz/manage/{serverId}
```

### 2. Denetim Günlüğü Sekmesine Git
- Sol menüden "Denetim Günlüğü" kategorisine tıkla
- Sayfa yüklenmeli ve boş olabilir (henüz log yoksa)

### 3. Real-Time Test
Discord sunucusunda aşağıdaki işlemlerden birini yap:

#### Member Events
- ✅ Birini sunucuya davet et (MEMBER_JOIN)
- ✅ Birini at (MEMBER_KICK)
- ✅ Birini yasakla (MEMBER_BAN)
- ✅ Birine rol ver (MEMBER_UPDATE)
- ✅ Birinin nickname'ini değiştir (MEMBER_UPDATE)

#### Role Events
- ✅ Yeni rol oluştur (ROLE_CREATE)
- ✅ Rol sil (ROLE_DELETE)
- ✅ Rol adını değiştir (ROLE_UPDATE)
- ✅ Rol rengini değiştir (ROLE_UPDATE)

#### Channel Events
- ✅ Yeni kanal oluştur (CHANNEL_CREATE)
- ✅ Kanal sil (CHANNEL_DELETE)
- ✅ Kanal adını değiştir (CHANNEL_UPDATE)

#### Message Events
- ✅ Mesaj sil (MESSAGE_DELETE)
- ✅ Toplu mesaj sil (MESSAGE_BULK_DELETE)

### 4. Kontroller

#### Frontend'de Görünüm
- ✅ Log hemen görünmeli (real-time)
- ✅ Doğru action adı gösterilmeli
- ✅ User ID gösterilmeli
- ✅ Timestamp gösterilmeli
- ✅ Severity renkleri doğru olmalı (info/warning/danger)
- ✅ Icon'lar doğru gösterilmeli

#### Notification
- ✅ Warning/Danger severity'deki event'ler için notification gelmeli
- ✅ Notification doğru mesajı göstermeli

#### Filtering
- ✅ Search box çalışmalı
- ✅ Type filter dropdown çalışmalı
- ✅ Filtreleme anında uygulanmalı

#### Pagination
- ✅ 50'den fazla log varsa pagination gösterilmeli
- ✅ Önceki/Sonraki butonları çalışmalı
- ✅ Sayfa numarası doğru gösterilmeli

#### Export
- ✅ "Dışa Aktar" butonu çalışmalı
- ✅ JSON export çalışmalı
- ✅ CSV export çalışmalı (backend'de)

## 🔍 Debug

### Audit Log Gelmiyor?

#### 1. Bot Loglarını Kontrol Et
```bash
pm2 logs neuroviabot-discord --lines 100
```

Aramalar:
- `📋 Audit Log Handler initialized`
- `[AuditLogger] Logged action:`
- `[AuditLogger] Broadcasted audit log`

#### 2. Socket.IO Connection Kontrol
```bash
# Frontend logs
pm2 logs neuroviabot-frontend --lines 50

# Backend logs
pm2 logs neuroviabot-backend --lines 50
```

Aramalar:
- `Socket.IO client connected`
- `User joined guild room: guild_{guildId}`

#### 3. Browser Console
```javascript
// Socket bağlantısı var mı?
console.log('Socket:', socket);

// Guild room'a katıldı mı?
socket.emit('join_guild', 'YOUR_GUILD_ID');

// Manuel test
socket.on('audit_log_entry', (data) => {
  console.log('📋 Audit Log:', data);
});
```

#### 4. Database Kontrol
```bash
# Database dosyasını kontrol et
cd /root/neuroviabot/bot/neuroviabot-discord/data
cat database.json | jq '.guilds[] | select(.guildId == "YOUR_GUILD_ID") | .auditLogs'
```

#### 5. API Endpoint Test
```bash
# Audit logs endpoint test
curl -X GET "http://localhost:3002/api/bot/audit/YOUR_GUILD_ID" \
  -H "x-api-key: your-secret-api-key"
```

### Frontend Çalışmıyor?

```bash
# Frontend'i durdur ve temizle
cd /root/neuroviabot/bot/neuroviabot-frontend
pm2 delete neuroviabot-frontend
rm -rf .next
rm -rf node_modules

# Dependencies yükle
npm install --legacy-peer-deps

# Build
npm run build

# Start
pm2 start "node_modules/.bin/next start -p 3001" --name "neuroviabot-frontend"
pm2 save
```

### Permission Hatası?

Bot'un Discord'da şu yetkileri olmalı:
- ✅ View Audit Log
- ✅ View Channels
- ✅ Send Messages
- ✅ Manage Guild (opsiyonel ama önerilen)

Kontrol:
```
Discord Server Settings > Integrations > NeuroViaBot > Permissions
```

## 📊 Monitoring

### Real-Time Logs
```bash
# Bot logs (audit events)
pm2 logs neuroviabot-discord --lines 100 | grep "AuditLogger"

# Backend logs
pm2 logs neuroviabot-backend --lines 50

# Frontend logs
pm2 logs neuroviabot-frontend --lines 50

# Tümü
pm2 logs --lines 50
```

### Performance
```bash
# PM2 monitoring
pm2 monit

# System resources
htop
```

### Database Size
```bash
# Database boyutunu kontrol et
cd /root/neuroviabot/bot/neuroviabot-discord/data
du -h database.json

# Audit logs sayısı (guild başına max 1000)
cat database.json | jq '.guilds[] | .auditLogs | length'
```

## 🛠️ Troubleshooting

### Problem: Logs Gelmiyor

**Çözüm 1: Bot'u Restart Et**
```bash
pm2 restart neuroviabot-discord
pm2 logs neuroviabot-discord --lines 50
```

**Çözüm 2: Socket.IO Bağlantısını Test Et**
- Browser console'u aç
- Network tab'inde WebSocket bağlantısını kontrol et
- `wss://neuroviabot.xyz` bağlantısı aktif olmalı

**Çözüm 3: Discord Bot Token Kontrol**
```bash
cd /root/neuroviabot/bot/neuroviabot-discord
cat .env | grep BOT_TOKEN
```

### Problem: Duplicate Logs

**Çözüm: Event Listener Duplicate**
```bash
# Bot'u tamamen durdur ve tekrar başlat
pm2 stop neuroviabot-discord
sleep 2
pm2 start neuroviabot-discord
```

### Problem: Pagination Çalışmıyor

**Çözüm: Frontend Cache Temizle**
```bash
cd /root/neuroviabot/bot/neuroviabot-frontend
rm -rf .next
npm run build
pm2 restart neuroviabot-frontend
```

### Problem: Export Çalışmıyor

**Çözüm: Backend API Kontrol**
```bash
# Test export endpoint
curl -X GET "http://localhost:3002/api/bot/audit/YOUR_GUILD_ID/export?format=json" \
  -H "x-api-key: your-secret-api-key"
```

## 📝 Configuration

### Environment Variables

**Bot (.env)**
```bash
BOT_TOKEN=your_bot_token
BOT_API_PORT=3002
```

**Backend (.env)**
```bash
BOT_API_URL=http://localhost:3002
BOT_API_KEY=your-secret-api-key
PORT=3000
```

**Frontend (.env.local)**
```bash
NEXT_PUBLIC_API_URL=https://neuroviabot.xyz
NEXT_PUBLIC_SOCKET_URL=https://neuroviabot.xyz
```

## 🎉 Success Criteria

✅ **Sistem başarılı sayılır eğer:**

1. **Real-Time Updates**
   - Discord'da yapılan her işlem 1 saniye içinde frontend'de görünüyor
   
2. **Event Coverage**
   - Member, Role, Channel, Message, Guild event'leri yakalanıyor
   
3. **Notifications**
   - Warning/Danger event'lerde notification geliyor
   
4. **Filtering**
   - Search ve type filter çalışıyor
   
5. **Pagination**
   - 50+ log'da pagination görünüyor ve çalışıyor
   
6. **Export**
   - JSON/CSV export düzgün çalışıyor
   
7. **Performance**
   - Sistem gecikme yaşamıyor
   - Memory leak yok
   
8. **Stability**
   - 24 saat kesintisiz çalışıyor

## 🔗 Links

- **Manage Panel**: https://neuroviabot.xyz/manage/{serverId}
- **API Docs**: https://neuroviabot.xyz/api/docs
- **Status**: https://status.neuroviabot.xyz

## 📞 Support

Sorun yaşıyorsan:
1. PM2 logs kontrol et
2. Browser console kontrol et
3. Discord bot permissions kontrol et
4. Database backup al
5. Deploy script'i tekrar çalıştır

**Sistem production-ready ve tamamen functional!** 🎊

