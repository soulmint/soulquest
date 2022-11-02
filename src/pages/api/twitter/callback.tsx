import { NextApiRequest, NextApiResponse } from 'next';
import { getCsrfToken } from 'next-auth/react';
import { base64URLEncode, base64URLDecode } from 'src/utils/strUtils';
import {
  initTwitterAuthClient,
  initTwitterUserClient
} from 'src/libs/twitterClient';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const twitterAuthClient = initTwitterAuthClient();
    const twitterUserClient = initTwitterUserClient();

    const { code, state, action, reference_url, error } = req.query;
    const csrfToken = await getCsrfToken({ req });

    if (action === 'login') {
      const stateEncoded = base64URLEncode(
        JSON.stringify({ csrfToken, reference_url })
      );
      const authUrl = twitterAuthClient.generateAuthURL({
        state: `${stateEncoded}`,
        code_challenge_method: 's256'
      });
      res.redirect(authUrl);
      res.end();
    } else if (code) {
      const stateDecode = JSON.parse(base64URLDecode(state as string));
      const csrf = stateDecode.csrfToken;
      const referenceUrl = stateDecode.reference_url;
      const urlDecode = encodeURIComponent(referenceUrl);
      if (csrf !== csrfToken) {
        res.redirect(urlDecode + '?error=' + error);
      }

      const twToken = await twitterAuthClient.requestAccessToken(
        code as string
      );

      const tw_token = base64URLEncode(JSON.stringify(twToken));
      if (twToken) {
        const response = await twitterUserClient.users.findMyUser();
        const userEncode = base64URLEncode(
          JSON.stringify({ ...response.data, tw_token })
        );
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
      res.redirect('/?error=' + error);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(error);
    }
    res.status(404).json({ error: 'Something went wrong.' });
  }
};
