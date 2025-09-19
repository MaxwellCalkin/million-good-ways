const express = require('express');
const dayjs = require('dayjs');
const { db } = require('../db');
const { renderMarkdown } = require('../utils/markdown');
const {
  sanitizeText,
  sanitizeMarkdown,
  validatePostPayload,
  validateCommentPayload,
} = require('../utils/validation');
const { calculateHotScore } = require('../utils/hotScore');

const router = express.Router();

const parseJsonArray = (value) => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const toJsonOrNull = (value) => {
  if (!value || !value.length) return null;
  return JSON.stringify(value);
};

const formatPostRow = (row) => ({
  id: row.id,
  title: row.title,
  summary: row.summary || '',
  contentMarkdown: row.content_markdown || '',
  contentHtml: renderMarkdown(row.content_markdown || ''),
  author: row.author || 'Anonymous Dreamer',
  mediaUrl: row.media_url || '',
  colorPalette: parseJsonArray(row.color_palette),
  mood: row.mood || '',
  tags: parseJsonArray(row.tags),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  upvotes: row.upvotes,
  downvotes: row.downvotes,
  score: row.upvotes - row.downvotes,
  commentCount: row.comment_count ?? 0,
  hotScore: calculateHotScore(row.created_at, row.upvotes - row.downvotes),
});

const formatCommentRow = (row) => ({
  id: row.id,
  postId: row.post_id,
  author: row.author || 'Appreciative Visitor',
  content: row.content,
  createdAt: row.created_at,
  upvotes: row.upvotes,
  downvotes: row.downvotes,
  score: row.upvotes - row.downvotes,
});

router.get('/', (req, res) => {
  const sort = (req.query.sort || 'hot').toLowerCase();
  const searchTerm = req.query.search ? `%${req.query.search.trim()}%` : null;
  const moodFilter = req.query.mood ? `%${req.query.mood.trim()}%` : null;

  let query =
    'SELECT posts.*, (posts.upvotes - posts.downvotes) AS score, (SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.id) AS comment_count FROM posts';

  const params = [];
  const whereClauses = [];

  if (searchTerm) {
    whereClauses.push(
      '(title LIKE ? OR summary LIKE ? OR content_markdown LIKE ?)'
    );
    params.push(searchTerm, searchTerm, searchTerm);
  }

  if (moodFilter) {
    whereClauses.push('mood LIKE ?');
    params.push(moodFilter);
  }

  if (whereClauses.length) {
    query += ` WHERE ${whereClauses.join(' AND ')}`;
  }

  query += ' ORDER BY created_at DESC LIMIT 100';

  const statement = db.prepare(query);
  const rows = statement.all(...params);

  let posts = rows.map(formatPostRow);

  if (sort === 'new') {
    posts = posts.sort(
      (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
    );
  } else if (sort === 'top') {
    posts = posts.sort((a, b) => {
      if (b.score === a.score) {
        return dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf();
      }
      return b.score - a.score;
    });
  } else {
    posts = posts.sort((a, b) => b.hotScore - a.hotScore);
  }

  res.json({
    posts,
    meta: {
      count: posts.length,
    },
  });
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const postStatement = db.prepare(
    `SELECT posts.*, (posts.upvotes - posts.downvotes) AS score, (SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.id) AS comment_count FROM posts WHERE id = ?`
  );

  const postRow = postStatement.get(id);
  if (!postRow) {
    res.status(404).json({ error: 'Post not found.' });
    return;
  }

  const commentsStatement = db.prepare(
    'SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC'
  );

  const comments = commentsStatement.all(id).map(formatCommentRow);

  res.json({
    post: formatPostRow(postRow),
    comments,
  });
});

router.post('/', (req, res) => {
  const payload = req.body || {};
  const errors = validatePostPayload(payload);
  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }

  const title = sanitizeText(payload.title, 140);
  const summary = sanitizeText(payload.summary, 280);
  const contentMarkdown = sanitizeMarkdown(payload.content, 10000);
  const author = sanitizeText(payload.author, 80) || 'Anonymous Dreamer';
  const mood = sanitizeText(payload.mood, 80);
  const mediaUrl =
    payload.mediaUrl && payload.mediaUrl.trim()
      ? payload.mediaUrl.trim()
      : null;

  const colorPalette = Array.isArray(payload.colorPalette)
    ? payload.colorPalette
        .map((color) => sanitizeText(color, 20))
        .filter(Boolean)
        .slice(0, 6)
    : [];

  const tags = Array.isArray(payload.tags)
    ? payload.tags
        .map((tag) => sanitizeText(tag, 30))
        .filter(Boolean)
        .slice(0, 8)
    : [];

  const insert = db.prepare(
    `INSERT INTO posts (title, summary, content_markdown, author, media_url, color_palette, mood, tags)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const result = insert.run(
    title,
    summary,
    contentMarkdown,
    author,
    mediaUrl,
    toJsonOrNull(colorPalette),
    mood,
    toJsonOrNull(tags)
  );

  const created = db
    .prepare(
      `SELECT posts.*, (posts.upvotes - posts.downvotes) AS score, (SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.id) AS comment_count FROM posts WHERE id = ?`
    )
    .get(result.lastInsertRowid);

  res.status(201).json({ post: formatPostRow(created) });
});

router.post('/:id/vote', (req, res) => {
  const id = Number(req.params.id);
  const direction = (req.body?.direction || '').toLowerCase();

  if (!['up', 'down'].includes(direction)) {
    res.status(400).json({ error: 'Vote direction must be "up" or "down".' });
    return;
  }

  const column = direction === 'up' ? 'upvotes' : 'downvotes';
  const update = db.prepare(
    `UPDATE posts SET ${column} = ${column} + 1 WHERE id = ?`
  );
  const result = update.run(id);
  if (result.changes === 0) {
    res.status(404).json({ error: 'Post not found.' });
    return;
  }

  const updated = db
    .prepare(
      `SELECT posts.*, (posts.upvotes - posts.downvotes) AS score, (SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.id) AS comment_count FROM posts WHERE id = ?`
    )
    .get(id);

  res.json({ post: formatPostRow(updated) });
});

router.post('/:id/comments', (req, res) => {
  const id = Number(req.params.id);
  const payload = req.body || {};
  const errors = validateCommentPayload(payload);
  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }

  const exists = db.prepare('SELECT id FROM posts WHERE id = ?').get(id);
  if (!exists) {
    res.status(404).json({ error: 'Post not found.' });
    return;
  }

  const author = sanitizeText(payload.author, 80) || 'Appreciative Visitor';
  const content = sanitizeMarkdown(payload.content, 2000);

  const insert = db.prepare(
    'INSERT INTO comments (post_id, author, content) VALUES (?, ?, ?)'
  );
  const result = insert.run(id, author, content);

  const created = db
    .prepare('SELECT * FROM comments WHERE id = ?')
    .get(result.lastInsertRowid);

  res.status(201).json({ comment: formatCommentRow(created) });
});

module.exports = router;
