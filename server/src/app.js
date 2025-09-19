const path = require('path');
const fs = require('fs');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');

const app = express();

const allowedOrigins = new Set(
  (process.env.CLIENT_ORIGINS || 'http://localhost:5173,http://localhost:4173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
);

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.has(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Origin not allowed by CORS'));
      }
    },
  })
);

app.use(express.json({ limit: '4mb' }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/posts', postsRouter);
app.use('/api/comments', commentsRouter);

app.use((err, req, res, _next) => {
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ error: 'Request body must be valid JSON.' });
    return;
  }

  if (err.message && err.message.includes('Origin not allowed')) {
    res.status(403).json({ error: 'The requesting origin is not permitted.' });
    return;
  }

  console.error(err);
  res.status(500).json({ error: 'An unexpected error occurred.' });
});

if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.join(__dirname, '..', '..', 'client', 'dist');
  if (fs.existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    });
  }
}

module.exports = app;
