// ==========================================
// 📋 Bot Commands API
// ==========================================
// Expose command list and stats to frontend

const express = require('express');
const router = express.Router();

let botClient = null;

function setClient(client) {
    botClient = client;
}

// ==========================================
// GET /api/bot-commands/list
// Get all commands with categories and stats
// ==========================================
router.get('/api/bot-commands/list', (req, res) => {
    if (!botClient) {
        return res.status(503).json({ 
            success: false, 
            error: 'Bot not ready' 
        });
    }

    const commands = [];
    botClient.commands.forEach(cmd => {
        commands.push({
            name: cmd.data.name,
            description: cmd.data.description,
            category: cmd.category || 'general',
            options: cmd.data.options?.length || 0,
            usageCount: cmd.usageCount || 0,
            permissions: cmd.data.default_member_permissions,
            dmPermission: cmd.data.dm_permission
        });
    });

    // Group by category
    const grouped = commands.reduce((acc, cmd) => {
        if (!acc[cmd.category]) {
            acc[cmd.category] = [];
        }
        acc[cmd.category].push(cmd);
        return acc;
    }, {});

    res.json({ 
        success: true, 
        commands,
        grouped,
        total: commands.length 
    });
});

module.exports = { router, setClient };

