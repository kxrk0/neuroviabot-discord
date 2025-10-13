// ==========================================
// 🛡️ Rate Limiter Middleware
// ==========================================
// Protect API endpoints from abuse

const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for developer endpoints
 * 10 requests per minute per IP
 */
const developerLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10,
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip rate limiting for local development
        if (process.env.NODE_ENV === 'development') {
            return req.ip === '::1' || req.ip === '127.0.0.1';
        }
        return false;
    }
});

/**
 * Rate limiter for database operations
 * 5 requests per minute (more restrictive)
 */
const databaseLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5,
    message: {
        success: false,
        error: 'Too many database requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

/**
 * Rate limiter for system control operations
 * 3 requests per minute (most restrictive)
 */
const systemControlLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 3,
    message: {
        success: false,
        error: 'Too many system control requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = {
    developerLimiter,
    databaseLimiter,
    systemControlLimiter
};

