import React, { Fragment, useEffect, useState } from 'react';
import { shape, string } from 'prop-types';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
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
  FaAngleRight
} from 'react-icons/fa';

import {
  TwitterLogin,
  // getTwitterUserIdByUsermame,
  getTweetsStatus,
  TwitterFollow
} from 'src/hooks/Campaign/Rewards/useTwitter';
import ConnectWallet from 'src/components/organisms/User/ConnectWallet';
import { TaskFailIcon } from 'src/components/organisms/Svg/SvgIcons';
import {
  base64URLDecode,
  base64URLEncode,
  ellipsify
} from 'src/utils/strUtils';
import {
  checkExistsSocialLink,
  saveSocialLink
} from 'src/hooks/User/useSocial';
import { isQuesterExists } from 'src/hooks/Campaign/Rewards/api.gql';
import Cookies from 'js-cookie';
import { useQuest } from 'src/hooks/Campaign/Rewards';

const Quest = (props) => {
  const { classes: propClasses, campaign } = props;

  const classes = useStyle(defaultClasses, propClasses);

  const router = useRouter();
  const { t } = useTranslation('campaign_details');
  const storage = new BrowserPersistence();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let twSocialLinked = null;
  const [isSoul, setIsSoul] = useState(false);
  const [hasSubmit, setHasSubmit] = useState(false);

  const {
    localQuesterKey,
    localSubmittedTasksKey,
    localTwSocialLinkKey,
    twSocialLinkedTtl,
    userState,
    tasks,
    isFinishedTasks,
    handleUpdateSubmittedTasks,
    handleSubmit,
    handleVerifyNftOwnership
  } = useQuest({
    campaign,
    setIsSoul
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

  useEffect(async () => {
    if (add) {
      tasks.ck_connect_wallet.status = true;
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
      if (twSocialLinked && tasks.ck_twitter_login) {
        console.log('twSocialLinked:', twSocialLinked);
        tasks.ck_twitter_login.status = true;
        tasks.ck_twitter_login.uid = twSocialLinked.uid;
        tasks.ck_twitter_login.screen_name = twSocialLinked.username;
        setTwitterLoginState(true);

        //update submitted tasks
        handleUpdateSubmittedTasks('ck_twitter_login', true);
        //log to db
        await handleSubmit({
          status: 'pending',
          quester_id: storage.getItem(localQuesterKey),
          submitted_tasks: storage.getItem(localSubmittedTasksKey)
        });
      }
    }
  }, [router.isReady, add]);

  useEffect(async () => {
    if (add) {
      // Check current User has do tasks
      const quester = await isQuesterExists(
        { _eq: campaignId },
        { email: { _eq: userState.wallet_address } }
      );
      if (quester) {
        console.log('quester: ', quester);

        storage.setItem(localQuesterKey, quester.id);

        const submittedTasks = quester.tasks ? JSON.parse(quester.tasks) : {};
        storage.setItem(localSubmittedTasksKey, submittedTasks);

        //update task status
        const taskKeys = Object.keys(submittedTasks);
        taskKeys.map((key) => {
          if (tasks[key]) {
            tasks[key].status = submittedTasks[key];
          }
        });

        if (quester.status === 'approved') {
          setIsSoul(true);
        } else {
          setHasSubmit(true);
        }
      }
    }
  }, [router.isReady, add, twitterLoginState]);

  useEffect(async () => {
    if (add && twSocialLinked === undefined && router.query.user) {
      const { user } = router.query;
      const UserDecode = JSON.parse(base64URLDecode(user));
      const { id, username, access_token } = UserDecode;
      const uid = id;
      if (access_token) {
        Cookies.set('tw_access_token', access_token, {
          expires: 24,
          path: '/',
          sameSite: 'lax'
        });
      }
      if (uid) {
        //add new
        twSocialLinked = await saveSocialLink({
          name: 'twitter',
          username,
          uid
        });
        if (twSocialLinked) {
          //update submitted tasks
          handleUpdateSubmittedTasks('ck_twitter_login', true);
          //log to db
          await handleSubmit({
            status: 'pending',
            quester_id: storage.getItem(localQuesterKey),
            submitted_tasks: storage.getItem(localSubmittedTasksKey)
          });

          tasks.ck_twitter_login.status = true;
          tasks.ck_twitter_login.uid = twSocialLinked.uid
            ? twSocialLinked.uid
            : null;
          tasks.ck_twitter_login.screen_name = twSocialLinked.username
            ? twSocialLinked.username
            : null;

          //saving to local storage for other contexts
          storage.setItem(
            localTwSocialLinkKey,
            twSocialLinked,
            twSocialLinkedTtl
          );

          setTwitterLoginState(true);

          // Refresh page - coming soon
          //router.push('/campaign-details/' + router.query.slug[0]);
        }
      }
    }
  }, [router.isReady]);

  let walletConnect = userState.wallet_address ? (
    <span className="flex items-center flex-row text-base font-medium text-gray-500">
      {ellipsify({
        str: userState.wallet_address,
        start: 4,
        end: 4
      })}
    </span>
  ) : (
    <ConnectWallet classes={{ root_highPriority: classes.btnConnectWallet }} />
  );

  const connectWalletStatus = userState.wallet_address ? (
    <div className={`${classes.questItemIcon} bg-green-600 text-white`}>
      <FaCheck />
    </div>
  ) : (
    <div className={`${classes.questItemIcon} bg-violet-600 text-white`}>
      <FaWallet />
    </div>
  );

  const connectWalletTask = (
    <div className={`${classes.questItem} ${classes.connectWalletTask}`}>
      {connectWalletStatus}

      <div className="flex items-center justify-between flex-1">
        <div className="">
          <span
            className={`${classes.taskIndex} ${
              userState.wallet_address ? classes.taskSuccess : ''
            }`}
          >
            {t('Task')} {tasks.ck_connect_wallet.id}
          </span>
          {t('Connect Wallet')}
        </div>

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
        <span className="flex items-center flex-row text-sm font-bold text-slate-400 ml-auto group-hover:text-slate-600 transition-color duration-300">
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
      <div className={`${classes.questItemIcon} bg-green-600 text-white`}>
        <FaCheck />
      </div>
    ) : (
      <div className={`${classes.questItemIcon} bg-cyan-400 text-white`}>
        <FaTwitter />
      </div>
    );

    twitterLoginTask = (
      <div
        className={`${classes.questItem} ${classes.twitterLoginTask} relative group`}
      >
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
        <span className={`ml-auto mr-2`}>
          {tasks.ck_twitter_follow.status === true
            ? t('Verified')
            : tasks.ck_twitter_follow.status === false
            ? TaskFailIcon
            : ''}
        </span>
        {!tasks.ck_twitter_follow.status ? (
          <span className="flex items-center flex-row text-sm font-bold text-slate-400 group-hover:text-slate-600 transition-color duration-300">
            {t('Verify')}&nbsp;
            <FaAngleRight className="text-lg" />
          </span>
        ) : null}
      </span>
    );
    const twFollowIconLeft = (
      <div className={`${classes.questItemIcon} bg-green-600 text-white`}>
        {tasks.ck_twitter_follow.status ? <FaCheck /> : <FaUserPlus />}
      </div>
    );
    let twFollowTaskClasses = [classes.questItem, classes.twFollowTask];
    twFollowTaskClasses.push(
      twitterFollowState === 'loading' ? classes.taskLoading : null
    );
    twFollowTask = (
      <div className={`${twFollowTaskClasses.join(' ')} relative group`}>
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

    setTwitterFollowState('loading');

    // checking twitter follow here...
    const tw_follower_status = await TwitterFollow({
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

    //update submitted tasks
    await handleUpdateSubmittedTasks(
      'ck_twitter_follow',
      tasks.ck_twitter_follow.status
    );

    //log to db
    await handleSubmit({
      status: 'pending',
      quester_id: storage.getItem(localQuesterKey),
      submitted_tasks: storage.getItem(localSubmittedTasksKey)
    });
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
        <span className={`ml-auto mr-2`}>
          {tasks.ck_twitter_retweet.status === true
            ? t('Verified')
            : tasks.ck_twitter_retweet.status === false
            ? TaskFailIcon
            : ''}
          {!tasks.ck_twitter_retweet.status ? (
            <span className="flex items-center flex-row text-sm font-bold text-slate-400 group-hover:text-slate-600 transition-color duration-300">
              {t('Verify')}&nbsp;
              <FaAngleRight className="text-lg" />
            </span>
          ) : null}
        </span>
      </span>
    );
    const twReTweetIconLeft = (
      <div className={`${classes.questItemIcon} bg-green-600 text-white`}>
        {tasks.ck_twitter_retweet.status ? <FaCheck /> : <FaRetweet />}
      </div>
    );
    let twReTeetTaskClasses = [classes.questItem, classes.twitterRetweetTask];
    twReTeetTaskClasses.push(
      twitterReTweetState === 'loading' ? classes.taskLoading : null
    );
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
          {t('Must')}&nbsp;{t('Retweet')}&nbsp;
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

    setTwitterReTweetState('loading');

    twSocialLinked = storage.getItem(localTwSocialLinkKey);
    const tw_tweet_status = await getTweetsStatus({
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

    //update submitted tasks
    handleUpdateSubmittedTasks(
      'ck_twitter_retweet',
      tasks.ck_twitter_retweet.status
    );

    //log to db
    await handleSubmit({
      status: 'pending',
      quester_id: storage.getItem(localQuesterKey),
      submitted_tasks: storage.getItem(localSubmittedTasksKey)
    });
  };

  const verifyNftOwnershipBtn =
    tasks.ck_nft_ownership && !tasks.ck_nft_ownership.status ? (
      <Button
        id={`btn-verify-nft-ownership`}
        priority="high"
        classes={{ root_highPriority: classes.btnVerifyTwitter }}
        type="button"
        onPress={() => handleCheckNftOwnership()}
      />
    ) : null;
  const nftOwnershipStatus = (
    <span className={`ml-auto mr-2`}>
      {tasks.ck_nft_ownership && tasks.ck_nft_ownership.status === true
        ? t('Verified')
        : tasks.ck_nft_ownership && tasks.ck_nft_ownership.status === false
        ? TaskFailIcon
        : ''}
    </span>
  );
  let nftTaskClasses = [classes.soulBoundTokenTask];
  nftTaskClasses.push(
    nftOwnershipState === 'loading' ? classes.taskLoading : null
  );

  const nftOwnershipIconStatus =
    tasks.ck_nft_ownership && tasks.ck_nft_ownership.status ? (
      <div
        className={`relative ${classes.questItemIcon} bg-green-600 text-white`}
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
  const nftOwnershipTask = tasks.ck_nft_ownership ? (
    <div className={`${classes.questItem} ${nftTaskClasses.join(' ')}`}>
      {nftOwnershipIconStatus}
      <div className="flex-1">
        <div className="relative">
          <span
            className={`${classes.taskIndex} ${
              tasks.ck_nft_ownership.status ? classes.taskSuccess : ''
            }`}
          >
            {t('Task')} {tasks.ck_nft_ownership.id}
          </span>
          <h4 className="mt-0 mb-0">{t('Must hold:')}</h4>
          {tasks.ck_nft_ownership.nftCollectionInfo}
        </div>
      </div>

      <div className="">
        {verifyNftOwnershipBtn}
        <span className="flex items-center flex-row text-sm font-bold text-slate-400 transition-color duration-300">
          {nftOwnershipStatus}
          {t('Verify')}&nbsp;
          <FaAngleRight className="text-lg" />
        </span>
      </div>
    </div>
  ) : null;
  const handleCheckNftOwnership = async () => {
    if (userState.wallet_address === undefined) {
      return toast.warning(
        t('You must connect your wallet before do this task!')
      );
    }

    setNftOwnershipState('loading');

    // submit to verify NFT ownership
    const status = await handleVerifyNftOwnership();
    console.log('ckOwnership Result:', status);

    // update state
    tasks.ck_nft_ownership.status = status;

    //trigger to re-render
    setNftOwnershipState(tasks.ck_nft_ownership.status);
    if (!tasks.ck_nft_ownership.status) {
      toast.error(t('You are not owner of any SoulBound Token!'));
    }

    //update submitted tasks
    handleUpdateSubmittedTasks(
      'ck_nft_ownership',
      tasks.ck_nft_ownership.status
    );

    //log to db
    await handleSubmit({
      status: 'pending',
      quester_id: storage.getItem(localQuesterKey),
      submitted_tasks: storage.getItem(localSubmittedTasksKey)
    });
  };

  const canSubmit =
    userState.wallet_address && isFinishedTasks() && !isSoul ? true : false;
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
                  quester_id: storage.getItem(localQuesterKey),
                  submitted_tasks: storage.getItem(localSubmittedTasksKey)
                })
            : null
        }
      >
        {!isSoul ? t('Submit') : t('Submission Completed.')}
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
