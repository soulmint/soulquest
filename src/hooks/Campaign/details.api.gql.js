import { gql } from '@apollo/client';
import { initializeApollo } from '../../libs/apolloClient';

export const LOAD_CAMPAIGN_BY_SLUG = gql`
  query LoadCampainBySlug($slug: string_filter_operators!) {
    campaign(filter: { slug: $slug, status: { _eq: "published" } }) {
      id
      slug
      title
      short_desc
      description
      nft_collection_ids {
        nft_collection_id {
          id
          name
          slug
          contract_address
          chain_name
        }
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
      reward_overview
      twitter_username
      twitter_owner_id
      twitter_tweet
      twitter_tweet_id
      discount_value
      store_name
      store_logo_url
      store_url
      date_start
      date_end
      user_created {
        id
      }
      how_to_claim
    }
  }
`;

export const GET_COUPON_CODES_BY_SLUG = gql`
  query GetCouponCodesBySlug($slug: string_filter_operators!) {
    campaign(filter: { slug: $slug }) {
      coupon_codes
    }
  }
`;
export const getCouponCodes = async (slug) => {
  let rs = null;
  const client = initializeApollo();
  try {
    const { data } = await client.query({
      query: GET_COUPON_CODES_BY_SLUG,
      variables: { slug },
      fetchPolicy: 'no-cache'
    });
    if (data.campaign && data.campaign[0]) {
      rs = data.campaign[0].coupon_codes;
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
  getCampaign: LOAD_CAMPAIGN_BY_SLUG,
  getCouponCodes
};
