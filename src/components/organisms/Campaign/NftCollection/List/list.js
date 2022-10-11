import React, { useEffect } from 'react';
import { shape, string } from 'prop-types';
// import { Form } from 'informed';
import { useTranslation } from 'next-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Heading } from '../../../../atoms/Heading';
// import Select from '../../../../atoms/Select';
import classes from './list.module.css';
import useThemes from '../../../../../hooks/useThemes';
import { useList } from '../../../../../hooks/Campaign/NftCollection';
import Item from './item';

const List = (props) => {
  const { t } = useTranslation('list_nft_collections');

  const { rootClassName } = useThemes();

  const { position } = props;

  const {
    loading,
    data,
    error,
    page,
    setPage,
    getNextItems,
    infiniteItems,
    setInfiniteItems,
    infiniteHasMore,
    setInfiniteHasMore
  } = useList({ position });

  useEffect(() => {
    if (data) {
      if (data.nft_collection.length) {
        setInfiniteItems(data.nft_collection);
      }
    }
  }, [data]);

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
    if (data.nft_collection && !data.nft_collection.length) {
      child = (
        <div className={classes.noResult}>
          {t("Don't have NFT Collection published now.")}
        </div>
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
          className={classes.listWrap}
          dataLength={infiniteItems.length}
          next={fetchMoreData}
          hasMore={infiniteHasMore}
          loader={loader}
          endMessage={endMessage}
        >
          {infiniteItems.map((nftCollection) => (
            <Item key={nftCollection.id} data={nftCollection} />
          ))}
        </InfiniteScroll>
      );
    }
  }

  const subheading =
    position === 'home-page'
      ? t(
          'Aliquam dignissim enim ut est suscipit, ut euismod lacus tincidunt. Nunc feugiat ex id mi hendrerit, et efficitur ligula bibendum.'
        )
      : '';
  const headingTitle =
    position === 'home-page'
      ? t('Best NFT Collections')
      : t('🎉 Browse NFT Collections');
  const heading = (
    <Heading HeadingType="h1" subHeading={`${subheading}`}>
      {headingTitle}
    </Heading>
  );

  // const filters = (
  //   <div className={classes.filter}>
  //     <Form className={classes.filterForm}>
  //       <Select
  //         field="filter"
  //         items={[
  //           { label: 'Option 1', value: 'opt1' },
  //           { label: 'Option 2', value: 'opt2' }
  //         ]}
  //       />
  //     </Form>
  //   </div>
  // );

  return (
    <div className={`${classes[rootClassName]}`}>
      <div className={classes.headingWrap}>{heading}</div>

      {/* {filters} */}

      {child}
    </div>
  );
};

List.propTypes = {
  classes: shape({
    root: string
  }),
  position: string
};

export default List;
