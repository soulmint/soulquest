import { Client, auth } from 'twitter-api-sdk';
import Cookies from 'js-cookie';
import { base64URLEncode } from 'src/utils/strUtils';
let authClient, userClient, appClient;

const createAuthClient = (tw_token) => {
  return new auth.OAuth2User({
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
    ],
    token: tw_token ? tw_token : undefined
  });
};
const getTwToken = () => {
  const tokenRaw = Cookies.get('tw_token');
  let token;
  if (tokenRaw) {
    token = JSON.parse(base64URLEncode(tokenRaw));
  }

  return token;
};
const setTwToken = (token) => {
  Cookies.set('tw_token', base64URLEncode(JSON.stringify(token)));
};
const createUserClient = (tw_token) => {
  const _authClient = authClient ?? createAuthClient(tw_token);
  if (_authClient.isAccessTokenExpired()) {
    const token = _authClient.refreshAccessToken();
    if (token) {
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

const initTwitterUserClient = (tw_token) => {
  const _client = userClient ?? createUserClient(tw_token);
  if (!userClient) userClient = _client;

  return userClient;
};

const initTwitterAppClient = () => {
  const _appClient = appClient ?? createAppClient();
  if (!appClient) appClient = _appClient;

  return appClient;
};
initTwitterAuthClient();
initTwitterAppClient();
export {
  initTwitterAuthClient,
  initTwitterUserClient,
  initTwitterAppClient,
  getTwToken,
  setTwToken
};
