import nock from 'nock';
import chaiHttp from 'chai-http';
import chai from 'chai';

import server from './../../../server';

chai.use(chaiHttp);
chai.should();

describe('API :: PodCast :: getChecksumListFromRssUrl ', () => {
  let rss, mp3;

  it('When RSS and all MP3 files exists', (done) => {
    rss = nock('http://example.com')
      .get('/podcast')
      .replyWithFile(200, __dirname + '/podcast.xml', { 'Content-Type': 'application/rss+xml' });

    mp3 = nock('http://example.com')
      .get('/media.mp3')
      .reply(200, "TEST");

    chai.request(server)
      .get('/api/podcast/checksum/http%3A%2F%2Fexample.com%2Fpodcast')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('When RSS exists, but an MP3 in it doesn\'t', (done) => {
    rss = nock('http://example.com')
      .get('/podcast')
      .replyWithFile(200, __dirname + '/podcast.xml', { 'Content-Type': 'application/rss+xml' });

    mp3 = nock('http://example.com')
      .get('/media.mp3')
      .reply(404);

    chai.request(server)
      .get('/api/podcast/checksum/http%3A%2F%2Fexample.com%2Fpodcast')
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
  });

  it('When RSS doesn\'t exist', (done) => {
    rss = nock('http://example.com')
      .get('/podcast')
      .reply(404);

    chai.request(server)
      .get('/api/podcast/checksum/http%3A%2F%2Fexample.com%2Fpodcast')
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
  });

});
