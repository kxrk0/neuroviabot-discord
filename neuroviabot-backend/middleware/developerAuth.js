// ==========================================
// 🔐 Developer Authentication Middleware
// ==========================================
// Restrict access to developer-only endpoints

const DEVELOPER_IDS = ['315875588906680330', '413081778031427584'];

/**
 * Middleware to verify developer access
 * Checks user ID from session or header against whitelist
 */
function requireDeveloper(req, res, next) {
    const userId = req.session?.user?.id || req.headers['x-user-id'];
    
    if (!userId) {
        return res.status(401).json({ 
            success: false, 
            error: 'Authentication required' 
        });
    }
    
    if (!DEVELOPER_IDS.includes(userId)) {
        console.log(`[Dev Auth] Unauthorized access attempt by user: ${userId}`);
        return res.status(403).json({ 
            success: false, 
            error: 'Developer access required. Only authorized developers can access this resource.' 
        });
    }
    
    console.log(`[Dev Auth] Developer ${userId} authenticated`);
    next();
}

/**
 * Check if user ID is a developer (for frontend)
 */
function isDeveloper(userId) {
    return DEVELOPER_IDS.includes(userId);
}

/**
 * Get list of developer IDs (admin only)
 */
function getDeveloperIds() {
    return [...DEVELOPER_IDS];
}

module.exports = {
    requireDeveloper,
    isDeveloper,
    getDeveloperIds,
    DEVELOPER_IDS
};

