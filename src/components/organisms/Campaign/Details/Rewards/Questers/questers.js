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
import { useSelector, useDispatch } from 'react-redux';
import { setSoulsUp } from 'src/store/user/operations';

const Questers = (props) => {
  const { classes: propClasses, campaignId } = props;
  const classes = useStyle(defaultClasses, propClasses);
  const { t } = useTranslation('campaign_details');
  const { rootClassName } = useThemes();

  const soulsUp = useSelector((state) => state.user.souls_up);
  const dispatch = useDispatch();

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
    setInfiniteHasMore,
    firstPageData
  } = useQuesters({
    campaignId,
    soulsUp
  });

  useEffect(async () => {
    if (data) {
      if (data.quester.length) {
        setInfiniteItems(data.quester);
      }
    }
  }, [data, firstPageData, setInfiniteItems]);

  const blockHeading = (
    <h3 className="">
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
      <div className={`card mt-6 ${classes[rootClassName]}`}>
        <div className="card-header">{blockHeading}</div>
        <div className={`card-body text-sm ${classes.questers}`}>{child}</div>
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
