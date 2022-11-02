import { Client, auth } from 'twitter-api-sdk';
let authClient, userClient, appClient;

const createAuthClient = () => {
  return new auth.OAuth2User({
    client_id: process.env.TWITTER_ID,
    client_secret: process.env.TWITTER_SECRET,
    callback: process.env.NEXTAUTH_URL + '/api/twitter/callback',
    scopes: [
      'users.read',
      'offline.access',
      'tweet.read',
      'tweet.write',
      'like.write',
      'like.read',
      'follows.read',
      'follows.write'
    ]
  });
};

const createUserClient = () => {
  return new Client(authClient ?? createAuthClient());
};

const createAppClient = () => {
  const _appClient = new Client(process.env.TWITTER_BEARER_TOKEN);

  return _appClient;
};

const initTwitterAuthClient = () => {
  const _authClient = authClient ?? createAuthClient();
  // Create the Twitter Client once in the client
  if (!authClient) authClient = _authClient;

  return authClient;
};

const initTwitterUserClient = () => {
  const _client = userClient ?? createUserClient();
  if (!userClient) userClient = _client;

  return userClient;
};

const initTwitterAppClient = () => {
  const _appClient = appClient ?? createAppClient();
  if (!appClient) appClient = _appClient;

  return appClient;
};

export { initTwitterAuthClient, initTwitterUserClient, initTwitterAppClient };
