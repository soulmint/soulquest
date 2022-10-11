import {
  initTwitterAuthClient,
  initTwitterClient
} from 'src/libs/twitterAuthClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { twEncode } from 'src/libs/useFunc';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const twitterAuthClient = initTwitterAuthClient();
    const twitterClient = initTwitterClient();
    const { code, state, reference_url, error } = req.query;
    if (state === 'login') {
      const authUrl = twitterAuthClient.generateAuthURL({
        state: `${reference_url}`,
        code_challenge_method: 's256'
      });
      res.redirect(authUrl);
      res.end();
    } else if (code) {
      const accessToken = await twitterAuthClient.requestAccessToken(
        code as string
      );
      const access_token = twEncode(JSON.stringify(accessToken));
      if (accessToken) {
        const response = await twitterClient.users.findMyUser();
        const redirectUrl = state
          ? `${state}?user=${encodeURIComponent(
              response.data.username
            )}&name=${encodeURIComponent(response.data.name)}&uid=${
              response.data.id
            }&twt=${access_token}`
          : '/';
        res.redirect(redirectUrl);
        res.end();
      } else {
        res.redirect(decodeURIComponent(state as string));
      }
    }
    if (error) {
      res.redirect(decodeURIComponent(state as string) + '?error=' + error);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(error);
    }
    res.status(404).json({ error: 'Something went wrong.' });
  }
};
