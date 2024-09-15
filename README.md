reddit-client
-------------
Simple Node.js module used for making HTTP requests to Reddit in order to view comments on all, or a specific Subreddit  
*Does not force rate limiting. Please ensure you limit your requests to avoid getting ip blocked from Reddit*

![https://www.npmjs.com/package/reddit-simple-client](https://nodei.co/npm/reddit-simple-client.png)

Example call to list all comments
---------------------------------  
*See **demo.js** for working examples*

<p>

####

```javascript
const RedditClient = require('reddit-simple-client');
import { CreateAuthedClient } from require('reddit-client');

const redditOptions = new RedditOptions({ useSimpleReturnValues: true });
const redditAuthModal = new RedditAuthModal({
  username: 'REDDIT_USERNAME',
  password: 'REDDIT_PASSWORD',
  appId: 'REDDIT_APP_ID',
  appSecret: 'REDDIT_APP_SECRET',
  redirectUrl: 'https://github.com/LionelBergen/reddit-comment-reader',
  accessToken: null,
  userAgent: 'u/dusty-trash reddit-client/2.0.0 by Lionel Bergen'
});

const redditClient = await CreateAuthedClient({ redditOptions: redditOptions, redditAuth: redditAuthModal });

// Returns a list of Comment objects containing the author, comment body etc.
const latestRedditComments = await redditClient.getLatestCommentsFromReddit(1000);
```

Documentation ⭐
---------------
### `ReddClient.getPostsFromSubreddit(numberOfPosts, subreddit, sortType)`  
Gets a list of post objects  
numberOfPosts - number of posts to retrieve, between 1-100  
subreddit - subreddit to get posts from  
sortType - E.G 'new', or 'hot'  
return - Promise containing a list of RedditPost objects  

### `ReddClient.getSubredditModList(subreddit)`  
Gets the list of modderators for the subreddit  
subreddit - subreddit to get moderators of
return - Promise containing list of moderator usernames

### `ReddClient.getLatestCommentsFromReddit(numberOfComments)`  
Get a list of the newest comments from Reddit  
numberOfComments A number between 10-100 (between 1-9 does not work for Reddit)  
return - Promise containing list of comment objects

### 'RedditClient.postComment(commentId, textToComment)'
Posts a comment to Reddit  
commentId - the `comment.name`. *E.G t1_lnbe9pa*  
textToComment - what the posted comment should contain  

### `RedditClient.MAX_NUM_POSTS`  
Max number of posts or comments Reddit allows you to rerieve at once. If a number thats higher is passed, this number is used anyway  
