import Router from 'next/router';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
const TwitterLogin = (props: any) => {
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

const TwitterFollow = async (props: any) => {
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
          expires: 24,
          path: '/',
          sameSite: 'lax'
        });
      }
      checked = data.checked;
    });
  return checked;
};
const getTwitterUserIdByUsermame = async (props: any) => {
  const { screen_name } = props;
  if (!screen_name) return toast.warning('Invalid user screen_name');
  let id = 0;
  await fetch('/api/twitter/user?task=getid&screen_name=' + screen_name)
    .then((res) => res.json())
    .then((data) => {
      id = data?.data?.id;
    });
  return id;
};
const getTweetsStatus = async (props: any) => {
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
          expires: 24,
          path: '/',
          sameSite: 'lax'
        });
      }
      checked = data?.checked;
    });

  return checked;
};
const getReTweets = async (props: any) => {
  const { user_id, owner_id } = props;
  if (!user_id || !owner_id)
    return toast.warning('Invalid user id or tweet id');
  let checked = false;
  await fetch(
    '/api/twitter/retweet?user_id=' + user_id + '&owner_id=' + owner_id
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.tw_token) {
        Cookies.set('tw_token', data.tw_token, {
          expires: 24,
          path: '/',
          sameSite: 'lax'
        });
      }
      checked = data?.checked;
    });

  return checked;
};
const getFollowed = async (props: any) => {
  const { user_id, tweet_id } = props;
  if (!user_id || !tweet_id)
    return toast.warning('Invalid user id or tweet id');
  let checked = false;
  await fetch(
    '/api/twitter/followed?user_id=' + user_id + '&tweet_id=' + tweet_id
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.tw_token) {
        Cookies.set('tw_token', data.tw_token, {
          expires: 24,
          path: '/',
          sameSite: 'lax'
        });
      }
      checked = data?.checked;
    });

  return checked;
};
export {
  TwitterLogin,
  TwitterFollow,
  getTweetsStatus,
  getTwitterUserIdByUsermame,
  getReTweets,
  getFollowed
};
