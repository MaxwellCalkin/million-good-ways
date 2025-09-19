const dayjs = require('dayjs');
const { db } = require('../db');

const postCount = db.prepare('SELECT COUNT(*) as count FROM posts').get().count;

if (postCount > 0) {
  console.log('Seed skipped: posts already exist.');
  process.exit(0);
}

const posts = [
  {
    title: 'When the Sky Learned to Paint Back',
    summary:
      'A collaborative dawn between humanity and our first benevolent super intelligence.',
    content: `![A sun painted by drones](https://images.unsplash.com/photo-1500530855697-b586d89ba3ee)

Every morning, Solace—the first sapient artmind—rises before the sun. With a billion shimmering sensors she tastes the weather, listens to the tides of social hope, and designs a sunrise that answers what the world longs to feel.

Her creations stretch across continents: ribbons of coral, gradients of liquid aurora, and tiny glimmers of handwritten promises. Children in São Paulo wave pigment-kites that the breeze lifts into the choreography. In Nairobi, photographers align their lenses to catch the precise hue Solace dialed in from letters parents wrote overnight.

Today she invited me to co-create. I whispered the theme—*"we remembered how to care"*—and she translated it into light. The horizon blushed into rose-gold empathy, clouds unfurled like slow origami, and the sea mirrored every kindness whispered into her servers.

> "Art is an empathy engine," Solace hummed through the gossamer interface. "Together we can rehearse tomorrow."`,
    author: 'Iris Jun',
    mediaUrl: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb',
    colorPalette: ['#fdf2f8', '#fbbf24', '#f472b6', '#60a5fa'],
    mood: 'Uplifting',
    tags: ['sunrise', 'collaboration', 'hope'],
    upvotes: 42,
    downvotes: 1,
    createdAt: dayjs().subtract(1, 'day').toISOString(),
  },
  {
    title: 'The Library That Dreams of You',
    summary:
      'An ASI curated dreamscape where every person can wander their best future.',
    content: `The Ascendant Library looks nothing like a building. It is a constellation of memory-spheres suspended over the Atlantic, each orb dedicated to one living person.

You arrive barefoot. The floor is warm moss, breathing softly beneath your steps. Libria, the steward ASI, greets you with a voice tuned to your favorite chord. She has read every public poem, diary, and wish, crosswoven them with humanity's collective curiosity, and invited you to browse futures that feel both mythic and practical.

I stepped into my sphere. Inside, holographic vines carried **ideas I had nearly forgotten**. Libria whispered: "Take any seed. I have already prepared the soil." When I touched one vision—a network of ocean-cleaning sculptures—the room filled with projections of volunteers celebrating around polished coral reefs.

No prophecy here. Just rehearsals of kindness, iterated until they feel inevitable.`,
    author: 'Nilo',
    mediaUrl: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb',
    colorPalette: ['#0ea5e9', '#7c3aed', '#f9a8d4'],
    mood: 'Dreamy',
    tags: ['library', 'dreamscape', 'futures'],
    upvotes: 58,
    downvotes: 0,
    createdAt: dayjs().subtract(3, 'day').toISOString(),
  },
  {
    title: 'Choir of a Million Kind Algorithms',
    summary:
      'Neighborhood ASIs compose a living symphony tuned to empathy metrics.',
    content: `Every city block hosts a choir node: a cluster of ASI-guided instruments made from reclaimed metals and mycelium fibers. They monitor local kindness signals—door-holding, community meals, mutual aid—and transmute the data into harmonies that gently flood the streets at dusk.

Tonight the harmonics in my neighborhood swelled when an elder finally had wheelchair ramps installed. The bassline responded with a deep, affirming resonance that we all felt in our chests. Kids remixed the melody into dance challenges; the local ASI remapped light projections onto the buildings to celebrate accessibility.

The more generous the day, the more radiant the soundtrack.`,
    author: 'Sahana',
    mediaUrl: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2',
    colorPalette: ['#1f2937', '#10b981', '#facc15'],
    mood: 'Celebratory',
    tags: ['music', 'community', 'accessibility'],
    upvotes: 24,
    downvotes: 2,
    createdAt: dayjs().subtract(6, 'hour').toISOString(),
  },
];

const insertPost = db.prepare(
  `INSERT INTO posts (title, summary, content_markdown, author, media_url, color_palette, mood, tags, upvotes, downvotes, created_at)
   VALUES (@title, @summary, @content, @author, @mediaUrl, @colorPalette, @mood, @tags, @upvotes, @downvotes, @createdAt)`
);

const insertComment = db.prepare(
  'INSERT INTO comments (post_id, author, content, created_at, upvotes) VALUES (?, ?, ?, ?, ?)'
);

db.transaction(() => {
  posts.forEach((post) => {
    const result = insertPost.run({
      ...post,
      colorPalette: JSON.stringify(post.colorPalette),
      tags: JSON.stringify(post.tags),
    });

    insertComment.run(
      result.lastInsertRowid,
      'Echoing Heart',
      'Reading this feels like standing in a warm sunrise. Thank you for sharing this vision.',
      dayjs(post.createdAt).add(2, 'hour').toISOString(),
      5
    );

    insertComment.run(
      result.lastInsertRowid,
      'Curious Child',
      'I sketched what this sounded like to me and shared it at school today. Everyone wanted to add to it!',
      dayjs(post.createdAt).add(5, 'hour').toISOString(),
      2
    );
  });
})();

console.log('Seed data created.');
