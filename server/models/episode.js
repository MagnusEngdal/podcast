import cs from '../utils/checksum';

export default class Episode {
  constructor(title = '', checksum = '', url = '') {
    this.title = title;
    this.checksum = checksum;
    this.url = url;
  }

  /**
   * Download mp3 from url and generate checksum.
   */
  async generateChecksum() {
    if (this.url) {
      this.checksum = await cs.getChecksumFromUrl(this.url);
    }
  }
}
