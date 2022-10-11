/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Fragment } from 'react';
import { shape, string } from 'prop-types';
import Head from 'next/head';
import MainTmpl from './_mainTmpl';
import { CampaignForm } from '../organisms/Campaign';

const CreateCampaignTmpl = (props) => {
  const { campaignId } = props;

  const child = <CampaignForm campaignId={campaignId} />;

  return (
    <Fragment>
      <Head>
        <title>Create Campaign - SoulMint - The 1st SoulBound</title>
      </Head>
      <MainTmpl> {child} </MainTmpl>
    </Fragment>
  );
};

CreateCampaignTmpl.propTypes = {
  classes: shape({
    root: string
  }),
  campaignId: string
};

export default CreateCampaignTmpl;
