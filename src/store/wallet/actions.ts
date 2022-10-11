import Web3 from 'web3';
import { WalletActionType } from './types';

// common
export const connectWalletAction = (
  provider: any,
  web3: Web3,
  address: string
) => {
  return {
    type: WalletActionType.connectWallet,
    payload: {
      provider,
      web3,
      address
    }
  };
};
