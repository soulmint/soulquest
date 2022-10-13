import React from 'react';
import Router from 'next/router';
import slugify from 'slugify';
import Moment from 'moment';
import {useSelector} from "react-redux";
import { shape, string } from 'prop-types';
import { useTranslation } from 'next-i18next';
import Button from '../../../atoms/Button';
import classes from './item.module.css';
import { useTheme } from 'next-themes';

const Item = (props) => {
  const { data } = props;

  const userState = useSelector((state) => state.user);

  const { resolvedTheme } = useTheme();
  const [isDark, setIsDark] = React.useState(resolvedTheme === 'dark');
  React.useEffect(() => {
    resolvedTheme === 'dark' ? setIsDark(true) : setIsDark(false);
  }, [resolvedTheme]);
  const rootClassName = isDark ? 'rootDark' : 'root';

  const { t } = useTranslation('list_campaign');
  const viewDetails = () => {
    const path = `/campaign-details/${slugify(data.title).toLowerCase()}`;
    Router.push(path);
  };

  const handleEdit = () => {
    const path = `/edit-campaign/${data.id}`;
    Router.push(path);
  };

  const editButton =
    (userState.id  && (userState.id === data.user_created.id)) ? (
      <Button priority="normal" type="button" onPress={handleEdit}>
        {t('Edit')}
      </Button>
    ) : null;

  return (
    <li>
      <div className={classes.couponItem}>
        <h4>{data.title}</h4>
        <div className={classes.itemMeta}>
          <span>
            Start:&nbsp;
            {data.date_start
              ? Moment(data.date_start).format('DD MMM YYYY')
              : 'n/a'}{' '}
            -{' End: '}
            {data.date_end
              ? Moment(data.date_end).format('DD MMM YYYY')
              : t('n/a')}
          </span>
        </div>
        <a
          className={classes.btnGetCoupon}
          onClick={viewDetails}
          title={t('Get this deal')}
        >
          {t('Get this deal')}
        </a>
        {editButton}
      </div>
    </li>
  );
};

Item.propTypes = {
  classes: shape({
    root: string
  }),
  data: shape({
    id: string,
    title: string
  })
};

export default Item;
