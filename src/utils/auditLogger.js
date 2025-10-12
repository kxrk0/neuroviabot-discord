const { getDatabase } = require('../database/simple-db');
const { logger } = require('./logger');

// Audit log types
const AuditLogType = {
  MEMBER_JOIN: 'MEMBER_JOIN',
  MEMBER_LEAVE: 'MEMBER_LEAVE',
  MEMBER_BAN: 'MEMBER_BAN',
  MEMBER_KICK: 'MEMBER_KICK',
  MEMBER_TIMEOUT: 'MEMBER_TIMEOUT',
  ROLE_CREATE: 'ROLE_CREATE',
  ROLE_UPDATE: 'ROLE_UPDATE',
  ROLE_DELETE: 'ROLE_DELETE',
  CHANNEL_CREATE: 'CHANNEL_CREATE',
  CHANNEL_UPDATE: 'CHANNEL_UPDATE',
  CHANNEL_DELETE: 'CHANNEL_DELETE',
  MESSAGE_DELETE: 'MESSAGE_DELETE',
  MESSAGE_BULK_DELETE: 'MESSAGE_BULK_DELETE',
  SETTINGS_CHANGE: 'SETTINGS_CHANGE',
  COMMAND_USE: 'COMMAND_USE',
  WARNING_ADD: 'WARNING_ADD',
  WARNING_REMOVE: 'WARNING_REMOVE',
};

// Severity levels
const Severity = {
  INFO: 'info',
  WARNING: 'warning',
  DANGER: 'danger',
};

class AuditLogger {
  constructor() {
    this.db = getDatabase();
  }

  /**
   * Log an audit event
   * @param {string} guildId - Guild ID
   * @param {string} type - Audit log type
   * @param {string} userId - User who performed the action
   * @param {string} targetId - Target of the action (user, role, channel, etc.)
   * @param {string} action - Description of the action
   * @param {object} details - Additional details
   * @param {string} severity - Severity level
   */
  log(guildId, type, userId, targetId, action, details = {}, severity = Severity.INFO) {
    try {
      const entry = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        guildId,
        type,
        userId,
        targetId,
        action,
        details,
        severity,
        timestamp: new Date().toISOString(),
      };

      this.db.addAuditLog(guildId, entry);
      
      logger.info(`[Audit] ${guildId} - ${type}: ${action}`);
    } catch (error) {
      logger.error('Audit logging error:', error);
    }
  }

  // Convenience methods
  logMemberJoin(guildId, userId) {
    this.log(guildId, AuditLogType.MEMBER_JOIN, userId, userId, 'Member joined the server', {}, Severity.INFO);
  }

  logMemberLeave(guildId, userId) {
    this.log(guildId, AuditLogType.MEMBER_LEAVE, userId, userId, 'Member left the server', {}, Severity.INFO);
  }

  logMemberBan(guildId, moderatorId, targetId, reason) {
    this.log(
      guildId,
      AuditLogType.MEMBER_BAN,
      moderatorId,
      targetId,
      `Member banned: ${reason || 'No reason provided'}`,
      { reason },
      Severity.DANGER
    );
  }

  logMemberKick(guildId, moderatorId, targetId, reason) {
    this.log(
      guildId,
      AuditLogType.MEMBER_KICK,
      moderatorId,
      targetId,
      `Member kicked: ${reason || 'No reason provided'}`,
      { reason },
      Severity.WARNING
    );
  }

  logMemberTimeout(guildId, moderatorId, targetId, duration, reason) {
    this.log(
      guildId,
      AuditLogType.MEMBER_TIMEOUT,
      moderatorId,
      targetId,
      `Member timed out for ${duration}`,
      { duration, reason },
      Severity.WARNING
    );
  }

  logRoleCreate(guildId, userId, roleId, roleName) {
    this.log(guildId, AuditLogType.ROLE_CREATE, userId, roleId, `Role created: ${roleName}`, { roleName }, Severity.INFO);
  }

  logRoleUpdate(guildId, userId, roleId, changes) {
    this.log(guildId, AuditLogType.ROLE_UPDATE, userId, roleId, 'Role updated', { changes }, Severity.INFO);
  }

  logRoleDelete(guildId, userId, roleId, roleName) {
    this.log(guildId, AuditLogType.ROLE_DELETE, userId, roleId, `Role deleted: ${roleName}`, { roleName }, Severity.WARNING);
  }

  logChannelCreate(guildId, userId, channelId, channelName) {
    this.log(guildId, AuditLogType.CHANNEL_CREATE, userId, channelId, `Channel created: ${channelName}`, { channelName }, Severity.INFO);
  }

  logChannelUpdate(guildId, userId, channelId, changes) {
    this.log(guildId, AuditLogType.CHANNEL_UPDATE, userId, channelId, 'Channel updated', { changes }, Severity.INFO);
  }

  logChannelDelete(guildId, userId, channelId, channelName) {
    this.log(guildId, AuditLogType.CHANNEL_DELETE, userId, channelId, `Channel deleted: ${channelName}`, { channelName }, Severity.WARNING);
  }

  logMessageDelete(guildId, userId, messageId, channelId) {
    this.log(guildId, AuditLogType.MESSAGE_DELETE, userId, messageId, 'Message deleted', { channelId }, Severity.INFO);
  }

  logSettingsChange(guildId, userId, setting, oldValue, newValue) {
    this.log(
      guildId,
      AuditLogType.SETTINGS_CHANGE,
      userId,
      setting,
      `Settings changed: ${setting}`,
      { setting, oldValue, newValue },
      Severity.INFO
    );
  }

  logCommandUse(guildId, userId, commandName, success) {
    this.log(
      guildId,
      AuditLogType.COMMAND_USE,
      userId,
      commandName,
      `Command used: /${commandName}`,
      { commandName, success },
      Severity.INFO
    );
  }

  /**
   * Get audit logs for a guild
   * @param {string} guildId
   * @param {object} filters
   * @returns {Array}
   */
  getLogs(guildId, filters = {}) {
    return this.db.getAuditLogs(guildId, filters);
  }

  /**
   * Clean up old logs (older than 90 days)
   */
  cleanupOldLogs() {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 90);
      
      this.db.cleanupOldAuditLogs(cutoffDate);
      logger.info('[Audit] Cleaned up old audit logs');
    } catch (error) {
      logger.error('Audit cleanup error:', error);
    }
  }
}

// Singleton instance
let auditLogger = null;

function getAuditLogger() {
  if (!auditLogger) {
    auditLogger = new AuditLogger();
  }
  return auditLogger;
}

module.exports = { getAuditLogger, AuditLogType, Severity };

