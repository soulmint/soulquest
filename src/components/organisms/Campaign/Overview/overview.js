import React, { Fragment } from 'react';
import { shape, string } from 'prop-types';
import { useTranslation } from 'next-i18next';
import defaultClasses from './overview.module.css';
import { useStyle } from '../../../classify';

const Overview = (props) => {
  const { classes: propClasses } = props;
  const classes = useStyle(defaultClasses, propClasses);

  const { t } = useTranslation('common');

  const child = (
    <div className={classes.boxHilite}>
      <h3 className={classes.boxTitle}>{t('About Campaign')}</h3>
      <div className={classes.boxBody}>
        <p className="my-0">
          Mauris eget finibus justo. Aenean aliquam, diam ut elementum
          vestibulum, ante dolor porttitor urna, id consequat velit nulla in
          leo. Vestibulum sit amet neque a mi pulvinar dapibus quis eu ante.
        </p>

        <div className="mt-3">
          <a
            href="#"
            title="More information"
            className="border-b border-dotted border-violet-600 text-violet-600 text-base dark:hover:text-violet-500"
          >
            View full...
          </a>
        </div>
      </div>
    </div>
  );

  return <Fragment>{child}</Fragment>;
};

Overview.propTypes = {
  classes: shape({
    root: string
  })
};

export default Overview;
