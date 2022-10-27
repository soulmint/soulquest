import { gql } from '@apollo/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { initializeApollo } from 'src/libs/SystemApolloClient';
import API from 'src/hooks/Campaign/Rewards/api.gql';
import utils from 'src/libs/utils';
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log('====================================');
    console.log('req.query', req.query);
    console.log('====================================');
    const { campaignId, task, rwnumber } = req.query;
    const apolloClient = initializeApollo();

    const { getQuesters, generateWinner } = API;
    const { data } = await apolloClient.query({
      query: getQuesters,
      variables: {
        filter: {
          status: { _eq: 'approved' },
          campaign_id: { _eq: campaignId }
        },
        sort: ['date_created']
      }
    });
    if (task === 'fcfs') {
      return res.status(200).json(data);
    }
    return res.status(200).json({ message: 'Hello World' });
  } catch (error) {
    // return error;
    if (process.env.NODE_ENV !== 'production') {
      console.log('Questers > Generate winning numbers: ', error);
    }
    return res.status(500).send({ error });
  }
};
