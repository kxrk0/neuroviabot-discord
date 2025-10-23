// ==========================================
// 📋 Audit Log API Routes
// ==========================================

const express = require('express');
const router = express.Router();
const { getDatabase } = require('../database/simple-db');

// Get audit logs for a guild
router.get('/:guildId', async (req, res) => {
    try {
        const { guildId } = req.params;
        const { page = 1, limit = 50, type, userId, startDate, endDate } = req.query;
        
        const db = getDatabase();
        
        const filters = {};
        if (type) filters.type = type;
        if (userId) filters.userId = userId;
        if (startDate) filters.startDate = startDate;
        if (endDate) filters.endDate = endDate;
        
        filters.page = parseInt(page);
        filters.limit = parseInt(limit);
        
        const result = db.getAuditLogs(guildId, filters);
        
        res.json({
            success: true,
            logs: result.logs,
            total: result.total,
            page: result.page,
            totalPages: result.totalPages,
            limit: result.limit
        });
        
    } catch (error) {
        console.error('Audit logs getirme hatası:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Export audit logs
router.get('/:guildId/export', async (req, res) => {
    try {
        const { guildId } = req.params;
        const { format = 'json' } = req.query;
        
        const db = getDatabase();
        const result = db.getAuditLogs(guildId, { limit: 10000 });
        
        if (format === 'csv') {
            // Convert to CSV
            let csv = 'ID,Action,Type,User ID,Target ID,Timestamp,Details\n';
            
            result.logs.forEach(log => {
                const details = JSON.stringify(log.details).replace(/"/g, '""');
                csv += `"${log.id}","${log.action}","${log.type}","${log.userId}","${log.targetId || ''}","${log.timestamp}","${details}"\n`;
            });
            
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="audit-log-${guildId}.csv"`);
            res.send(csv);
        } else {
            // JSON format
            res.json({
                success: true,
                logs: result.logs,
                exported: new Date().toISOString()
            });
        }
        
    } catch (error) {
        console.error('Audit logs export hatası:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Clear old audit logs (older than X days)
router.delete('/:guildId/cleanup', async (req, res) => {
    try {
        const { guildId } = req.params;
        const { days = 90 } = req.query;
        
        const db = getDatabase();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));
        
        db.cleanupOldAuditLogs(cutoffDate);
        
        res.json({
            success: true,
            message: `Audit logs older than ${days} days cleaned up`
        });
        
    } catch (error) {
        console.error('Audit logs cleanup hatası:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;

