const { getDatabase } = require('../database/simple-db');
const { logger } = require('./logger');

class AuditLogger {
    constructor() {
        this.db = getDatabase();
    }

    /**
     * Log an audit event
     * @param {Object} options - Audit log options
     * @param {string} options.guildId - Guild ID
     * @param {string} options.action - Action type (e.g., 'ROLE_CREATE', 'CHANNEL_DELETE')
     * @param {Object} options.executor - User who performed the action
     * @param {Object} options.target - Target of the action
     * @param {Object} options.changes - Changes made
     * @param {string} options.reason - Reason for the action
     */
    log(options) {
        try {
            const { guildId, action, executor, target, changes, reason } = options;

            if (!guildId || !action) {
                logger.warn('[AuditLogger] Missing required fields: guildId or action');
                return null;
            }

            const auditEntry = {
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                guildId,
                action,
                executor: executor ? {
                    id: executor.id || executor,
                    username: executor.username || 'Unknown',
                    avatar: executor.avatar || null,
                } : null,
                target: target ? {
                    id: target.id || target,
                    name: target.name || target.username || 'Unknown',
                    type: target.type || 'unknown',
                } : null,
                changes: changes || {},
                reason: reason || null,
                timestamp: new Date().toISOString(),
            };

            // Save to database
            const settings = this.db.getGuildSettings(guildId) || {};
            if (!settings.auditLogs) {
                settings.auditLogs = [];
            }

            settings.auditLogs.unshift(auditEntry); // Add to beginning

            // Keep only last 1000 entries per guild
            if (settings.auditLogs.length > 1000) {
                settings.auditLogs = settings.auditLogs.slice(0, 1000);
            }

            this.db.setGuildSettings(guildId, settings);

            logger.debug(`[AuditLogger] Logged action: ${action} in guild ${guildId}`);
            return auditEntry;
        } catch (error) {
            logger.error('[AuditLogger] Error logging audit:', error);
            return null;
        }
    }

    /**
     * Get audit logs for a guild
     * @param {string} guildId - Guild ID
     * @param {Object} filters - Filter options
     * @returns {Array} Audit log entries
     */
    getLogs(guildId, filters = {}) {
        try {
            const settings = this.db.getGuildSettings(guildId) || {};
            let logs = settings.auditLogs || [];

            // Apply filters
            if (filters.action) {
                logs = logs.filter(log => log.action === filters.action);
            }

            if (filters.userId) {
                logs = logs.filter(log => 
                    log.executor?.id === filters.userId || 
                    log.target?.id === filters.userId
                );
            }

            if (filters.startDate) {
                const startDate = new Date(filters.startDate);
                logs = logs.filter(log => new Date(log.timestamp) >= startDate);
            }

            if (filters.endDate) {
                const endDate = new Date(filters.endDate);
                logs = logs.filter(log => new Date(log.timestamp) <= endDate);
            }

            // Pagination
            const page = parseInt(filters.page) || 1;
            const limit = parseInt(filters.limit) || 25;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;

            const paginatedLogs = logs.slice(startIndex, endIndex);

            return {
                logs: paginatedLogs,
                total: logs.length,
                page,
                totalPages: Math.ceil(logs.length / limit),
            };
        } catch (error) {
            logger.error('[AuditLogger] Error getting logs:', error);
            return { logs: [], total: 0, page: 1, totalPages: 0 };
        }
    }

    /**
     * Clear old audit logs (older than specified days)
     * @param {string} guildId - Guild ID
     * @param {number} days - Days to keep
     */
    clearOldLogs(guildId, days = 90) {
        try {
            const settings = this.db.getGuildSettings(guildId) || {};
            if (!settings.auditLogs) return;

            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);

            settings.auditLogs = settings.auditLogs.filter(log => 
                new Date(log.timestamp) >= cutoffDate
            );

            this.db.setGuildSettings(guildId, settings);
            logger.info(`[AuditLogger] Cleared old logs for guild ${guildId}`);
        } catch (error) {
            logger.error('[AuditLogger] Error clearing old logs:', error);
        }
    }
}

// Singleton instance
let auditLoggerInstance = null;

function getAuditLogger() {
    if (!auditLoggerInstance) {
        auditLoggerInstance = new AuditLogger();
    }
    return auditLoggerInstance;
}

module.exports = { getAuditLogger, AuditLogger };
