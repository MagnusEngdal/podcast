import express from 'express';

import config from './config';
import routes from './routes';
import { errorHandler } from './errorhandler';

const app = express();

// API router
app.use('/api', routes());

// Error handler
app.use(errorHandler());

const server = app.listen(config.PORT, () => {
  // Set timeout to allow for many file downloads
  server.setTimeout(1000 * 60 * config.TIMEOUT_MINUTES);

  const time = new Date();
  console.log(`Running API on port ${config.PORT} at ${time}.`);
});

export default server;
