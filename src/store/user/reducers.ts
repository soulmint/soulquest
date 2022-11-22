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

const getIsWhitelisted = () => {
  return storage.getItem('is_whitelisted');
};

const getIsAptosWallet = () => {
  const rs = storage.getItem('is_aptos_wallet');
  return rs ? rs : false;
};

export const initialState: UserState = {
  id: getId(),
  token: getToken(),
  wallet_address: getWalletAddress(),
  is_aptos_wallet: getIsAptosWallet(),
  souls_up: getSoulsUp(),
  is_whitelisted: getIsWhitelisted()
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
    case UserActionType.setIsWhitelisted:
      return {
        ...state,
        is_whitelisted: action.payload
      };
    case UserActionType.setIsAptosWallet:
      return {
        ...state,
        is_aptos_wallet: action.payload
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
