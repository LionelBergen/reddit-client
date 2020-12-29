const RedditClient = require('../src/RedditClient.js');
const assert = require('assert');

describe('Get Number Of Posts', () => {
  it('should return 100', () => {
    assert.equal(100, RedditClient.MAX_NUM_POSTS);
  });
  
  it('should be final, not mutable', () => {
    RedditClient.MAX_NUM_POSTS = 101;
    assert.equal(100, RedditClient.MAX_NUM_POSTS);
  });
});