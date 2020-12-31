reddit-client
-------------
Simple Node.js module used for making HTTP requests to Reddit in order to view comments on all, or a specific Subreddit  
*Does not force rate limiting. Please ensure you limit your requests to avoid getting ip blocked from Reddit*

![https://www.npmjs.com/package/reddit-simple-client](https://nodei.co/npm/reddit-simple-client.png)

Example call to list all comments
---------------------------------  

<p>

####

```javascript
const RedditClient = require('reddit-simple-client');

// Returns a list of Comment objects containing the author, comment body etc.
const latestRedditComments = await RedditClient.getLatestCommentsFromReddit(100);
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

### `RedditClient.MAX_NUM_POSTS`  
Max number of posts or comments Reddit allows you to rerieve at once. If a number thats higher is passed, this number is used anyway  



