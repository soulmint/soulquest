import {
  initTwitterAuthClient,
  initTwitterClient
} from 'src/libs/twitterAuthClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { getCsrfToken } from 'next-auth/react';
import { base64URLEncode, base64URLDecode } from 'src/utils/strUtils';
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const twitterAuthClient = initTwitterAuthClient();
    const twitterClient = initTwitterClient();
    const { code, state, action, reference_url, error } = req.query;
    const csrfToken = await getCsrfToken({ req });

    if (action === 'login') {
      const stateEncode = base64URLEncode(
        JSON.stringify({ csrfToken, reference_url })
      );
      const authUrl = twitterAuthClient.generateAuthURL({
        state: `${stateEncode}`,
        code_challenge_method: 's256'
      });
      res.redirect(authUrl);
      res.end();
    } else if (code) {
      const StateDecode = JSON.parse(base64URLDecode(state as string));
      const csrf = StateDecode.csrfToken;
      const referenceUrl = StateDecode.reference_url;
      if (csrf !== csrfToken) {
        res.redirect(
          decodeURIComponent(referenceUrl as string) + '?error=' + error
        );
      }
      const accessToken = await twitterAuthClient.requestAccessToken(
        code as string
      );

      const access_token = base64URLEncode(JSON.stringify(accessToken));
      if (accessToken) {
        const response = await twitterClient.users.findMyUser();
        const userEncode = base64URLEncode(
          JSON.stringify({ ...response.data, access_token })
        );
        const redirectUrl = referenceUrl
          ? `${referenceUrl}?user=${userEncode}`
          : '/';
        res.redirect(redirectUrl);
        res.end();
      } else {
        res.redirect(decodeURIComponent(referenceUrl as string));
      }
      if (error) {
        res.redirect(
          decodeURIComponent(referenceUrl as string) + '?error=' + error
        );
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
