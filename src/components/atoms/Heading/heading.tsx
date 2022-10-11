import React, { Fragment, FunctionComponent } from 'react';
import defaultClases from './heading.module.css';
import { useStyle } from '../../classify';
import useThemes from '../../../hooks/useThemes';
interface HeadingProps {
  children?: React.ReactNode;
  classes?: object;
  HeadingType?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  subHeading?: string;
}
export const Heading: FunctionComponent<HeadingProps> = ({
  children,
  classes: propClasses,
  HeadingType,
  subHeading
}) => {
  const { isDark } = useThemes();
  const classes = useStyle(defaultClases, propClasses);
  const headingCls = isDark ? classes.headingDark : classes.heading;
  const heading = HeadingType ? (
    <HeadingType className={headingCls}>{children}</HeadingType>
  ) : null;
  const SubHeading = subHeading ? (
    <div className={`${classes.subHeading} dark:text-gray-300`}>{subHeading}</div>
  ) : null;

  return (
    <Fragment>
      {heading}
      {SubHeading}
    </Fragment>
  );
};
