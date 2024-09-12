import log from './util/log.js';
import { getLatestCommentsFromReddit } from './RedditClient.js';
import { RedditOptions } from './reddit/reddit-options.js';

(async () => {
  log.setLevel('debug');
  const redditOptions = new RedditOptions(false);
  // const postsList = await getPostsFromSubreddit(1, 'test', 'new');
  // const modList = await getSubredditModList('test');

  const commentsList = await getLatestCommentsFromReddit({ numberOfComments: 1000, redditOptions });

  log.debug(commentsList);
  log.info(commentsList.length);
})();
