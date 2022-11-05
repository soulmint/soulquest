import { NextApiRequest, NextApiResponse } from 'next';
import nextCookies from 'next-cookies';
import { getCsrfToken } from 'next-auth/react';
import { initTwitterAuthClient } from 'src/libs/twitterClient';
import { base64URLEncode, base64URLDecode } from 'src/utils/strUtils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    query: { csrf }
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
      case 'GET': {
        const twToken = nextCookies({ req }).tw_token;
        const token = twToken ? JSON.parse(base64URLDecode(twToken)) : {};
        const twitterAuthClient = initTwitterAuthClient(token);
        const newToken = await twitterAuthClient.refreshAccessToken();
        if (newToken) {
          rs.token = base64URLEncode(JSON.stringify(newToken));
          if (process.env.NODE_ENV !== 'production') {
            console.log('[Refresh Twitter Token] ', newToken);
          }
        }
        res.status(200).json(rs);
        break;
      }
      default: {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(error);
    }
    res.status(500).json({ error: 'Something went wrong.' });
  }
}
