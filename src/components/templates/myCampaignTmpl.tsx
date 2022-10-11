import React, { Fragment } from 'react';
import MainTmpl from './_mainTmpl';
import UserCampaign from '../organisms/User/myCampaign';

const MyCampaignTmpl = (props: any) => {
  const { walletAddress } = props;

  const child = <UserCampaign walletAddress={walletAddress} />;

  return (
    <Fragment>
      <MainTmpl> {child} </MainTmpl>
    </Fragment>
  );
};

export default MyCampaignTmpl;
