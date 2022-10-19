import React, { useCallback, useEffect, useState } from 'react';
import { EvmChain } from '@moralisweb3/evm-utils';
import Moralis from 'moralis';
import { useMutation } from '@apollo/client';
import API from './api.gql';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import BrowserPersistence from 'src/utils/simplePersistence';
import RelatedNftInfo from 'src/components/organisms/Campaign/RelatedNftInfo';

export default (props) => {
  const { campaign, setIsSoul } = props;

  const { createQuester, updateQuester } = API;

  const { t } = useTranslation('campaign_details');

  const storage = new BrowserPersistence();

  const userState = useSelector((state) => state.user);
  const add = userState.wallet_address ? userState.wallet_address : null;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tasks = {};
  let taskTotal = 0;

  const localQuesterKey = `${add}_${campaign.id}_quester_id`;
  const localSubmittedTasksKey = `${add}_${campaign.id}_submitted_tasks`;
  const localTwSocialLinkKey = `${add}_twSocialLinked`;
  const twSocialLinkedTtl = 24 * 60 * 60; // 1days

  let submittedTasks = storage.getItem(localSubmittedTasksKey);
  console.log('submittedTasks:', submittedTasks);

  // Add connect wallet task
  tasks.ck_connect_wallet = {
    id: ++taskTotal,
    status: add ? true : false
  };

  // Add twitter login task
  if (campaign.twitter_tweet || campaign.twitter_username) {
    const twSocialLinked = storage.getItem(localTwSocialLinkKey);
    tasks.ck_twitter_login = {
      id: ++taskTotal,
      status: twSocialLinked ? true : null,
      uid: twSocialLinked ? twSocialLinked.uid : null,
      screen_name: twSocialLinked ? twSocialLinked.username : null,
      msg: null
    };
  }

  // Add twitter follow task
  if (campaign.twitter_username) {
    tasks.ck_twitter_follow = {
      id: ++taskTotal,
      username: campaign.twitter_username,
      owner_id: '',
      status:
        submittedTasks && submittedTasks.ck_twitter_follow !== undefined
          ? submittedTasks.ck_twitter_follow
          : null,
      msg: null
    };
  }

  // Add twitter retweet task
  if (campaign.twitter_tweet) {
    if (!campaign.twitter_tweet_id) {
      let tweetUrl = campaign.twitter_tweet;
      if (campaign.twitter_tweet.indexOf('?') > -1) {
        tweetUrl = campaign.twitter_tweet.split('?')[0];
      }
      const tweetId = tweetUrl.split('/').pop();
      campaign.twitter_tweet_id = tweetId;
    }
    tasks.ck_twitter_retweet = {
      id: ++taskTotal,
      tweet_url: campaign.twitter_tweet,
      tweet_id: campaign.twitter_tweet_id,
      status:
        submittedTasks && submittedTasks.ck_twitter_retweet !== undefined
          ? submittedTasks.ck_twitter_retweet
          : null,
      msg: null
    };
  }

  // Add nft ownership task
  if (campaign.nft_collection_ids.length) {
    const nftCollectionInfo = (
      <RelatedNftInfo
        nftCollections={campaign.nft_collection_ids}
        showCollectionLink={true}
        showChainName={true}
      />
    );
    tasks.ck_nft_ownership = {
      id: ++taskTotal,
      nftCollectionInfo,
      status:
        submittedTasks && submittedTasks.ck_nft_ownership !== undefined
          ? submittedTasks.ck_nft_ownership
          : null,
      msg: null
    };
  }

  const isFinishedTasks = useCallback(() => {
    let rs = true;
    const keys = Object.keys(tasks);
    if (keys.length) {
      for (let i = 0; i < keys.length; i++) {
        if (tasks[keys[i]] && !tasks[keys[i]].status) {
          rs = false;
          break;
        }
      }
    }

    return rs;
  }, [tasks]);

  const handleUpdateSubmittedTasks = useCallback(
    async (key, value) => {
      let submittedTasks = storage.getItem(localSubmittedTasksKey);
      if (submittedTasks === undefined) {
        submittedTasks = {};
      }
      submittedTasks[key] = value;
      storage.setItem(localSubmittedTasksKey, submittedTasks);

      // Saving quester
      const questerId = storage.getItem(localQuesterKey);
      await saveQuester({
        variables: {
          id: questerId !== undefined ? parseInt(questerId) : null,
          campaign_id: campaign.id,
          tasks: JSON.stringify(submittedTasks),
          status: 'pending'
        }
      });
    },
    [localSubmittedTasksKey]
  );

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
  };

  const handleVerifyNftOwnership = useCallback(async () => {
    const isCampaignOwner =
      useState.id && useState.id === campaign.user_created.id ? true : false;
    let isNFTOwnership = isCampaignOwner ? true : false;
    const nftCollections = campaign.nft_collection_ids;
    const accountAdd = userState.wallet_address
      ? userState.wallet_address
      : null;
    if (accountAdd && accountAdd.includes('0x') && nftCollections.length) {
      for (let i = 0; i < nftCollections.length; i++) {
        const nftCollection = nftCollections[i].nft_collection_id;
        const chainName = nftCollection.chain_name;
        const contractAdd = nftCollection.contract_address;
        if (contractAdd && contractAdd.toLowerCase() !== 'n/a') {
          isNFTOwnership = await verifyNFTOwnership(
            chainName,
            contractAdd,
            accountAdd
          );
          if (isNFTOwnership) break;
        }
      }
    }

    return isNFTOwnership;
  }, [campaign, userState]);

  const questerId = storage.getItem(localQuesterKey);
  const [
    saveQuester,
    {
      data: saveQuestResult,
      error: saveQuesterError,
      loading: saveQuesterLoading
    }
  ] = useMutation(questerId ? updateQuester : createQuester, {
    fetchPolicy: 'no-cache'
  });

  const handleSubmit = useCallback(
    async (props) => {
      try {
        const { status = 'pending', quester_id, submitted_tasks } = props;

        // All require tasks done
        await saveQuester({
          variables: {
            id: quester_id !== undefined ? parseInt(quester_id) : null,
            campaign_id: campaign.id,
            tasks: JSON.stringify(submitted_tasks),
            status
          }
        });
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error(error);
        }
        return;
      }
    },
    [campaign, saveQuester]
  );

  // Handle saving quest result
  useEffect(() => {
    if (saveQuestResult) {
      console.log('saveQuestResult:', saveQuestResult);

      const questerId = saveQuestResult.create_quester_item
        ? saveQuestResult.create_quester_item.id
        : saveQuestResult.update_quester_item
        ? saveQuestResult.update_quester_item.id
        : null;

      const status = saveQuestResult.create_quester_item
        ? saveQuestResult.create_quester_item.status
        : saveQuestResult.update_quester_item
        ? saveQuestResult.update_quester_item.status
        : null;

      if (questerId) {
        storage.setItem(localQuesterKey, questerId);
        if (status === 'approved') {
          setIsSoul(true);
          return toast.success(t('Submitted.'));
        }
      }
    }
    if (saveQuesterError) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(saveQuesterError);
      }
      return toast.error(t('Something went wrong. Please try again!'));
    }
  }, [saveQuestResult, saveQuesterError, t]);

  return {
    localQuesterKey,
    localSubmittedTasksKey,
    localTwSocialLinkKey,
    twSocialLinkedTtl,
    userState,
    tasks,
    isFinishedTasks,
    handleUpdateSubmittedTasks,
    handleSubmit,
    handleVerifyNftOwnership,
    saveQuesterLoading,
    saveQuestResult
  };
};
