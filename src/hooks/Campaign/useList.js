import { useQuery } from '@apollo/client';
import API from './list.api.gql';
import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useSort } from './useSort';

export default (props) => {
  const { getCampaigns, getTotalCampaigns, getNextCampaignsFunc } = API;

  const { position, currentCampaign = null, nftCollectionId } = props;

  //vars for infinite loading
  const [page, setPage] = useState(2);
  const [infiniteItems, setInfiniteItems] = useState([]);
  const [infiniteHasMore, setInfiniteHasMore] = useState(true);

  let defaultFilter = {
    status: { _eq: 'published' }
  };
  let defaultLimit = 6;
  let sort = []; //['-date_created']

  if (position === 'related') {
    defaultLimit = 5;
    defaultFilter.id = { _neq: parseInt(currentCampaign.id) };

    // filter by same nft collections
    const nftCollectionIds = [];
    if (currentCampaign.nft_collection_ids.length) {
      currentCampaign.nft_collection_ids.map(function (item) {
        nftCollectionIds.push(parseInt(item.nft_collection_id.id));
      });
    }
    if (nftCollectionIds.length) {
      defaultFilter.nft_collection_ids = {
        nft_collection_id: { id: { _in: nftCollectionIds } }
      };
    }
  } else if (position === 'nft-collection-details') {
    if (nftCollectionId) {
      defaultFilter.nft_collection_ids = {
        nft_collection_id: { id: { _eq: nftCollectionId } }
      };
    }
  } else if (position === 'home-page') {
    defaultFilter.is_featured = { _eq: true };
  }

  // vars for filter toolbar
  const [filter, setFilter] = useState(defaultFilter);
  const [limit, setLimit] = useState(defaultLimit);

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
    [search, setSearch]
  );

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

  // reset vars if needed
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
