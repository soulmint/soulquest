import React, { Fragment } from 'react';
import { useTranslation } from 'next-i18next';
import Moment from 'moment';
import TextLink from '../../../atoms/TextLink';
import HeadCustom from '../../Head';
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
  let SEOChild = null;
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

      const pageTitleInfo = pageTitle ? (
        <h1 className={`${classes.pageTitle}`}>{campaign.title}</h1>
      ) : null;

      const metaInfo = (
        <div className={`${classes.campaignMeta}`}>
          {stateInfo}
          {datesInfo}
          {storeInfo}
        </div>
      );

      SEOChild = (
        <HeadCustom
          url={`${process.env.PUBLIC_URL}/campaign/${slug}`}
          openGraphType="website"
          schemaType="article"
          title={`${pageTitle} - SoulMint - The 1st SoulBound`}
          description={`${campaign.short_desc}...`}
          image={`${process.env.MEDIA_BASE_URL}/${campaign.thumb_image.id}?format=png&width=500`}
        />
      );

      child = (
        <div className={`${classes.pageWrapper} dark:bg-gray-900`}>
          <div className={`${classes.pageContainer}`}>
            <div className={`${classes.pageHeader}`}>
              {pageTitleInfo}
              {metaInfo}
            </div>
            <div className={`flex`}>
              <Rewards campaign={campaign} />
            </div>
          </div>
        </div>
      );
    } else {
      SEOChild = (
        <HeadCustom
          url={`${process.env.PUBLIC_URL}/campaign/${slug}`}
          openGraphType="website"
          schemaType="article"
          title={`${pageTitle} - SoulMint - The 1st SoulBound`}
        />
      );
      child = <div className={classes.notFound}>{t('Not Found.')}</div>;
    }
  }

  return (
    <div className={`${classes[rootClassName]}`}>
      {SEOChild}
      {child}
    </div>
  );
};

export default Details;
