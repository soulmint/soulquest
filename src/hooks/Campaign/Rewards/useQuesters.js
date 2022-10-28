import API from './api.gql';
import { useState, useEffect } from 'react';
import HandleGenerateWinner from './useWinner';

export default (props) => {
  const { campaignId, soulsUp, rw_method, is_ended, winnered, filters } = props;

  const { getTotalItemsFunc, getNextQuestersFunc, getFirstQuestersFunc } = API;

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
  const [filter, setFilter] = useState(filters ? filters : defaultFilter);
  const [limit, setLimit] = useState(defaultLimit);

  const [pageData, setPageData] = useState();
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState();
  const [allItems, setAllItems] = useState([]);

  const [totalItems, setTotalItems] = useState(0);
  const [totalItemsLoading, setTotalItemsLoading] = useState(true);
  const [totalItemsError, setTotalItemsError] = useState();

  // Loading items in first page
  const getFirstItems = async () => {
    const { data, loading, error } = await getFirstQuestersFunc({
      filter,
      limit,
      page: 1,
      sort
    });
    setPageData(data);
    setPageLoading(loading);
    setPageError(error);
  };

  const getNextItems = async () => {
    const nextItems = await getNextQuestersFunc({
      filter,
      limit,
      page,
      sort
    });

    return nextItems;
  };

  const getTotalItems = async () => {
    const { data, loading, error } = await getTotalItemsFunc({
      filter
    });
    data && data.quester.length && setTotalItems(data.quester.length);
    data && data.quester.length && setAllItems(data.quester);
    setTotalItemsLoading(loading);
    setTotalItemsError(error);
  };
  useEffect(async () => {
    // Load total items
    await getTotalItems();
    // Loading items in first page
    await getFirstItems();
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
    setFilter,
    totalItems,
    getNextItems,
    infiniteItems,
    setInfiniteItems,
    infiniteHasMore,
    setInfiniteHasMore
  };
};
