# 🚀 NeuroViaBot - Development Guide

## 📋 Project Structure

```
neuroviabot-discord/
├── neuroviabot-frontend/     # Next.js 15 + React 19 + TypeScript
├── neuroviabot-backend/      # Express.js API
├── src/                      # Discord Bot Source
├── config/                   # Bot Configuration
└── data/                     # Bot Data
```

---

## ⚡ Quick Start

### 1️⃣ **Install Dependencies**

```bash
# Frontend
cd neuroviabot-frontend
npm install

# Backend
cd ../neuroviabot-backend
npm install

# Bot (Root)
cd ..
npm install
```

### 2️⃣ **Environment Setup**

#### **Backend (.env)**
```env
# neuroviabot-backend/.env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001

DISCORD_CLIENT_ID=773539215098249246
DISCORD_CLIENT_SECRET=UXxunZzBQNpkRIAlCgDGPIdcbSZNemlk
DISCORD_CALLBACK_URL=http://localhost:5000/api/auth/discord/callback

SESSION_SECRET=your-secret-key-here
```

#### **Frontend (.env.local)**
```env
# neuroviabot-frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5000
```

#### **Bot (.env)**
```env
# Root .env
DISCORD_TOKEN=your-bot-token
DISCORD_CLIENT_ID=773539215098249246
DISCORD_CLIENT_SECRET=UXxunZzBQNpkRIAlCgDGPIdcbSZNemlk
```

### 3️⃣ **Start Development Server**

**Option A: Frontend + Backend (Concurrent)**
```bash
cd neuroviabot-frontend
npm run dev
```
This automatically starts:
- Frontend: `http://localhost:3001`
- Backend: `http://localhost:5000`

**Option B: Separate Terminals**
```bash
# Terminal 1: Frontend
cd neuroviabot-frontend
npm run dev:frontend

# Terminal 2: Backend
cd neuroviabot-backend
npm run dev

# Terminal 3: Discord Bot
npm start
```

---

## 🔥 Development Workflow

### **Frontend Development**
```bash
cd neuroviabot-frontend

npm run dev           # Start dev server (frontend + backend)
npm run dev:frontend  # Frontend only
npm run build         # Production build
npm run start         # Start production server
npm run lint          # Lint code
```

### **Backend Development**
```bash
cd neuroviabot-backend

npm run dev           # Start with nodemon
npm start             # Start production
```

### **Discord Bot**
```bash
# Root directory
npm start             # Start bot
```

---

## 📡 API Endpoints

### **Authentication**
- `GET /api/auth/discord` - Start Discord OAuth
- `GET /api/auth/discord/callback` - OAuth callback
- `GET /api/auth/user` - Get current user
- `POST /api/auth/logout` - Logout

### **Bot Stats**
- `GET /api/bot/stats` - Bot statistics
- `GET /api/bot/status` - Bot status

### **Guilds**
- `GET /api/guilds/user` - User's guilds
- `GET /api/guilds/:id/settings` - Guild settings
- `PATCH /api/guilds/:id/settings` - Update settings
- `GET /api/guilds/:id/stats` - Guild stats
- `GET /api/guilds/:id/members` - Guild members

---

## 🎨 Frontend Structure

```
neuroviabot-frontend/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── login/page.tsx              # Login page
│   ├── dashboard/
│   │   ├── page.tsx                # Dashboard overview
│   │   ├── layout.tsx              # Dashboard layout
│   │   └── servers/
│   │       ├── page.tsx            # Servers list
│   │       └── [id]/page.tsx       # Server details
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Global styles
├── components/
│   ├── ui/                         # UI components
│   ├── auth/                       # Auth components
│   └── layout/                     # Layout components
├── lib/
│   ├── api.ts                      # API client
│   ├── auth.ts                     # Auth config
│   └── utils.ts                    # Utilities
├── hooks/
│   └── useToast.tsx                # Toast hook
└── types/
    └── index.ts                    # TypeScript types
```

---

## 🔧 Tech Stack

### **Frontend**
- **Next.js 15.5.4** - React framework with Turbopack
- **React 19 RC** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Axios** - HTTP client

### **Backend**
- **Express.js** - Web framework
- **Passport.js** - Discord OAuth
- **Axios** - HTTP client
- **Express Session** - Session management

### **Discord Bot**
- **Discord.js v14** - Discord API
- **Discord-Player v6** - Music system
- **Sequelize** - ORM
- **SQLite3** - Database

---

## 🐛 Common Issues

### **1. Port Already in Use**
```bash
# Kill process on port 3001
npx kill-port 3001

# Kill process on port 5000
npx kill-port 5000
```

### **2. Backend Not Starting**
- Check `.env` file in `neuroviabot-backend/`
- Ensure `PORT=5000` is set
- Check if dependencies are installed

### **3. Frontend Can't Connect to Backend**
- Verify backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Check CORS settings in backend

### **4. Discord OAuth Not Working**
- Verify redirect URI in Discord Developer Portal:
  - **Development**: `http://localhost:5000/api/auth/discord/callback`
  - **Production**: `https://api.neuroviabot.xyz/api/auth/discord/callback`

---

## 📝 Coding Standards

- ✅ Use TypeScript for frontend
- ✅ Use `const` over `let`
- ✅ Use async/await over promises
- ✅ Use Tailwind CSS for styling
- ✅ Use Framer Motion for animations
- ✅ Always handle errors with try/catch
- ✅ Use meaningful variable names
- ✅ Comment complex logic

---

## 🚀 Deployment

**VPS Deployment** is handled via webhook:
- Push to `main` branch
- Webhook triggers deployment
- Frontend & backend rebuild automatically
- PM2 restarts services

**Do NOT trigger deployment manually** unless instructed.

---

## 📞 Need Help?

- Read the code comments
- Check `FRONTEND-DEVELOPMENT-PLAN.md`
- Review API documentation in `neuroviabot-backend/README.md`

---

**Happy Coding! 🎉**
