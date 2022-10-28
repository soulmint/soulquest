import { gql } from '@apollo/client';
import { initializeApollo } from '../../../libs/apolloClient';

export const CREATE_QUESTER = gql`
  mutation CreateQuester(
    $campaign_id: String
    $tasks: String
    $status: String
  ) {
    create_quester_item(
      data: { campaign_id: $campaign_id, tasks: $tasks, status: $status }
    ) {
      id
      tasks
    }
  }
`;

export const UPDATE_QUESTER = gql`
  mutation UpdateQuester(
    $id: ID!
    $campaign_id: String
    $tasks: String
    $status: String
  ) {
    update_quester_item(
      id: $id
      data: { campaign_id: $campaign_id, tasks: $tasks, status: $status }
    ) {
      id
      tasks
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
      status
      tasks
    }
  }
`;

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
      date_created
      user_created {
        id
        email
      }
    }
  }
`;
export const GENERATE_WINNER = gql`
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

export const UPDATE_CAMPAIGN = gql`
  mutation update_campaign_item($id: ID!) {
    update_campaign_item(id: $id, data: { run_winnered: true }) {
      id
      title
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
export const getFirstQuesters = async (props) => {
  const { search, filter, limit, page, sort } = props;
  const client = initializeApollo();
  let rs;
  try {
    const { data, loading, error } = await client.query({
      query: GET_QUESTERS,
      variables: {
        search,
        filter,
        limit,
        page,
        sort
      },
      fetchPolicy: 'no-cache'
    });
    rs = { data, loading, error };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(error);
    }

    return error;
  }

  return rs;
};
export const getTotalItems = async (props) => {
  const { filter } = props;
  const client = initializeApollo();
  let rs;
  try {
    const { data, loading, error } = await client.query({
      query: GET_TOTAL_QUESTER,
      variables: {
        filter
      },
      fetchPolicy: 'no-cache'
    });
    rs = { data, loading, error };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(error);
    }

    return error;
  }

  return rs;
};
export const getAllQuesterApproved = async (props) => {
  const { search, filter, limit, page, sort } = props;
  const client = initializeApollo();
  let rs;
  try {
    const { data, loading, error } = await client.query({
      query: GET_QUESTERS,
      variables: {
        search,
        filter,
        limit,
        page,
        sort
      },
      fetchPolicy: 'no-cache'
    });
    rs = { data, loading, error };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(error);
    }

    return error;
  }

  return rs;
};

export const generateWinner = async (props) => {
  const { ids } = props;
  const client = initializeApollo();
  let rs;
  try {
    const { data, loading, error } = await client.mutate({
      mutation: GENERATE_WINNER,
      variables: {
        ids,
        data: { is_winner: true }
      },
      fetchPolicy: 'no-cache'
    });
    rs = { data, loading, error };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(error);
    }

    return error;
  }

  return rs;
};
export const updateCampaignWinner = async (props) => {
  const { campaignId } = props;
  const client = initializeApollo();
  let rs;
  try {
    const { data, loading, error } = await client.mutate({
      mutation: UPDATE_CAMPAIGN,
      variables: {
        id: campaignId
      },
      fetchPolicy: 'no-cache'
    });
    rs = { data, loading, error };
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
  updateQuester: UPDATE_QUESTER,
  getQuesters: GET_QUESTERS,
  getTotalQuesters: GET_TOTAL_QUESTER,
  isQuesterExistsFunc: isQuesterExists,
  getTotalItemsFunc: getTotalItems,
  getNextQuestersFunc: getNextQuesters,
  getFirstQuestersFunc: getFirstQuesters,
  generateWinner,
  updateCampaignWinner,
  getAllQuesterApproved
};
