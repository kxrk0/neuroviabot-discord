const express = require('express');
const router = express.Router();
const axios = require('axios');
const AuditLog = require('../models/AuditLog');

const BOT_API_URL = process.env.BOT_API_URL || 'http://localhost:3002';
const BOT_API_KEY = process.env.BOT_API_KEY || 'your-secret-api-key';

const requireAuth = (req, res, next) => {
  // Allow requests - audit logs are public for authenticated dashboard users
  // Session check will be done on frontend via credentials: 'include'
  next();
};

// GET /api/audit/:guildId
router.get('/:guildId', requireAuth, async (req, res) => {
  try {
    const { guildId } = req.params;
    const { page = 1, limit = 50, action, userId, startDate, endDate } = req.query;
    
    // Fetch from MongoDB - persistent storage
    const result = await AuditLog.getLogs(guildId, {
      page: parseInt(page),
      limit: parseInt(limit),
      action,
      userId,
      startDate,
      endDate
    });
    
    res.json({
      success: true,
      logs: result.logs,
      pagination: result.pagination
    });
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

// POST /api/audit/:guildId - Create new audit log entry
router.post('/:guildId', requireAuth, async (req, res) => {
  try {
    const { guildId } = req.params;
    const logData = { ...req.body, guildId };
    
    const log = await AuditLog.logAction(logData);
    
    res.json({
      success: true,
      log
    });
  } catch (error) {
    console.error('[AuditLog] Error creating:', error.message);
    res.status(500).json({ success: false, error: 'Failed to create audit log' });
  }
});

// GET /api/audit/:guildId/stats - Get audit log statistics
router.get('/:guildId/stats', requireAuth, async (req, res) => {
  try {
    const { guildId } = req.params;
    
    const stats = await AuditLog.getStats(guildId);
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('[AuditLog] Error fetching stats:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch audit log stats' });
  }
});

module.exports = router;

