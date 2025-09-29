# 🤖 NeuroViaBot - Full-Stack Discord Bot Platform

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-green" alt="Node.js">
  <img src="https://img.shields.io/badge/Discord.js-14.14.1-blue" alt="Discord.js">
  <img src="https://img.shields.io/badge/Next.js-14.0.4-black" alt="Next.js">
  <img src="https://img.shields.io/badge/Express.js-4.18.2-yellow" alt="Express.js">
  <img src="https://img.shields.io/badge/Status-Production%20Ready-brightgreen" alt="Status">
</p>

<p align="center">
  Advanced Discord Bot with modern web interface, AI capabilities, and comprehensive server management tools.
</p>

---

## 🌟 **Features**

### 🤖 **Discord Bot**
- ✅ **AI-Powered Responses** - GPT integration for intelligent conversations
- ✅ **Advanced Moderation** - Auto-mod, ban management, role assignments
- ✅ **Custom Commands** - Slash commands with dynamic responses
- ✅ **Music System** - High-quality music streaming
- ✅ **Server Analytics** - Detailed statistics and insights
- ✅ **Multi-language Support** - Turkish and English support

### 🌐 **Web Dashboard**
- ✅ **Modern UI/UX** - Built with Next.js and Tailwind CSS
- ✅ **Discord OAuth2** - Secure authentication system
- ✅ **Real-time Statistics** - Live bot and server metrics
- ✅ **Server Management** - Configure bot settings through web interface
- ✅ **User Profiles** - Personal dashboards and preferences
- ✅ **Mobile Responsive** - Optimized for all devices

### ⚡ **Backend API**
- ✅ **RESTful API** - Express.js powered backend
- ✅ **Rate Limiting** - Protection against abuse
- ✅ **JWT Authentication** - Secure session management
- ✅ **Database Integration** - User and server data storage
- ✅ **Real-time Updates** - WebSocket support for live features
- ✅ **Comprehensive Logging** - Detailed error tracking and analytics

---

## 🏗️ **Architecture**

```
neuroviabot.xyz
├── 🌐 Frontend (Next.js)     │ Port 3000 │ Web Dashboard
├── ⚡ Backend (Express.js)   │ Port 5000 │ REST API
├── 🤖 Bot (Discord.js)       │ Port 5001 │ Discord Bot + Status API
└── 🔧 Caddy                  │ Port 80   │ Reverse Proxy + SSL
```

### **Technology Stack**

#### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Framer Motion
- **Auth**: Discord OAuth2 + JWT
- **State**: React Hooks + Context API
- **Deployment**: PM2 + Caddy

#### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Auth**: JWT + Discord OAuth2
- **Database**: SQLite/PostgreSQL (configurable)
- **Security**: Helmet + CORS + Rate Limiting
- **Logging**: Winston

#### Bot
- **Library**: Discord.js v14
- **Commands**: Slash Commands + Prefix Support
- **Database**: Sequelize ORM
- **Process Management**: PM2
- **Status API**: Express.js mini-server

---

## 🚀 **Quick Start**

### **Prerequisites**
- **VPS/Server** with Ubuntu 20.04+
- **Domain** pointed to your server
- **Discord Application** with bot token
- **Node.js** 18+ and npm
- **SSH access** to your server

### **1. Clone Repository**
```bash
git clone https://github.com/swaffX/neuroviabot-website.git
cd neuroviabot-website
```

### **2. Configure Environment**
```bash
# Set required environment variables
export DISCORD_TOKEN="your_bot_token_here"
export DISCORD_CLIENT_SECRET="your_client_secret_here"
export JWT_SECRET="your_super_secret_jwt_key"
```

### **3. Deploy to VPS**
```bash
# Make deployment script executable
chmod +x deploy/deploy.sh

# Run deployment
./deploy/deploy.sh --production
```

### **4. Access Your Application**
- **Website**: `http://neuroviabot.xyz`
- **API**: `http://neuroviabot.xyz/api/health`
- **Bot Status**: `http://neuroviabot.xyz/bot-status`

---

## 📋 **Detailed Setup Guide**

### **VPS Setup** 

#### 1. **Initial VPS Configuration**
```bash
# Run the VPS installation script
sudo bash deploy/vps-install.sh
```

This script will:
- ✅ Update system packages
- ✅ Install Node.js 18+ LTS
- ✅ Install PM2 process manager
- ✅ Configure Caddy reverse proxy
- ✅ Setup firewall (UFW)
- ✅ Create project directory structure

#### 2. **Domain Configuration**

**Cloudflare DNS Settings:**
```
Type: A
Name: @
Content: YOUR_VPS_IP
Proxy: Off (Gray Cloud)

Type: A  
Name: www
Content: YOUR_VPS_IP
Proxy: Off (Gray Cloud)
```

#### 3. **Discord Application Setup**

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create new application → **NeuroViaBot**
3. Go to **Bot** section:
   - Reset Token → Copy token
   - Enable all **Privileged Gateway Intents**
4. Go to **OAuth2** section:
   - Add Redirect URI: `http://neuroviabot.xyz/api/auth/callback`
   - Copy Client ID and Client Secret

### **Environment Variables**

Create `.env` file in project root:
```bash
# Domain Configuration
DOMAIN=neuroviabot.xyz
VPS_IP=YOUR_VPS_IP

# Application Ports
FRONTEND_PORT=3000
BACKEND_PORT=5000
BOT_STATUS_PORT=5001

# Discord Configuration
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=773539215098249246
DISCORD_CLIENT_SECRET=your_client_secret_here
DISCORD_REDIRECT_URI=http://neuroviabot.xyz/api/auth/callback

# JWT Secret (generate strong random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Node Environment
NODE_ENV=production
```

---

## 🔧 **Development**

### **Local Development Setup**

#### 1. **Install Dependencies**
```bash
# Frontend
cd frontend && npm install

# Backend  
cd backend && npm install

# Bot
cd bot && npm install
```

#### 2. **Start Development Servers**
```bash
# Terminal 1 - Frontend (http://localhost:3000)
cd frontend && npm run dev

# Terminal 2 - Backend (http://localhost:5000)
cd backend && npm run dev

# Terminal 3 - Bot
cd bot && npm run dev
```

#### 3. **Development URLs**
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`
- **Bot Status**: `http://localhost:5001`

### **Project Structure**
```
neuroviabot/
├── 📁 frontend/              # Next.js Web Application
│   ├── app/                  # Next.js App Router
│   ├── components/           # React Components
│   ├── public/               # Static Assets
│   └── package.json
│
├── 📁 backend/               # Express.js API Server
│   ├── routes/               # API Routes
│   ├── middleware/           # Custom Middleware
│   ├── config/               # Configuration Files
│   └── server.js             # Main Server File
│
├── 📁 bot/                   # Discord Bot
│   ├── commands/             # Slash Commands
│   ├── events/               # Discord Events
│   ├── config/               # Bot Configuration
│   └── index.js              # Main Bot File
│
├── 📁 deploy/                # Deployment Scripts
│   ├── vps-install.sh        # VPS Setup Script
│   └── deploy.sh             # Main Deployment Script
│
├── 📁 .github/workflows/     # GitHub Actions CI/CD
│   └── deploy.yml            # Auto-deployment Workflow
│
└── 📄 README.md              # This File
```

---

## 🚀 **Deployment**

### **Automated Deployment (Recommended)**

#### **GitHub Actions (Auto-Deploy)**
1. **Fork** this repository
2. **Add secrets** to GitHub repository:
   ```
   VPS_SSH_KEY         # Your VPS private SSH key
   DISCORD_TOKEN       # Discord bot token
   DISCORD_CLIENT_SECRET # Discord OAuth2 client secret
   JWT_SECRET          # JWT signing secret
   ```
3. **Push to main branch** → Automatic deployment

#### **Manual Deployment**
```bash
# Deploy to production
./deploy/deploy.sh --production

# Deploy for development
./deploy/deploy.sh --development

# Update code only (no service restart)
./deploy/deploy.sh --update-only
```

### **Service Management**

#### **PM2 Commands**
```bash
# Check service status
pm2 status

# View logs
pm2 logs neuroviabot-frontend
pm2 logs neuroviabot-backend
pm2 logs neuroviabot-bot

# Restart services
pm2 restart neuroviabot-frontend
pm2 restart neuroviabot-backend
pm2 restart neuroviabot-bot

# Stop services
pm2 stop all

# Monitor resources
pm2 monit
```

#### **Caddy Commands**
```bash
# Test configuration
caddy validate --config /etc/caddy/Caddyfile

# Reload configuration
sudo systemctl reload caddy

# Restart Caddy
sudo systemctl restart caddy

# Check status
sudo systemctl status caddy
```

---

## 📊 **Monitoring & Logging**

### **Health Checks**
- **Frontend**: `http://neuroviabot.xyz`
- **Backend**: `http://neuroviabot.xyz/api/health`
- **Bot**: `http://neuroviabot.xyz/bot-status`

### **Log Files**
```bash
# Application logs
tail -f /root/neuroviabot/logs/bot-combined.log
tail -f /root/neuroviabot/logs/bot-error.log

# PM2 logs
pm2 logs --lines 100

# Caddy logs
tail -f /var/log/caddy/access.log
tail -f /var/log/caddy/neuroviabot.log
```

### **Performance Monitoring**
```bash
# System resources
htop

# PM2 monitoring
pm2 monit

# Disk usage
df -h

# Memory usage
free -h
```

---

## 🔒 **Security**

### **Security Features**
- ✅ **Rate Limiting** - API abuse protection
- ✅ **CORS Protection** - Cross-origin request filtering
- ✅ **Helmet.js** - Security headers
- ✅ **JWT Authentication** - Secure session management
- ✅ **Input Validation** - SQL injection prevention
- ✅ **HTTPS Ready** - SSL certificate support
- ✅ **Firewall** - UFW configured ports

### **SSL Certificate Setup (Automatic)**
```bash
# Caddy automatically handles SSL certificates!
# Just make sure your domain points to the VPS and Caddy will:
# ✅ Automatically obtain SSL certificates from Let's Encrypt
# ✅ Auto-renew certificates before expiration
# ✅ Redirect HTTP to HTTPS automatically

# Check SSL status
systemctl status caddy

# View Caddy logs for SSL info
journalctl -u caddy -f
```

---

## 🛠️ **Troubleshooting**

### **Common Issues**

#### **Bot not responding**
```bash
# Check bot logs
pm2 logs neuroviabot-bot

# Restart bot
pm2 restart neuroviabot-bot

# Verify Discord token
echo $DISCORD_TOKEN
```

#### **Website not loading**
```bash
# Check frontend status
pm2 status neuroviabot-frontend

# Check Caddy configuration
caddy validate --config /etc/caddy/Caddyfile

# Check domain DNS
nslookup neuroviabot.xyz
```

#### **API errors**
```bash
# Check backend logs
pm2 logs neuroviabot-backend

# Test API endpoint
curl http://localhost:5000/health

# Check environment variables
cat /root/neuroviabot/current/.env
```

### **Support**

For additional support:
- 📧 **Email**: support@neuroviabot.xyz
- 💬 **Discord**: [Join our server](https://discord.gg/neuroviabot)
- 🐛 **Issues**: [GitHub Issues](https://github.com/swaffX/neuroviabot-website/issues)
- 📖 **Docs**: [Full Documentation](https://docs.neuroviabot.xyz)

---

## 📄 **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🎯 **Contributing**

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** Pull Request

---

## 🙏 **Acknowledgments**

- **Discord.js** community for excellent documentation
- **Next.js** team for the amazing framework
- **Vercel** for hosting inspiration
- **OpenAI** for AI integration capabilities

---

<p align="center">
  <strong>Made with ❤️ by NeuroVia Team</strong>
</p>

<p align="center">
  <a href="https://neuroviabot.xyz">Website</a> •
  <a href="https://discord.gg/neuroviabot">Discord</a> •
  <a href="https://github.com/swaffX/neuroviabot-website">GitHub</a>
</p>