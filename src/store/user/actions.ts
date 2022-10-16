import { UserActionType } from './types';
import { signOut } from 'next-auth/react';
import BrowserPersistence from '../../utils/simplePersistence';

const storage = new BrowserPersistence();

export const setTokenAction = (token: any) => {
  //Note: ttl equals ttl of the access_token from backend (directus)
  const ttl = process.env.JWT_ACCESS_TOKEN_TTL
    ? parseInt(process.env.JWT_ACCESS_TOKEN_TTL)
    : 15 * 60 * 60;
  //saving to local for init state
  storage.setItem('access_token', token, ttl);

  return {
    type: UserActionType.setToken,
    payload: token
  };
};

export const setIdAction = (userId: any) => {
  //saving to local for init state
  storage.setItem('user_id', userId);

  return {
    type: UserActionType.setId,
    payload: userId
  };
};

export const setWalletAddressAction = (add: any) => {
  //saving to local for init state
  storage.setItem('wallet_address', add);

  return {
    type: UserActionType.setWalletAddress,
    payload: add
  };
};

export const logOut = () => {
  //clean related local storage vars
  storage.removeItem('user_id');
  storage.removeItem('access_token');
  storage.removeItem('wallet_address');

  // next-auth > logout
  setTimeout(function () {
    signOut();
  }, 1000);

  return {
    type: UserActionType.logOut,
    payload: ''
  };
};
