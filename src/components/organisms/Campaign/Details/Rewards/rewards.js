import React, { Fragment } from 'react';
import { shape, string } from 'prop-types';
// import { useTranslation } from 'next-i18next';
import defaultClasses from './rewards.module.css';
import { useStyle } from '../../../../classify';
import Coupon from './Coupon';
import Quest from './Quest';
import Questers from './Questers';
import HowClaim from './HowClaim';
import { useRewards } from '../../../../../hooks/Campaign/Rewards';

const Rewards = (props) => {
  const { classes: propClasses, campaign, enabled } = props;
  const classes = useStyle(defaultClasses, propClasses);
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

  const rewardOverview =
    campaign.reward_overview && enabled.how_to_claim ? (
      <div
        className={`card ${classes.rewardOverview} bg-white dark:bg-gray-800 shadow-sm rounded-xl mb-6`}
      >
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

  const howToClaim =
    campaign.how_to_claim && enabled.how_to_claim ? (
      <HowClaim content={campaign.how_to_claim} />
    ) : null;
  const questers = enabled.questers ? (
    <Questers campaignId={campaign.id} />
  ) : null;
  const quest = enabled.quest ? (
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
  ) : null;
  const coupon = campaign.coupon ? <Coupon campaign={campaign} /> : null;
  return (
    <Fragment>
      {rewardOverview}
      {howToClaim}
      {quest}
      {coupon}
      {questers}
    </Fragment>
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
