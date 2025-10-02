const express = require('express');
const router = express.Router();

// Feedback form endpoint
router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      discordTag,
      serverName,
      feedbackType,
      rating,
      experienceAreas,
      title,
      message
    } = req.body;

    // Validation
    if (!name || !email || !feedbackType || !rating || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen tüm gerekli alanları doldurun.'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz e-posta adresi.'
      });
    }

    // Rating validation
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz puan değeri.'
      });
    }

    // Feedback type validation
    const validTypes = ['positive', 'negative', 'suggestion', 'issue'];
    if (!validTypes.includes(feedbackType)) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz geri bildirim türü.'
      });
    }

    // Log the feedback
    console.log('[FEEDBACK] New feedback submission:', {
      name,
      email,
      discordTag,
      serverName,
      feedbackType,
      rating,
      experienceAreas: experienceAreas?.length || 0,
      title,
      timestamp: new Date().toISOString()
    });

    // Here you can add:
    // 1. Save to database
    // 2. Send email notification
    // 3. Send Discord webhook notification
    // 4. Update analytics/metrics

    // Example: Send to Discord webhook (optional)
    if (process.env.FEEDBACK_WEBHOOK_URL) {
      const typeEmojis = {
        positive: '😊',
        negative: '😕',
        suggestion: '💡',
        issue: '⚠️'
      };

      const ratingStars = '⭐'.repeat(rating);

      const webhookPayload = {
        embeds: [{
          title: `${typeEmojis[feedbackType]} Yeni Geri Bildirim`,
          color: feedbackType === 'positive' ? 0x43B581 : 
                 feedbackType === 'negative' ? 0xF04747 :
                 feedbackType === 'suggestion' ? 0xFAA61A : 0xFF9800,
          fields: [
            { name: 'Ad Soyad', value: name, inline: true },
            { name: 'E-posta', value: email, inline: true },
            { name: 'Discord', value: discordTag || 'Belirtilmedi', inline: true },
            { name: 'Sunucu', value: serverName || 'Belirtilmedi', inline: true },
            { name: 'Tür', value: feedbackType, inline: true },
            { name: 'Puan', value: ratingStars + ` (${rating}/5)`, inline: true },
            ...(experienceAreas && experienceAreas.length > 0 ? [{
              name: 'Alanlar',
              value: experienceAreas.join(', '),
              inline: false
            }] : []),
            { name: 'Başlık', value: title, inline: false },
            { name: 'Mesaj', value: message.substring(0, 1000), inline: false }
          ],
          timestamp: new Date().toISOString(),
          footer: { text: 'NeuroViaBot Feedback System' }
        }]
      };

      try {
        const fetch = globalThis.fetch || require('node-fetch');
        await fetch(process.env.FEEDBACK_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookPayload)
        });
      } catch (webhookError) {
        console.error('[FEEDBACK] Webhook error:', webhookError);
        // Don't fail the request if webhook fails
      }
    }

    res.status(200).json({
      success: true,
      message: 'Geri bildiriminiz alındı. Değerli geri bildiriminiz için teşekkür ederiz!'
    });

  } catch (error) {
    console.error('[FEEDBACK] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
    });
  }
});

// Get feedback statistics (optional)
router.get('/stats', async (req, res) => {
  try {
    // This is mock data - replace with real database queries
    const stats = {
      total: 127,
      implemented: 23,
      resolved: 41,
      byType: {
        positive: 45,
        negative: 12,
        suggestion: 54,
        issue: 16
      },
      averageRating: 4.3
    };

    res.status(200).json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('[FEEDBACK] Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'İstatistikler alınamadı.'
    });
  }
});

module.exports = router;

