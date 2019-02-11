import Parser from 'rss-parser';

import { APIError } from '../errorhandler';
import Episode from '../models/episode';

const parser = new Parser();

/**
 * GET transformed cast list from RSS url
 * @param {string} params.url - RSS url
 * @param {number} query.limit - Number of items to take
 * @param {number} query.start - On what item to start
 * @returns [Episode] list of podcast episodes with checksums
 */
async function getChecksumListFromRssUrl({ params, query }, res, next) {
  let feed = [];
  const { limit, start } = query;

  // Fetch and parse the RSS url.
  try {
    feed = await parser.parseURL(params.url);
  } catch (e) {
    if (e && e.message === 'Status code 404') {
      return next(APIError(`${params.url} not found.`));
    }
    return next(APIError(e.message));
  }

  // Limit result to a subset of items based on start and limit
  if (limit) {
    if (start) {
      feed.items = feed.items.slice(start, limit);
    } else {
      feed.items = feed.items.slice(0, limit);
    }
  }

  // Create an array of podcast episodes
  const episodes = feed.items
    .map(item => new Episode(item.title, null, item.enclosure.url));

  // Create an array of all checksum generators
  const checksums = episodes.map(async (item) => {
    await item.generateChecksum();
  });

  // Wait for all checksums to be generated
  try {
    await Promise.all(checksums);
  } catch (e) {
    return next(APIError(e.message));
  }

  // Return list of PodCast episodes
  return res.json(episodes);
}

export default { getChecksumListFromRssUrl };
