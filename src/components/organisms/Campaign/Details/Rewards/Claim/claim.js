import React, { Fragment } from 'react';
import { shape, string } from 'prop-types';
import { useTranslation } from 'next-i18next';
// import defaultClasses from './claim.module.css';
// import { useStyle } from 'src/components/classify';
import { FaClock, FaDice } from 'react-icons/fa';

const Claim = (props) => {
  const { classes: propClasses, content } = props;
  // const classes = useStyle(defaultClasses, propClasses);

  const { t } = useTranslation('campaign_details');

  return (
    <Fragment>
      {/* Concept: Claim Box 1 / FCFS / Win */}
      <div className="card mb-6">
        <div className="card-header flex justify-between">
          <h3 className="">Claim your Rewards</h3>
          <div className="flex items-center shadow  text-slate-800 rounded-full py-1 px-2 text-sm font-bold ml-2">
            <FaClock className="text-lg mr-2" /> FCFS
          </div>
        </div>
        <div className="card-body">
          <div className="bg-slate-100 rounded-xl border-l-0 border-r-0 p-6 text-center">
            <div className="font-semibold">
              Congratulations! You win the Quest!
            </div>
            <div className="mt-4 inline-flex items-center">
              <img src="/symbols/usdc.svg" className="w-7 h-7 m-2" />
              <span className="text-3xl font-bold">500 USDC</span>
            </div>
          </div>
          <div className="mt-4">
            <button
              type="button"
              className="rounded-xl font-semibold bg-violet-600 text-white px-4 py-3 w-full hover:bg-violet-700 shadow"
            >
              Claim
            </button>
          </div>
        </div>
      </div>
      {/* End Concept: Claim Box 1 / FCFS / Win */}

      {/* Concept: Claim Box 1 / FCFS / Lose */}
      <div className="card mb-6">
        <div className="card-header flex justify-between">
          <h3 className="">Claim your Rewards</h3>
          <div className="flex items-center shadow  text-slate-800 rounded-full py-1 px-2 text-sm font-bold ml-2">
            <FaClock className="text-lg mr-2" /> FCFS
          </div>
        </div>
        <div className="card-body">
          <div className="bg-slate-100 rounded-xl border-l-0 border-r-0 p-6 text-center">
            <div className="font-semibold">You are not qualified</div>
            <div className="mt-4 inline-flex items-center">
              <img src="/symbols/usdc.svg" className="w-7 h-7 m-2" />
              <span className="text-3xl font-bold">500 USDC</span>
            </div>
          </div>
        </div>
      </div>
      {/* End Concept: Claim Box 1 / FCFS / Lose */}

      {/* Concept: Claim Box 2 / Lucky Draws / Countdown */}
      <div className="card mb-6">
        <div className="card-header flex justify-between">
          <h3 className="">Claim your Rewards</h3>
          <div className="flex items-center shadow  text-slate-800 rounded-full py-1 px-2 text-sm font-bold ml-2">
            <FaDice className="text-lg mr-2" /> Lucky Draw
          </div>
        </div>
        <div className="card-body">
          <div className="bg-slate-100 rounded-xl border-l-0 border-r-0 p-6 text-center">
            <div className="font-semibold">Lucky Draw in:</div>
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
        </div>
      </div>
      {/* End Concept: Claim Box 2 / Lucky Draws / Countdown */}
    </Fragment>
  );
};

Claim.propTypes = {
  classes: shape({
    root: string
  })
};

export default Claim;
