import Router from 'next/router';
import { getCsrfToken } from 'next-auth/react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import {
  initTwitterAppClient,
  initTwitterAuthClient
} from 'src/libs/twitterClient';
import { base64URLEncode, base64URLDecode } from 'src/utils/strUtils';
import BrowserPersistence from 'src/utils/simplePersistence';

const twLogin = async (props: any) => {
  const { reference_url } = props;
  // const lastChar = reference_url.substr(reference_url.length - 1);
  // if (lastChar === '#') {
  //   reference_url = reference_url.slice(0, -1);
  // }
  console.log('====================================');
  console.log('reference_url', reference_url);
  console.log('====================================');
  const csrfToken = await getCsrfToken();
  const stateParam = base64URLEncode(
    JSON.stringify({ csrfToken, reference_url })
  );
  const twitterAuthClient = initTwitterAuthClient();
  console.log(twitterAuthClient);
  let authUrl = twitterAuthClient.generateAuthURL({
    state: `${stateParam}`,
    code_challenge_method: 's256'
  });
  if (!authUrl.includes('client_id')) {
    authUrl += `&client_id=${process.env.TWITTER_ID}`;
  }

  console.log('authUrl', authUrl);
  Router.push(authUrl);
};
const twLogin_b = (props: any) => {
  let { reference_url } = props;
  const lastChar = reference_url.substr(reference_url.length - 1);
  if (lastChar === '#') {
    reference_url = reference_url.slice(0, -1);
  }
  Router.push(
    '/api/twitter/callback?action=login&reference_url=' +
      encodeURIComponent(reference_url)
  );
};
const twUserInfo = async () => {
  await fetch('/api/twitter/userInfo?task=info')
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      console.log('====================================');
      console.log(data);
      console.log('====================================');
    })
    .catch((err) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log(err);
      }
      toast.warning('Something went wrong');
    });
  return true;
};

const isFollowing = async (props: any) => {
  const { user_id, owner_id } = props;
  let rs = false;
  const csrf = await getCsrfToken();
  await fetch(
    `/api/twitter/ck-followings/${user_id}?owner_id=${owner_id}&csrf=${csrf}`
  )
    .then((res) => res.json())
    .then((response) => {
      /*if (response.tw_token) {
          Cookies.set('tw_token', response.tw_token, {
            expires: 30,
            path: '/',
            sameSite: 'lax'
          });
        }*/
      rs = response?.is_following;
    });

  return rs;
};

const getTwUserIdByUsername = async (props: any) => {
  const { username } = props;
  let id = 0;
  const csrf = await getCsrfToken();
  await fetch(`/api/twitter/get-id/${username}?csrf=${csrf}`)
    .then((res) => res.json())
    .then((response) => {
      /*if (response.tw_token) {
          Cookies.set('tw_token', response.tw_token, {
            expires: 30,
            path: '/',
            sameSite: 'lax'
          });
        }*/

      id = response?.id;
    });

  return id;
};

const getFollow = async (props: any) => {
  const { user_id, owner_id } = props;
  if (!user_id || !owner_id)
    return toast.warning('Invalid user id or owner id');
  let checked = false;
  await fetch(
    '/api/twitter/user?task=follow&user_id=' + user_id + '&owner_id=' + owner_id
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.tw_token) {
        Cookies.set('tw_token', data.tw_token, {
          expires: 30,
          path: '/',
          sameSite: 'lax'
        });
      }
      checked = data.checked;
    });
  return checked;
};

const getReTweets = async (props: any) => {
  const { user_id, tweet_id } = props;
  if (!user_id || !tweet_id)
    return toast.warning('Invalid user id or tweet id');
  let checked = false;
  await fetch(
    '/api/twitter/user?task=retweet&user_id=' +
      user_id +
      '&tweet_id=' +
      tweet_id
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.tw_token) {
        Cookies.set('tw_token', data.tw_token, {
          expires: 30,
          path: '/',
          sameSite: 'lax'
        });
      }
      checked = data?.checked;
    });

  return checked;
};

const getTweetLookup = async (props: any) => {
  const { user_id, tweet_id } = props;
  if (!user_id || !tweet_id)
    return toast.warning('Invalid user id or tweet id');
  let checked = false;
  await fetch(
    '/api/twitter/user?task=tweet-loookup&user_id=' +
      user_id +
      '&tweet_id=' +
      tweet_id
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.tw_token) {
        Cookies.set('tw_token', data.tw_token, {
          expires: 30,
          path: '/',
          sameSite: 'lax'
        });
      }
      checked = data?.checked;
    });

  return checked;
};

export {
  twLogin,
  twUserInfo,
  getFollow,
  getTweetLookup,
  getReTweets,
  isFollowing,
  getTwUserIdByUsername
};
