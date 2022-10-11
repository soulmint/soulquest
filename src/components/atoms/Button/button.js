import React, { useRef } from 'react';
import { useButton } from 'react-aria';
import { oneOf, shape, string, bool, node, func } from 'prop-types';

import { useStyle } from '../../classify';
import defaultClasses from './button.module.css';

const getRootClassName = (priority, negative) =>
  `root_${priority}Priority${negative ? 'Negative' : ''}`;

const Button = (props) => {
  const {
    children,
    classes: propClasses,
    priority,
    negative,
    disabled,
    onPress,
    ...restProps
  } = props;

  const buttonRef = useRef();

  const { buttonProps } = useButton(
    {
      isDisabled: disabled,
      onPress,
      ...restProps
    },
    buttonRef
  );

  const classes = useStyle(defaultClasses, propClasses);
  const rootClassName = classes[getRootClassName(priority, negative)];

  return (
    <button
      ref={buttonRef}
      className={rootClassName}
      {...buttonProps}
      {...restProps}
    >
      <span className={classes.content}>{children}</span>
    </button>
  );
};

Button.propTypes = {
  children: node,
  classes: shape({
    content: string | undefined,
    root: string | undefined,
    root_highPriority: string | undefined,
    root_lowPriority: string | undefined,
    root_normalPriority: string | undefined
  }),
  priority: oneOf(['high', 'low', 'normal']).isRequired,
  type: oneOf(['button', 'reset', 'submit']).isRequired,
  negative: bool,
  disabled: bool,
  onPress: func
};

Button.defaultProps = {
  priority: 'normal',
  type: 'button',
  negative: false,
  disabled: false
};

export default Button;
