import log from './util/log.js';
import { CreateAuthedClient } from './RedditClient.js';
import { RedditOptions } from './reddit/modal/reddit-options.js';
import { RedditAuthModal } from './reddit/modal/reddit-auth-modal.js';
import { getEnvironmentVariable } from './util/util.js';

const DEFAULT_USER_AGENT = 'u/dusty-trash reddit-client/2.0.0 by Lionel Bergen';

function isValidAuthModal(authModal) {
  return authModal.username && authModal.password && authModal.appId && authModal.appSecret;
}

(async () => {
  log.setLevel('info');
  const redditOptions = new RedditOptions({ useSimpleReturnValues: true });
  const redditAuthModal = new RedditAuthModal({
    username: getEnvironmentVariable('REDDIT_USERNAME'),
    password: getEnvironmentVariable('REDDIT_PASSWORD'),
    appId: getEnvironmentVariable('REDDIT_APP_ID'),
    appSecret: getEnvironmentVariable('REDDIT_APP_SECRET'),
    redirectUrl: 'https://github.com/LionelBergen/reddit-comment-reader',
    accessToken: null,
    userAgent: DEFAULT_USER_AGENT
  });

  if (!isValidAuthModal(redditAuthModal)) {
    throw 'Missing required environment variables!';
  }

  try {
    const redditClient = await CreateAuthedClient({ redditOptions: redditOptions, redditAuth: redditAuthModal });
    // const results = await redditClient.getPostsFromSubreddit({ numberOfPosts: 1000, subreddit: 'test', sortType: 'new' });
    const results = await redditClient.getLatestCommentsFromReddit();
    log.info(results);
    log.info(results.length);
  } catch (e) {
    log.error(e);
    throw e;
  }
  // const postsList = await getPostsFromSubreddit(1, 'test', 'new');
  // const modList = await getSubredditModList('test');

  /* const commentsList = await getLatestCommentsFromReddit({ numberOfComments: 1000, redditOptions });

  log.debug(commentsList);
  log.info(commentsList.length); */
})();
