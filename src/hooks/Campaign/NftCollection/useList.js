import { useQuery } from '@apollo/client';
import API, { getNextNftCollectionsFunc } from './list.api.gql';
import { useState } from 'react';

export default (props) => {
  const { getNftCollections, getNextCampaignsFunc } = API;

  //vars for infinite loading
  const [page, setPage] = useState(2);
  const [infiniteItems, setInfiniteItems] = useState([]);
  const [infiniteHasMore, setInfiniteHasMore] = useState(true);

  let defaultFilter = {
    status: { _eq: 'published' }
  };
  let defaultLimit = 6;
  let defaultSort = ['-date_created'];

  // vars for filter tool bar
  const [filter, setFilter] = useState(defaultFilter);
  const [limit, setLimit] = useState(defaultLimit);
  const [sort, setSort] = useState(defaultSort);

  const getNextItems = async () => {
    const nextItems = await getNextNftCollectionsFunc({
      filter,
      limit,
      page,
      sort
    });

    return nextItems;
  };

  // Loading items in first page
  const { data, loading, error } = useQuery(getNftCollections, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: {
      filter,
      limit,
      page: 1,
      sort
    }
  });

  //return data
  return {
    data,
    loading,
    error,
    page,
    setPage,
    getNextItems,
    infiniteItems,
    setInfiniteItems,
    infiniteHasMore,
    setInfiniteHasMore
  };
};
