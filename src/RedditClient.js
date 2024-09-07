import RedditComment from './classes/RedditComment.js';
import RedditPost from './classes/RedditPost.js';
import { getDataFromUrl } from './util/http.js';

const SUBREDDIT_URL = "https://ssl.reddit.com/r/";
// This is the max number of posts Reddit allows to be retrieved at once. If a higher number is used, this is used anyway
const MAX_NUM_POSTS = 100;

export default class RedditClient
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
    numberOfPosts = getValidNumberOfPosts(numberOfPosts);
    const url = SUBREDDIT_URL + subreddit + "/" + sortType + ".json?limit=" + numberOfPosts;

    return new Promise(function(resolve, reject) {

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
   * @param numberOfComments A number between 10-100 (between 1-9 does not work for Reddit). Defaults to 100
   * @return List of comment objects
  */
  async getLatestCommentsFromReddit(numberOfComments = 100)
  {
    numberOfComments = getValidNumberOfPosts(numberOfComments);
    const url = SUBREDDIT_URL + "all/comments.json?limit=" + numberOfComments;
    const latestComments = await getCommentsFromURL(url);

    return latestComments;
  }
}

async function getCommentsFromURL(url)
{
  const dataFromUrl = await getDataFromUrl(url);
  const postObjects = getPostObjectsFromRawURLData(dataFromUrl);

  return postObjects;
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
 * @return An array of Post objects containing body, subreddit etc
*/
function getPostObjectsFromRawURLData(rawDataFromURL)
{
  const jsonDataFromUrl = parseJSON(rawDataFromURL);
  
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
 * This is what happens anyway. Reddit accepts numbers over 100 as 100 and less then 10 as 10
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
  else if (numberOfPosts < 10 || !numberOfPosts)
  {
    numberOfPosts = 10;
  }
	
  return numberOfPosts;
}

/**
 * Simple wrapper to try and parse JSON using 'JSON'. 
 * Will rethrow any exception along with logging the data we failed to parse
 */
function parseJSON(data) {
  try {
    const jsonData = JSON.parse(data);
    return jsonData;
  } catch(e) {
    console.error('Failed to parse json data! Data we failed to parse:');
    console.error(data);
    throw e;
  }
}