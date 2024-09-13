export class RedditAuthModal {
  constructor({ username, password, appId, appSecret, redirectUrl, accessToken, userAgent }) {
    this.username = username;
    this.password = password;
    this.appId = appId;
    this.appSecret = appSecret;
    this.redirectUrl = redirectUrl;
    this.accessToken = accessToken;
    this.userAgent = userAgent;
  }
}
