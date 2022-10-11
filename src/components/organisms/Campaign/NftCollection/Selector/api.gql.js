import { gql } from '@apollo/client';

export const GET_NFT_COLLECTION = gql`
  query getNFTCollection(
    $filter: nft_collection_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
  ) {
    nft_collection(
      filter: $filter
      sort: $sort
      limit: $limit
      offset: $offset
      page: $page
      search: $search
    ) {
      id
      name
      chain_name
      contract_address
    }
  }
`;

export default {
  getNFTCollection: GET_NFT_COLLECTION
};
