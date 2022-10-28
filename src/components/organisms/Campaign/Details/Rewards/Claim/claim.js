import React, { useEffect } from 'react';
import { bool, shape, string } from 'prop-types';
import { useTranslation } from 'next-i18next';
import defaultClasses from './claim.module.css';
import { useStyle } from 'src/components/classify';
import { CountDown } from 'src/components/organisms/CountDown';
import { useSelector } from 'react-redux';
import { FaClock, FaDice } from 'react-icons/fa';
import Button from 'src/components/atoms/Button';
import {
  getClaimed,
  getClaimedCount
} from 'src/hooks/Campaign/Rewards/Claimed/useClaimed';
import { HandleGenerateWinner } from 'src/hooks/Campaign/Rewards/useWinner';

const Claim = (props) => {
  const {
    classes: propClasses,
    campaign_id,
    reward_method,
    winnered,
    reward_token_volume,
    date_ends,
    user_created,
    reward_number,
    is_ended
  } = props;

  const classes = useStyle(defaultClasses, propClasses);
  const { t } = useTranslation('campaign_details');
  const userState = useSelector((state) => state.user);
  const [claimed, setClaimed] = React.useState(false);
  const [isWinner, setIsWinner] = React.useState(false);
  const [claimedCount, setClaimedCount] = React.useState(0);
  let icon = null;
  useEffect(async () => {
    const rs = await getClaimed({
      campaign_id,
      wallet: userState.wallet_address
    });
    if (rs && rs.is_claimed) {
      setClaimed(true);
    }
    if (rs && rs.is_winner) {
      setIsWinner(true);
    }
    const rsCount = await getClaimedCount({ campaign_id });
    if (rsCount) {
      setClaimedCount(rsCount);
    }
  }, [campaign_id, reward_method, userState]);

  //coming soon
  // let isWinner = true; //is soul and is winner
  if ((!reward_method || reward_method === 'fcfs') && !is_ended) {
    return null;
  }
  const tokenIcon = reward_token_volume ? (
    reward_token_volume.toLowerCase().includes('usdc') ? (
      <img src="/symbols/usdc.svg" className="w-7 h-7 m-2" />
    ) : reward_token_volume.toLowerCase().includes('usdt') ? (
      <img src="/symbols/usdt.svg" className="w-7 h-7 m-2" />
    ) : null
  ) : null;
  const tokenRender = tokenIcon ? (
    <div className="mt-4 inline-flex items-center">
      {tokenIcon}
      <span className="text-3xl font-bold">{reward_token_volume}</span>
    </div>
  ) : null;
  let content = (
    <div className="bg-slate-100 rounded-xl border-l-0 border-r-0 p-6 text-center">
      <div className="font-semibold">
        {isWinner
          ? t('Congratulations! You win the Quest!')
          : t('You are not qualified')}
      </div>
      {tokenRender}
    </div>
  );

  if (reward_method === 'fcfs') {
    icon = (
      <div className="flex items-center shadow  text-slate-800 rounded-full py-1 px-2 text-sm font-bold ml-2">
        <FaClock className="text-lg mr-2" /> {t('FCFS')}
      </div>
    );
  } else if (reward_method === 'lucky_draw') {
    icon = (
      <div className="flex items-center shadow  text-slate-800 rounded-full py-1 px-2 text-sm font-bold ml-2">
        <FaDice className="text-lg mr-2" /> {t('Lucky Draw')}
      </div>
    );
    if (!is_ended) {
      content = (
        <>
          <div className="bg-slate-100 rounded-xl border-l-0 border-r-0 p-6 text-center">
            <div className="font-semibold">{t('Lucky Draw in')}:</div>
            <CountDown date={date_ends} />
          </div>
        </>
      );
    }
  }

  const ownerGenerated = async () => {
    if (!winnered && is_ended && reward_method) {
      await HandleGenerateWinner({
        campaignId: campaign_id,
        rw_number: reward_number,
        rw_method: reward_method,
        is_ended
      });
    }
  };
  const ownerbtn =
    userState.wallet_address && !winnered ? (
      <Button
        type="button"
        priority="high"
        classes={{ root_highPriority: classes.btnClaim }}
        onPress={() => ownerGenerated()}
      >
        {t('Owner Generate Winner')}
      </Button>
    ) : (
      <Button
        type="button"
        priority="high"
        classes={{ root_highPriority: classes.btnClaim }}
      >
        {t('Generated Winner')}
      </Button>
    );
  const claimedButton =
    userState.wallet_address !== user_created ? (
      ownerbtn
    ) : (
      <Button
        type="button"
        priority="high"
        classes={{ root_highPriority: classes.btnClaim }}
        onPress={() => console.log('Claimed()')}
      >
        {t('Claim')}
      </Button>
    );
  const claimButton = !claimed ? (
    claimedButton
  ) : (
    <Button
      type="button"
      priority="high"
      classes={{ root_highPriority: classes.btnClaim }}
    >
      {t('Claimed rewards')}
    </Button>
  );
  return (
    <div className="card mb-6">
      <div className="card-header flex justify-between">
        <h3 className="">
          {t('Claim your Rewards')}
          {` (${claimedCount}/${reward_number})`}
        </h3>
        {icon}
      </div>
      <div className="card-body">
        {content}
        {is_ended && isWinner ? claimButton : null}
      </div>
    </div>
  );
};

Claim.propTypes = {
  classes: shape({
    root: string
  }),
  is_ended: bool,
  campaign_id: string,
  reward_method: string,
  reward_token_volume: string,
  reward_number: string
};

export default Claim;
