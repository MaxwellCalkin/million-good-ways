import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChatBubbleIcon,
  ClockIcon,
  ReaderIcon,
} from '@radix-ui/react-icons';
import PaletteSwatch from '../components/PaletteSwatch.jsx';
import LoadingIndicator from '../components/LoadingIndicator.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import { formatDateTime, formatRelativeTime, splitTags } from '../utils/format.js';
import {
  createComment,
  fetchPostById,
  voteOnComment,
  voteOnPost,
} from '../api.js';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadPost = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPostById(id);
      setPost(data.post);
      setComments(data.comments || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const handleVote = async (direction) => {
    if (!post) return;
    try {
      const { post: updated } = await voteOnPost(post.id, direction);
      setPost(updated);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCommentVote = async (commentId, direction) => {
    try {
      const { comment } = await voteOnComment(commentId, direction);
      setComments((prev) => prev.map((item) => (item.id === commentId ? comment : item)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmitComment = async (event) => {
    event.preventDefault();
    if (!commentContent.trim()) return;
    setSubmitting(true);
    try {
      const { comment } = await createComment(post.id, {
        author: commentAuthor,
        content: commentContent,
      });
      setComments((prev) => [...prev, comment]);
      setCommentAuthor('');
      setCommentContent('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorBanner message={error} onRetry={loadPost} />;
  }

  if (!post) {
    return <ErrorBanner message="We could not find that vision." onRetry={() => window.history.back()} />;
  }

  return (
    <div className="post-detail">
      <motion.section className="post-detail-hero surface-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
        <div className="post-detail-header">
          <div>
            <span className="mood-chip large">{post.mood || 'Imaginative'}</span>
            <h1>{post.title}</h1>
            <div className="post-detail-meta">
              <span>By {post.author}</span>
              <span>
                <ClockIcon /> {formatRelativeTime(post.createdAt)}
              </span>
              <span>
                <ReaderIcon /> {formatDateTime(post.createdAt)}
              </span>
            </div>
          </div>
          {post.mediaUrl ? (
            <div className="post-detail-image">
              <img src={post.mediaUrl} alt="Artwork" loading="lazy" />
            </div>
          ) : null}
        </div>
        <PaletteSwatch colors={post.colorPalette} />
        {post.tags?.length ? (
          <div className="post-tags">
            {splitTags(post.tags).map((tag) => (
              <span key={tag} className="tag-pill">
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
        <div className="detail-actions">
          <div className="vote-group" role="group" aria-label="Vote on this artwork">
            <button type="button" className="vote-button" onClick={() => handleVote('up')}>
              <ArrowUpIcon />
            </button>
            <span className="vote-score">{post.score}</span>
            <button type="button" className="vote-button" onClick={() => handleVote('down')}>
              <ArrowDownIcon />
            </button>
          </div>
          <Link to="/" className="back-link">
            ← Back to Aurora Feed
          </Link>
        </div>
      </motion.section>

      <section className="comments-section">
        <header>
          <h2>
            <ChatBubbleIcon /> {comments.length} Reflections
          </h2>
        </header>
        <form className="comment-form surface-soft" onSubmit={handleSubmitComment}>
          <div className="comment-fields">
            <div>
              <label htmlFor="comment-author">Display name</label>
              <input
                id="comment-author"
                type="text"
                value={commentAuthor}
                onChange={(event) => setCommentAuthor(event.target.value)}
                placeholder="Anonymous Dreamer"
              />
            </div>
            <div>
              <label htmlFor="comment-content">Reflection</label>
              <textarea
                id="comment-content"
                value={commentContent}
                onChange={(event) => setCommentContent(event.target.value)}
                placeholder="Share how this artwork lands in your imagination..."
                rows={4}
                required
              />
            </div>
          </div>
          <button type="submit" className="primary" disabled={submitting}>
            {submitting ? 'Sending...' : 'Send reflection'}
          </button>
        </form>

        <div className="comments-list">
          {comments.map((comment) => (
            <motion.article key={comment.id} className="comment-card surface-soft" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div className="comment-top">
                <span className="comment-author">{comment.author}</span>
                <span className="comment-meta">{formatRelativeTime(comment.createdAt)}</span>
              </div>
              <p className="comment-content">{comment.content}</p>
              <div className="comment-actions">
                <button
                  type="button"
                  className="vote-button"
                  onClick={() => handleCommentVote(comment.id, 'up')}
                >
                  <ArrowUpIcon />
                </button>
                <span className="vote-score">{comment.score}</span>
                <button
                  type="button"
                  className="vote-button"
                  onClick={() => handleCommentVote(comment.id, 'down')}
                >
                  <ArrowDownIcon />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PostDetail;
