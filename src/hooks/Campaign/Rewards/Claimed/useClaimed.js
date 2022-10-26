import { GET_CLAIMED } from './api.gql';
import { initializeApollo } from 'src/libs/apolloClient';

export async function getClaimed(props) {
  const { campaign_id, wallet } = props;
  if (!wallet) return null;
  const filter = {
    status: { _eq: 'approved' },
    campaign_id: { _eq: campaign_id },
    is_winner: { _eq: true },
    user_created: { email: { _eq: wallet } }
  };
  let rs = null;
  const client = initializeApollo();
  try {
    const { data } = await client.query({
      query: GET_CLAIMED,
      variables: { filter },
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
}
