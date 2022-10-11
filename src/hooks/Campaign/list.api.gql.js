import { gql } from '@apollo/client';
import { initializeApollo } from '../../libs/apolloClient';

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
      slug
      discount_value
      short_desc
      #      description
      store_name
      store_logo_url
      store_url
      #      date_created
      date_start
      date_end
      nft_collection_ids {
        #          campaing_id {
        #              id
        #          }
        nft_collection_id {
          #           id
          name
          slug
          contract_address
          chain_name
        }
      }
      user_created {
        id
      }
      thumb_image {
        id
        title
        #          filename_download
      }
      cover_image {
        id
        title
        #          filename_download
      }
    }
  }
`;

export const getNextCampaignsFunc = async (props) => {
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
  getTotalCampaigns: GET_TOTAL_CAMPAIGNS,
  getCampaigns: GET_CAMPAIGNS,
  getNextCampaignsFunc
};
