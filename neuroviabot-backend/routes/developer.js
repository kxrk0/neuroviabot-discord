// ==========================================
// 🔧 Developer API Routes (Backend)
// ==========================================
// Developer panel endpoints with access control

const express = require('express');
const router = express.Router();
const axios = require('axios');
const { requireDeveloper } = require('../middleware/developerAuth');
const { developerLimiter, databaseLimiter, systemControlLimiter } = require('../middleware/rateLimiter');
const { auditLoggerMiddleware } = require('../middleware/auditLogger');

const BOT_API_URL = process.env.BOT_API_URL || 'http://localhost:3002';
const BOT_API_KEY = process.env.BOT_API_KEY || 'your-secret-api-key';

// Apply developer authentication to all routes
router.use(requireDeveloper);

// Apply audit logging to all routes
router.use(auditLoggerMiddleware);

// Apply rate limiting to all routes (base limit)
router.use(developerLimiter);

// ==========================================
// GET /api/dev/bot-stats
// Get bot statistics
// ==========================================
router.get('/bot-stats', async (req, res) => {
    try {
        const response = await axios.get(`${BOT_API_URL}/api/dev-bot/stats`, {
            headers: { 'x-api-key': BOT_API_KEY },
            timeout: 10000
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('[Dev API] Bot stats error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch bot stats'
        });
    }
});

// ==========================================
// GET /api/dev/guilds
// Get all guilds
// ==========================================
router.get('/guilds', async (req, res) => {
    try {
        const response = await axios.get(`${BOT_API_URL}/api/dev-bot/guilds`, {
            headers: { 'x-api-key': BOT_API_KEY },
            timeout: 10000
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('[Dev API] Guilds error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch guilds'
        });
    }
});

// ==========================================
// GET /api/dev/commands
// Get all commands
// ==========================================
router.get('/commands', async (req, res) => {
    try {
        const response = await axios.get(`${BOT_API_URL}/api/dev-bot/commands`, {
            headers: { 'x-api-key': BOT_API_KEY },
            timeout: 10000
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('[Dev API] Commands error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch commands'
        });
    }
});

// ==========================================
// POST /api/dev/commands/:name/toggle
// Toggle command enabled/disabled
// ==========================================
router.post('/commands/:name/toggle', async (req, res) => {
    try {
        const { name } = req.params;
        const { enabled } = req.body;

        const response = await axios.post(
            `${BOT_API_URL}/api/dev-bot/commands/${name}/toggle`,
            { enabled },
            {
                headers: { 'x-api-key': BOT_API_KEY },
                timeout: 10000
            }
        );
        
        res.json(response.data);
    } catch (error) {
        console.error('[Dev API] Command toggle error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to toggle command'
        });
    }
});

// ==========================================
// GET /api/dev/database/schema
// Get database schema
// ==========================================
router.get('/database/schema', databaseLimiter, async (req, res) => {
    try {
        const response = await axios.get(`${BOT_API_URL}/api/dev-bot/database/schema`, {
            headers: { 'x-api-key': BOT_API_KEY },
            timeout: 10000
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('[Dev API] Schema error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch schema'
        });
    }
});

// ==========================================
// POST /api/dev/database/query
// Execute database query (read-only)
// ==========================================
router.post('/database/query', databaseLimiter, async (req, res) => {
    try {
        const { query } = req.body;

        // Validate query is read-only
        const lowerQuery = query.toLowerCase().trim();
        if (!lowerQuery.startsWith('select') && !lowerQuery.startsWith('show')) {
            return res.status(400).json({
                success: false,
                error: 'Only SELECT and SHOW queries are allowed'
            });
        }

        // For simple-db (Map-based), we'll return schema info
        const response = await axios.get(`${BOT_API_URL}/api/dev-bot/database/schema`, {
            headers: { 'x-api-key': BOT_API_KEY },
            timeout: 10000
        });

        res.json({
            success: true,
            message: 'Query executed (schema returned for Map-based DB)',
            results: response.data.schema
        });
    } catch (error) {
        console.error('[Dev API] Query error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to execute query'
        });
    }
});

// ==========================================
// POST /api/dev/database/backup
// Create database backup
// ==========================================
router.post('/database/backup', databaseLimiter, async (req, res) => {
    try {
        const response = await axios.post(
            `${BOT_API_URL}/api/dev-bot/database/backup`,
            {},
            {
                headers: { 'x-api-key': BOT_API_KEY },
                timeout: 30000
            }
        );
        
        res.json(response.data);
    } catch (error) {
        console.error('[Dev API] Backup error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to create backup'
        });
    }
});

// ==========================================
// POST /api/dev/system/restart
// Restart bot
// ==========================================
router.post('/system/restart', systemControlLimiter, async (req, res) => {
    try {
        const response = await axios.post(
            `${BOT_API_URL}/api/dev-bot/system/restart`,
            {},
            {
                headers: { 'x-api-key': BOT_API_KEY },
                timeout: 5000
            }
        );
        
        res.json(response.data);
    } catch (error) {
        // Bot might restart before responding, so timeout is expected
        if (error.code === 'ECONNABORTED' || error.code === 'ECONNRESET') {
            res.json({
                success: true,
                message: 'Bot restart initiated'
            });
        } else {
            console.error('[Dev API] Restart error:', error.message);
            res.status(500).json({
                success: false,
                error: 'Failed to restart bot'
            });
        }
    }
});

// ==========================================
// POST /api/dev/system/clear-cache
// Clear all caches
// ==========================================
router.post('/system/clear-cache', systemControlLimiter, async (req, res) => {
    try {
        const response = await axios.post(
            `${BOT_API_URL}/api/dev-bot/system/clear-cache`,
            {},
            {
                headers: { 'x-api-key': BOT_API_KEY },
                timeout: 10000
            }
        );
        
        res.json(response.data);
    } catch (error) {
        console.error('[Dev API] Clear cache error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to clear cache'
        });
    }
});

// ==========================================
// POST /api/dev/system/sync-commands
// Force sync slash commands
// ==========================================
router.post('/system/sync-commands', systemControlLimiter, async (req, res) => {
    try {
        const response = await axios.post(
            `${BOT_API_URL}/api/dev-bot/system/sync-commands`,
            {},
            {
                headers: { 'x-api-key': BOT_API_KEY },
                timeout: 30000
            }
        );
        
        res.json(response.data);
    } catch (error) {
        console.error('[Dev API] Sync commands error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to sync commands'
        });
    }
});

// ==========================================
// GET /api/dev/logs
// Get recent logs
// ==========================================
router.get('/logs', async (req, res) => {
    try {
        const { limit = 100 } = req.query;

        const response = await axios.get(`${BOT_API_URL}/api/dev-bot/logs`, {
            headers: { 'x-api-key': BOT_API_KEY },
            params: { limit },
            timeout: 10000
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('[Dev API] Logs error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch logs'
        });
    }
});

// ==========================================
// GET /api/dev/check-access
// Check if current user has developer access
// ==========================================
router.get('/check-access', (req, res) => {
    // If middleware passed, user has access
    res.json({
        success: true,
        hasDeveloperAccess: true,
        userId: req.session?.user?.id || req.headers['x-user-id']
    });
});

// ==========================================
// GET /api/dev/audit-logs
// Get audit logs
// ==========================================
router.get('/audit-logs', (req, res) => {
    try {
        const { getAuditLogs } = require('../middleware/auditLogger');
        const { limit = 100 } = req.query;
        
        const logs = getAuditLogs(parseInt(limit));
        
        res.json({
            success: true,
            logs,
            total: logs.length
        });
    } catch (error) {
        console.error('[Dev API] Audit logs error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch audit logs'
        });
    }
});

module.exports = router;

