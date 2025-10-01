const express = require('express');
const passport = require('passport');
const router = express.Router();

// Discord OAuth login
router.get('/discord', passport.authenticate('discord'));

// Discord OAuth callback
router.get('/callback',
  (req, res, next) => {
    passport.authenticate('discord', (err, user, info) => {
      if (err) {
        console.error('Discord OAuth error:', err);
        return res.status(500).json({ error: 'Authentication failed', details: err.message });
      }
      
      if (!user) {
        console.error('Discord OAuth: No user returned', info);
        return res.status(401).json({ error: 'Authentication failed', details: 'No user data' });
      }
      
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error('Login error:', loginErr);
          return res.status(500).json({ error: 'Login failed', details: loginErr.message });
        }
        
        // Redirect to frontend dashboard overview
        return res.redirect('https://neuroviabot.xyz/dashboard/overview');
      });
    })(req, res, next);
  }
);

// Get current user
router.get('/user', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  res.json({
    id: req.user.id,
    username: req.user.username,
    discriminator: req.user.discriminator,
    avatar: req.user.avatar,
    email: req.user.email,
    accessToken: req.user.accessToken,
  });
});

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true });
  });
});

module.exports = router;
