import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpIcon, ArrowDownIcon, ChatBubbleIcon, MagicWandIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';
import PaletteSwatch from './PaletteSwatch.jsx';
import { formatRelativeTime, splitTags } from '../utils/format.js';

const PostCard = ({ post, onVote }) => {
  const hasImage = Boolean(post.mediaUrl);

  const handleVote = async (direction) => {
    if (!onVote) return;
    await onVote(post.id, direction);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, translateY: 18 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={clsx('post-card', 'surface-card', hasImage ? 'post-card-media' : '')}
    >
      {hasImage && (
        <Link to={`/posts/${post.id}`} className="post-card-cover" aria-label={`View ${post.title}`}>
          <img src={post.mediaUrl} alt="Artwork preview" loading="lazy" />
        </Link>
      )}
      <div className="post-card-body">
        <div className="post-card-topline">
          <span className="mood-chip">
            <MagicWandIcon width={16} height={16} />
            {post.mood || 'Wonder'}
          </span>
          <span className="post-meta">{formatRelativeTime(post.createdAt)}</span>
        </div>
        <Link to={`/posts/${post.id}`} className="post-title">
          {post.title}
        </Link>
        {post.summary && <p className="post-summary">{post.summary}</p>}
        <div className="post-author">
          <span>By {post.author}</span>
        </div>
        <PaletteSwatch colors={post.colorPalette} />
        {post.tags?.length ? (
          <div className="post-tags">
            {splitTags(post.tags).map((tag) => (
              <span className="tag-pill" key={tag}>
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
        <div className="post-card-footer">
          <div className="vote-group" role="group" aria-label="Vote on this artwork">
            <button
              type="button"
              className="vote-button"
              onClick={() => handleVote('up')}
              aria-label="Applaud this vision"
            >
              <ArrowUpIcon />
            </button>
            <span className="vote-score">{post.score}</span>
            <button
              type="button"
              className="vote-button"
              onClick={() => handleVote('down')}
              aria-label="Suggest revision"
            >
              <ArrowDownIcon />
            </button>
          </div>
          <Link to={`/posts/${post.id}`} className="comments-chip">
            <ChatBubbleIcon />
            <span>{post.commentCount} reflections</span>
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    summary: PropTypes.string,
    author: PropTypes.string,
    mood: PropTypes.string,
    mediaUrl: PropTypes.string,
    colorPalette: PropTypes.arrayOf(PropTypes.string),
    tags: PropTypes.arrayOf(PropTypes.string),
    score: PropTypes.number,
    commentCount: PropTypes.number,
    createdAt: PropTypes.string,
  }).isRequired,
  onVote: PropTypes.func,
};

export default PostCard;
