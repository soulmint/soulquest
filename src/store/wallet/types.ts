import { Dispatch } from 'react';
import Web3 from 'web3';

export type WalletState = {
  info?: {
    provider?: any;
    web3?: Web3;
    address?: string;
  };
};

export const WalletActionType = {
  connectWallet: 'connectWallet'
};

export type WalletActionType =
  typeof WalletActionType[keyof typeof WalletActionType];

export type WalletAction = { type: WalletActionType; payload?: any };

declare module 'react-redux' {
  interface DefaultRootState {
    wallets: WalletState;
  }
  export function useDispatch<TDispatch = Dispatch<WalletAction>>(): TDispatch;
}
