import React from 'react';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import HowItWorksTmp from 'src/components/templates/howItWorksTmp';
const HowItWorks: NextPage = () => {
  const { status } = useSession();

  let child = null;
  if (status == 'loading') {
    child = 'Loading...';
  } else if (status == 'authenticated') {
    child = '[Coming soon] How it works...';
  } else {
    child = '[Coming soon] How it works...';
  }

  return <HowItWorksTmp>{child}</HowItWorksTmp>;
};

export default HowItWorks;
