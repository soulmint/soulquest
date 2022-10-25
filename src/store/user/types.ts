import { Dispatch } from 'react';

export type UserState = {
  id?: any;
  token?: any;
  wallet_address?: any;
  is_whitelisted?: boolean;
  souls_up?: boolean;
};

export const UserActionType = {
  setId: 'setId',
  setToken: 'setToken',
  setWalletAddress: 'setWalletAddress',
  setSoulsUp: 'setSoulsUp',
  setIsWhitelisted: 'setIsWhitelisted',
  logOut: 'logOut'
};

export type UserActionType = typeof UserActionType[keyof typeof UserActionType];

export type UserAction = { type: UserActionType; payload?: any };

declare module 'react-redux' {
  interface DefaultRootState {
    user: UserState;
  }
  export function useDispatch<TDispatch = Dispatch<UserAction>>(): TDispatch;
}
