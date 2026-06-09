const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const existing = await Subscription.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (!existing.active) {
        existing.active = true;
        await existing.save();
      }
      return res.json({ message: 'Subscription already exists', subscribed: true });
    }

    await Subscription.create({ email });
    res.status(201).json({ message: 'Subscribed successfully', subscribed: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { search, active } = req.query;
    const filter = {};
    if (active !== undefined) filter.active = active === 'true';
    if (search) filter.email = { $regex: search, $options: 'i' };

    const subscribers = await Subscription.find(filter).sort({ subscribedAt: -1 });
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/count', authenticate, requireAdmin, async (req, res) => {
  try {
    const total = await Subscription.countDocuments();
    const active = await Subscription.countDocuments({ active: true });
    res.json({ total, active });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const sub = await Subscription.findByIdAndUpdate(
      req.params.id,
      { active: req.body.active },
      { new: true }
    );
    if (!sub) return res.status(404).json({ message: 'Subscription not found' });
    res.json(sub);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const sub = await Subscription.findByIdAndDelete(req.params.id);
    if (!sub) return res.status(404).json({ message: 'Subscription not found' });
    res.json({ message: 'Subscription deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
