import React, { Fragment, useEffect } from 'react';
import { NextPage } from 'next';
import Router from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSession } from 'next-auth/react';
import CreateCampaignTmpl from '../components/templates/createCampaignTmpl';

const CreateCampaignPage: NextPage = () => {
  const { status } = useSession();

  const child = status === 'authenticated' ? <CreateCampaignTmpl /> : null;

  useEffect(() => {
    if (status === 'unauthenticated') {
      Router.push('/');
    }
  }, [status]);

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
