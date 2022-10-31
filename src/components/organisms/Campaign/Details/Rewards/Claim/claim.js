import React, { useEffect } from 'react';
import { bool, shape, string } from 'prop-types';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { FaClock, FaDice } from 'react-icons/fa';
import defaultClasses from './claim.module.css';
import { useStyle } from 'src/components/classify';
import Button from 'src/components/atoms/Button';
import { CountDown } from 'src/components/organisms/CountDown';

import {
  getWinner,
  getTotalWinnerClaimed,
  generateWinners
} from 'src/hooks/Campaign/Rewards/api.gql';

const Claim = (props) => {
  const {
    classes: propClasses,
    campaign_id,
    is_ended,
    date_ends,
    user_created,
    reward_number,
    reward_method,
    winners_generated,
    reward_token_volume
  } = props;

  const classes = useStyle(defaultClasses, propClasses);
  const { t } = useTranslation('campaign_details');

  const userState = useSelector((state) => state.user);
  const walletAdd = userState.wallet_address ? userState.wallet_address : null;

  const [isWinner, setIsWinner] = React.useState(false);
  const [isClaimed, setIsClaimed] = React.useState(false);
  const [totalClaimed, setTotalClaimed] = React.useState(0);
  //const [generatingWinners, setGeneratingWinners] = React.useState(false);

  let icon = null;

  useEffect(async () => {
    if (walletAdd) {
      const winner = await getWinner({
        campaign_id,
        wallet: walletAdd
      });
      if (winner) {
        if (winner.is_winner) {
          setIsWinner(true);
        }
        if (winner.is_claimed) {
          setIsClaimed(true);
        }
      }
      //update total winners claimed
      const totalClaimed = await getTotalWinnerClaimed({ campaign_id });
      if (totalClaimed) {
        setTotalClaimed(totalClaimed);
      }

      // generates winners if campaign was ended and has not generated winners yet and current user is campaign owner
      if (
        is_ended &&
        reward_method &&
        !winners_generated &&
        userState.id === user_created.id
      ) {
        // setGeneratingWinners(true);

        const total = await generateWinners({
          campaignId: campaign_id,
          rw_method: reward_method,
          rw_number: reward_number
        });
        console.log('Total Winners:', total);

        // setGeneratingWinners(false);
      }
    }
  }, [walletAdd]);

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

  const claimButton = !isClaimed ? (
    <Button
      type="button"
      priority="high"
      classes={{ root_highPriority: classes.btnClaim }}
      // onPress={() => console.log('Claimed()')}
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
  return (
    <div className="card mb-6">
      <div className="card-header flex justify-between">
        <h3 className="">
          {t('Claim your Rewards')}
          {` (${totalClaimed}/${reward_number ? reward_number : 0})`}
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
