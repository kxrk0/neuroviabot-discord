// ==========================================
// ⚙️ NeuroViaBot Backend API
// ==========================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
});

// ==========================================
// Middleware Configuration
// ==========================================

// Security
app.use(helmet());
app.use(compression());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// ==========================================
// Discord OAuth Configuration
// ==========================================

passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: process.env.DISCORD_REDIRECT_URI || 'http://localhost:5000/api/auth/callback',
  scope: ['identify', 'guilds'],
}, (accessToken, refreshToken, profile, done) => {
  // Save user to database here
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// ==========================================
// Routes
// ==========================================

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Auth routes
app.get('/api/auth/discord', passport.authenticate('discord'));

app.get('/api/auth/callback',
  passport.authenticate('discord', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(process.env.CORS_ORIGIN || 'http://localhost:3000/dashboard');
  }
);

app.get('/api/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.redirect(process.env.CORS_ORIGIN || 'http://localhost:3000');
  });
});

app.get('/api/auth/user', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json(req.user);
});

// Bot stats
app.get('/api/bot/stats', (req, res) => {
  // Bu endpoint bot'tan veri çekecek
  res.json({
    guilds: 66,
    users: 90000,
    commands: 41,
    uptime: process.uptime(),
  });
});

// Guild management
app.get('/api/guilds', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  // Kullanıcının sunucularını getir
  res.json(req.user.guilds || []);
});

app.get('/api/guilds/:id/settings', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  // Sunucu ayarlarını getir
  res.json({
    guildId: req.params.id,
    settings: {},
  });
});

app.put('/api/guilds/:id/settings', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  // Sunucu ayarlarını güncelle
  res.json({
    success: true,
    message: 'Settings updated',
  });
});

// ==========================================
// WebSocket Events
// ==========================================

io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
  
  // Real-time bot updates
  socket.on('subscribe:guild', (guildId) => {
    socket.join(`guild:${guildId}`);
    console.log(`📊 Client subscribed to guild: ${guildId}`);
  });
});

// ==========================================
// Error Handling
// ==========================================

app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
  });
});

// ==========================================
// Server Start
// ==========================================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║  ⚙️  NeuroViaBot Backend API                          ║
║  🚀 Server running on port ${PORT}                    ║
║  🌍 Environment: ${process.env.NODE_ENV || 'development'}              ║
║  📡 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'} ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

module.exports = { app, io };
