import RedditClient from './RedditClient.js';



const redditClient = new RedditClient();

const commentsList = await redditClient.getLatestCommentsFromReddit(1);

console.log(commentsList);