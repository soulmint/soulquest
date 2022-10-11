import React, { Fragment, useEffect } from 'react';
import { shape, string } from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useTranslation } from 'next-i18next';
import defaultClasses from './related.module.css';
import useThemes from '../../../../hooks/useThemes';
import { useStyle } from '../../../classify';
import { useList } from '../../../../hooks/Campaign';
import Item from './item';

const Related = (props) => {
  const { currentCampaign, classes: propClasses } = props;

  const classes = useStyle(defaultClasses, propClasses);

  const { t } = useTranslation('common');

  const { rootClassName } = useThemes();

  const {
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
  } = useList({
    position: 'related',
    currentCampaign
  });

  useEffect(() => {
    if (data) {
      if (data.campaign.length) {
        setInfiniteItems(data.campaign);
      }
    }
  }, [data]);

  let blockHeading = (
    <h3 className={classes.boxTitle}>{t('Other campaigns')}</h3>
  );

  let child = null;
  if (!data) {
    if (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(error);
      }
      child = t('Something went wrong.');
    } else if (loading) {
      child = <div>{t('Loading...')}</div>;
    }
  } else {
    if (data.campaign && !data.campaign.length) {
      child = (
        <div className={classes.noResult}>{t('No related campaigns.')}</div>
      );
    } else {
      const fetchMoreData = async () => {
        // Load items in next page
        const nextItems = await getNextItems();
        // Set more items
        setInfiniteItems([...infiniteItems, ...nextItems]);

        if (!nextItems.length) {
          setInfiniteHasMore(false);
        }
        setPage(page + 1);
      };
      const loader = (
        <div className={classes.infiniteLoading}>{t('Loading more...')}</div>
      );
      const endMessage = (
        <div className={classes.infiniteFinished}>
          <span>{t('That is all!')}</span>
        </div>
      );

      child = (
        <InfiniteScroll
          className={classes.campaignList}
          dataLength={infiniteItems.length}
          next={fetchMoreData}
          hasMore={infiniteHasMore}
          loader={loader}
          endMessage={endMessage}
        >
          {infiniteItems.map((campaign) => (
            <Item key={campaign.id} data={campaign} />
          ))}
        </InfiniteScroll>
      );
    }
  }
  return (
    <Fragment>
      <div className={`${classes[rootClassName]}`}>
        {blockHeading}
        <div className={classes.boxBody}>{child}</div>
      </div>
    </Fragment>
  );
};

Related.propTypes = {
  classes: shape({
    root: string
  }),
  currentCampaign: shape({
    id: string,
    title: string
  })
};

export default Related;
