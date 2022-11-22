import React, { Fragment, useEffect, useState } from 'react';
// import { signIn } from 'next-auth/react';
import Button from 'src/components/atoms/Button';
import { useEscapeKey } from 'src/hooks/useEscapeKey';
import { FaWallet } from 'react-icons/fa';
import { useWallet } from '@manahippo/aptos-wallet-adapter';
import { setWalletAddress, setIsAptosWallet } from 'src/store/user/operations';
import { useDispatch } from 'react-redux';
import { signIn } from 'next-auth/react';

const Modal = (props: any) => {
  const { classes, beforeIcon, afterIcon, connectWallet } = props;

  const [modalOpened, setModalOpened] = useState(false);

  useEffect(() => {
    if (modalOpened) {
      document
        .getElementsByTagName('header')[0]
        .classList.add('disable-backdrop-filter');
    } else {
      document
        .getElementsByTagName('header')[0]
        .classList.remove('disable-backdrop-filter');
    }
  }, [modalOpened]);

  const escEvent = () => {
    setModalOpened(false);
  };
  useEscapeKey(escEvent);

  const dispatch = useDispatch();

  const handleConnectWallet = () => {
    setModalOpened(false);
    connectWallet();
  };

  const {
    connect: connectAptosWallet,
    disconnect: disconnectAptosWallet,
    account,
    wallets,
    connecting,
    connected,
    disconnecting,
    wallet: currentWallet
    // signAndSubmitTransaction,
    // signMessage
  } = useWallet();
  const renderAptosWalletConnectors = () => {
    return wallets.map((wallet) => {
      const option = wallet.adapter;
      return (
        <div key={option.name} className={`mr-2 mt-2 inline-block`}>
          <Button onPress={() => connectAptos(option.name)}>
            <span
              className={`mr-2`}
              title={`Connect with ${option.name} wallet`}
            >
              <img width={`16px`} height={`16px`} src={option.icon} />
            </span>
            <span
              className={`ml-4`}
              title={`Connect with ${option.name} wallet`}
            >
              {currentWallet &&
              currentWallet.adapter.name === option.name &&
              connecting
                ? 'connecting...'
                : `${option.name} wallet`}
            </span>
          </Button>
        </div>
      );
    });
  };
  const connectAptos = async (walletName: any) => {
    try {
      setModalOpened(false);
      await connectAptosWallet(walletName);
    } catch (e) {
      console.error(e);
    }
  };
  const disconnectAptos = async () => {
    try {
      await disconnectAptosWallet();
    } catch (e) {
      console.error(e);
    }
  };
  /*const aptosIcon = (
    <span className={``}>
      <img src="/icons/aptos.png" width={`32px`} alt="aptos" />
    </span>
  );*/
  const nextAuthSignIn = async (add: string) => {
    await signIn('credentials', {
      isAptosWallet: true,
      redirect: false,
      address: add
    });
  };
  useEffect(() => {
    if (connected && account) {
      const add = account?.address?.toString();
      if (add) {
        nextAuthSignIn(add).then();
        //set user's wallet address
        setWalletAddress(dispatch, add);
        setIsAptosWallet(dispatch, true);
      }
    }
  }, [connected]);

  let aptosChild;
  if (connected && account) {
    aptosChild = (
      <Fragment>
        <div className="">
          <strong>CurrentWallet:</strong>
          {currentWallet?.adapter?.name}
        </div>
        <div>
          <strong>Address:</strong>
          {account?.address?.toString()}
        </div>
        <Button onPress={() => disconnectAptos()}>
          {disconnecting ? 'disconnecting...' : 'Disconnect'}
        </Button>
      </Fragment>
    );
  } else {
    aptosChild = <div>{renderAptosWalletConnectors()}</div>;
  }

  // const googleSigner = async () => {
  //   await signIn('google');
  // };
  // const twitterSigner = async () => {
  //   await signIn('twitter');
  // };
  // const gitSigner = async () => {
  //   await signIn('github');
  // };
  // const facebookSigner = async () => {
  //   await signIn('facebook');
  // };

  return (
    <Fragment>
      <Button
        onPress={() => setModalOpened(true)}
        priority="high"
        type="button"
        data-modal-toggle="crypto-modal"
        classes={
          classes && classes.root_highPriority
            ? { root_highPriority: classes.root_highPriority }
            : null
        }
      >
        {beforeIcon}
        <span>Connect wallet</span>
        {afterIcon}
      </Button>

      {modalOpened && (
        <div
          id="crypto-modal"
          tabIndex={-1}
          className="bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-90 backdrop-blur-sm overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full justify-center items-center flex"
          aria-modal="true"
          onClick={() => setModalOpened(false)}
          role="dialog"
        >
          <div className="modal-mark" />
          <div
            className="relative p-4 w-full max-w-md h-full md:h-auto"
            onClick={(e) => {
              // do not close modal if anything inside modal content is clicked
              e.stopPropagation();
            }}
          >
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button
                onClick={() => setModalOpened(false)}
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                data-modal-toggle="crypto-modal"
              >
                Close
                <span className="sr-only">Close modal</span>
              </button>
              <div className="py-4 px-6 rounded-t border-b dark:border-gray-600">
                <h3 className="text-base font-semibold text-gray-900 lg:text-xl dark:text-white my-0">
                  Connect wallet
                </h3>
              </div>
              <div className="p-6">
                <p className="text-sm font-normal text-gray-500 dark:text-gray-400 m-0">
                  Connect with one of our available wallet providers
                  {/* or create a
                  new one*/}
                  .
                </p>
                <ul className="my-4 space-y-3 list-none m-0 p-0">
                  {/*<li>
                    <a
                      onClick={() => googleSigner()}
                      href="#"
                      className="bg-gray-50 dark:bg-gray-600 border border-gray-300 hover:bg-white hover:border-violet-600 shadow hover:shadow-md flex items-center p-3 text-base font-bold text-gray-900 rounded-lg hover:bg-gray-100 group dark:hover:bg-gray-500 dark:text-white"
                    >
                      <span className="w-6">
                        <img
                          src="https://d11gciwieyoy00.cloudfront.net/images/icons/google.svg"
                          alt="Google"
                        />
                      </span>
                      <span className="flex-1 ml-3 whitespace-nowrap">
                        Sign-in with Google
                      </span>
                    </a>
                  </li>*/}
                  {/*<li>
                    <a
                      onClick={() => twitterSigner()}
                      href="#"
                      className="bg-gray-50 dark:bg-gray-600 border border-gray-300 hover:bg-white hover:border-violet-600 shadow hover:shadow-md flex items-center p-3 text-base font-bold text-gray-900 rounded-lg hover:bg-gray-100 group dark:hover:bg-gray-500 dark:text-white"
                    >
                      <span className="w-6">
                        <img src="/social/twitter.svg" alt="Twitter" />
                      </span>
                      <span className="flex-1 ml-3 whitespace-nowrap">
                        Sign-in with Twitter
                      </span>
                    </a>
                  </li>*/}
                  {/* <li>
                    <a
                      onClick={() => facebookSigner()}
                      href="#"
                      className="bg-gray-50 dark:bg-gray-600 border border-gray-300 hover:bg-white hover:border-violet-600 shadow hover:shadow-md flex items-center p-3 text-base font-bold text-gray-900 rounded-lg hover:bg-gray-100 group dark:hover:bg-gray-500 dark:text-white"
                    >
                      <span className="w-6">
                        <img
                          src="https://d11gciwieyoy00.cloudfront.net/images/icons/google.svg"
                          alt="Google"
                        />
                      </span>
                      <span className="flex-1 ml-3 whitespace-nowrap">
                        Sign-in with Facebook
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => gitSigner()}
                      href="#"
                      className="bg-gray-50 dark:bg-gray-600 border border-gray-300 hover:bg-white hover:border-violet-600 shadow hover:shadow-md flex items-center p-3 text-base font-bold text-gray-900 rounded-lg hover:bg-gray-100 group dark:hover:bg-gray-500 dark:text-white"
                    >
                      <span className="w-6">
                        <img
                          src="https://d11gciwieyoy00.cloudfront.net/images/icons/google.svg"
                          alt="Google"
                        />
                      </span>
                      <span className="flex-1 ml-3 whitespace-nowrap">
                        Sign-in with Github
                      </span>
                    </a>
                  </li> */}
                  {/*<li className="text-center my-0 py-0">Or</li>*/}
                  <li>
                    <a
                      onClick={handleConnectWallet}
                      href="#"
                      className="bg-gray-50 dark:bg-gray-600 border border-gray-300 hover:border-violet-600 shadow flex items-center p-3 text-base font-bold text-gray-900 rounded-lg hover:bg-gray-100 group hover:shadow-md dark:hover:bg-gray-500 dark:text-white"
                    >
                      <span className={`w-10`}>
                        <FaWallet />
                      </span>
                      <span className="flex-1 ml-1 whitespace-nowrap">
                        WalletConnect
                      </span>
                      <span className="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">
                        Popular
                      </span>
                    </a>
                  </li>
                  <li className="text-center my-0 py-0">- Or -</li>
                  <li>{aptosChild}</li>
                </ul>
                <div>
                  <a
                    href="#"
                    className="inline-flex items-center text-xs font-normal text-gray-500 hover:underline dark:text-gray-400"
                  >
                    Why do I need to connect with my wallet?
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};
export default Modal;
