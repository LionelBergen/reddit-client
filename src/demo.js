import { RedditClient, getPostsFromSubreddit, getSubredditModList} from './RedditClient.js';



const redditClient = new RedditClient();

// const commentsList = await getPostsFromSubreddit(1, 'test', 'new');
const modList = await getSubredditModList('test');

// const commentsList = await redditClient.getLatestCommentsFromReddit(1);

console.log(modList);