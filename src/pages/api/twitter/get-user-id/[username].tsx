import { NextApiRequest, NextApiResponse } from 'next';
import { getCsrfToken } from 'next-auth/react';
import { initTwitterAppClient } from 'src/libs/twitterClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    query: { username, csrf }
  } = req;

  const _csrf = await getCsrfToken({ req });
  if (csrf !== _csrf) {
    return res.status(401).send('You are not authorized to call this API');
  }

  const rs = {
    id: ''
  };

  switch (method) {
    case 'GET':
      if (username) {
        //init twitter app client
        const twitterAppClient = initTwitterAppClient();

        // get user by username
        const user = await twitterAppClient.users.findUserByUsername(
          username as string,
          {
            'user.fields': ['id']
          }
        );
        if (user && user.data && user.data.id) {
          rs.id = user.data.id;
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
