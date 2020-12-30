const RedditClient = require('../src/RedditClient.js');
const assert = require('assert');
const mockhttps = require('./mock-https/MockHttps');
const sinon = require('sinon');
const fs = require('fs');

let mockResponseForPostsCall;

before(function(done){
    fs.readFile('./test/resources/response_from_reddit_newest_posts.json', 'utf8', function(err, fileContents) {
      if (err) throw err;
      mockResponseForPostsCall = fileContents;
      done();
    });
});

describe('Get Number Of Posts', () => {
  it('should return 100', () => {
    assert.equal(100, RedditClient.MAX_NUM_POSTS);
  });
  
  it('should be final, not mutable', () => {
    RedditClient.MAX_NUM_POSTS = 101;
    assert.equal(100, RedditClient.MAX_NUM_POSTS);
  });
});

// TODO: Use 'Sinon' to mock URL calls and create tests using real, saved URL's.
describe('get comments from subreddit', () => {
  it('should return a valid set of comment objects', async () => {
    mockhttps.get('https://www.reddit.com/r/LearnProgramming/new.json?limit=1', mockResponseForPostsCall)/*.andReturn('');*/
    ;
    
    const result = await RedditClient.getCommentsFromSubreddit(1, 'LearnProgramming', 'new');
    assert.equal("learnprogramming", result[0].subreddit);
    
    /*.then(function(data) {
      console.log('++++++++++++++++++++++');
      console.log(data);
      console.log('++++++++++++++++++++++');
    }).catch(function(error) {
      assert.fail(error);
    });*/
    
  });
});

function getFakeClientRequestObject() {
  return new FakeClientRequestObject();
}

/**
 * A class for mocking responses from https calls
*/
class FakeClientRequestObject {
  on(nameOfEvent) {
    console.log('called: ' + nameOfEvent + ' on mock clientRequest');
  }
}