import { NextApiRequest, NextApiResponse } from 'next';
import { twitterAppClient } from 'src/libs/twitterAppClient';

// import nextCookies from "next-cookies";
// import {base64URLDecode, base64URLEncode} from "src/utils/strUtils";
// import {auth, Client} from "twitter-api-sdk";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    query: { user_id, owner_id }
  } = req;

  const rs = {
    is_following: false,
    tw_token: ''
  };

  /*const token = nextCookies({ req }).tw_token;
  const accessToken = token ? JSON.parse(base64URLDecode(token)) : {};
  const twitterAuthClient = new auth.OAuth2User({
    client_id: process.env.TWITTER_ID,
    client_secret: process.env.TWITTER_SECRET,
    callback: process.env.NEXTAUTH_URL + '/api/twitter/callback',
    scopes: [
      // 'users.read',
      // 'offline.access',
      // 'tweet.read',
      // 'tweet.write',
      // 'like.write',
      // 'like.read',
      // 'follows.read',
      // 'follows.write'
    ],
    token: accessToken.token ? accessToken.token : null
  });
  const twitterUserClient = new Client(twitterAuthClient);*/

  switch (method) {
    case 'GET':
      if (user_id && owner_id) {
        // Refresh Twitter token if expired
        /*let refreshToken;
        if (twitterAuthClient.isAccessTokenExpired()) {
          refreshToken = await twitterAuthClient.refreshAccessToken();
          if (process.env.NODE_ENV !== 'production') {
            console.log("[Twitter RefreshToken]", refreshToken);
          }
          rs.tw_token = (refreshToken) ? base64URLEncode(JSON.stringify(refreshToken)) : '';
        }*/

        // get list users followed by user id
        const users = twitterAppClient.users.usersIdFollowing(
          user_id as string,
          {
            'user.fields': ['id']
          }
        );
        for await (const page of users) {
          if (!page.data) break;
          for (const user of page.data) {
            if (user.id === owner_id) {
              rs.is_following = true;
              break;
            }
          }
          if (rs.is_following) break;
        }
      }

      res.status(200).json(rs);
      break;

    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
