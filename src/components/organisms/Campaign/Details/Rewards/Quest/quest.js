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
  twLogin,
  // getReTweets,
  getTweetLookup,
  getTwUserIdByUsername,
  isFollowing
} from 'src/hooks/Campaign/Rewards/useTwitter';
import ConnectWallet from 'src/components/organisms/User/ConnectWallet';
import { StatusIcon } from 'src/components/organisms/Svg/SvgIcons';
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
  const [powUrlState, setPOWSubmitUrlState] = useState(
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
      }

      // get twitter user id by username
      if (tasks.ck_twitter_follow && !tasks.ck_twitter_follow.owner_id) {
        const twOwnerIdKey = base64URLEncode(tasks.ck_twitter_follow.username);
        let twOwnerId = storage.getItem(twOwnerIdKey);
        if (!twOwnerId) {
          twOwnerId = await getTwUserIdByUsername({
            username: tasks.ck_twitter_follow.username
          });
          twOwnerId && storage.setItem(twOwnerIdKey, twOwnerId);

          if (!twOwnerId) toast.warning('Invalid Twitter username');
        }
        tasks.ck_twitter_follow.owner_id = twOwnerId;
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
  const connectWalletStatus = () => {
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
          <div className={`${classes.questItemIcon} text-slate-800`}>
            <span data-tip data-for="whitelistError">
              {StatusIcon(40, 40, '#FCA5A5')}
            </span>
            <ReactTooltip
              id="whitelistError"
              type="error"
              backgroundColor={'#dc2626'}
            >
              <span>{t('You have not whitelisted yet.')}</span>
            </ReactTooltip>
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
  const connectWalletTitle = () => {
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

  let connectWalletTaskClasses = [classes.questItem, classes.connectWalletTask];
  connectWalletTaskClasses.push(isEnded ? classes.disabled : null);
  const connectWalletTask = (
    <div className={connectWalletTaskClasses.join(' ')}>
      {connectWalletStatus()}
      <div className="flex items-center justify-between flex-1">
        {connectWalletTitle()}
        {walletConnect}
      </div>
    </div>
  );

  let twLoginTask = null;
  if (tasks.ck_twitter_login) {
    const twLoginTaskIcon = () => {
      let rs = null;
      if (tasks.ck_twitter_login.status) {
        rs = (
          <div
            className={`${classes.questItemIcon} bg-green-300 text-slate-800`}
          >
            <FaCheck />
          </div>
        );
      } else if (tasks.ck_twitter_login.status === false) {
        rs = (
          <div className={`${classes.questItemIcon} text-slate-800`}>
            <span data-tip data-for="twLoginError" className={`z-40`}>
              {StatusIcon(40, 40, '#FCA5A5')}
            </span>
            <ReactTooltip
              id="twLoginError"
              type="error"
              backgroundColor={'#dc2626'}
            >
              <span>
                {t('You have not done a twitter login successfully yet!')}
              </span>
            </ReactTooltip>
          </div>
        );
      } else {
        rs = (
          <div className={`${classes.questItemIcon} bg-cyan-400 text-white`}>
            <FaTwitter />
          </div>
        );
      }

      return rs;
    };
    const twLoginTaskTitle = () => {
      const titleClasses = [classes.taskIndex];
      if (tasks.ck_twitter_login.status) {
        titleClasses.push(classes.taskSuccess);
      } else if (tasks.ck_twitter_login.status === false) {
        titleClasses.push(classes.taskError);
      }

      return (
        <div className="flex items-center flex-1">
          <div className="flex-1">
            <span className={titleClasses.join(' ')}>
              Task {tasks.ck_twitter_login.id}
            </span>
            {t('Login Twitter')}
          </div>
        </div>
      );
    };
    const twLoginTaskContent = () => {
      return !tasks.ck_twitter_login.status ||
        !tasks.ck_twitter_login.screen_name ? (
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
    };
    const handleTwitterLogin = async () => {
      if (userState.wallet_address == undefined) {
        return toast.warning(
          t('You must connect your wallet before do this task!')
        );
      }

      // update submitted tasks to local storage
      await handleUpdateSubmittedTasks('ck_twitter_login', false);

      // status will update after login process success
      await twLogin({ reference_url: router.asPath });
    };

    const twLoginTaskClasses = [classes.questItem, classes.twitterLoginTask];
    twLoginTaskClasses.push(isEnded ? classes.disabled : null);
    twLoginTask = (
      <div className={`${twLoginTaskClasses.join(' ')} relative group`}>
        {twLoginTaskIcon()}
        {twLoginTaskTitle()}
        {twLoginTaskContent()}
      </div>
    );
  }

  let twFollowTask = null;
  if (tasks.ck_twitter_follow) {
    const twFollowAction = () => {
      return (
        <span className="flex items-center flex-row text-sm font-bold text-slate-400 ml-auto">
          {!tasks.ck_twitter_follow.status ? (
            <span>
              <Button
                id={`btn-verify-twitter-follow`}
                priority="high"
                classes={{ root_highPriority: classes.btnVerify }}
                type="button"
                onPress={() => handleCheckTwitterFollow()}
              />
              <span className="flex items-center flex-row text-sm font-bold text-slate-500 group-hover:text-slate-600 transition-color duration-300">
                {t('Verify')}&nbsp;
                <FaAngleRight className="text-lg" />
              </span>
            </span>
          ) : (
            <span className={`flex items-center ml-auto`}>{t('Verified')}</span>
          )}
        </span>
      );
    };
    const twFollowTaskIcon = () => {
      let rs = null;
      if (tasks.ck_twitter_follow.status) {
        rs = (
          <div
            className={`${classes.questItemIcon} bg-green-300 text-slate-800`}
          >
            <FaCheck />
          </div>
        );
      } else if (tasks.ck_twitter_follow.status === false) {
        rs = (
          <div className={`${classes.questItemIcon} text-white`}>
            <span data-tip data-for="twFollowError" className={`z-40`}>
              {StatusIcon(40, 40, '#FCA5A5')}
            </span>
            <ReactTooltip
              id="twFollowError"
              type="error"
              backgroundColor={'#dc2626'}
            >
              <span>{tasks.ck_twitter_follow.msg}</span>
            </ReactTooltip>
          </div>
        );
      } else {
        rs = (
          <div className={`${classes.questItemIcon} bg-cyan-400 text-white`}>
            <FaUserPlus />
          </div>
        );
      }

      return rs;
    };
    const twFollowTaskTitle = () => {
      let rs = null;
      const titleClasses = [classes.taskIndex];
      if (tasks.ck_twitter_follow.status) {
        titleClasses.push(classes.taskSuccess);
      } else if (tasks.ck_twitter_follow.status === false) {
        titleClasses.push(classes.taskError);
      }
      rs = (
        <span>
          <span className={titleClasses.join(' ')}>
            {t('Task')} {tasks.ck_twitter_follow.id}
          </span>
        </span>
      );

      return rs;
    };
    const twFollowTaskContent = () => {
      return (
        <span>
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
        </span>
      );
    };
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
      const isFollowed = await isFollowing({
        user_id: tasks.ck_twitter_login.uid,
        owner_id: tasks.ck_twitter_follow.owner_id
      });
      if (isFollowed) {
        tasks.ck_twitter_follow.status = true;
        //trigger to re-render
        setTwitterFollowState(tasks.ck_twitter_follow.status);
      } else {
        tasks.ck_twitter_follow.status = false;
        //trigger to re-render
        setTwitterFollowState(tasks.ck_twitter_follow.status);
        toast.error(
          t('You have not completed this task yet. Please try again later!')
        );
      }

      // update submitted tasks to local storage
      await handleUpdateSubmittedTasks(
        'ck_twitter_follow',
        tasks.ck_twitter_follow.status
      );
    };

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
        {twFollowTaskIcon()}
        <div className="z-20">
          {twFollowTaskTitle()}
          {twFollowTaskContent()}
        </div>
        {twFollowAction()}
      </div>
    );
  }

  let twReTweetTask = null;
  if (tasks.ck_twitter_retweet) {
    const twReTweetTaskIcon = () => {
      let rs = null;
      if (tasks.ck_twitter_retweet.status) {
        rs = (
          <div
            className={`${classes.questItemIcon} bg-green-300 text-slate-800`}
          >
            <FaCheck />
          </div>
        );
      } else if (tasks.ck_twitter_retweet.status === false) {
        rs = (
          <div className={`${classes.questItemIcon} text-white`}>
            <span data-tip data-for="twReTweetError" className={`z-40`}>
              {StatusIcon(40, 40, '#FCA5A5')}
            </span>
            <ReactTooltip
              id="twReTweetError"
              type="error"
              backgroundColor={'#dc2626'}
            >
              <span>{tasks.ck_twitter_retweet.msg}</span>
            </ReactTooltip>
          </div>
        );
      } else {
        rs = (
          <div className={`${classes.questItemIcon} bg-cyan-400 text-white`}>
            <FaRetweet />
          </div>
        );
      }

      return rs;
    };
    const twReTweetTaskTitle = () => {
      let rs = null;
      const titleClasses = [classes.taskIndex];
      if (tasks.ck_twitter_retweet.status) {
        titleClasses.push(classes.taskSuccess);
      } else if (tasks.ck_twitter_retweet.status === false) {
        titleClasses.push(classes.taskError);
      }
      rs = (
        <span>
          <span className={titleClasses.join(' ')}>
            {t('Task')} {tasks.ck_twitter_retweet.id}
          </span>
        </span>
      );

      return rs;
    };
    const twReTweetTaskContent = () => {
      return (
        <span>
          {t('Retweet')}&nbsp;
          <TextLink
            target="_blank"
            title={t('Open this tweet.')}
            href={`${tasks.ck_twitter_retweet.tweet_url}`}
            className="border-b border-dotted hover:border-solid border-b-sky-500 hover:border-b-sky-600 text-sky-500 font-semibold"
          >
            {t('this tweet')}
          </TextLink>
          &nbsp;
          {t('on Twitter')}
        </span>
      );
    };
    const twReTweetAction = () => {
      return (
        <span className="flex items-center flex-row text-sm font-bold text-slate-400 ml-auto">
          {!tasks.ck_twitter_retweet.status ? (
            <span>
              <Button
                id={`btn-verify-twitter-re-tweet`}
                priority="high"
                classes={{ root_highPriority: classes.btnVerify }}
                type="button"
                onPress={() => handleCheckTwitterReTweet()}
              />
              <span className="flex items-center flex-row text-sm font-bold text-slate-500 group-hover:text-slate-600 transition-color duration-300">
                {t('Verify')}&nbsp;
                <FaAngleRight className="text-lg" />
              </span>
            </span>
          ) : (
            <span className={`flex items-center ml-auto`}>{t('Verified')}</span>
          )}
        </span>
      );
    };
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
    let reTweetTaskClasses = [classes.questItem, classes.twitterRetweetTask];
    reTweetTaskClasses.push(
      twitterReTweetState === 'loading' ? classes.taskLoading : null
    );
    if (isEnded) {
      reTweetTaskClasses.push(classes.disabled);
    }
    twReTweetTask = (
      <div className={`${reTweetTaskClasses.join(' ')} relative group`}>
        {twReTweetTaskIcon()}
        <div className="flex-1 z-20">
          {twReTweetTaskTitle()}
          {twReTweetTaskContent()}
        </div>
        {twReTweetAction()}
      </div>
    );
  }

  let nftOwnershipTask = null;
  if (tasks.ck_nft_ownership) {
    const nftOwnershipTaskIcon = () => {
      let rs = null;
      if (tasks.ck_nft_ownership.status) {
        rs = (
          <div
            className={`${classes.questItemIcon} bg-green-300 text-slate-800`}
          >
            <FaCheck />
          </div>
        );
      } else if (tasks.ck_nft_ownership.status === false) {
        rs = (
          <div className={`${classes.questItemIcon} text-white`}>
            <span data-tip data-for="nftOwnershipError" className={`z-40`}>
              {StatusIcon(40, 40, '#FCA5A5')}
            </span>
            <ReactTooltip
              id="nftOwnershipError"
              type="error"
              backgroundColor={'#dc2626'}
            >
              <span>{tasks.ck_nft_ownership.msg}</span>
            </ReactTooltip>
          </div>
        );
      } else {
        rs = (
          <div
            className={`relative ${classes.questItemIcon} bg-slate-700 text-white`}
          >
            <span className={`${classes.nftOwnership}`}>
              <img src="/icons/nft.svg" alt="NFT" />
            </span>
          </div>
        );
      }

      return rs;
    };
    const nftOwnershipTaskTitle = () => {
      let rs = null;
      const titleClasses = [classes.taskIndex];
      if (tasks.ck_nft_ownership.status) {
        titleClasses.push(classes.taskSuccess);
      } else if (tasks.ck_nft_ownership.status === false) {
        titleClasses.push(classes.taskError);
      }
      rs = (
        <span>
          <span className={titleClasses.join(' ')}>
            {t('Task')} {tasks.ck_nft_ownership.id}
          </span>
        </span>
      );

      return rs;
    };
    const nftOwnershipTaskContent = () => {
      return (
        <div className="flex items-center">
          <h4 className="my-0 mr-1">{t('Holder')}:</h4>
          {tasks.ck_nft_ownership.nftCollectionInfo}
        </div>
      );
    };
    const nftOwnershipAction = () => {
      return (
        <span className="flex items-center flex-row text-sm font-bold text-slate-400 ml-auto">
          {!tasks.ck_nft_ownership.status ? (
            <span>
              <Button
                id={`btn-verify-nft-ownership`}
                priority="high"
                classes={{ root_highPriority: classes.btnVerify }}
                type="button"
                onPress={() => handleCheckNftOwnership()}
              />
              <span className="flex items-center flex-row text-sm font-bold text-slate-500 group-hover:text-slate-600 transition-color duration-300">
                {t('Verify')}&nbsp;
                <FaAngleRight className="text-lg" />
              </span>
            </span>
          ) : (
            <span className={`flex items-center ml-auto`}>{t('Verified')}</span>
          )}
        </span>
      );
    };
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

    let nftTaskClasses = [classes.questItem, classes.nftOwnershipTask];
    nftTaskClasses.push(
      nftOwnershipState === 'loading' ? classes.taskLoading : null
    );
    if (isEnded) {
      nftTaskClasses.push(classes.disabled);
    }
    nftOwnershipTask = (
      <div className={`${nftTaskClasses.join(' ')} relative group`}>
        {nftOwnershipTaskIcon()}
        <div className="z-20">
          {nftOwnershipTaskTitle()}
          {nftOwnershipTaskContent()}
        </div>
        {nftOwnershipAction()}
      </div>
    );
  }

  let powUrlTask = null;
  if (tasks.ck_pow_submit_url) {
    const powUrlTaskIcon = () => {
      let rs = null;
      if (tasks.ck_pow_submit_url.status) {
        rs = (
          <div
            className={`${classes.questItemIcon} bg-green-300 text-slate-800`}
          >
            <FaCheck />
          </div>
        );
      } else if (tasks.ck_pow_submit_url.status === false) {
        rs = (
          <div className={`${classes.questItemIcon} text-white`}>
            <span data-tip data-for="powUrlError" className={`z-40`}>
              {StatusIcon(40, 40, '#FCA5A5')}
            </span>
            <ReactTooltip
              id="powUrlError"
              type="error"
              backgroundColor={'#dc2626'}
            >
              <span>{tasks.ck_pow_submit_url.msg}</span>
            </ReactTooltip>
          </div>
        );
      } else {
        rs = (
          <div className={`${classes.questItemIcon} bg-cyan-400 text-white`}>
            <FaLink />
          </div>
        );
      }

      return rs;
    };
    const powUrlTaskTitle = () => {
      let rs = null;
      const titleClasses = [classes.taskIndex];
      if (tasks.ck_pow_submit_url.status) {
        titleClasses.push(classes.taskSuccess);
      } else if (tasks.ck_pow_submit_url.status === false) {
        titleClasses.push(classes.taskError);
      }
      rs = (
        <span>
          <span className={titleClasses.join(' ')}>
            {t('Task')} {tasks.ck_pow_submit_url.id}
          </span>
        </span>
      );

      return rs;
    };
    const powUrlTaskContent = () => {
      return (
        <Fragment>
          <div className="flex flex-wrap flex-col md:flex-row md:items-center">
            <span className={`${classes.taskTitle} mr-2`}>
              {t('Proof-of-Work URL')}:
            </span>
            <input
              autoComplete="off"
              className={classes.powUrlInput}
              type="text"
              id="pow_submit_url"
              name="pow_submit_url"
              defaultValue={
                tasks.ck_pow_submit_url.status
                  ? tasks.ck_pow_submit_url.status
                  : null
              }
              onBlur={() => handleCheckPOWSubmitUrl('pow_submit_url')}
              placeholder={tasks.ck_pow_submit_url.note}
            />
          </div>
          <span className={`${classes.taskTip}`}>
            {tasks.ck_pow_submit_url.note}
          </span>
        </Fragment>
      );
    };
    const powUrlStatus = () => {
      return tasks.ck_pow_submit_url.status ? (
        <span className="flex items-center flex-row text-sm font-bold text-slate-400 ml-auto">
          <span className={`flex items-center ml-auto`}>
            {t('Under review')}
          </span>
        </span>
      ) : null;
    };
    const handleCheckPOWSubmitUrl = async (inputId) => {
      if (userState.wallet_address === undefined) {
        return toast.warning(
          t('You must connect your wallet before do this task!')
        );
      }

      setPOWSubmitUrlState('loading');

      const powUrl = document.getElementById(inputId);

      const status = validURL(powUrl.value);

      // update state
      tasks.ck_pow_submit_url.status = status;

      //trigger to re-render
      setNftOwnershipState(tasks.ck_pow_submit_url.status);

      // update submitted tasks to local storage
      await handleUpdateSubmittedTasks(
        'ck_pow_submit_url',
        status ? powUrl.value : false
      );

      if (!tasks.ck_pow_submit_url.status) {
        toast.error(t('Invalid Proof-of-Work URL!'));
      }
    };

    let powUrlTaskClasses = [classes.questItem, classes.powUrlTask];
    powUrlTaskClasses.push(
      twitterReTweetState === 'loading' ? classes.taskLoading : null
    );
    if (isEnded) {
      powUrlTaskClasses.push(classes.disabled);
    }
    powUrlTask = (
      <div className={`${powUrlTaskClasses.join(' ')} relative group`}>
        {powUrlTaskIcon()}
        <div className="flex-1 z-20">
          {powUrlTaskTitle()}
          {powUrlTaskContent()}
        </div>
        {powUrlStatus()}
      </div>
    );
  }

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
        {twLoginTask}
        {twFollowTask}
        {twReTweetTask}
        {nftOwnershipTask}
        {powUrlTask}
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
