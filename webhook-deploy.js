#!/usr/bin/env node

/**
 * NeuroViaBot Webhook Deployment Server
 * VPS'te çalışır, GitHub'dan webhook alır ve otomatik deploy yapar
 */

// .env dosyasını yükle
require('dotenv').config({ path: '/root/neuroviabot/bot/.env' });

const express = require('express');
const crypto = require('crypto');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.WEBHOOK_PORT || 9000;
const REPO_PATH = '/root/neuroviabot/bot';

// Webhook secret ZORUNLU - güvenlik nedeniyle fallback YOK
const SECRET = process.env.SESSION_SECRET;

if (!SECRET) {
    console.error('❌ FATAL ERROR: SESSION_SECRET environment variable is required!');
    console.error('💡 .env file should contain: SESSION_SECRET=your_secret');
    console.error(`📁 Checked path: ${path.join(REPO_PATH, '.env')}`);
    process.exit(1);
}

// Middleware   
app.use(express.json());

// Logging
const log = (message, type = 'INFO') => {
    const timestamp = new Date().toISOString();
    const emoji = {
        'INFO': 'ℹ️',
        'SUCCESS': '✅',
        'WARNING': '⚠️',
        'ERROR': '❌',
        'DEPLOY': '🚀',
        'WEBHOOK': '📨',
        'START': '🎯'
    };
    console.log(`[${timestamp}] [${type}] ${emoji[type] || '•'} ${message}`);
};

// Execute shell command with better error handling
const runCommand = (command, cwd = REPO_PATH, timeout = 300000) => {
    return new Promise((resolve, reject) => {
        exec(command, { cwd, timeout }, (error, stdout, stderr) => {
            if (error) {
                reject({ error, stderr, stdout, command });
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
};

// Webhook signature verification
const verifySignature = (req) => {
    const signature = req.headers['x-hub-signature-256'];
    if (!signature) return false;

    const hmac = crypto.createHmac('sha256', SECRET);
    const digest = 'sha256=' + hmac.update(JSON.stringify(req.body)).digest('hex');
    
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
};

// Deployment function with improved error handling
const deploy = async () => {
    log('Deployment başlatılıyor...', 'DEPLOY');
    const startTime = Date.now();

    try {
        // 1. Git operations
        log('📥 Git pull yapılıyor...', 'DEPLOY');
        
        try {
            await runCommand('git fetch origin main');
            await runCommand('git reset --hard origin/main');
            log('✅ Git reset başarılı', 'DEPLOY');
        } catch (e) {
            log(`Git reset hatası: ${e.stderr}`, 'WARNING');
            // Try alternative method
            await runCommand('git stash');
            await runCommand('git pull origin main --rebase');
        }

        // 2. Bot dependencies
        log('📦 Bot dependencies kuruluyor...', 'DEPLOY');
        try {
            await runCommand('npm install --production', REPO_PATH, 120000);
            log('✅ Bot dependencies kuruldu', 'DEPLOY');
        } catch (e) {
            log(`⚠️ Bot dependencies warning: ${e.stderr || e.message}`, 'WARNING');
        }

        // 3. Backend dependencies
        log('⚙️ Backend dependencies kuruluyor...', 'DEPLOY');
        try {
            await runCommand('npm install --production', `${REPO_PATH}/neuroviabot-backend`, 120000);
            log('✅ Backend dependencies kuruldu', 'DEPLOY');
        } catch (e) {
            log(`⚠️ Backend dependencies warning: ${e.stderr || e.message}`, 'WARNING');
        }

        // 4. Frontend build (optional - don't fail deployment if this fails)
        log('🌐 Frontend build başlıyor...', 'DEPLOY');
        try {
            await runCommand('npm install', `${REPO_PATH}/neuroviabot-frontend`, 180000);
            await runCommand('npm run build', `${REPO_PATH}/neuroviabot-frontend`, 300000);
            log('✅ Frontend build tamamlandı', 'DEPLOY');
        } catch (e) {
            log(`⚠️ Frontend build failed (non-critical): ${e.stderr || e.message}`, 'WARNING');
            log('ℹ️ Continuing deployment without frontend rebuild...', 'INFO');
        }

        // 5. PM2 restart with --update-env
        log('🔄 PM2 servisleri yeniden başlatılıyor...', 'DEPLOY');
        
        try {
            // Restart bot
            await runCommand('pm2 restart neuroviabot --update-env');
            log('✅ Bot restarted', 'DEPLOY');
        } catch (e) {
            log(`⚠️ Bot restart warning: ${e.message}`, 'WARNING');
        }

        try {
            // Restart backend
            await runCommand('pm2 restart neuroviabot-backend --update-env');
            log('✅ Backend restarted', 'DEPLOY');
        } catch (e) {
            log(`⚠️ Backend restart warning: ${e.message}`, 'WARNING');
        }

        try {
            // Restart frontend
            await runCommand('pm2 restart neuroviabot-frontend --update-env');
            log('✅ Frontend restarted', 'DEPLOY');
        } catch (e) {
            log(`⚠️ Frontend restart warning: ${e.message}`, 'WARNING');
        }

        // Save PM2 configuration
        await runCommand('pm2 save');
        
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        log(`🎉 DEPLOYMENT BAŞARILI! (${duration}s)`, 'SUCCESS');
        return { success: true, message: 'Deployment successful', duration };

    } catch (error) {
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        log(`❌ Deployment hatası: ${error.message}`, 'ERROR');
        if (error.stderr) log(`stderr: ${error.stderr}`, 'ERROR');
        if (error.command) log(`command: ${error.command}`, 'ERROR');
        return { success: false, error: error.message, duration };
    }
};

// Webhook endpoint
app.post('/webhook', async (req, res) => {
    log('Webhook alındı', 'WEBHOOK');

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
        const result = await deploy();
        if (result.success) {
            log(`Deployment completed successfully in ${result.duration}s`, 'SUCCESS');
        } else {
            log(`Deployment failed after ${result.duration}s: ${result.error}`, 'ERROR');
        }
    }, 100);
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        secret_configured: !!SECRET
    });
});

// Start server
app.listen(PORT, () => {
    log(`Webhook server listening on port ${PORT}`, 'START');
    log(`Webhook secret: ${SECRET ? 'configured ✓' : 'NOT CONFIGURED ✗'}`, 'START');
    log(`Repository path: ${REPO_PATH}`, 'START');
    log('.env file loaded', 'START');
    log('Ready to receive webhooks!', 'START');
});

// Handle errors
process.on('uncaughtException', (error) => {
    log(`Uncaught Exception: ${error.message}`, 'ERROR');
    log(error.stack, 'ERROR');
});

process.on('unhandledRejection', (error) => {
    log(`Unhandled Rejection: ${error.message}`, 'ERROR');
    log(error.stack, 'ERROR');
});
