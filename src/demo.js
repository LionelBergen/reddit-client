import { RedditClient, getPostsFromSubreddit} from './RedditClient.js';



const redditClient = new RedditClient();

const commentsList = await getPostsFromSubreddit(1, 'test', 'new');

// const commentsList = await redditClient.getLatestCommentsFromReddit(1);

console.log(commentsList);