const axios = require('axios');
const cheerio = require('cheerio');
const Article = require('../models/Article');

const CATEGORY_MAP = {
  'Politiki': 'Politics', 'Politics': 'Politics', 'Politik': 'Politics',
  'Politische': 'Politics', 'Political': 'Politics',
  'Ubukungu': 'Business', 'Business': 'Business', 'Wirtschaft': 'Business',
  'Finance': 'Business', 'Economy': 'Business', 'Markets': 'Business',
  'Imikino': 'Sports', 'Sports': 'Sports', 'Sport': 'Sports',
  'Imyidagaduro': 'Entertainment', 'Entertainment': 'Entertainment',
  'Kultur': 'Entertainment', 'Panorama': 'Entertainment', 'Culture': 'Entertainment',
  'Arts': 'Entertainment', 'Music': 'Entertainment',
  'Ikoranabuhanga': 'Technology', 'Technology': 'Technology', 'Tech': 'Technology',
  'Technologie': 'Technology', 'Science': 'Technology',
  'Ubuzima': 'Health', 'Health': 'Health', 'Gesundheit': 'Health',
  'Wellness': 'Health', 'Medical': 'Health',
  'Amakuru': 'World', 'World': 'World', 'International': 'World',
  'Africa': 'World', 'Amerika': 'World', 'Uburayi': 'World', 'Aziya': 'World',
  'Mpuzamahanga': 'World', 'Inland': 'World', 'Ausland': 'World',
  'Global': 'World', 'Europe': 'World', 'Asia': 'World', 'US': 'World',
  'UK': 'World', 'ibidukikije': 'World', 'Environment': 'World',
  'Ubukerarugendo': 'World', 'Tourism': 'World', 'Diaspora': 'World',
  'Abantu': 'World', 'Fashion': 'World', 'Imyubakire': 'World', 'Umuco': 'World',
  'Uburezi': 'Technology',
};

const IGIHE_CATEGORY_URLS = [
  { slug: 'politiki', name: 'Politics' },
  { slug: 'ubukungu', name: 'Business' },
  { slug: 'imikino', name: 'Sports' },
  { slug: 'imyidagaduro', name: 'Entertainment' },
  { slug: 'ikoranabuhanga', name: 'Technology' },
  { slug: 'ubuzima', name: 'Health' },
  { slug: 'amakuru', name: 'World' },
  { slug: 'diaspora', name: 'World' },
  { slug: 'ubukerarugendo', name: 'World' },
  { slug: 'ibidukikije', name: 'World' },
  { slug: 'abantu', name: 'World' },
  { slug: 'fashion', name: 'World' },
  { slug: 'imyubakire', name: 'World' },
  { slug: 'umuco', name: 'World' },
];

function mapCategory(rawCategory) {
  if (!rawCategory) return 'World';
  const trimmed = rawCategory.trim();
  if (CATEGORY_MAP[trimmed]) return CATEGORY_MAP[trimmed];
  const match = Object.entries(CATEGORY_MAP).find(([key]) =>
    trimmed.toLowerCase().includes(key.toLowerCase())
  );
  return match ? match[1] : trimmed;
}

function makeSlug(title) {
  return title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80) + '-' + Date.now().toString(36);
}

async function fetchWithRetry(url, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await axios.get(url, {
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });
      return res.data;
    } catch (err) {
      if (i === retries) throw err;
    }
  }
}

async function fetchIgiheArticleDetail(link) {
  try {
    const html = await fetchWithRetry(link);
    const $ = cheerio.load(html);

    const fullTextEl = $('.fulltext');
    let fullContent = '';
    if (fullTextEl.length) {
      fullTextEl.find('script, .article-banner-section, .commentaire-section, .izindi-section, .featured-section').remove();
      fullContent = fullTextEl.text().trim();
    }

    if (!fullContent || fullContent.length < 100) {
      fullContent = $('.text-article').text().trim();
    }

    const author = $('.vcard.author').first().text().trim() || '';

    const dateText = $('.date_x').first().text().trim();
    let publishedAt = null;
    if (dateText) {
      const dateMatch = dateText.match(/(\d{1,2}\s+\w+\s+\d{4})/);
      if (dateMatch) publishedAt = new Date(dateMatch[1]);
    }

    const ogImage = $('meta[property="og:image"]').attr('content') || '';

    return { content: fullContent, author, publishedAt, ogImage };
  } catch (err) {
    return null;
  }
}

async function parseIgiheListing(html, baseCategory) {
  const $ = cheerio.load(html);
  const articles = [];

  $('.article-wrap').each((i, el) => {
    const $el = $(el);
    const titleEl = $el.find('.homenews-title a, .homenews-title2 a').first();
    const title = titleEl.text().trim();
    let href = titleEl.attr('href') || '';

    if (!title || title.length < 15) return;

    const link = href.startsWith('http') ? href : 'https://igihe.com/' + href;

    const rawCategory = $el.find('.hierarchi-rubrique a').first().text().trim() || baseCategory || 'World';
    const category = mapCategory(rawCategory);

    const imgEl = $el.find('img.lazy').first();
    const image = imgEl.attr('data-original') || imgEl.attr('src') || '';
    const fullImage = image.startsWith('http') ? image : (image ? 'https://igihe.com/' + image : '');

    articles.push({ title, link, category, image: fullImage, excerpt: title, source: 'igihe' });
  });

  return articles;
}

async function scrapeIgiheCategory(catConfig, maxPages = 2) {
  const allArticles = [];
  const seenLinks = new Set();

  for (let page = 0; page < maxPages; page++) {
    const offset = page * 15;
    const url = offset === 0
      ? `https://igihe.com/${catConfig.slug}/`
      : `https://igihe.com/${catConfig.slug}?debut_gh_news=${offset}#pagination_gh_news`;

    try {
      const html = await fetchWithRetry(url);
      const articles = await parseIgiheListing(html, catConfig.name);

      let added = 0;
      for (const a of articles) {
        if (!seenLinks.has(a.link)) {
          seenLinks.add(a.link);
          allArticles.push(a);
          added++;
        }
      }

      if (articles.length < 15) break;
    } catch (err) {
      break;
    }
  }

  return allArticles;
}

async function parseIgihe() {
  console.log('[Igihe] Scraping all categories in parallel...');

  const results = await Promise.allSettled(
    IGIHE_CATEGORY_URLS.map(cat => scrapeIgiheCategory(cat, 2))
  );

  let allArticles = [];
  for (const r of results) {
    if (r.status === 'fulfilled') allArticles = allArticles.concat(r.value);
  }

  console.log(`[Igihe] ${allArticles.length} articles from listings`);

  const existingLinks = new Set(
    (await Article.find({ source: 'igihe' }).select('link').lean()).map(a => a.link)
  );

  const newArticles = allArticles.filter(a => !existingLinks.has(a.link));
  console.log(`[Igihe] ${newArticles.length} new articles (${allArticles.length - newArticles.length} already in DB)`);

  if (newArticles.length === 0) return allArticles;

  console.log(`[Igihe] Fetching full content for ${newArticles.length} new articles (concurrency: 20)...`);

  const enriched = [];
  for (let i = 0; i < newArticles.length; i += 20) {
    const batch = newArticles.slice(i, i + 20);
    const details = await Promise.allSettled(
      batch.map(a => fetchIgiheArticleDetail(a.link))
    );

    for (let j = 0; j < batch.length; j++) {
      const article = batch[j];
      const detail = details[j].status === 'fulfilled' ? details[j].value : null;
      enriched.push({
        ...article,
        content: detail?.content?.length > 100 ? detail.content : (article.excerpt + '\n\n[Full article on igihe.com]'),
        author: detail?.author || 'IGIHE',
        publishedAt: detail?.publishedAt || new Date(),
        image: detail?.ogImage || article.image,
      });
    }
  }

  console.log(`[Igihe] ${enriched.length} articles ready`);
  return enriched;
}

async function fetchBBCArticleDetail(link) {
  try {
    const html = await fetchWithRetry(link);
    const $ = cheerio.load(html);

    const articleBody = $('article [data-component="text-block"], article p, .story-body__inner p, .ssrcss-1q0x1qg-Paragraph, main p');
    let fullContent = '';
    articleBody.each((i, el) => {
      const text = $(el).text().trim();
      if (text) fullContent += text + '\n\n';
    });

    if (!fullContent || fullContent.length < 100) fullContent = $('main').text().trim();

    const ogImage = $('meta[property="og:image"]').attr('content') || '';
    return { content: fullContent, ogImage };
  } catch (err) {
    return null;
  }
}

async function parseBBC() {
  console.log('[BBC] Fetching RSS feed...');

  try {
    const xml = await fetchWithRetry('https://feeds.bbci.co.uk/news/rss.xml');
    const $ = cheerio.load(xml, { xmlMode: true });

    const items = [];
    $('item').each((i, el) => {
      const $el = $(el);
      const title = $el.find('title').text().trim();
      const link = $el.find('link').text().trim();
      const description = $el.find('description').text().trim();

      if (!title || title.length < 15) return;

      const thumbnail = $el.find('media\\:thumbnail').first();
      const image = thumbnail.attr('url') || '';

      const rawCategory = $el.find('category').first().text().trim() || 'World';
      const category = mapCategory(rawCategory);

      const fullContent = description.replace(/<[^>]*>/g, '').trim() || title;
      const pubDateStr = $el.find('pubDate').text().trim();

      items.push({
        title, link, category, image,
        excerpt: fullContent.slice(0, 300),
        content: fullContent,
        source: 'BBC',
        publishedAt: pubDateStr ? new Date(pubDateStr) : new Date(),
      });
    });

    console.log(`[BBC] ${items.length} articles from RSS`);

    const existingLinks = new Set(
      (await Article.find({ source: 'BBC' }).select('link').lean()).map(a => a.link)
    );

    const newItems = items.filter(a => !existingLinks.has(a.link));
    console.log(`[BBC] ${newItems.length} new articles (${items.length - newItems.length} already in DB)`);

    if (newItems.length > 0) {
      console.log(`[BBC] Fetching full content for ${newItems.length} articles (concurrency: 10)...`);

      for (let i = 0; i < newItems.length; i += 10) {
        const batch = newItems.slice(i, i + 10);
        const details = await Promise.allSettled(
          batch.map(a => fetchBBCArticleDetail(a.link))
        );

        for (let j = 0; j < batch.length; j++) {
          const detail = details[j].status === 'fulfilled' ? details[j].value : null;
          if (detail?.content?.length > 100) {
            batch[j].content = detail.content;
            if (detail.ogImage) batch[j].image = detail.ogImage;
          }
        }
      }

      items.forEach(item => {
        const found = newItems.find(n => n.link === item.link);
        if (found) Object.assign(item, found);
      });
    }

    return items;
  } catch (err) {
    console.error(`[BBC] Error: ${err.message}`);
    return [];
  }
}

async function saveArticles(articles, source) {
  let saved = 0;

  for (const article of articles) {
    try {
      const exists = await Article.findOne({ link: article.link });
      if (exists) continue;

      await Article.create({
        title: article.title,
        slug: makeSlug(article.title),
        excerpt: (article.excerpt || article.content || article.title).slice(0, 300),
        content: article.content ? article.content.slice(0, 10000) : (article.title + '\n\n[Auto-fetched from ' + source + ']'),
        category: article.category || 'World',
        author: 'THE NEWS',
        image: article.image || '',
        featured: false,
        breaking: false,
        publishedAt: article.publishedAt || new Date(),
        link: article.link,
        source: article.source || source.toLowerCase()
      });

      saved++;
    } catch (err) {
      if (err.code !== 11000) {
        console.error(`[Scraper] Error saving article: ${err.message}`);
      }
    }
  }

  return saved;
}

const sources = [
  { name: 'igihe', scraper: parseIgihe },
  { name: 'BBC', scraper: parseBBC },
];

async function scrapeAll() {
  const results = {};

  for (const source of sources) {
    console.log(`[Scraper] Fetching from ${source.name}...`);
    const startTime = Date.now();
    try {
      const articles = await source.scraper();
      const saved = await saveArticles(articles, source.name);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      results[source.name] = { found: articles.length, saved, time: elapsed + 's' };
      console.log(`[Scraper] ${source.name}: ${articles.length} found, ${saved} new (${elapsed}s)`);
    } catch (err) {
      console.error(`[Scraper] ${source.name} error: ${err.message}`);
      results[source.name] = { found: 0, saved: 0, error: err.message };
    }
  }

  return results;
}

async function scrapeSource(source) {
  if (source.name === 'igihe') return await parseIgihe();
  if (source.name === 'BBC') return await parseBBC();
  return [];
}

module.exports = { scrapeAll, scrapeSource, sources };
