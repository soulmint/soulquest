import { Dispatch } from 'react';
import Web3 from 'web3';
import * as actions from './actions';
import { WalletAction } from './types';

export const connectWallet = (
  dispatch: Dispatch<WalletAction>,
  provider: any,
  web3: Web3,
  address: string
) => {
  dispatch(actions.connectWalletAction(provider, web3, address));
};
