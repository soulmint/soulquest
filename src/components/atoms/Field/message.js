import React from 'react';
import { useTranslation } from 'next-i18next';
import { node, number, oneOfType, shape, string } from 'prop-types';

import defaultClasses from './message.module.css';
import { useStyle } from '../../classify';

const Message = (props) => {
  const { children, classes: propClasses, fieldState } = props;
  const { t } = useTranslation('common');
  const { error } = fieldState;

  const classes = useStyle(defaultClasses, propClasses);
  const className = error ? classes.root_error : classes.root;
  let translatedErrorMessage;

  if (error) {
    translatedErrorMessage = t(error.message);
  }

  return <p className={className}>{translatedErrorMessage || children}</p>;
};

export default Message;

Message.defaultProps = {
  fieldState: {}
};

Message.propTypes = {
  children: node,
  classes: shape({
    root: string,
    root_error: string
  }),
  fieldState: shape({
    error: shape({
      message: string
    })
  })
};
