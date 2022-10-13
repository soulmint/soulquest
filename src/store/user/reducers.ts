import { UserAction, UserActionType, UserState } from './types';
import BrowserPersistence from '../../utils/simplePersistence';

const storage = new BrowserPersistence();

const userId = storage.getRawItem('user_id');
const accessToken = storage.getRawItem('access_token');
const walletAddress = storage.getRawItem('wallet_address');

const getId = () => {
  if (!userId) {
    return undefined;
  }
  const { value } = JSON.parse(userId);

  return value;
};

const getWalletAddress = () => {
  if (!walletAddress) {
    return undefined;
  }
  const { value } = JSON.parse(walletAddress);

  return value;
};

const getToken = () => {
  if (!accessToken) {
    return undefined;
  }
  const { value } = JSON.parse(accessToken);

  return value;
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
