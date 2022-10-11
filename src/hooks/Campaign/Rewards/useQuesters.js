import { useQuery } from '@apollo/client';
import API from './api.gql';
import { useState, useMemo, useEffect } from 'react';

export default (props) => {
  const { getQuesters, getTotalQuesters, getNextQuestersFunc } = API;

  const { campaignId } = props;

  //vars for infinite loading
  const [page, setPage] = useState(2);
  const [infiniteItems, setInfiniteItems] = useState([]);
  const [infiniteHasMore, setInfiniteHasMore] = useState(true);

  let defaultFilter = {
    status: { _eq: 'approved' },
    campaign_id: { _eq: campaignId }
  };
  let defaultLimit = 10;
  let sort = ['-date_created'];

  // vars for filter toolbar
  const [filter, setFilter] = useState(defaultFilter);
  const [limit, setLimit] = useState(defaultLimit);

  const getNextItems = async () => {
    const nextItems = await getNextQuestersFunc({
      filter,
      limit,
      page,
      sort
    });

    return nextItems;
  };

  // Get current total of items
  const { data: allItemsData, loading: totalItemsLoading } = useQuery(
    getTotalQuesters,
    {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      variables: {
        filter
      }
    }
  );
  const totalItems = useMemo(() => {
    return allItemsData ? allItemsData.quester.length : 0;
  }, [allItemsData]);

  // Loading items in first page
  const { data, loading, error } = useQuery(getQuesters, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: {
      filter,
      limit,
      page: 1,
      sort
    }
  });

  // set infinite items from the first page
  useEffect(() => {
    if (data) {
      const size = data.quester.length;
      if (size) {
        setInfiniteItems(data.quester);
        if (size < totalItems) {
          setInfiniteHasMore(true);
        } else {
          setInfiniteHasMore(false);
        }
      }
    }
  }, [data, totalItems]);

  //return data
  return {
    data,
    loading: loading || totalItemsLoading ? true : false,
    error,
    page,
    setPage,
    totalItems,
    getNextItems,
    infiniteItems,
    setInfiniteItems,
    infiniteHasMore,
    setInfiniteHasMore
  };
};
