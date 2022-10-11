import React from 'react';
import { NextPage } from 'next';
import CampaignsTmpl from '../components/templates/campaignsTmpl';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Campaigns: NextPage = () => {
  return <CampaignsTmpl />;
};

export default Campaigns;

export async function getStaticProps(props: { locale: string }) {
  props.locale = props.locale ? props.locale : 'en';
  return {
    props: {
      ...(await serverSideTranslations(props.locale ? props.locale : 'en', [
        'common',
        'list_campaign'
      ]))
    }
  };
}
