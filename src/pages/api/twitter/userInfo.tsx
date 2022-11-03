import { NextApiRequest, NextApiResponse } from 'next';
import {
  initTwitterUserClient,
  getTwToken,
  setTwToken
} from 'src/libs/twitterClient2';
import { base64URLDecode, base64URLEncode } from 'src/utils/strUtils';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const tw_token = getTwToken();
  const twUsserClient = initTwitterUserClient(tw_token);
  const twAuthClient = initTwitterAuthClient();
  if (twUsserClient.isAccessTokenExpired()) {
    const twToken = await twUsserClient.refreshAccessToken();
    setTwToken(twToken);
  }

  const response = {
    info: {}
  };
  try {
    const { task } = req.query;

    switch (task) {
      case 'getid':
        break;

      default:
        response.info = await twUsserClient.users.findMyUser();
        break;
    }
    return res.status(200).json({
      response
    });
  } catch (error) {
    // return error;
    return res.status(500).send({ error });
  }
};
