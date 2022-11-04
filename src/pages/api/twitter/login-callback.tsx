import { NextApiRequest, NextApiResponse } from 'next';
import { getCsrfToken } from 'next-auth/react';
import { base64URLDecode } from 'src/utils/strUtils';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { code, state, error } = req.query;

    const stateDecode = JSON.parse(base64URLDecode(state as string));
    const refUrl = stateDecode.ref_url;
    const csrf = stateDecode.csrf;
    const _csrf = await getCsrfToken({ req });

    if (csrf !== _csrf) {
      res.redirect(refUrl + '?error=INVALID_CSRF');
    }

    if (code) {
      const redirectUrl = refUrl ? `${refUrl}?tw_code=${code}` : '/';
      res.redirect(redirectUrl);
      res.end();
    }
    if (error) {
      res.redirect(refUrl + '?error=' + error);
    } else {
      res.redirect(refUrl);
    }
    res.end();
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(error);
    }
    res.status(500).json({ error: 'Something went wrong.' });
  }
};
