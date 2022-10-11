import { Dispatch } from 'react';
import Web3 from 'web3';

export type WalletsState = {
  walletInfo?: {
    provider?: any;
    web3?: Web3;
    account?: string;
  };
};

export const WalletsActionType = {
  connectWallet: 'connectWallet'
};

export type WalletsActionType =
  typeof WalletsActionType[keyof typeof WalletsActionType];
export type WalletsAction = { type: WalletsActionType; payload?: any };

declare module 'react-redux' {
  interface DefaultRootState {
    wallets: WalletsState;
  }
  export function useDispatch<TDispatch = Dispatch<WalletsAction>>(): TDispatch;
}
