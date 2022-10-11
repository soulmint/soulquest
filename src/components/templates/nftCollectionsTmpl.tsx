/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Fragment } from 'react';
import { shape, string } from 'prop-types';
import MainTmpl from './_mainTmpl';
import List from '../organisms/Campaign/NftCollection/List';
import Head from 'next/head';

const NftCollectionsTmpl = () => {
  return (
    <Fragment>
      <Head>
        <title>NFT Collections - SoulMint - The 1st SoulBound</title>
      </Head>
      <MainTmpl>
        <List />
      </MainTmpl>
    </Fragment>
  );
};

NftCollectionsTmpl.propTypes = {
  classes: shape({
    root: string
  })
};

export default NftCollectionsTmpl;
