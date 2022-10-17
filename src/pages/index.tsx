import React from 'react';
import { NextPage, GetStaticProps } from 'next';
import HomeTmpl from '../components/templates/homeTmpl';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import utils from 'src/libs/utils';

const HomePage: NextPage = () => {
  const page = `home`;
  const meta = utils.createMetaData({ page, data: {} });
  const child = <HomeTmpl meta={meta} />;
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
