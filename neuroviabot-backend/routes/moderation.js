const express = require('express');
const router = express.Router();
const axios = require('axios');

const BOT_API_URL = process.env.BOT_API_URL || 'http://localhost:3002';
const BOT_API_KEY = process.env.BOT_API_KEY || 'neuroviabot-secret';

// Auth middleware
const requireAuth = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
    }
    next();
};

// GET /api/moderation/stats/:guildId
router.get('/stats/:guildId', requireAuth, async (req, res) => {
    try {
        const { guildId } = req.params;
        
        console.log(`[Moderation API] Fetching stats for guild ${guildId}`);
        
        try {
            const response = await axios.get(`${BOT_API_URL}/api/bot/moderation/${guildId}/stats`, {
                headers: { 'Authorization': `Bearer ${BOT_API_KEY}` },
                timeout: 10000,
            });
            
            res.json(response.data);
        } catch (botError) {
            // Return mock data if bot is offline
            console.log('[Moderation API] Bot API unavailable, returning mock data');
            res.json({
                success: true,
                stats: {
                    totalWarnings: 0,
                    totalBans: 0,
                    totalKicks: 0,
                    totalMutes: 0,
                    totalTempBans: 0,
                    recentCases: 0,
                    activeMutes: 0,
                    activeTempBans: 0
                }
            });
        }
    } catch (error) {
        console.error('[Moderation API] Error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch moderation stats' });
    }
});

// GET /api/moderation/cases/:guildId
router.get('/cases/:guildId', requireAuth, async (req, res) => {
    try {
        const { guildId } = req.params;
        const { limit = 20, offset = 0 } = req.query;
        
        console.log(`[Moderation API] Fetching cases for guild ${guildId} (limit: ${limit}, offset: ${offset})`);
        
        try {
            const response = await axios.get(`${BOT_API_URL}/api/bot/moderation/${guildId}/cases`, {
                headers: { 'Authorization': `Bearer ${BOT_API_KEY}` },
                params: { limit, offset },
                timeout: 10000,
            });
            
            res.json(response.data);
        } catch (botError) {
            // Return empty array if bot is offline
            console.log('[Moderation API] Bot API unavailable, returning empty cases');
            res.json({
                success: true,
                cases: [],
                total: 0
            });
        }
    } catch (error) {
        console.error('[Moderation API] Error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch moderation cases' });
    }
});

// GET /api/moderation/case/:guildId/:caseNumber
router.get('/case/:guildId/:caseNumber', requireAuth, async (req, res) => {
    try {
        const { guildId, caseNumber } = req.params;
        
        console.log(`[Moderation API] Fetching case #${caseNumber} for guild ${guildId}`);
        
        try {
            const response = await axios.get(`${BOT_API_URL}/api/bot/moderation/${guildId}/case/${caseNumber}`, {
                headers: { 'Authorization': `Bearer ${BOT_API_KEY}` },
                timeout: 10000,
            });
            
            res.json(response.data);
        } catch (botError) {
            console.log('[Moderation API] Bot API unavailable');
            res.status(404).json({
                success: false,
                error: 'Case not found'
            });
        }
    } catch (error) {
        console.error('[Moderation API] Error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch moderation case' });
    }
});

// GET /api/moderation/active/:guildId
router.get('/active/:guildId', requireAuth, async (req, res) => {
    try {
        const { guildId } = req.params;
        
        console.log(`[Moderation API] Fetching active actions for guild ${guildId}`);
        
        try {
            const response = await axios.get(`${BOT_API_URL}/api/bot/moderation/${guildId}/active`, {
                headers: { 'Authorization': `Bearer ${BOT_API_KEY}` },
                timeout: 10000,
            });
            
            res.json(response.data);
        } catch (botError) {
            // Return empty array if bot is offline
            console.log('[Moderation API] Bot API unavailable, returning empty actions');
            res.json({
                success: true,
                actions: []
            });
        }
    } catch (error) {
        console.error('[Moderation API] Error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch active moderation actions' });
    }
});

// GET /api/moderation/warnings/:guildId/:userId
router.get('/warnings/:guildId/:userId', requireAuth, async (req, res) => {
    try {
        const { guildId, userId } = req.params;
        
        console.log(`[Moderation API] Fetching warnings for user ${userId} in guild ${guildId}`);
        
        try {
            const response = await axios.get(`${BOT_API_URL}/api/bot/moderation/${guildId}/warnings/${userId}`, {
                headers: { 'Authorization': `Bearer ${BOT_API_KEY}` },
                timeout: 10000,
            });
            
            res.json(response.data);
        } catch (botError) {
            console.log('[Moderation API] Bot API unavailable');
            res.json({
                success: true,
                warnings: [],
                total: 0
            });
        }
    } catch (error) {
        console.error('[Moderation API] Error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch warnings' });
    }
});

// POST /api/moderation/settings/:guildId
router.post('/settings/:guildId', requireAuth, async (req, res) => {
    try {
        const { guildId } = req.params;
        const settings = req.body;
        
        console.log(`[Moderation API] Updating moderation settings for guild ${guildId}`);
        
        try {
            const response = await axios.post(`${BOT_API_URL}/api/bot/moderation/${guildId}/settings`, settings, {
                headers: { 
                    'Authorization': `Bearer ${BOT_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000,
            });
            
            res.json(response.data);
        } catch (botError) {
            console.log('[Moderation API] Bot API unavailable');
            res.status(503).json({
                success: false,
                error: 'Bot API unavailable'
            });
        }
    } catch (error) {
        console.error('[Moderation API] Error:', error);
        res.status(500).json({ success: false, error: 'Failed to update moderation settings' });
    }
});

module.exports = router;

