# Million Good Ways

Million Good Ways is a joyful, community-driven web experience where every post is an artistic rehearsal of a thriving partnership between humanity and benevolent artificial super intelligence. The platform blends an expressive writing space with a beautifully crafted feed inspired by Reddit's discoverability, showcasing visions, stories, and multimedia pieces that celebrate positive ASI outcomes.

## Features

- **Aurora Feed** – Browse a responsive, animated list of the latest, hottest, and top-rated visions with live voting and comment counts.
- **Vision Detail Pages** – Read fully-rendered, sanitized markdown stories, explore curated colour palettes, and join the conversation with reflections.
- **Vision Composer** – Publish new artwork using a rich markdown editor preview, mood selection, theme tagging, and an interactive colour palette designer.
- **Thoughtful Interactions** – Upvote or suggest revisions on posts and comments, filter by mood, and search the collective imagination.
- **Accessible Design** – Crafted with high contrast, keyboard-friendly controls, responsive layouts, and careful typography for a gallery-like feel.

## Tech Stack

- **Frontend**: React 19 + Vite, React Router, Framer Motion animations, Radix UI icons, date-fns, marked + DOMPurify for safe previews.
- **Backend**: Express 5, better-sqlite3, Helmet, CORS, DOMPurify server-side sanitisation, Markdown rendering.
- **Database**: SQLite stored locally, seeded with exemplar visions.
- **Testing**: Jest + Supertest API tests ensuring critical flows work.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# from the repository root
cd server
npm install
npm run seed    # optional: seed the database with sample visions

cd ../client
npm install
```

### Running in Development

Open two terminals:

```bash
# Terminal 1 – API
cd server
npm run dev

# Terminal 2 – Web app
cd client
npm run dev
```

The Vite dev server is configured to proxy API requests to `http://localhost:4000`.

### Building for Production

```bash
cd client
npm run build

cd ../server
npm run seed     # ensures the database has initial content (optional)
npm start        # serves the production client and API
```

The Express server automatically serves the built frontend from `client/dist` when `NODE_ENV=production` and the files exist.

### Testing

Run the automated API tests:

```bash
cd server
npm test
```

These tests spin up an isolated SQLite database file so they will not affect your production content.

## Project Structure

```
client/   # React application
server/   # Express API + SQLite database
```

## Deployment Notes

- Set `NODE_ENV=production` before running `npm start` in the `server` directory.
- Optionally set `CLIENT_ORIGINS` to a comma-separated list of allowed domains for CORS in production.
- The SQLite database file defaults to `server/src/data/asi-forum.db`. Configure `DATABASE_FILE` to override the location.

## License

MIT License © 2025 Million Good Ways Collective
