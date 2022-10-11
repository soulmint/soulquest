import React, { Fragment } from 'react';
import Router from 'next/router';
import { shape, string } from 'prop-types';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import defaultClasses from './success.module.css';
import { useStyle } from '../../classify';
import Button from '../../atoms/Button';
import slugify from 'slugify';

const Success = (props) => {
  const { classes: propClasses, id, title } = props;
  const classes = useStyle(defaultClasses, propClasses);

  const { t } = useTranslation('common');

  const { status } = useSession();

  const handleEdit = () => {
    Router.push(`/edit-campaign/${id}`);
  };

  const handleView = () => {
    Router.push(`/campaign-details/${slugify(title).toLowerCase()}`);
  };

  const child =
    status === 'authenticated' ? (
      <div className={`${classes.root}`}>
        <h1> {t('Done')} </h1>
        <div className={`${classes.note}`}>
          In publishing and graphic design, Lorem ipsum is a placeholder text
          commonly used to demonstrate the visual form of a document or a
          typeface without relying on meaningful content. Lorem ipsum may be
          used as a placeholder before final copy is available.
        </div>
        <div className={`${classes.actions}`}>
          <Button priority="low" type="button" onPress={() => handleEdit()}>
            {t('Edit Campaign')}
          </Button>
          <Button priority="high" type="button" onPress={() => handleView()}>
            {t('View Campaign')}
          </Button>
        </div>
      </div>
    ) : null;

  return <Fragment>{child}</Fragment>;
};

Success.propTypes = {
  classes: shape({
    root: string
  }),
  id: string.isRequired,
  title: string.isRequired
};

export default Success;
