const express = require('express');
const router = express.Router();
const cron = require('node-cron');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { scrapeAll } = require('../services/scraper');

let scraperTask = null;
let scraperStatus = { running: false, lastRun: null, lastStats: null, lastError: null };

router.get('/status', authenticate, requireAdmin, (req, res) => {
  res.json({
    ...scraperStatus,
    schedulerActive: scraperTask !== null
  });
});

router.post('/run', authenticate, requireAdmin, async (req, res) => {
  try {
    scraperStatus.running = true;
    scraperStatus.lastRun = new Date().toISOString();
    scraperStatus.lastError = null;

    const stats = await scrapeAll();

    scraperStatus.lastStats = stats;
    scraperStatus.running = false;

    res.json({ success: true, stats });
  } catch (err) {
    scraperStatus.running = false;
    scraperStatus.lastError = err.message;
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/start', authenticate, requireAdmin, (req, res) => {
  if (scraperTask) {
    return res.json({ success: true, message: 'Scheduler already running' });
  }

  scraperTask = cron.schedule('* * * * *', async () => {
    console.log('[Scraper] Auto-run every minute...');
    scraperStatus.running = true;
    scraperStatus.lastRun = new Date().toISOString();
    try {
      const stats = await scrapeAll();
      scraperStatus.lastStats = stats;
      scraperStatus.lastError = null;
    } catch (err) {
      scraperStatus.lastError = err.message;
      console.error('[Scraper] Auto-run error:', err.message);
    } finally {
      scraperStatus.running = false;
    }
  });

  res.json({ success: true, message: 'Scheduler started — scraping every minute' });
});

router.post('/stop', authenticate, requireAdmin, (req, res) => {
  if (scraperTask) {
    scraperTask.stop();
    scraperTask = null;
  }
  res.json({ success: true, message: 'Scheduler stopped' });
});

module.exports = router;
