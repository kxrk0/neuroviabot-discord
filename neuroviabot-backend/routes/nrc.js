// ==========================================
// 💎 NRC API Routes
// ==========================================
// API endpoints for NRC system

const express = require('express');
const router = express.Router();

// Import database (will be injected via main index.js)
let db = null;

// Initialize database reference
function initDB(database) {
    db = database;
}

// Middleware to check if DB is initialized
function checkDB(req, res, next) {
    if (!db) {
        return res.status(500).json({ error: 'Database not initialized' });
    }
    next();
}

// ==========================================
// NFT Collection Routes
// ==========================================

/**
 * GET /api/nrc/collections
 * Get all NFT collections
 */
router.get('/collections', checkDB, (req, res) => {
    try {
        const collections = [];
        
        for (const [collectionId, collection] of db.data.nftCollections.entries()) {
            collections.push({
                id: collectionId,
                ...collection
            });
        }

        res.json({
            success: true,
            collections
        });
    } catch (error) {
        console.error('[NRC API] Error fetching collections:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch collections' 
        });
    }
});

/**
 * GET /api/nrc/collections/:userId
 * Get user's NFT collection
 */
router.get('/collections/:userId', checkDB, (req, res) => {
    try {
        const { userId } = req.params;
        const userCollection = db.data.userCollections.get(userId) || {
            ownedItems: [],
            favoriteItem: null,
            totalValue: 0
        };

        res.json({
            success: true,
            collection: userCollection
        });
    } catch (error) {
        console.error('[NRC API] Error fetching user collection:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch user collection' 
        });
    }
});

/**
 * POST /api/nrc/collections/purchase
 * Purchase an NFT
 */
router.post('/collections/purchase', checkDB, (req, res) => {
    try {
        const { userId, collectionId, itemId } = req.body;

        if (!userId || !collectionId || !itemId) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: userId, collectionId, itemId'
            });
        }

        // Get collection
        const collection = db.data.nftCollections.get(collectionId);
        if (!collection) {
            return res.status(404).json({
                success: false,
                error: 'Collection not found'
            });
        }

        // Get item
        const item = collection.items.find(i => i.id === itemId);
        if (!item) {
            return res.status(404).json({
                success: false,
                error: 'Item not found in collection'
            });
        }

        // Check balance
        const balance = db.getNeuroCoinBalance(userId);
        if (balance.wallet < item.price) {
            return res.status(400).json({
                success: false,
                error: 'Insufficient NRC balance'
            });
        }

        // Deduct NRC
        db.addNeuroCoin(userId, -item.price, 'nft_purchase', {
            collectionId,
            itemId,
            price: item.price
        });

        // Add to user collection
        let userCollection = db.data.userCollections.get(userId) || {
            ownedItems: [],
            favoriteItem: null,
            totalValue: 0
        };

        userCollection.ownedItems.push({
            collectionId,
            itemId,
            acquiredAt: new Date().toISOString()
        });

        userCollection.totalValue += item.price;

        db.data.userCollections.set(userId, userCollection);
        db.saveData();

        res.json({
            success: true,
            item,
            newBalance: db.getNeuroCoinBalance(userId)
        });

    } catch (error) {
        console.error('[NRC API] Error purchasing NFT:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to purchase NFT' 
        });
    }
});

// ==========================================
// Marketplace Routes
// ==========================================

/**
 * GET /api/nrc/marketplace/listings
 * Get all active marketplace listings
 */
router.get('/marketplace/listings', checkDB, (req, res) => {
    try {
        const { type, minPrice, maxPrice, limit = 50 } = req.query;
        
        const listings = [];
        
        for (const [listingId, listing] of db.data.nftListings.entries()) {
            if (listing.status !== 'active') continue;
            
            // Apply filters
            if (type && listing.itemType !== type) continue;
            if (minPrice && listing.price < parseInt(minPrice)) continue;
            if (maxPrice && listing.price > parseInt(maxPrice)) continue;
            
            listings.push({
                id: listingId,
                ...listing
            });
        }

        // Sort by newest first
        listings.sort((a, b) => new Date(b.listedAt) - new Date(a.listedAt));

        // Limit results
        const limitedListings = listings.slice(0, parseInt(limit));

        res.json({
            success: true,
            listings: limitedListings,
            total: listings.length
        });
    } catch (error) {
        console.error('[NRC API] Error fetching marketplace listings:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch listings' 
        });
    }
});

/**
 * POST /api/nrc/marketplace/create
 * Create a marketplace listing
 */
router.post('/marketplace/create', checkDB, (req, res) => {
    try {
        const { userId, itemType, itemId, price } = req.body;

        if (!userId || !itemType || !itemId || !price) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Validate price
        if (price < 1) {
            return res.status(400).json({
                success: false,
                error: 'Price must be at least 1 NRC'
            });
        }

        // Create listing
        const listingId = `listing_${Date.now()}_${userId}`;
        const listing = {
            sellerId: userId,
            itemType,
            itemId,
            price,
            listedAt: new Date().toISOString(),
            status: 'active'
        };

        db.data.nftListings.set(listingId, listing);
        db.saveData();

        res.json({
            success: true,
            listingId,
            listing
        });

    } catch (error) {
        console.error('[NRC API] Error creating marketplace listing:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to create listing' 
        });
    }
});

/**
 * POST /api/nrc/marketplace/purchase/:listingId
 * Purchase a marketplace listing
 */
router.post('/marketplace/purchase/:listingId', checkDB, (req, res) => {
    try {
        const { listingId } = req.params;
        const { buyerId } = req.body;

        if (!buyerId) {
            return res.status(400).json({
                success: false,
                error: 'Missing buyerId'
            });
        }

        // Get listing
        const listing = db.data.nftListings.get(listingId);
        if (!listing) {
            return res.status(404).json({
                success: false,
                error: 'Listing not found'
            });
        }

        if (listing.status !== 'active') {
            return res.status(400).json({
                success: false,
                error: 'Listing is not active'
            });
        }

        // Can't buy own listing
        if (buyerId === listing.sellerId) {
            return res.status(400).json({
                success: false,
                error: 'Cannot purchase your own listing'
            });
        }

        // Check buyer balance
        const buyerBalance = db.getNeuroCoinBalance(buyerId);
        if (buyerBalance.wallet < listing.price) {
            return res.status(400).json({
                success: false,
                error: 'Insufficient NRC balance'
            });
        }

        // Calculate platform fee (5%)
        const platformFee = Math.floor(listing.price * 0.05);
        const sellerReceives = listing.price - platformFee;

        // Transfer NRC
        db.addNeuroCoin(buyerId, -listing.price, 'marketplace_purchase', {
            listingId,
            itemId: listing.itemId,
            sellerId: listing.sellerId
        });

        db.addNeuroCoin(listing.sellerId, sellerReceives, 'marketplace_sale', {
            listingId,
            itemId: listing.itemId,
            buyerId,
            platformFee
        });

        // Transfer item ownership (if NFT)
        if (listing.itemType === 'nft') {
            const sellerCollection = db.data.userCollections.get(listing.sellerId);
            if (sellerCollection) {
                sellerCollection.ownedItems = sellerCollection.ownedItems.filter(
                    item => item.itemId !== listing.itemId
                );
                db.data.userCollections.set(listing.sellerId, sellerCollection);
            }

            let buyerCollection = db.data.userCollections.get(buyerId) || {
                ownedItems: [],
                favoriteItem: null,
                totalValue: 0
            };

            buyerCollection.ownedItems.push({
                collectionId: listing.itemId.split('_')[0], // Assuming itemId format: collectionId_itemId
                itemId: listing.itemId,
                acquiredAt: new Date().toISOString()
            });

            db.data.userCollections.set(buyerId, buyerCollection);
        }

        // Update listing status
        listing.status = 'sold';
        listing.soldAt = new Date().toISOString();
        listing.buyerId = buyerId;
        db.data.nftListings.set(listingId, listing);

        // Record trade history
        const tradeId = `trade_${Date.now()}`;
        db.data.tradeHistory.set(tradeId, {
            buyerId,
            sellerId: listing.sellerId,
            itemId: listing.itemId,
            price: listing.price,
            platformFee,
            timestamp: new Date().toISOString()
        });

        db.saveData();

        res.json({
            success: true,
            trade: {
                listingId,
                buyerId,
                sellerId: listing.sellerId,
                price: listing.price,
                platformFee,
                sellerReceives
            },
            buyerNewBalance: db.getNeuroCoinBalance(buyerId)
        });

    } catch (error) {
        console.error('[NRC API] Error purchasing listing:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to purchase listing' 
        });
    }
});

// ==========================================
// Investment Routes
// ==========================================

/**
 * GET /api/nrc/investments/:userId
 * Get user's investments
 */
router.get('/investments/:userId', checkDB, (req, res) => {
    try {
        const { userId } = req.params;
        const userInvestments = [];

        for (const [investmentId, investment] of db.data.investments.entries()) {
            if (investment.userId === userId) {
                userInvestments.push({
                    id: investmentId,
                    ...investment
                });
            }
        }

        res.json({
            success: true,
            investments: userInvestments
        });
    } catch (error) {
        console.error('[NRC API] Error fetching investments:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch investments' 
        });
    }
});

/**
 * POST /api/nrc/invest/create
 * Create an investment
 */
router.post('/invest/create', checkDB, (req, res) => {
    try {
        const { userId, amount, duration } = req.body;

        if (!userId || !amount || !duration) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Validate duration
        const validDurations = { 7: 5, 30: 15, 90: 35 };
        if (!validDurations[duration]) {
            return res.status(400).json({
                success: false,
                error: 'Invalid duration. Must be 7, 30, or 90 days'
            });
        }

        const apy = validDurations[duration];

        // Check balance
        const balance = db.getNeuroCoinBalance(userId);
        if (balance.wallet < amount) {
            return res.status(400).json({
                success: false,
                error: 'Insufficient NRC balance'
            });
        }

        // Lock NRC
        db.addNeuroCoin(userId, -amount, 'investment_lock', { amount, duration, apy });

        // Create investment
        const investmentId = `invest_${Date.now()}_${userId}`;
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);

        const investment = {
            userId,
            amount,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            apy,
            status: 'active',
            earnedInterest: 0
        };

        db.data.investments.set(investmentId, investment);
        db.saveData();

        res.json({
            success: true,
            investmentId,
            investment,
            newBalance: db.getNeuroCoinBalance(userId)
        });

    } catch (error) {
        console.error('[NRC API] Error creating investment:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to create investment' 
        });
    }
});

/**
 * POST /api/nrc/invest/withdraw/:investmentId
 * Withdraw an investment
 */
router.post('/invest/withdraw/:investmentId', checkDB, (req, res) => {
    try {
        const { investmentId } = req.params;
        const { userId, forceEarly } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'Missing userId'
            });
        }

        // Get investment
        const investment = db.data.investments.get(investmentId);
        if (!investment) {
            return res.status(404).json({
                success: false,
                error: 'Investment not found'
            });
        }

        if (investment.userId !== userId) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to withdraw this investment'
            });
        }

        if (investment.status !== 'active') {
            return res.status(400).json({
                success: false,
                error: 'Investment is not active'
            });
        }

        const now = new Date();
        const endDate = new Date(investment.endDate);
        const isMatured = now >= endDate;

        let totalReturn = investment.amount;
        let interest = 0;
        let penalty = 0;

        if (isMatured) {
            // Full interest
            interest = Math.floor(investment.amount * (investment.apy / 100));
            totalReturn += interest;
        } else if (forceEarly) {
            // Early withdrawal - 25% penalty
            penalty = Math.floor(investment.amount * 0.25);
            totalReturn -= penalty;
        } else {
            return res.status(400).json({
                success: false,
                error: 'Investment has not matured yet. Set forceEarly=true to withdraw with penalty.'
            });
        }

        // Return NRC
        db.addNeuroCoin(userId, totalReturn, 'investment_withdraw', {
            investmentId,
            principal: investment.amount,
            interest,
            penalty,
            totalReturn
        });

        // Update investment status
        investment.status = isMatured ? 'completed' : 'withdrawn_early';
        investment.earnedInterest = interest;
        investment.withdrawnAt = now.toISOString();
        db.data.investments.set(investmentId, investment);
        db.saveData();

        res.json({
            success: true,
            withdrawal: {
                principal: investment.amount,
                interest,
                penalty,
                totalReturn
            },
            newBalance: db.getNeuroCoinBalance(userId)
        });

    } catch (error) {
        console.error('[NRC API] Error withdrawing investment:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to withdraw investment' 
        });
    }
});

// ==========================================
// Quest Routes
// ==========================================

/**
 * GET /api/nrc/quests/active/:userId
 * Get active quests for user
 */
router.get('/quests/active/:userId', checkDB, (req, res) => {
    try {
        const { userId } = req.params;
        const questProgress = db.data.questProgress?.get(userId) || {
            activeQuests: [],
            completedQuests: [],
            dailyStreak: 0,
            lastReset: new Date().toISOString()
        };

        res.json({
            success: true,
            quests: questProgress
        });
    } catch (error) {
        console.error('[NRC API] Error fetching quests:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch quests' 
        });
    }
});

/**
 * POST /api/nrc/quests/claim/:questId
 * Claim quest reward
 */
router.post('/quests/claim/:questId', checkDB, (req, res) => {
    try {
        const { questId } = req.params;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'Missing userId'
            });
        }

        // This would integrate with questHandler
        // For now, basic implementation
        res.json({
            success: true,
            message: 'Quest claim feature - integrate with questHandler'
        });

    } catch (error) {
        console.error('[NRC API] Error claiming quest:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to claim quest' 
        });
    }
});

// ==========================================
// Premium Routes
// ==========================================

/**
 * GET /api/nrc/premium/plans
 * Get all premium plans
 */
router.get('/premium/plans', (req, res) => {
    const plans = [
        {
            tier: 'bronze',
            name: 'Bronze',
            price: 5000,
            duration: 30,
            features: [
                '2x daily rewards',
                'Özel renk',
                'Bronze rozeti'
            ]
        },
        {
            tier: 'silver',
            name: 'Silver',
            price: 15000,
            duration: 30,
            features: [
                '3x daily rewards',
                'VIP rozeti',
                'Özel prefix',
                'Marketplace fee %50 indirim'
            ]
        },
        {
            tier: 'gold',
            name: 'Gold',
            price: 50000,
            duration: 30,
            features: [
                '5x tüm ödüller',
                'Tüm özellikler',
                'Priority support',
                'Özel NFT airdrop\'lar'
            ]
        }
    ];

    res.json({
        success: true,
        plans
    });
});

/**
 * POST /api/nrc/premium/subscribe
 * Subscribe to premium
 */
router.post('/premium/subscribe', checkDB, (req, res) => {
    try {
        const { userId, tier } = req.body;

        if (!userId || !tier) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // This would integrate with premiumHandler
        // For now, basic implementation
        res.json({
            success: true,
            message: 'Premium subscription feature - integrate with premiumHandler'
        });

    } catch (error) {
        console.error('[NRC API] Error subscribing to premium:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to subscribe to premium' 
        });
    }
});

/**
 * GET /api/nrc/balance/:userId
 * Get user's NRC balance
 */
router.get('/balance/:userId', checkDB, (req, res) => {
    try {
        const { userId } = req.params;
        const balance = db.getNeuroCoinBalance(userId);

        res.json({
            success: true,
            balance
        });
    } catch (error) {
        console.error('[NRC API] Error fetching balance:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch balance' 
        });
    }
});

// ==========================================
// Activity Feed Routes
// ==========================================

/**
 * GET /api/nrc/activity/live
 * Get recent activities (last 50)
 */
router.get('/activity/live', checkDB, (req, res) => {
    try {
        const { limit = 50, type } = req.query;
        
        let activities = Array.from(db.data.activityFeed.entries())
            .map(([id, activity]) => ({ id, ...activity }))
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Filter by type if specified
        if (type && type !== 'all') {
            activities = activities.filter(a => a.type === type);
        }

        // Limit results
        activities = activities.slice(0, parseInt(limit));

        res.json({
            success: true,
            activities,
            total: activities.length
        });
    } catch (error) {
        console.error('[NRC API] Error fetching activities:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch activities' 
        });
    }
});

/**
 * GET /api/nrc/activity/stats
 * Get activity statistics
 */
router.get('/activity/stats', checkDB, (req, res) => {
    try {
        const activities = Array.from(db.data.activityFeed.values());
        
        // Calculate stats
        const now = Date.now();
        const oneDayAgo = now - (24 * 60 * 60 * 1000);
        const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);

        const last24h = activities.filter(a => new Date(a.timestamp).getTime() > oneDayAgo);
        const last7d = activities.filter(a => new Date(a.timestamp).getTime() > oneWeekAgo);

        // Type breakdown
        const typeBreakdown = {};
        activities.forEach(a => {
            typeBreakdown[a.type] = (typeBreakdown[a.type] || 0) + 1;
        });

        // Total volume (sum of amounts)
        const totalVolume = activities.reduce((sum, a) => sum + (a.amount || 0), 0);
        const volume24h = last24h.reduce((sum, a) => sum + (a.amount || 0), 0);

        res.json({
            success: true,
            stats: {
                totalActivities: activities.length,
                last24h: last24h.length,
                last7d: last7d.length,
                typeBreakdown,
                totalVolume,
                volume24h,
                avgPerActivity: activities.length > 0 ? totalVolume / activities.length : 0
            }
        });
    } catch (error) {
        console.error('[NRC API] Error fetching activity stats:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch activity stats' 
        });
    }
});

// ==========================================
// Discord Proxy Routes
// ==========================================

/**
 * GET /api/nrc/discord/avatar/:userId
 * Fetch Discord user avatar (proxy)
 */
router.get('/discord/avatar/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Try to get from bot's client
        const client = global.discordClient;
        
        if (client) {
            try {
                const user = await client.users.fetch(userId);
                const avatarURL = user.displayAvatarURL({ format: 'png', size: 128 });
                
                res.json({
                    success: true,
                    avatar: avatarURL,
                    username: user.username,
                    discriminator: user.discriminator
                });
                return;
            } catch (err) {
                console.warn(`[Discord Proxy] Could not fetch user ${userId}:`, err.message);
            }
        }

        // Fallback to default Discord avatar
        const defaultAvatarIndex = parseInt(userId) % 5;
        res.json({
            success: true,
            avatar: `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`,
            username: `User${userId.substring(0, 4)}`,
            discriminator: '0000'
        });
        
    } catch (error) {
        console.error('[NRC API] Error fetching Discord avatar:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch avatar',
            fallback: 'https://cdn.discordapp.com/embed/avatars/0.png'
        });
    }
});

/**
 * GET /api/nrc/discord/server/:serverId
 * Fetch Discord server info (proxy)
 */
router.get('/discord/server/:serverId', async (req, res) => {
    try {
        const { serverId } = req.params;
        
        // Try to get from bot's client
        const client = global.discordClient;
        
        if (client) {
            try {
                const guild = await client.guilds.fetch(serverId);
                const iconURL = guild.iconURL({ format: 'png', size: 64 });
                
                res.json({
                    success: true,
                    serverName: guild.name,
                    serverIcon: iconURL,
                    memberCount: guild.memberCount
                });
                return;
            } catch (err) {
                console.warn(`[Discord Proxy] Could not fetch guild ${serverId}:`, err.message);
            }
        }

        // Fallback
        res.json({
            success: true,
            serverName: 'Unknown Server',
            serverIcon: null,
            memberCount: 0
        });
        
    } catch (error) {
        console.error('[NRC API] Error fetching Discord server:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch server info'
        });
    }
});

module.exports = { router, initDB };

