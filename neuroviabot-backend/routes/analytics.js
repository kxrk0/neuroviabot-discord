const express = require('express');
const router = express.Router();
const axios = require('axios');

const BOT_API_URL = process.env.BOT_API_URL || 'http://localhost:3002';
const BOT_API_KEY = process.env.BOT_API_KEY || 'neuroviabot-secret';

// Auth middleware
const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// GET /api/analytics/advanced/:guildId
router.get('/advanced/:guildId', requireAuth, async (req, res) => {
  try {
    const { guildId } = req.params;
    const { timeRange = '7d' } = req.query;
    
    console.log(`[Analytics] Fetching advanced analytics for guild ${guildId} (${timeRange})`);
    
    try {
      const response = await axios.get(`${BOT_API_URL}/api/bot/analytics/${guildId}/advanced?timeRange=${timeRange}`, {
        headers: { 'Authorization': `Bearer ${BOT_API_KEY}` },
        timeout: 10000,
      });
      
      res.json(response.data);
    } catch (botError) {
      // Return mock data structure for frontend to use
      console.log('[Analytics] Bot API unavailable, returning empty structure');
      res.json({
        success: true,
        analytics: null // Frontend will generate mock data
      });
    }
  } catch (error) {
    console.error('[Analytics] Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics'
    });
  }
});

// GET /api/analytics/:guildId
router.get('/:guildId', requireAuth, async (req, res) => {
  try {
    const { guildId } = req.params;
    
    console.log(`[Analytics] Fetching analytics for guild ${guildId}`);
    
    const response = await axios.get(`${BOT_API_URL}/api/bot/analytics/${guildId}`, {
      headers: { 'Authorization': `Bearer ${BOT_API_KEY}` },
      timeout: 10000,
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('[Analytics] Error fetching:', error.message);
    
    // Return empty analytics on error
    res.json({
      success: true,
      guildId: req.params.guildId,
      enabled: false,
      analytics: {
        totalMessages: 0,
        totalJoins: 0,
        totalLeaves: 0,
        totalCommands: 0,
        totalVoiceTime: 0,
        activeUsers: 0,
        topChannels: [],
        topUsers: [],
      },
      timestamp: Date.now(),
    });
  }
});

module.exports = router;

