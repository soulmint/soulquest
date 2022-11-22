import React from 'react';
import { shape, string } from 'prop-types';
import { useTranslation } from 'next-i18next';
import classes from './whitelist.module.css';
import { useSelector } from 'react-redux';
import { FaLock, FaLockOpen } from 'react-icons/fa';

const Whitelist = (props) => {
  const { campaign } = props;

  const { t } = useTranslation('campaign_details');

  let child;

  const userState = useSelector((state) => state.user);
  const isWhitelisted = userState?.is_whitelisted;

  if (campaign.whitelist_spreadsheet_id && campaign.whitelist_sheet_id) {
    child = !isWhitelisted ? (
      <span className={`${classes.whitelistLock}`}>
        <FaLock />
        <span className="ml-1">{t('Whitelist')}</span>
      </span>
    ) : (
      <span className={`${classes.whitelistLockOpen}`}>
        <FaLockOpen />
        <span className="ml-1">{t('Whitelist')}</span>
      </span>
    );
  }

  return <div className={classes.root}>{child}</div>;
};

Whitelist.propTypes = {
  classes: shape({
    root: string
  }),
  campaign: shape({
    id: string
  })
};

export default Whitelist;
