import { gql } from '@apollo/client';
import { initializeApollo } from 'src/libs/apolloClient';

export const GET_CLAIMED = gql`
  query getQuesters(
    $filter: quester_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
  ) {
    quester(
      filter: $filter
      sort: $sort
      limit: $limit
      offset: $offset
      page: $page
      search: $search
    ) {
      id
      campaign_id
      date_created
      is_winner
      is_claimed
      user_created {
        id
        email
      }
    }
  }
`;
export const UPDATE_WINNER = gql`
  mutation update_quester_items(
    $filter: quester_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $ids: [ID]!
    $data: update_quester_input!
  ) {
    update_quester_items(
      filter: $filter
      sort: $sort
      limit: $limit
      offset: $offset
      page: $page
      search: $search
      ids: $ids
      data: $data
    ) {
      id
      campaign_id
      date_created
      user_created {
        id
        email
      }
    }
  }
`;
export const getClaimedFunc = async (props) => {
  const { campaign_id, wallet } = props;
  if (!wallet) return null;
  const filters = {
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
      variables: { filters },
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
export default {
  GET_CLAIMED,
  getClaimedFunc
};
