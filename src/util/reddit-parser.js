export default function parsePostArray(rawResponse) {
  const data = rawResponse.data || rawResponse;

return {
  body: data.selftext,
  subreddit: data.subreddit,
  authorFullname: data.author_fullname,
  postTitle: data.title,
  name: data.name,
  ups: data.ups,
  score: data.score,
  created: data.created_utc,
  id: data.id,
  author: data.author,
  permalink: data.permalink,
  url: 'https://www.reddit.com' + data.permalink
  };
}
