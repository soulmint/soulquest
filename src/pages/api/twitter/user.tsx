import { NextApiRequest, NextApiResponse } from 'next';
import { Client, auth } from 'twitter-api-sdk';
import nextCookies from 'next-cookies';
import { base64URLDecode, base64URLEncode } from 'src/utils/strUtils';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const token = nextCookies({ req }).tw_token;
  const accessToken = token ? JSON.parse(base64URLDecode(token)) : {};
  const client = new Client(process.env.TWITTER_BEARER_TOKEN);
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
  if (refreshToken && process.env.NODE_ENV !== 'production') {
    console.log(refreshToken);
    console.log(base64URLEncode(JSON.stringify(refreshToken)));
  }
  try {
    const { task, user_id, owner_id, tweet_id, screen_name } = req.query;
    let data, user;
    let checked = false;

    switch (task) {
      case 'follow':
        data = await twitterClient.users.usersIdFollow(
          //The ID of the user that is requesting to follow the target user
          user_id as string,
          {
            //The ID of the user that the source user is requesting to follow
            target_user_id: owner_id as string
          }
        );
        checked = data.data.following ?? false;
        break;
      case 'follow-lookup':
        data = twitterClient.users.usersIdFollowing(user_id as string, {
          'user.fields': ['id']
        });
        for await (const page of data) {
          if (!page.data) break;
          for (const item of page.data) {
            if (item.id === owner_id) {
              checked = true;
              break;
            }
          }
          if (checked) break;
        }
        break;
      case 'retweet':
        data = await twitterClient.tweets.usersIdRetweets(user_id as string, {
          tweet_id: tweet_id as string
        });
        checked = data.data?.retweeted ?? false;
        break;
      case 'tweet-loookup':
        data = twitterClient.users.tweetsIdRetweetingUsers(tweet_id as string, {
          'user.fields': ['id']
        });
        for await (const page of data) {
          if (!page.data) break;
          for (const item of page.data) {
            if (item.id === user_id) {
              checked = true;
              break;
            }
          }
          if (checked) break;
        }
        break;
      case 'liked':
        data = client.users.tweetsIdLikingUsers(tweet_id as string, {
          'user.fields': ['id']
        });
        for await (const page of data) {
          if (!page.data) break;
          for (const item of page.data) {
            if (item.id === user_id) {
              checked = true;
              break;
            }
          }
          if (checked) break;
        }
        break;
      case 'getid':
        user = await client.users.findUserByUsername(screen_name as string);
        break;

      default:
        break;
    }
    if (user) {
      return res.status(200).json({
        status: 'true',
        user: user.data,
        tw_token: refreshToken
          ? base64URLEncode(JSON.stringify(refreshToken))
          : ''
      });
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
