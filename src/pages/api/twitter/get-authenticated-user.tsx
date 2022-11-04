import { NextApiRequest, NextApiResponse } from 'next';
import { getCsrfToken } from 'next-auth/react';
import { initTwitterUserClient } from 'src/libs/twitterClient';
import nextCookies from 'next-cookies';
import { base64URLDecode } from 'src/utils/strUtils';

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
    user: ''
  };

  try {
    switch (method) {
      case 'GET': {
        const twToken = nextCookies({ req }).tw_token;
        const token = twToken ? JSON.parse(base64URLDecode(twToken)) : {};
        const twitterUserClient = initTwitterUserClient(token);
        const response = await twitterUserClient.users.findMyUser();
        rs.user = response?.data;
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
