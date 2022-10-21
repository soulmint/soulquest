import { UserAction, UserActionType, UserState } from './types';
import BrowserPersistence from '../../utils/simplePersistence';

const storage = new BrowserPersistence();

const getId = () => {
  const userId = storage.getItem('user_id');
  return userId;
};

const getWalletAddress = () => {
  const walletAddress = storage.getItem('wallet_address');
  return walletAddress;
};

const getToken = () => {
  const accessToken = storage.getItem('access_token');
  return accessToken;
};

const getSoulsUp = () => {
  const soulsUp = storage.getItem('souls_up');
  return soulsUp ? soulsUp : false;
};

export const initialState: UserState = {
  id: getId(),
  token: getToken(),
  wallet_address: getWalletAddress(),
  souls_up: getSoulsUp()
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
    case UserActionType.setSoulsUp:
      return {
        ...state,
        souls_up: action.payload
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
