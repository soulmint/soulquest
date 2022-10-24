import React, { Fragment, useEffect } from 'react';
import Moment from 'moment';
import { shape, string } from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useTranslation } from 'next-i18next';
import { ellipsify } from 'src/utils/strUtils';
import Avatar from 'boring-avatars';
import useThemes from 'src/hooks/useThemes';
import { useQuesters } from 'src/hooks/Campaign/Rewards';
import defaultClasses from './winners.module.css';
import { useStyle } from 'src/components/classify';

const Winners = (props) => {
  const { classes: propClasses, campaignId } = props;

  const classes = useStyle(defaultClasses, propClasses);
  const { rootClassName } = useThemes();
  const { t } = useTranslation('campaign_details');

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
    campaignId,
    filters: {
      is_winner: { _eq: true },
      campaign_id: { _eq: campaignId },
      status: { _eq: 'approved' }
    }
  });

  useEffect(() => {
    const getQuesterItem = async () => {
      if (data && data.quester) {
        if (data.quester.length) {
          setInfiniteItems(data.quester);
        }
      }
    };
    getQuesterItem();
  }, [data, setInfiniteItems]);
  const blockHeading = (
    <h3 className="">
      {t('Winners')} ({totalItems})
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
        <>
          <div className="flex items-center text-sm space-x-4 mb-2">
            <div className="font-medium text-slate-400 w-1/12">No.</div>
            <div className="font-medium text-slate-400 text-left w-4/12">
              Time
            </div>
            <div className="text-right pr-2 font-medium text-slate-400 w-7/12">
              Soul Address
            </div>
          </div>
          <InfiniteScroll
            className={classes.questerList}
            dataLength={infiniteItems.length}
            next={fetchMoreData}
            hasMore={infiniteHasMore}
            loader={loader}
            endMessage={null}
          >
            {infiniteItems.map((quester, idx) => (
              <div
                key={quester.id}
                title={quester.user_created.email}
                className="flex items-center text-sm space-x-4 justify-between mb-2"
              >
                <div className="font-medium text-slate-400 w-1/12">
                  {parseInt(idx) + 1}
                </div>
                <div className="font-medium text-slate-400 text-left w-4/12">
                  {quester.date_created
                    ? Moment(quester.date_created).format('LT DD, MMM')
                    : ''}
                </div>
                <div
                  className={`${classes.questerAvt} text-right text-md w-7/12`}
                >
                  <span className={`${classes.souldAvatar}`}>
                    <Avatar
                      size={24}
                      name={quester.user_created.email}
                      variant="beam" //oneOf: marble (default), beam, pixel,sunset, ring, bauhaus
                      colors={[
                        '#F97316',
                        '#EAB308',
                        '#4ADE80',
                        '#6d28d9',
                        '#475569'
                      ]}
                    />
                  </span>
                  {ellipsify({
                    str: quester.user_created.email,
                    start: 7,
                    end: 8
                  })}
                </div>
              </div>
            ))}
          </InfiniteScroll>
        </>
      );
    }
  }
  return (
    <Fragment>
      <Fragment>
        <div className={`card mt-6 ${classes[rootClassName]}`}>
          <div className="card-header">{blockHeading}</div>
          <div className={`card-body text-sm ${classes.questers}`}>{child}</div>
        </div>
      </Fragment>
    </Fragment>
  );
};

Winners.propTypes = {
  classes: shape({
    root: string
  }),
  campaignId: string
};

export default Winners;
