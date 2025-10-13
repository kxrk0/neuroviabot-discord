// ==========================================
// 🔐 Developer Authentication Middleware
// ==========================================
// Sadece belirtilen developer ID'lere erişim izni verir

const DEVELOPER_IDS = ['315875588906680330', '413081778031427584'];

/**
 * Developer authentication middleware
 * Checks if user is authorized developer
 */
function requireDeveloper(req, res, next) {
    try {
        // Session'dan user bilgisini al
        const userId = req.session?.user?.id || req.headers['x-user-id'];

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required',
                message: 'You must be logged in to access this resource'
            });
        }

        // Developer ID kontrolü
        if (!DEVELOPER_IDS.includes(userId)) {
            console.log(`[Dev Auth] Unauthorized access attempt by user ${userId}`);
            return res.status(403).json({
                success: false,
                error: 'Forbidden',
                message: 'You do not have developer access'
            });
        }

        console.log(`[Dev Auth] Developer access granted to ${userId}`);
        
        // Developer bilgisini request'e ekle
        req.developer = {
            id: userId,
            username: req.session?.user?.username || 'Unknown'
        };

        next();
    } catch (error) {
        console.error('[Dev Auth] Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}

/**
 * Check if user is developer (without blocking)
 */
function isDeveloper(userId) {
    return DEVELOPER_IDS.includes(userId);
}

/**
 * Get developer IDs
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
