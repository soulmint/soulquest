import { gql } from '@apollo/client';
import { initializeApollo } from '../../../libs/apolloClient';

export const GET_NFT_COLLECTIONS = gql`
  query getNftCollections(
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
      slug
      category
      chain_name
      contract_address
      cover_image
      thumb_image
      description
      nft_holder_number
      total_value
      discord
      telegram
    }
  }
`;

export const getNextNftCollectionsFunc = async (props) => {
  const { filter, limit, page, sort } = props;

  let rs = [];
  const client = initializeApollo();
  try {
    const { data } = await client.query({
      query: GET_NFT_COLLECTIONS,
      variables: {
        filter,
        limit,
        page,
        sort
      }
      // fetchPolicy: 'no-cache'
    });
    if (data && data.nft_collection) {
      rs = data.nft_collection;
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
  getNftCollections: GET_NFT_COLLECTIONS,
  getNextNftCollectionsFunc
};
