const RedditClient = require('../src/RedditClient.js');
const assert = require('assert');
const mockhttps = require('./mock-https/MockHttps');
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
  
  it('should be final/immutable', () => {
    RedditClient.MAX_NUM_POSTS = 101;
    assert.equal(100, RedditClient.MAX_NUM_POSTS);
  });
});

describe('get posts from subreddit', () => {
  it('should return a single valid post object', async () => {
    mockhttps.get('https://www.reddit.com/r/LearnProgramming/new.json?limit=1', mockResponseForPostsCall)/*.andReturn('');*/
    ;
    
    const result = await RedditClient.getPostsFromSubreddit(1, 'LearnProgramming', 'new');
    assert.equal(1, result.length);
    assert.equal("learnprogramming", result[0].subreddit);
    assert.equal("Grokking the Object Oriented Design Case Studies in Java", result[0].postTitle);
    assert.equal(0, result[0].score);
    assert.equal(1609286847, result[0].created);
    assert.equal("https://www.reddit.com/r/learnprogramming/comments/kmqemj/grokking_the_object_oriented_design_case_studies/", result[0].url);
    assert.equal("NoobHelpMan", result[0].author);
  });
});

/* TODO:
describe('get moderators of subreddit', () => {
  it('should return a single valid post object', async () => {
    const result = await RedditClient.getPostsFromSubreddit(1, 'LearnProgramming', 'new');
    assert.equal(1, result.length);
    assert.equal("learnprogramming", result[0].subreddit);
    assert.equal("Grokking the Object Oriented Design Case Studies in Java", result[0].postTitle);
    assert.equal(0, result[0].score);
    assert.equal(1609286847, result[0].created);
    assert.equal("https://www.reddit.com/r/learnprogramming/comments/kmqemj/grokking_the_object_oriented_design_case_studies/", result[0].url);
    assert.equal("NoobHelpMan", result[0].author);
  });
});
*/