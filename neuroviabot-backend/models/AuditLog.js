const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'guild.settings.update',
      'guild.feature.toggle',
      'moderation.ban',
      'moderation.unban',
      'moderation.kick',
      'moderation.mute',
      'moderation.unmute',
      'moderation.warn',
      'role.create',
      'role.delete',
      'role.update',
      'channel.create',
      'channel.delete',
      'channel.update',
      'member.join',
      'member.leave',
      'message.delete',
      'message.bulk_delete',
      'nrc.transfer',
      'nrc.purchase',
      'marketplace.listing',
      'ticket.create',
      'ticket.close',
      'reaction_role.add',
      'reaction_role.remove',
      'automod.action',
      'command.execute',
      'other'
    ]
  },
  executor: {
    id: String,
    username: String,
    discriminator: String,
    bot: { type: Boolean, default: false }
  },
  target: {
    id: String,
    username: String,
    type: {
      type: String,
      enum: ['user', 'channel', 'role', 'message', 'guild', 'other']
    }
  },
  changes: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  reason: String,
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
auditLogSchema.index({ guildId: 1, timestamp: -1 });
auditLogSchema.index({ guildId: 1, action: 1, timestamp: -1 });
auditLogSchema.index({ 'executor.id': 1, timestamp: -1 });
auditLogSchema.index({ timestamp: -1 }); // For cleanup queries

// Static method to log an action
auditLogSchema.statics.logAction = async function(logData) {
  try {
    const log = new this(logData);
    await log.save();
    return log;
  } catch (error) {
    console.error('[AuditLog] Failed to save:', error);
    throw error;
  }
};

// Static method to get logs with pagination
auditLogSchema.statics.getLogs = async function(guildId, options = {}) {
  const {
    page = 1,
    limit = 50,
    action,
    userId,
    startDate,
    endDate
  } = options;

  const query = { guildId };

  if (action) query.action = action;
  if (userId) query['executor.id'] = userId;
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    this.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    this.countDocuments(query)
  ]);

  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

// Static method to cleanup old logs (optional, for data retention)
auditLogSchema.statics.cleanupOldLogs = async function(daysToKeep = 90) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const result = await this.deleteMany({
    timestamp: { $lt: cutoffDate }
  });

  console.log(`[AuditLog] Cleaned up ${result.deletedCount} old logs`);
  return result.deletedCount;
};

// Export stats for a guild
auditLogSchema.statics.getStats = async function(guildId) {
  const stats = await this.aggregate([
    { $match: { guildId } },
    {
      $group: {
        _id: '$action',
        count: { $sum: 1 }
      }
    }
  ]);

  const total = await this.countDocuments({ guildId });

  return {
    total,
    byAction: stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {})
  };
};

module.exports = mongoose.model('AuditLog', auditLogSchema);
