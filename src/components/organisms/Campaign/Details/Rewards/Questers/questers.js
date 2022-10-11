import React, { Fragment, useEffect } from 'react';
import { shape, string } from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useTranslation } from 'next-i18next';
import useThemes from '../../../../../../hooks/useThemes';
import { useQuesters } from '../../../../../../hooks/Campaign/Rewards';
import defaultClasses from './questers.module.css';
import { useStyle } from '../../../../../classify';
import { ellipsify } from '../../../../../../utils/strUtils';
import Avatar from 'boring-avatars';

const Questers = (props) => {
  const { classes: propClasses, campaignId } = props;
  const classes = useStyle(defaultClasses, propClasses);
  const { t } = useTranslation('campaign_details');
  const { rootClassName } = useThemes();

  const {
    data,
    loading,
    error,
    page,
    setPage,
    totalItems,
    getNextItems,
    infiniteItems,
    setInfiniteItems,
    infiniteHasMore,
    setInfiniteHasMore
  } = useQuesters({
    campaignId
  });

  useEffect(() => {
    if (data) {
      if (data.quester.length) {
        setInfiniteItems(data.quester);
      }
    }
  }, [data, setInfiniteItems]);

  const blockHeading = (
    <h3 className="border-b border-gray-200 dark:border-gray-700 border-opacity-60 dark:border-opacity-50 text-lg lg:text-lg font-semibold py-3 px-6">
      {t('Souls')} ({totalItems})
    </h3>
  );

  let child = null;
  if (!data) {
    if (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(error);
      }
      child = t('Something went wrong.');
    } else if (loading) {
      child = <div className={classes.loading}>{t('Loading...')}</div>;
    }
  } else {
    if (data.quester && !data.quester.length) {
      child = <div className={classes.noResult}>{t('No result.')}</div>;
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
      /*const endMessage = (
        <div className={classes.infiniteFinished}>
          <span>{t('That is all!')}</span>
        </div>
      );*/
      child = (
        <InfiniteScroll
          className={classes.questerList}
          dataLength={infiniteItems.length}
          next={fetchMoreData}
          hasMore={infiniteHasMore}
          loader={loader}
          endMessage={null}
        >
          {infiniteItems.map((quester) => (
            <div
              key={quester.id}
              title={quester.user_created.email}
              className={`${classes.questerAvt}`}
            >
              <span className={`${classes.souldAvatar}`}>
                <Avatar
                  size={45}
                  name={quester.user_created.email}
                  variant="beam" //oneOf: marble (default), beam, pixel,sunset, ring, bauhaus
                  colors={[
                    '#92A1C6',
                    '#146A7C',
                    '#F0AB3D',
                    '#C271B4',
                    '#C20D90'
                  ]}
                />
              </span>
              {ellipsify({
                str: quester.user_created.email,
                start: 4,
                end: 4
              })}
            </div>
          ))}
        </InfiniteScroll>
      );
    }
  }

  return (
    <Fragment>
      <div className={`${classes[rootClassName]}`}>
        {blockHeading}
        <div className={classes.questers}>{child}</div>
      </div>
    </Fragment>
  );
};

Questers.propTypes = {
  classes: shape({
    root: string
  }),
  campaignId: string
};

export default Questers;
