import { NextApiRequest, NextApiResponse } from 'next';
import { twitterAppClient } from 'src/libs/twitterAppClient';

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
