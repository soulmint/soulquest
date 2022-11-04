import { Client, auth } from 'twitter-api-sdk';
import Cookies from 'js-cookie';
import { base64URLEncode } from 'src/utils/strUtils';

let authClient, userClient, appClient;

const createAuthClient = (token) => {
  const options = {
    client_id: process.env.TWITTER_ID,
    client_secret: process.env.TWITTER_SECRET,
    callback: process.env.PUBLIC_URL + '/api/twitter/login-callback',
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
  };
  if (token) {
    options.token = token;
  }

  return new auth.OAuth2User(options);
};

const createUserClient = (token) => {
  let _authClient = authClient ?? createAuthClient(token);

  if (token && _authClient.isAccessTokenExpired()) {
    //coming soon
    const token = _authClient.refreshAccessToken();
    if (token) {
      _authClient = createAuthClient(token);
      Cookies.set('tw_token', base64URLEncode(JSON.stringify(token)));
    }
  }

  return new Client(_authClient);
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

const initTwitterAuthUrl = (csrf, state) => {
  return authClient.generateAuthURL({
    state,
    code_challenge_method: 'plain',
    code_challenge: csrf
  });
};

const initTwitterUserClient = (token) => {
  const _client = userClient ?? createUserClient(token);
  if (!userClient) userClient = _client;

  return userClient;
};

const initTwitterAppClient = () => {
  const _appClient = appClient ?? createAppClient();
  if (!appClient) appClient = _appClient;

  return appClient;
};

export {
  initTwitterAuthClient,
  initTwitterAuthUrl,
  initTwitterUserClient,
  initTwitterAppClient
};
