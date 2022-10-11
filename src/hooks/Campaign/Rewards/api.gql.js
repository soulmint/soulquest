import { gql } from '@apollo/client';
import { initializeApollo } from '../../../libs/apolloClient';

export const CREATE_QUESTER = gql`
  mutation CreateQuester($campaign_id: String, $status: String) {
    create_quester_item(data: { campaign_id: $campaign_id, status: $status }) {
      id
    }
  }
`;

export const IS_QUESTER_EXISTS = gql`
  query IsQuesterExist(
    $campaign_id: string_filter_operators!
    $user_created: directus_users_filter!
  ) {
    quester(
      filter: { campaign_id: $campaign_id, user_created: $user_created }
    ) {
      id
    }
  }
`;
export const isQuesterExists = async (campaign_id, user_created) => {
  let rs = null;
  const client = initializeApollo();
  try {
    const { data } = await client.query({
      query: IS_QUESTER_EXISTS,
      variables: { campaign_id, user_created },
      fetchPolicy: 'no-cache'
    });
    if (data.quester && data.quester[0]) {
      rs = data.quester[0].id;
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(error);
    }
    return error;
  }

  return rs;
};

export const GET_TOTAL_QUESTER = gql`
  query getQuesters($filter: quester_filter, $search: String) {
    quester(filter: $filter, search: $search) {
      id
    }
  }
`;

export const GET_QUESTERS = gql`
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
      user_created {
        id
        email
      }
    }
  }
`;

export const getNextQuesters = async (props) => {
  const { search, filter, limit, page, sort } = props;

  let rs = [];
  const client = initializeApollo();
  try {
    const { data } = await client.query({
      query: GET_QUESTERS,
      variables: {
        search,
        filter,
        limit,
        page,
        sort
      }
      // fetchPolicy: 'no-cache'
    });
    if (data && data.quester) {
      rs = data.quester;
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
  createQuester: CREATE_QUESTER,
  isQuesterExistsFunc: isQuesterExists,
  getQuesters: GET_QUESTERS,
  getTotalQuesters: GET_TOTAL_QUESTER,
  getNextQuestersFunc: getNextQuesters
};
