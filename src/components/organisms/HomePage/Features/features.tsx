import React, { Fragment } from 'react';
import classes from './features.module.css';
import useThemes from 'src/hooks/useThemes';

const Features = () => {
  const { isDark } = useThemes();
  const rootClass = isDark ? classes.rootDark : classes.root;
  return (
    <Fragment>
      <div className={`${rootClass} bg-white dark:bg-gray-800`}>
        <div className="container max-w-screen-xl mx-auto py-12 lg:py-24 px-4">
          <div className="mb-12 lg:mb-20 text-center">
            <h2 className="text-center text-4xl lg:text-6xl font-bold text-gray-800 dark:text-white mt-0 mb-0 tracking-tight">
              <span className="font-light">Soul</span>Mint Features
            </h2>
          </div>

          <div className="flex flex-wrap lg:flex-nowrap items-start lg:gap-8">
            <div className="basis-full md:basis-1/4 text-center mb-12 md:mb-0">
              <div className="lg:mb-4">
                <img src="/samples/SoulBound.jpg" alt="Sample feature" />
              </div>
              <h3 className="my-0 text-xl font-bold text-gray-800 mb-4 dark:text-white">
                SoulBound Token curator
              </h3>
              <p className="my-0 lg:text-lg">
                Issue non-transferable NFT as on-chain credentials
              </p>
            </div>

            <div className="basis-full md:basis-1/4 text-center mb-12 md:mb-0">
              <div className="lg:mb-4">
                <img src="/samples/cross-chains.png" alt="Sample feature" />
              </div>
              <h3 className="my-0 text-xl text-gray-800 mb-4 font-bold dark:text-white">
                Chain agnostic
              </h3>
              <p className="my-0 lg:text-lg">
                No more pain switching between chains. Enjoy perks on
                multi-chain.
              </p>
            </div>

            <div className="basis-full md:basis-1/4 text-center mb-12 md:mb-0">
              <div className="lg:mb-4">
                <img
                  src="/samples/No-code-campaign-creator.png"
                  alt="Sample feature"
                />
              </div>
              <h3 className="my-0 text-lg lg:text-xl font-bold text-gray-800 mb-4 dark:text-white">
                No-code campaign creator
              </h3>
              <p className="my-0 lg:text-lg">
                Easily create a campaign with customized social task.
              </p>
            </div>

            <div className="basis-full md:basis-1/4 text-center">
              <div className="lg:mb-4">
                <img
                  src="/samples/On-chain-reward-distribution.png"
                  alt="Sample feature"
                />
              </div>
              <h3 className="my-0 text-lg lg:text-xl font-bold text-gray-800 mb-4 dark:text-white">
                On-chain reward distribution
              </h3>
              <p className="my-0 lg:text-lg">
                Distribute rewards through smart-contract
              </p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default Features;
