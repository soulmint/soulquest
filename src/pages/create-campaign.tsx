import React, { Fragment, useEffect } from 'react';
import { NextPage } from 'next';
import Router from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CreateCampaignTmpl from '../components/templates/createCampaignTmpl';
import { useSelector } from 'react-redux';

const CreateCampaignPage: NextPage = () => {
  const userState = useSelector((state) => state.user);

  const child = userState.id !== undefined ? <CreateCampaignTmpl /> : null;

  useEffect(() => {
    if (userState.id === undefined) {
      Router.push('/');
    }
  }, [userState]);

  return <Fragment> {child} </Fragment>;
};

export default CreateCampaignPage;

export async function getStaticProps(props: { locale: string }) {
  props.locale = props.locale ? props.locale : 'en';
  return {
    props: {
      ...(await serverSideTranslations(props.locale ? props.locale : 'en', [
        'common',
        'create_campaign'
      ]))
    }
  };
}
