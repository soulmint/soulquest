import React, { Fragment } from 'react';
import classes from './hero.module.css';
const Hero = () => {
  return (
    <Fragment>
      <div className={`${classes.root} bg-teal-400 relative`}>
        <div className="container max-w-screen-xl mx-auto px-4 lg:px-4 z-10">
          <div className="flex flex-wrap items-center py-10 md:py-16 lg:py-16">
            <div className="basis-full lg:basis-7/12 text-center lg:text-left lg:pr-4">
              <h1 className="text-4xl lg:text-7xl font-extrabold text-gray-900 tracking-tight mt-0 mb-4 lg:mb-6">
                <span className="text-violet-600">
                  <span className="font-light">Soul</span>Mint
                </span>
                <span className="block">
                  Reward distribution platform for{' '}
                  <span className="font-light">Soul</span>Bound Tokens
                </span>
              </h1>
              <p className="text-lg lg:text-2xl font-normal my-0 text-gray-900">
                Build your Web3 reputation through SoulBound Tokens. Explore and
                earn.
              </p>

              <div className="flex items-center mt-8">
                <a
                  href="https://soulmint.notion.site/SoulMint-e036b079a12b41ee8bf150689ff4af22"
                  title=""
                  target="_blank"
                  className="bg-teal-500 hover:bg-teal-600 text-lg text-white font-medium rounded-xl py-3 px-6 tracking-wide transition-all duration-300"
                  rel="noreferrer"
                >
                  Campaigns
                </a>

                <a
                  href="#"
                  title="Create Campaign"
                  target="_blank"
                  className="bg-violet-500 hover:bg-violet-600 text-white inline-block rounded-xl py-3 px-6 text-lg font-base tracking-wide text-shadow-sm shadow-sm ml-4 transition-all duration-300"
                >
                  Create Campaign
                </a>
              </div>
            </div>

            <div className="hidden lg:flex justify-end basis-5/12 text-right pl-4">
              <img src="hero.png" alt="Hero decor" />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Hero;
