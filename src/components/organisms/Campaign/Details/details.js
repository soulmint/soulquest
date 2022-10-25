import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import Moment from 'moment';
import Rewards from './Rewards';
import useThemes from '../../../../hooks/useThemes';
import { useDetails } from '../../../../hooks/Campaign';
import classes from './detail.module.css';
import { FaLock, FaLockOpen } from 'react-icons/fa';

const Details = (props) => {
  const { slug } = props;

  const { t } = useTranslation('campaign_details');

  const { rootClassName } = useThemes();

  Moment.locale('en');

  const { loading, data, error, userState } = useDetails({
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

      const startDate = Moment(campaign.date_start);
      const endDate = Moment(campaign.date_end);
      const now = Moment();
      let stateInfo =
        now > endDate ? (
          <div className="shadow bg-red-300 text-slate-800 rounded-full py-1 px-3 text-sm font-bold mr-4">
            {t('Ended')}
          </div>
        ) : (
          <div className="shadow bg-green-300 text-slate-800 rounded-full py-1 px-3 text-sm font-bold mr-4">
            {t('Ongoing')}
          </div>
        );
      const datesInfo =
        campaign.date_start || campaign.date_end ? (
          <div className="shadow bg-slate-200 text-slate-800 rounded-full px-3 py-1 font-medium text-sm">
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

      const getWhitelistInfo = () => {
        let rs = null;
        if (campaign.whitelist_spreadsheet_id && campaign.whitelist_sheet_id) {
          rs = !userState.is_whitelisted ? (
            <span className={classes.whitelistLock}>
              {' '}
              <FaLock /> <span>{t('Whitelist')}</span>
            </span>
          ) : (
            <span className={classes.whitelistLockOpen}>
              {' '}
              <FaLockOpen /> <span>{t('Whitelist')}</span>
            </span>
          );
        }

        return rs;
      };
      const whitelistInfo = getWhitelistInfo();

      const pageTitleInfo = pageTitle ? (
        <h1 className={`${classes.pageTitle}`}>{campaign.title}</h1>
      ) : null;

      const metaInfo = (
        <div className={`${classes.campaignMeta}`}>
          {stateInfo}
          {datesInfo}
          {whitelistInfo}
        </div>
      );

      child = (
        <div className={`${classes.pageWrapper}`}>
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
      child = <div className={classes.notFound}>{t('Not Found.')}</div>;
    }
  }

  return <div className={`${classes[rootClassName]}`}>{child}</div>;
};

export default Details;
