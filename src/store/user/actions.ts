import { UserActionType } from './types';
import { signOut } from 'next-auth/react';
import BrowserPersistence from 'src/utils/simplePersistence';

const storage = new BrowserPersistence();

//Note: ttl equals ttl of the access_token from backend (directus)
const ttl = process.env.JWT_ACCESS_TOKEN_TTL
  ? parseInt(process.env.JWT_ACCESS_TOKEN_TTL)
  : 15 * 60 * 60;

export const setTokenAction = (token: any) => {
  //saving to local for init state
  storage.setItem('access_token', token, ttl);

  return {
    type: UserActionType.setToken,
    payload: token
  };
};

export const setIdAction = (userId: any) => {
  //saving to local for init state
  storage.setItem('user_id', userId, ttl);

  return {
    type: UserActionType.setId,
    payload: userId
  };
};

export const setWalletAddressAction = (add: any) => {
  //saving to local for init state
  storage.setItem('wallet_address', add, ttl);

  return {
    type: UserActionType.setWalletAddress,
    payload: add
  };
};

export const setSoulsUpAction = (value: boolean) => {
  //saving to local for init state
  storage.setItem('souls_up', value, ttl);

  return {
    type: UserActionType.setSoulsUp,
    payload: value
  };
};

export const setIsWhitelistedAction = (value: boolean) => {
  //saving to local for init state
  storage.setItem('is_whitelisted', value, ttl);

  return {
    type: UserActionType.setIsWhitelisted,
    payload: value
  };
};

export const setIsAptosWalletAction = (value: boolean) => {
  //saving to local for init state
  storage.setItem('is_aptos_wallet', value, ttl);

  return {
    type: UserActionType.setIsAptosWallet,
    payload: value
  };
};

export const logOut = () => {
  //clean related local storage vars
  storage.removeItem('user_id');
  storage.removeItem('access_token');
  storage.removeItem('wallet_address');
  storage.removeItem('souls_up');
  storage.removeItem('is_whitelisted');
  storage.removeItem('is_aptos_wallet');

  // next-auth > logout
  signOut().then();

  return {
    type: UserActionType.logOut,
    payload: ''
  };
};
