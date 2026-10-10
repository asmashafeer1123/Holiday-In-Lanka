/**
 * Holiday in Lanka - Express server
 *
 * Serves the website from /public and provides a small JSON API:
 *   GET  /api/destinations  -> destination and season data (used by the "Best time to visit" widget)
 *   POST /api/itinerary     -> builds a monsoon-aware, day-by-day itinerary
 *   POST /api/newsletter    -> stores a newsletter signup
 */

const path = require('path');
const fs = require('fs');
const express = require('express');

const { DESTINATIONS, INTERESTS } = require('./data/destinations');
const { validate, generateItinerary } = require('./lib/itinerary');

const app = express();
const PORT = process.env.PORT || 3000;
const SUBSCRIBERS_FILE = path.join(__dirname, 'data', 'subscribers.json');

app.disable('x-powered-by');
app.use(express.json({ limit: '20kb' }));

// Static files (HTML, CSS, JS, images, videos). Images and videos are cached for a week.
app.use(
  express.static(path.join(__dirname, 'public'), {
    setHeaders(res, filePath) {
      if (/\.(webp|jpg|jpeg|png|avif|mp4|webm|svg)$/i.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=604800');
      }
    }
  })
);

app.get('/api/destinations', (req, res) => {
  res.json({
    interests: INTERESTS,
    destinations: DESTINATIONS.map(({ id, name, region, best, wet, hidden, summary, interests }) => ({
      id, name, region, best, wet, hidden, summary, interests
    }))
  });
});

app.post('/api/itinerary', (req, res) => {
  const { errors, input } = validate(req.body);
  if (errors.length) {
    return res.status(400).json({ errors });
  }
  return res.json(generateItinerary(input));
});

app.post('/api/newsletter', (req, res) => {
  const email = String((req.body && req.body.email) || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return res.status(400).json({ errors: ['Please enter a valid email address.'] });
  }

  // Simple file storage for the prototype. Replace with a database or mailing service later.
  let subscribers = [];
  try {
    subscribers = JSON.parse(fs.readFileSync(SUBSCRIBERS_FILE, 'utf8'));
  } catch (err) {
    subscribers = [];
  }
  if (!subscribers.includes(email)) {
    subscribers.push(email);
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
  }
  return res.json({ message: 'Thank you. You are now subscribed to Sri Lanka travel tips.' });
});

// Unknown API routes return JSON, missing files (e.g. images not added yet) return a plain 404,
// and any other unknown page falls back to the home page.
app.use('/api', (req, res) => res.status(404).json({ errors: ['Not found'] }));
app.use((req, res) => {
  if (path.extname(req.path)) return res.status(404).send('Not found');
  return res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Holiday in Lanka is running at http://localhost:${PORT}`);
  });
}

module.exports = app;
