import React from 'react';
import { shape, string } from 'prop-types';
import { useTranslation } from 'next-i18next';
import TextLink from '../../../../atoms/TextLink';
import classes from './rewards.module.css';
import Coupon from './Coupon';
import Quest from './Quest';
import Questers from './Questers';
import HowClaim from './HowClaim';
import { useRewards } from '../../../../../hooks/Campaign/Rewards';
import useThemes from '../../../../../hooks/useThemes';
import Image from '../../../../atoms/Image';
import { ellipsify } from '../../../../../utils/strUtils';

const Rewards = (props) => {
  const { campaign } = props;

  const { rootClassName } = useThemes();

  const { t } = useTranslation('campaign_details');

  const {
    userState,
    tasks,
    doneTasks,
    isFinishedTasks,
    submitted,
    handleClaimReward,
    handleVerifyNftOwnership
  } = useRewards({
    campaign,
    classes
  });

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

  //Build store/campaign owner info
  const storeLogo = campaign.store_logo_url ? (
    <span className="pair-value--logo">
      <img src={`${campaign.store_logo_url}`} title={'SidedFinance'} />
    </span>
  ) : null;
  const storeName = campaign.store_name ? campaign.store_name : null;
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
  const chainInfo = campaign.nft_collection_ids.length
    ? campaign.nft_collection_ids.map((nftCollection, index) => (
        <div key={index} className={`${classes.nftCollectionWrap}`}>
          <span
            className={`${classes[nftCollection.nft_collection_id.chain_name]}`}
          >
            {nftCollection.nft_collection_id.chain_name}
          </span>
          {/*<TextLink
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
                start: 4,
                end: 4
              })}
              )
            </span>{' '}
          </TextLink>*/}
        </div>
      ))
    : null;
  const rewardChainInfo = chainInfo ? (
    <div className="list-pair--item">
      <div className="pair-title">Chain</div>
      <div className="pair-value">{chainInfo}</div>
    </div>
  ) : null;

  const rewardOverViewInfo = campaign.reward_overview ? (
    <div
      className={`${classes.rewardOverview}`}
      dangerouslySetInnerHTML={{ __html: campaign.reward_overview }}
    />
  ) : null;

  const rewardInfo =
    rewardOwnerInfo || rewardTokenVolumeInfo || rewardChainInfo ? (
      <div className={`card mb-6 ${classes.rewardWrapper}`}>
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

  const howToClaim = campaign.how_to_claim ? (
    <HowClaim content={campaign.how_to_claim} />
  ) : null;

  const quest = (
    <Quest
      userState={userState}
      campaignId={parseInt(campaign.id)}
      tasks={tasks}
      doneTasks={doneTasks}
      isFinishedTasks={isFinishedTasks}
      submitted={submitted}
      onClaimReward={handleClaimReward}
      verifyNftOwnership={handleVerifyNftOwnership}
    />
  );

  const questers = <Questers campaignId={campaign.id} />;

  // Build cover and thumb images
  const assetsBaseUrl = process.env.MEDIA_BASE_URL;
  const coverOptions = 'fit=cover';
  const coverImage =
    campaign.cover_image && campaign.cover_image.id ? (
      <Image
        layout="fill"
        className={`${classes.campaignCover} relative`}
        placeholder="blur"
        src={`${assetsBaseUrl}/${campaign.cover_image.id}?${coverOptions}`}
        alt={`cover_${campaign.title}`}
      />
    ) : null;
  /*
  const thumbOptions = 'fit=cover';
  const thumbImage =
    campaign.thumb_image && campaign.thumb_image.id ? (
      <Image
        layout="fill"
        className={`${classes.campaignThumb}`}
        placeholder="blur"
        src={`${assetsBaseUrl}/${campaign.thumb_image.id}?${thumbOptions}`}
        alt={`cover_${campaign.title}`}
      />
    ) : null;*/

  const coupon = campaign.coupon ? <Coupon campaign={campaign} /> : null;

  return (
    <div className={`${classes[rootClassName]}`}>
      <div className={`${classes.pageContent}`}>
        {quest}
        <div className={`${classes.pageContentInner}`}>
          <div className={`${classes.coverImage}`}>{coverImage}</div>
          {shortDesc}
          {description}
        </div>
      </div>
      <div className={`${classes.pageSidebar}`}>
        {rewardInfo}
        {howToClaim}
        {questers}
        {coupon}
      </div>
    </div>
  );
};

Rewards.propTypes = {
  classes: shape({
    root: string
  }),
  campaign: shape({
    id: string
  })
};

export default Rewards;
