#!/usr/bin/env node

/**
 * NeuroViaBot Webhook Deployment Server
 * VPS'te çalışır, GitHub'dan webhook alır ve otomatik deploy yapar
 */

const express = require('express');
const crypto = require('crypto');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.WEBHOOK_PORT || 9000;
const SECRET = process.env.WEBHOOK_SECRET || 'change-this-secret';
const REPO_PATH = '/root/neuroviabot/bot';

// Middleware
app.use(express.json());

// Logging
const log = (message, type = 'INFO') => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${type}] ${message}`);
};

// Webhook signature verification
const verifySignature = (req) => {
    const signature = req.headers['x-hub-signature-256'];
    if (!signature) return false;

    const hmac = crypto.createHmac('sha256', SECRET);
    const digest = 'sha256=' + hmac.update(JSON.stringify(req.body)).digest('hex');
    
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
};

// Execute shell command
const runCommand = (command, cwd = REPO_PATH) => {
    return new Promise((resolve, reject) => {
        exec(command, { cwd }, (error, stdout, stderr) => {
            if (error) {
                reject({ error, stderr });
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
};

// Deployment function
const deploy = async () => {
    log('🚀 Deployment başlatılıyor...', 'DEPLOY');

    try {
        // 1. Git pull (with stash for local changes)
        log('📥 Git pull yapılıyor...', 'DEPLOY');
        try {
            // Stash any local changes first
            await runCommand('git stash');
        } catch (e) {
            log('ℹ️  No local changes to stash', 'DEPLOY');
        }
        await runCommand('git pull origin main');
        log('✅ Git pull tamamlandı', 'DEPLOY');

        // 2. Bot dependencies
        log('📦 Bot dependencies kuruluyor...', 'DEPLOY');
        await runCommand('npm install --omit=dev');
        log('✅ Bot dependencies kuruldu', 'DEPLOY');

        // 3. Frontend build
        log('🌐 Frontend build başlıyor...', 'DEPLOY');
        await runCommand('npm install', `${REPO_PATH}/frontend`);
        await runCommand('npm run build', `${REPO_PATH}/frontend`);
        await runCommand('npm prune --production', `${REPO_PATH}/frontend`);
        log('✅ Frontend build tamamlandı', 'DEPLOY');

        // 4. Backend dependencies
        log('⚙️ Backend dependencies kuruluyor...', 'DEPLOY');
        await runCommand('npm install --omit=dev', `${REPO_PATH}/backend`);
        log('✅ Backend dependencies kuruldu', 'DEPLOY');

        // 5. PM2 restart (or start if not exists)
        log('🔄 PM2 servisleri yeniden başlatılıyor...', 'DEPLOY');
        
        // Bot
        try {
            await runCommand('pm2 restart neuroviabot');
        } catch {
            await runCommand('pm2 start index.js --name neuroviabot', REPO_PATH);
        }
        
        // Frontend
        try {
            await runCommand('pm2 restart neuroviabot-frontend');
        } catch {
            await runCommand('pm2 start npm --name neuroviabot-frontend -- start', `${REPO_PATH}/frontend`);
        }
        
        // Backend
        try {
            await runCommand('pm2 restart neuroviabot-backend');
        } catch {
            await runCommand('pm2 start npm --name neuroviabot-backend -- start', `${REPO_PATH}/backend`);
        }
        
        await runCommand('pm2 save');
        log('✅ PM2 servisleri restart edildi', 'DEPLOY');

        log('🎉 DEPLOYMENT BAŞARILI!', 'SUCCESS');
        return { success: true, message: 'Deployment successful' };

    } catch (error) {
        log(`❌ Deployment hatası: ${error.message}`, 'ERROR');
        log(`stderr: ${error.stderr}`, 'ERROR');
        throw error;
    }
};

// Webhook endpoint
app.post('/webhook', async (req, res) => {
    log('📨 Webhook alındı', 'WEBHOOK');

    // Verify signature
    if (!verifySignature(req)) {
        log('⚠️ Invalid signature!', 'ERROR');
        return res.status(401).json({ error: 'Invalid signature' });
    }

    // Check if it's a push event to main branch
    const event = req.headers['x-github-event'];
    const branch = req.body.ref;

    log(`Event: ${event}, Branch: ${branch}`, 'WEBHOOK');

    if (event !== 'push' || branch !== 'refs/heads/main') {
        log('ℹ️ Not a push to main branch, skipping deployment', 'INFO');
        return res.json({ message: 'Event ignored' });
    }

    // Respond immediately
    res.json({ message: 'Deployment started' });

    // Deploy asynchronously
    setTimeout(async () => {
        try {
            await deploy();
        } catch (error) {
            log(`❌ Deployment failed: ${error.message}`, 'ERROR');
        }
    }, 100);
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    log(`🎯 Webhook server listening on port ${PORT}`, 'START');
    log(`🔐 Webhook secret configured`, 'START');
    log(`📁 Repository path: ${REPO_PATH}`, 'START');
    log('✅ Ready to receive webhooks!', 'START');
});

// Handle errors
process.on('uncaughtException', (error) => {
    log(`Uncaught Exception: ${error.message}`, 'ERROR');
});

process.on('unhandledRejection', (error) => {
    log(`Unhandled Rejection: ${error.message}`, 'ERROR');
});

