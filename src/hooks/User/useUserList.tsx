import { useQuery } from '@apollo/client';
import API from './api.gql';
import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useSort } from '../Campaign/useSort';

const useUserList = (props: any) => {
  const { getCampaigns, getTotalCampaigns, getNextCampaignsFunc } = API;

  const { walletAddress } = props;

  //vars for infinite loading
  const [page, setPage] = useState(2);
  const [infiniteItems, setInfiniteItems] = useState([]);
  const [infiniteHasMore, setInfiniteHasMore] = useState(true);

  const defaultFilter = {
    user_created: { email: { _eq: walletAddress } }
  };
  const defaultLimit = 6;
  const sort: string[] = []; //['-date_created']

  // vars for filter tool bar
  const [filter] = useState(defaultFilter);
  const [limit] = useState(defaultLimit);

  // for sorting
  const sortProps = useSort();
  const [currentSort] = sortProps;
  const previousSort = useRef(currentSort);
  if (currentSort.sortDirection === 'DESC') {
    sort.push(`-${currentSort.sortAttribute}`);
  } else {
    sort.push(`${currentSort.sortAttribute}`);
  }

  // for search by keyword
  const [search, setSearch] = useState(null);
  const previousSearch = useRef(search);
  const handleSearch = useCallback(
    (event) => {
      const value = event.target.value;
      const hasValue = !!value;
      const isValid = hasValue && value.length > 2;
      if (isValid) {
        setSearch(value);
      } else {
        setSearch(null);
      }
    },
    [setSearch]
  );

  useEffect(() => {
    if (
      previousSort.current.sortAttribute !== currentSort.sortAttribute ||
      previousSort.current.sortDirection !== currentSort.sortDirection ||
      previousSearch.current !== search
    ) {
      // Reset to first page
      setPage(2);
      setInfiniteItems([]);
      setInfiniteHasMore(true);

      // And update the ref.
      previousSearch.current = search;
      previousSort.current = currentSort;
    }
  }, [search, currentSort]);

  const getNextItems = async () => {
    const nextItems = await getNextCampaignsFunc({
      search,
      filter,
      limit,
      page,
      sort
    });

    return nextItems;
  };

  // Get current total of items
  const { data: allItemsData, loading: totalItemsLoading } = useQuery(
    getTotalCampaigns,
    {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      variables: {
        filter,
        search
      }
    }
  );
  const totalItems = useMemo(() => {
    return allItemsData ? allItemsData.campaign.length : 0;
  }, [allItemsData]);

  // Loading items in first page
  const { data, loading, error } = useQuery(getCampaigns, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: {
      search,
      filter,
      limit,
      page: 1,
      sort
    }
  });

  // set infinite items from the first page
  useEffect(() => {
    if (data) {
      const size = data.campaign.length;
      if (size) {
        setInfiniteItems(data.campaign);
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
    totalItems,
    search,
    handleSearch,
    sortProps,
    page,
    setPage,
    getNextItems,
    infiniteItems,
    setInfiniteItems,
    infiniteHasMore,
    setInfiniteHasMore
  };
};
export default useUserList;
