/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Fragment } from 'react';
import MainTmpl from './_mainTmpl';
import List from '../organisms/Campaign/List';
import { Hero, HowItWork, Features, News } from '../organisms/HomePage';
import Head from 'next/head';

const HomeTmpl = (props) => {
  return (
    <Fragment>
      <Head>
        <title>Home Page - SoulMint - The 1st SoulBound</title>
      </Head>
      <MainTmpl>
        <Hero />
        <div className="bg-white">
          <List position="home-page" />
        </div>
        {/* SoulMint Features */}
        <Features />
        {/* // SoulMint Features */}
        {/* SoulMint How it work */}
        <HowItWork />
        {/* // SoulMint How it work */}
        {/* SoulMint News */}
        <News />
        {/* // SoulMint News */}
      </MainTmpl>
    </Fragment>
  );
};

export default HomeTmpl;
