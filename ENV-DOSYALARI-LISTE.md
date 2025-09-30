# 📋 ENV Dosyaları - Kullanılan Dosyalar Listesi

## ✅ KULLANILAN DOSYALAR

### 1. Ana Dizin
```
neuroviabot-discord/
└── .env                          ✅ Ana konfigürasyon (Bot token, genel ayarlar)
```

**İçindekiler:**
- Discord bot token
- Bot display settings (color, volume, etc.)
- Economy, moderation, premium ayarları
- Feature flags
- System configuration

---

### 2. Backend (neuroviabot-backend/)
```
neuroviabot-backend/
└── .env                          ✅ Backend OAuth & API Server
```

**İçindekiler:**
- `PORT=5000`
- `FRONTEND_URL=http://localhost:3001`
- **Discord OAuth (Passport.js):**
  - `DISCORD_CLIENT_ID`
  - `DISCORD_CLIENT_SECRET`
  - `DISCORD_CALLBACK_URL=http://localhost:5000/api/auth/callback`
- `SESSION_SECRET`

**ÖNEMLİ:** OAuth burada yapılıyor! Backend Passport.js kullanıyor.

---

### 3. Frontend (neuroviabot-frontend/)
```
neuroviabot-frontend/
└── .env.local                    ✅ Frontend public variables
```

**İçindekiler:**
- `NEXT_PUBLIC_API_URL=http://localhost:5000` (Backend API URL)
- `NEXT_PUBLIC_BOT_CLIENT_ID=773539215098249246`
- **NextAuth DISABLED** - Backend OAuth kullanıyoruz

**ÖNEMLİ:** Frontend sadece backend'e proxy yapıyor, OAuth yapmıyor!

---

## ❌ SİLİNEN/KULLANILMAYAN DOSYALAR

- ❌ `env` (ana dizinde - .env kullanıyoruz)
- ❌ `neuroviabot-frontend/env.production` (gereksiz)
- ❌ `neuroviabot-backend/env` (gereksiz)
- ❌ `neuroviabot-frontend/.env.production` (silindi)
- ❌ `neuroviabot-backend/.env.production` (silindi)

---

## 📚 REFERANS DOSYALARI (Opsiyonel - Silinebilir)

Bu dosyalar sadece örnek/referans için. Kullanılmıyor:

- `.env.example` (ana dizin)
- `neuroviabot-backend/.env.example`
- `neuroviabot-frontend/.env.local.example`

İstersen bunları da silebilirsin, ama örnek olarak bırakılabilir.

---

## 🔄 OAuth Akışı

### Backend OAuth (Passport.js):

```
1. User clicks "Login with Discord"
   ↓
2. Frontend redirect: http://localhost:5000/api/auth/discord
   ↓
3. Backend Passport.js redirects to Discord OAuth
   ↓
4. User authorizes on Discord
   ↓
5. Discord redirects: http://localhost:5000/api/auth/callback?code=...
   ↓
6. Backend Passport.js handles callback
   ↓
7. Backend redirects to: http://localhost:3001/dashboard/servers
   ✅ User logged in!
```

### Discord Developer Portal Redirect URLs:

**Development:**
```
http://localhost:5000/api/auth/callback
```

**Production:**
```
https://neuroviabot.xyz/api/auth/callback
```

---

## 🎯 Özet

| Klasör | Dosya | Kullanım | OAuth |
|--------|-------|----------|-------|
| **Ana Dizin** | `.env` | ✅ Kullanılıyor | Bot ayarları |
| **Backend** | `.env` | ✅ Kullanılıyor | **OAuth BURDA!** |
| **Frontend** | `.env.local` | ✅ Kullanılıyor | Sadece API URL |

**Toplam: 3 dosya kullanılıyor!**

---

## 🚀 Başlatma

```bash
# Backend (Terminal 1)
cd neuroviabot-backend
npm run dev

# Frontend (Terminal 2)  
cd neuroviabot-frontend
npm run dev
```

**Test:** http://localhost:3001/login → "Continue with Discord"
