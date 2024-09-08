import { getPostsFromSubreddit, getSubredditModList, getLatestCommentsFromReddit} from './RedditClient.js';

// const postsList = await getPostsFromSubreddit(1, 'test', 'new');
// const modList = await getSubredditModList('test');
const commentsList = await getLatestCommentsFromReddit(1000);

// console.log(commentsList);
console.log(commentsList.length);