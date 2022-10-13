import React, { Fragment, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import { GetStaticPaths, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSelector } from 'react-redux';
import CreateCampaignTmpl from '../../components/templates/createCampaignTmpl';

const EditCampaignPage: NextPage = () => {
  const userState = useSelector((state) => state.user);
  const router = useRouter();
  const id = router.query.id as string;
  const child = userState.id ? <CreateCampaignTmpl campaignId={id} /> : null;

  useEffect(() => {
    if (userState.id === '') {
      Router.push('/');
    }
  }, [userState]);

  return <Fragment>{child}</Fragment>;
};

export default EditCampaignPage;

export async function getStaticProps(props: { locale: string }) {
  props.locale = props.locale ? props.locale : 'en';
  return {
    props: {
      ...(await serverSideTranslations(props.locale, [
        'common',
        'create_campaign'
      ]))
      // Will be passed to the page component as props
    }
  };
}

export const getStaticPaths: GetStaticPaths<{ jobId: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking' //indicates the type of fallback
  };
};
