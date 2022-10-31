import React from 'react';
import { NextPage } from 'next';
import NftCollectionsTmpl from '../components/templates/nftCollectionsTmpl';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const NFTCollections: NextPage = () => {
  return <NftCollectionsTmpl />;
};

export default NFTCollections;

export async function getStaticProps(props: { locale: string }) {
  props.locale = props.locale ? props.locale : 'en';
  return {
    props: {
      ...(await serverSideTranslations(props.locale, [
        'common',
        'list_nft_collections'
      ]))
    }
  };
}
