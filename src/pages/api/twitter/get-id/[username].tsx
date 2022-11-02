import { NextApiRequest, NextApiResponse } from 'next';
import { initTwitterAppClient } from 'src/libs/twitterClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    query: { username }
  } = req;

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
