import React, { useEffect } from 'react';
import { bool, shape, string } from 'prop-types';
import { useTranslation } from 'next-i18next';
import defaultClasses from './claim.module.css';
import { useStyle } from 'src/components/classify';
import { CountDown } from 'src/components/organisms/CountDown';
import { useSelector } from 'react-redux';
import { FaClock, FaDice } from 'react-icons/fa';
import Button from 'src/components/atoms/Button';
import { getClaimed, useWinner } from 'src/hooks/Campaign/Rewards/Claimed';
import utils from 'src/libs/utils';

const Claim = (props) => {
  const {
    classes: propClasses,
    campaign_id,
    reward_method,
    reward_token_volume,
    date_ends,
    reward_number,
    is_ended
  } = props;

  const classes = useStyle(defaultClasses, propClasses);
  const { t } = useTranslation('campaign_details');
  const userState = useSelector((state) => state.user);
  const [claimed, setClaimed] = React.useState(false);
  const [isWinner, setIsWinner] = React.useState(false);

  const { handleFCFSGenerateWinner, handleGenerateLuckyDrawWinner } = useWinner(
    {
      campaign_id,
      is_ended,
      wallet: userState.wallet_address
    }
  );
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
    if (is_ended && !isWinner) {
      if (reward_method === 'fcfs') {
        const { data, error } = await handleFCFSGenerateWinner();
        console.log('====================================');
        console.log(data, error);
        console.log('====================================');
      } else if (reward_method === 'lucky_draw') {
        const ids = utils.generateKeyWinner(reward_number);
        const { data, error } = await handleGenerateLuckyDrawWinner({
          ids,
          data: { is_winner: true }
        });
      }
    }
  }, [
    campaign_id,
    handleFCFSGenerateWinner,
    handleGenerateLuckyDrawWinner,
    isWinner,
    is_ended,
    reward_method,
    userState
  ]);

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

  const claim = () => {
    console.log('Claim())');
  };
  const claimButton = !claimed ? (
    <Button
      type="button"
      priority="high"
      classes={{ root_highPriority: classes.btnClaim }}
      onPress={() => claim()}
    >
      {t('Claim')}
    </Button>
  ) : (
    <Button
      type="button"
      priority="high"
      classes={{ root_highPriority: classes.btnClaim }}
    >
      {t('Claimed rewards')}
    </Button>
  );
  const claimCount = reward_number && is_ended ? 0 / { reward_number } : '';
  return (
    <div className="card mb-6">
      <div className="card-header flex justify-between">
        <h3 className="">
          {t('Claim your Rewards')}
          {claimCount}
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
