import { Dispatch } from 'react';

export type UserState = {
  info?: {
    email?: string;
    name?: string;
    wallet_address?: string;
  };
  token: any;
};

export const UserActionType = {
  setToken: 'setToken',
  setInfo: 'setInfo',
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
