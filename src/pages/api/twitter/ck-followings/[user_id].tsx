import { NextApiRequest, NextApiResponse } from 'next';
import { getCsrfToken } from 'next-auth/react';
import nextCookies from 'next-cookies';
import {
  // initTwitterAppClient,
  initTwitterUserClient
} from 'src/libs/twitterClient';
import { base64URLDecode } from 'src/utils/strUtils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    query: { user_id, owner_id, csrf }
  } = req;

  const _csrf = await getCsrfToken({ req });
  if (csrf !== _csrf) {
    return res.status(401).send('You are not authorized to call this API');
  }

  const rs = {
    is_following: false
  };

  try {
    switch (method) {
      case 'GET':
        if (user_id && owner_id) {
          // Method 1: check by twitter User client (for a better quota of requests limit)
          const twToken = nextCookies({ req }).tw_token;
          const token = twToken ? JSON.parse(base64URLDecode(twToken)) : {};
          const twitterUserClient = initTwitterUserClient(token);
          const users = twitterUserClient.users.usersIdFollowing(
            user_id as string,
            {
              'user.fields': ['id']
            }
          );

          // Method 2: Check by twitter App client
          // init twitter app client
          /*const twitterAppClient = initTwitterAppClient();
          // get list users followed by user id
          const users = twitterAppClient.users.usersIdFollowing(
            user_id as string,
            {
              'user.fields': ['id']
            }
          );*/

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
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(error);
    }
    res.status(500).json({ error: 'Something went wrong.' });
  }
}
