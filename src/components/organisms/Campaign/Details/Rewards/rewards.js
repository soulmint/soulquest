import React from 'react';
import { shape, string } from 'prop-types';
// import { useTranslation } from 'next-i18next';
import classes from './rewards.module.css';
import Coupon from './Coupon';
import Quest from './Quest';
import Questers from './Questers';
import HowClaim from './HowClaim';
import { useRewards } from '../../../../../hooks/Campaign/Rewards';
import useThemes from '../../../../../hooks/useThemes';
import Image from '../../../../atoms/Image';

const Rewards = (props) => {
  const { campaign } = props;

  const { rootClassName } = useThemes();

  // const { t } = useTranslation('campaign_details');

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

  const rewardOverview = campaign.reward_overview ? (
    <div className={`card ${classes.rewardOverview}`}>
      <div className="card-header">
        <h3 className="">Reward Overview</h3>
      </div>
      <div className="card-body">
        <div
          className={classes.rewardOverview}
          dangerouslySetInnerHTML={{ __html: campaign.reward_overview }}
        />
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

  // Build cover and thumb images
  const assetsBaseUrl = process.env.MEDIA_BASE_URL;
  const coverOptions = 'fit=cover';
  const coverImage =
    campaign.cover_image && campaign.cover_image.id ? (
      <Image
        layout="fill"
        className={`${classes.campaignCover}`}
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
        {rewardOverview}
        {howToClaim}
        <Questers campaignId={campaign.id} />
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
