# 🚀 NeuroViaBot Setup Guide

Complete setup guide for NeuroViaBot Discord Bot with Web Dashboard.

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **Discord Bot Token** from [Discord Developer Portal](https://discord.com/developers/applications)
- **Discord OAuth2 Credentials** (Client ID & Secret)

## 🔧 Quick Setup

### 1. Clone & Install

```bash
git clone https://github.com/kxrk0/neuroviabot-discord.git
cd neuroviabot-discord
npm install
```

### 2. Environment Setup

Create `.env` file in the root directory:

```env
# Discord Bot (Required)
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=773539215098249246
DISCORD_CLIENT_SECRET=your_client_secret_here

# Backend API
PORT=5000
FRONTEND_URL=http://localhost:3001
BACKEND_URL=http://localhost:5000

# Discord OAuth2
DISCORD_CALLBACK_URL=http://localhost:5000/api/auth/callback
SESSION_SECRET=your_random_session_secret_minimum_32_characters

# NextAuth (Frontend)
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_nextauth_secret_minimum_32_characters
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_BOT_CLIENT_ID=773539215098249246
```

### 3. Discord Developer Portal Configuration

#### Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Name it "NeuroViaBot" (or your preferred name)

#### Bot Setup

1. Go to "Bot" tab
2. Click "Add Bot"
3. Copy the **Token** → Add to `DISCORD_TOKEN` in `.env`
4. Enable these **Privileged Gateway Intents**:
   - ✅ Presence Intent
   - ✅ Server Members Intent  
   - ✅ Message Content Intent

#### OAuth2 Setup

1. Go to "OAuth2" tab
2. Copy **Client ID** → Already set as `773539215098249246`
3. Copy **Client Secret** → Add to `DISCORD_CLIENT_SECRET`
4. Add Redirect URLs:
   - `http://localhost:5000/api/auth/callback`
   - `http://localhost:3001/api/auth/callback/discord`

### 4. Install Dependencies

```bash
# Bot Dependencies
npm install

# Backend Dependencies
cd neuroviabot-backend
npm install
cd ..

# Frontend Dependencies
cd neuroviabot-frontend
npm install
cd ..
```

## 🎮 Running the Project

### Option 1: Run All Together (Recommended)

```bash
# In root directory
npm run dev:all
```

This starts:
- Discord Bot (Port: default)
- Backend API (Port: 5000)
- Frontend Dashboard (Port: 3001)

### Option 2: Run Separately

#### Terminal 1 - Discord Bot
```bash
npm start
# or for development
npm run dev
```

#### Terminal 2 - Backend API
```bash
cd neuroviabot-backend
npm run dev
```

#### Terminal 3 - Frontend Dashboard
```bash
cd neuroviabot-frontend
npm run dev
```

## 🌐 Accessing the Dashboard

1. Open browser: `http://localhost:3001`
2. Click **"Continue with Discord"**
3. Authorize the application
4. Select your server
5. Configure bot settings!

## 📦 Production Build

### Build Frontend

```bash
cd neuroviabot-frontend
npm run build
npm start
```

### Build for Production

```bash
# Build all
npm run build

# Or individually
cd neuroviabot-frontend && npm run build
```

## 🔑 Bot Invite Link

Replace `YOUR_CLIENT_ID` with your Discord Client ID:

```
https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands
```

For NeuroViaBot (default):
```
https://discord.com/oauth2/authorize?client_id=773539215098249246&permissions=8&scope=bot%20applications.commands
```

## 📊 Features Overview

### ✅ Implemented Features

- 🔐 **Discord OAuth2 Authentication**
- 🎵 **Music System** (YouTube & Spotify)
- 🛡️ **Moderation Tools** (Auto-mod, Spam Protection)
- 💰 **Economy System** (Virtual Currency, Casino)
- 📈 **Leveling System** (XP & Role Rewards)
- 👋 **Welcome Messages** (Custom Embeds)
- 🎫 **Ticket System**
- 🎁 **Giveaway System**
- 📱 **Real-time Dashboard** (Socket.IO)
- ⚙️ **Live Settings Sync**

### 🎛️ Dashboard Panels

All settings are configurable via web dashboard:

1. **Moderation Settings**
   - Auto-moderation rules
   - Spam protection
   - Link/invite filtering
   - Profanity filter
   - Warning system

2. **Welcome System**
   - Custom welcome messages
   - Embed designer
   - Auto-role assignment
   - DM greetings

3. **Music Settings**
   - Default volume
   - DJ role
   - Queue settings
   - 24/7 mode

4. **Economy Settings**
   - Currency configuration
   - Earning rates
   - Casino games
   - Shop system

5. **Leveling System**
   - XP rates
   - Level-up messages
   - Role rewards
   - Leaderboard

## 🔄 Real-time Features

The dashboard uses Socket.IO for real-time updates:

- ⚡ Instant settings synchronization
- 🔄 Live bot status
- 📊 Real-time statistics
- 🔔 Event notifications

## 🛠️ Troubleshooting

### Bot Not Responding

1. Check bot token in `.env`
2. Verify bot is online in Discord
3. Ensure bot has proper permissions
4. Check console for errors

### Dashboard Login Issues

1. Verify OAuth2 credentials
2. Check redirect URLs in Developer Portal
3. Clear browser cookies
4. Restart backend server

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Frontend
cd neuroviabot-frontend
rm -rf .next node_modules
npm install
npm run build
```

## 📝 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DISCORD_TOKEN` | ✅ | Bot token from Developer Portal |
| `DISCORD_CLIENT_ID` | ✅ | OAuth2 Client ID |
| `DISCORD_CLIENT_SECRET` | ✅ | OAuth2 Client Secret |
| `SESSION_SECRET` | ✅ | Random string (32+ chars) |
| `NEXTAUTH_SECRET` | ✅ | Random string (32+ chars) |
| `PORT` | ❌ | Backend port (default: 5000) |
| `FRONTEND_URL` | ❌ | Frontend URL (default: localhost:3001) |
| `NEXT_PUBLIC_API_URL` | ❌ | Backend API URL |

## 🔐 Security Notes

- **Never commit** `.env` file to Git
- Use **strong secrets** for SESSION_SECRET and NEXTAUTH_SECRET
- Keep bot token **private**
- Enable **2FA** on Discord account
- Regularly **rotate secrets** in production

## 📞 Support

- **GitHub Issues**: [Create an issue](https://github.com/kxrk0/neuroviabot-discord/issues)
- **Documentation**: See README.md
- **Discord Server**: Coming soon

## 📜 License

MIT License - See LICENSE file for details

---

**Made with ❤️ by the NeuroVia Team**
