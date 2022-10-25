import React from 'react';
import { bool, shape, string } from 'prop-types';
import { useTranslation } from 'next-i18next';
import defaultClasses from './claim.module.css';
import { useStyle } from 'src/components/classify';
import { CountDown } from 'src/components/organisms/CountDown';
import { FaClock, FaDice } from 'react-icons/fa';
import Button from 'src/components/atoms/Button';

const Claim = (props) => {
  const {
    classes: propClasses,
    campaign_id,
    reward_method,
    reward_token_volume,
    date_ends,
    is_ended
  } = props;

  const classes = useStyle(defaultClasses, propClasses);
  console.log('====================================');
  console.log('is_ended', is_ended);
  console.log('====================================');
  const { t } = useTranslation('campaign_details');

  let icon = null;

  //coming soon
  let isWinner = false; //is soul and is winner

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
            <div className="mt-8 flex items-center justify-center space-x-6">
              <div className="flex flex-col">
                <span className="text-3xl font-bold">2</span>
                <span className="text-sm">DAYS</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold">18</span>
                <span className="text-sm">HOURS</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold">05</span>
                <span className="text-sm">MINUTES</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold">55</span>
                <span className="text-sm">SECONDS</span>
              </div>
            </div>
          </div>
        </>
      );
    }
  }

  const claim = () => {
    console.log('Claim())');
  };

  return (
    <div className="card mb-6">
      <div className="card-header flex justify-between">
        <h3 className="">{t('Claim your Rewards')}</h3>
        {icon}
      </div>
      <div className="card-body">
        {content}
        {is_ended && isWinner ? (
          <div className="mt-4">
            <Button
              type="button"
              priority="high"
              classes={{ root_highPriority: classes.btnClaim }}
              onPress={() => claim()}
            >
              {t('Claim')}
            </Button>
          </div>
        ) : null}
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
