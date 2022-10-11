import { Client, auth } from 'twitter-api-sdk';
let authClient, client;

const CreateTwitterAuthClient = () => {
  return new auth.OAuth2User({
    client_id: process.env.TWITTER_ID,
    client_secret: process.env.TWITTER_SECRET,
    callback: process.env.NEXTAUTH_URL + '/api/twitter/callback',
    scopes: [
      'tweet.read',
      'users.read',
      'offline.access',
      'tweet.write',
      /* 'like.write', */
      'follows.read'
    ]
  });
};
const CreateTwitterClient = () => {
  return new Client(authClient ?? CreateTwitterAuthClient());
};
const initTwitterAuthClient = () => {
  const _authClient = authClient ?? CreateTwitterAuthClient();
  // Create the Twitter Client once in the client
  if (!authClient) authClient = _authClient;

  return authClient;
};
const initTwitterClient = () => {
  const _client = client ?? CreateTwitterClient();
  if (!client) client = _client;
  return client;
};

export { initTwitterAuthClient, initTwitterClient };
