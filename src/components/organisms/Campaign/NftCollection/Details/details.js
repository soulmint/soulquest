import React, { Fragment } from 'react';
import Moment from 'moment';
import { useSession } from 'next-auth/react';
import Router from 'next/router';
import { useTranslation } from 'next-i18next';
import useThemes from '../../../../../hooks/useThemes';
import Button from '../../../../atoms/Button';
import { useDetails } from '../../../../../hooks/Campaign/NftCollection';
import classes from './detail.module.css';
import Image from '../../../../atoms/Image';
import { capitalize, ellipsify, toHTML } from '../../../../../utils/strUtils';
import List from '../../List';
import BrowserPersistence from '../../../../../utils/simplePersistence';
import Head from 'next/head';

const Details = (props) => {
  const { slug } = props;

  const { t } = useTranslation('nft_collection_details');

  const { data: session } = useSession();

  Moment.locale('en');

  const { rootClassName } = useThemes();

  const { loading, data, error } = useDetails({
    slug: { _eq: slug } ?? ''
  });

  let pageTitle = null;
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
    if (data.nft_collection) {
      const nftCollection = data.nft_collection[0];
      pageTitle = nftCollection.name;

      const handleAddCampaign = () => {
        const storage = new BrowserPersistence();
        const nftCollectionOption = [
          {
            value: parseInt(nftCollection.id),
            label: `${capitalize(nftCollection.chain_name)} > ${
              nftCollection.name
            } (${ellipsify({
              str: nftCollection.contract_address,
              start: 5,
              end: 4
            })})`
          }
        ];
        storage.setItem('nft_collection_opt_selected', nftCollectionOption);

        Router.push(`/create-campaign`);
      };
      const addCampaignButton = session ? (
        <div className={classes.addCampaignBtn}>
          <Button priority="high" type="button" onPress={handleAddCampaign}>
            {t('Submit a deal')}
          </Button>
        </div>
      ) : null;

      const coverImage = nftCollection.cover_image ? (
        <Image
          className={`${classes.nftCover}`}
          layout={`responsive`}
          width={`100%`}
          height={`100%`}
          src={nftCollection.cover_image}
          alt={`cover_${nftCollection.name}`}
        />
      ) : null;
      const thumbImage = nftCollection.thumb_image ? (
        <Image
          layout={`responsive`}
          width={`100%`}
          height={`100%`}
          src={nftCollection.thumb_image}
          alt={`thumb_${nftCollection.name}`}
        />
      ) : null;

      child = (
        <div className={`${classes[rootClassName]} ${classes.pageWrap}`}>
          <div
            className={`${classes.coverWrap} bg-gray-100 dark:bg-gray-900 bg-cover relative`}
          >
            {coverImage}
            <div className="py-32 mx-auto max-w-screen-xl relative">
              <a
                title={nftCollection.name}
                className="bg-gray-100 dark:bg-gray-900 shadow-md border-4 border-white dark:border-gray-700 block h-20 w-20 rounded-full overflow-hidden absolute -bottom-8 left-1/2 -mx-10"
              >
                {thumbImage}
              </a>
            </div>
          </div>

          <h1 className="text-gray-800 dark:text-white font-semibold text-center text-2xl md:text-4xl mt-12">
            {nftCollection.name}
          </h1>

          <div className="text-center flex justify-center items-center text-lg mt-3 font-semibold ml-6 md:ml-0 mr-6 md:mr-0">
            <span
              className={`${
                classes[nftCollection.chain_name]
              } bg-gray-50 dark:bg-gray-900 inline-block h-7 w-7 rounded-full mr-2`}
            />
            <div className="overflow-hidden max-w-full truncate text-sm md:text-xl">
              {nftCollection.contract_address}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center mt-8">
            <div className="basis-3/6 md:basis-auto text-center mb-6 md:mb-0 md:mr-6">
              <strong className="block font-bold text-xl md:text-2xl">
                {nftCollection.nft_number
                  ? nftCollection.nft_number.toLocaleString()
                  : 0}
              </strong>
              <span className="text-gray-500">{t('items')}</span>
            </div>

            <div className="basis-3/6 md:basis-auto text-center mb-6 md:mb-0 md:ml-4 md:mr-6">
              <strong className="block font-bold text-xl md:text-2xl">
                {nftCollection.nft_holder_number
                  ? nftCollection.nft_holder_number.toLocaleString()
                  : 0}
              </strong>
              <span className="text-gray-500">{t('owners')}</span>
            </div>

            <div className="basis-3/6 md:basis-auto text-center md:ml-4 md:mr-6">
              <strong className="block font-bold text-xl md:text-2xl">
                {nftCollection.total_value
                  ? nftCollection.total_value.toLocaleString()
                  : 0}
              </strong>
              <span className="text-gray-500">{t('total value')}</span>
            </div>

            <div className="basis-3/6 md:basis-auto text-center md:ml-6">
              <strong className="block font-bold text-xl md:text-2xl">
                {nftCollection.floor_price
                  ? nftCollection.floor_price.toLocaleString()
                  : 0}
              </strong>
              <span className="text-gray-500">{t('floor price')}</span>
            </div>
          </div>

          <div className={classes.pageContent}>
            <div
              className="mb-10"
              dangerouslySetInnerHTML={toHTML(nftCollection.description)}
            />

            {addCampaignButton}

            <List
              nftCollectionId={parseInt(nftCollection.id)}
              position="nft-collection-details"
            />
          </div>
        </div>
      );
    }
  }

  return (
    <Fragment>
      <Head>
        <title>{pageTitle} - SoulMint - The 1st SoulBound</title>
      </Head>
      <div className={`${classes[rootClassName]}`}>{child}</div>
    </Fragment>
  );
};

export default Details;
