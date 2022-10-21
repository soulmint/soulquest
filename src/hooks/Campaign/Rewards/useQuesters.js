import { useQuery } from '@apollo/client';
import API from './api.gql';
import { useState, useMemo, useEffect } from 'react';

export default (props) => {
  const { campaignId, soulsUp } = props;

  const { getTotalItems, getNextQuestersFunc, getFirstQuestersDataFunc } = API;

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
  const [pageData, setPageData] = useState();
  const [pageLoading, setPageLoading] = useState();
  const [pageError, setPageError] = useState();
  const [totalItems, setTotalItems] = useState(0);
  const [totalItemsLoading, setTotalItemsLoading] = useState();
  const [totalItemsError, setTotalItemsError] = useState();
  const getNextItems = async () => {
    const nextItems = await getNextQuestersFunc({
      filter,
      limit,
      page,
      sort
    });

    return nextItems;
  };
  // Loading items in first page
  const firstPageData = async () => {
    const { data, loading, error } = await getFirstQuestersDataFunc({
      filter,
      limit,
      page: 1,
      sort
    });
    setPageData(data);
    setPageLoading(loading);
    setPageError(error);
  };
  const TotalItems = async () => {
    const { data, loading, error } = await getTotalItems({
      filter
    });
    setTotalItems(data.quester.length);
    setTotalItemsLoading(loading);
    setTotalItemsError(error);
  };
  // Get current total of items
  // const { data: allItemsData, loading: totalItemsLoading } = useQuery(
  //   getTotalQuesters,
  //   {
  //     fetchPolicy: 'cache-and-network',
  //     nextFetchPolicy: 'cache-first',
  //     variables: {
  //       filter
  //     }
  //   }
  // );
  // const totalItems = useMemo(() => {
  //   return allItemsData ? allItemsData.quester.length : 0;
  // }, [allItemsData]);

  // Loading items in first page
  useEffect(async () => {
    await firstPageData();
    await TotalItems();
  }, [soulsUp]);

  // set infinite items from the first page
  useEffect(async () => {
    if (pageData) {
      const size = pageData.quester.length;
      if (size) {
        setInfiniteItems(pageData.quester);
        if (size < totalItems) {
          setInfiniteHasMore(true);
        } else {
          setInfiniteHasMore(false);
        }
      }
    }
  }, [pageData, totalItems]);

  //return data
  return {
    data: pageData ? pageData : null,
    loading: pageLoading || totalItemsLoading ? true : false,
    error: pageError || totalItemsError ? true : null,
    page,
    setPage,
    totalItems,
    getNextItems,
    infiniteItems,
    setInfiniteItems,
    infiniteHasMore,
    firstPageData,
    setInfiniteHasMore
  };
};
