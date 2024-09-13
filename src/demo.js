import log from './util/log.js';
import { CreateAuthedClient } from './RedditClient.js';
import { RedditOptions } from './reddit/modal/reddit-options.js';
import { RedditAuthModal } from './reddit/modal/reddit-auth-modal.js';

const DEFAULT_USER_AGENT = 'u/dusty-trash reddit-client/2.0.0 by Lionel Bergen';

(async () => {
  log.setLevel('debug');
  const redditOptions = new RedditOptions({ useSimpleReturnValues: true });
  const redditAuthModal = new RedditAuthModal({
    username: 'agree-with-you',
    password: 'appleDpp5588',
    appId: 'iqrBfPi95jyfK1G2Q5PqcQ',
    appSecret: 'HPp1wjOpLSvn3xSKd0MhVO-Mu8QBvA',
    redirectUrl: 'https://github.com/LionelBergen/reddit-comment-reader',
    accessToken: null,
    userAgent: DEFAULT_USER_AGENT
  });

  const redditClient = await CreateAuthedClient({ redditOptions: redditOptions, redditAuth: redditAuthModal });

  const posts = await redditClient.getPostsFromSubreddit({ numberOfPosts: 1000, subreddit: 'test', sortType: 'new' });
  log.info(posts);
  // const postsList = await getPostsFromSubreddit(1, 'test', 'new');
  // const modList = await getSubredditModList('test');

  /* const commentsList = await getLatestCommentsFromReddit({ numberOfComments: 1000, redditOptions });

  log.debug(commentsList);
  log.info(commentsList.length); */
})();
