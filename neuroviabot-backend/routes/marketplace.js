// ==========================================
// 🛒 NeuroCoin Marketplace API
// ==========================================
// Global and server-specific marketplace for trading items with NRC

const express = require('express');
const router = express.Router();
const axios = require('axios');

const BOT_API_URL = process.env.BOT_API_URL || 'http://localhost:3002';
const BOT_API_KEY = process.env.BOT_API_KEY || 'your-secret-api-key';

// ==========================================
// GET /api/marketplace/global
// Get all global marketplace listings
// ==========================================
router.get('/global', async (req, res) => {
    try {
        const { type, rarity, minPrice, maxPrice, search, sort, page = 1, limit = 20 } = req.query;
        
        const response = await axios.get(`${BOT_API_URL}/api/bot/marketplace/global`, {
            headers: { 'x-api-key': BOT_API_KEY },
            params: { type, rarity, minPrice, maxPrice, search, sort, page, limit },
            timeout: 10000
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('[Marketplace] Error fetching global listings:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch global marketplace listings'
        });
    }
});

// ==========================================
// GET /api/marketplace/server/:guildId
// Get server-specific marketplace listings
// ==========================================
router.get('/server/:guildId', async (req, res) => {
    try {
        const { guildId } = req.params;
        const { type, rarity, minPrice, maxPrice, search, sort, page = 1, limit = 20 } = req.query;
        
        const response = await axios.get(`${BOT_API_URL}/api/bot/marketplace/server/${guildId}`, {
            headers: { 'x-api-key': BOT_API_KEY },
            params: { type, rarity, minPrice, maxPrice, search, sort, page, limit },
            timeout: 10000
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('[Marketplace] Error fetching server listings:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch server marketplace listings'
        });
    }
});

// ==========================================
// POST /api/marketplace/list
// Create a new marketplace listing
// ==========================================
router.post('/list', async (req, res) => {
    try {
        const { userId, item, price, guildId } = req.body;
        
        if (!userId || !item || !price) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: userId, item, price'
            });
        }
        
        const response = await axios.post(`${BOT_API_URL}/api/bot/marketplace/list`, {
            userId,
            item,
            price,
            guildId
        }, {
            headers: { 'x-api-key': BOT_API_KEY },
            timeout: 10000
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('[Marketplace] Error creating listing:', error.message);
        res.status(500).json({
            success: false,
            error: error.response?.data?.error || 'Failed to create marketplace listing'
        });
    }
});

// ==========================================
// POST /api/marketplace/purchase/:listingId
// Purchase a marketplace item
// ==========================================
router.post('/purchase/:listingId', async (req, res) => {
    try {
        const { listingId } = req.params;
        const { buyerId } = req.body;
        
        if (!buyerId) {
            return res.status(400).json({
                success: false,
                error: 'Missing required field: buyerId'
            });
        }
        
        const response = await axios.post(`${BOT_API_URL}/api/bot/marketplace/purchase/${listingId}`, {
            buyerId
        }, {
            headers: { 'x-api-key': BOT_API_KEY },
            timeout: 10000
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('[Marketplace] Error purchasing item:', error.message);
        res.status(500).json({
            success: false,
            error: error.response?.data?.error || 'Failed to purchase item'
        });
    }
});

// ==========================================
// DELETE /api/marketplace/listing/:listingId
// Cancel a marketplace listing
// ==========================================
router.delete('/listing/:listingId', async (req, res) => {
    try {
        const { listingId } = req.params;
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'Missing required field: userId'
            });
        }
        
        const response = await axios.delete(`${BOT_API_URL}/api/bot/marketplace/listing/${listingId}`, {
            headers: { 'x-api-key': BOT_API_KEY },
            data: { userId },
            timeout: 10000
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('[Marketplace] Error canceling listing:', error.message);
        res.status(500).json({
            success: false,
            error: error.response?.data?.error || 'Failed to cancel listing'
        });
    }
});

// ==========================================
// GET /api/marketplace/user/:userId
// Get user's marketplace listings
// ==========================================
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { status = 'active' } = req.query;
        
        const response = await axios.get(`${BOT_API_URL}/api/bot/marketplace/user/${userId}`, {
            headers: { 'x-api-key': BOT_API_KEY },
            params: { status },
            timeout: 10000
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('[Marketplace] Error fetching user listings:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user listings'
        });
    }
});

// ==========================================
// GET /api/marketplace/transactions/:userId
// Get user's transaction history
// ==========================================
router.get('/transactions/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { limit = 50 } = req.query;
        
        const response = await axios.get(`${BOT_API_URL}/api/bot/marketplace/transactions/${userId}`, {
            headers: { 'x-api-key': BOT_API_KEY },
            params: { limit },
            timeout: 10000
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('[Marketplace] Error fetching transactions:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch transaction history'
        });
    }
});

// ==========================================
// POST /api/marketplace/offer
// Make an offer on a listing (P2P trading)
// ==========================================
router.post('/offer', async (req, res) => {
    try {
        const { listingId, buyerId, offerAmount, message } = req.body;
        
        if (!listingId || !buyerId || !offerAmount) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: listingId, buyerId, offerAmount'
            });
        }
        
        const response = await axios.post(`${BOT_API_URL}/api/bot/marketplace/offer`, {
            listingId,
            buyerId,
            offerAmount,
            message
        }, {
            headers: { 'x-api-key': BOT_API_KEY },
            timeout: 10000
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('[Marketplace] Error making offer:', error.message);
        res.status(500).json({
            success: false,
            error: error.response?.data?.error || 'Failed to make offer'
        });
    }
});

// ==========================================
// GET /api/marketplace/config/:guildId
// Get server marketplace configuration
// ==========================================
router.get('/config/:guildId', async (req, res) => {
    try {
        const { guildId } = req.params;
        
        const response = await axios.get(`${BOT_API_URL}/api/bot/marketplace/config/${guildId}`, {
            headers: { 'x-api-key': BOT_API_KEY },
            timeout: 10000
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('[Marketplace] Error fetching config:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch marketplace config'
        });
    }
});

// ==========================================
// POST /api/marketplace/config/:guildId
// Update server marketplace configuration
// ==========================================
router.post('/config/:guildId', async (req, res) => {
    try {
        const { guildId } = req.params;
        const { config } = req.body;
        
        if (!config) {
            return res.status(400).json({
                success: false,
                error: 'Missing required field: config'
            });
        }
        
        const response = await axios.post(`${BOT_API_URL}/api/bot/marketplace/config/${guildId}`, {
            config
        }, {
            headers: { 'x-api-key': BOT_API_KEY },
            timeout: 10000
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('[Marketplace] Error updating config:', error.message);
        res.status(500).json({
            success: false,
            error: error.response?.data?.error || 'Failed to update marketplace config'
        });
    }
});

module.exports = router;

