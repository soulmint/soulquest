import React, { Fragment } from 'react';
import { useTranslation } from 'next-i18next';
import Image from 'src/components/atoms/Image';
import classes from './features.module.css';
import useThemes from 'src/hooks/useThemes';

const Features = () => {
  const { t } = useTranslation('home');
  const { isDark } = useThemes();
  const rootClass = isDark ? classes.rootDark : classes.root;
  return (
    <Fragment>
      <div className={`${rootClass} bg-white dark:bg-gray-800`}>
        <div className="container max-w-screen-xl mx-auto py-12 lg:py-24 px-4">
          <div className="mb-12 lg:mb-20 text-center">
            <h2 className="text-center text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mt-0 mb-0 tracking-tight">
              <span className="font-light">Soul</span>Mint Features
            </h2>
          </div>

          <div className="flex flex-wrap lg:flex-nowrap items-start lg:gap-8">
            <div className="basis-full md:basis-1/4 text-center mb-12 md:mb-0">
              <div className="mb-6 mx-6">
                <Image
                  src="/features/soulbound_token_curator.png"
                  alt="SoulBound Token curator"
                  width="240"
                  height="184"
                  placeholder="blur"
                  placeholder_w="240"
                  placeholder_h="184"
                />
              </div>
              <h3 className="mt-4 font-bold text-slate-800 mb-2">
                SoulBound Token curator
              </h3>
              <p className="my-0">
                Issue non-transferable NFT as on-chain credentials
              </p>
            </div>

            <div className="basis-full md:basis-1/4 text-center mb-12 md:mb-0">
              <div className="mb-6 mx-6">
                <Image
                  src="/features/chain_agnostic.png"
                  alt="Chain agnostic"
                  width="240"
                  height="184"
                  placeholder="blur"
                  placeholder_w="240"
                  placeholder_h="184"
                />
              </div>
              <h3 className="mt-4 font-bold text-slate-800 mb-2">
                {t('Chain agnostic')}
              </h3>
              <p className="my-0">
                No more pain switching between chains. Enjoy perks on
                multi-chain.
              </p>
            </div>

            <div className="basis-full md:basis-1/4 text-center mb-12 md:mb-0">
              <div className="mb-6 mx-6">
                <Image
                  src="/features/nocode_campaign_creator.png"
                  alt="No-code campaign creator"
                  width="240"
                  height="184"
                  placeholder="blur"
                  placeholder_w="240"
                  placeholder_h="184"
                />
              </div>
              <h3 className="mt-4 font-bold text-slate-800 mb-2">
                No-code campaign creator
              </h3>
              <p className="my-0">
                Easily create a campaign with customized social task.
              </p>
            </div>

            <div className="basis-full md:basis-1/4 text-center">
              <div className="mb-6 mx-6">
                <Image
                  src="/features/on_chain_reward_distribution.png"
                  alt="On-chain reward distribution"
                  width="240"
                  height="184"
                  placeholder="blur"
                  placeholder_w="240"
                  placeholder_h="184"
                />
              </div>
              <h3 className="mt-4 font-bold text-slate-800 mb-2">
                On-chain reward distribution
              </h3>
              <p className="my-0">Distribute rewards through smart-contract</p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default Features;
