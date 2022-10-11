import Web3 from 'web3';
import { WalletsActionType } from './wallets.types';

// common
export const connectWalletAction = (
  provider: any,
  web3: Web3,
  account: string
) => {
  return {
    type: WalletsActionType.connectWallet,
    payload: {
      provider,
      web3,
      account
    }
  };
};
