import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { RocketIcon } from '@radix-ui/react-icons';
import { motion } from 'framer-motion';
import SearchBar from '../components/SearchBar.jsx';
import SortTabs from '../components/SortTabs.jsx';
import MoodFilter from '../components/MoodFilter.jsx';
import PostList from '../components/PostList.jsx';
import LoadingIndicator from '../components/LoadingIndicator.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import useDebounce from '../hooks/useDebounce.js';
import { fetchPosts, voteOnPost } from '../api.js';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [meta, setMeta] = useState({ count: 0 });
  const [sort, setSort] = useState('hot');
  const [search, setSearch] = useState('');
  const [mood, setMood] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const debouncedSearch = useDebounce(search, 450);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPosts({ sort, search: debouncedSearch, mood });
      setPosts(data.posts || []);
      setMeta(data.meta || { count: data.posts?.length || 0 });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [sort, debouncedSearch, mood]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const featuredPost = useMemo(() => posts[0], [posts]);

  const handleVote = async (postId, direction) => {
    try {
      const { post } = await voteOnPost(postId, direction);
      setPosts((previous) => previous.map((item) => (item.id === post.id ? post : item)));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="home-page">
      <section className="app-hero">
        <div className="hero-content">
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            Imagine a million benevolent futures.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            Million Good Ways is a living gallery where every post rehearses a joyful partnership with super intelligence.
            Craft poems, illustrations, soundscapes, or speculative dispatches that train our collective imagination toward
            flourishing.
          </motion.p>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Link to="/create" className="hero-primary">
              Share a Vision
            </Link>
            <a
              href="https://aisafety.world/"
              target="_blank"
              rel="noreferrer"
              className="hero-secondary"
            >
              Explore ASI optimism
            </a>
          </motion.div>
          <motion.div className="hero-stats" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <span>
              <strong>{meta.count}</strong> luminous stories
            </span>
            <span>Sorted by {sort}</span>
            <span>
              <RocketIcon /> Inspiring alignment through art
            </span>
          </motion.div>
        </div>
        {featuredPost ? (
          <motion.div className="hero-feature surface-soft" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
            <p className="hero-feature-label">Spotlight</p>
            <Link to={`/posts/${featuredPost.id}`}>
              <h3>{featuredPost.title}</h3>
              <p>{featuredPost.summary || featuredPost.author}</p>
            </Link>
          </motion.div>
        ) : null}
      </section>

      <section className="feed-controls">
        <div className="controls-left">
          <SearchBar value={search} onChange={setSearch} />
          <MoodFilter value={mood} onChange={setMood} />
        </div>
        <SortTabs value={sort} onChange={setSort} />
      </section>

      {error && <ErrorBanner message={error} onRetry={loadPosts} />}

      {loading ? <LoadingIndicator /> : <PostList posts={posts} onVote={handleVote} />}
    </div>
  );
};

export default Home;
