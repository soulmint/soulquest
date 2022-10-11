import React, { FunctionComponent, Fragment } from 'react';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import { useDispatch } from 'react-redux';
import { connectWallet } from 'src/ducks/wallets/wallets.operations';
import { useSession, getCsrfToken, signIn } from 'next-auth/react';
import { ethers } from 'ethers';
import { ellipsify } from '../../../../utils/strUtils';
import { useTranslation } from 'next-i18next';
import providerOptions from './providers';
// import { Modal } from './../Modal';
import DropDownMenu from './../DropdownMenu';
import Button from 'src/components/atoms/Button';
import { toast } from 'react-toastify';

export type ConnectWalletProps = {
  name?: string;
};

const ConnectWallet: FunctionComponent<ConnectWalletProps> = () => {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();

  const { t } = useTranslation('common');

  const connect = async () => {
    try {
      const web3Modal = new Web3Modal({
        cacheProvider: false,
        providerOptions,
        theme: 'dark'
      });
      const provider = await web3Modal.connect();
      provider.enable();
      const web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();

      const pp = new ethers.providers.Web3Provider(provider);

      if (!accounts || accounts.length === 0) {
        throw new Error('No account');
      }

      // const chainId = await web3.eth.getChainId();
      // const bscChainId = parseInt(process.env.BSC_CHAIN_ID as string);
      // if (chainId !== bscChainId) {
      //   // TODO: enhance message.
      //   alert('Invalid bsc chain id. Need to switch to bsc testnet');
      //   throw new Error('Invalid bsc chain id. Need to switch to bsc testnet');
      // }

      const signer = pp.getSigner();
      /*signer.getBalance().then(function (rs) {
        console.log(ethers.utils.formatEther(rs));
      });*/

      const callbackUrl = '/';
      const nonce = '0x' + (await getCsrfToken()) || '';
      let signedMessage = `${process.env.CONNECT_WALLET_WELCOME_MSG}\n\nAddress:\n${accounts[0]}\n\nNonce:\n${nonce}`;
      // eslint-disable-next-line prefer-const
      signedMessage = await signer.signMessage(signedMessage);
      await signIn('credentials', {
        message: nonce,
        redirect: false,
        address: accounts[0],
        signedMessage,
        callbackUrl
      });
      connectWallet(dispatch, provider, web3, accounts[0]);
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(e);
      }
      toast.warning(t('You must connect your wallet.'));
    }
  };

  let child = null;
  if (status === 'loading') {
    child = t('Loading...'); //coming soon with Skeleton loading.
  } else {
    child =
      status === 'authenticated' ? (
        <div>
          <DropDownMenu
            name={ellipsify({
              str: session?.user?.name,
              start: 4,
              end: 4
            })}
          />
        </div>
      ) : (
        <>
          {/* <Modal connect={connect} /> */}
          <Button
            onPress={() => connect()}
            priority="high"
            type="button"
            data-modal-toggle="crypto-modal"
          >
            {t('Connect wallet')}
          </Button>
        </>
      );
  }

  return <Fragment>{child}</Fragment>;
};

export default ConnectWallet;
