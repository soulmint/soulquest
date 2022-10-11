import React from 'react';
import { shape, string, number } from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useTranslation } from 'next-i18next';
import { Heading } from '../../../atoms/Heading';
import classes from './list.module.css';
import TextLink from '../../../atoms/TextLink';
import useThemes from '../../../../hooks/useThemes';
import { useList } from '../../../../hooks/Campaign';
import Item from './item';
import Sort from '../../Campaign/Sort';

const List = (props) => {
  const { t } = useTranslation('list_campaign');

  const { rootClassName } = useThemes();

  const { position, nftCollectionId = null } = props;

  const {
    data,
    loading,
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
  } = useList({ position, nftCollectionId });

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
    if (data.campaign && !data.campaign.length) {
      child = (
        <div className="bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 rounded-lg p-4">
          {t("Don't have Campaigns published now.")}
        </div>
      );
    } else {
      const fetchMoreData = async () => {
        if (infiniteItems.length < totalItems) {
          // Load items in next page
          const nextItems = await getNextItems();
          // Set more items
          setInfiniteItems([...infiniteItems, ...nextItems]);
          if (!nextItems.length) {
            setInfiniteHasMore(false);
          }
          setPage(page + 1);
        } else {
          setInfiniteHasMore(false);
        }
      };
      const loader = (
        <div className={classes.infiniteLoading}>{t('Loading more...')}</div>
      );
      const endMessage = (
        <div className={classes.infiniteFinished}>
          <TextLink
            title={t('Create a quest')}
            className={classes.btnCreateQuest}
            href="/"
          >
            <span>{t('Create a quest')}</span>
          </TextLink>
        </div>
      );
      child = (
        <InfiniteScroll
          className={classes.listWrap}
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

  let headingTitle = t('🎉 Browse Rewards');
  if (position === 'home-page') {
    headingTitle = t('SoulQuest');
  } else if (position === 'nft-collection-details') {
    headingTitle = t('All Rewards');
  }
  const subheading =
    position === 'home-page'
      ? t('Discover, participate and earn the most exclusive rewards.')
      : '';
  const heading = (
    <div className={classes.headingWrap}>
      <Heading HeadingType="h1" subHeading={`${subheading}`}>
        {headingTitle}
      </Heading>
    </div>
  );

  const searchField =
    totalItems || search ? (
      <div className={classes.searchField}>
        {' '}
        {}
        <input
          autoComplete="off"
          className={classes.searchInput}
          type="text"
          id="campaign_keyword"
          name="keyword"
          onChange={handleSearch}
          placeholder={t('Search by keyword...')}
        />
      </div>
    ) : null;

  const totalResult =
    totalItems || search ? (
      <div
        className={classes.totalResults}
      >{`${totalItems.toLocaleString()} ${t('items')}`}</div>
    ) : null;

  const sortOptions = [
    {
      attribute: 'discount_value',
      direction: 'ASC',
      label: t('Discount Value Ascending')
    },
    {
      attribute: 'discount_value',
      direction: 'DESC',
      label: t('Discount Value Descending')
    },
    { attribute: 'sort', direction: 'ASC', label: t('Position Ascending') },
    { attribute: 'sort', direction: 'DESC', label: t('Position Descending') },
    { attribute: 'title', direction: 'ASC', label: t('Title') }
  ];
  const sortField = totalItems ? (
    <div className={classes.sortWrap}>
      <Sort sortProps={sortProps} availableSortMethods={sortOptions} />
    </div>
  ) : null;

  const toolbar =
    position === 'campaigns-page' ? (
      <div className={classes.toolbarWrap}>
        {searchField}
        {totalResult}
        {sortField}
      </div>
    ) : null;

  return (
    <div className={`${classes[rootClassName]} bg-gray-50 dark:bg-gray-900`}>
      <div className="mx-auto max-w-screen-xl py-12 lg:py-24 px-6 lg:px-4">
        {heading}
        {toolbar}
        {child}
      </div>
    </div>
  );
};

List.propTypes = {
  classes: shape({
    root: string
  }),
  position: string,
  nftCollectionId: number
};

export default List;
