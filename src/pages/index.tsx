import React from 'react';
import { NextPage, GetStaticProps } from 'next';
import HomeTmpl from '../components/templates/homeTmpl';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const HomePage: NextPage = () => {
  const child = <HomeTmpl />;
  return child;
};

export default HomePage;

export const getStaticProps: GetStaticProps = async (context) => {
  context.locale = context.locale ? context.locale : 'en';
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common']))
    }
  };
};
