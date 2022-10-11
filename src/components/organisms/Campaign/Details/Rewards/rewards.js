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
  const { classes: propClasses, campaign } = props;
  const classes = useStyle(defaultClasses, propClasses);
  // const { t } = useTranslation('campaign_details');

  const {
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

  const rewardOverview = campaign.reward_overview ? (
    <div
      className={`${classes.rewardOverview} bg-white dark:bg-gray-800 shadow-sm rounded-xl mb-6`}
    >
      <div className="border-b border-b-gray-200 dark:border-b-gray-700 border-opacity-60 py-3 px-6">
        <h3 className="font-semibold text-lg text-xl text-gray-800 dark:text-gray-300 my-0">
          Reward Overview
        </h3>
      </div>
      <div className="p-6">
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

  return (
    <Fragment>
      {rewardOverview}
      {howToClaim}
      <Quest
        campaignId={parseInt(campaign.id)}
        tasks={tasks}
        doneTasks={doneTasks}
        isFinishedTasks={isFinishedTasks}
        submitted={submitted}
        onClaimReward={handleClaimReward}
        verifyNftOwnership={handleVerifyNftOwnership}
      />
      <Coupon campaign={campaign} />
      <Questers campaignId={campaign.id} />
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
