import { NextApiRequest, NextApiResponse } from 'next';
import { Client, auth } from 'twitter-api-sdk';
import nextCookies from 'next-cookies';
import { base64URLDecode, base64URLEncode } from 'src/utils/strUtils';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const token = nextCookies({ req }).tw_token;
  const accessToken = token ? JSON.parse(base64URLDecode(token)) : {};
  const twitterAuthClient = new auth.OAuth2User({
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
    ],
    token: accessToken.token
  });
  const twitterClient = new Client(twitterAuthClient);
  let refreshToken;
  if (twitterAuthClient.isAccessTokenExpired()) {
    refreshToken = await twitterAuthClient.refreshAccessToken();
  }
  if (process.env.NODE_ENV !== 'production') {
    console.log(refreshToken);
  }
  try {
    const user_id = req.query.user_id;
    const owner_id = `${req.query.owner_id}`;
    const followers = twitterClient.users.usersIdFollowing(user_id as string);
    let checked = false;
    for await (const page of followers) {
      page.data.forEach((item) => {
        if (item.id === owner_id) {
          checked = true;
        }
      });
      if (checked) break;
    }
    return res.status(200).json({
      status: 'true',
      tw_token: refreshToken
        ? base64URLEncode(JSON.stringify(refreshToken))
        : '',
      checked
    });
  } catch (error) {
    // return error;
    return res.status(500).send({ error });
  }
};
