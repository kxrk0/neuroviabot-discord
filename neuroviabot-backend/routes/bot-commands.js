// ==========================================
// 📋 Bot Commands Proxy Routes
// ==========================================
// Proxy bot commands API to frontend

const express = require('express');
const router = express.Router();
const axios = require('axios');

const BOT_API_URL = process.env.BOT_API_URL || 'http://localhost:3002';

// ==========================================
// GET /api/bot-commands/commands/list
// Get all commands with categories and stats
// ==========================================
router.get('/commands/list', async (req, res) => {
    try {
        const response = await axios.get(`${BOT_API_URL}/api/bot-commands/list`, {
            timeout: 10000
        });
        res.json(response.data);
    } catch (error) {
        console.error('[Bot Commands] Failed to fetch:', error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch commands from bot' 
        });
    }
});

module.exports = router;
