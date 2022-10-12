/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Fragment } from 'react';
import MainTmpl from './_mainTmpl';
import List from '../organisms/Campaign/List';
import { Hero, HowItWork, Features, News } from '../organisms/HomePage';
import Head from 'next/head';
import HeadCustom from '../organisms/Head';

const HomeTmpl = (props) => {
  return (
    <Fragment>
      <HeadCustom
        url={`${process.env.PUBLIC_URL}`}
        openGraphType="website"
        schemaType="article"
        title={`Reward distribution platform based on SoulBound Token - SoulMint`}
        description={`Build your Web3 reputation through SoulBound Tokens. Discover, participate and earn the most exclusive rewards from SoulBound token based campaigns.`}
        image={`${process.env.PUBLIC_URL}/hero.png`}
      />
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
