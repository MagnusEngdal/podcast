import crypto from 'crypto';
import request from 'request';

import config from '../config';

/**
 * Fetch a file from provided url and generate a checksum.
 * @param string url
 * @returns string checksum
 */
async function getChecksumFromUrl(url) {
  let checksum = null;

  if (config.SKIP_CHECKSUM) return null;

  // Create hash from algorithm defined in config.
  const hash = crypto.createHash(config.CHECKSUM_ALGORITHM);

  try {
    await new Promise((resolve, reject) => {
      // Request file from url.
      const req = request.get(url);

      // Reject promise if not statusCode 200
      req.on('response', (res) => {
        if (res.statusCode !== 200) {
          return reject();
        }

        // On data received, update hash.
        req.on('data', (data) => {
          hash.update(data);
        });

        req.on('error', (err) => {
          console.log(err);
          if (err.code === 'ECONNRESET') {
            console.log('Timeout occurs');
          }
        });

        // On data end, resolve promise.
        return req.on('end', resolve);
      });
    });

    checksum = hash.digest('hex');
  } catch (e) {
    throw new Error(`Failed to request file from ${url}`);
  }

  // Set format of hash to hex.
  return checksum;
}

export default { getChecksumFromUrl };
