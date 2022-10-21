import React, { Fragment } from 'react';
import Image from 'src/components/atoms/Image';
import classes from './hero.module.css';
const Hero = () => {
  return (
    <Fragment>
      <div className={`${classes.root} bg-teal-400 relative`}>
        <div className="container max-w-screen-xl mx-auto py-12 lg:py-0 px-8 lg:px-4 z-10">
          <div className="flex flex-wrap items-center">
            <div className="basis-full lg:basis-7/12 text-center lg:text-left lg:pr-16">
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 !leading-tight mt-0 mb-4 lg:mb-6">
                <span className="block">
                  Reward distribution platform for <span>SoulBound</span> Tokens
                </span>
              </h1>
              <p className="text-lg lg:text-xl font-normal my-0 text-slate-800">
                Build your Web3 reputation through SoulBound Tokens. Explore and
                earn.
              </p>

              <div className="flex items-center justify-center lg:justify-start mt-12">
                <a
                  href="https://t.me/alexle_rada"
                  title="Create Campaign"
                  target="_blank"
                  className="bg-violet-600 hover:bg-violet-700 text-white inline-block rounded-xl py-3 px-6 text-lg font-medium tracking-wide shadow hover:shadow-xl border-2 border-transparent transition-all duration-300"
                >
                  Create a Quest
                </a>
                <a
                  href="//soulmint.notion.site/SoulMint-e036b079a12b41ee8bf150689ff4af22"
                  title=""
                  target="_blank"
                  className="hover:bg-slate-800 text-lg text-slate-800 hover:text-white font-medium rounded-xl py-3 px-6 ml-4 tracking-wide transition-all duration-300 border-2 border-slate-800"
                  rel="noreferrer"
                >
                  More info...
                </a>
              </div>
            </div>

            <div className="hidden lg:flex justify-end basis-5/12 text-right pl-4">
              <Image
                src="/hero.png"
                alt="Hero decor"
                width="500"
                height="500"
                placeholder="blur"
                placeholder_w="500"
                placeholder_h="500"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Hero;
