const app = require('./app');
const { db } = require('./db');

const PORT = process.env.PORT || 4000;

const gracefulShutdown = (signal) => {
  console.log(`Received ${signal}. Closing server gracefully.`);
  server.close(() => {
    db.close();
    process.exit(0);
  });
};

const server = app.listen(PORT, () => {
  console.log(`✨ Million Good Ways server ready on port ${PORT}`);
});

['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, () => gracefulShutdown(signal));
});
