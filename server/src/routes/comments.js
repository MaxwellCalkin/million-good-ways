const express = require('express');
const { db } = require('../db');

const router = express.Router();

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

router.post('/:id/vote', (req, res) => {
  const id = Number(req.params.id);
  const direction = (req.body?.direction || '').toLowerCase();

  if (!['up', 'down'].includes(direction)) {
    res.status(400).json({ error: 'Vote direction must be "up" or "down".' });
    return;
  }

  const column = direction === 'up' ? 'upvotes' : 'downvotes';
  const update = db.prepare(
    `UPDATE comments SET ${column} = ${column} + 1 WHERE id = ?`
  );
  const result = update.run(id);

  if (result.changes === 0) {
    res.status(404).json({ error: 'Comment not found.' });
    return;
  }

  const updated = db.prepare('SELECT * FROM comments WHERE id = ?').get(id);
  res.json({ comment: formatCommentRow(updated) });
});

module.exports = router;
