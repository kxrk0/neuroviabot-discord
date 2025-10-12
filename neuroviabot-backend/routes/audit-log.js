const express = require('express');
const router = express.Router();
const axios = require('axios');

const BOT_API_URL = process.env.BOT_API_URL || 'http://localhost:3002';
const BOT_API_KEY = process.env.BOT_API_KEY || 'your-secret-api-key';

const requireAuth = (req, res, next) => {
  // Check session or allow if coming from same origin
  if (!req.session || !req.session.user) {
    console.log('[AuditLog] No session found, returning empty logs');
    // Return empty logs instead of 401 for better UX
    return res.json({ success: true, logs: [], total: 0, page: 1, totalPages: 0 });
  }
  next();
};

// GET /api/audit/:guildId
router.get('/:guildId', requireAuth, async (req, res) => {
  try {
    const { guildId } = req.params;
    const { page = 1, limit = 50, type, userId, startDate, endDate } = req.query;
    
    const response = await axios.get(`${BOT_API_URL}/api/bot/audit/${guildId}`, {
      headers: { 'x-api-key': BOT_API_KEY },
      params: { page, limit, type, userId, startDate, endDate },
      timeout: 10000
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('[AuditLog] Error fetching:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch audit logs' });
  }
});

// GET /api/audit/:guildId/export
router.get('/:guildId/export', requireAuth, async (req, res) => {
  try {
    const { guildId } = req.params;
    const { format = 'json' } = req.query;
    
    const response = await axios.get(`${BOT_API_URL}/api/bot/audit/${guildId}/export`, {
      headers: { 'x-api-key': BOT_API_KEY },
      params: { format },
      timeout: 30000
    });
    
    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="audit-log-${guildId}.csv"`);
    }
    
    res.send(response.data);
  } catch (error) {
    console.error('[AuditLog] Error exporting:', error.message);
    res.status(500).json({ success: false, error: 'Failed to export audit logs' });
  }
});

module.exports = router;

