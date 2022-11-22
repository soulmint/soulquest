import React, { FunctionComponent, Fragment } from 'react';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import { useDispatch } from 'react-redux';
import { setWalletAddress } from 'src/store/user/operations';
import { getCsrfToken, signIn } from 'next-auth/react';
import { ethers } from 'ethers';
import { ellipsify } from '../../../../utils/strUtils';
import { useTranslation } from 'next-i18next';
import providerOptions from './providers';
import { Modal } from './../Modal';
import DropDownMenu from './../DropdownMenu';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

export type ConnectWalletProps = {
  name?: string;
  classes?: {
    root_highPriority?: any;
  };
  beforeIcon: any;
  afterIcon: any;
};

const ConnectWallet: FunctionComponent<ConnectWalletProps> = (
  props: ConnectWalletProps
) => {
  const dispatch = useDispatch();

  const { t } = useTranslation('common');

  const userState = useSelector((state) => state.user);

  const connectWallet = async () => {
    try {
      const web3Modal = new Web3Modal({
        network: 'mainnet', // optional
        cacheProvider: false,
        providerOptions
        // theme: 'dark'
      });

      const provider = await web3Modal.connect();
      provider.enable();
      const web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();

      const pp = new ethers.providers.Web3Provider(provider);

      if (!accounts || accounts.length === 0) {
        throw new Error('No account');
      }

      /*const chainId = await web3.eth.getChainId();
      console.log(chainId);*/

      const signer = pp.getSigner();
      /* let balance = await signer.getBalance();
      const balanceText = ethers.utils.formatEther(balance);*/

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

      //set user's wallet address
      setWalletAddress(dispatch, accounts[0]);
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(e);
        toast.error(e);
      } else {
        toast.warning(t('Something went wrong. Please try again later!'));
      }
    }
  };

  const child = userState.wallet_address ? (
    <div>
      <DropDownMenu
        name={ellipsify({
          str: userState.wallet_address,
          start: 4,
          end: 4
        })}
      />
    </div>
  ) : (
    <Modal connectWallet={connectWallet} {...props} />
  );

  return <Fragment>{child}</Fragment>;
};

export default ConnectWallet;
