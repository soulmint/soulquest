import { gql } from '@apollo/client';

export const LOAD_NFT_COLLECTION_BY_SLUG = gql`
  query LoadNftCollectionBySlug($slug: string_filter_operators!) {
    nft_collection(filter: { slug: $slug }) {
      id
      name
      #      category
      chain_name
      contract_address
      cover_image
      thumb_image
      description
      nft_number
      nft_holder_number
      total_value
      floor_price
      discord
      telegram
    }
  }
`;

export default {
  getNftCollection: LOAD_NFT_COLLECTION_BY_SLUG
};
