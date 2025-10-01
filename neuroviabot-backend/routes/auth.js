const express = require('express');
const passport = require('passport');
const router = express.Router();

// Discord OAuth login
router.get('/discord', passport.authenticate('discord'));

// Discord OAuth callback
router.get('/callback',
  (req, res, next) => {
    console.log('[OAuth] Callback received');
    passport.authenticate('discord', (err, user, info) => {
      if (err) {
        console.error('[OAuth] Error:', err);
        return res.status(500).json({ error: 'Authentication failed', details: err.message });
      }
      
      if (!user) {
        console.error('[OAuth] No user returned', info);
        return res.status(401).json({ error: 'Authentication failed', details: 'No user data' });
      }
      
      console.log('[OAuth] User authenticated:', user.username);
      
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error('[OAuth] Login error:', loginErr);
          return res.status(500).json({ error: 'Login failed', details: loginErr.message });
        }
        
        console.log('[OAuth] Login successful, session ID:', req.sessionID);
        console.log('[OAuth] Session cookie:', req.session.cookie);
        
        // Redirect to frontend dashboard overview
        return res.redirect('https://neuroviabot.xyz/dashboard/overview');
      });
    })(req, res, next);
  }
);

// Get current user
router.get('/user', (req, res) => {
  console.log('[Auth] /user called, session ID:', req.sessionID);
  console.log('[Auth] isAuthenticated:', req.isAuthenticated());
  
  if (!req.isAuthenticated()) {
    console.log('[Auth] User not authenticated, session:', req.session);
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
