import { UserActionType } from './types';

export const setInfoAction = (
  email: string,
  name: string,
  wallet_address: string
) => {
  return {
    type: UserActionType.setInfo,
    payload: {
      email,
      name,
      wallet_address
    }
  };
};

export const setTokenAction = (token: any) => {
  return {
    type: UserActionType.setToken,
    payload: {
      token
    }
  };
};

export const logOut = () => {
  return {
    type: UserActionType.logOut,
    payload: {}
  };
};
