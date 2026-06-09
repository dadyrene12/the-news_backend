const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { category, featured, breaking } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured) filter.featured = featured === 'true';
    if (breaking) filter.breaking = breaking === 'true';

    const articles = await Article.find(filter)
      .sort({ publishedAt: -1 })
      .limit(parseInt(req.query.limit) || 20);
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/featured', async (req, res) => {
  try {
    let articles = await Article.find({ featured: true })
      .sort({ publishedAt: -1 })
      .limit(15);
    if (articles.length < 12) {
      const featuredIds = articles.map(a => a._id);
      const recent = await Article.find({ _id: { $nin: featuredIds } })
        .sort({ publishedAt: -1 })
        .limit(15 - articles.length);
      articles = [...articles, ...recent];
    }
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/breaking', async (req, res) => {
  try {
    const articles = await Article.find({ breaking: true })
      .sort({ publishedAt: -1 })
      .limit(6);
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await Article.distinct('category');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/by-source', async (req, res) => {
  try {
    const articles = await Article.find({ source: { $ne: 'manual' } })
      .sort({ publishedAt: -1 })
      .limit(200);
    const grouped = { igihe: [], BBC: [] };
    articles.forEach(a => {
      if (a.source === 'igihe') grouped.igihe.push(a);
      else if (a.source === 'BBC') grouped.BBC.push(a);
    });
    res.json(grouped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/latest/summary', async (req, res) => {
  try {
    const [total, byCategory, bySource] = await Promise.all([
      Article.countDocuments(),
      Article.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 20 }
      ]),
      Article.aggregate([
        { $group: { _id: { $ifNull: ['$source', 'manual'] }, count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);
    res.json({ total, byCategory, bySource });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const article = new Article(req.body);
    const saved = await article.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json({ message: 'Article deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/bulk-delete', authenticate, requireAdmin, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No IDs provided' });
    }
    const result = await Article.deleteMany({ _id: { $in: ids } });
    res.json({ message: `${result.deletedCount} article(s) deleted` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
