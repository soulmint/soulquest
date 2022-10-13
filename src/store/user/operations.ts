import { Dispatch } from 'react';
import * as actions from './actions';
import { UserAction } from './types';
import BrowserPersistence from '../../utils/simplePersistence';
import { signOut } from 'next-auth/react';

const storage = new BrowserPersistence();

export const setToken = (dispatch: Dispatch<UserAction>, token: any) => {
  try {
    //Note: ttl equals ttl of the access_token from backend (directus)
    storage.setItem('access_token', token, process.env.JWT_ACCESS_TOKEN_TTL);
    setTimeout(function () {
      dispatch(actions.setTokenAction(token));
    }, 500);
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(e);
    }
  }
};

export const setInfo = (
  dispatch: Dispatch<UserAction>,
  email: string,
  name: string,
  wallet_address: string
) => {
  try {
    const userInfo = {
      email,
      name,
      wallet_address
    };
    //saving to local storage for init state later
    storage.setItem('current_user_info', userInfo);

    setTimeout(function () {
      dispatch(actions.setInfoAction(email, name, wallet_address));
    }, 500);
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(e);
    }
  }
};

export const logOut = async (dispatch: Dispatch<UserAction>) => {
  try {
    //clean related local storage vars
    storage.removeItem('access_token');
    storage.removeItem('current_user_info');
    await signOut();
    dispatch(actions.logOut());
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(e);
    }
  }
};
