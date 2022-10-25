import React, { Fragment, useEffect, useState } from 'react';
import { shape, string } from 'prop-types';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Moment from 'moment';
import { toast } from 'react-toastify';
import defaultClasses from './quest.module.css';
import { useStyle } from 'src/components/classify';
import Button from 'src/components/atoms/Button';
import TextLink from 'src/components/atoms/TextLink';
import BrowserPersistence from 'src/utils/simplePersistence';
import {
  FaWallet,
  FaTwitter,
  FaUserPlus,
  FaRetweet,
  FaCheck,
  FaAngleRight,
  FaLink
} from 'react-icons/fa';

import {
  TwitterLogin,
  getTwitterUserIdByUsermame,
  // getReTweets,
  getFollowLookup,
  getTweetLookup /* , */
  // getFollow
} from 'src/hooks/Campaign/Rewards/useTwitter';
import ConnectWallet from 'src/components/organisms/User/ConnectWallet';
import { TaskFailIcon } from 'src/components/organisms/Svg/SvgIcons';
import {
  base64URLDecode,
  base64URLEncode,
  ellipsify,
  validURL
} from 'src/utils/strUtils';
import {
  checkExistsSocialLink,
  saveSocialLink
} from 'src/hooks/User/useSocial';
import { isQuesterExists } from 'src/hooks/Campaign/Rewards/api.gql';
import Cookies from 'js-cookie';
import ReactTooltip from 'react-tooltip';
import { useQuest } from 'src/hooks/Campaign/Rewards';

const Quest = (props) => {
  const { classes: propClasses, campaign } = props;

  const classes = useStyle(defaultClasses, propClasses);

  const router = useRouter();
  const { t } = useTranslation('campaign_details');
  const storage = new BrowserPersistence();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let twSocialLinked = null;

  const endDate = Moment(campaign.date_end);
  const now = Moment();
  const isEnded = now > endDate ? true : false;

  const {
    localQuesterIdKey,
    localQuesterTasksKey,
    localTwSocialLinkKey,
    twSocialLinkedTtl,
    userState,
    tasks,
    isFinishedTasks,
    isSoul,
    setIsSoul,
    handleUpdateSubmittedTasks,
    handleSubmit,
    handleVerifyNftOwnership
  } = useQuest({
    campaign
  });

  const add = userState.wallet_address ? userState.wallet_address : null;
  const campaignId = campaign.id;

  const [twitterLoginState, setTwitterLoginState] = useState(
    tasks.ck_twitter_login ? tasks.ck_twitter_login.status : null
  );
  const [twitterFollowState, setTwitterFollowState] = useState(
    tasks.ck_twitter_follow ? tasks.ck_twitter_follow.status : null
  );
  const [twitterReTweetState, setTwitterReTweetState] = useState(
    tasks.ck_twitter_retweet ? tasks.ck_twitter_retweet.status : null
  );
  const [nftOwnershipState, setNftOwnershipState] = useState(
    tasks.ck_nft_ownership ? tasks.ck_nft_ownership.status : null
  );
  const [powSubmitUrlState, setPOWSubmitUrlState] = useState(
    tasks.ck_pow_submit_url ? tasks.ck_pow_submit_url.status : null
  );

  useEffect(async () => {
    if (add && !isSoul) {
      // Check current User has do tasks
      const quester = await isQuesterExists(
        { _eq: campaignId },
        { email: { _eq: userState.wallet_address } }
      );
      if (quester) {
        storage.setItem(localQuesterIdKey, quester.id);

        const submittedTasks = quester.tasks ? JSON.parse(quester.tasks) : {};
        storage.setItem(localQuesterTasksKey, submittedTasks);

        //update task status
        const taskKeys = Object.keys(submittedTasks);
        taskKeys.map((key) => {
          if (tasks[key]) {
            tasks[key].status = submittedTasks[key];
          }
        });

        if (quester.status === 'approved') {
          setIsSoul(true);
        }
      }
    }
  }, [router.isReady, add, twitterLoginState]);

  useEffect(async () => {
    if (add && !isSoul) {
      tasks.ck_connect_wallet.status = true;

      // After twitter login case
      twSocialLinked = storage.getItem(localTwSocialLinkKey);
      if (router.query.user) {
        const { user } = router.query;
        const UserDecode = JSON.parse(base64URLDecode(user));
        const { id, username, tw_token } = UserDecode;
        const uid = id;
        if (tw_token) {
          Cookies.set('tw_token', tw_token, {
            expires: 30,
            path: '/',
            sameSite: 'lax'
          });
        }
        if (twSocialLinked === undefined && uid) {
          //add new
          twSocialLinked = await saveSocialLink({
            name: 'twitter',
            username,
            uid
          });
          if (twSocialLinked) {
            //saving to local storage for other contexts
            storage.setItem(
              localTwSocialLinkKey,
              twSocialLinked,
              twSocialLinkedTtl
            );
          }
          // Refresh page - coming soon
          //router.push('/campaign-details/' + router.query.slug[0]);
        }
      } else {
        twSocialLinked = storage.getItem(localTwSocialLinkKey);
        if (twSocialLinked === undefined) {
          // check exits social link from off chain DB
          const twSocialLinked = await checkExistsSocialLink(
            { _eq: 'twitter' },
            { email: { _eq: userState.wallet_address } }
          );
          if (twSocialLinked) {
            storage.setItem(
              localTwSocialLinkKey,
              twSocialLinked,
              twSocialLinkedTtl
            );
          }
        }
      }

      //if has tw social linked
      if (twSocialLinked) {
        //check twitter login
        const tw_token = Cookies.get('tw_token');
        if (tasks.ck_twitter_login && tw_token) {
          tasks.ck_twitter_login.status = true;
          tasks.ck_twitter_login.uid = twSocialLinked.uid;
          tasks.ck_twitter_login.screen_name = twSocialLinked.username;

          // update submitted tasks to local storage
          await handleUpdateSubmittedTasks('ck_twitter_login', true);

          setTwitterLoginState(true);
        }
        // check twitter userid
        if (tasks.ck_twitter_follow && !tasks.ck_twitter_follow.owner_id) {
          let tw_owner_id = storage.getItem(
            base64URLEncode(tasks.ck_twitter_follow.username)
          );
          if (!tw_owner_id) {
            tw_owner_id = await getTwitterUserIdByUsermame({
              screen_name: tasks.ck_twitter_follow.username
            });
            storage.setItem(
              base64URLEncode(tasks.ck_twitter_follow.username),
              tw_owner_id
            );
          }
          tasks.ck_twitter_follow.owner_id = tw_owner_id;
        }
      }
    }
  }, [router.isReady]);

  let walletConnect = userState.wallet_address ? (
    <span className="flex items-center flex-row text-sm font-bold text-slate-500">
      {ellipsify({
        str: userState.wallet_address,
        start: 4,
        end: 4
      })}
    </span>
  ) : (
    <ConnectWallet
      classes={{ root_highPriority: classes.btnConnectWallet }}
      afterIcon={<FaAngleRight className="text-lg ml-1" />}
    />
  );

  const getConnectWalletStatus = () => {
    let rs = null;
    if (userState.wallet_address) {
      // If has specific whitelist
      if (
        campaign.whitelist_spreadsheet_id &&
        campaign.whitelist_sheet_id &&
        !userState.is_whitelisted
      ) {
        //has not whitelist case

        rs = (
          <div className={`${classes.questItemIcon} bg-red-300 text-slate-800`}>
            <span className={classes.statusWithTip}>
              <span data-tip data-for="whitelistError">
                {TaskFailIcon}
              </span>
              <ReactTooltip
                id="whitelistError"
                type="error"
                className={classes.errorTip}
                backgroundColor={'#dc2626'}
              >
                <span>{t('You have not whitelisted yet.')}</span>
              </ReactTooltip>
            </span>
          </div>
        );
      } else {
        rs = (
          <div
            className={`${classes.questItemIcon} bg-green-300 text-slate-800`}
          >
            <FaCheck />
          </div>
        );
      }
    } else {
      rs = (
        <div className={`${classes.questItemIcon} bg-violet-600 text-white`}>
          <FaWallet />
        </div>
      );
    }

    return rs;
  };
  const connectWalletStatus = getConnectWalletStatus();

  const getConnectWalletTitle = () => {
    let rs = null;
    const titleClasses = [classes.taskIndex];
    if (userState.wallet_address) {
      if (
        campaign.whitelist_spreadsheet_id &&
        campaign.whitelist_sheet_id &&
        !userState.is_whitelisted
      ) {
        titleClasses.push(classes.taskError);
      } else {
        titleClasses.push(classes.taskSuccess);
      }
    }
    rs = (
      <div>
        <span className={titleClasses.join(' ')}>
          {t('Task')} {tasks.ck_connect_wallet.id}
        </span>
        {t('Connect Wallet')}
      </div>
    );

    return rs;
  };
  const connectWalletTitle = getConnectWalletTitle();
  let connectWalletTaskClasses = [classes.questItem, classes.connectWalletTask];
  connectWalletTaskClasses.push(isEnded ? classes.disabled : null);
  const connectWalletTask = (
    <div className={connectWalletTaskClasses.join(' ')}>
      {connectWalletStatus}
      <div className="flex items-center justify-between flex-1">
        {connectWalletTitle}
        {walletConnect}
      </div>
    </div>
  );
  let twitterLoginTask = null;
  if (tasks.ck_twitter_login) {
    const twitterLoginStatus = !tasks.ck_twitter_login.status ? (
      <>
        <Button
          id={`btn-twitter-login`}
          priority="high"
          classes={{ root_highPriority: classes.btnTwitterLogin }}
          type="button"
          onPress={() => handleTwitterLogin()}
        />
        <span className="flex items-center flex-row text-sm font-bold text-slate-500 ml-auto group-hover:text-slate-600 transition-color duration-300">
          {t('Login')}&nbsp;
          <FaAngleRight className="text-lg" />
        </span>
      </>
    ) : (
      <span className={`ml-auto text-sky-600`}>
        @{tasks.ck_twitter_login.screen_name}
      </span>
    );

    const twitterLoginIconStatus = tasks.ck_twitter_login.status ? (
      <div className={`${classes.questItemIcon} bg-green-300 text-slate-800`}>
        <FaCheck />
      </div>
    ) : (
      <div className={`${classes.questItemIcon} bg-cyan-400 text-white`}>
        <FaTwitter />
      </div>
    );

    const twLoginTaskClasses = [classes.questItem, classes.twitterLoginTask];
    twLoginTaskClasses.push(isEnded ? classes.disabled : null);
    twitterLoginTask = (
      <div className={`${twLoginTaskClasses.join(' ')} relative group`}>
        {twitterLoginIconStatus}
        <div className="flex items-center flex-1">
          <div className="flex-1">
            <span
              className={`${classes.taskIndex} ${
                tasks.ck_twitter_login.status ? classes.taskSuccess : ''
              }`}
            >
              Task {tasks.ck_twitter_login.id}
            </span>
            {t('Login Twitter')}
          </div>
        </div>
        {twitterLoginStatus}
      </div>
    );
  }
  const handleTwitterLogin = async () => {
    if (userState.wallet_address == undefined) {
      return toast.warning(
        t('You must connect your wallet before do this task!')
      );
    }
    await TwitterLogin({ reference_url: router.asPath });
  };

  let twFollowTask = null;
  if (tasks.ck_twitter_follow) {
    const btnVerifyTwitterFollow = !tasks.ck_twitter_follow.status ? (
      <Button
        id={`btn-verify-twitter-follow`}
        priority="high"
        classes={{ root_highPriority: classes.btnVerifyTwitter }}
        type="button"
        onPress={() => handleCheckTwitterFollow()}
      />
    ) : null;
    const twFollowStatus = (
      <span className="flex items-center flex-row text-sm font-bold text-slate-400 ml-auto">
        <span className={`ml-auto`}>
          {tasks.ck_twitter_follow.status === true
            ? t('Verified')
            : tasks.ck_twitter_follow.status === false
            ? TaskFailIcon
            : ''}
        </span>
        {!tasks.ck_twitter_follow.status ? (
          <span className="flex items-center flex-row text-sm font-bold text-slate-500 group-hover:text-slate-600 transition-color duration-300">
            {t('Verify')}&nbsp;
            <FaAngleRight className="text-lg" />
          </span>
        ) : null}
      </span>
    );
    const twFollowIconLeft = (
      <div
        className={`${classes.questItemIcon} ${
          tasks.ck_twitter_follow.status
            ? 'bg-green-300 text-slate-800'
            : 'bg-cyan-400 text-white'
        }`}
      >
        {tasks.ck_twitter_follow.status ? <FaCheck /> : <FaUserPlus />}
      </div>
    );
    let twFollowTaskClasses = [classes.questItem, classes.twFollowTask];
    twFollowTaskClasses.push(
      twitterFollowState === 'loading' ? classes.taskLoading : null
    );
    if (isEnded) {
      twFollowTaskClasses.push(classes.disabled);
    }
    twFollowTask = (
      <div
        className={`${twFollowTaskClasses.join(' ')} ${
          classes.twitterFollowTask
        } relative group`}
      >
        {twFollowIconLeft}
        <div className="z-20">
          <span
            className={`${classes.taskIndex} ${
              tasks.ck_twitter_follow.status ? classes.taskSuccess : ''
            }`}
          >
            {t('Task')} {tasks.ck_twitter_follow.id}
          </span>
          {t('Follow')}&nbsp;
          <TextLink
            target="_blank"
            title={t('Go to this Twitter channel.')}
            href={`https://twitter.com/${tasks.ck_twitter_follow.username}`}
            className="border-b border-dotted hover:border-solid border-b-sky-500 hover:border-b-sky-600 text-sky-500 font-semibold"
          >
            @{tasks.ck_twitter_follow.username}
          </TextLink>
          &nbsp;
          {t('on Twitter')}
        </div>
        {twFollowStatus}
        {btnVerifyTwitterFollow}
      </div>
    );
  }
  const handleCheckTwitterFollow = async () => {
    if (userState.wallet_address === undefined) {
      return toast.warning(
        t('You must connect your wallet before do this task!')
      );
    }
    if (!tasks.ck_twitter_login.uid) {
      return toast.warning(t('You must login Twitter before do this task!'));
    }

    if (!tasks.ck_twitter_follow.owner_id) {
      tasks.ck_twitter_follow.owner_id = storage.getItem(
        base64URLEncode(tasks.ck_twitter_follow.username)
      );
    }
    setTwitterFollowState('loading');

    // checking twitter follow here...
    const tw_follower_status = await getFollowLookup({
      user_id: tasks.ck_twitter_login.uid,
      owner_id: tasks.ck_twitter_follow.owner_id
    });
    if (tw_follower_status) {
      tasks.ck_twitter_follow.status = true;
      //trigger to re-render
      setTwitterFollowState(tasks.ck_twitter_follow.status);
    } else {
      tasks.ck_twitter_follow.status = false;
      //trigger to re-render
      setTwitterFollowState(tasks.ck_twitter_follow.status);
      toast.error(
        t('You have not completed this task yet.  Please try again later!')
      );
    }

    // update submitted tasks to local storage
    await handleUpdateSubmittedTasks(
      'ck_twitter_follow',
      tasks.ck_twitter_follow.status
    );
  };

  let twReTweetTask = null;
  if (tasks.ck_twitter_retweet) {
    const btnVerifyTwitterReTweet = !tasks.ck_twitter_retweet.status ? (
      <Button
        id={`btn-verify-twitter-re-tweet`}
        priority="high"
        classes={{ root_highPriority: classes.btnVerifyTwitter }}
        type="button"
        onPress={() => handleCheckTwitterReTweet()}
      />
    ) : null;
    const twReTweetStatus = (
      <span className="flex items-center flex-row text-sm font-bold text-slate-400 ml-auto">
        <span className={`flex items-center ml-auto`}>
          {tasks.ck_twitter_retweet.status === true
            ? t('Verified')
            : tasks.ck_twitter_retweet.status === false
            ? TaskFailIcon
            : ''}
          {!tasks.ck_twitter_retweet.status ? (
            <span className="flex items-center flex-row text-sm font-bold text-slate-500 ml-2 group-hover:text-slate-600 transition-color duration-300">
              {t('Verify')}&nbsp;
              <FaAngleRight className="text-lg" />
            </span>
          ) : null}
        </span>
      </span>
    );
    const twReTweetIconLeft = tasks.ck_twitter_retweet ? (
      <div
        className={`${classes.questItemIcon} ${
          tasks.ck_twitter_retweet.status
            ? 'bg-green-300 text-slate-800'
            : 'bg-cyan-400 text-white'
        }`}
      >
        {tasks.ck_twitter_retweet.status ? <FaCheck /> : <FaRetweet />}
      </div>
    ) : null;
    let twReTeetTaskClasses = [classes.questItem, classes.twitterRetweetTask];
    twReTeetTaskClasses.push(
      twitterReTweetState === 'loading' ? classes.taskLoading : null
    );
    if (isEnded) {
      twReTeetTaskClasses.push(classes.disabled);
    }
    twReTweetTask = (
      <div className={`${twReTeetTaskClasses.join(' ')} relative group`}>
        {twReTweetIconLeft}
        <div className="z-20">
          <span
            className={`${classes.taskIndex} ${
              tasks.ck_twitter_retweet.status ? classes.taskSuccess : ''
            }`}
          >
            {t('Task')} {tasks.ck_twitter_retweet.id}
          </span>
          {t('Retweet')}&nbsp;
          <TextLink
            target="_blank"
            title={t('Open this tweet.')}
            href={`${tasks.ck_twitter_retweet.tweet_url}`}
            className="border-b border-dotted hover:border-solid border-b-sky-500 hover:border-b-sky-600 text-sky-500 font-semibold"
          >
            {t('this tweet')}
          </TextLink>
        </div>
        {twReTweetStatus}
        {btnVerifyTwitterReTweet}
      </div>
    );
  }
  const handleCheckTwitterReTweet = async () => {
    if (userState.wallet_address === undefined) {
      return toast.warning(
        t('You must connect your wallet before do this task!')
      );
    }

    if (!tasks.ck_twitter_login.uid) {
      return toast.warning(t('You must login twitter before do this task!'));
    }

    if (!tasks.ck_twitter_retweet.tweet_id) {
      return toast.warning(t('Invalid tweet id!'));
    }
    setTwitterReTweetState('loading');

    twSocialLinked = storage.getItem(localTwSocialLinkKey);
    const tw_tweet_status = await getTweetLookup({
      user_id: twSocialLinked.uid,
      tweet_id: tasks.ck_twitter_retweet.tweet_id
    });
    if (tw_tweet_status) {
      tasks.ck_twitter_retweet.status = true;
      //trigger to re-render
      setTwitterReTweetState(tasks.ck_twitter_retweet.status);
    } else {
      tasks.ck_twitter_retweet.status = false;
      //trigger to re-render
      setTwitterReTweetState(tasks.ck_twitter_retweet.status);
      toast.error(
        t('You have not completed this task yet. Please try again later!')
      );
    }

    // update submitted tasks to local storage
    await handleUpdateSubmittedTasks(
      'ck_twitter_retweet',
      tasks.ck_twitter_retweet.status
    );
  };

  let nftOwnershipTask = null;
  if (tasks.ck_nft_ownership) {
    const btnVerifyNftOwnership = !tasks.ck_nft_ownership.status ? (
      <Button
        id={`btn-verify-nft-ownership`}
        priority="high"
        classes={{ root_highPriority: classes.btnVerifyTwitter }}
        type="button"
        onPress={() => handleCheckNftOwnership()}
      />
    ) : null;
    const nftOwnershipStatus = (
      <span className="flex items-center flex-row text-sm font-bold text-slate-400 ml-auto">
        <span className={`ml-auto`}>
          {tasks.ck_nft_ownership.status === true ? (
            t('Verified')
          ) : tasks.ck_nft_ownership.status === false ? (
            <span className={classes.statusWithTip}>
              <span data-tip data-for="nftOwnerShipError">
                {TaskFailIcon}
              </span>
              <ReactTooltip
                id="nftOwnerShipError"
                type="error"
                className={classes.errorTip}
                backgroundColor={'#dc2626'}
              >
                <span>{tasks.ck_nft_ownership.msg}</span>
              </ReactTooltip>
            </span>
          ) : (
            ''
          )}
          {!tasks.ck_nft_ownership.status ? (
            <span className="flex items-center flex-row text-sm font-bold text-slate-500 group-hover:text-slate-600 transition-color duration-300">
              {t('Verify')}&nbsp;
              <FaAngleRight className="text-lg" />
            </span>
          ) : null}
        </span>
      </span>
    );
    let nftTaskClasses = [classes.soulBoundTokenTask];
    nftTaskClasses.push(
      nftOwnershipState === 'loading' ? classes.taskLoading : null
    );
    if (isEnded) {
      nftTaskClasses.push(classes.disabled);
    }
    const nftOwnershipIconStatus = tasks.ck_nft_ownership.status ? (
      <div
        className={`relative ${classes.questItemIcon} bg-green-300 text-slate-800`}
      >
        <FaCheck />
      </div>
    ) : (
      <div
        className={`relative ${classes.questItemIcon} bg-slate-700 text-white`}
      >
        <span className={`${classes.nftOwnership}`}>
          <img src="/icons/nft.svg" alt="NFT" />
        </span>
      </div>
    );
    nftOwnershipTask = (
      <div className={`${classes.questItem} ${nftTaskClasses.join(' ')}`}>
        {nftOwnershipIconStatus}
        <div className="z-20">
          <div className="relative">
            <span
              className={`${classes.taskIndex} ${
                tasks.ck_nft_ownership.status ? classes.taskSuccess : ''
              }`}
            >
              {t('Task')} {tasks.ck_nft_ownership.id}
            </span>
            <div className="flex items-center">
              <h4 className="my-0 ml-1">{t('Holder')}:</h4>
              {tasks.ck_nft_ownership.nftCollectionInfo}
            </div>
          </div>
        </div>
        {nftOwnershipStatus}
        {btnVerifyNftOwnership}
      </div>
    );
  }
  const handleCheckNftOwnership = async () => {
    if (userState.wallet_address === undefined) {
      return toast.warning(
        t('You must connect your wallet before do this task!')
      );
    }

    setNftOwnershipState('loading');

    // submit to verify NFT ownership
    const status = await handleVerifyNftOwnership();

    // update state
    tasks.ck_nft_ownership.status = status;

    //trigger to re-render
    setNftOwnershipState(tasks.ck_nft_ownership.status);
    if (!tasks.ck_nft_ownership.status) {
      const msg = t('You are not owner of any SoulBound Token!');
      tasks.ck_nft_ownership.msg = msg;
      toast.error(msg);
    } else {
      tasks.ck_nft_ownership.msg = null;
    }

    // update submitted tasks to local storage
    await handleUpdateSubmittedTasks(
      'ck_nft_ownership',
      tasks.ck_nft_ownership.status
    );
  };

  let powSubmitUrlTask = null;
  if (tasks.ck_pow_submit_url) {
    const powSubmitUrlStatus = (
      <span className="flex items-center flex-row text-sm font-bold text-slate-400 ml-auto">
        <span className={`flex items-center ml-auto`}>
          {tasks.ck_pow_submit_url.status
            ? t('Under review')
            : tasks.ck_pow_submit_url.status === false
            ? TaskFailIcon
            : ''}
        </span>
      </span>
    );
    const powSubmitUrlIconLeft = tasks.ck_pow_submit_url ? (
      <div
        className={`${classes.questItemIcon} ${
          tasks.ck_pow_submit_url.status
            ? 'bg-green-300 text-slate-800'
            : 'bg-cyan-400 text-white'
        }`}
      >
        {tasks.ck_pow_submit_url.status ? <FaCheck /> : <FaLink />}
      </div>
    ) : null;
    let powSubmitUrlTaskClasses = [classes.questItem, classes.powSubmitUrlTask];
    powSubmitUrlTaskClasses.push(
      twitterReTweetState === 'loading' ? classes.taskLoading : null
    );
    if (isEnded) {
      powSubmitUrlTaskClasses.push(classes.disabled);
    }
    powSubmitUrlTask = (
      <div className={`${powSubmitUrlTaskClasses.join(' ')} relative group`}>
        {powSubmitUrlIconLeft}
        <div className="flex-1 z-20">
          <span
            className={`${classes.taskIndex} ${
              tasks.ck_pow_submit_url.status ? classes.taskSuccess : ''
            }`}
          >
            {t('Task')} {tasks.ck_pow_submit_url.id}
          </span>
          <div className="flex flex-wrap flex-col md:flex-row md:items-center">
            <span className={`${classes.taskTitle} mr-2`}>
              {t('Proof-of-Work URL')}:
            </span>
            <input
              autoComplete="off"
              className={classes.powSubmitUrlInput}
              type="text"
              id="pow_submit_url"
              name="pow_submit_url"
              onBlur={() => handleCheckPOWSubmitUrl('pow_submit_url')}
              placeholder={tasks.ck_pow_submit_url.note}
            />
          </div>
          <span className={`${classes.taskTip}`}>
            {tasks.ck_pow_submit_url.note}
          </span>
        </div>
        {powSubmitUrlStatus}
      </div>
    );
  }

  const handleCheckPOWSubmitUrl = async (inputId) => {
    if (userState.wallet_address === undefined) {
      return toast.warning(
        t('You must connect your wallet before do this task!')
      );
    }

    setPOWSubmitUrlState('loading');

    const powSubmitUrl = document.getElementById(inputId);

    const status = validURL(powSubmitUrl.value);

    // update state
    tasks.ck_pow_submit_url.status = status;

    //trigger to re-render
    setNftOwnershipState(tasks.ck_pow_submit_url.status);

    // update submitted tasks to local storage
    await handleUpdateSubmittedTasks(
      'ck_pow_submit_url',
      status ? powSubmitUrl.value : false
    );

    if (!tasks.ck_pow_submit_url.status) {
      toast.error(t('Invalid Proof-of-Work URL'));
    }
  };

  const checkCanSubmit = () => {
    let rs = false;
    if (userState.wallet_address) {
      // if has specific whitelist
      if (campaign.whitelist_spreadsheet_id && campaign.whitelist_sheet_id) {
        if (
          userState.is_whitelisted &&
          !isEnded &&
          isFinishedTasks() &&
          !isSoul
        ) {
          rs = true;
        }
      } else {
        if (!isEnded && !isSoul && isFinishedTasks()) {
          rs = true;
        }
      }
    }

    return rs;
  };
  const canSubmit = checkCanSubmit();
  const btnClaimReward = (
    <div className={`${classes.btnClaimRewardWrap}`}>
      <Button
        id={`btn-claim-reward`}
        priority="high"
        classes={{
          root_highPriority: canSubmit
            ? classes.btnClaimReward
            : !isSoul
            ? classes.btnClaimRewardDisabled
            : classes.btnClaimRewardSubmitted
        }}
        type="button"
        onPress={
          canSubmit
            ? () =>
                handleSubmit({
                  status: 'approved',
                  quester_id: storage.getItem(localQuesterIdKey),
                  submitted_tasks: storage.getItem(localQuesterTasksKey)
                })
            : null
        }
      >
        {!isSoul
          ? !isEnded
            ? t('Submit')
            : t('This quest has ended.')
          : t('Submission Completed.')}
      </Button>
    </div>
  );

  const child = Object.keys(tasks).length ? (
    <Fragment>
      <div className="card-header md:flex items-center md:justify-between">
        <h3 className="">{t('Require tasks')}</h3>
        <p className="text-sm text-slate-600 font-normal mt-0 mb-0">
          {t('Complete all task below to be eligible.')}
        </p>
      </div>

      <div className="card-body">
        {connectWalletTask}
        {twitterLoginTask}
        {twFollowTask}
        {twReTweetTask}
        {nftOwnershipTask}
        {powSubmitUrlTask}
        {btnClaimReward}
      </div>
    </Fragment>
  ) : null;

  return <div className={`card ${classes.root}`}>{child}</div>;
};

Quest.propTypes = {
  classes: shape({
    root: string
  }),
  campaign: shape({
    id: string
  })
};

export default Quest;
