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