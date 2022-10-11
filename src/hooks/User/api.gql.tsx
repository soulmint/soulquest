import { gql } from '@apollo/client';
import { initializeApollo } from 'src/libs/SystemApolloClient';

export const CREATE_USER_GQL = gql`
  mutation create_users_item($data: create_directus_users_input!) {
    create_users_item(data: $data) {
      id
      email
    }
  }
`;

export const UPDATE_USER_GQL = gql`
  mutation create_users_item($data: create_directus_users_input!) {
    create_users_item(data: $data) {
      email
    }
  }
`;

export const LOGIN_GQL = gql`
  mutation auth_login($email: String!, $password: String!) {
    auth_login(email: $email, password: $password) {
      access_token
      refresh_token
    }
  }
`;

export const AUTH_REFRESH_GQL = gql`
  mutation auth_refresh($refresh_token: String!) {
    auth_refresh(refresh_token: $refresh_token, mode: cookie) {
      access_token
      refresh_token
    }
  }
`;
export const USER_EXISTS_GQL = gql`
  query users_item($email: string_filter_operators!) {
    users(filter: { email: $email }) {
      id
      email
    }
  }
`;

export const GET_TOTAL_CAMPAIGNS = gql`
  query getCampaigns($filter: campaign_filter, $search: String) {
    campaign(filter: $filter, search: $search) {
      id
    }
  }
`;

export const GET_CAMPAIGNS = gql`
  query getCampaigns(
    $filter: campaign_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
  ) {
    campaign(
      filter: $filter
      sort: $sort
      limit: $limit
      offset: $offset
      page: $page
      search: $search
    ) {
      id
      title
      discount_value
      description
      store_name
      store_logo_url
      store_url
      #      date_created
      date_start
      date_end
      nft_collection_ids {
        #campaing_id {
        #	id
        #}
        nft_collection_id {
          #id
          name
          slug
          contract_address
          chain_name
        }
      }
      user_created {
        id
      }
    }
  }
`;

export const getNextCampaignsFunc = async (props: any) => {
  const { search, filter, limit, page, sort } = props;

  let rs = [];
  const client = initializeApollo();
  try {
    const { data } = await client.query({
      query: GET_CAMPAIGNS,
      variables: {
        search,
        filter,
        limit,
        page,
        sort
      }
      // fetchPolicy: 'no-cache'
    });
    if (data && data.campaign) {
      rs = data.campaign;
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
  CREATE_USER_GQL,
  UPDATE_USER_GQL,
  LOGIN_GQL,
  AUTH_REFRESH_GQL,
  USER_EXISTS_GQL,
  getTotalCampaigns: GET_TOTAL_CAMPAIGNS,
  getCampaigns: GET_CAMPAIGNS,
  getNextCampaignsFunc
};
