import React, { Fragment, useEffect } from 'react';
import { NextPage } from 'next';
import Router from 'next/router';
import { useSelector } from 'react-redux';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MyCampaignTmpl from '../components/templates/myCampaignTmpl';

const Dashboard: NextPage = () => {
  const userState = useSelector((state) => state.user);

  const child = userState.id ? (
    <MyCampaignTmpl walletAddress={userState.id} />
  ) : null;

  useEffect(() => {
    if (!userState.id) {
      Router.push('/');
    }
  }, [userState.id]);

  return <Fragment> {child} </Fragment>;
};

export default Dashboard;

export async function getStaticProps(props: { locale: string }) {
  props.locale = props.locale ? props.locale : 'en';
  return {
    props: {
      ...(await serverSideTranslations(props.locale, [
        'common',
        'list_campaign'
      ]))
    }
  };
}
