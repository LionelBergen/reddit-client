const RedditComment = require('./classes/RedditComment.js');
const RedditPost = require('./classes/RedditPost.js');
const https = require('https');

const SUBREDDIT_URL = "https://www.reddit.com/r/";
// This is the max number of posts Reddit allows to be retrieved at once. If a higher number is used, this is used anyway
const MAX_NUM_POSTS = 100;

class RedditClient
{
  get MAX_NUM_POSTS() { return MAX_NUM_POSTS; }
  
  /**
   * Returns posts from subreddit
   *
   * @param numberOfPosts number of posts to retrieve, between 1-100
   * @param subreddit subreddit to get posts from
   * @param sortType E.G 'new', or 'hot'
   * @return Promise containing a list of RedditPost objects
  */
  getPostsFromSubreddit(numberOfPosts, subreddit, sortType) {
    return new Promise(function(resolve, reject) {
      numberOfPosts = getValidNumberOfPosts(numberOfPosts);
      const url = SUBREDDIT_URL + subreddit + "/" + sortType + ".json?limit=" + numberOfPosts;

      getPostsFromURL(url).then(resolve).catch(reject);
    });
  }
	
  /**
   * Gets a list of the names of moderators for the subreddit
   *
   * @param subreddit
   * @return Promise containing list of moderator usernames
  */
  getSubredditModList(subreddit)
  {
    return new Promise(function(resolve, reject) {
      const url = SUBREDDIT_URL + subreddit + '/about/moderators.json?';
      // console.debug('trying get mod list from url : ' + subreddit + ' url: ' + url);
      https.get(url, (res) => {
        let message = '';
        res.on('data', (d) => {
          message += d;
        });
        
        res.on('end',function(){
          if (res.statusCode != 200) 
          {
            reject("Api call failed with response code " + res.statusCode);
          } 
          else 
          {
            let messages = JSON.parse(message).data.children;
            let modNamesCommaDelimitedList = messages.map(function(m) { return m.name; });
            resolve(modNamesCommaDelimitedList);
          }
        });
      }).on('error', (e) => {
        reject('error getting subreddit', e, ('subreddit is: ' + subreddit));
      });
    });
  }
	
  /**
   * Get a list of the newest comments from Reddit
   *
   * @param numberOfComments A number between 10-100 (between 1-9 does not work for Reddit)
   * @return List of comment objects
  */
  getLatestCommentsFromReddit(numberOfComments)
  {
    return new Promise(function(resolve, reject) {
      numberOfComments = getValidNumberOfPosts(numberOfComments);
      const url = SUBREDDIT_URL + "all/comments.json?limit=" + numberOfComments;

      getCommentsFromURL(url).then(resolve).catch(reject);
    });
  }
}

function getCommentsFromURL(url)
{
  return new Promise(function(resolve, reject) {
    getDataFromUrl(url).then(getCommentObjectFromRawURLData).then(resolve).catch(function(error) {  
      reject('error thrown for url: ' + url + ' error: ' + error);
    });
  });
}

function getPostsFromURL(url)
{
  return new Promise(function(resolve, reject) {
    getDataFromUrl(url).then(getPostObjectsFromRawURLData).then(resolve).catch(function(error) {  
      reject('error thrown for url: ' + url + ' error: ' + error);
    });
  });
}

/**
 * Returns an object based on the data returned from a Reddit URL.
 *
 * @param rawDataFromURL Data from a Reddit URL, containing all the comment info
 * @return A Comment object containing body, subreddit etc
*/
function getPostObjectsFromRawURLData(rawDataFromURL)
{
  const jsonDataFromUrl = JSON.parse(rawDataFromURL);
  
  if (!jsonDataFromUrl) {
    throw 'Cannot get JSON from rawdata: ' + rawDataFromURL;
  } else if (!jsonDataFromUrl.data || !jsonDataFromUrl.data.children) {
    throw 'Malformed data. Raw data was: ' + rawDataFromURL + ' json data was: ' + jsonDataFromUrl;
  }
  
  return jsonDataFromUrl.data.children.map(post => 
  {
    post = post.data;
    return new RedditPost({
      body: post.selftext,
      subreddit: post.subreddit,
      authorFullname: post.author_fullname,
      postTitle: post.title,
      name: post.name,
      ups: post.ups,
      score: post.score,
      created: post.created_utc,
      id: post.id,
      author: post.author,
      url: post.url,
      permalink: post.permalink
    });
  });
}

/**
 * Returns an object based on the data returned from a Reddit URL.
 *
 * @param rawDataFromURL Data from a Reddit URL, containing all the comment info
 * @return A Comment object containing body, subreddit etc
*/
function getCommentObjectFromRawURLData(rawDataFromURL)
{
  const jsonDataFromUrl = JSON.parse(rawDataFromURL);
  
  if (!jsonDataFromUrl) {
    throw 'Cannot get JSON from rawdata: ' + rawDataFromURL;
  } else if (!jsonDataFromUrl.data || !jsonDataFromUrl.data.children) {
    throw 'Malformed data. Raw data was: ' + rawDataFromURL + ' json data was: ' + jsonDataFromUrl;
  }
  
  return jsonDataFromUrl.data.children.map(comment => 
  {
    comment = comment.data;
    return new RedditComment({
      body: comment.body,
      subreddit: comment.subreddit,
      authorFullname: comment.author_fullname,
      postTitle: comment.title,
      name: comment.name,
      ups: comment.ups,
      score: comment.score,
      created: comment.created_utc,
      id: comment.id,
      author: comment.author,
      url: comment.link_url,
      permalink: comment.permalink
    });
  });
}

/**
 * Run a GET request on a URL and return all the data
 *
 * @param url URL to get data from
 * @return a promise containing data returned from the url
*/
function getDataFromUrl(url)
{
  return new Promise(function(resolve, reject) {
    // console.debug('running GET request for url: ' + url);
    https.get(url, (resp) => 
    {
      let data = '';

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        resolve(data);
      });
    }).on("error", (err) => {
      reject('error getting data from url', err, ('url is: ' + url));
    });
  });
}

/**
 * This is what happens anyway. Reddit accepts numbers over 100 as 100 and less then 1 as 1
 * 
 * @param numberOfPosts
 * @return
 */
function getValidNumberOfPosts(numberOfPosts) 
{
  if(numberOfPosts > MAX_NUM_POSTS)
  {
    numberOfPosts = MAX_NUM_POSTS;
  }
  else if (numberOfPosts < 1 || !numberOfPosts)
  {
    numberOfPosts = 1;
  }
	
  return numberOfPosts;
}

module.exports = new RedditClient();