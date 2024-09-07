import { getDataFromUrl } from './util/http.js';
import parseJSON from './util/parse-json.js';
import parsePostArray from './util/reddit-parser.js';

const SUBREDDIT_URL = "https://ssl.reddit.com/r/";
// This is the max number of posts Reddit allows to be retrieved at once. If a higher number is used, this is used anyway
export const MAX_NUM_POSTS = 100;
export const MIN_NUM_POSTS = 1;

/**
 * Returns posts from subreddit
 *
 * @param numberOfPosts number of posts to retrieve, between 1-100
 * @param subreddit subreddit to get posts from
 * @param sortType E.G 'new', or 'hot'
 * @return Promise containing a list of RedditPost objects
*/
export async function getPostsFromSubreddit(numberOfPosts, subreddit, sortType) {
  numberOfPosts = getValidNumberOfPosts(numberOfPosts);
  const url = SUBREDDIT_URL + subreddit + "/" + sortType + ".json?limit=" + numberOfPosts;

  return await getPostsFromURL(url);
}

/**
 * Gets a list of the names of moderators for the subreddit
 *
 * @param subreddit
 * @return Promise containing list of moderator usernames
*/
export async function getSubredditModList(subreddit)
{
  throw 'UNIMPLEMENTED. Requires Authentication.';
  /* const url = 'https://ssl.reddit.com/r/' + subreddit + '/about/moderators.json';
  const data = await getDataFromUrl(url);
  const jsonData = parseJSON(data);
  console.log(jsonData); */
}

export class RedditClient
{
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

async function getPostsFromURL(url)
{
  const data = await getDataFromUrl(url);

  return getPostObjectsFromRawURLData(data);
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

  const result = jsonDataFromUrl.data.children.map(post => parsePostArray(post));

  return result;
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
  else if (numberOfPosts < MIN_NUM_POSTS || !numberOfPosts)
  {
    numberOfPosts = MIN_NUM_POSTS;
  }
	
  return numberOfPosts;
}