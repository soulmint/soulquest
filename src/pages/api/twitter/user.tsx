import { Client, auth } from 'twitter-api-sdk';
import { NextApiRequest, NextApiResponse } from 'next';
import nextCookies from 'next-cookies';
import { twDecode } from 'src/libs/useFunc';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const token = nextCookies({ req }).twt;
  const accessToken = token ? JSON.parse(twDecode(token)) : {};
  const client = new Client(process.env.TWITTER_BEARER_TOKEN);

  try {
    const { task } = req.query;
    if (task === 'follower') {
      const user_id = req.query.user_id;
      const owner_id = `${req.query.owner_id}`;
      console.log(accessToken);

      if (!accessToken.token) {
        return res.status(200).json({
          status: 'false',
          mesg: 'Please login to twitter'
        });
      }
      const expire = new Date(accessToken.token.expires_at);
      if (new Date() > expire) {
        // const token = twAuthClient.refreshAccessToken();
      }
      const twAuthClient = new auth.OAuth2User({
        client_id: process.env.TWITTER_ID,
        client_secret: process.env.TWITTER_SECRET,
        callback: process.env.NEXTAUTH_URL + '/api/twitter/callback',
        scopes: [
          'users.read',
          'offline.access',
          'follows.read',
          'follows.write'
        ],
        token: accessToken.token ?? null
      });
      const twFollow = new Client(twAuthClient);
      const followers = await twFollow.users.usersIdFollow(
        //The ID of the user that is requesting to follow the target user
        user_id as string,
        {
          //The ID of the user that the source user is requesting to follow
          target_user_id: owner_id as string
        }
      );
      return res.status(200).json({
        status: 'true',
        checked: followers.data.following ?? false
      });
      // let checked = false;
      // for await (const page of followers) {
      //   page.data.forEach((item) => {
      //     if (item.id === user_id) {
      //       checked = true;
      //     }
      //   });
      //   if (checked) break;
      // }
    } else if (task === 'getid') {
      const screen_name = req.query.screen_name;
      const user = await client.users.findUserByUsername(screen_name as string);

      return res.status(200).json(user);
    } else if (task === 'tweets') {
      const { user_id, tweet_id } = req.query;
      const expire = new Date(accessToken.token.expires_at);
      const twAuthClientRetweet = new auth.OAuth2User({
        client_id: process.env.TWITTER_ID,
        client_secret: process.env.TWITTER_SECRET,
        callback: process.env.NEXTAUTH_URL + '/api/twitter/callback',
        scopes: [
          'users.read',
          'tweet.moderate.write',
          'offline.access',
          'tweet.read',
          'tweet.write'
        ],
        token: accessToken.token ?? null
      });
      console.log('====================================');
      console.log(new Date() > expire);
      console.log('====================================');
      if (new Date() > expire) {
        // const token = twAuthClient.refreshAccessToken();
      }
      const twRetweets = new Client(twAuthClientRetweet);
      const data = await twRetweets.tweets.usersIdRetweets(user_id as string, {
        tweet_id: tweet_id as string
      });
      // const lists = await client.users.tweetsIdRetweetingUsers(
      //   tweet_id as string,
      //   {
      //     'user.fields': ['id', 'name', 'username']
      //   }
      // );
      // let checked = false;
      // lists.data.forEach((item) => {
      //   if (item.id === user_id) {
      //     checked = true;
      //   }
      // });
      return res.status(200).json({
        status: 'Ok',
        checked: data.data?.retweeted ?? false
      });
    } else if (task === 'liked') {
      const { user_id, tweet_id } = req.query;
      const lists = client.users.tweetsIdLikingUsers(tweet_id as string);

      let checked = false;
      for await (const list of lists) {
        if (!list.data) break;
        list.data.forEach((item) => {
          if (item.id === user_id) {
            checked = true;
          }
        });
        if (checked) break;
      }

      return res.status(200).json({
        status: 'Ok',
        checked
      });
    } else {
      return res.status(200).json({
        status: 'Ok'
      });
    }
  } catch (error) {
    // return error;
    return res.status(500).send({ error });
  }
};
