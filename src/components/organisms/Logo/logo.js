import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';

/**
 * A component that renders a logo in the header.
 *
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a logo.
 */
const Logo = (props) => {
  const { height, width, classes } = props;

  return (
    <Image
      className={classes.logo}
      height={height}
      // layout="fill"
      src={'/soulmint.svg'}
      title={'SoulMint'}
      width={width}
    />
  );
};

Logo.propTypes = {
  classes: PropTypes.shape({
    logo: PropTypes.string
  }),
  height: PropTypes.number,
  width: PropTypes.number
};

Logo.defaultProps = {
  height: 32,
  width: 32
};

export default Logo;
