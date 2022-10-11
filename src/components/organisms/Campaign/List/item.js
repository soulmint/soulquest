import React from 'react';
import Router from 'next/router';
import { shape, string } from 'prop-types';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';
import Moment from 'moment';
import { toHTML, subStrWords, ellipsify } from '../../../../utils/strUtils';
import Button from '../../../atoms/Button';
import classes from './item.module.css';
import useThemes from '../../../../hooks/useThemes';
import TextLink from '../../../atoms/TextLink';

const DESC_MAX_LENGTH = 200;

const Item = (props) => {
  const { data } = props;

  const { data: session } = useSession();

  const { rootClassName } = useThemes();

  const { t } = useTranslation('campaign_details');

  Moment.locale('en');

  /*const viewDetails = () => {
    const path = `/campaign-details/${data.slug}`;
    Router.push(path);
  };*/

  const handleEdit = () => {
    const path = `/edit-campaign/${data.id}`;
    Router.push(path);
  };

  const currentUserId = session && session.id ? session.id : null;
  const editButton =
    data.user_created.id === currentUserId ? (
      <Button priority="normal" type="button" onPress={handleEdit}>
        {t('Edit')}
      </Button>
    ) : null;

  // Build NFT collection information
  const nftCollectionInfo = data.nft_collection_ids.length
    ? data.nft_collection_ids.map((nftCollection, index) => (
        <div key={index} className={`${classes.nftCollectionWrap}`}>
          <span
            className={`${classes.chain} ${
              classes[nftCollection.nft_collection_id.chain_name]
            }`}
          >
            {nftCollection.nft_collection_id.chain_name}
          </span>
          <TextLink
            className={classes.nftCollectionLink}
            href={`/nft-collection-details/${nftCollection.nft_collection_id.slug}`}
          >
            <span className={`${classes.collectionName}`}>
              {nftCollection.nft_collection_id.name}
            </span>{' '}
            <span className={classes.contractAdd}>
              (
              {ellipsify({
                str: nftCollection.nft_collection_id.contract_address,
                start: 6,
                end: 4
              })}
              )
            </span>{' '}
          </TextLink>
        </div>
      ))
    : null;

  // Build store info
  const storeLogo = data.store_logo_url ? (
    <img
      className={`${classes.storeLogo}`}
      src={data.store_logo_url}
      alt={`cover_${data.store_name}`}
    />
  ) : null;
  const storeInfo = data.store_url ? (
    <TextLink
      className={classes.storeLink}
      target={`_blank`}
      href={data.store_url}
    >
      {storeLogo}
      {/* <span className={classes.storeName}> {data.store_name} </span> */}
    </TextLink>
  ) : (
    <span className={classes.storeName}> {data.store_name} </span>
  );

  const discountAmountInfo = data.discount_value ? (
    <span className={classes.couponAmoun}>
      {data.discount_value}% {t('Off')}
    </span>
  ) : null;

  // Build cover and thumb images
  const assetsBaseUrl = process.env.MEDIA_BASE_URL;
  const coverOptions = 'fit=cover';
  const thumbOptions = 'fit=cover';
  const coverImage =
    data.cover_image && data.cover_image.id ? (
      <img
        className={`${classes.campaignCover}`}
        src={`${assetsBaseUrl}/${data.cover_image.id}?${coverOptions}`}
        alt={`${data.cover_image.title}`}
      />
    ) : null;
  /*const thumbImage =
    data.thumb_image && data.thumb_image.id ? (
      <img
        className={`${classes.campaignThumb}`}
        src={`${assetsBaseUrl}/${data.thumb_image.id}?${thumbOptions}`}
        alt={`${data.thumb_image.title}`}
      />
    ) : null;*/

  const dateStart = data.date_start
    ? t('Start from ') + Moment(data.date_start).fromNow()
    : '';
  const dateEnd = data.date_end
    ? t('Ends ') + Moment(data.date_end).fromNow()
    : '';

  const shortDesc = data.short_desc ? (
    <div
      dangerouslySetInnerHTML={toHTML(
        subStrWords(data?.short_desc, DESC_MAX_LENGTH)
      )}
    />
  ) : null;

  return (
    <div className={`${classes[rootClassName]} p-4`}>
      <div className="mb-6 relative">
        <div
          className={`${classes.itemCover} bg-gray-100 dark:bg-gray-900 overflow-hidden relative rounded-lg shadow-sm flex items-center justify-center`}
        >
          {coverImage}
          {/* {storeInfo} */}
        </div>

        <span className="bg-green-100 text-green-600 inline-block absolute -bottom-3 left-4 flex items-center rounded-xl text-xs py-1 pl-1.5 pr-2 w-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            fill="currentColor"
            className="bi bi-check-circle-fill mr-1"
            viewBox="0 0 16 16"
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
          </svg>
          {t('Verified')}
        </span>
      </div>

      <div className="mb-4">
        <h3 className="text-[22px] lg:text-xl text-gray-800 dark:text-white font-semibold leading-7 my-0">
          {data.title}
        </h3>
      </div>

      <div className="flex flex-wrap items-center text-sm justify-between mb-4 -mt-2">
        <span className={`${classes.dateStart}`}>{dateStart}</span>
        <span className={`${classes.dateEnd}`}>{dateEnd}</span>
      </div>

      <div
        className={`${classes.itemDesc} text-gray-600 dark:text-gray-500 mb-4`}
      >
        {/* {thumbImage} */}

        {shortDesc}
      </div>

      <div className="flex items-center flex-wrap mb-4">
        {nftCollectionInfo}
      </div>

      {editButton}

      {/* <div className={classes.itemFoot}>
        {storeInfo}
        {discountAmountInfo}
      </div> */}

      <TextLink
        title={t('Join this quest')}
        className={`${classes.getCoupon} bg-gray-200 dark:bg-gray-700 hover:bg-violet-500 focus:bg-violet-500 text-gray-700 dark:text-gray-400 hover:text-white focus:text-white focus:outline-none rounded-lg font-medium flex jusity-center block w-full text-center text-md py-3 px-0 mt-auto transition-all duration-300`}
        href={`/campaign-details/${data.slug}`}
      >
        <span>{t('Join this quest')}</span>
      </TextLink>

      <TextLink
        title={t('Join this quest')}
        className="block absolute left-0 top-0 right-0 bottom-0 w-full"
        href={`/campaign-details/${data.slug}`}
      >
        <span>{t('')}</span>
      </TextLink>
    </div>
  );
};

Item.propTypes = {
  classes: shape({
    root: string
  }),
  data: shape({
    id: string,
    title: string
  })
};

export default Item;
