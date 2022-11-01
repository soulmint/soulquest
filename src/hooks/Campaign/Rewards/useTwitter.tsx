import Router from 'next/router';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const twLogin = (props: any) => {
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

const isFollowing = async (props: any) => {
  const { user_id, owner_id } = props;
  let rs = false;
  await fetch(`/api/twitter/ck-followings/${user_id}?owner_id=${owner_id}`)
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
  await fetch(`/api/twitter/get-id/${username}`)
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
  getFollow,
  getTweetLookup,
  getReTweets,
  isFollowing,
  getTwUserIdByUsername
};
