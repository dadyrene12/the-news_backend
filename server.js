require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const articlesRouter = require('./routes/articles');
const authRouter = require('./routes/auth');
const commentsRouter = require('./routes/comments');
const uploadRouter = require('./routes/upload');
const categoriesRouter = require('./routes/categories');
const advertisementsRouter = require('./routes/advertisements');
const scraperRouter = require('./routes/scraper');
const subscriptionsRouter = require('./routes/subscriptions');
const usersRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'https://the-news-250.andasy.dev'
}));
app.use(express.json());

app.use('/api/articles', articlesRouter);
app.use('/api/auth', authRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/advertisements', advertisementsRouter);
app.use('/api/scraper', scraperRouter);
app.use('/api/subscriptions', subscriptionsRouter);
app.use('/api/users', usersRouter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/images', express.static(path.join(__dirname, '..', 'frontend', 'public', 'images')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
