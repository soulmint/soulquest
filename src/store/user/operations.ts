import { Dispatch } from 'react';
import * as actions from './actions';
import { UserAction } from './types';

export const setId = (dispatch: Dispatch<UserAction>, userId: any) => {
  try {
    dispatch(actions.setId(userId));
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(e);
    }
  }
};

export const setWalletAddress = (dispatch: Dispatch<UserAction>, add: any) => {
  try {
    dispatch(actions.setWalletAddress(add));
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(e);
    }
  }
};

export const setToken = (dispatch: Dispatch<UserAction>, token: any) => {
  try {
    dispatch(actions.setTokenAction(token));
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(e);
    }
  }
};

export const logOut = async (dispatch: Dispatch<UserAction>) => {
  try {
    dispatch(actions.logOut());
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(e);
    }
  }
};
