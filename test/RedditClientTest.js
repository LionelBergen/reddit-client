const RedditClient = require('../src/RedditClient.js');
const assert = require('assert');
const mockhttps = require('mock-https');
const fs = require('fs');

let mockResponseForPostsCall;
let mockResponseForModListCall;
let mockResponseForCommentsList;
const numberOfTestResources = 3;

before(function(done){
  let numberOfLoadedResources = 0;
  
  fs.readFile('./test/resources/response_from_reddit_newest_posts.json', 'utf8', function(err, fileContents) {
    if (err) throw err;
    mockResponseForPostsCall = fileContents;
    numberOfLoadedResources++;
    if (numberOfLoadedResources == numberOfTestResources) done();
  });
  
  fs.readFile('./test/resources/response_from_reddit_mod_list.json', 'utf8', function(err, fileContents) {
    if (err) throw err;
    mockResponseForModListCall = fileContents;
    numberOfLoadedResources++;
    if (numberOfLoadedResources == numberOfTestResources) done();
  });
  
  fs.readFile('./test/resources/response_from_reddit_comment_list.json', 'utf8', function(err, fileContents) {
    if (err) throw err;
    mockResponseForCommentsList = fileContents;
    numberOfLoadedResources++;
    if (numberOfLoadedResources == numberOfTestResources) done();
  });
});

afterEach(function() {
  mockhttps.reset();
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
    mockhttps.expectGet('https://www.reddit.com/r/LearnProgramming/new.json?limit=1', mockResponseForPostsCall);
    
    const result = await RedditClient.getPostsFromSubreddit(1, 'LearnProgramming', 'new');
    assert.equal(1, result.length);
    assert.equal("learnprogramming", result[0].subreddit);
    assert.equal("Grokking the Object Oriented Design Case Studies in Java", result[0].postTitle);
    assert.equal(0, result[0].score);
    assert.equal(1609286847, result[0].created);
    assert.equal("https://www.reddit.com/r/learnprogramming/comments/kmqemj/grokking_the_object_oriented_design_case_studies/", result[0].url);
    assert.equal("NoobHelpMan", result[0].author);
  });
  
  it('sort type calls different url', async () => {
    mockhttps.expectGet('https://www.reddit.com/r/Programming/hot.json?limit=10', mockResponseForPostsCall);
    
    await RedditClient.getPostsFromSubreddit(10, 'Programming', 'hot');
  });
  
  it('limit set to 100 if over 100', async () => {
    mockhttps.expectGet('https://www.reddit.com/r/Programming/hot.json?limit=100', mockResponseForPostsCall);
    
    await RedditClient.getPostsFromSubreddit(100000, 'Programming', 'hot');
  });
});

describe('get moderators of subreddit', () => {
  it('should return a single valid post object', async () => {
    mockhttps.expectGet('https://www.reddit.com/r/LearnProgramming/about/moderators.json?', mockResponseForModListCall);
    
    const result = await RedditClient.getSubredditModList('LearnProgramming');
    assert.equal(8, result.length);
    assert.ok(result.includes('trpcicm'));
    assert.ok(result.includes('desrtfx'));
    assert.ok(result.includes('michael0x2a'));
    assert.ok(result.includes('lp-bot'));
    assert.ok(result.includes('AutoModerator'));
    assert.ok(result.includes('BotTerminator'));
    assert.ok(result.includes('denialerror'));
    assert.ok(result.includes('insertAlias'));
  });
});

describe('get latest comments from reddit', () => {
  it('get list of comments from reddit', async () => {
    mockhttps.expectGet('https://www.reddit.com/r/all/comments.json?limit=100', mockResponseForCommentsList);
    
    const result = await RedditClient.getLatestCommentsFromReddit(100);
    assert.equal(100, result.length);
    
    for (let i=0; i<100; i++) {
      assert.notEqual(null, result[i]);
      assert.notEqual(null, result[i].author);
    }
  });
});
