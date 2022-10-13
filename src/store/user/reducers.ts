import { UserAction, UserActionType, UserState } from './types';
import BrowserPersistence from '../../utils/simplePersistence';

const storage = new BrowserPersistence();
const userId = storage.getItem('user_id');
const walletAddress = storage.getItem('wallet_address');
const accessToken = storage.getItem('access_token');

const getId = () => {
  if (!userId) {
    return undefined;
  }

  return userId;
};

const getWalletAddress = () => {
  if (!walletAddress) {
    return undefined;
  }

  return walletAddress;
};

const getToken = () => {
  if (!accessToken) {
    return undefined;
  }

  return accessToken;
};

export const initialState: UserState = {
  id: getId(),
  token: getToken(),
  wallet_address: getWalletAddress()
};

const reducer = (
  state: UserState = initialState,
  action: UserAction
): UserState => {
  switch (action.type) {
    case UserActionType.setId:
      return {
        ...state,
        id: action.payload
      };
    case UserActionType.setToken:
      return {
        ...state,
        token: action.payload
      };
    case UserActionType.setWalletAddress:
      return {
        ...state,
        wallet_address: action.payload
      };
    case UserActionType.logOut:
      return {
        ...state
      };
    default:
      return state;
  }
};

export default reducer;
