import { NextApiRequest, NextApiResponse } from 'next';
import { getCsrfToken } from 'next-auth/react';
import { base64URLEncode, base64URLDecode } from 'src/utils/strUtils';
import { initTwitterAuthClient } from 'src/libs/twitterClient';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const twitterAuthClient = initTwitterAuthClient();
    const { code, state, error } = req.query;
    const csrfToken = await getCsrfToken({ req });
    const stateDecode = JSON.parse(base64URLDecode(state as string));
    const csrf = stateDecode.csrfToken;
    const referenceUrl = stateDecode.reference_url;
    const urlDecode = encodeURIComponent(referenceUrl);
    if (code) {
      if (csrf !== csrfToken) {
        res.redirect(urlDecode + '?error=' + error);
      }
      const twToken = await twitterAuthClient.requestAccessToken(
        code as string
      );
      console.log('====================================');
      console.log(twToken);
      console.log('====================================');
      const tw_token = base64URLEncode(JSON.stringify(twToken));
      if (twToken) {
        const userEncode = base64URLEncode(JSON.stringify({ tw_token }));
        const redirectUrl = referenceUrl
          ? `${referenceUrl}?user=${userEncode}`
          : '/';
        res.redirect(redirectUrl);
        res.end();
      } else {
        res.redirect(urlDecode);
      }
      if (error) {
        res.redirect(urlDecode + '?error=' + error);
      }
    } else {
      res.redirect(urlDecode + '?error=' + error);
    }
    res.end();
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(error);
    }
    res.status(404).json({ error: 'Something went wrong.' });
  }
};
