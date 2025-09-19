# Million Good Ways – API

This folder contains the Express + SQLite backend that powers the Million Good Ways community. It exposes REST endpoints under `/api` for posts, votes, and comments, and serves the production frontend when `NODE_ENV=production`.

## Scripts

```bash
npm run dev    # Start the API with nodemon on http://localhost:4000
npm start      # Start the API without file watching
npm run seed   # Seed the SQLite database with example visions and comments
npm run lint   # Run ESLint + Prettier checks
npm test       # Execute the Jest + Supertest integration tests
```

By default the database is stored in `src/data/asi-forum.db`. Override the location by setting the `DATABASE_FILE` environment variable.
