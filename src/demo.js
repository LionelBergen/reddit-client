import RedditClient from './RedditClient.js';



const redditClient = new RedditClient();

const commentsList = await redditClient.getLatestCommentsFromReddit();

console.log(commentsList);