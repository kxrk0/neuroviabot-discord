require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  },
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID || '773539215098249246',
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL || 'http://localhost:5000/api/auth/callback',
    scope: ['identify', 'email', 'guilds', 'applications.commands', 'connections'],
  },
  (accessToken, refreshToken, profile, done) => {
    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;
    return done(null, profile);
  }
));

// Routes
const authRoutes = require('./routes/auth');
const botRoutes = require('./routes/bot');
const guildRoutes = require('./routes/guilds');

app.use('/api/auth', authRoutes);
app.use('/api/bot', botRoutes);
app.use('/api/guilds', guildRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'neuroviabot-backend',
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  // Join guild room
  socket.on('join_guild', (guildId) => {
    socket.join(`guild_${guildId}`);
    console.log(`[Socket.IO] Client ${socket.id} joined guild ${guildId}`);
  });

  // Leave guild room
  socket.on('leave_guild', (guildId) => {
    socket.leave(`guild_${guildId}`);
    console.log(`[Socket.IO] Client ${socket.id} left guild ${guildId}`);
  });

  // Settings update from dashboard
  socket.on('settings_update', (data) => {
    const { guildId, settings } = data;
    console.log(`[Socket.IO] Settings update for guild ${guildId}:`, settings);
    
    // Broadcast to all clients in this guild room (including bot)
    io.to(`guild_${guildId}`).emit('settings_changed', {
      guildId,
      settings,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// Make io accessible to routes
app.set('io', io);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

server.listen(PORT, () => {
  console.log(`[Backend] Server running on http://localhost:${PORT}`);
  console.log(`[Backend] Socket.IO enabled`);
  console.log(`[Backend] Environment: ${process.env.NODE_ENV || 'development'}`);
});