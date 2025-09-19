const path = require('path');
const fs = require('fs');

const TEST_DB = path.join(__dirname, 'test.db');

if (fs.existsSync(TEST_DB)) {
  fs.unlinkSync(TEST_DB);
}

process.env.DATABASE_FILE = TEST_DB;
process.env.NODE_ENV = 'test';

jest.mock('marked', () => ({
  marked: {
    parse: (markdown = '') => {
      if (markdown.startsWith('### ')) {
        const [heading, ...rest] = markdown.split('\n');
        const body = rest.join('\n');
        return `<h3>${heading.slice(4)}</h3><p>${body}</p>`;
      }
      return `<p>${markdown}</p>`;
    },
    setOptions: () => {},
  },
}));

const request = require('supertest');
const app = require('../src/app');
const { db } = require('../src/db');

describe('Million Good Ways API', () => {
  beforeEach(() => {
    db.prepare('DELETE FROM comments').run();
    db.prepare('DELETE FROM posts').run();
  });

  afterAll(() => {
    db.close();
    if (fs.existsSync(TEST_DB)) {
      fs.unlinkSync(TEST_DB);
    }
  });

  const createPostViaApi = async (override = {}) => {
    const payload = {
      title: 'Test Beacon',
      summary: 'A signal from the future that everything turns out beautifully.',
      content: '## Vision\n\nWe painted tomorrow together.',
      author: 'Test Author',
      mood: 'Curious',
      colorPalette: ['#111111', '#eeeeee'],
      tags: ['test'],
      mediaUrl: 'https://example.com/art.jpg',
      ...override,
    };

    const response = await request(app).post('/api/posts').send(payload);
    return response.body.post;
  };

  test('returns API health status', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  test('creates a post and returns it in the feed', async () => {
    const createResponse = await request(app).post('/api/posts').send({
      title: 'Harmony Garden',
      summary: 'Neighbors and ASI weaving kindness into edible light.',
      content: '### Garden Notes\n\n- glowing fruit\n- singing soil',
      author: 'Lumen',
      mood: 'Joyful',
      colorPalette: ['#ffdd00', '#ff6f91'],
      tags: ['garden', 'light'],
    });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.post.title).toBe('Harmony Garden');
    expect(createResponse.body.post.contentHtml).toContain('<h3>');

    const listResponse = await request(app).get('/api/posts');
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.posts).toHaveLength(1);
    expect(listResponse.body.posts[0].title).toBe('Harmony Garden');
  });

  test('allows voting on a post', async () => {
    const post = await createPostViaApi();

    const voteResponse = await request(app)
      .post(`/api/posts/${post.id}/vote`)
      .send({ direction: 'up' });

    expect(voteResponse.status).toBe(200);
    expect(voteResponse.body.post.upvotes).toBe(post.upvotes + 1);
  });

  test('creates comments that appear in the post detail', async () => {
    const post = await createPostViaApi();

    const commentResponse = await request(app)
      .post(`/api/posts/${post.id}/comments`)
      .send({
        author: 'Muse',
        content: 'I can hear the melody you described. ✨',
      });

    expect(commentResponse.status).toBe(201);
    expect(commentResponse.body.comment.content).toContain('melody');

    const detailResponse = await request(app).get(`/api/posts/${post.id}`);
    expect(detailResponse.status).toBe(200);
    expect(detailResponse.body.comments).toHaveLength(1);
    expect(detailResponse.body.comments[0].author).toBe('Muse');
  });
});
