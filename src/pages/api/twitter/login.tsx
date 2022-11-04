import { NextApiRequest, NextApiResponse } from 'next';
import { getCsrfToken } from 'next-auth/react';
import {
  initTwitterAuthClient,
  initTwitterAuthUrl
} from 'src/libs/twitterClient';
import { base64URLEncode } from 'src/utils/strUtils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    query: { csrf, ref_url }
  } = req;

  const _csrf = await getCsrfToken({ req });
  if (csrf !== _csrf) {
    return res.status(401).send('You are not authorized to call this API');
  }

  try {
    switch (method) {
      case 'GET': {
        initTwitterAuthClient();
        const authUrl = initTwitterAuthUrl(
          csrf,
          base64URLEncode(JSON.stringify({ csrf, ref_url }))
        );
        res.redirect(authUrl);
        res.end();
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
