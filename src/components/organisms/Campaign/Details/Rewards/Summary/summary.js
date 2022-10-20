import React from 'react';
import { shape, string } from 'prop-types';
import { useTranslation } from 'next-i18next';
import defaultClasses from './summary.module.css';
import { useStyle } from 'src/components/classify';
import useThemes from 'src/hooks/useThemes';
import TextLink from 'src/components/atoms/TextLink';
import RelatedNftInfo from 'src/components/organisms/Campaign/RelatedNftInfo';

const Summary = (props) => {
  const { classes: propClasses, campaign } = props;
  const classes = useStyle(defaultClasses, propClasses);

  const { t } = useTranslation('campaign_details');

  const { rootClassName } = useThemes();

  let child = null;

  //Build store/campaign owner info
  const storeName = campaign.store_name ? campaign.store_name : null;
  const storeLogo = campaign.store_logo_url ? (
    <span className="pair-value--logo">
      <img src={`${campaign.store_logo_url}`} title={storeName} />
    </span>
  ) : null;
  const storeInfoLine =
    storeName || storeLogo ? (
      <span className="pair-value">
        {storeLogo}
        {storeName}
      </span>
    ) : null;
  const providerInfo = campaign.store_url ? (
    <TextLink
      className={classes.storeLink}
      target={`_blank`}
      href={campaign.store_url}
    >
      {storeInfoLine}
    </TextLink>
  ) : (
    storeInfoLine
  );
  const rewardOwnerInfo = providerInfo ? (
    <div className="list-pair--item">
      <div className="pair-title">{t('Provider')}</div>
      {providerInfo}
    </div>
  ) : null;
  const rewardTokenVolumeInfo = campaign.reward_token_volume ? (
    <div className="list-pair--item">
      <div className="pair-title">{t('Rewards')}</div>
      <div className="pair-value">{campaign.reward_token_volume}</div>
    </div>
  ) : null;
  // Build related chain info
  const rewardChainInfo = campaign.nft_collection_ids.length ? (
    <div className="list-pair--item">
      <div className="pair-title">{t('Chain')}</div>
      <div className="pair-value">
        <RelatedNftInfo
          nftCollections={campaign.nft_collection_ids}
          showChainName={true}
          showCollectionLink={false}
          showSmcAdd={false}
        />
      </div>
    </div>
  ) : null;

  const rewardOverViewInfo = campaign.reward_overview ? (
    <div
      className={`${classes.rewardOverview}`}
      dangerouslySetInnerHTML={{ __html: campaign.reward_overview }}
    />
  ) : null;

  child =
    rewardOwnerInfo || rewardTokenVolumeInfo || rewardChainInfo ? (
      <div className={`card mb-6`}>
        <div className="card-header">
          <h3 className="">{t('Rewards Info')}</h3>
        </div>
        <div className="card-body">
          <div className="list-pair">
            {rewardOwnerInfo}
            {rewardTokenVolumeInfo}
            {rewardChainInfo}
          </div>
          {rewardOverViewInfo}
        </div>
      </div>
    ) : null;

  return <div className={`${classes[rootClassName]}`}>{child}</div>;
};

Summary.propTypes = {
  classes: shape({
    root: string
  }),
  campaign: shape({
    id: string
  })
};

export default Summary;
