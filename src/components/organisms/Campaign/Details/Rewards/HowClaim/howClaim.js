import React from 'react';
import { shape, string } from 'prop-types';
import { useTranslation } from 'next-i18next';
import defaultClasses from './howClaim.module.css';
import { useStyle } from '../../../../../classify';

const HowClaim = (props) => {
  const { classes: propClasses, content } = props;
  const classes = useStyle(defaultClasses, propClasses);

  const { t } = useTranslation('campaign_details');

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg mb-6">
      <div className="border-b border-gray-200 dark:border-gray-700 border-opacity-60 py-3 px-6">
        <h3 className="mt-0 mb-0 text-lg lg:text-lg font-semibold text-gray-800 dark:text-gray-300">
          {t('How to claim?')}
        </h3>
        {/*<p className="text-sm text-gray-500 font-normal mt-0 mb-0">
          {t('Follow the steps below to claim your rewards.')}
        </p>*/}
      </div>

      <div className="p-6">
        <div
          className={classes.howToClaim}
          dangerouslySetInnerHTML={{ __html: content }}
        />
        {/*<div className={`${classes.howtoSteps}`}>
          <div className="flex items-center mb-8 z-10">
            <strong className="bg-blue-100 border border-4 border-white text-blue-500 flex items-center justify-center h-11 w-11 rounded-full">
              1
            </strong>
            <div className="flex-1 pl-4">{t('Connect your wallet')}</div>
          </div>

          <div className="flex items-center mb-8 z-10">
            <strong className="bg-blue-100 border border-4 border-white text-blue-500 flex items-center justify-center h-11 w-11 rounded-full">
              2
            </strong>
            <div className="flex-1 pl-4">
              {t('Do and then verify required tasks')}
            </div>
          </div>

          <div className="flex items-center z-10">
            <strong className="bg-blue-100 border border-4 border-white text-blue-500 flex items-center justify-center h-11 w-11 rounded-full">
              3
            </strong>
            <div className="flex-1 pl-4">
              {t(
                "Click on the 'Claim Reward' button to receive your reward information"
              )}
            </div>
          </div>
        </div>*/}
      </div>
    </div>
  );
};

HowClaim.propTypes = {
  classes: shape({
    root: string
  }),
  content: string
};

export default HowClaim;
