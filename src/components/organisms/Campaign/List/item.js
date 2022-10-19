import React from 'react';
import Router from 'next/router';
import { shape, string } from 'prop-types';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import Moment from 'moment';
import Button from 'src/components/atoms/Button';
import Image from 'src/components/atoms/Image';
import classes from './item.module.css';
import useThemes from 'src/hooks/useThemes';
import TextLink from 'src/components/atoms/TextLink';
import { toHTML, subStrWords } from 'src/utils/strUtils';
import RelatedNftInfo from 'src/components/organisms/Campaign/RelatedNftInfo';
import { fail } from 'assert';

import { HiBadgeCheck } from 'react-icons/hi';

const DESC_MAX_LENGTH = 200;

const Item = (props) => {
  const { data } = props;

  const userState = useSelector((state) => state.user);

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

  const editButton =
    userState.id && userState.id === data.user_created.id ? (
      <Button priority="normal" type="button" onPress={handleEdit}>
        {t('Edit')}
      </Button>
    ) : null;

  // Build NFT collection information
  const nftCollectionInfo = data.nft_collection_ids.length ? (
    <RelatedNftInfo
      nftCollections={data.nft_collection_ids}
      showCollectionLink={false}
      showChainName={true}
    />
  ) : null;

  // Build store info
  /*const storeLogo = data.store_logo_url ? (
    <img
      className={`${classes.storeLogo}`}
      src={data.store_logo_url}
      alt={`cover_${data.store_name}`}
    />
  ) : null;*/

  /*const storeInfo = data.store_url ? (
    <TextLink
      className={classes.storeLink}
      target={`_blank`}
      href={data.store_url}
    >
      {storeLogo}
      {/!* <span className={classes.storeName}> {data.store_name} </span> *!/}
    </TextLink>
  ) : (
    <span className={classes.storeName}> {data.store_name} </span>
  );*/

  /*const discountAmountInfo = data.discount_value ? (
    <span className={classes.couponAmoun}>
      {data.discount_value}% {t('Off')}
    </span>
  ) : null;*/

  // Build cover and thumb images
  const assetsBaseUrl = process.env.MEDIA_BASE_URL;
  const coverOptions = 'fit=cover';
  // const thumbOptions = 'fit=cover';
  const coverImage =
    data.cover_image && data.cover_image.id ? (
      <Image
        layout="fill"
        className={`${classes.campaignCover}`}
        placeholder="blur"
        src={`${assetsBaseUrl}/${data.cover_image.id}?${coverOptions}`}
        alt={`cover_${data.slug}`}
      />
    ) : null;
  /*const thumbImage =
    data.thumb_image && data.thumb_image.id ? (
      <Image
        layout="fill"
        className={`${classes.campaignThumb}`}
        placeholder="blur"
        src={`${assetsBaseUrl}/${data.thumb_image.id}?${thumbOptions}`}
        alt={`cover_${data.slug}`}
      />
    ) : null;*/

  const dateStart = data.date_start
    ? t('Start ') + Moment(data.date_start).fromNow()
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
    <div className={`${classes[rootClassName]}`}>
      <div className="relative rounded-lg overflow-hidden">
        <div
          className={`${classes.itemCover} bg-gray-100 dark:bg-gray-900 overflow-hidden relative rounded-lg shadow-sm flex items-center justify-center`}
        >
          {coverImage}
          {/* {storeInfo} */}
        </div>

        <div className="bg-slate-700 text-white bg-opacity-80 backdrop-filter backdrop-blur px-6 py-2 font-medium text-sm justify-between flex absolute bottom-0 left-0 right-0">
          <span className={``}>Ongoing</span>
          {/* <span className={`${classes.dateStart}`}>{dateStart}</span> */}
          {/* <span className="mx-2">|</span> */}
          <span className={`${classes.dateEnd}`}>{dateEnd}</span>
        </div>

        <span className="font-bold bg-green-200 text-green-700 items-center rounded-xl text-sm py-0.5 pl-1 pr-2 w-auto inline-flex absolute top-5 left-6">
          <HiBadgeCheck className="text-2xl mr-1" />
          {t('Verified')}
        </span>
      </div>

      <div className={`${classes.itemBody}`}>
        <div className="mb-4">
          <h3 className={`${classes.itemTitle}`}>
            <span className="mr-1">{data.title}</span>
          </h3>
        </div>

        <div className="list-pair">
          <div className="list-pair--item">
            <div className="pair-title">Provider</div>
            <a target="_blank" href="https://app.sided.fi/" rel="noreferrer">
              <span className="pair-value">
                <span className="pair-value--logo">
                  <img
                    src="https://app.sided.fi/assets/icon.svg"
                    title="SidedFinance"
                  />
                </span>
                SidedFinance
              </span>
            </a>
          </div>
          <div className="list-pair--item">
            <div className="pair-title">Rewards</div>
            <div className="pair-value">500 USDC</div>
          </div>
          <div className="list-pair--item">
            <div className="pair-title">Chains</div>
            <div className="pair-value">
              <div className="">BSC, Ethereum</div>
            </div>
          </div>
          <div className="list-pair--item">
            <div className="pair-title">Rquired NFTs</div>
            <div className="pair-value">
              <div className="">
                <div className="flex items-center">
                  <span
                    className="mr-1"
                    title="Binance Account Bound Token (BABT)"
                  >
                    <img
                      src="/chains/bsc.svg"
                      title="Binance Account Bound Token (BABT)"
                      className="w-6 h-6"
                    />
                  </span>
                  <span className="relatedNftInfo_chainName__ZJd83">BABT</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`${classes.itemDesc}`}>
          {/* {thumbImage} */}
          {shortDesc}
        </div>

        {/* <div className="flex items-center flex-wrap mb-4">
          {nftCollectionInfo}
        </div> */}

        {editButton}

        {/* <div className={classes.itemFoot}>
          {storeInfo}
          {discountAmountInfo}
        </div> */}

        {/* <TextLink
          title={t('Join this quest')}
          className={`${classes.getCoupon} bg-gray-200 dark:bg-gray-700 hover:bg-violet-500 focus:bg-violet-500 text-gray-700 dark:text-gray-400 hover:text-white focus:text-white focus:outline-none rounded-lg font-medium flex jusity-center block w-full text-center text-md py-3 px-0 mt-auto transition-all duration-300`}
          href={`/campaign-details/${data.slug}`}
        >
          <span>{t('Join this quest')}</span>
        </TextLink> */}

        <TextLink
          title={t('Join this quest')}
          className="block absolute left-0 top-0 right-0 bottom-0 w-full"
          href={`/campaign-details/${data.slug}`}
        >
          <span>{t('')}</span>
        </TextLink>
      </div>
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
