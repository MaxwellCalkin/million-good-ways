import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import ColorPaletteEditor from '../components/ColorPaletteEditor.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import { createPost } from '../api.js';

const moodOptions = ['Uplifting', 'Dreamy', 'Celebratory', 'Curious', 'Serene'];

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    summary: '',
    content: '',
    mood: 'Uplifting',
    tags: '',
    mediaUrl: '',
    author: '',
  });
  const [palette, setPalette] = useState(['#f472b6', '#22d3ee', '#facc15']);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const previewHtml = useMemo(() => {
    const raw = marked.parse(form.content || '_Share your glowing vision in markdown._');
    return DOMPurify.sanitize(raw);
  }, [form.content]);

  const updateField = (field) => (event) => {
    const { value } = event.target;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...form,
        colorPalette: palette,
        tags: form.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      };
      const { post } = await createPost(payload);
      navigate(`/posts/${post.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-page">
      <motion.section className="create-intro surface-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1>Compose a benevolent future.</h1>
        <p>
          Describe a world where artificial super intelligence amplifies empathy, creativity, and collective flourishing. The
          more specific and sensory you are, the more vivid our rehearsal becomes. Markdown is supported.
        </p>
        <ul>
          <li>Focus on collaboration and uplift.</li>
          <li>Honor diversity, accessibility, and planetary care.</li>
          <li>Celebrate tangible actions or rituals that a thriving ASI inspires.</li>
        </ul>
      </motion.section>

      {error && <ErrorBanner message={error} />}

      <div className="create-grid">
        <form className="create-form surface-card" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={updateField('title')}
              required
              maxLength={140}
              placeholder="e.g. The Choir That Builds Cities of Care"
            />
          </div>
          <div className="form-row">
            <label htmlFor="summary">Summary</label>
            <textarea
              id="summary"
              value={form.summary}
              onChange={updateField('summary')}
              maxLength={280}
              rows={2}
              placeholder="A single-sentence invitation into your vision."
            />
          </div>
          <div className="form-row">
            <label htmlFor="content">Story</label>
            <textarea
              id="content"
              value={form.content}
              onChange={updateField('content')}
              rows={10}
              placeholder="Paint the scene. Who is there? What senses awaken? How does the ASI care for life?"
              required
            />
          </div>
          <div className="form-row-inline">
            <div>
              <label htmlFor="author">Your name</label>
              <input
                id="author"
                type="text"
                value={form.author}
                onChange={updateField('author')}
                placeholder="Optional signature"
                maxLength={80}
              />
            </div>
            <div>
              <label htmlFor="mood">Mood</label>
              <select id="mood" value={form.mood} onChange={updateField('mood')}>
                {moodOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <label htmlFor="mediaUrl">Media URL</label>
            <input
              id="mediaUrl"
              type="url"
              value={form.mediaUrl}
              onChange={updateField('mediaUrl')}
              placeholder="https://... (optional image or video)"
            />
          </div>
          <div className="form-row">
            <label htmlFor="tags">Themes</label>
            <input
              id="tags"
              type="text"
              value={form.tags}
              onChange={updateField('tags')}
              placeholder="community, dawn rituals, ocean care"
            />
            <small>Separate themes with commas. We suggest 3–5 resonant words.</small>
          </div>
          <div className="form-row">
            <label>Color palette</label>
            <ColorPaletteEditor palette={palette} onChange={setPalette} />
          </div>
          <button type="submit" className="primary" disabled={submitting}>
            {submitting ? 'Publishing…' : 'Publish vision'}
          </button>
        </form>

        <aside className="create-preview surface-card">
          <header>
            <h2>Live preview</h2>
            <p>Your words appear exactly as future readers will experience them.</p>
          </header>
          <article className="preview-content" dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </aside>
      </div>
    </div>
  );
};

export default CreatePost;
