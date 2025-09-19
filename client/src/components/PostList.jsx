import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';
import PostCard from './PostCard.jsx';

const PostList = ({ posts, onVote }) => {
  if (!posts.length) {
    return (
      <div className="empty-state surface-soft">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <h3>No visions yet.</h3>
          <p>Be the first to map a compassionate future with our community.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <div className="post-grid">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onVote={onVote} />
        ))}
      </div>
    </AnimatePresence>
  );
};

PostList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  onVote: PropTypes.func,
};

export default PostList;
