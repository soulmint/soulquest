import React, { Fragment } from 'react';
import { shape, string } from 'prop-types';
import { useTranslation } from 'next-i18next';
import defaultClasses from './coupon.module.css';
import { useStyle } from '../../../../../classify';

// import { getCouponCodes } from './details.api.gql';
/*import {EvmChain} from "@moralisweb3/evm-utils";
import Moralis from "moralis";*/

// import TextLink from "../../../../atoms/TextLink";
// import {ellipsify} from "../../../../../utils/strUtils";
import Button from '../../../../../atoms/Button';
/*
import Router from "next/router";
import Moment from "moment";*/

const Coupon = (props) => {
  const { classes: propClasses, campaign } = props;
  const classes = useStyle(defaultClasses, propClasses);

  const { t } = useTranslation('campaign_details');

  /*
  // Checking via Moralis APIs: https://docs.moralis.io/reference/getnftsforcontract
  const verifyNFTOwnership = async (chainName, tokenAddress, address) => {
    if (!address.includes('0x')) {
      return false;
    }

    let chain = null;
    if (chainName === 'bsc') {
      chain = EvmChain.BSC;
    }
    if (chainName === 'bsc_testnet') {
      chain = EvmChain.BSC_TESTNET;
    } else if (chainName === 'ethereum') {
      chain = EvmChain.ETHEREUM;
    } else if (chainName === 'polygon') {
      chain = EvmChain.POLYGON;
    }
    await Moralis.start({
      apiKey: process.env.MORALIS_API_KEY
      // ...and any other configuration
    });
    const response = await Moralis.EvmApi.account.getNFTsForContract({
      address,
      tokenAddress,
      chain
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log('verifyNFTOwnership:', response.result);
    }

    return response.result.length ? true : false;
  };*/

  /*const handleViewCoupons = useCallback(async (props) => {
    // verify nft ownership
    const { nftCollections, accountAdd, isCampaignOwner } = props;

    let rs = null;
    let isNFTOwnership = false;
    if (nftCollections.length) {
      for (let i = 0; i < nftCollections.length; i++) {
        const nftCollection = nftCollections[i].nft_collection_id;
        const chainName = nftCollection.chain_name;
        const contractAdd = nftCollection.contract_address;
        isNFTOwnership = await verifyNFTOwnership(
          chainName,
          contractAdd,
          accountAdd
        );
        if (isNFTOwnership) break;
      }
    }

    if (isNFTOwnership || isCampaignOwner) {
      rs = await getCouponCodes(slug);
    } else {
      rs = 'You have not permission to view coupon codes!';
    }

    return rs;
  }, []);*/

  /*const viewCoupons = async (campaign) => {
    const couponContainer = document.getElementById('coupon-codes');
    if (!couponContainer.innerText.length) {
      const codes = await handleViewCoupons({
        nftCollections: campaign.nft_collection_ids,
        accountAdd: session.user.email,
        isCampaignOwner: session.id == campaign.user_created.id ? true : false
      });

      const couponCodes = document.createElement('span');
      couponCodes.className = classes.couponCodes;
      const txtCodes = document.createTextNode(codes);
      couponCodes.appendChild(txtCodes);
      couponContainer.appendChild(couponCodes);

      document.getElementById('get-coupon-code-btn').remove();
    }
  };*/

  let viewCouponCodesArea = '[coming soon]View coupon codes area...';
  /*if (status === 'loading') {
    viewCouponCodesArea = t('Loading...');
  } else if (status === 'authenticated') {
    viewCouponCodesArea = (
      <Fragment>
        <div className="flex">
          <Button
            id={`get-coupon-code-btn`}
            priority="high"
            type="button"
            onPress={() => viewCoupons(campaign)}
          >
            {t('Verify and get coupon codes')}
          </Button>
          <div className={classes.couponContainer} id={`coupon-codes`} />
        </div>
      </Fragment>
    );
  } else {
    viewCouponCodesArea = (
      <div className={classes.couponNotes}>
        <svg
          className="w-4 h-4 fill-orange-400 dark:fill-white mr-2"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
        </svg>
        {t('You must do authentication before to view coupon codes.')}
      </div>
    );
  }*/

  const couponReward = campaign.discount_value ? (
    <Fragment>
      <div className="border-b border-t border-gray-200 border-opacity-60 pt-6 px-4 pb-4 text-center">
        <div className="flex flex-col mb-6">
          <strong className="text-5xl font-bold mb-1 text-gray-800">
            {campaign.discount_value}% Off
          </strong>
        </div>
      </div>
      <div className="py-4 px-4">{viewCouponCodesArea}</div>
    </Fragment>
  ) : null;

  return <div className="bg-white shadow-sm rounded-xl">{couponReward}</div>;
};

Coupon.propTypes = {
  classes: shape({
    root: string
  }),
  campaign: shape({
    id: string
  })
};

export default Coupon;
