import React, { Fragment } from 'react';
import { shape, string } from 'prop-types';
import { useTranslation } from 'next-i18next';
import defaultClasses from './subcribe.module.css';
import { useStyle } from '../../../classify';

const Subcrible = (props) => {
  const { classes: propClasses } = props;
  const classes = useStyle(defaultClasses, propClasses);

  const { t } = useTranslation('common');

  const child = (
    <div className="bg-orange-50 border border-2 border-dashed border-orange-200 rounded-lg mt-6">
      <div className={classes.boxBody}>
        <h3 className="dark:text-gray-700 m-0 mb-4">{t('Get Notification')}</h3>
        <p className="dark:text-gray-700 my-0">
          Get the latest update notification from Aenean lacinia pellentesque
          finibus.
        </p>
        <form>
          <div className="flex items-center mt-4">
            <input
              type="email"
              placeholder="Your email"
              className="border border-1 border-gray-200 focus:border-violet-600 focus:shadow-none text-gray-700 rounded py-2 px-3 flex-1 w-auto min-w-0"
            />
            <button
              type="button"
              action="submit"
              className="bg-violet-600 hover:bg-violet-700 border-0 text-white rounded py-2 px-3 ml-2 transition transition-2 cursor-pointer"
            >
              Subscribe
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return <Fragment>{child}</Fragment>;
};

Subcrible.propTypes = {
  classes: shape({
    root: string
  })
};

export default Subcrible;
