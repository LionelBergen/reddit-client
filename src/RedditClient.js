import { getDataFromUrl } from './util/http.js';
import log from './util/log.js';
import parseJSON from './util/parse-json.js';
import { parsePostArray, parseCommentArray } from './util/reddit/reddit-parser.js';
import { getValidValue } from './util/util.js';

const SUBREDDIT_URL = "https://ssl.reddit.com/r/";
// This is the max number of posts Reddit allows to be retrieved at once. If a higher number is used, this is used anyway
export const MAX_NUM_POSTS = 100;
export const MIN_NUM_POSTS = 1;
export const MAX_NUM_COMMENTS = 1000;
export const MIN_NUM_COMMENTS = 10;

const REDDIT_OBJECT = {
  COMMENT: 'COMMENT',
  POST: 'POST'
};

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

  return await getRedditObjectFromURL(url, REDDIT_OBJECT.POST);
}

/**
 * Get a list of the newest comments from Reddit
 *
 * @param numberOfComments A number between 10-1000 (between 1-9 does not work for Reddit). Defaults to 1000
 * @return List of comment objects
*/
export async function getLatestCommentsFromReddit(numberOfComments = MAX_NUM_COMMENTS) {
  numberOfComments = getValidNumberOfComments(numberOfComments);
  const url = SUBREDDIT_URL + "all/comments.json?limit=" + numberOfComments;
  log.debug(url);
  const latestComments = await getRedditObjectFromURL(url, REDDIT_OBJECT.COMMENT);

  return latestComments;
}

/**
 * Gets a list of the names of moderators for the subreddit
 *
 * @param subreddit
 * @return Promise containing list of moderator usernames
*/
// eslint-disable-next-line
export async function getSubredditModList(subreddit) {
  throw 'UNIMPLEMENTED. Requires Authentication.';
  /* const url = 'https://ssl.reddit.com/r/' + subreddit + '/about/moderators.json';
  const data = await getDataFromUrl(url);
  const jsonData = parseJSON(data);
  console.log(jsonData); */
}

async function getRedditObjectFromURL(url, redditType) {
  const dataFromUrl = await getDataFromUrl(url);
  log.debug(dataFromUrl);

  switch(redditType) {
    case REDDIT_OBJECT.COMMENT:
      return getCommentObjectFromRawURLData(dataFromUrl);
    case REDDIT_OBJECT.POST:
      return getPostObjectsFromRawURLData(dataFromUrl);
  }
}

/**
 * Returns an object based on the data returned from a Reddit URL.
 *
 * @param rawDataFromURL Data from a Reddit URL, containing all the comment info
 * @return An array of Post objects containing body, subreddit etc
*/
function getPostObjectsFromRawURLData(rawDataFromURL) {
  return getObjectFromRawData(rawDataFromURL, REDDIT_OBJECT.POST);
}

/**
 * Returns an object based on the data returned from a Reddit URL.
 *
 * @param rawDataFromURL Data from a Reddit URL, containing all the comment info
 * @return A Comment object containing body, subreddit etc
*/
function getCommentObjectFromRawURLData(rawDataFromURL) {
  return getObjectFromRawData(rawDataFromURL, REDDIT_OBJECT.COMMENT);
}

/**
 *
 * @param {string} rawDataFromURL
 * @param {REDDIT_OBJECT} redditType
 */
function getObjectFromRawData(rawDataFromURL, redditType) {
  const jsonDataFromUrl = parseJSON(rawDataFromURL);

  const result = jsonDataFromUrl.data.children.map(post => {
    switch (redditType) {
      case REDDIT_OBJECT.COMMENT:
        return parseCommentArray(post);
      case REDDIT_OBJECT.POST:
        return parsePostArray(post);
      default:
        throw 'Unknown reddit type: ' + redditType;
    }
  });

  return result;
}

/**
 * This is what happens anyway. Reddit accepts numbers over 100 as 100 and less then 1 as 1
 *
 * @param numberOfPosts
 * @return
 */
function getValidNumberOfPosts(numberOfPosts) {
  return getValidValue(numberOfPosts, MIN_NUM_POSTS, MAX_NUM_POSTS, MIN_NUM_POSTS);
}

/**
 * Reddit accepts numbers over 1000 as 1000 and less then 1 as 1
 *
 * @param numberOfPosts
 * @return
 */
function getValidNumberOfComments(numberOfComments) {
  return getValidValue(numberOfComments, MIN_NUM_COMMENTS, MAX_NUM_COMMENTS, MAX_NUM_COMMENTS);
}
