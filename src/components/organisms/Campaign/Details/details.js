import React, { Fragment } from 'react';
import { useTranslation } from 'next-i18next';
import Moment from 'moment';
import Head from 'next/head';
import TextLink from '../../../atoms/TextLink';
// import Image from "../../../atoms/Image";
import Rewards from './Rewards';
import useThemes from '../../../../hooks/useThemes';
import { useDetails } from '../../../../hooks/Campaign';
import classes from './detail.module.css';

const Details = (props) => {
  const { slug } = props;

  const { t } = useTranslation('campaign_details');

  const { rootClassName } = useThemes();

  Moment.locale('en');

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
    if (data.campaign.length) {
      const campaign = data.campaign[0];
      pageTitle = campaign.title;

      // Build store info
      const storeLogo = campaign.store_logo_url ? (
        <img
          className={`${classes.storeLogo}`}
          src={campaign.store_logo_url}
          alt={`${campaign.store_name}`}
        />
      ) : null;
      const storeInfo = campaign.store_url ? (
        <TextLink
          className={classes.storeLink}
          target={`_blank`}
          href={campaign.store_url}
        >
          {storeLogo}
          {/* <span className={classes.storeName}> {campaign.store_name} </span> */}
        </TextLink>
      ) : (
        <span className={classes.storeName}> {campaign.store_name} </span>
      );

      // Build cover and thumb images
      const assetsBaseUrl = process.env.MEDIA_BASE_URL;
      const coverOptions = 'fit=cover';
      const coverImage =
        campaign.cover_image && campaign.cover_image.id ? (
          //Todo: Switching to use NextImage later
          // <Image
          //   className={`${classes.campaignCover}`}
          //   layout="responsive"
          //   width="100%"
          //   height="100%"
          //   src={`${assetBaseUrl}/${campaign.cover_image.id}`}
          //   alt={`cover_${campaign.slug}`}
          // />
          <img
            className={`${classes.campaignCover}`}
            src={`${assetsBaseUrl}/${campaign.cover_image.id}?${coverOptions}`}
            alt={`${campaign.cover_image.title}`}
          />
        ) : null;
      /*
      const thumbOptions = 'fit=cover';
      const thumbImage =
        campaign.thumb_image && campaign.thumb_image.id ? (
          <img
            className={`${classes.campaignThumb}`}
            src={`${assetsBaseUrl}/${campaign.thumb_image.id}?${thumbOptions}`}
            alt={`${campaign.thumb_image.title}`}
          />
        ) : null;*/

      const shortDesc = campaign.short_desc ? (
        <div
          className={classes.shortDesc}
          dangerouslySetInnerHTML={{ __html: campaign.short_desc }}
        />
      ) : null;

      const description = campaign.description ? (
        <div
          className={classes.desc}
          dangerouslySetInnerHTML={{ __html: campaign.description }}
        />
      ) : null;

      const startDate = Moment(campaign.date_start);
      const endDate = Moment(campaign.date_end);
      const now = Moment();
      let stateInfo =
        now > endDate ? (
          <div className="bg-gray-100 text-red-600 rounded-full py-1 px-3 text-sm font-medium mr-4">
            {t('Ended')}
          </div>
        ) : (
          <div className="bg-green-100 text-green-600 rounded-full py-1 px-3 text-sm font-medium mr-4">
            {t('Ongoing')}
          </div>
        );
      const datesInfo =
        campaign.date_start || campaign.date_end ? (
          <div className="bg-violet-100 text-violet-600 rounded-full px-3 py-1 font-medium text-sm">
            <span className={classes.dateStart}>
              {t('Start: ')}
              {startDate.format('DD MMM YYYY')}
            </span>
            <span className={classes.dateEnd}>
              {t('Ends: ')} {endDate.format('DD MMM YYYY')}
            </span>
          </div>
        ) : null;
      const metaInfo = (
        <div className={`${classes.campaignMeta}`}>
          {stateInfo}
          {datesInfo}
          {storeInfo}
        </div>
      );

      child = (
        <div className={`${classes.pageWrapper} dark:bg-gray-900`}>
          <div className={`${classes.pageContainer}`}>
            <div className={`${classes.pageContent}`}>
              <div className={`${classes.pageContentInner}`}>
                <div className={`${classes.coverImage}`}>{coverImage}</div>
                <h1 className={`${classes.pageTitle}`}> {campaign.title} </h1>
                {metaInfo}
                {shortDesc}
                {description}
              </div>
            </div>
            <div className={`${classes.pageSidebar}`}>
              <Rewards campaign={campaign} />
            </div>
          </div>
        </div>
      );
    } else {
      child = <div className={classes.notFound}>{t('Not Found.')}</div>;
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
