<!-- faa0471e-4c8d-4c0c-a983-40090512c438 a44e3349-504a-4da3-b02a-329374fac401 -->
# Frontend Feature Completion & NeuroCoin Integration

## Phase 1: NeuroCoin Header Integration

### 1.1 Backend - User NeuroCoin Balance API

**File**: `neuroviabot-backend/routes/neurocoin.js`

- Add `GET /api/neurocoin/balance/:userId` endpoint
- Fetch user's NeuroCoin balance from bot database
- Return: `{ total, available, locked, lastUpdated }`
- Add caching with 30-second TTL

### 1.2 Frontend - Navbar NeuroCoin Display

**File**: `neuroviabot-frontend/components/layout/Navbar.tsx`

- Add NeuroCoin balance display next to notifications
- Format: "🪙 1,250 NRC" with animated counter
- Click opens dropdown with:
- Total balance
- Available / Locked breakdown
- Quick link to NeuroCoin dashboard
- Quick link to Marketplace
- Real-time updates via Socket.IO

### 1.3 Frontend - User Dropdown Enhancement

**File**: `neuroviabot-frontend/components/auth/UserDropdown.tsx`

- Add detailed NeuroCoin section in dropdown
- Show: Balance, daily earnings, rank
- Add "Manage NeuroCoin" button → `/neurocoin`
- Add "View Profile" button → `/profile/[userId]`

### 1.4 Context - NeuroCoin Global State

**File**: `neuroviabot-frontend/contexts/NeuroCoinContext.tsx` (NEW)

- Create React Context for NeuroCoin balance
- Auto-fetch on user login
- Subscribe to Socket.IO `neurocoin_update` events
- Provide: `{ balance, loading, refresh }`

---

## Phase 2: Leveling System Page Fix

### 2.1 Backend - Leveling Data API

**File**: `neuroviabot-backend/routes/leveling.js` (NEW)

- `GET /api/leveling/:guildId/users` - Get all user levels in guild
- `GET /api/leveling/:guildId/user/:userId` - Get specific user level
- `GET /api/leveling/:guildId/leaderboard` - Top 100 users
- `POST /api/leveling/:guildId/user/:userId/reset` - Reset user XP (admin)
- Proxy to bot server's database

### 2.2 Bot Server - Leveling API Routes

**File**: `src/routes/leveling.js` (NEW)

- Implement actual leveling data endpoints
- Use `simple-db` to fetch user XP/levels
- Calculate rank, progress to next level
- Return formatted data

### 2.3 Frontend - Fix LevelingSettings Component

**File**: `neuroviabot-frontend/components/dashboard/LevelingSettings.tsx`

- Fix API endpoint URLs (use `/api/guilds/:guildId/settings/leveling`)
- Add error boundary and loading states
- Fix channel/role fetching (use guild-management API)
- Add leaderboard preview in settings
- Add "Test Level Up" button for admins

### 2.4 Frontend - Create Leaderboard Page

**File**: `neuroviabot-frontend/app/leaderboard/[guildId]/page.tsx` (NEW)

- Public leaderboard page for each guild
- Show top 100 users with XP, level, rank
- Animated rank cards with gradients
- Filter by time period (all-time, monthly, weekly)
- Search functionality

---

## Phase 3: Premium System

### 3.1 Backend - Premium Plans API

**File**: `neuroviabot-backend/routes/premium.js` (NEW)

- `GET /api/premium/plans` - List all premium plans
- `GET /api/premium/user/:userId` - Get user's premium status
- `GET /api/premium/guild/:guildId` - Get guild's premium status
- `POST /api/premium/purchase` - Purchase premium (mock for now)
- `POST /api/premium/cancel` - Cancel subscription

### 3.2 Database - Premium Schema

**File**: `src/database/simple-db.js`

- Add `userPremium` Map: `{ userId, plan, expiresAt, features }`
- Add `guildPremium` Map: `{ guildId, plan, expiresAt, features }`
- Add methods: `getUserPremium`, `setUserPremium`, `isUserPremium`

### 3.3 Frontend - Premium Plans Page

**File**: `neuroviabot-frontend/app/premium/page.tsx` (NEW)

- Beautiful pricing cards (Free, Pro, Enterprise)
- Feature comparison table
- Benefits showcase with icons
- "Upgrade" buttons (mock payment for now)
- Current plan indicator if logged in

### 3.4 Frontend - Premium Dashboard Section

**File**: `neuroviabot-frontend/components/dashboard/PremiumSettings.tsx` (NEW)

- Replace placeholder in `/manage/[serverId]`
- Show current premium status
- List active features
- Usage statistics
- Upgrade/downgrade options
- Billing history (mock)

---

## Phase 4: Reaction Roles System

### 4.1 Backend - Reaction Roles API

**File**: `neuroviabot-backend/routes/reaction-roles.js` (NEW)

- `GET /api/reaction-roles/:guildId` - Get all reaction role configs
- `POST /api/reaction-roles/:guildId` - Create new reaction role
- `PUT /api/reaction-roles/:guildId/:configId` - Update config
- `DELETE /api/reaction-roles/:guildId/:configId` - Delete config
- `POST /api/reaction-roles/:guildId/:configId/test` - Test reaction

### 4.2 Bot Server - Reaction Roles Handler

**File**: `src/handlers/reactionRoleHandler.js` (NEW)

- Listen to `messageReactionAdd` and `messageReactionRemove`
- Check if message has reaction role config
- Add/remove role from user
- Log actions to audit log

### 4.3 Frontend - Fix RoleReactionSettings

**File**: `neuroviabot-frontend/components/dashboard/RoleReactionSettings.tsx`

- Connect to new API endpoints
- Add message picker (paste message link or ID)
- Emoji picker for reactions
- Role selector dropdown
- Live preview of reaction roles
- Bulk import/export feature

---

## Phase 5: Audit Log System

### 5.1 Backend - Audit Log API

**File**: `neuroviabot-backend/routes/audit-log.js` (NEW)

- `GET /api/audit/:guildId` - Get audit logs (paginated)
- `GET /api/audit/:guildId/filter` - Filter by type, user, date
- `GET /api/audit/:guildId/export` - Export logs as JSON/CSV
- Query params: `page`, `limit`, `type`, `userId`, `startDate`, `endDate`

### 5.2 Bot Server - Audit Logging System

**File**: `src/utils/auditLogger.js` (NEW)

- Centralized audit logging utility
- Log types: `MEMBER_JOIN`, `MEMBER_LEAVE`, `MEMBER_BAN`, `MEMBER_KICK`, `ROLE_CREATE`, `ROLE_UPDATE`, `ROLE_DELETE`, `CHANNEL_CREATE`, `CHANNEL_UPDATE`, `CHANNEL_DELETE`, `MESSAGE_DELETE`, `SETTINGS_CHANGE`, `COMMAND_USE`
- Store in database with: `{ guildId, type, userId, targetId, action, details, timestamp }`
- Auto-cleanup logs older than 90 days

### 5.3 Database - Audit Log Schema

**File**: `src/database/simple-db.js`

- Add `auditLogs` Map: `guildId → Array<AuditEntry>`
- Add methods: `addAuditLog`, `getAuditLogs`, `filterAuditLogs`, `cleanupOldLogs`
- Implement pagination

### 5.4 Frontend - Audit Log Component

**File**: `neuroviabot-frontend/components/dashboard/AuditLog.tsx`

- Replace placeholder with full audit log viewer
- Timeline view with icons for each action type
- Filters: type, user, date range
- Search functionality
- Export button
- Real-time updates via Socket.IO
- Color-coded by severity (info, warning, danger)

---

## Phase 6: Economy System Frontend

### 6.1 Frontend - Economy Dashboard in Server Settings

**File**: `neuroviabot-frontend/components/dashboard/EconomySettings.tsx`

- Connect to existing backend API
- Show guild economy stats
- Configure: daily rewards, work cooldowns, shop items
- Manage custom shop items for guild
- View top earners in guild

### 6.2 Frontend - Global Economy Pages

#### 6.2.1 NeuroCoin Dashboard Enhancement

**File**: `neuroviabot-frontend/app/neurocoin/page.tsx`

- Add transaction history table
- Add earning sources breakdown chart
- Add spending categories chart
- Add recent activity feed
- Add quick actions: transfer, marketplace

#### 6.2.2 Marketplace Page Enhancement

**File**: `neuroviabot-frontend/app/marketplace/page.tsx`

- Connect to real backend API (already exists)
- Implement filters: type, rarity, price, guild
- Implement search
- Add "My Listings" tab
- Add "Create Listing" button → modal

#### 6.2.3 Create Listing Modal

**File**: `neuroviabot-frontend/components/marketplace/CreateListingModal.tsx` (NEW)

- Form: item type, name, description, price, quantity
- Image/icon upload
- Guild selection (global or specific guild)
- Preview before posting
- Submit to backend API

#### 6.2.4 Quest System Page

**File**: `neuroviabot-frontend/app/quests/page.tsx` (NEW)

- List all available quests
- Show active quests with progress bars
- Show completed quests
- Quest categories: daily, weekly, special
- Claim rewards button
- Quest details modal

#### 6.2.5 Global Leaderboards Page

**File**: `neuroviabot-frontend/app/leaderboards/page.tsx` (NEW)

- Multiple leaderboard tabs:
- NeuroCoin Balance
- Total Earnings
- Quest Completions
- Marketplace Sales
- Activity Score
- Global and per-guild views
- Animated rank cards
- User search

---

## Phase 7: Server Overview Data Fix

### 7.1 Backend - Guild Stats API Enhancement

**File**: `neuroviabot-backend/routes/guilds.js`

- Fix `GET /api/guilds/:guildId` endpoint
- Return complete guild data:
- `memberCount` (total members)
- `onlineCount` (online members)
- `channelCount` (total channels)
- `roleCount` (total roles)
- `boostLevel`, `boostCount`
- `createdAt`
- Fetch from bot server, not just Discord API

### 7.2 Bot Server - Guild Stats Endpoint

**File**: `src/routes/guild-management.js`

- Add `/guilds/:guildId/stats` endpoint
- Calculate real-time stats from Discord.js client
- Return all required data for ServerOverview

### 7.3 Frontend - ServerOverview Component Fix

**File**: `neuroviabot-frontend/components/dashboard/ServerOverview.tsx`

- Already implemented, just needs correct API data
- Add refresh button
- Add last updated timestamp
- Add animated stat changes

---

## Phase 8: Additional Features & Polish

### 8.1 Frontend - Profile Page Enhancement

**File**: `neuroviabot-frontend/app/profile/[userId]/page.tsx`

- Add NeuroCoin balance section
- Add quest progress section
- Add achievements showcase
- Add marketplace activity
- Add recent transactions
- Add activity graph (last 30 days)

### 8.2 Frontend - Global Navigation Enhancement

**File**: `neuroviabot-frontend/components/layout/Navbar.tsx`

- Add navigation items:
- NeuroCoin (with balance)
- Marketplace
- Quests
- Leaderboards
- Premium
- Add active state indicators
- Add notification badges (new quests, marketplace sales)

### 8.3 Frontend - Footer Enhancement

**File**: `neuroviabot-frontend/components/layout/Footer.tsx`

- Add NeuroCoin stats (total in circulation)
- Add bot stats (servers, users)
- Add links to new pages

### 8.4 Real-time Notifications

**File**: `neuroviabot-frontend/hooks/useSocket.tsx`

- Add event listeners:
- `neurocoin_earned` → Toast notification
- `quest_completed` → Toast + confetti
- `marketplace_sale` → Toast notification
- `level_up` → Toast notification
- `achievement_unlocked` → Toast + modal

### 8.5 Error Boundaries & Loading States

- Add ErrorBoundary to all new pages
- Add LoadingSkeleton to all data-fetching components
- Add EmptyState to all list components
- Consistent error handling across all API calls

---

## Phase 9: Testing & Bug Fixes

### 9.1 Fix Existing Bugs

- LevelingSettings API connection error
- ServerOverview missing data (0 values)
- RoleReactionSettings placeholder state
- Premium page empty state
- AuditLog placeholder state

### 9.2 Cross-page Testing

- Test all navigation flows
- Test Socket.IO real-time updates
- Test authentication across all pages
- Test responsive design on mobile
- Test error states and edge cases

### 9.3 Performance Optimization

- Implement data caching where appropriate
- Lazy load heavy components
- Optimize image loading
- Minimize API calls with smart caching
- Add service worker for offline support (optional)

---

## Implementation Priority

**Critical (Phase 1-3)**: NeuroCoin header, Leveling fix, Premium system
**High (Phase 4-5)**: Reaction Roles, Audit Log
**Medium (Phase 6-7)**: Economy frontend, Server stats fix
**Polish (Phase 8-9)**: Additional features, testing, optimization

### To-dos

- [ ] Delete /dashboard routes and update all navigation links to use /servers
- [ ] Create notification toast component and context for real-time updates
- [ ] Create backend API routes for member, role, and channel management
- [ ] Build MemberManagement, RoleEditor, ChannelManager, AuditLog, and ServerOverview components
- [ ] Redesign /manage/[serverId] with new categories and improved UI/UX
- [ ] Add bot server management endpoints and Socket.IO broadcasts
- [ ] Add animations, loading states, responsive design, and error handling
- [ ] Push commits incrementally and test on live domain after each phase