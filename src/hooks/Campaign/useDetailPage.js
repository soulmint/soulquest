import API from './details.api.gql';
import { initializeApollo } from '../../libs/apolloClient';

export async function getCampaignDetail(props) {
  const { slug } = props;
  if (!slug) return null;
  const { getCampaignBySlug } = API;

  let rs = null;
  const client = initializeApollo();
  try {
    const { data } = await client.query({
      query: getCampaignBySlug,
      variables: { slug },
      fetchPolicy: 'no-cache'
    });
    if (data.campaign && data.campaign[0]) {
      rs = data.campaign[0];
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(error);
    }
    return error;
  }

  return rs;
}
