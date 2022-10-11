import Router from 'next/router';
const TwitterLogin = (props: any) => {
  let { reference_url } = props;
  const lastChar = reference_url.substr(reference_url.length - 1);
  if (lastChar === '#') {
    reference_url = reference_url.slice(0, -1);
  }
  Router.push(
    '/api/twitter/callback?state=login&reference_url=' +
      encodeURIComponent(reference_url)
  );
};

const TwitterFollow = async (props: any) => {
  const { user_id, owner_id } = props;
  let checked = false;
  await fetch(
    '/api/twitter/user?task=follower&user_id=' +
      user_id +
      '&owner_id=' +
      owner_id
  )
    .then((res) => res.json())
    .then((data) => {
      checked = data.checked;
    });
  return checked;
};
const getTwitterUserIdByUsermame = async (props: any) => {
  const { screen_name } = props;
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
  let checked = false;
  await fetch(
    '/api/twitter/user?task=tweets&user_id=' + user_id + '&tweet_id=' + tweet_id
  )
    .then((res) => res.json())
    .then((data) => {
      checked = data?.checked;
    });

  return checked;
};
export {
  TwitterLogin,
  TwitterFollow,
  getTweetsStatus,
  getTwitterUserIdByUsermame
};
