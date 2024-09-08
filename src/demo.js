import log from './util/log.js';
import { getPostsFromSubreddit, getSubredditModList, getLatestCommentsFromReddit} from './RedditClient.js';

// log.setLevel('debug');
// const postsList = await getPostsFromSubreddit(1, 'test', 'new');
// const modList = await getSubredditModList('test');
const commentsList = await getLatestCommentsFromReddit(20);

log.debug(commentsList);
log.info(commentsList.length);