# ⚙️ NeuroViaBot Backend API

Express.js REST API for NeuroViaBot dashboard with Discord OAuth and WebSocket support.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development server (with nodemon)
npm run dev

# Production server
npm start
```

## 🛠️ Tech Stack

- **Framework:** Express.js
- **Authentication:** Passport.js (Discord Strategy)
- **Real-time:** Socket.io
- **Security:** Helmet, CORS, Rate Limiting
- **Session:** express-session with SQLite

## 📁 Project Structure

```
backend/
├── index.js               # Main application
├── routes/               # API routes
├── middleware/           # Custom middleware
├── models/               # Data models
└── utils/                # Utilities
```

## ⚙️ Configuration

Create `.env`:

```env
PORT=5000
NODE_ENV=production
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
DISCORD_REDIRECT_URI=http://localhost:5000/api/auth/callback
SESSION_SECRET=your_session_secret
BOT_TOKEN=your_bot_token
CORS_ORIGIN=http://localhost:3000
```

## 📡 API Endpoints

### Authentication
- `GET /api/auth/discord` - Start Discord OAuth
- `GET /api/auth/callback` - OAuth callback
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/user` - Get current user

### Bot Stats
- `GET /api/bot/stats` - Get bot statistics
- `GET /health` - Health check

### Guilds
- `GET /api/guilds` - Get user guilds
- `GET /api/guilds/:id/settings` - Get guild settings
- `PUT /api/guilds/:id/settings` - Update guild settings

## 🔒 Security Features

- ✅ Helmet.js security headers
- ✅ CORS protection
- ✅ Rate limiting
- ✅ Session management
- ✅ Input validation

## 📄 License

MIT
