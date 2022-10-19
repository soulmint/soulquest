import React, { Fragment } from 'react';
import { useTranslation } from 'next-i18next';
import useThemes from 'src/hooks/useThemes';
import classes from './howItWork.module.css';
const HowItWork = () => {
  const { t } = useTranslation('home');
  const { isDark } = useThemes();
  const rootClass = isDark ? classes.rootDark : classes.root;
  return (
    <Fragment>
      <div
        className={`bg-gradient-to-b from-slate-100 to-slate-100 ${rootClass}`}
      >
        <div className="container max-w-screen-xl mx-auto py-12 lg:py-24 px-4">
          <div className="mb-12 lg:mb-20 text-center">
            <h2 className="text-center text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mt-0 mb-0 tracking-tight">
              {t('How it works')}
            </h2>
          </div>

          <div
            className={`${classes.steps} flex flex-wrap items-start justify-center relative`}
          >
            <div className="flex flex-row lg:flex-col items-center lg:text-center px-4 basis-full lg:basis-1/4 pb-4 lg:pb-0 relative">
              <span className="bg-violet-600 text-white flex items-center justify-center h-10 w-10 lg:h-16 lg:w-16 rounded-full ring-4 ring-slate-100 text-lg lg:text-2xl font-bold mb-2 lg:mb-8 mr-4 lg:mr-0 z-10">
                1
              </span>
              <h4 className="flex-1 font-semibold text-lg leading-5">
                {t('Connect wallet')}
              </h4>
            </div>

            <div className="flex flex-row lg:flex-col items-center lg:text-center px-4 basis-full lg:basis-1/4 py-4 lg:py-0 relative">
              <span className="bg-violet-600 text-white flex items-center justify-center h-10 w-10 lg:h-16 lg:w-16 rounded-full ring-4 ring-slate-100 text-lg lg:text-2xl font-bold mb-2 lg:mb-8 mr-4 lg:mr-0 z-10">
                2
              </span>
              <h4 className="flex-1 font-semibold text-lg leading-6">
                {t('Browse available campaigns')}
              </h4>
            </div>

            <div className="flex flex-row lg:flex-col items-center lg:text-center px-4 basis-full lg:basis-1/4 py-4 lg:py-0 relative">
              <span className="bg-violet-600 text-white flex items-center justify-center h-10 w-10 lg:h-16 lg:w-16 rounded-full ring-4 ring-slate-100 text-lg lg:text-2xl font-bold mb-2 lg:mb-8 mr-4 lg:mr-0 z-10">
                3
              </span>
              <h4 className="flex-1 font-semibold text-lg leading-6">
                {t('Complete tasks and receive rewards')}
              </h4>
            </div>

            <div className="flex flex-row lg:flex-col items-center lg:text-center px-4 basis-full lg:basis-1/4 pt-4 lg:pt-0 relative">
              <span className="bg-violet-600 text-white flex items-center justify-center h-10 w-10 lg:h-16 lg:w-16 rounded-full ring-4 ring-slate-100 text-lg lg:text-2xl font-bold mb-2 lg:mb-8 mr-4 lg:mr-0 z-10">
                4
              </span>
              <h4 className="flex-1 font-semibold text-lg leading-6">
                {t('Manage your profile & view achievements')}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default HowItWork;
