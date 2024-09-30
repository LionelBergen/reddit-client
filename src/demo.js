import log from './util/log.js';
import { CreateAuthedClient } from './reddit-client.js';
import { getEnvironmentVariable } from './util/util.js';
import 'dotenv/config';

const DEFAULT_USER_AGENT = 'u/dusty-trash reddit-simple-client/2.0.0 by Lionel Bergen';

function isValidAuthModal(authModal) {
  for (const property in authModal) {
    if (property !== 'accessToken' && !authModal[property]) {
      log.error(`${property} is not set!`);
    }
  }

  return authModal.username && authModal.password && authModal.appId && authModal.appSecret;
}

(async () => {
  log.setLevel('info');
  const redditOptions = { useSimpleReturnValues: true };
  const redditAuthModal = {
    username: getEnvironmentVariable('REDDIT_USERNAME'),
    password: getEnvironmentVariable('REDDIT_PASSWORD'),
    appId: getEnvironmentVariable('REDDIT_APP_ID'),
    appSecret: getEnvironmentVariable('REDDIT_APP_SECRET'),
    redirectUrl: 'https://github.com/LionelBergen/reddit-client',
    accessToken: null,
    userAgent: DEFAULT_USER_AGENT
  };

  if (!isValidAuthModal(redditAuthModal)) {
    throw 'Missing required environment variable(s)!';
  }

  try {
    log.info('About to authenticate reddit client');
    const redditClient = await CreateAuthedClient({ redditOptions: redditOptions, redditAuth: redditAuthModal });
    /* const results = await redditClient.getPostsFromSubreddit({
      numberOfPosts: 1000,
      subreddit: 'test',
      sortType: 'new'
    }); */
    const results = await redditClient.getSubredditModList('test');
    // const results = await redditClient.postComment('t1_lnbe9pa', 'testing, written from node.js');
    log.info(results);
    log.info(results.length);
  } catch (e) {
    log.error(e);
    throw e;
  }
})();
