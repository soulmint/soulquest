import { GET_CLAIMED, UPDATE_WINNER } from './api.gql';
import { initializeApollo } from 'src/libs/apolloClient';
import { useMutation } from '@apollo/client';

export const getWinner = async (props) => {
  const { campaign_id, rewards_method, wallet } = props;
  if (!wallet) return null;
  const filter = {
    status: { _eq: 'approved' },
    campaign_id: { _eq: campaign_id }
  };
  let rs = null;
  let variables = {
    filter
  };
  if (rewards_method === 'fcfs') {
    variables.sort = ['date_created:asc'];
  }
  const client = initializeApollo();
  try {
    const { data } = await client.query({
      query: GET_CLAIMED,
      variables,
      fetchPolicy: 'no-cache'
    });
    if (data.quester && data.quester[0]) {
      rs = data.quester[0];
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(error);
    }
    return error;
  }

  return rs;
};
export default getWinner;
