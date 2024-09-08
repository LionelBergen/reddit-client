const RedditComment = require('../src/classes/RedditComment.js');
const RedditPost = require('../src/classes/RedditPost.js');
const assert = require('assert');

describe('RedditComment class', () => {
  it('should display properly', () => {
    const redditComment = new RedditComment({
      body: 'body of comment',
      subreddit: 'subreddit here',
      authorFullname: 'dustytrash',
      postTitle: 'my comment',
      name: 'comment name',
      ups: 55,
      score: 666,
      created: 123456789,
      id: 55555,
      author: 'dustytrash',
      url: '/r/learnprogramming/something/',
      permalink: 'permalink'
    });
    const expectedToString = 'body: body of comment, subreddit: subreddit here, authorFullname: dustytrash, postTitle: my comment, name: comment name, ups: 55, score: 666, created: 123456789, id: 55555, author: dustytrash, url: /r/learnprogramming/something/, permalink: permalink';

    assert.ok(redditComment);
    assert.equal(expectedToString, redditComment.toString());
  });
});

describe('RedditPost class', () => {
  it('should display properly', () => {
    const redditPost = new RedditPost({
      body: 'body of comment',
      subreddit: 'subreddit here',
      authorFullname: 'dustytrash',
      postTitle: 'my comment',
      name: 'comment name',
      ups: 55,
      score: 666,
      created: 123456789,
      id: 55555,
      author: 'dustytrash',
      url: '/r/learnprogramming/something/',
      permalink: 'permalink'
    });
    const expectedToString = 'body: body of comment, subreddit: subreddit here, authorFullname: dustytrash, postTitle: my comment, name: comment name, ups: 55, score: 666, created: 123456789, id: 55555, author: dustytrash, url: /r/learnprogramming/something/, permalink: permalink';

    assert.ok(redditPost);
    assert.equal(expectedToString, redditPost.toString());
  });
});
