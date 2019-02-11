import { Router } from 'express';
import { version } from '../../package.json';

import podcast from '../controllers/podcast';

export default () => {
  const api = Router();

  // GET /api/podcast/checksum - Generate a list podcasts with checksum from url
  api.get('/podcast/checksum/:url', podcast.getChecksumListFromRssUrl);

  // GET / - Return API version for root
  api.get('/', (req, res) => {
    res.json({ version });
  });

  return api;
};
