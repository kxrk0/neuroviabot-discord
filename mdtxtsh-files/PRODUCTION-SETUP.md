# 🚀 Production Setup Guide for neuroviabot.xyz

## ❗ Auth Error Fix

If you're getting `https://neuroviabot.xyz/api/auth/error`, follow these steps:

## Step 1: Discord Developer Portal Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application (Client ID: `773539215098249246`)
3. Go to **OAuth2** → **General**
4. Add these **Redirect URLs**:

```
https://neuroviabot.xyz/api/auth/callback/discord
http://localhost:3001/api/auth/callback/discord
```

5. Click **Save Changes**

## Step 2: Environment Variables

Create `.env.local` in `neuroviabot-frontend/`:

```env
# Discord OAuth
DISCORD_CLIENT_ID=773539215098249246
DISCORD_CLIENT_SECRET=your_actual_client_secret_here

# NextAuth
NEXTAUTH_URL=https://neuroviabot.xyz
NEXTAUTH_SECRET=generate_a_random_32_char_secret_here

# API
NEXT_PUBLIC_API_URL=https://neuroviabot.xyz
NEXT_PUBLIC_BOT_CLIENT_ID=773539215098249246
```

### Generate NEXTAUTH_SECRET

Run this command:
```bash
openssl rand -base64 32
```

Or use this Node.js script:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Step 3: Vercel/Hosting Environment Variables

If deploying to Vercel, add these environment variables:

### Required Variables:
```
DISCORD_CLIENT_ID=773539215098249246
DISCORD_CLIENT_SECRET=your_secret
NEXTAUTH_URL=https://neuroviabot.xyz
NEXTAUTH_SECRET=your_generated_secret
NEXT_PUBLIC_API_URL=https://neuroviabot.xyz
NEXT_PUBLIC_BOT_CLIENT_ID=773539215098249246
```

## Step 4: Verify Discord Application Settings

### OAuth2 Scopes Required:
- ✅ `identify`
- ✅ `email`
- ✅ `guilds`

### Redirect URLs Must Include:
```
https://neuroviabot.xyz/api/auth/callback/discord
```

## Step 5: Test Authentication

1. Clear browser cookies for `neuroviabot.xyz`
2. Go to `https://neuroviabot.xyz/login`
3. Click "Continue with Discord"
4. Should redirect to Discord OAuth page
5. After authorization, should redirect to dashboard

## Common Issues & Solutions

### Issue 1: "Configuration Error"
**Problem:** NextAuth not configured properly
**Solution:** 
- Check `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Restart server after changing env vars

### Issue 2: "Redirect URI Mismatch"
**Problem:** Discord redirect URL doesn't match
**Solution:**
- Verify redirect URL in Discord Developer Portal
- Must be exactly: `https://neuroviabot.xyz/api/auth/callback/discord`
- No trailing slash
- HTTPS required in production

### Issue 3: "Invalid Client Secret"
**Problem:** Wrong client secret
**Solution:**
- Get fresh secret from Discord Developer Portal
- Go to OAuth2 → Reset Secret → Copy new secret
- Update `DISCORD_CLIENT_SECRET` in env vars

## Debug Mode

To enable debug mode in production, add:
```env
NODE_ENV=production
NEXTAUTH_DEBUG=true
```

This will show detailed errors in console.

## Quick Verification Checklist

- [ ] Discord redirect URL added: `https://neuroviabot.xyz/api/auth/callback/discord`
- [ ] `DISCORD_CLIENT_SECRET` is correct and current
- [ ] `NEXTAUTH_SECRET` is generated and set
- [ ] `NEXTAUTH_URL=https://neuroviabot.xyz` (no trailing slash)
- [ ] All env vars are set in hosting platform (Vercel/etc)
- [ ] Browser cookies cleared
- [ ] Server/build redeployed after env changes

## Testing Locally First

Before production, test locally:

```bash
# In neuroviabot-frontend/.env.local
NEXTAUTH_URL=http://localhost:3001
DISCORD_CLIENT_SECRET=your_secret
NEXTAUTH_SECRET=your_secret

# Discord Developer Portal - Add:
http://localhost:3001/api/auth/callback/discord

# Run
npm run dev
```

Visit `http://localhost:3001/login` and test auth flow.

## Still Having Issues?

### Enable Detailed Logging

In `neuroviabot-frontend/lib/auth.ts`, the debug mode is already enabled for development.

### Check Server Logs

Look for these errors:
- `NEXTAUTH_URL` mismatch
- `DISCORD_CLIENT_SECRET` invalid
- `NEXTAUTH_SECRET` missing
- Callback URL mismatch

### Contact Support

If still failing:
1. Check Discord application is not rate-limited
2. Verify domain DNS is resolving correctly
3. Ensure HTTPS certificate is valid
4. Check if any firewall/proxy blocking OAuth redirects

---

## ✅ Success Indicators

When working correctly:
1. Click login → Discord authorization page appears
2. Approve → Redirects to `/dashboard/servers`
3. User session persists
4. No `/api/auth/error` redirects

---

**Last Updated:** 2025-01-30
**Version:** 2.0
