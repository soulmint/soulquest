import { Fragment } from 'react';
import { NextPage } from 'next';
import HowItWorksTmp from 'src/components/templates/howItWorksTmp';
const HowItWorks: NextPage = () => {
  const child = '[Coming soon] How it works...';

  return (
    <Fragment>
      <HowItWorksTmp>{child}</HowItWorksTmp>
    </Fragment>
  );
};

export default HowItWorks;
