reddit-simple-client
-------------
Simple Node.js module used for making HTTP requests to Reddit in order to view comments on all, or a specific Subreddit  
*Does not force rate limiting. Please ensure you limit your requests to avoid getting ip blocked from Reddit*

![https://www.npmjs.com/package/reddit-simple-client](https://nodei.co/npm/reddit-simple-client.png)

Example call to list all comments
---------------------------------  
*See **demo.js** for all working examples*

<p>

####

```javascript
import { CreateAuthedClient } from 'reddit-simple-client';

const redditOptions = { useSimpleReturnValues: true };
const redditAuthModal = {
  username: 'REDDIT_USERNAME',
  password: 'REDDIT_PASSWORD',
  appId: 'REDDIT_APP_ID',
  appSecret: 'REDDIT_APP_SECRET',
  redirectUrl: 'https://github.com/LionelBergen/reddit-client',
  accessToken: null,
  userAgent: 'u/dusty-trash reddit-simple-client/2.0.0 by Lionel Bergen'
};

const RedditClient = await CreateAuthedClient({ redditOptions: redditOptions, redditAuth: redditAuthModal });

// Returns a list of Comment objects containing the author, comment body etc.
const latestRedditComments = await RedditClient.getLatestCommentsFromReddit(1000);
```

Documentation ⭐
---------------
### **async** `CreateAuthedClient(redditOptions, redditAuth)`  
**Creates an authenticated RedditClient object given the paramaters**   

**redditOptions** - Contains `useSimpleReturnValues` which specifies if simpler objects should be returned. `True` by default   

**redditAuth** - Contains `username` `password` `appId` `appSecret` `redirectUrl` `accessToken` `userAgent` used for Reddit API Authentication  

**return** - RedditClient object that's been authenticated by the Reddit Api using Oauth  

### **async** `ReddClient.getPostsFromSubreddit(numberOfPosts, subreddit, sortType)`  
**Gets a list of post objects**  

**numberOfPosts** - Number of posts to retrieve, between 1-100  

**subreddit** - Subreddit to get posts from *E.G funny*   

**sortType** - E.G 'new', or 'hot'  

**return** - Promise containing a list of RedditPost objects  

### **async** `ReddClient.getSubredditModList(subreddit)`  
**Gets the list of modderators for the subreddit**  

**subreddit** - Subreddit to get moderators of *E.G test*  

**return** - Promise containing list of moderator usernames  

### **async** `ReddClient.getLatestCommentsFromReddit(numberOfComments)`  
**Get a list of the newest comments from Reddit**  

**numberOfComments** - A number between 10-100 (between 1-9 does not work for Reddit)   

**return** - Promise containing list of comment objects  

### **async** `RedditClient.postComment(commentId, textToComment)`  
**Posts a comment to Reddit**   

**commentId** - The `comment.name`. *E.G t1_lnbe9pa*   

**textToComment** - What the posted comment should contain   

### `RedditClient.MAX_NUM_POSTS`  
**Max number of posts or comments Reddit allows you to rerieve at once. If a number thats higher is passed, this number is used anyway**  
