import { getCsrfToken } from 'next-auth/react';
import Router from 'next/router';
// import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const twLogin = async (props: any) => {
  const { ref_url } = props;
  let refUrl = ref_url.split('#');
  refUrl = refUrl[0];
  const csrf = await getCsrfToken();
  const loginURL = `/api/twitter/login?ref_url=${encodeURIComponent(
    refUrl
  )}&csrf=${csrf}`;

  await Router.push(loginURL);
};

const getToken = async (code: string) => {
  let rs = false;
  const csrf = await getCsrfToken();
  await fetch(`/api/twitter/get-token/${code}?csrf=${csrf}`)
    .then((res) => res.json())
    .then((response) => {
      rs = response?.token;
    });

  return rs;
};

const getAuthenticatedUser = async () => {
  let rs = false;
  const csrf = await getCsrfToken();
  await fetch(`/api/twitter/get-authenticated-user?csrf=${csrf}`)
    .then((res) => res.json())
    .then((response) => {
      rs = response?.user;
    });

  return rs;
};

const getUserIdByUsername = async (props: any) => {
  const { username } = props;
  let id = 0;
  const csrf = await getCsrfToken();
  await fetch(`/api/twitter/get-user-id/${username}?csrf=${csrf}`)
    .then((res) => res.json())
    .then((response) => {
      id = response?.id;
    });

  return id;
};

const isFollowing = async (props: any) => {
  const { user_id, owner_id } = props;
  let rs = false;
  if (user_id && owner_id) {
    const csrf = await getCsrfToken();
    await fetch(
      `/api/twitter/ck-followings/${user_id}?owner_id=${owner_id}&csrf=${csrf}`
    )
      .then((res) => res.json())
      .then((response) => {
        rs = response?.is_following;
      });
  }

  return rs;
};

const isReTweeted = async (props: any) => {
  const { user_id, tweet_id } = props;
  if (!user_id || !tweet_id)
    return toast.warning('Invalid user id or tweet id!');
  let rs = false;
  const csrf = await getCsrfToken();
  await fetch(
    `/api/twitter/ck-retweet/${tweet_id}?user_id=${user_id}&csrf=${csrf}`
  )
    .then((res) => res.json())
    .then((response) => {
      rs = response?.is_re_tweeted;
    });

  return rs;
};

/*const getReTweets = async (props: any) => {
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
};*/
/*const getFollow = async (props: any) => {
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
};*/

export {
  twLogin,
  getToken,
  getAuthenticatedUser,
  isFollowing,
  isReTweeted,
  getUserIdByUsername
};
