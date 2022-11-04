import { NextApiRequest, NextApiResponse } from 'next';
import { getCsrfToken } from 'next-auth/react';
import {
  initTwitterAuthClient,
  initTwitterAuthUrl
} from 'src/libs/twitterClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    query: { code, csrf }
  } = req;

  const _csrf = await getCsrfToken({ req });
  if (csrf !== _csrf) {
    return res.status(401).send('You are not authorized to call this API');
  }

  const rs = {
    token: ''
  };

  try {
    switch (method) {
      case 'GET':
        if (code) {
          const twitterAuthClient = initTwitterAuthClient();
          initTwitterAuthUrl(csrf, code);
          const result = await twitterAuthClient.requestAccessToken(
            code as string
          );
          rs.token = result?.token;
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
