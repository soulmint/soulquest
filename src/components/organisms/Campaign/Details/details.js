import React from 'react';
import { useTranslation } from 'next-i18next';
import Moment from 'moment';
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

      const startDate = Moment(campaign.date_start);
      const endDate = Moment(campaign.date_end);
      const now = Moment();
      let stateInfo =
        now > endDate ? (
          <div className="bg-gray-100 text-red-600 rounded-full py-1 px-3 text-sm font-medium mr-4">
            {t('Ended')}
          </div>
        ) : (
          <div className="bg-green-300 text-slate-800 rounded-full py-1 px-3 text-sm font-bold mr-4">
            {t('Ongoing')}
          </div>
        );
      const datesInfo =
        campaign.date_start || campaign.date_end ? (
          <div className="bg-violet-200 text-slate-800 rounded-full px-3 py-1 font-medium text-sm">
            <span className={classes.dateStart}>
              {t('Start: ')}
              <span className="font-bold text-slate-800">
                {startDate.format('DD MMM YYYY')}
              </span>
            </span>
            |
            <span className={classes.dateEnd}>
              {t('Ends: ')}
              <span className="font-bold text-slate-800">
                {endDate.format('DD MMM YYYY')}
              </span>
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
          url={``}
          openGraphType="website"
          schemaType="article"
          title={``}
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
